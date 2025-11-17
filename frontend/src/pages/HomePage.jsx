import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";
import TeamCard from "../components/TeamCard.jsx";

function HomePage() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/standings`);
        if (!res.ok) throw new Error("Erro ao carregar tabela");
        const json = await res.json();
        setStandings(json);
      } catch (err) {
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, []);

  return (
    <section className="page">
      <section className="hero">
        <div className="hero-text">
          <h2>Bem-vindo ao Brasileirão Master</h2>
          <p>
            Acompanhe a tabela completa do Brasileirão Série A em tempo quase real:
            classificação atualizada semanalmente, estatísticas por time e
            desempenho individual de cada jogador.
          </p>
          <p>
            Os dados são coletados automaticamente a partir de fontes de
            estatísticas avançadas e organizados para você visualizar de forma
            simples, bonita e profissional.
          </p>
        </div>
        <div className="hero-panel">
          <h3>Como funciona?</h3>
          <ul>
            <li>Atualizações semanais dos dados do campeonato.</li>
            <li>Cards interativos para cada time da Série A.</li>
            <li>Página dedicada com resumo da temporada de cada clube.</li>
            <li>Visão completa dos jogadores e de todos os jogos.</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Tabela do Brasileirão Série A</h2>
          <p>Clique em um time para ver a análise completa da temporada.</p>
        </div>

        {loading && <p>Carregando tabela...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <div className="team-grid">
            {standings.map((team) => (
              <TeamCard key={team.team} team={team} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default HomePage;
