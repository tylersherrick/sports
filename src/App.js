import { useState } from "react";
import MLBGames from "./MLBGames";
import NHLGames from "./NHLGames";
import NFLGames from "./NFLGames";
import CFBGames from "./CFBGames";
import NBAGames from "./NBAGames";
import MLBGameDetail from "./MLBGameDetail";
import NHLGameDetail from "./NHLGameDetail";

function Sports() {
  const [isExpanded, setExpanded] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null); // track the clicked game

  // If a game is selected, only show the detail view
  if (selectedGame?.league === "MLB") {
    return (
      <MLBGameDetail
        game={selectedGame.game}
        onBack={() => setSelectedGame(null)} // back resets selection
      />
    );
  }
  if(selectedGame?.league === "NHL") {
    return (
      <NHLGameDetail
        game={selectedGame.game}
        onBack={() => setSelectedGame(null)}
      />
    )
  }

  return (
    <div className="sports-container">
      {!isExpanded && <p className="default-text">Today's Sporting Events</p>}

      {/* Pass setSelectedGame to MLBGames */}
      <MLBGames isExpanded={isExpanded} setExpanded={setExpanded} setSelectedGame={setSelectedGame} />
      <CFBGames isExpanded={isExpanded} setExpanded={setExpanded} />
      <NFLGames isExpanded={isExpanded} setExpanded={setExpanded} />
      <NHLGames isExpanded={isExpanded} setExpanded={setExpanded} setSelectedGame={setSelectedGame}/>
      <NBAGames isExpanded={isExpanded} setExpanded={setExpanded} />
    </div>
  );
}

export default Sports;
