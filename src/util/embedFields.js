const getPlayerStat = (data, statName, defaultValue = 0) => {
    return data[statName] !== undefined ? data[statName] : defaultValue;
};

function generatePlayerFields(playerData, baseAttackStats, baseDefenceStats, fleetStats, playingSince, lastSeen, formattedUsernameHistory) {
    return [
        { name: '<:CargoLedgers:1300126103998042185> Player ID', value: String(getPlayerStat(playerData, 'playerId')), inline: true },
        { name: '<:VCIcon:1300134586717569149> Player Name', value: String(playerData.alias), inline: true },
        { name: '<:Intel:1300137270950625392> Previous Names', value: formattedUsernameHistory, inline: false },
        { name: '<:ModuleUpgrade:1300128880459517992> Level', value: String(getPlayerStat(playerData, 'level')), inline: true },
        { name: '<:Medal_Icon:1305439281334063104> Medals', value: String(getPlayerStat(playerData, 'medals')), inline: true },
        { name: ':ringed_planet: Planet', value: String(getPlayerStat(playerData, 'planet')), inline: true },
        { name: '<:Time:1300129476780363908> Playing Since', value: playingSince, inline: true },
        { name: '<:TimeTokens:1300134836425719889> Last Seen', value: lastSeen, inline: true },
        {
            name: `<:CollateralStat:1300135586602025062> Base Attack: ${baseAttackStats.totalBattles}, ${baseAttackStats.winratePercent}%, ${String(baseAttackStats.kdRatio)} K/D`,
            value: `Win: ${String(getPlayerStat(playerData, 'baseAttackWin'))}, Draws: ${String(getPlayerStat(playerData, 'baseAttackDraw'))}, Loss: ${String(getPlayerStat(playerData, 'baseAttackLoss'))}`,
            inline: false
        },
        {
            name: `<:Modules_1:1300138611441795072> Base Defense: ${baseDefenceStats.totalBattles}, ${baseDefenceStats.winratePercent}%, ${String(baseDefenceStats.kdRatio)} K/D`,
            value: `Win: ${String(getPlayerStat(playerData, 'baseDefenceWin'))}, Draws: ${String(getPlayerStat(playerData, 'baseDefenceDraw'))}, Loss: ${String(getPlayerStat(playerData, 'baseDefenceLoss'))}`,
            inline: false
        },
        {
            name: `<:WarFleet5:1300134200556523611> Fleet vs Fleet: ${fleetStats.totalBattles}, ${fleetStats.winratePercent}%, ${String(fleetStats.kdRatio)} K/D`,
            value: `Win: ${String(getPlayerStat(playerData, 'fleetWin'))}, Draws: ${String(getPlayerStat(playerData, 'fleetDraw'))}, Loss: ${String(getPlayerStat(playerData, 'fleetLoss'))}`,
            inline: false
        }
    ];
}

module.exports = generatePlayerFields;
