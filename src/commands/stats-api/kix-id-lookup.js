const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { calculateBattleStats } = require('../../util/statsUtil');
const { convertToDate, convertToRelativeTime } = require('../../util/convertTime')
const { fetchPlayerStats, fetchUserAvatar } = require('../../util/api');
const generatePlayerFields = require('../../util/embedFields');
const axios = require('axios');

module.exports = {
    run: () => { },
    data: new SlashCommandBuilder()
        .setName('kix_id')
        .setDescription('player stats by KIXEYE ID.')
        .addStringOption(option =>
            option.setName('kixid')
                .setDescription('Kixeye user ID')
                .setRequired(true)
        ),

    async run({ interaction }) {
        const rawPlayerID = interaction.options.getString('kixid');
        console.log('Kixeye ID: ', rawPlayerID);

        try {
            await interaction.deferReply();            
            // Fetch player stats
            const playerData = await fetchPlayerStats(rawPlayerID);
            
            // Fetch player avatar
            const largeAvatarUrl = await fetchUserAvatar(rawPlayerID);

            // Calculate battle stats with default values
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

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(playerData.alias)
                .setThumbnail(largeAvatarUrl)
                .addFields(generatePlayerFields(playerData, baseAttackStats, baseDefenceStats, fleetStats, playingSince, lastSeen))
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching player data - ', error.message);
            await interaction.editReply('Player Data is not available');
        }
    },
};