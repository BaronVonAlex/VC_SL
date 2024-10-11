// statsUtil.js

/**
 * Calculate total battles and winrate percentage.
 * @param {number} wins - The number of wins.
 * @param {number} draws - The number of draws.
 * @param {number} losses - The number of losses.
 * @returns {Object} - An object with total battles and winrate percentage.
 */
function calculateBattleStats(wins, draws, losses) {
    const totalBattles = wins + draws + losses;
    const winratePercent = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;

    // Handle K/D ratio; if no losses, return K/D as wins (no deaths)
    const kdRatio = losses > 0 ? (wins / losses).toFixed(2) : wins.toFixed(2);

    return {
        totalBattles,
        winratePercent: winratePercent.toFixed(2), // Keep two decimal points
        kdRatio,
    };
}

module.exports = {
    calculateBattleStats,
};
