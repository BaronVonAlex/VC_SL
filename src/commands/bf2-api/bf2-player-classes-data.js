const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { convertTimeToHours } = require('../../util/dataConvertUtil');
require('dotenv').config();

module.exports = {
    run: () => {},
    data: new SlashCommandBuilder()
        .setName('bf2classes')
        .setDescription('Player class stats by in-game name for BF2.')
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

            const apiUrl = `${process.env.BF2_CLASSES_API_URL}?name=${encodeURIComponent(playerName)}&platform=${platform}`;

            const response = await axios.get(apiUrl);
            const classData = response.data.classes;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Class Stats for ${playerName}`)
                .setTimestamp()
                .setFooter({ text: `Player class stats from GameTools API` });

            classData.forEach(playerClass => {
                const timeAsClassInHours = convertTimeToHours(playerClass.timeAsClass);
                embed.addFields(
                    { name: `${playerClass.name}`, value: `K/D: ${playerClass.killDeath}\nTime: ${timeAsClassInHours}`, inline: true }
                );
            });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching data from API - ');
            await interaction.editReply('Player Class Data is not available');
        }
    },
};
