const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { calculateBattleStats } = require('../../util/statsUtil');
const { convertToDate, convertToRelativeTime } = require('../../util/convertTime');
const { fetchUserId, fetchPlayerStats, fetchUserAvatar } = require('../../util/api');
const generatePlayerFields = require('../../util/embedFields');
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

            // Fetch userId
            const userId = await fetchUserId(playerID);
            
            // Fetch player stats
            const playerData = await fetchPlayerStats(userId);
            
            // Fetch player avatar
            const largeAvatarUrl = await fetchUserAvatar(userId);

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