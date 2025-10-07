import { useState } from "react";
import MLBGames from "./MLBGames";
import NHLGames from "./NHLGames";
import NFLGames from "./NFLGames";
import CFBGames from "./CFBGames";
import NBAGames from "./NBAGames";

function Sports() {
  const [isExpanded, setExpanded] = useState(null); // 'MLB' or 'NHL'

  return (
    <div className="sports-container">
      {!isExpanded && <p className="default-text">Today's Sporting Events</p>}
      <MLBGames isExpanded={isExpanded} setExpanded={setExpanded} />
      <CFBGames isExpanded={isExpanded} setExpanded={setExpanded} />
      <NFLGames isExpanded={isExpanded} setExpanded={setExpanded} />
      <NHLGames isExpanded={isExpanded} setExpanded={setExpanded} />
      <NBAGames isExpanded={isExpanded} setExpanded={setExpanded} />
    </div>
  );
}

export default Sports;
