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

function NFLGameDetail({ game, onBack }) {
  const [liveGame, setLiveGame] = useState(game);
  const [activeTab, setActiveTab] = useState("overview");
  const [hoverBack, setHoverBack] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (game.state !== "in") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${game.gameId}`
        );
        const data = await res.json();
        if (data.header?.competitions?.[0]) {
          const competition = data.header.competitions[0];
          const updatedGame = {
            ...game,
            awayScore: competition.competitors[1].score,
            homeScore: competition.competitors[0].score,
            state: data.header.status.type.state,
            gameStatus: data.header.status.type.shortDetail,
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
    dateTime,
    awayLogo,
    homeLogo,
    awayAbbr,
    homeAbbr,
    gameStatus,
  } = liveGame;

  const isPreGame = state === "pre";
  const isFinal = state === "post";
  const isInProgress = state === "in";

  return (
    <div style={styles.container}>
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

      <div style={styles.headerGradient}>
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "row" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "0.75rem" : "2rem",
        }}>
          <div style={styles.teamSection(isMobile)}>
            <img src={awayLogo} alt={awayName} style={styles.teamLogo(isMobile)} />
            <div style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", fontWeight: "700" }}>{awayAbbr}</div>
            <div style={{ fontSize: isMobile ? "0.75rem" : "0.85rem", opacity: 0.6, fontWeight: "500" }}>{awayName}</div>
          </div>

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
              {isPreGame && `${dateTime}`}
              {isInProgress && `${gameStatus}`}
              {isFinal && "Final"}
            </div>
          </div>

          <div style={styles.teamSection(isMobile)}>
            <img src={homeLogo} alt={homeName} style={styles.teamLogo(isMobile)} />
            <div style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", fontWeight: "700" }}>{homeAbbr}</div>
            <div style={{ fontSize: isMobile ? "0.75rem" : "0.85rem", opacity: 0.6, fontWeight: "500" }}>{homeName}</div>
          </div>
        </div>
      </div>

      {isInProgress && (
        <div style={{
          ...styles.gradientBackground(["#3b82f6", "#2563eb"]),
          border: "1px solid rgba(59,130,246,0.3)",
          color: "white",
        }}>
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

          <div style={{
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "700",
          }}>
            {gameStatus}
          </div>
        </div>
      )}

      <div style={styles.tabContainer}>
        {["overview", "stats"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={styles.tabButton(activeTab === tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Game Information</div>
            <div style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.8 }}>
              {isPreGame && `Kickoff: ${dateTime}`}
              {isInProgress && `Current Status: ${gameStatus}`}
              {isFinal && `Final Score: ${awayAbbr} ${awayScore} - ${homeScore} ${homeAbbr}`}
            </div>
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, textAlign: "center" }}>Game Statistics</div>
          <div style={{
            textAlign: "center",
            padding: "2rem",
            opacity: 0.6,
            fontSize: "0.95rem",
          }}>
            Detailed statistics will be available during and after the game.
          </div>
        </div>
      )}
    </div>
  );
}

export default NFLGameDetail;