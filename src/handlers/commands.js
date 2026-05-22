'use strict';

/**
 * @param {import('telegraf').Telegraf} bot
 */
function register(bot) {
  bot.start((ctx) => {
    const name = ctx.from.first_name || 'there';
    ctx.reply(`👋 Hello, ${name}! I'm up and running.`);
  });

  bot.help((ctx) => {
    ctx.reply('/start — greet\n/help — show this message');
  });
}

module.exports = { register };
