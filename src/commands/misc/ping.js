const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    run: () => {},
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check Server and WS Ping'),
    
    async run({client, interaction}) {
        await interaction.deferReply();
    
        const reply = await interaction.fetchReply();
    
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
    
        interaction.editReply(`Client ping: ${ping}ms | Websocket: ${client.ws.ping}`);
    },
}