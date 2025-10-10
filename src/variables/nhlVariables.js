function nhlVariables(game) {
    return {
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
    }
}

export default nhlVariables;