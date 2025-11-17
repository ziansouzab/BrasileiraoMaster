import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data" / "csv"
DATA_DIR.mkdir(parents=True, exist_ok=True)

FBREF_LEAGUES = os.getenv("FBREF_LEAGUES", "BRA-Serie A")
FBREF_SEASONS = os.getenv("FBREF_SEASONS", "2025")

LEAGUE_SLUG = FBREF_LEAGUES.lower().replace(" ", "_").replace("-", "_")
SEASON_SLUG = FBREF_SEASONS.split(",")[0].strip()