import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import BackButton from "../components/BackButton.jsx";

function MatchDetailsPage() {
  const { index } = useParams();
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

  if (loading) {
    return (
      <section className="page">
        <BackButton />
        <p>Carregando partida...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <BackButton />
        <p className="error-text">{error}</p>
      </section>
    );
  }

  const idx = Number(index);
  const match = matches[idx];

  if (!match) {
    return (
      <section className="page">
        <BackButton />
        <p className="error-text">Partida não encontrada.</p>
      </section>
    );
  }

  const date = match.Date || match.date || "";
  const home = match.home_team || match.team || "";
  const away = match.away_team || match.opponent || "";
  const score = match.score || `${match.GF ?? ""}-${match.GA ?? ""}`;
  const round = match.Round || match.round || "";
  const venue = match.venue || "";
  const attendance = match.attendance || match.Attendance || "";
  const referee = match.Referee || match.referee || "";

  return (
    <section className="page">
      <BackButton />

      <div className="match-detail-card">
        <div className="match-detail-header">
          <span className="match-detail-date">{date}</span>
          {round && <span className="match-detail-round">{round}</span>}
        </div>

        <div className="match-detail-scoreblock">
          <div className="match-detail-team">
            <span className="label">Mandante</span>
            <strong>{home}</strong>
          </div>
          <div className="match-detail-score">{score}</div>
          <div className="match-detail-team">
            <span className="label">Visitante</span>
            <strong>{away}</strong>
          </div>
        </div>

        <div className="match-detail-extra">
          {venue && (
            <div className="extra-item">
              <span>Estádio</span>
              <strong>{venue}</strong>
            </div>
          )}
          {attendance && (
            <div className="extra-item">
              <span>Público</span>
              <strong>{attendance}</strong>
            </div>
          )}
          {referee && (
            <div className="extra-item">
              <span>Árbitro</span>
              <strong>{referee}</strong>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MatchDetailsPage;
