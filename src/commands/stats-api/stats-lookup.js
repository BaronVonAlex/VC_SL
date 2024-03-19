const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../util/getColorUtil');
const { generateChartUrl } = require('../../util/chartUtil');
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
        )
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('Year for graphs to show')
                .setRequired(false)
        ),
        
    async run({ interaction }) {
        const rawPlayerID = interaction.options.getString('id');
        const playerID = parseInt(rawPlayerID.replace(/\D/g, ''), 10);
        const year = interaction.options.getInteger('year');
        console.log('player ID: ', playerID, year);

        try {
            await interaction.deferReply();

            let apiUrl = process.env.API_URL;

            // Modify apiUrl if year is provided
            if (year) {
                apiUrl = `${apiUrl}/${playerID}/${year}`;
            } else {
                apiUrl = `${apiUrl}/${playerID}`;
            }

            const response = await axios.get(apiUrl);
            const playerData = response.data;

            const fleetWinColor = playerData.fleetWinPercent;
            const embedColor = getColor(fleetWinColor);

            const chartUrl = await generateChartUrl(playerID, playerData);

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(playerData.alias)
                .setThumbnail(playerData.playerAvatar)
                .addFields(
                    { name: ':identification_card: Player ID', value: String(playerData.userGameId), inline: true },
                    { name: ':coin: Player Name', value: String(playerData.alias), inline: true },
                    { name: ':page_with_curl: Previous Names',
                     value: playerData.previousNames ? playerData.previousNames.map(name => name.alias).join(', ') : 'No previous names', inline: false },
                    { name: ':beginner: Level', value: String(playerData.level), inline: true },
                    { name: ':medal: Medals', value: String(playerData.medals), inline: true },
                    { name: ':ringed_planet: Planet', value: String(playerData.planet), inline: true },
                    { name: ':desktop: Playing Since', value: String(playerData.since), inline: true },
                    { name: ':hourglass: Last Seen', value: String(playerData.seen), inline: true },
                    { name: `:firecracker: Base Attack: ${String(playerData.baseAttackTotal)}, ${String((playerData.baseAttackPercent.toFixed(2)))}%, ${String(playerData.baseAttackKd)} K/D`, value: `Win: ${String(playerData.baseAttackWin)}, Draws: ${String(playerData.baseAttackDraw)}, Loss: ${String(playerData.baseAttackLoss)}`, inline: false },
                    { name: `:shield: Base Defense: ${String(playerData.baseDefenceTotal)}, ${String((playerData.baseDefencePercent.toFixed(2)))}%, ${String(playerData.baseDefenceKd)} K/D`, value: `Win: ${String(playerData.baseDefenceWin)}, Draws: ${String(playerData.baseDefenceDraw)}, Loss: ${String(playerData.baseDefenceLoss)}`, inline: false },
                    { name: `:crossed_swords: Fleet vs Fleet: ${String(playerData.fleetTotal)}, ${String((playerData.fleetWinPercent.toFixed(2)))}%, ${String(playerData.fleetKd)} K/D`, value: `Win: ${String(playerData.fleetWin)}, Draws: ${String(playerData.fleetDraw)}, Loss: ${String(playerData.fleetLoss)}`, inline: false },
                )
                .setImage(chartUrl)
                .setTimestamp()
                .setFooter({ text: `Total Views: ${playerData.playerViews}` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Provided ID is not found in API - ', playerID);
            await interaction.editReply('Player Data is not available');
        }
    },
};
