const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/chats
 * Query: ?userId=...
 */
router.get('/', (req, res) => {
  const userId = req.query.userId || 'u_mikudasu';
  const chats = store.getChatsForUser(userId);
  res.json(chats);
});

/**
 * GET /api/chats/:id
 */
router.get('/:id', (req, res) => {
  const chat = store.getChatById(req.params.id);
  if (!chat) {
    return res.status(404).json({ error: "Chat thread not found" });
  }
  res.json(chat);
});

/**
 * POST /api/chats/:id/messages
 * Body: { senderId, senderName, text }
 */
router.post('/:id/messages', (req, res) => {
  const { senderId, senderName, text } = req.body;

  if (!text || !senderId) {
    return res.status(400).json({ error: "text and senderId are required" });
  }

  const newMsg = store.addMessage(req.params.id, {
    senderId,
    senderName: senderName || "User",
    text
  });

  res.status(201).json(newMsg);
});

module.exports = router;
