function PlayerCard({ player }) {
  const goals = player.goals ?? player.Gls ?? 0;
  const assists = player.assists ?? player.Ast ?? 0;
  const minutes = player.minutes_played ?? player.Min ?? 0;
  const position = player.pos ?? "-";

  return (
    <div className="player-card">
      <div className="player-header">
        <h4 className="player-name">
          {player.player}
          {position && <span className="player-pos-inline"> · {position}</span>}
        </h4>
      </div>
      <div className="player-body">
        <div className="player-stat">
          <span>Minutos jogados</span>
          <strong>{minutes}</strong>
        </div>
        <div className="player-stat">
          <span>Gols</span>
          <strong>{goals}</strong>
        </div>
        <div className="player-stat">
          <span>Assistências</span>
          <strong>{assists}</strong>
        </div>
        <div className="player-stat-inline">
          <div>
            <span>Amarelos </span>
            <strong>{player.yellow_cards ?? player.CrdY ?? 0}</strong>
          </div>
          <div>
            <span>Vermelhos </span>
            <strong>{player.red_cards ?? player.CrdR ?? 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
