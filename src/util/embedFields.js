const getPlayerStat = (data, statName, defaultValue = 0) => {
    return data[statName] !== undefined ? data[statName] : defaultValue;
};

function generatePlayerFields(playerData, baseAttackStats, baseDefenceStats, fleetStats, playingSince, lastSeen, formattedUsernameHistory) {
    return [
        { name: ':identification_card: Player ID', value: String(getPlayerStat(playerData, 'playerId')), inline: true },
        { name: ':coin: Player Name', value: String(playerData.alias), inline: true },
        { name: ':page_with_curl: Previous Names', value: formattedUsernameHistory, inline: false },
        { name: ':beginner: Level', value: String(getPlayerStat(playerData, 'level')), inline: true },
        { name: ':medal: Medals', value: String(getPlayerStat(playerData, 'medals')), inline: true },
        { name: ':ringed_planet: Planet', value: String(getPlayerStat(playerData, 'planet')), inline: true },
        { name: ':desktop: Playing Since', value: playingSince, inline: true },
        { name: ':hourglass: Last Seen', value: lastSeen, inline: true },
        {
            name: `:firecracker: Base Attack: ${baseAttackStats.totalBattles}, ${baseAttackStats.winratePercent}%, ${String(baseAttackStats.kdRatio)} K/D`,
            value: `Win: ${String(getPlayerStat(playerData, 'baseAttackWin'))}, Draws: ${String(getPlayerStat(playerData, 'baseAttackDraw'))}, Loss: ${String(getPlayerStat(playerData, 'baseAttackLoss'))}`,
            inline: false
        },
        {
            name: `:shield: Base Defense: ${baseDefenceStats.totalBattles}, ${baseDefenceStats.winratePercent}%, ${String(baseDefenceStats.kdRatio)} K/D`,
            value: `Win: ${String(getPlayerStat(playerData, 'baseDefenceWin'))}, Draws: ${String(getPlayerStat(playerData, 'baseDefenceDraw'))}, Loss: ${String(getPlayerStat(playerData, 'baseDefenceLoss'))}`,
            inline: false
        },
        {
            name: `:crossed_swords: Fleet vs Fleet: ${fleetStats.totalBattles}, ${fleetStats.winratePercent}%, ${String(fleetStats.kdRatio)} K/D`,
            value: `Win: ${String(getPlayerStat(playerData, 'fleetWin'))}, Draws: ${String(getPlayerStat(playerData, 'fleetDraw'))}, Loss: ${String(getPlayerStat(playerData, 'fleetLoss'))}`,
            inline: false
        }
    ];
}

module.exports = generatePlayerFields;
