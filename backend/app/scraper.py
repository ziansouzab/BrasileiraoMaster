# backend/app/scraper.py
import json
from pathlib import Path

import pandas as pd
import soccerdata as sd

from .config import (
    FBREF_LEAGUES,
    FBREF_SEASONS,
    LEAGUE_SLUG,
    SEASON_SLUG,
    DATA_DIR,
)


def get_fbref_client() -> sd.FBref:
    leagues = [x.strip() for x in FBREF_LEAGUES.split(",")]
    seasons = [x.strip() for x in FBREF_SEASONS.split(",")]

    return sd.FBref(
        leagues=leagues,
        seasons=seasons,
        no_cache=False,
        no_store=False,
    )



def save_df_to_local(df: pd.DataFrame, filename: str) -> Path:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    path = DATA_DIR / filename

    if path.exists():
        path.unlink()  

    df.to_csv(path, index=False)
    return path



def build_league_team_season_stats_df(fbref: sd.FBref) -> pd.DataFrame:
    df = fbref.read_team_season_stats(stat_type="standard")
    return df.reset_index()


def build_league_matches_df(fbref: sd.FBref) -> pd.DataFrame:
    df = fbref.read_schedule()
    return df.reset_index()


def build_league_players_season_stats_df(fbref: sd.FBref) -> pd.DataFrame:
    df = fbref.read_player_season_stats(stat_type="standard")
    return df.reset_index()


def run_scraper() -> dict:
    fbref = get_fbref_client()

    team_stats_df = build_league_team_season_stats_df(fbref)
    matches_df = build_league_matches_df(fbref)
    players_df = build_league_players_season_stats_df(fbref)

    team_stats_path = save_df_to_local(
        team_stats_df,
        f"{LEAGUE_SLUG}_{SEASON_SLUG}_team_stats.csv",
    )
    matches_path = save_df_to_local(
        matches_df,
        f"{LEAGUE_SLUG}_{SEASON_SLUG}_matches.csv",
    )
    players_path = save_df_to_local(
        players_df,
        f"{LEAGUE_SLUG}_{SEASON_SLUG}_players_stats.csv",
    )

    return {
        "message": "CSVs do Brasileirão Série A gerados com sucesso.",
        "files": {
            "team_stats": str(team_stats_path),
            "matches": str(matches_path),
            "players_stats": str(players_path),
        },
    }


if __name__ == "__main__":
    result = run_scraper()
    print(json.dumps(result, indent=2, ensure_ascii=False))

