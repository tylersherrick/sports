import React from "react";

function MLBGameDetail({ game, onBack }) {
  if (!game) return null;

  const {
    awayName,
    homeName,
    awayScore,
    homeScore,
    state,
    time,
    id,
  } = game;

  return (
    <div className="mlb-game-detail">
      <button onClick={onBack} className="back-button">← Back</button>
      <h2 className="text-xl font-bold mb-2">
        {awayName} @ {homeName}
      </h2>

      <div className="scores text-lg mb-2">
        <p>
          {awayName}: {awayScore ?? "-"}
        </p>
        <p>
          {homeName}: {homeScore ?? "-"}
        </p>
      </div>

      <p>Status: {state || "Unknown"}</p>
      <p>Start Time: {time || "TBD"}</p>
      <p>Game ID: {id}</p>
    </div>
  );
}

export default MLBGameDetail;
