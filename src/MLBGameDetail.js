import React from "react";
import mlbVariables from "./variables/mlbVariables";

function MLBGameDetail({ game, onBack }) {
  if (!game) return null;

  const {
    awayName,
    homeName,
    awayScore,
    homeScore,
    state,
    time,
    gameId,
    awayLogo,
    homeLogo,
    awayAbbr,
    homeAbbr,
  } = game;

  

  console.log(game);
  const isPreGame = state === "pre";
  const isFinal = state === "post";
  const isInProgress = state === "in";

  return (
    <div className="mlb-game-detail sports-games" style={{ textAlign: "center" }}>
      {/* Back Button */}
      <button onClick={onBack} className="back-button clickable" style={{ marginBottom: "1rem" }}>
        ← Back
      </button>

      {/* Teams Header */}
      <div
        className="mlb-game-item"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* Away Team */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={awayLogo} alt={awayName} className="team-logo" />
          <span className="team-name">{awayAbbr}</span>
          <span className="team-name">{game.vars.awayOverallRecord}</span>
        </div>

        {/* Score / VS */}
        <div className="game-score" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {isFinal || isInProgress ? `${awayScore} - ${homeScore}` : "vs"}
        </div>

        {/* Home Team */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={homeLogo} alt={homeName} className="team-logo" />
          <span className="team-name">{homeAbbr}</span>
          <span className="team-name">{game.vars.homeOverallRecord}</span>
        </div>
      </div>

      {/* Game Info */}
      <div className="game-info" style={{ marginTop: "1rem", lineHeight: "1.5rem" }}>
        {isPreGame && <p>Start Time: {time || "TBD"}</p>}
        {isInProgress && <p></p>}
        {isFinal && <p>Status: Final</p>}
      </div>
    </div>
  );
}

export default MLBGameDetail;
