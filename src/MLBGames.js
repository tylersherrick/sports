import { useState, useEffect } from "react";
import "./App.css";

function MLBGames() {
  const [games, setGames] = useState([]);
  const [prevGames, setPrevGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAllGames, setShowAllGames] = useState(false);
  const [scoreChanges, setScoreChanges] = useState({});

  useEffect(() => {
    if ("Notification" in window && navigator.standalone) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const matchups = data.events.map((event) => {
          const competitors = event.competitions[0].competitors;
          const awayTeam = competitors[1].team;
          const homeTeam = competitors[0].team;
          const awayScore = competitors[1].score || 0;
          const homeScore = competitors[0].score || 0;
          const eventTime = event.date ? new Date(event.date) : null;
          const localTime = eventTime
            ? eventTime.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "TBD";
          const state = event.status.type.state;
          const gameId = event.id;

          return {
            gameId,
            awayName: awayTeam.displayName,
            homeName: homeTeam.displayName,
            awayScore,
            homeScore,
            time: localTime,
            awayLogo: awayTeam.logo,
            homeLogo: homeTeam.logo,
            state,
          };
        });

        const changes = {};
        matchups.forEach((game) => {
          const prev = prevGames.find((g) => g.gameId === game.gameId);

          if (prev && (prev.awayScore !== game.awayScore || prev.homeScore !== game.homeScore)) {
            changes[game.gameId] = true;
            if (Notification.permission === "granted") {
              new Notification(`${game.awayName} @ ${game.homeName}`, {
                body: `Score updated: ${game.awayScore} - ${game.homeScore}`,
              });
            }
            setTimeout(() => {
              setScoreChanges((prev) => ({ ...prev, [game.gameId]: false }));
            }, 1000);
          }

          if (!prev && game.state === "in" && Notification.permission === "granted") {
            new Notification(`${game.awayName} @ ${game.homeName}`, {
              body: `Game just started!`,
            });
          }
        });

        setScoreChanges((prev) => ({ ...prev, ...changes }));
        setPrevGames(games);
        setGames(matchups);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError("Failed to fetch games");
        setLoading(false);
      }
    };

    fetchGames();
    const interval = setInterval(fetchGames, 2500);
    return () => clearInterval(interval);
  }, [games, prevGames]);

  const gamesToShow = showAllGames ? games : games.slice(0, 3);

  return (
    <div className="mlb-games">
      <h1
        style={{ cursor: selectedGame ? "default" : "pointer" }}
        onClick={() => { if (!selectedGame) setShowAllGames(!showAllGames); }}
      >
        MLB
      </h1>
      {selectedGame && (
        <div className="game-details">
          <h2>{selectedGame.awayName} @ {selectedGame.homeName}</h2>
          {selectedGame.state === "in" && (
            <p>Score: {selectedGame.awayScore} - {selectedGame.homeScore}</p>
          )}
          <p>Time: {selectedGame.time}</p>
          <button onClick={() => setSelectedGame(null)}>Back</button>
        </div>
      )}
      {!selectedGame && loading && <p>Loading games...</p>}
      {!selectedGame && error && <p style={{ color: "red" }}>{error}</p>}
      {!selectedGame && !loading && !error && gamesToShow.length === 0 && <p>No games available.</p>}
      {!selectedGame && !loading && !error && gamesToShow.length > 0 && (
        <ul>
          {gamesToShow.map((game) => (
            <li
              key={game.gameId}
              className={
                scoreChanges[game.gameId]
                  ? "score-changed"
                  : showAllGames
                    ? game.state === "in"
                      ? "live-game"
                      : ""
                    : "preview-game"
              }
              onClick={() => setSelectedGame(game)}
            >
              <img src={game.awayLogo} alt={game.awayName} style={{ width: "40px", height: "40px" }} />
              <span>{game.awayName} {game.state === "in" ? game.awayScore : ""}</span>
              <span>-</span>
              <span>{game.state === "in" ? game.homeScore : ""} {game.homeName}</span>
              <img src={game.homeLogo} alt={game.homeName} style={{ width: "40px", height: "40px" }} />
              <span>({game.time})</span>
              {game.state === "in" && <span className="live-dot"></span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MLBGames;
