const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { calculateBattleStats } = require('../../util/statsUtil');
const { convertToDate, convertToRelativeTime } = require('../../util/convertTime');
const { fetchPlayerStats, fetchUserAvatar } = require('../../util/api');
const generatePlayerFields = require('../../util/embedFields');
const { generateChartUrl } = require('../../util/chartUtil');
const { fetchPlayerDetails, findOrCreateUser, formatUsernameHistory } = require('../../util/playerDataUtil');
const { findOrCreateWinrateRecord } = require('../../util/winrateUtil');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kix_id')
        .setDescription('Player stats by KIXEYE user ID.')
        .addStringOption(option =>
            option.setName('kixid')
                .setDescription('KIXEYE user ID')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year for historical winrate data (default: current year)')
                .setRequired(false)
        ),

    async run({ interaction }) {
        const rawKixeyeID = interaction.options.getString('kixid');
        const yearOption = interaction.options.getInteger('year');
        const currentYear = new Date().getFullYear();
        const targetYear = yearOption || currentYear;

        console.log('Input Kixeye ID:', rawKixeyeID);
        console.log('Target Year:', targetYear);

        let hasDeferred = false;

        try {
            await interaction.deferReply();
            hasDeferred = true;

            const statsApiUrl = `${process.env.STATS_API_URL}${rawKixeyeID}/games/${process.env.GAME_ID}`;
            const playerData = await fetchPlayerStats(rawKixeyeID);

            const playerID = playerData.playerId;
            
            const { largeAvatarUrl } = await fetchPlayerDetails(playerID);

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

            const user = await findOrCreateUser(playerID, playerData.alias);
            const chartUrl = await generateChartUrl(playerID, { year: targetYear });

            const formattedUsernameHistory = formatUsernameHistory(user);

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`${playerData.alias} - ${targetYear}`)
                .setThumbnail(largeAvatarUrl)
                .addFields(generatePlayerFields(
                    playerData,
                    baseAttackStats,
                    baseDefenceStats,
                    fleetStats,
                    playingSince,
                    lastSeen,
                    formattedUsernameHistory
                ))
                .setTimestamp()
                .setImage(chartUrl);

            await findOrCreateWinrateRecord(
                playerID,
                baseAttackStats.winratePercent,
                baseDefenceStats.winratePercent,
                fleetStats.winratePercent
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching player data -', error.message);

            if (hasDeferred) {
                try {
                    await interaction.editReply('⚠️ Player data is unavailable. The API may be down — please try again later.');
                } catch (editError) {
                    console.error('Failed to edit reply:', editError);
                }
            } else {
                try {
                    await interaction.reply({
                        content: 'Could not fetch data. Please try again later.',
                        ephemeral: true
                    });
                } catch (replyError) {
                    console.error('Failed to send reply:', replyError);
                }
            }
        }
    },
};
