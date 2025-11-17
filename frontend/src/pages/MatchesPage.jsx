import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";
import BackButton from "../components/BackButton.jsx";
import MatchCard from "../components/MatchCard.jsx";

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/matches`);
        if (!res.ok) throw new Error("Erro ao carregar jogos");
        const json = await res.json();
        setMatches(json);
      } catch (err) {
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <section className="page">
      <BackButton />

      <header className="section-header">
        <h2>Partidas do Brasileirão Série A</h2>
        <p>
          Veja todos os jogos da temporada. Toque em uma partida para visualizar
          os detalhes.
        </p>
      </header>

      {loading && <p>Carregando partidas...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="match-grid">
          {matches.map((match, index) => (
            <MatchCard key={index} match={match} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MatchesPage;
