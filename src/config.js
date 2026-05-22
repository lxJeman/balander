'use strict';

require('dotenv').config();

const config = {
  botToken: process.env.BOT_TOKEN,
  groqApiKey: process.env.GROQ_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
};

if (!config.botToken) throw new Error('BOT_TOKEN is required in .env');
if (!config.groqApiKey) throw new Error('GROQ_API_KEY is required in .env');

module.exports = config;
