const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
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
        const playerID = interaction.options.getString('kixid');
        console.log('Kixeye ID: ', playerID);

        try {
            await interaction.deferReply();

            const API_URL = process.env.API_URL;
            const response = await axios.get(`${API_URL}/${playerID}`);
            const playerData = response.data;

            const fleetWinColor = playerData.fleetWinPercent;
            const embedColor = getColor(fleetWinColor)

            const embed = new EmbedBuilder()
                .setColor(embedColor)
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
                    { name: ':firecracker: Base Attack', value: `Win: ${String(playerData.baseAttackWin)}, Draws: ${String(playerData.baseAttackDraw)}, Loss: ${String(playerData.baseAttackLoss)} | KD: ${String(playerData.baseAttackKd)}     Winrate: ${(playerData.baseAttackPercent.toFixed(2))}%`, inline: false },
                    { name: ':shield: Base Defense', value: `Win: ${String(playerData.baseDefenceWin)}, Draws: ${String(playerData.baseDefenceDraw)}, Loss: ${String(playerData.baseDefenceLoss)} | K/D: ${String(playerData.baseDefenceKd)}     Winrate: ${(playerData.baseDefencePercent.toFixed(2))}%`, inline: false },
                    { name: ':crossed_swords: Fleet vs Fleet', value: `Win: ${String(playerData.fleetWin)}, Draws: ${String(playerData.fleetDraw)}, Loss: ${String(playerData.fleetLoss)} | K/D: ${String(playerData.fleetKd)}     Winrate: ${(playerData.fleetWinPercent.toFixed(2))}%`, inline: false },
                )
                .setTimestamp().setFooter({ text: `Total Views: ${playerData.playerViews}` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Provided kixID is not found in API - ', playerID);
            await interaction.editReply('Player Data is not available');
        }
    },
};
