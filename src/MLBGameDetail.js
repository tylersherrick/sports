import React, { useState, useEffect } from "react";

const styles = {
  container: {
    padding: "1rem",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Arial', sans-serif",
    color: "#222", // dark text for contrast
    backgroundColor: "#f9f9f9", // light background
  },
  backButton: {
    marginBottom: "1.5rem",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    background: "rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
    color: "#222",
  },
  backButtonHover: {
    background: "rgba(0,0,0,0.1)",
  },
  headerGradient: {
    background: "linear-gradient(135deg, #e0e0e0, #f0f0f0)", // light gradient
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
  teamSection: {
    flex: 1,
    minWidth: "200px",
    textAlign: "center",
  },
  teamLogo: {
    width: "80px",
    height: "80px",
    marginBottom: "0.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  teamLogoHover: {
    transform: "scale(1.05)",
  },
  scoreContainer: {
    textAlign: "center",
  },
  scoreText: {
    fontSize: "3rem",
    fontWeight: "700",
    lineHeight: 1,
  },
  scoreVS: {
    fontSize: "1.5rem",
    opacity: 0.5,
  },
  scoreStatus: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    opacity: 0.8,
    fontWeight: "500",
  },
  gradientBackground: (colors) => ({
    background: `linear-gradient(135deg, ${colors.join(', ')})`,
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "2rem",
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
    background: active ? "#4ade80" : "rgba(0,0,0,0.1)",
    border: "2px solid rgba(0,0,0,0.3)",
    borderRadius: "4px",
    transition: "all 0.3s",
    transform: "translateY(-50%)",
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
    borderLeft: "15px solid transparent",
    borderRight: "15px solid transparent",
    borderBottom: "20px solid rgba(0,0,0,0.3)",
  },
  count: {
    textAlign: "center",
  },
  countNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  tabContainer: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  tabButton: (active) => ({
    padding: "0.75rem 1.5rem",
    background: active ? "rgba(0,0,0,0.05)" : "transparent",
    border: "none",
    borderBottom: active ? "2px solid #4ade80" : "2px solid transparent",
    color: active ? "#222" : "rgba(0,0,0,0.6)",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    textTransform: "capitalize",
    transition: "all 0.2s",
  }),
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    border: "1px solid rgba(0,0,0,0.1)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "0.8rem",
    opacity: 0.7,
    marginBottom: "1rem",
  },
  statLine: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
  },
  statLabel: {
    fontSize: "0.85rem",
    opacity: 0.6,
    fontWeight: "500",
  },
  statValue: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  leaderHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
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
  flexDirection: isMobile ? "column" : "row",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: isMobile ? "1rem" : "0",
}}>

          {/* Away Team */}
          <div style={styles.teamSection}>
            <img src={awayLogo} alt={awayName} style={styles.teamLogo} />
            <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>{awayAbbr}</div>
            <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>{vars.awayOverallRecord}</div>
          </div>

          {/* Score */}
          <div style={styles.scoreContainer}>
            {isFinal || isInProgress ? (
              <div style={styles.scoreText}>
                <span style={{ color: parseInt(awayScore) > parseInt(homeScore) ? "#4ade80" : "#222" }}>
                  {awayScore}
                </span>
                {" - "}
                <span style={{ color: parseInt(homeScore) > parseInt(awayScore) ? "#4ade80" : "#222" }}>
                  {homeScore}
                </span>
              </div>
            ) : (
              <div style={{ fontSize: "1.5rem", opacity: 0.5 }}>VS</div>
            )}
            <div style={styles.scoreStatus}>
              {isPreGame && `${time}`}
              {isInProgress && `${liveGame.inning}`}
              {isFinal && "Final"}
            </div>
          </div>

          {/* Home Team */}
          <div style={styles.teamSection}>
            <img src={homeLogo} alt={homeName} style={styles.teamLogo} />
            <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>{homeAbbr}</div>
            <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>{vars.homeOverallRecord}</div>
          </div>
        </div>

        {/* Game Status Info */}
        <div style={{
          marginTop: "1.5rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          textAlign: "center",
          fontSize: "0.9rem",
          opacity: 0.8,
        }}>
          <div>{vars.venue}</div>
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
          ...styles.gradientBackground(["#fbbf24", "#f59e0b"]), // warm gradient
          border: "1px solid rgba(251,191,36,0.3)",
        }}>
          {/* Live Badge */}
          <div style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>🔴 Live</div>

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
              {/* Second Base */}
              <div style={{
                ...styles.base(liveGame.vars?.onSecond),
                ...styles.baseSecond
              }} />
              {/* Third Base */}
              <div style={{
                ...styles.base(liveGame.vars?.onThird),
                ...styles.baseThird
              }} />
              {/* First Base */}
              <div style={{
                ...styles.base(liveGame.vars?.onFirst),
                ...styles.baseFirst
              }} />
              {/* Home Plate */}
              <div style={styles.homePlate} />
            </div>

            {/* Count */}
            <div style={styles.count}>
              <div style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.5rem" }}>COUNT</div>
              <div style={styles.countNumber}>{vars.balls}-{vars.strikes}</div>
              <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>{vars.outs} Outs</div>
            </div>
          </div>

          {/* Batter vs Pitcher */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}>
            {/* Batter */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>BATTING</div>
              <div style={{ fontSize: "1rem", fontWeight: "600" }}>{vars.currentBatter || "—"}</div>
            </div>
            {/* VS */}
            <div style={{ fontSize: "1.2rem", opacity: 0.5, padding: "0 1rem" }}>VS</div>
            {/* Pitcher */}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>PITCHING</div>
              <div style={{ fontSize: "1rem", fontWeight: "600" }}>{vars.currentPitcher || "—"}</div>
            </div>
          </div>

          {/* Last Play */}
          {vars.lastPlay && (
            <div style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              fontSize: "0.9rem",
              fontStyle: "italic",
              opacity: 0.8,
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
          {/* Game Info Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {/* Probable Pitchers */}
            {vars.probableAwayStarter && vars.probableHomeStarter && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>PROBABLE PITCHERS</div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>{vars.probableAwayStarter}</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{vars.probableAwayStarterStats}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>{vars.probableHomeStarter}</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{vars.probableHomeStarterStats}</div>
                </div>
              </div>
            )}

            {/* Betting Odds */}
            {vars.homeOdds && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>BETTING ODDS</div>
                <div style={styles.statLine}>
                  <span>{awayAbbr}</span>
                  <span style={styles.statValue}>{vars.awayOdds}</span>
                </div>
                <div style={styles.statLine}>
                  <span>{homeAbbr}</span>
                  <span style={styles.statValue}>{vars.homeOdds}</span>
                </div>
                {vars.overUnder && (
                  <div style={{ ...styles.statLine, marginTop: "0.75rem" }}>
                    <span>O/U</span>
                    <span style={styles.statValue}>{vars.overUnder}</span>
                  </div>
                )}
              </div>
            )}

            {/* Game Summary */}
            {vars.gameSummary && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>GAME SUMMARY</div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>{vars.gameSummary}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "matchup" && isPreGame && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {/* Away Starter */}
          <div style={styles.card}>
            <div style={styles.leaderHeader}>
              <img src={awayLogo} alt={awayName} style={{ width: "40px", height: "40px", borderRadius: "4px" }} />
              {awayName} Leaders
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.8" }}>
              Statistics and team leaders will be available from the API's competitor.leaders array once properly mapped.
            </div>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {vars.probableAwayStarter}
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(0,0,0,0.05)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                }}
              >
                {vars.probableAwayStarterStats}
              </div>
            </div>
            <img src={awayLogo} alt={awayName} style={{ width: "60px", height: "60px", margin: "1rem auto 0" }} />
          </div>

          {/* Home Starter */}
          <div style={styles.card}>
            <div style={styles.leaderHeader}>
              <img src={homeLogo} alt={homeName} style={{ width: "40px", height: "40px", borderRadius: "4px" }} />
              {homeName} Leaders
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.8" }}>
              Statistics and team leaders will be available from the API's competitor.leaders array once properly mapped.
            </div>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {vars.probableHomeStarter}
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(0,0,0,0.05)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                }}
              >
                {vars.probableHomeStarterStats}
              </div>
            </div>
            <img src={homeLogo} alt={homeName} style={{ width: "60px", height: "60px", margin: "1rem auto 0" }} />
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div style={styles.card}>
          <div style={{ ...styles.cardTitle, textAlign: "center" }}>Season Statistics</div>
          <div style={{ display: "grid", gap: "1rem" }}>
            {[
              { label: "Record", away: vars.awayOverallRecord, home: vars.homeOverallRecord },
              { label: "Home Record", away: vars.awayAwayRecord, home: vars.homeHomeRecord },
              { label: "Away Record", away: vars.awayAwayRecord, home: vars.homeAwayRecord },
            ].map((stat, idx) => (
              <div key={idx} style={{
                ...styles.statLine,
                background: idx % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent",
                padding: "1rem",
                borderRadius: "8px",
              }}>
                <div style={{ textAlign: "right", fontWeight: "600" }}>{stat.away}</div>
                <div style={styles.statLabel}>{stat.label}</div>
                <div style={{ textAlign: "left", fontWeight: "600" }}>{stat.home}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "leaders" && (
        <div style={{ display: "grid", gap: "2rem" }}>
          {/* Leaders for Away Team */}
          <div style={styles.card}>
            <div style={styles.leaderHeader}>
              <img src={awayLogo} alt={awayName} style={{ width: "40px", height: "40px", borderRadius: "4px" }} />
              {awayName} Leaders
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.8" }}>
              Statistics and team leaders will be available from the API's competitor.leaders array once properly mapped.
            </div>
          </div>
          
          {/* Leaders for Home Team */}
          <div style={styles.card}>
            <div style={styles.leaderHeader}>
              <img src={homeLogo} alt={homeName} style={{ width: "40px", height: "40px", borderRadius: "4px" }} />
              {homeName} Leaders
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.8" }}>
              Statistics and team leaders will be available from the API's competitor.leaders array once properly mapped.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MLBGameDetail;