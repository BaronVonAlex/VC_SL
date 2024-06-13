const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    run: () => {},
    data: new SlashCommandBuilder()
        .setName('bf2weapons')
        .setDescription('Player weapon stats by in-game name for BF2.')
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

            const apiUrl = `${process.env.BF2_WEAPONS_API_URL}?name=${encodeURIComponent(playerName)}&platform=${platform}`;

            const response = await axios.get(apiUrl);
            const weaponData = response.data.weapons;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Weapon Stats for ${playerName}`)
                .setTimestamp()
                .setFooter({ text: `Player weapon stats from GameTools API` });

            weaponData.forEach(weapon => {
                embed.addFields(
                    { name: `${weapon.name}`, value: `Kills: ${weapon.kills}\nK/D: ${weapon.killDeath}\nKPM: ${weapon.killsPerMinute}\nAccuracy: ${weapon.accuracy}`, inline: true }
                );
            });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching data from API - ');
            await interaction.editReply('Player Weapon Data is not available');
        }
    },
};
