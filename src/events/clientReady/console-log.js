const { ActivityType } = require('discord.js')
module.exports = (client) => {
    try {
        console.log(`Client is Ready. Logged in as ${client.user.tag}`);
        client.user.setActivity(
            {
                name: 'VEGA Conflict',
                type: ActivityType.Streaming,
                url: 'https://www.twitch.tv/baronvonalexs',
                status: 'idle'
            }
        );
    } catch (error) {
        console.error('Error registering commands:', error);
    }
};