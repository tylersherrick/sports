import { useState } from "react";
import MLBGames from "./MLBGames";
// import NHLGames from "./NHLGames";
// import NFLGames from "./NFLGames";
// import CFBGames from "./CFBGames";
// import NBAGames from "./NBAGames";
import MLBGameDetail from "./MLBGameDetail";
// import NFLGameDetail from "./NFLGameDetail";
// import NHLGameDetail from "./NHLGameDetail";
// import CFBGameDetail from "./CFBGameDetail";

function Sports() {
  const [isExpanded, setExpanded] = useState("MLB");
  const [selectedGame, setSelectedGame] = useState(null);

  if (selectedGame?.league === "MLB") {
    return (
      <MLBGameDetail
        game={selectedGame.game}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  return (
    <div className="sports-container">
      <MLBGames
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        setSelectedGame={setSelectedGame}
      />

      {/* Other sports temporarily disabled */}

      {/* <CFBGames
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        setSelectedGame={setSelectedGame}
      />

      <NFLGames
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        setSelectedGame={setSelectedGame}
      />

      <NHLGames
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        setSelectedGame={setSelectedGame}
      />

      <NBAGames
        isExpanded={isExpanded}
        setExpanded={setExpanded}
      /> */}
    </div>
  );
}

export default Sports;