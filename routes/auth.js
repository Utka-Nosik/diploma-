const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * POST /api/auth/register
 * Body: { username, email, password, role }
 */
router.post('/register', (req, res) => {
  const { username, email, password, role = 'artist' } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  const existing = store.getUserById(username) || store.data.users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: "User with this username or email already exists" });
  }

  const newUser = store.createUser({
    username,
    email,
    role,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    bio: role === 'artist' ? "Commission artist on ArtEX" : "Art enthusiast and commissioner",
    location: "Kazakhstan",
    commissionStatus: role === 'artist' ? "open" : undefined
  });

  // Mock JWT / session token for clean client-side authorization
  const token = `artex_token_${newUser.id}_${Date.now()}`;
  return res.status(201).json({
    message: "Registration successful",
    token,
    user: newUser
  });
});

/**
 * POST /api/auth/login
 * Body: { identifier, password }
 */
router.post('/login', (req, res) => {
  const { identifier } = req.body; // username or email

  if (!identifier) {
    return res.status(400).json({ error: "Username or email is required" });
  }

  const user = store.getUserById(identifier) || store.data.users.find(u => u.email === identifier);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const token = `artex_token_${user.id}_${Date.now()}`;
  return res.json({
    message: "Login successful",
    token,
    user
  });
});

/**
 * GET /api/auth/me
 * Helper to get default current session user for frontend testing
 */
router.get('/me', (req, res) => {
  // In demo mode or if no token provided, return default active user Mikudasu
  const user = store.getUserById('u_mikudasu');
  return res.json(user);
});

module.exports = router;
