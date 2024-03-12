require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const { pullChanges } = require('../github/github');

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
});

const projectRoot = path.resolve(__dirname, '..');

new CommandHandler({
  client,
  commandsPath: path.join(projectRoot, 'commands'),
  eventsPath: path.join(projectRoot, 'events'),
});

client.once('ready', async () => {
  await pullChanges();
});

client.login(process.env.BOT_TOKEN);