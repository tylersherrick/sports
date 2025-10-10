import React, { useState, useEffect } from "react";

const styles = {
  container: {
    padding: "1rem",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#1a1a1a",
    backgroundColor: "#f5f5f7",
    minHeight: "100vh",
  },
  backButton: {
    marginBottom: "1.5rem",
    padding: "0.75rem 1.25rem",
    fontSize: "0.95rem",
    background: "white",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#1a1a1a",
    fontWeight: "500",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  backButtonHover: {
    background: "#fafafa",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
  },
  headerGradient: {
    background: "white",
    borderRadius: "20px",
    padding: "2rem",
    marginBottom: "1.5rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    border: "1px solid #e5e5e5",
  },
  teamSection: (isMobile) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: isMobile ? "0.25rem" : "0.5rem",
    minWidth: isMobile ? "70px" : "120px",
    flex: "0 1 auto",
  }),
  teamLogo: (isMobile) => ({
    width: isMobile ? "50px" : "80px",
    height: isMobile ? "50px" : "80px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
    objectFit: "contain",
  }),
  scoreContainer: (isMobile) => ({
    textAlign: "center",
    padding: isMobile ? "0 0.5rem" : "0 2rem",
    flex: "0 1 auto",
  }),
  scoreText: (isMobile) => ({
    fontSize: isMobile ? "2rem" : "3.5rem",
    fontWeight: "700",
    lineHeight: 1,
    letterSpacing: "-0.02em",
  }),
  gradientBackground: (colors) => ({
    background: `linear-gradient(135deg, ${colors.join(', ')})`,
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  }),
  rinkContainer: {
    position: "relative",
    width: "200px",
    height: "100px",
    margin: "0 auto",
    border: "3px solid rgba(255,255,255,0.5)",
    borderRadius: "50px",
    background: "rgba(255,255,255,0.1)",
  },
  centerLine: {
    position: "absolute",
    left: "50%",
    top: "0",
    bottom: "0",
    width: "3px",
    background: "rgba(255,255,255,0.5)",
    transform: "translateX(-50%)",
  },
  puck: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#1a1a1a",
    border: "2px solid white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  count: {
    textAlign: "center",
  },
  countNumber: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    letterSpacing: "0.05em",
  },
  tabContainer: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    borderBottom: "2px solid #e5e5e5",
    overflowX: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  tabButton: (active) => ({
    padding: "0.875rem 1.5rem",
    background: "transparent",
    border: "none",
    borderBottom: active ? "3px solid #10b981" : "3px solid transparent",
    color: active ? "#1a1a1a" : "#6b7280",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    textTransform: "capitalize",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  }),
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid #e5e5e5",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.2s ease",
  },
  cardTitle: {
    fontSize: "0.75rem",
    opacity: 0.6,
    marginBottom: "1rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  statLine: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
    alignItems: "center",
  },
  statLabel: {
    fontSize: "0.9rem",
    opacity: 0.6,
    fontWeight: "500",
  },
  statValue: {
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  leaderHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
};

