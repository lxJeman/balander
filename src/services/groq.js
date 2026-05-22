'use strict';

const Groq = require('groq-sdk');
const config = require('../config');

const groq = new Groq({ apiKey: config.groqApiKey });

const SYSTEM_PROMPT = `You are a commitment extraction engine. The user sends a natural language message describing a meeting, task, or event.

Extract the commitment and return ONLY a valid JSON object with this exact shape:
{
  "title": "string",
  "date": "YYYY-MM-DD or null",
  "time": "HH:MM (24h) or null",
  "duration_minutes": number or null,
  "attendees": ["name", ...] or [],
  "location": "string or null",
  "notes": "string or null",
  "confidence": "high" | "medium" | "low"
}

Rules:
- Resolve relative dates (today, tomorrow, next Friday) using the current date provided in the user message.
- If a field cannot be determined, use null.
- duration_minutes default is 60 when a meeting is implied but no duration is stated.
- Return ONLY the JSON. No explanation, no markdown, no extra text.`;

/**
 * Extract a structured event from free-form user text.
 * @param {string} userText
 * @param {Date} [now]
 * @returns {Promise<object>} parsed event object
 */
async function extractEvent(userText, now = new Date()) {
  const userMessage = `Current date and time: ${now.toISOString()}\n\nUser message: ${userText}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0,
    max_tokens: 300,
  });

  const raw = response.choices[0].message.content.trim();
  return JSON.parse(raw);
}

module.exports = { extractEvent };
