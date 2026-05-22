'use strict';

const admin = require('firebase-admin');
const serviceAccount = require('../../balandar-4863f-firebase-adminsdk-fbsvc-3e23c876a8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
