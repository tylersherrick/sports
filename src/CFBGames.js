import { useState, useEffect, useRef } from "react";
import "./App.css";

function CFBGames({ isExpanded, setExpanded }) {
  const [games, setGames] = useState([]);
  const prevGamesRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreChanges, setScoreChanges] = useState({});
  const [week, setWeek] = useState(getCurrentCFBWeek());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  // Season starts Aug 28, 2025
  function getCurrentCFBWeek() {
    const SEASON_START = new Date("2025-08-26T00:00:00Z");
    const today = new Date();
    const diff = Math.floor((today - SEASON_START) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, diff + 1);
  }

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function getWeekRange(weekNumber) {
    const SEASON_START = new Date("2025-08-26T00:00:00Z");
    const startDate = new Date(SEASON_START);
    startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const opts = { month: "short", day: "numeric" };
    return `${startDate.toLocaleDateString("en-US", opts)} - ${endDate.toLocaleDateString(
      "en-US",
      opts
    )}`;
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = () => {
    if (isExpanded === "CFB") {
      setExpanded(null);
      setWeek(getCurrentCFBWeek());
    } else {
      setExpanded("CFB");
    }
  };

  useEffect(() => {
    let interval = null;

    const fetchGames = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?week=${week}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        // map + filter to only include games with at least one ranked team
        const matchups = (data.events || [])
          .map((event) => {
            const competitors = event.competitions[0].competitors;
            const awayTeam = competitors[1].team;
            const homeTeam = competitors[0].team;
            const awayScore = competitors[1].score || 0;
            const homeScore = competitors[0].score || 0;

            const awayRank = competitors[1].curatedRank?.current || 0;
            const homeRank = competitors[0].curatedRank?.current || 0;
            return {
              gameId: event.id,
              awayName: awayTeam.displayName,
              homeName: homeTeam.displayName,
              awayAbbr: awayTeam.abbreviation || awayTeam.displayName.slice(0, 3),
              homeAbbr: homeTeam.abbreviation || homeTeam.displayName.slice(0, 3),
              awayScore,
              homeScore,
              dateTime: event.date ? formatDateTime(event.date) : "TBD",
              awayLogo: awayTeam.logo,
              homeLogo: homeTeam.logo,
              state: event.status.type.state,
              awayRank: awayRank <= 25 ? awayRank : 0,
              homeRank: homeRank <= 25 ? homeRank : 0,
              gameStatus: event.status.type.shortDetail,
            };
            
          })
          .filter((g) => g.awayRank > 0 || g.homeRank > 0);

        const changes = {};
        const updatedGames = matchups.map((game) => {
          const prev = prevGamesRef.current.find((g) => g.gameId === game.gameId);
          if (prev && (prev.awayScore !== game.awayScore || prev.homeScore !== game.homeScore)) {
            changes[game.gameId] = true;
            setTimeout(() => setScoreChanges((prev) => ({ ...prev, [game.gameId]: false })), 1000);
            return { ...prev, ...game };
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
    interval = setInterval(() => fetchGames(false), 5000);
    return () => clearInterval(interval);
  }, [week]);

  const orderedGames = [...games].sort((a, b) => {
    const order = { in: 0, pre: 1, post: 2 };
    return (order[a.state] ?? 3) - (order[b.state] ?? 3);
  });

  const gamesToShow = isExpanded === "CFB" ? orderedGames : orderedGames.slice(0, 3);

  if (isExpanded && isExpanded !== "CFB") return null;

  return (
    <div className="sports-games cfb-games">
      <h1 className="clickable" onClick={toggleExpand}>
        CFB
      </h1>

      {isExpanded === "CFB" && (
        <div className="controls">
          <label htmlFor="week">Week:</label>
          <button
            onClick={() => setWeek((prev) => Math.max(1, prev - 1))}
            className="week-arrow"
          >
            ◀
          </button>
          <select
            id="week"
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
          >
            {Array.from({ length: 18 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Week {i + 1} ({getWeekRange(i + 1)})
              </option>
            ))}
          </select>
          <button
            onClick={() => setWeek((prev) => Math.min(18, prev + 1))}
            className="week-arrow"
          >
            ▶
          </button>
        </div>
      )}

      {loading && <p>Loading games...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && gamesToShow.length === 0 && <p>No games available.</p>}
  
      {!loading && !error && gamesToShow.length > 0 && (
        <ul className="cfb-games-list">
          {gamesToShow.map((game) => (
            <li
              key={game.gameId}
              className={`cfb-game-item ${scoreChanges[game.gameId] ? "score-changed" : ""}`}
            >
              <img src={game.awayLogo} alt={game.awayName} className="team-logo" />
              <span className="team-name">
                {isMobile ? game.awayAbbr : game.awayName}{" "}
                {game.awayRank > 0 && <span className="team-rank">{game.awayRank}</span>}
              </span>
              <span className="game-score">
                {game.state === "in" || game.state === "post"
                  ? `${game.awayScore} - ${game.gameStatus} - ${game.homeScore}`
                  : game.dateTime}
              </span>
              <span className="team-name">
                {game.homeRank > 0 && <span className="team-rank">{game.homeRank} </span>}
                {isMobile ? game.homeAbbr : game.homeName}
              </span>
              <img src={game.homeLogo} alt={game.homeName} className="team-logo" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CFBGames;
