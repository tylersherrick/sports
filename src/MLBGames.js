import { useState, useEffect, useRef } from "react";
import "./App.css";

function MLBGames({ isExpanded, setExpanded }) {
  const [games, setGames] = useState([]);
  const prevGamesRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(getTodayET());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getTodayET() {
    const now = new Date();
    const etString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
    const etDate = new Date(etString);
    const year = etDate.getFullYear();
    const month = String(etDate.getMonth() + 1).padStart(2, "0");
    const day = String(etDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const changeDay = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    setDate(`${year}-${month}-${day}`);
  };

  const toggleExpand = () => {
    if (isExpanded === "MLB") {
      setExpanded(null);
      setDate(getTodayET());
    } else {
      setExpanded("MLB");
    }
  };

  useEffect(() => {
    let interval = null;

    const fetchGames = async () => {
      try {
        const formattedDate = date.replaceAll("-", "");
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${formattedDate}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const matchups = data.events?.map((event) => {
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
        }) || [];

        // Update only if games changed
        const prevIds = prevGamesRef.current.map((g) => g.gameId);
        const newIds = matchups.map((g) => g.gameId);
        const isDifferent =
          matchups.length !== prevGamesRef.current.length ||
          !matchups.every((g, i) =>
            g.gameId === prevGamesRef.current[i]?.gameId &&
            g.awayScore === prevGamesRef.current[i]?.awayScore &&
            g.homeScore === prevGamesRef.current[i]?.homeScore
          );

        if (isDifferent) {
          prevGamesRef.current = matchups;
          setGames(matchups);
        }

        setError(null);
      } catch {
        setError("Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    // Auto-refresh only for today
    if (date === getTodayET()) {
      interval = setInterval(fetchGames, 5000);
    }

    return () => clearInterval(interval);
  }, [date]);

  const orderedGames = [...games].sort((a, b) => {
    const order = { in: 0, pre: 1, post: 2 };
    const stateA = a.state || "unknown";
    const stateB = b.state || "unknown";
    return (order[stateA] ?? 3) - (order[stateB] ?? 3);
  });

  const gamesToShow = isExpanded === "MLB" ? orderedGames : orderedGames.slice(0, 3);

  if (isExpanded && isExpanded !== "MLB") return null;

  return (
    <div className="sports-games mlb-games">
      <h1 className="clickable" onClick={toggleExpand}>MLB</h1>

      {isExpanded === "MLB" && (
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
            <li key={game.gameId} className="mlb-game-item">
              <img src={game.awayLogo} alt={game.awayName} className="team-logo" />
              <span className="team-name">{isMobile ? game.awayAbbr : game.awayName}</span>
              <span className="game-score">
                {game.state === "in" || game.state === "post"
                  ? `${game.awayScore} - ${game.homeScore}`
                  : game.time}
              </span>
              <span className="team-name">{isMobile ? game.homeAbbr : game.homeName}</span>
              <img src={game.homeLogo} alt={game.homeName} className="team-logo" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MLBGames;
