import React from "react";

function StatsCard({ player, stats }) {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <h4>{player.player}</h4>
        {player.team && <span className="player-team"> · {player.team}</span>}
      </div>
      <div className="stats-body">
        {stats.map((stat) => (
          <div className="stats-item" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{player[stat.valueKey] ?? stat.fallback ?? 0}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsCard;


