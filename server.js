const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const artworksRoutes = require('./routes/artworks');
const commissionsRoutes = require('./routes/commissions');
const chatsRoutes = require('./routes/chats');
const store = require('./data/store');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for clear terminal visibility
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ArtEX Platform Backend',
    version: '1.1.0',
    timestamp: new Date().toISOString()
  });
});

// Legacy backward-compatible route for current frontend prototype
app.get('/api/user/:id', (req, res) => {
  const user = store.getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Пользователь не найден" });
  }
});

// Modular API Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/artworks', artworksRoutes);
app.use('/api/commissions', commissionsRoutes);
app.use('/api/chats', chatsRoutes);

// Fallback 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server only when executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 ArtEX Backend Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🎨 Frontend served at: http://localhost:${PORT}/index.html`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    console.log(`🖼️ Artworks API: http://localhost:${PORT}/api/artworks`);
    console.log(`🛡️ Commissions API: http://localhost:${PORT}/api/commissions`);
    console.log(`💬 Chats API: http://localhost:${PORT}/api/chats`);
    console.log(`===============================================`);
  });
}

module.exports = app;
