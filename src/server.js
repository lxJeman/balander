'use strict';

const express = require('express');
const { saveEvent } = require('./services/firestore');

const app = express();
app.use(express.json());

// POST /events  — save a calendar event for a user
app.post('/events', async (req, res) => {
  const { telegramUserId, event } = req.body;
  if (!telegramUserId || !event) {
    return res.status(400).json({ error: 'telegramUserId and event are required' });
  }
  try {
    const id = await saveEvent(telegramUserId, event);
    res.json({ id });
  } catch (err) {
    console.error('[POST /events]', err.message);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

module.exports = app;
