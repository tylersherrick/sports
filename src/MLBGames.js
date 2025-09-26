import { useState, useEffect, useRef } from "react";
import "./App.css";

function MLBGames() {
  const [games, setGames] = useState([]);
  const prevGamesRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAllGames, setShowAllGames] = useState(false);
  const [scoreChanges, setScoreChanges] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  // Handle mobile resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changeDay = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]);
  };

  // Request notifications
  useEffect(() => {
    if ("Notification" in window && navigator.standalone) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval = null;

    const fetchGames = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const formattedDate = date.replaceAll("-", "");
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${formattedDate}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const matchups = data.events.map((event) => {
          const competitors = event.competitions[0].competitors;
          const awayTeam = competitors[1].team;
          const homeTeam = competitors[0].team;
          const awayScore = competitors[1].score || 0;
          const homeScore = competitors[0].score || 0;

          const eventTime = event.date ? new Date(event.date) : null;
          const localTime = eventTime
            ? eventTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true })
            : "TBD";

          const state = event.status.type.state;
          const gameId = event.id;

          const awayAbbr = awayTeam.abbreviation || awayTeam.displayName.slice(0, 3);
          const homeAbbr = homeTeam.abbreviation || homeTeam.displayName.slice(0, 3);

          return {
            gameId,
            awayName: awayTeam.displayName,
            homeName: homeTeam.displayName,
            awayAbbr,
            homeAbbr,
            awayScore,
            homeScore,
            time: localTime,
            awayLogo: awayTeam.logo,
            homeLogo: homeTeam.logo,
            state,
          };
        });

        const changes = {};
        const updatedGames = matchups.map((game) => {
          const prev = prevGamesRef.current.find((g) => g.gameId === game.gameId);
          if (prev && (prev.awayScore !== game.awayScore || prev.homeScore !== game.homeScore)) {
            changes[game.gameId] = true;
            if (Notification.permission === "granted") {
              new Notification(`${game.awayName} @ ${game.homeName}`, {
                body: `Score updated: ${game.awayScore} - ${game.homeScore}`,
              });
            }
            setTimeout(() => setScoreChanges((prev) => ({ ...prev, [game.gameId]: false })), 1000);
            return { ...prev, ...game };
          }

          if (!prev && game.state === "in" && Notification.permission === "granted") {
            new Notification(`${game.awayName} @ ${game.homeName}`, { body: "Game just started!" });
          }

          return prev || game;
        });

        prevGamesRef.current = updatedGames;
        setScoreChanges((prev) => ({ ...prev, ...changes }));
        setGames(updatedGames);
        setError(null);
      } catch {
        setError("Failed to fetch games");
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    fetchGames(true);

    // Only auto-refresh if today
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      interval = setInterval(() => fetchGames(false), 2500);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [date]);

  // Order: in-progress, scheduled, final
  const orderedGames = [...games].sort((a, b) => {
    const order = { "in": 0, "pre": 1, "post": 2 };
    return (order[a.state] || 3) - (order[b.state] || 3);
  });

  const gamesToShow = (date !== new Date().toISOString().split("T")[0] || showAllGames)
    ? orderedGames
    : orderedGames.slice(0, 3);

  return (
    <div className="mlb-games">
      <h1 className={!selectedGame ? "clickable" : "disabled"} onClick={() => { if (!selectedGame) setShowAllGames(!showAllGames); }}>
        MLB Scores
      </h1>

      <div className="controls">
        <button onClick={() => changeDay(-1)}>Previous</button>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => changeDay(1)}>Next</button>
      </div>

      {!selectedGame && loading && <p>Loading games...</p>}
      {!selectedGame && error && <p className="error">{error}</p>}
      {!selectedGame && !loading && !error && gamesToShow.length === 0 && <p>No games available.</p>}

      {!selectedGame && !loading && !error && gamesToShow.length > 0 && (
        <ul>
          {gamesToShow.map((game) => (
            <li
              key={game.gameId}
              className={scoreChanges[game.gameId] ? "score-changed" : ""}
            >
              <img src={game.awayLogo} alt={game.awayName} className="team-logo" />
              <span className="team-name">{isMobile ? game.awayAbbr : game.awayName}</span>
              <span className="game-center">
                {game.state === "in" || game.state === "post"
                  ? `${game.awayScore} - ${game.homeScore}`
                  : game.time
                }
              </span>
              <span className="team-name">{isMobile ? game.homeAbbr : game.homeName}</span>
              <img src={game.homeLogo} alt={game.homeName} className="team-logo" />
              {game.state === "in" && <span className="live-dot"></span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MLBGames;
