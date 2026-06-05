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
  teamLogoHover: {
    transform: "scale(1.05)",
  },
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
  diamondContainer: {
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto",
  },
  base: (active) => ({
    position: "absolute",
    top: "50%",
    width: "30px",
    height: "30px",
    background: active ? "#34d399" : "rgba(255,255,255,0.3)",
    border: active ? "3px solid #10b981" : "2px solid rgba(255,255,255,0.5)",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    transform: "translateY(-50%)",
    boxShadow: active ? "0 4px 12px rgba(16,185,129,0.4)" : "none",
  }),
  baseSecond: {
    left: "50%",
    transform: "translateX(-50%) translateY(-50%) rotate(45deg)",
  },
  baseThird: {
    top: "50%",
    left: "0",
    transform: "translateY(-50%) translateX(0) rotate(45deg)",
  },
  baseFirst: {
    top: "50%",
    right: "0",
    transform: "translateY(-50%) translateX(0) rotate(45deg)",
  },
  homePlate: {
    position: "absolute",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "18px solid transparent",
    borderRight: "18px solid transparent",
    borderBottom: "24px solid rgba(255,255,255,0.5)",
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
    marginLeft: "14%"
  },
};

function MLBGameDetail({ game, onBack }) {
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
          `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary?event=${game.gameId}`
        );
        const data = await res.json();
        if (data.header?.competitions?.[0]) {
          const competition = data.header.competitions[0];
          const updatedGame = {
            ...game,
            awayScore: competition.competitors[1].score,
            homeScore: competition.competitors[0].score,
            state: data.header.status.type.state,
            inning: data.header.status.type.detail,
            vars: {
              ...game.vars,
              balls: competition.situation?.balls ?? 0,
              strikes: competition.situation?.strikes ?? 0,
              outs: data.header.competitions[0].outsText || "0",
              onFirst: competition.situation?.onFirst ?? false,
              onSecond: competition.situation?.onSecond ?? false,
              onThird: competition.situation?.onThird ?? false,
              currentBatter: competition.situation?.batter?.athlete?.displayName || "",
              currentPitcher: competition.situation?.pitcher?.athlete?.displayName || "",
              lastPlay: competition.situation?.lastPlay?.text || ""
            }
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
          flexDirection: isMobile ? "row" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "0.75rem" : "2rem",
        }}>
          {/* Away Team */}
          <div style={styles.teamSection(isMobile)}>
            <img src={awayLogo} alt={awayName} style={styles.teamLogo(isMobile)} />
            <div style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", fontWeight: "700" }}>{awayAbbr}</div>
            <div style={{ fontSize: isMobile ? "0.75rem" : "0.85rem", opacity: 0.6, fontWeight: "500" }}>{vars.awayOverallRecord}</div>
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
              {isInProgress && `${liveGame.inning}`}
              {isFinal && "Final"}
            </div>
          </div>

          {/* Home Team */}
          <div style={styles.teamSection(isMobile)}>
            <img src={homeLogo} alt={homeName} style={styles.teamLogo(isMobile)} />
            <div style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", fontWeight: "700" }}>{homeAbbr}</div>
            <div style={{ fontSize: isMobile ? "0.75rem" : "0.85rem", opacity: 0.6, fontWeight: "500" }}>{vars.homeOverallRecord}</div>
          </div>
        </div>

        {/* Game Status Info */}
        <div style={{
          marginTop: "1.5rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid #f0f0f0",
          textAlign: "center",
          fontSize: "0.9rem",
          opacity: 0.7,
        }}>
          <div style={{ fontWeight: "500" }}>{vars.venue}</div>
          {vars.temperature && (
            <div style={{ marginTop: "0.25rem" }}>
              {vars.futureWeather} • {vars.temperature}°F
            </div>
          )}
        </div>
      </div>

      {/* Live Game Situation */}
      {isInProgress && (
        <div style={{
          ...styles.gradientBackground(["#f59e0b", "#d97706"]),
          border: "1px solid rgba(245,158,11,0.3)",
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

          {/* Diamond Visualization */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1.5rem",
            gap: "3rem",
            flexWrap: "wrap",
          }}>
            {/* Bases */}
            <div style={styles.diamondContainer}>
              <div style={{ ...styles.base(liveGame.vars?.onSecond), ...styles.baseSecond }} />
              <div style={{ ...styles.base(liveGame.vars?.onThird), ...styles.baseThird }} />
              <div style={{ ...styles.base(liveGame.vars?.onFirst), ...styles.baseFirst }} />
              <div style={styles.homePlate} />
            </div>

            {/* Count */}
            <div style={styles.count}>
              <div style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "0.5rem", fontWeight: "600", letterSpacing: "0.1em" }}>COUNT</div>
              <div style={styles.countNumber}>{vars.balls}-{vars.strikes}</div>
              <div style={{ fontSize: "1rem", marginTop: "0.5rem", fontWeight: "600" }}>{vars.outs} Outs</div>
            </div>
          </div>

          {/* Batter vs Pitcher */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "1rem",
            alignItems: "center",
            marginBottom: vars.lastPlay ? "1.5rem" : "0",
          }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: "600", letterSpacing: "0.05em" }}>BATTING</div>
              <div style={{ fontSize: "1.05rem", fontWeight: "700", marginTop: "0.25rem" }}>{vars.currentBatter || "—"}</div>
            </div>
            <div style={{ fontSize: "1.2rem", opacity: 0.5, padding: "0 1rem", fontWeight: "700" }}>VS</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: "600", letterSpacing: "0.05em" }}>PITCHING</div>
              <div style={{ fontSize: "1.05rem", fontWeight: "700", marginTop: "0.25rem" }}>{vars.currentPitcher || "—"}</div>
            </div>
          </div>

          {/* Last Play */}
          {vars.lastPlay && (
            <div style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              fontSize: "0.9rem",
              lineHeight: "1.6",
              opacity: 0.9,
            }}>
              <strong>Last Play:</strong> {vars.lastPlay}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {["overview", "matchup", "stats", "leaders"].map(tab => (
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
            {/* Probable Pitchers */}
            {vars.probableAwayStarter && vars.probableHomeStarter && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>Probable Pitchers</div>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>{vars.probableAwayStarter}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "0.25rem" }}>{vars.probableAwayStarterStats}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>{vars.probableHomeStarter}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "0.25rem" }}>{vars.probableHomeStarterStats}</div>
                </div>
              </div>
            )}

            {/* Betting Odds */}
            {vars.homeOdds && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>Betting Odds</div>
                <div style={styles.statLine}>
                  <span style={{ fontWeight: "500" }}>{awayAbbr}</span>
                  <span style={styles.statValue}>{vars.awayOdds}</span>
                </div>
                <div style={styles.statLine}>
                  <span style={{ fontWeight: "500" }}>{homeAbbr}</span>
                  <span style={styles.statValue}>{vars.homeOdds}</span>
                </div>
                {vars.overUnder && (
                  <div style={{ ...styles.statLine, marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f0f0f0" }}>
                    <span style={{ fontWeight: "500" }}>O/U</span>
                    <span style={styles.statValue}>{vars.overUnder}</span>
                  </div>
                )}
              </div>
            )}

            {/* Game Summary */}
            {vars.gameSummary && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>Game Summary</div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.8 }}>{vars.gameSummary}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "matchup" && isPreGame && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {/* Away Starter */}
          <div style={styles.card}>
            <div style={styles.leaderHeader}>
              <img src={awayLogo} alt={awayName} style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
              {awayName}
            </div>
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.75rem" }}>
                {vars.probableAwayStarter}
              </div>
              <div style={{
                display: "inline-block",
                background: "#f0f0f0",
                padding: "0.5rem 1.25rem",
                borderRadius: "24px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}>
                {vars.probableAwayStarterStats}
              </div>
            </div>
          </div>

          {/* Home Starter */}
          <div style={styles.card}>
            <div style={styles.leaderHeader}>
              <img src={homeLogo} alt={homeName} style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
              {homeName}
            </div>
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.75rem" }}>
                {vars.probableHomeStarter}
              </div>
              <div style={{
                display: "inline-block",
                background: "#f0f0f0",
                padding: "0.5rem 1.25rem",
                borderRadius: "24px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}>
                {vars.probableHomeStarterStats}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, textAlign: "center" }}>Season Statistics</div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {[
              { label: "Overall Record", away: vars.awayOverallRecord, home: vars.homeOverallRecord },
              { label: "Home Record", away: vars.awayAwayRecord, home: vars.homeHomeRecord },
              { label: "Away Record", away: vars.awayAwayRecord, home: vars.homeAwayRecord },
            ].map((stat, idx) => (
              <div key={idx} style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "1rem",
                background: idx % 2 === 0 ? "#fafafa" : "transparent",
                padding: "1rem",
                borderRadius: "12px",
                alignItems: "center",
              }}>
                <div style={{ textAlign: "right", fontWeight: "700", fontSize: "1rem" }}>{stat.away}</div>
                <div style={{ ...styles.statLabel, textAlign: "center", minWidth: "120px" }}>{stat.label}</div>
                <div style={{ textAlign: "left", fontWeight: "700", fontSize: "1rem" }}>{stat.home}</div>
              </div>
            ))}
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

export default MLBGameDetail;