import { useState, useEffect, useRef } from "react";
import "./App.css";

function CFBGames({ isExpanded, setExpanded }) {
  const [games, setGames] = useState([]);
  const prevGamesRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreChanges, setScoreChanges] = useState({});
  const [week, setWeek] = useState(getCurrentWeek());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  function getCurrentWeek() {
    const seasonStart = new Date("2025-08-30"); 
    const diff = Math.floor((Date.now() - seasonStart) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, diff + 1);
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = () => {
    if (isExpanded === "CFB") {
      setExpanded(null);
      setWeek(getCurrentWeek());
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

        const matchups = data.events?.map((event) => {
          const competitors = event.competitions[0].competitors;
          const away = competitors[1];
          const home = competitors[0];

          const awayScore = away.score || 0;
          const homeScore = home.score || 0;

          const eventTime = event.date ? new Date(event.date) : null;
          const localTime = eventTime
            ? eventTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true })
            : "TBD";

          const state = event.status.type.state;
          const gameId = event.id;

          const awayAbbr = away.team.abbreviation || away.team.displayName.slice(0, 3);
          const homeAbbr = home.team.abbreviation || home.team.displayName.slice(0, 3);

          // Use curatedRank.current if ≤25
          const awayRank = away.curatedRank?.current && away.curatedRank.current <= 25 ? away.curatedRank.current : "";
          const homeRank = home.curatedRank?.current && home.curatedRank.current <= 25 ? home.curatedRank.current : "";

          return {
            gameId,
            awayName: away.team.displayName,
            homeName: home.team.displayName,
            awayAbbr,
            homeAbbr,
            awayScore,
            homeScore,
            time: localTime,
            awayLogo: away.team.logo,
            homeLogo: home.team.logo,
            state,
            awayRank,
            homeRank,
          };
        }) || [];

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
      <h1 className="clickable" onClick={toggleExpand}>CFB</h1>

      {isExpanded === "CFB" && (
        <div className="controls">
          <label htmlFor="week">Week:</label>
          <select id="week" value={week} onChange={(e) => setWeek(Number(e.target.value))}>
            {Array.from({ length: 18 }, (_, i) => <option key={i + 1} value={i + 1}>Week {i + 1}</option>)}
          </select>
        </div>
      )}

      {loading && <p>Loading games...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && gamesToShow.length === 0 && <p>No games available.</p>}

      {!loading && !error && gamesToShow.length > 0 && (
        <ul className="cfb-games-list">
          {gamesToShow.map((game) => (
            <li key={game.gameId} className={`cfb-game-item ${scoreChanges[game.gameId] ? "score-changed" : ""}`}>
              <img src={game.awayLogo} alt={game.awayName} className="team-logo" />
              <span className="team-name">
                {isMobile ? game.awayAbbr : game.awayName} {game.awayRank && <span className="team-rank">{game.awayRank}</span>}
              </span>
              <span className="game-score">
                {game.state === "in" || game.state === "post" ? `${game.awayScore} - ${game.homeScore}` : game.time}
              </span>
              <span className="team-name">
                {game.homeRank && <span className="team-rank">{game.homeRank} </span>}{isMobile ? game.homeAbbr : game.homeName}
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
