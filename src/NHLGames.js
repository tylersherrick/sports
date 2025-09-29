import { useState, useEffect, useRef } from "react";
import "./App.css";

function NHLGames({ isExpanded, setExpanded }) {
  const [games, setGames] = useState([]);
  const prevGamesRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    let interval = null;

    const fetchGames = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const formattedDate = date.replaceAll("-", "");
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${formattedDate}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const matchups = data.events?.map((event) => {
          const competitors = event.competitions[0].competitors;
          const awayTeam = competitors[1].team;
          const homeTeam = competitors[0].team;

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
            awayScore: competitors[1].score || 0,
            homeScore: competitors[0].score || 0,
            time: localTime,
            awayLogo: awayTeam.logo,
            homeLogo: homeTeam.logo,
            state,
          };
        }) || [];

        // Highlight score changes
        const changes = {};
        const updatedGames = matchups.map((game) => {
          const prev = prevGamesRef.current.find((g) => g.gameId === game.gameId);
          if (prev && (prev.awayScore !== game.awayScore || prev.homeScore !== game.homeScore)) {
            changes[game.gameId] = true;
            setTimeout(() => setScoreChanges((prev) => ({ ...prev, [game.gameId]: false })), 1000);
          }
          return game;
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

    // Auto-refresh only for current date
    const today = new Date().toISOString().split("T")[0];
    if (date === today) interval = setInterval(() => fetchGames(false), 2500);

    return () => { if (interval) clearInterval(interval); };
  }, [date]);

  const orderedGames = [...games].sort((a, b) => {
    const order = { in: 0, pre: 1, post: 2 };
    const stateA = a.state || "unknown";
    const stateB = b.state || "unknown";
    return (order[stateA] ?? 3) - (order[stateB] ?? 3);
  });

  // Show all games if expanded, else preview first 3
  const gamesToShow = isExpanded === "NHL" ? orderedGames : orderedGames.slice(0, 3);

  // Hide NHL if another league is expanded
  if (isExpanded && isExpanded !== "NHL") return null;

  return (
  <div className="sports-games nhl-games">
    <h1
      className="clickable"
      onClick={() => {
        if (isExpanded === "NHL") {
          setExpanded(null);
          setDate(new Date().toISOString().split("T")[0]); // reset date
        } else {
          setExpanded("NHL");
        }
      }}
    >
      NHL
    </h1>

    {/* Show date picker only when NHL is expanded */}
    {isExpanded === "NHL" && (
      <div className="controls">
        <button onClick={() => changeDay(-1)}>Previous</button>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => changeDay(1)}>Next</button>
      </div>
    )}

    {loading && <p>Loading games...</p>}
    {error && <p className="error">{error}</p>}
    {!loading && !error && gamesToShow.length === 0 && <p>No games available.</p>}

    {!loading && !error && gamesToShow.length > 0 && (
      <ul className="mlb-games-list">
        {gamesToShow.map((game) => (
          <li
            key={game.gameId}
            className={`mlb-game-item ${scoreChanges[game.gameId] ? "score-changed" : ""}`}
          >
            <img src={game.awayLogo} alt={game.awayName} className="team-logo" />
            <span className="team-name">{isMobile ? game.awayAbbr : game.awayName}</span>
            <span className="game-score">
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

export default NHLGames;
