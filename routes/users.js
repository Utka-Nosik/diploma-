const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/users
 * Query params: ?role=artist|client &search=query
 */
router.get('/', (req, res) => {
  const { role, search } = req.query;
  const users = store.getUsers({ role, search });
  res.json(users);
});

/**
 * GET /api/users/:id
 * Returns user profile along with their artworks and commission summary
 */
router.get('/:id', (req, res) => {
  const user = store.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const artworks = store.getArtworks({ artistId: user.id });
  const commissions = store.getCommissions({ userId: user.id });

  res.json({
    ...user,
    artworks,
    recentCommissionsCount: commissions.length
  });
});

/**
 * PUT /api/users/:id
 * Update user profile
 */
router.put('/:id', (req, res) => {
  const allowed = ['bio', 'location', 'avatar', 'commissionStatus', 'pricing'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  const updated = store.updateUser(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(updated);
});

module.exports = router;
