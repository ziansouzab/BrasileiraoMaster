import { useNavigate } from "react-router-dom";

function MatchCard({ match, index }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/matches/${index}`);
  };

  const date = match.Date || match.date || "";
  const home = match.home_team || match.team || "";
  const away = match.away_team || match.opponent || "";
  const score = match.score || `${match.GF ?? ""}-${match.GA ?? ""}`;

  return (
    <button className="match-card" onClick={handleClick}>
      <div className="match-header">
        <span className="match-date">{date}</span>
      </div>
      <div className="match-teams">
        <span className="match-team-home">{home}</span>
        <span className="match-score">{score}</span>
        <span className="match-team-away">{away}</span>
      </div>
      {match.venue && (
        <div className="match-footer">
          <span>{match.venue}</span>
        </div>
      )}
    </button>
  );
}

export default MatchCard;
