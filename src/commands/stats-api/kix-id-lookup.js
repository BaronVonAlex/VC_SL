const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { calculateBattleStats } = require('../../util/statsUtil');
const { convertToDate, convertToRelativeTime } = require('../../util/convertTime')
const { fetchPlayerStats, fetchUserAvatar } = require('../../util/api');
const generatePlayerFields = require('../../util/embedFields');
const { generateChartUrl } = require('../../util/chartUtil');
const { fetchPlayerDetails, findOrCreateUser, formatUsernameHistory } = require('../../util/playerDataUtil');
const { findOrCreateWinrateRecord } = require('../../util/winrateUtil');
const { Winrate } = require('../../util/db');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kix_id')
        .setDescription('player stats by KIXEYE ID.')
        .addStringOption(option =>
            option.setName('kixid')
                .setDescription('Kixeye user ID')
                .setRequired(true)
        ),

    async run({ interaction }) {
        const rawKixeyeID = interaction.options.getString('kixid');
        console.log('Kixeye ID: ', rawKixeyeID);

        try {
            await interaction.deferReply();

            // Fetch player stats using Kixeye ID
            const playerData = await fetchPlayerStats(rawKixeyeID);
            const playerID = playerData.playerId; // Extract playerId from the response

            // Fetch player details
            const { largeAvatarUrl } = await fetchPlayerDetails(playerID);

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
            await interaction.editReply('Player Data is not available');
        }
    },
};