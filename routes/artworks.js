const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/artworks
 * Query params: ?artistId=...&category=...&tag=...&search=...
 */
router.get('/', (req, res) => {
  const { artistId, category, tag, search } = req.query;
  const list = store.getArtworks({ artistId, category, tag, search });
  res.json(list);
});

/**
 * GET /api/artworks/:id
 */
router.get('/:id', (req, res) => {
  const artwork = store.getArtworkById(req.params.id);
  if (!artwork) {
    return res.status(404).json({ error: "Artwork not found" });
  }
  res.json(artwork);
});

/**
 * POST /api/artworks
 * Upload new artwork to portfolio
 */
router.post('/', (req, res) => {
  const { title, description, category, tags, imageUrl, price, artistId, artistName } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({ error: "Title and imageUrl are required" });
  }

  const artist = store.getUserById(artistId || 'u_mikudasu');
  const newArtwork = store.createArtwork({
    artistId: artist ? artist.id : 'u_mikudasu',
    artistName: artist ? artist.username : 'Mikudasu',
    title,
    description: description || "",
    category: category || "Illustration",
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim().toLowerCase()) : []),
    imageUrl,
    price: Number(price) || 0,
    currency: "KZT"
  });

  res.status(201).json(newArtwork);
});

/**
 * POST /api/artworks/:id/like
 */
router.post('/:id/like', (req, res) => {
  const updated = store.likeArtwork(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: "Artwork not found" });
  }
  res.json({ id: updated.id, likesCount: updated.likesCount });
});

module.exports = router;
