'use strict';

const { Telegraf } = require('telegraf');
const config = require('./config');
const commands = require('./handlers/commands');
const messages = require('./handlers/messages');
const app = require('./server');

const bot = new Telegraf(config.botToken);

commands.register(bot);
messages.register(bot);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

bot.launch().then(() => {
  console.log(`Bot started in ${config.nodeEnv} mode`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
