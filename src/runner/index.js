require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const { pullChanges } = require('../github/github');
const { loadError } = require('../handler/errorHandler');

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

client.login(process.env.BOT_TOKEN).then(() => {loadError(client);}).catch((e) => console.log(e));