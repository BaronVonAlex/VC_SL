const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { generateChartUrl } = require('../../util/chartUtil');
const { calculateBattleStats } = require('../../util/statsUtil');
const { convertToDate, convertToRelativeTime } = require('../../util/convertTime')
const axios = require('axios');

module.exports = {
    run: () => {},
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
            console.log('player ID: ', rawPlayerID);
    
            try {
                await interaction.deferReply();
    
                // Second request to fetch player stats using userId
                const statsApiUrl = `${process.env.STATS_API_URL}${rawPlayerID}/games/386487958112133`;
                const secondResponse = await axios.get(statsApiUrl);
                const playerData = secondResponse.data;
    
                // Process playerData and construct the embed as before
    
                const baseAttackStats = calculateBattleStats(playerData.baseAttackWin, playerData.baseAttackDraw, playerData.baseAttackLoss);
                const baseDefenceStats = calculateBattleStats(playerData.baseDefenceWin, playerData.baseDefenceDraw, playerData.baseDefenceLoss);
                const fleetStats = calculateBattleStats(playerData.fleetWin, playerData.fleetDraw, playerData.fleetLoss);
                const playingSince = convertToDate(playerData.since);
                const lastSeen = convertToRelativeTime(playerData.seen);
    
                const fleetWinColor = fleetStats.winratePercent;
                const embedColor = getColor(fleetWinColor);
    
    
                const embed = new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle(playerData.alias)
                    // .setThumbnail(playerData.playerAvatar)
                    .addFields(
                        { name: ':identification_card: Player ID', value: String(playerData.playerId), inline: true },
                        { name: ':coin: Player Name', value: String(playerData.alias), inline: true },
                        { name: ':page_with_curl: Previous Names',
                         value: playerData.previousNames ? playerData.previousNames.map(name => name.alias).join(', ') : 'No previous names', inline: false },
                        { name: ':beginner: Level', value: String(playerData.level), inline: true },
                        { name: ':medal: Medals', value: String(playerData.medals), inline: true },
                        { name: ':ringed_planet: Planet', value: String(playerData.planet), inline: true },
                        { name: ':desktop: Playing Since', value: playingSince, inline: true },
                        { name: ':hourglass: Last Seen', value: lastSeen, inline: true },
                        { name: `:firecracker: Base Attack: ${baseAttackStats.totalBattles}, ${baseAttackStats.winratePercent}%, ${String(baseAttackStats.kdRatio)} K/D`, 
                            value: `Win: ${String(playerData.baseAttackWin)}, Draws: ${String(playerData.baseAttackDraw)}, Loss: ${String(playerData.baseAttackLoss)}`, 
                            inline: false },
                        { name: `:shield: Base Defense: ${baseDefenceStats.totalBattles}, ${baseDefenceStats.winratePercent}%, ${String(baseDefenceStats.kdRatio)} K/D`, 
                            value: `Win: ${String(playerData.baseDefenceWin)}, Draws: ${String(playerData.baseDefenceDraw)}, Loss: ${String(playerData.baseDefenceLoss)}`, 
                            inline: false },
                        { name: `:crossed_swords: Fleet vs Fleet: ${fleetStats.totalBattles}, ${fleetStats.winratePercent}%, ${String(fleetStats.kdRatio)} K/D`, 
                            value: `Win: ${String(playerData.fleetWin)}, Draws: ${String(playerData.fleetDraw)}, Loss: ${String(playerData.fleetLoss)}`, 
                            inline: false },
                    )
                    // .setImage(chartUrl)
                    .setTimestamp()
                    // .setFooter({ text: `Total Views: ${playerData.playerViews}` });
    
                await interaction.editReply({ embeds: [embed] });
    
            } catch (error) {
                console.error('Error fetching player data - ', error.message);
                await interaction.editReply('Player Data is not available');
            }
        },
    };
