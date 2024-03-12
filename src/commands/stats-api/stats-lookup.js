const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    run: () => {},
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('players stats by in-game ID.') 
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The player ID')
                .setRequired(true)
        ),
    async run({ interaction }) {
        const playerID = interaction.options.getString('id');
        console.log('player ID: ', playerID);

        try {
            await interaction.deferReply();

            const API_URL = process.env.API_URL;
            const response = await axios.get(`${API_URL}/${playerID}`);
            const playerData = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(playerData.alias)
                .setThumbnail(playerData.playerAvatar)
                .addFields(
                    { name: ':identification_card: Player ID', value: String(playerData.userGameId), inline: true },
                    { name: ':coin: Player Name', value: String(playerData.alias), inline: true},
                    { name: ':page_with_curl: Previous Names', 
                    value: playerData.previousNames ? playerData.previousNames.map(name => name.alias).join(', ') : 'No previous names', inline: false },
                    { name: ':beginner: Level', value: String(playerData.level), inline: true },
                    { name: ':medal: Medals', value: String(playerData.medals), inline: true },
                    { name: ':ringed_planet: Planet', value: String(playerData.planet), inline: true },
                    { name: ':desktop: Playing Since', value: String(playerData.since), inline: true },
                    { name: ':hourglass: Last Seen', value: String(playerData.seen), inline: true },
                    { name: ':firecracker: Base Attack', value: `Win: ${String(playerData.baseAttackWin)}, Draws: ${String(playerData.baseAttackDraw)}, Loss: ${String(playerData.baseAttackLoss)} | KD: ${String(playerData.baseDefenceKd)}     Winrate: ${(playerData.baseDefencePercent.toFixed(2))}%`, inline: false },
                    { name: ':shield: Base Defense', value: `Win: ${String(playerData.baseDefenceWin)}, Draws: ${String(playerData.baseDefenceDraw)}, Loss: ${String(playerData.baseDefenceLoss)} | K/D: ${String(playerData.baseAttackKd)}     Winrate: ${(playerData.baseAttackPercent.toFixed(2))}%`, inline: false },
                    { name: ':crossed_swords: Fleet vs Fleet', value: `Win: ${String(playerData.fleetWin)}, Draws: ${String(playerData.fleetDraw)}, Loss: ${String(playerData.fleetLoss)} | K/D: ${String(playerData.fleetKd)}     Winrate: ${(playerData.fleetWinPercent.toFixed(2))}%`, inline: false },
                )
                .setTimestamp().setFooter({ text: `Total Views: ${playerData.playerViews}` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Provided ID is not found in API - ', playerID);
            await interaction.editReply('Player Data is not available');
        }
    },
};