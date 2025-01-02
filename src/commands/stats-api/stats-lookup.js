const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { calculateBattleStats } = require('../../util/statsUtil');
const { convertToDate, convertToRelativeTime } = require('../../util/convertTime');
const generatePlayerFields = require('../../util/embedFields');
const { generateChartUrl } = require('../../util/chartUtil');
const { fetchPlayerDetails, findOrCreateUser, formatUsernameHistory } = require('../../util/playerDataUtil');
const { findOrCreateWinrateRecord } = require('../../util/winrateUtil');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Fetch player stats by in-game ID.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The player ID')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year for historical winrate data (default: current year)')
                .setRequired(false)
        ),

        async run({ interaction }) {
            const rawPlayerID = interaction.options.getString('id');
            const playerID = parseInt(rawPlayerID.replace(/\D/g, ''), 10);
            const yearOption = interaction.options.getInteger('year');
            const currentYear = new Date().getFullYear();
            const targetYear = yearOption || currentYear;
    
            console.log('player ID:', playerID);
            console.log('year:', targetYear);
    
            try {
                await interaction.deferReply();
    
                const { userId, playerData, largeAvatarUrl } = await fetchPlayerDetails(playerID);
                
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
                    .addFields(generatePlayerFields(playerData, baseAttackStats, baseDefenceStats, fleetStats, playingSince, lastSeen, formattedUsernameHistory))
                    .setTimestamp()
                    .setImage(chartUrl);

                await findOrCreateWinrateRecord(playerID, baseAttackStats.winratePercent, baseDefenceStats.winratePercent, fleetStats.winratePercent);
    
                await interaction.editReply({ embeds: [embed] });
    
            } catch (error) {
                console.error('Error fetching player data - ', error.message);
                try {
                    await interaction.editReply('Player data is not available.');
                } catch (editError) {
                    console.error('Failed to edit reply:', editError);
                }
            }
        },
    };
