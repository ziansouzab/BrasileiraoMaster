import { useNavigate } from "react-router-dom";

function TeamCard({ team }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teams/${encodeURIComponent(team.team)}`);
  };

  return (
    <button className="team-card" onClick={handleClick}>
      <div className="team-card-header">
        <h3 className="team-name">{team.team}</h3>
        <span className="team-rank">#{team.rank}</span>
      </div>
      <div className="team-card-body">
        <div className="stat-row">
          <span>Pontos</span>
          <strong>{team.Pts}</strong>
        </div>
        <div className="stat-row">
          <span>Vitórias</span>
          <strong>{team.W}</strong>
        </div>
        <div className="stat-row">
          <span>Empates</span>
          <strong>{team.D}</strong>
        </div>
        <div className="stat-row">
          <span>Derrotas</span>
          <strong>{team.L}</strong>
        </div>
        <div className="stat-row">
          <span>Saldo de gols</span>
          <strong>{team.GD}</strong>
        </div>
      </div>
    </button>
  );
}

export default TeamCard;
