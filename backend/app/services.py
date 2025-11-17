from pathlib import Path
from typing import List, Dict, Any

import pandas as pd

from .config import DATA_DIR, LEAGUE_SLUG, SEASON_SLUG


def _csv_path(kind: str) -> Path:
    return DATA_DIR / f"{LEAGUE_SLUG}_{SEASON_SLUG}_{kind}.csv"


def read_team_stats() -> pd.DataFrame:
    return pd.read_csv(_csv_path("team_stats"))


def read_matches() -> pd.DataFrame:
    return pd.read_csv(_csv_path("matches"))


def read_players_stats() -> pd.DataFrame:
    return pd.read_csv(_csv_path("players_stats"))


def list_standings() -> List[Dict[str, Any]]:
    """
    Por simplicidade, retorna o CSV de times como está.
    Se tiver coluna de pontos/classificação, você ordena aqui.
    """
    df = read_team_stats()

    # EXEMPLO (ajuste os nomes das colunas conforme o CSV gerado)
    for col in ["Pts", "W", "D", "L"]:
        if col not in df.columns:
            # se não tiver, deixa sem ordenar – você pode adaptar depois
            return df.to_dict(orient="records")

    df = df.sort_values(
        by=["Pts", "W", "D", "L"],
        ascending=[False, False, False, True],
    ).reset_index(drop=True)
    df.insert(0, "rank", df.index + 1)

    return df.to_dict(orient="records")


def get_team_detail(team_name: str) -> Dict[str, Any]:
    df_teams = read_team_stats()
    df_players = read_players_stats()

    team_rows = df_teams[df_teams["team"] == team_name]
    if team_rows.empty:
        return {}

    team_data = team_rows.iloc[0].to_dict()

    players_data = df_players[df_players["team"] == team_name].to_dict(
        orient="records"
    )

    return {
        "team": team_data,
        "players": players_data,
    }


def list_matches() -> List[Dict[str, Any]]:
    df = read_matches()
    return df.to_dict(orient="records")
