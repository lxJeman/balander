'use strict';

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
});

const db = admin.firestore();

/**
 * Save an extracted event to Firestore under the user's collection.
 * @param {number} telegramUserId
 * @param {object} event
 * @returns {Promise<string>} document ID
 */
async function saveEvent(telegramUserId, event) {
  const ref = await db
    .collection('users')
    .doc(String(telegramUserId))
    .collection('events')
    .add({
      ...event,
      userId: telegramUserId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  return ref.id;
}

module.exports = { saveEvent };
