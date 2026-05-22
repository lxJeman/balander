'use strict';

const { extractEvent } = require('../services/groq');
const { saveEvent } = require('../services/firestore');

/**
 * Format a parsed event into a human-readable confirmation message.
 * @param {object} event
 * @returns {string}
 */
function formatEvent(event) {
  const lines = [`📅 *${event.title}*`];

  if (event.date) lines.push(`🗓 Date: ${event.date}`);
  if (event.time) lines.push(`🕐 Time: ${event.time}`);
  if (event.duration_minutes) lines.push(`⏱ Duration: ${event.duration_minutes} min`);
  if (event.attendees?.length) lines.push(`👥 With: ${event.attendees.join(', ')}`);
  if (event.location) lines.push(`📍 Location: ${event.location}`);
  if (event.notes) lines.push(`📝 Notes: ${event.notes}`);

  const confidenceEmoji = { high: '✅', medium: '⚠️', low: '❓' }[event.confidence] ?? '❓';
  lines.push(`\n${confidenceEmoji} Confidence: ${event.confidence}`);

  return lines.join('\n');
}

/**
 * @param {import('telegraf').Telegraf} bot
 */
function register(bot) {
  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return; // skip commands

    try {
      await ctx.sendChatAction('typing');
      const event = await extractEvent(text);
      const docId = await saveEvent(ctx.from.id, event);
      await ctx.reply(formatEvent(event) + `\n\n💾 Saved To Google Calandar`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('[message handler]', err.message);
      await ctx.reply("Sorry, I couldn't parse that. Try something like: \"Meet Alex Friday 3pm\"");
    }
  });
}

module.exports = { register };
