import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config.js";
import BackButton from "../components/BackButton.jsx";
import MatchCard from "../components/MatchCard.jsx";

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState("");    

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

  const filteredMatches = useMemo(() => {
    if (!startDate && !endDate) return matches;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return matches.filter((match) => {
      const raw = match.Date || match.date;
      if (!raw) return false;

      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return false;

      if (start && d < start) return false;
      if (end && d > end) return false;

      return true;
    });
  }, [matches, startDate, endDate]);

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <section className="page">
      <BackButton />

      <header className="section-header">
        <h2>Partidas do Brasileirão Série A</h2>
        <p>
          Veja todos os jogos da temporada. Use o filtro de datas para encontrar
          as partidas que você deseja.
        </p>
      </header>

      <section className="section">
        <div className="match-filters">
          <div className="filter-field">
            <label htmlFor="startDate">De</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="endDate">Até</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="button-secondary"
            onClick={handleClearFilter}
          >
            Limpar filtro
          </button>
        </div>

        {loading && <p>Carregando partidas...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && filteredMatches.length === 0 && (
          <p className="muted">
            Nenhuma partida encontrada para o intervalo selecionado.
          </p>
        )}

        {!loading && !error && filteredMatches.length > 0 && (
          <div className="match-grid">
            {filteredMatches.map((match, index) => (
              <MatchCard key={index} match={match} index={index} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default MatchesPage;

