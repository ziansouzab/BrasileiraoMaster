from pathlib import Path
from typing import Any, Dict, List
import unicodedata
import math

import pandas as pd

from .config import DATA_DIR, LEAGUE_SLUG, SEASON_SLUG


def _csv_path(kind: str) -> Path:
    return DATA_DIR / f"{LEAGUE_SLUG}_{SEASON_SLUG}_{kind}.csv"


def _normalize_text(value: Any) -> Any:
    if isinstance(value, str):
        value = unicodedata.normalize("NFKC", value)
        value = value.replace("\u2013", "-").replace("\u2212", "-").replace("\xa0", " ")
        return value.strip()
    return value


def _normalize_string_columns(df: pd.DataFrame) -> pd.DataFrame:
    obj_cols = df.select_dtypes(include=["object"]).columns
    for col in obj_cols:
        df[col] = df[col].map(_normalize_text)
    return df




def _read_matches_raw() -> pd.DataFrame:
    return pd.read_csv(_csv_path("matches"))


def _normalize_matches(df: pd.DataFrame) -> pd.DataFrame:
    drop_cols = [
        c
        for c in ["match_report", "notes", "home_xg", "away_xg"]
        if c in df.columns
    ]
    df = df.drop(columns=drop_cols)
    df = _normalize_string_columns(df)
    return df


def _parse_score(score: Any):
    score = _normalize_text(score)
    if not isinstance(score, str) or "-" not in score:
        return None
    parts = score.split("-")
    if len(parts) != 2:
        return None
    try:
        hg = int(parts[0].strip())
        ag = int(parts[1].strip())
        return hg, ag
    except ValueError:
        return None


def _compute_standings_from_matches(matches_df: pd.DataFrame) -> pd.DataFrame:
    records: List[Dict[str, Any]] = []

    for _, row in matches_df.iterrows():
        parsed = _parse_score(row.get("score"))
        if not parsed:
            continue

        hg, ag = parsed
        home = row.get("home_team")
        away = row.get("away_team")

        for team, gf, ga in [(home, hg, ag), (away, ag, hg)]:
            if pd.isna(team):
                continue
            if gf > ga:
                result, pts = "W", 3
            elif gf == ga:
                result, pts = "D", 1
            else:
                result, pts = "L", 0

            records.append(
                {"team": team, "gf": gf, "ga": ga, "result": result, "pts": pts}
            )

    df = pd.DataFrame(records)
    if df.empty:
        return pd.DataFrame(
            columns=["team", "MP", "W", "D", "L", "GF", "GA", "Pts", "GD"]
        )

    agg = df.groupby("team").agg(
        MP=("result", "count"),
        W=("result", lambda x: (x == "W").sum()),
        D=("result", lambda x: (x == "D").sum()),
        L=("result", lambda x: (x == "L").sum()),
        GF=("gf", "sum"),
        GA=("ga", "sum"),
        Pts=("pts", "sum"),
    ).reset_index()

    agg["GD"] = agg["GF"] - agg["GA"]
    return agg




def _read_players_raw() -> pd.DataFrame:
    return pd.read_csv(_csv_path("players_stats"))


def _normalize_players(df: pd.DataFrame) -> pd.DataFrame:
    import math

    header = df.iloc[0].copy()
    df = df.iloc[1:].reset_index(drop=True)

    # Descobre qual coluna é "Min" dentro do grupo Playing Time
    min_col = None
    for col in df.columns:
        label = header.get(col)
        if isinstance(label, str) and label.lower() == "min":
            min_col = col
            break

    if min_col is not None:
        df["minutes_played"] = pd.to_numeric(df[min_col], errors="coerce")

    perf_map = {
        "Gls": "goals",
        "Ast": "assists",
        "G+A": "goals_plus_assists",
        "G-PK": "non_penalty_goals",
        "PK": "penalties_scored",
        "PKatt": "penalties_attempted",
        "CrdY": "yellow_cards",
        "CrdR": "red_cards",
    }

    old_cols = list(df.columns)
    new_cols = []
    playing_time_names: list[str] = []

    for col in old_cols:
        group = col.split(".")[0]
        label = header.get(col)

        if isinstance(label, float) and math.isnan(label):
            new_cols.append(col)
        elif isinstance(label, str):
            lower_label = label.lower()

            if group == "Playing Time":
                # MP, Starts, Min, 90s...
                new_cols.append(label)
                if lower_label in ("mp", "starts", "min", "90s"):
                    playing_time_names.append(label)

            elif group == "Performance":
                new_cols.append(perf_map.get(label, label).lower())

            elif group == "Expected":
                new_cols.append("exp_" + lower_label)

            elif group == "Progression":
                new_cols.append("prog_" + label)

            elif group == "Per 90 Minutes":
                new_cols.append("per90_" + lower_label)

            else:
                new_cols.append(col)
        else:
            new_cols.append(col)

    df.columns = new_cols

    drop_cols = ["url"]
    drop_cols += playing_time_names
    drop_cols += [c for c in df.columns if c.startswith("exp_") or c.startswith("prog_")]

    df = df.drop(columns=[c for c in drop_cols if c in df.columns])
    df = _normalize_string_columns(df)
    return df

