const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { generateChartUrl } = require('../../util/chartUtil');
const { calculateBattleStats } = require('../../util/statsUtil');
const { convertToDate, convertToRelativeTime } = require('../../util/convertTime');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('players stats by in-game ID.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The player ID')
                .setRequired(true)
        ),
        
    async run({ interaction }) {
        const rawPlayerID = interaction.options.getString('id');
        const playerID = parseInt(rawPlayerID.replace(/\D/g, ''), 10);
        console.log('player ID: ', playerID);

        try {
            await interaction.deferReply();

            // First request to fetch userId using playerId
            const userGameApiUrl = `${process.env.USER_GAME_API_URL}${playerID}&limit=100`;
            const firstResponse = await axios.get(userGameApiUrl);
            const userGameData = firstResponse.data[0];
            const userId = userGameData.userId;

            // Second request to fetch player stats using userId
            const statsApiUrl = `${process.env.STATS_API_URL}${userId}/games/386487958112133`;
            const secondResponse = await axios.get(statsApiUrl);
            const playerData = secondResponse.data;

            // Function to safely get player stats with default values
            const getPlayerStat = (data, statName, defaultValue = 0) => {
                return data[statName] !== undefined ? data[statName] : defaultValue;
            };

            // Calculate battle stats with default values
            const baseAttackStats = calculateBattleStats(
                getPlayerStat(playerData, 'baseAttackWin'),
                getPlayerStat(playerData, 'baseAttackDraw'),
                getPlayerStat(playerData, 'baseAttackLoss')
            );
            const baseDefenceStats = calculateBattleStats(
                getPlayerStat(playerData, 'baseDefenceWin'),
                getPlayerStat(playerData, 'baseDefenceDraw'),
                getPlayerStat(playerData, 'baseDefenceLoss')
            );
            const fleetStats = calculateBattleStats(
                getPlayerStat(playerData, 'fleetWin'),
                getPlayerStat(playerData, 'fleetDraw'),
                getPlayerStat(playerData, 'fleetLoss')
            );

            const playingSince = convertToDate(getPlayerStat(playerData, 'since'));
            const lastSeen = convertToRelativeTime(getPlayerStat(playerData, 'seen'));

            const fleetWinColor = fleetStats.winratePercent;
            const embedColor = getColor(fleetWinColor);

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(playerData.alias)
                .addFields(
                    { name: ':identification_card: Player ID', value: String(getPlayerStat(playerData, 'playerId')), inline: true },
                    { name: ':coin: Player Name', value: String(playerData.alias), inline: false },
                    { name: ':beginner: Level', value: String(getPlayerStat(playerData, 'level')), inline: true },
                    { name: ':medal: Medals', value: String(getPlayerStat(playerData, 'medals')), inline: true },
                    { name: ':ringed_planet: Planet', value: String(getPlayerStat(playerData, 'planet')), inline: true },
                    { name: ':desktop: Playing Since', value: playingSince, inline: true },
                    { name: ':hourglass: Last Seen', value: lastSeen, inline: true },
                    { name: `:firecracker: Base Attack: ${baseAttackStats.totalBattles}, ${baseAttackStats.winratePercent}%, ${String(baseAttackStats.kdRatio)} K/D`, 
                        value: `Win: ${String(getPlayerStat(playerData, 'baseAttackWin'))}, Draws: ${String(getPlayerStat(playerData, 'baseAttackDraw'))}, Loss: ${String(getPlayerStat(playerData, 'baseAttackLoss'))}`, 
                        inline: false },
                    { name: `:shield: Base Defense: ${baseDefenceStats.totalBattles}, ${baseDefenceStats.winratePercent}%, ${String(baseDefenceStats.kdRatio)} K/D`, 
                        value: `Win: ${String(getPlayerStat(playerData, 'baseDefenceWin'))}, Draws: ${String(getPlayerStat(playerData, 'baseDefenceDraw'))}, Loss: ${String(getPlayerStat(playerData, 'baseDefenceLoss'))}`, 
                        inline: false },
                    { name: `:crossed_swords: Fleet vs Fleet: ${fleetStats.totalBattles}, ${fleetStats.winratePercent}%, ${String(fleetStats.kdRatio)} K/D`, 
                        value: `Win: ${String(getPlayerStat(playerData, 'fleetWin'))}, Draws: ${String(getPlayerStat(playerData, 'fleetDraw'))}, Loss: ${String(getPlayerStat(playerData, 'fleetLoss'))}`, 
                        inline: false }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching player data - ', error.message);
            await interaction.editReply('Player Data is not available');
        }
    },
};
