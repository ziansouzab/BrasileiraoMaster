import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import BackButton from "../components/BackButton.jsx";
import PlayerCard from "../components/PlayerCard.jsx";

function buildTeamSummary(team) {
  if (!team) return "";

  const name = team.team;
  const pts = team.Pts;
  const mp = team.MP;
  const w = team.W;
  const d = team.D;
  const l = team.L;
  const gf = team.GF;
  const ga = team.GA;
  const gd = team.GD;
  const poss = team.Poss;
  const age = team.Age;

  const parts = [];

  parts.push(
    `${name} soma ${pts} pontos em ${mp} jogos, com ${w} vitórias, ${d} empates e ${l} derrotas.`
  );
  parts.push(
    `O time marcou ${gf} gols e sofreu ${ga}, com saldo de ${gd} gol${Math.abs(gd) === 1 ? "" : "s"}.`
  );

  if (poss) {
    parts.push(`A posse de bola média é de ${poss}% ao longo da temporada.`);
  }
  if (age) {
    parts.push(
      `A idade média do elenco gira em torno de ${age.toFixed
        ? age.toFixed(1)
        : age} anos.`
    );
  }

  return parts.join(" ");
}

function TeamPage() {
  const { teamName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teamName) return;

    const fetchTeam = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/teams/${encodeURIComponent(teamName)}/stats`
        );
        if (!res.ok) throw new Error("Erro ao carregar dados do time");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamName]);

  const summary = useMemo(
    () => (data ? buildTeamSummary(data.team) : ""),
    [data]
  );

  if (loading) {
    return (
      <section className="page">
        <BackButton />
        <p>Carregando dados do time...</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="page">
        <BackButton />
        <p className="error-text">{error || "Time não encontrado."}</p>
      </section>
    );
  }

  const { team, players } = data;

  const keyStats = [
    { label: "Pontos", value: team.Pts },
    { label: "Jogos", value: team.MP },
    { label: "Vitórias", value: team.W },
    { label: "Empates", value: team.D },
    { label: "Derrotas", value: team.L },
    { label: "Gols pró", value: team.GF },
    { label: "Gols contra", value: team.GA },
    { label: "Saldo de gols", value: team.GD },
  ];

  return (
    <section className="page">
      <BackButton />

      <header className="section-header team-header">
        <div>
          <h2>{team.team}</h2>
          <p className="muted">
            Estatísticas gerais do clube no Brasileirão Série A – temporada{" "}
            {team.season || ""}
          </p>
        </div>
      </header>

      <section className="section">
        <h3>Resumo da temporada</h3>
        <p className="team-summary-text">{summary}</p>

        <div className="team-stats-grid">
          {keyStats.map((item) => (
            <div key={item.label} className="team-stat-card">
              <span className="team-stat-label">{item.label}</span>
              <strong className="team-stat-value">{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h3>Elenco e desempenho individual</h3>
          <p>
            Explore o desempenho de cada jogador: minutos em campo, gols,
            assistências e cartões.
          </p>
        </div>

        {players.length === 0 && <p>Nenhum jogador encontrado.</p>}

        {players.length > 0 && (
          <div className="player-grid">
            {players.map((player) => (
              <PlayerCard key={`${player.player}-${player.team}`} player={player} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default TeamPage;