function NHLGameDetail({ game, onBack }) {
  const [liveGame, setLiveGame] = useState(game);
  const [activeTab, setActiveTab] = useState("overview");
  const [hoverBack, setHoverBack] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch live updates if game is in progress
  useEffect(() => {
    if (game.state !== "in") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=${game.gameId}`
        );
        const data = await res.json();
        if (data.header?.competitions?.[0]) {
          const competition = data.header.competitions[0];
          const updatedGame = {
            ...game,
            awayScore: competition.competitors[1].score,
            homeScore: competition.competitors[0].score,
            state: data.header.status.type.state,
            period: data.header.status.type.detail,
            gameId: game.id,
            attendance: game.competitions[0].attendance,
            awayTeam: game.competitions[0].competitors[1].team.displayName,
            homeTeam: game.competitions[0].competitors[0].team.displayName,
            awayLogo: game.competitions[0].competitors[1].team.logo,
            awayScore: game.competitions[0].competitors[1].score,
            homeLogo: game.competitions[0].competitors[0].team.logo,
            homeScore: game.competitions[0].competitors[0].score,
            shortAwayTeam: game.competitions[0].competitors[1].team.abbreviation,
            shortHomeTeam: game.competitions[0].competitors[0].team.abbreviation,
            time: game.status.type.detail,
            scheduleTime: game.status.type.shortDetail,
            gameStatus: game.status.type.description,
            awayRecord: game.competitions[0].competitors[1].records[0].summary,
            homeRecord: game.competitions[0].competitors[0].records[0].summary,
            venue: game.competitions[0].venue.fullName,
            spread: game.competitions[0].odds?.[0]?.details || "",
            awayOdds: game.competitions[0].odds?.[0]?.awayTeamOdds?.moneyLine || "",
            homeOdds: game.competitions[0].odds?.[0]?.awayTeamOdds?.moneyLine || "",
          };
          setLiveGame(updatedGame);
        }
      } catch (err) {
        console.error("Failed to fetch live updates", err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [game]);

  const {
    awayName,
    homeName,
    awayScore,
    homeScore,
    state,
    time,
    awayLogo,
    homeLogo,
    awayAbbr,
    homeAbbr,
    period,
    awayRecord,
  } = liveGame;
  const isPreGame = state === "pre";
  const isFinal = state === "post";
  const isInProgress = state === "in";

  const vars = liveGame.vars;

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button
        onMouseEnter={() => setHoverBack(true)}
        onMouseLeave={() => setHoverBack(false)}
        onClick={onBack}
        style={{
          ...styles.backButton,
          ...(hoverBack ? styles.backButtonHover : {})
        }}
      >
        ← Back to Games
      </button>

      {/* Score Header */}
      <div style={styles.headerGradient}>
        {/* Teams and Score */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "0.75rem" : "2rem",
        }}>
          {/* Away Team */}
          <div style={styles.teamSection(isMobile)}>
            <img src={awayLogo} alt={awayName} style={styles.teamLogo(isMobile)} />
            <div style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", fontWeight: "700" }}>{awayAbbr}</div>
            <div style={{ fontSize: isMobile ? "0.75rem" : "0.85rem", opacity: 0.6, fontWeight: "500" }}>{game.awayRecord}</div>
          </div>

          {/* Score */}
          <div style={styles.scoreContainer(isMobile)}>
            {isFinal || isInProgress ? (
              <div style={styles.scoreText(isMobile)}>
                <span style={{ color: parseInt(awayScore) > parseInt(homeScore) ? "#10b981" : "#1a1a1a" }}>
                  {awayScore}
                </span>
                <span style={{ opacity: 0.3, fontSize: isMobile ? "1.25rem" : "2rem", margin: "0 0.5rem" }}>-</span>
                <span style={{ color: parseInt(homeScore) > parseInt(awayScore) ? "#10b981" : "#1a1a1a" }}>
                  {homeScore}
                </span>
              </div>
            ) : (
              <div style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", opacity: 0.4, fontWeight: "600" }}>VS</div>
            )}
            <div style={{
              marginTop: "0.75rem",
              fontSize: isMobile ? "0.75rem" : "0.9rem",
              opacity: 0.7,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              {isPreGame && `${time}`}
              {isInProgress && `${period}`}
              {isFinal && "Final"}
            </div>
          </div>

          {/* Home Team */}
          <div style={styles.teamSection(isMobile)}>
            <img src={homeLogo} alt={homeName} style={styles.teamLogo(isMobile)} />
            <div style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", fontWeight: "700" }}>{homeAbbr}</div>
          </div>
        </div>
      </div>

      {/* Live Game Situation */}
      {isInProgress && (
        <div style={{
          ...styles.gradientBackground(["#3b82f6", "#2563eb"]),
          border: "1px solid rgba(59,130,246,0.3)",
          color: "white",
        }}>
          {/* Live Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: "700",
            marginBottom: "1.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            background: "rgba(255,255,255,0.2)",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
          }}>
            <span style={{ 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              background: "#ef4444",
              animation: "pulse 2s infinite",
            }} />
            Live
          </div>

          {/* Rink Visualization */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1.5rem",
            gap: "3rem",
            flexWrap: "wrap",
          }}>
            {/* Simple Rink */}
            <div style={styles.rinkContainer}>
              <div style={styles.centerLine} />
              <div style={styles.puck} />
            </div>

            {/* Period Info */}
            <div style={styles.count}>
              <div style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "0.5rem", fontWeight: "600", letterSpacing: "0.1em" }}>PERIOD</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{period}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {["overview", "stats", "leaders"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={styles.tabButton(activeTab === tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}>
            {/* Game Info Card */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>Game Information</div>
              <div style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.8 }}>
                {awayName} vs {homeName}
              </div>
              <div style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.6 }}>
                {isPreGame && `Scheduled: ${time}`}
                {isInProgress && `In Progress: ${period}`}
                {isFinal && "Game Completed"}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, textAlign: "center" }}>Season Statistics</div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "1rem",
              background: "#fafafa",
              padding: "1rem",
              borderRadius: "12px",
              alignItems: "center",
            }}>
              <div style={{ textAlign: "right", fontWeight: "700", fontSize: "1rem" }}>{awayRecord}</div>
              <div style={{ ...styles.statLabel, textAlign: "center", minWidth: "120px" }}>Record</div>
              <div style={{ textAlign: "left", fontWeight: "700", fontSize: "1rem" }}>—</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "leaders" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div style={styles.card}>
            <div style={styles.leaderHeader}>
              <img src={awayLogo} alt={awayName} style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
              {awayName} Leaders
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.6, lineHeight: "1.7" }}>
              Team statistics and leaders will be available from the API's competitor.leaders array once properly mapped.
            </div>
          </div>
          
          <div style={styles.card}>
            <div style={styles.leaderHeader}>
              <img src={homeLogo} alt={homeName} style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
              {homeName} Leaders
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.6, lineHeight: "1.7" }}>
              Team statistics and leaders will be available from the API's competitor.leaders array once properly mapped.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NHLGameDetail;