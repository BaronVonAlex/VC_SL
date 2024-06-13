const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { convertTimeToHours } = require('../../util/dataConvertUtil');
const { getRankEmoji } = require('../../util/rankDisplayUtil');
const { getRankName } = require('../../util/getRankNameUntil');
require('dotenv').config();

module.exports = {
    run: () => {},
    data: new SlashCommandBuilder()
        .setName('bf2stats')
        .setDescription('Player stats by in-game name for BF2.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The player name')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('Platform for the stats')
                .setRequired(true)
                .addChoices(
                    { name: 'bf2hub', value: 'bf2hub' },
                    { name: 'playbf2', value: 'playbf2' }
                )
        ),

    async run({ interaction }) {
        const playerName = interaction.options.getString('name');
        const platform = interaction.options.getString('platform');

        console.log('player Name: ', playerName, 'platform: ', platform);

        try {
            await interaction.deferReply();

            const apiUrl = `${process.env.BF2_API_URL}?name=${encodeURIComponent(playerName)}&platform=${platform}`;

            const response = await axios.get(apiUrl);
            const playerData = response.data;

            const timePlayedInHours = convertTimeToHours(playerData["Time played"]);
            const rankEmoji = getRankEmoji(playerData.Rank);
            const rankName = getRankName(playerData.Rank);
            

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Stats for ${playerName}`)
                .addFields(
                    { name: `${rankEmoji} Rank`, value: rankName, inline: true },
                    { name: ':chart_with_upwards_trend: Win Rate', value: String(playerData.Win), inline: true },
                    { name: ':military_helmet: Best Class', value: String(playerData["Best Class"]), inline: true },
                    { name: ':hourglass: Time Played', value: timePlayedInHours , inline: true },
                    { name: ':trophy: Wins', value: String(playerData.Wins), inline: true },
                    { name: ':crossed_swords: Accuracy', value: String(playerData.Accuracy), inline: true },
                    { name: ':skull: K/D Ratio', value: String(playerData["K/D"]), inline: true },
                    { name: ':dagger: Kills', value: String(playerData.Kills), inline: true },
                    { name: ':coffin: Deaths', value: String(playerData.Deaths), inline: true },
                    { name: ':stopwatch: SPM (Score per Minute)', value: String(playerData.SPM), inline: true },
                    { name: ':dart: KPM (Kills per Minute)', value: String(playerData.KPM), inline: true },
                    { name: ':x: Losses', value: String(playerData.Loses), inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Player stats from GameTools API` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching data from API - ');
            await interaction.editReply('Player Data is not available');
        }
    },
};
