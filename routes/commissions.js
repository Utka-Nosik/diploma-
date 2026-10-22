const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/commissions
 * Query: ?userId=...&status=...
 */
router.get('/', (req, res) => {
  const { userId, status } = req.query;
  const list = store.getCommissions({ userId, status });
  res.json(list);
});

/**
 * GET /api/commissions/:id
 */
router.get('/:id', (req, res) => {
  const commission = store.getCommissionById(req.params.id);
  if (!commission) {
    return res.status(404).json({ error: "Commission order not found" });
  }
  res.json(commission);
});

/**
 * POST /api/commissions
 * Create a new commission request
 * Body: { title, description, artistId, clientId, price, deadline }
 */
router.post('/', (req, res) => {
  const { title, description, artistId, clientId = 'u_bakdaulet', price, deadline } = req.body;

  if (!title || !artistId || !price) {
    return res.status(400).json({ error: "Title, artistId and price are required" });
  }

  const artist = store.getUserById(artistId);
  const client = store.getUserById(clientId);

  if (!artist) {
    return res.status(404).json({ error: "Artist not found" });
  }

  const newComm = store.createCommission({
    title,
    description: description || "",
    artistId: artist.id,
    artistName: artist.username,
    clientId: client ? client.id : clientId,
    clientName: client ? client.username : "Client",
    price: Number(price),
    currency: "KZT",
    deadline: deadline || "Flexible"
  });

  // Automatically initiate a chat thread for this commission deal
  const chatId = `chat_${newComm.id}`;
  store.addMessage(chatId, {
    senderId: "system",
    senderName: "ArtEX Validator",
    text: `🛡️ New commission deal initiated: "${title}" for ${price.toLocaleString()} KZT. Awaiting artist acceptance.`
  });

  res.status(201).json(newComm);
});

/**
 * PATCH /api/commissions/:id/status
 * Transition state: requested -> accepted -> payment_held -> in_progress -> delivered -> completed | disputed
 */
router.patch('/:id/status', (req, res) => {
  const { status, note } = req.body;
  const allowedStatuses = [
    'requested',
    'accepted',
    'payment_held',
    'in_progress',
    'delivered',
    'completed',
    'disputed',
    'cancelled'
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` 
    });
  }

  const updated = store.updateCommissionStatus(req.params.id, status, { note });
  if (!updated) {
    return res.status(404).json({ error: "Commission not found" });
  }

  // Also post an automated notification to chat if chat exists
  const chatId = `chat_${updated.id}`;
  const statusLabels = {
    accepted: "Artist accepted the commission brief. Next step: client locks funds in Escrow.",
    payment_held: "🛡️ Payment secured in ArtEX Escrow Validator! Funds are safe; artist can start working.",
    in_progress: "Artist marked status as 'In Progress'.",
    delivered: "Artist submitted work for client review.",
    completed: "🎉 Client confirmed delivery! Funds released to the artist. Deal completed safely.",
    disputed: "⚠️ Dispute raised. An ArtEX moderator has been alerted to review files and chat log.",
    cancelled: "Commission cancelled."
  };

  if (statusLabels[status]) {
    store.addMessage(chatId, {
      senderId: "system",
      senderName: "ArtEX Validator",
      text: statusLabels[status]
    });
  }

  res.json(updated);
});

/**
 * POST /api/commissions/:id/deliver
 * Artist submits draft/final deliverable
 */
router.post('/:id/deliver', (req, res) => {
  const { previewUrl, comment } = req.body;

  if (!previewUrl) {
    return res.status(400).json({ error: "previewUrl is required" });
  }

  const updated = store.submitDelivery(req.params.id, { previewUrl, comment });
  if (!updated) {
    return res.status(404).json({ error: "Commission not found" });
  }

  res.json(updated);
});

module.exports = router;