def list_players_statistics() -> Dict[str, Any]:
    df = _load_players()
    if df.empty:
        return {
            "top_goals": [],
            "top_assists": [],
            "top_ga": [],
            "top_minutes": [],
            "top_yellow": [],
            "top_red": [],
            "top_ga90": [],
        }

    df["goals"] = pd.to_numeric(df.get("goals"), errors="coerce").fillna(0)
    df["assists"] = pd.to_numeric(df.get("assists"), errors="coerce").fillna(0)
    df["goals_plus_assists"] = (
        pd.to_numeric(df.get("goals_plus_assists"), errors="coerce")
        .fillna(0)
    )
    df["minutes_played"] = pd.to_numeric(df.get("minutes_played"), errors="coerce").fillna(0)
    df["yellow_cards"] = pd.to_numeric(df.get("yellow_cards"), errors="coerce").fillna(0)
    df["red_cards"] = pd.to_numeric(df.get("red_cards"), errors="coerce").fillna(0)


    def top(column: str, limit: int = 20):
        return (
            df.sort_values(column, ascending=False)
              .head(limit)[["player", "team", column]]
              .to_dict(orient="records")
        )

    return {
        "top_goals": top("goals"),
        "top_assists": top("assists"),
        "top_ga": top("goals_plus_assists"),
        "top_minutes": top("minutes_played"),
        "top_yellow": top("yellow_cards"),
        "top_red": top("red_cards"),
    }

def _read_teams_raw() -> pd.DataFrame:
    return pd.read_csv(_csv_path("team_stats"))


def _normalize_teams(df: pd.DataFrame) -> pd.DataFrame:
    header = df.iloc[0].copy()
    df = df.iloc[1:].reset_index(drop=True)

    perf_map = {
        "Gls": "goals",
        "Ast": "assists",
        "G+A": "goals_plus_assists",
        "G-PK": "non_penalty_goals",
        "PK": "penalties_scored",
        "PKatt": "penalties_attempted",
        "CrdY": "yellow_cards",
        "CrdR": "red_cards",
    }

    new_cols = []
    for col in df.columns:
        group = col.split(".")[0]
        label = header.get(col)

        if isinstance(label, float) and math.isnan(label):
            new_cols.append(col)
        elif isinstance(label, str):
            if group == "Playing Time":
                new_cols.append(label)  # MP, Starts, Min, 90s
            elif group == "Performance":
                new_cols.append(perf_map.get(label, label).lower())
            elif group == "Expected":
                new_cols.append("exp_" + label.lower())
            elif group == "Progression":
                new_cols.append("prog_" + label)
            elif group == "Per 90 Minutes":
                new_cols.append("per90_" + label.lower())
            else:
                new_cols.append(col)
        else:
            new_cols.append(col)

    df.columns = new_cols

    drop_cols = ["players_used", "url"]
    drop_cols += [c for c in df.columns if c.startswith("exp_")]

    df = df.drop(columns=[c for c in drop_cols if c in df.columns])
    df = _normalize_string_columns(df)
    return df



def _load_matches() -> pd.DataFrame:
    return _normalize_matches(_read_matches_raw())


def _load_players() -> pd.DataFrame:
    return _normalize_players(_read_players_raw())


def _load_teams() -> pd.DataFrame:
    return _normalize_teams(_read_teams_raw())


def list_standings() -> List[Dict[str, Any]]:
    teams_df = _load_teams()

    # Evita conflito de nome com MP calculado via matches
    if "MP" in teams_df.columns:
        teams_df = teams_df.drop(columns=["MP"])

    matches_df = _load_matches()
    table_df = _compute_standings_from_matches(matches_df)

    merged = teams_df.merge(table_df, on="team", how="left")

    for col in ["MP", "W", "D", "L", "GF", "GA", "Pts", "GD"]:
        if col not in merged.columns:
            merged[col] = 0
        merged[col] = merged[col].fillna(0).astype(int)

    merged = merged.sort_values(
        by=["Pts", "GD", "GF"], ascending=[False, False, False]
    ).reset_index(drop=True)
    merged.insert(0, "rank", merged.index + 1)

    return merged.to_dict(orient="records")


def get_team_detail(team_name: str) -> Dict[str, Any]:
    teams_df = _load_teams()
    matches_df = _load_matches()

    table_df = _compute_standings_from_matches(matches_df)

    merged = teams_df.merge(table_df, on="team", how="left")

    for col in ["MP", "W", "D", "L", "GF", "GA", "Pts", "GD"]:
        if col not in merged.columns:
            merged[col] = 0
        merged[col] = merged[col].fillna(0).astype(int)

    team_rows = merged[merged["team"] == team_name]
    if team_rows.empty:
        return {}

    team_data = team_rows.iloc[0].to_dict()


    players_df = _load_players()
    players_data = players_df[players_df["team"] == team_name].to_dict(orient="records")

    return {
        "team": team_data,
        "players": players_data,
    }



def list_matches() -> List[Dict[str, Any]]:
    matches_df = _load_matches()
    return matches_df.to_dict(orient="records")
