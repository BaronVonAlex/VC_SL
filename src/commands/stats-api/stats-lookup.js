const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { calculateBattleStats } = require('../../util/statsUtil');
const { convertToDate, convertToRelativeTime } = require('../../util/convertTime');
const generatePlayerFields = require('../../util/embedFields');
const { generateChartUrl } = require('../../util/chartUtil');
const { fetchPlayerDetails, findOrCreateUser, formatUsernameHistory } = require('../../util/playerDataUtil');
const { findOrCreateWinrateRecord } = require('../../util/winrateUtil');
const { Winrate } = require('../../util/db');

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

            // Fetch player details
            const { userId, playerData, largeAvatarUrl } = await fetchPlayerDetails(playerID);
            
            // Calculate battle stats
            const baseAttackStats = calculateBattleStats(
                playerData.baseAttackWin || 0,
                playerData.baseAttackDraw || 0,
                playerData.baseAttackLoss || 0
            );
            const baseDefenceStats = calculateBattleStats(
                playerData.baseDefenceWin || 0,
                playerData.baseDefenceDraw || 0,
                playerData.baseDefenceLoss || 0
            );
            const fleetStats = calculateBattleStats(
                playerData.fleetWin || 0,
                playerData.fleetDraw || 0,
                playerData.fleetLoss || 0
            );

            const playingSince = convertToDate(playerData.since || 0);
            const lastSeen = convertToRelativeTime(playerData.seen || 0);

            const fleetWinColor = fleetStats.winratePercent;
            const embedColor = getColor(fleetWinColor);

            // Find or create user
            const user = await findOrCreateUser(playerID, playerData.alias);

            // Fetch historical winrate data for chart generation
            const historicalData = await Winrate.findAll({
                where: { userId: playerID },
                order: [['month', 'ASC']]
            });

            // Generate the chart URL using historical data
            const chartUrl = await generateChartUrl(playerID, { historical: historicalData });

            // Format username history
            const formattedUsernameHistory = formatUsernameHistory(user);

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(playerData.alias)
                .setThumbnail(largeAvatarUrl)
                .addFields(generatePlayerFields(playerData, baseAttackStats, baseDefenceStats, fleetStats, playingSince, lastSeen, formattedUsernameHistory))
                .setTimestamp()
                .setImage(chartUrl);

            // Store User and Winrate Information in Database
            await findOrCreateWinrateRecord(playerID, baseAttackStats.winratePercent, baseDefenceStats.winratePercent, fleetStats.winratePercent);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching player data - ', error.message);
            try {
                await interaction.editReply('Player Data is not available');
            } catch (editError) {
                console.error('Failed to edit reply:', editError);
            }
        }
    },
};
