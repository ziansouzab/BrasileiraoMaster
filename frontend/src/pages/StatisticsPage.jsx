import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import BackButton from "../components/BackButton";
import StatsCard from "../components/StatsCard";

function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/players/statistics`);
        if (!res.ok) throw new Error("Erro ao carregar estatísticas");
        const json = await res.json();
        setStats(json);
      } catch (err) {
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="page">
        <BackButton />
        <p>Carregando rankings dos jogadores...</p>
      </section>
    );
  }

  if (error || !stats) {
    return (
      <section className="page">
        <BackButton />
        <p className="error-text">{error || "Não foi possível carregar estatísticas."}</p>
      </section>
    );
  }

  const {
    top_goals,
    top_assists,
    top_ga,
    top_minutes,
    top_yellow,
    top_red,
  } = stats;

  const rankingSections = [
    { title: "Artilheiros (Gols)", data: top_goals, statsKeys: [{ label: "Gols", valueKey: "goals" }] },
    { title: "Maiores Assistentes", data: top_assists, statsKeys: [{ label: "Assistências", valueKey: "assists" }] },
    { title: "Participação em Gols (G+A)", data: top_ga, statsKeys: [{ label: "G+A", valueKey: "goals_plus_assists" }] },
    { title: "Mais Minutos em Campo", data: top_minutes, statsKeys: [{ label: "Minutos", valueKey: "minutes_played" }] },
    { title: "Mais Cartões Amarelos", data: top_yellow, statsKeys: [{ label: "Amarelos", valueKey: "yellow_cards" }] },
    { title: "Mais Cartões Vermelhos", data: top_red, statsKeys: [{ label: "Vermelhos", valueKey: "red_cards" }] },
  ];

  return (
    <section className="page">
      <BackButton />

      <header className="section-header">
        <h2>Rankings da Temporada</h2>
        <p className="muted">Principais estatísticas dos jogadores</p>
      </header>

      <div className="rankings-grid">
        {rankingSections.map((section) => (
          <div className="ranking-card" key={section.title}>
            <h3>{section.title}</h3>

            <div className="player-grid">
                {section.data.slice(0, 10).map((player, idx) => (
                    <div className="card-wrapper" key={player.player + idx}>
                        <div className="position-badge">{idx + 1}</div>
                        <StatsCard player={player} stats={section.statsKeys} />
                    </div>
                    ))}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}

export default StatisticsPage;




