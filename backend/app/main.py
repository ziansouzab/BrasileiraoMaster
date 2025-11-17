from typing import List, Dict, Any
import urllib.parse

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .scraper import run_scraper
from .services import list_standings, get_team_detail, list_matches

app = FastAPI(
    title="Brasileirão Série A API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/standings", response_model=List[Dict[str, Any]])
def api_get_standings():
    try:
        return list_standings()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="CSVs ainda não foram gerados.")


@app.get("/api/teams/{team_name}/stats", response_model=Dict[str, Any])
def api_get_team_stats(team_name: str):
    decoded_name = urllib.parse.unquote(team_name)
    data = get_team_detail(decoded_name)
    if not data:
        raise HTTPException(status_code=404, detail="Time não encontrado.")
    return data


@app.get("/api/matches", response_model=List[Dict[str, Any]])
def api_get_matches():
    try:
        return list_matches()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="CSVs ainda não foram gerados.")


@app.post("/api/admin/run-scraper")
def api_run_scraper():
    result = run_scraper()
    return result
