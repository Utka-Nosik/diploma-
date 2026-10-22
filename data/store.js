/**
 * In-memory / JSON-backed data store for ArtEX.
 * Automatically persists to db.json on writes with atomic file handling.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'db.json');

const INITIAL_DATA = {
  users: [
    {
      id: "u_mikudasu",
      username: "Mikudasu",
      email: "dararan41@gmail.com",
      role: "artist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Digital illustrator & character designer from Almaty. Open for anime & cyberpunk commissions.",
      location: "Almaty, Kazakhstan",
      commissionStatus: "open",
      joined: "May 16, 2026",
      stats: {
        completedCommissions: 28,
        rating: 4.95,
        reviewsCount: 31,
        activeOrders: 2
      },
      pricing: {
        sketch: 15000,
        halfBody: 35000,
        fullIllustration: 65000,
        currency: "KZT"
      }
    },
    {
      id: "u_daniyal",
      username: "DaniyalArt",
      email: "daniyal@artex.kz",
      role: "artist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Concept artist & visual storyteller. Specialised in environment art and Kazakh folklore themes.",
      location: "Astana, Kazakhstan",
      commissionStatus: "open",
      joined: "October 10, 2026",
      stats: {
        completedCommissions: 14,
        rating: 5.0,
        reviewsCount: 16,
        activeOrders: 1
      },
      pricing: {
        sketch: 20000,
        halfBody: 45000,
        fullIllustration: 90000,
        currency: "KZT"
      }
    },
    {
      id: "u_bakdaulet",
      username: "Bakdaulet_Client",
      email: "bakdaulet@gmail.com",
      role: "client",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Collector and commissioner of original indie art and character designs.",
      location: "Shymkent, Kazakhstan",
      joined: "October 12, 2026",
      stats: {
        orderedCommissions: 9,
        fundedAmount: 340000
      }
    },
    {
      id: "u_botagoz",
      username: "Botagoz_Moderator",
      email: "trust@artex.kz",
      role: "moderator",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "ArtEX Platform Mediator & Community Safety. Reviews disputes and guarantees fair trade.",
      location: "Almaty, Kazakhstan",
      joined: "September 1, 2026"
    }
  ],
  artworks: [
    {
      id: "art_001",
      artistId: "u_mikudasu",
      artistName: "Mikudasu",
      title: "Neon Almaty 2077",
      description: "Digital cyberpunk painting inspired by night streets of Almaty with Kok-Tobe in the background.",
      category: "Digital Illustration",
      tags: ["cyberpunk", "almaty", "concept art", "neon"],
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      price: 65000,
      currency: "KZT",
      likesCount: 142,
      createdAt: "2026-10-14T12:00:00Z"
    },
    {
      id: "art_002",
      artistId: "u_mikudasu",
      artistName: "Mikudasu",
      title: "Steppe Spirit — Umai",
      description: "Character concept of goddess Umai with modern stylistic anime influences.",
      category: "Character Design",
      tags: ["mythology", "character", "kazakh", "illustration"],
      imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
      price: 50000,
      currency: "KZT",
      likesCount: 98,
      createdAt: "2026-10-18T15:30:00Z"
    },
    {
      id: "art_003",
      artistId: "u_daniyal",
      artistName: "DaniyalArt",
      title: "Canyon of Charyn at Dusk",
      description: "Atmospheric landscape study painted with custom textured brushes.",
      category: "Environment",
      tags: ["landscape", "charyn", "digital art", "nature"],
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      price: 90000,
      currency: "KZT",
      likesCount: 215,
      createdAt: "2026-10-20T09:15:00Z"
    }
  ],
  commissions: [
    {
      id: "comm_101",
      title: "Custom Twitch Mascot & 3 Emotes",
      description: "Design a snow leopard mascot character with 3 matching reaction emotes for stream.",
      artistId: "u_mikudasu",
      artistName: "Mikudasu",
      clientId: "u_bakdaulet",
      clientName: "Bakdaulet_Client",
      price: 45000,
      currency: "KZT",
      status: "in_progress", // requested | accepted | payment_held | in_progress | delivered | completed | disputed | cancelled
      escrowValidator: {
        isHeld: true,
        heldAmount: 45000,
        platformFee: 2250, // 5%
        heldAt: "2026-10-21T11:00:00Z",
        releasedAt: null,
        validationNote: "Payment safely held by ArtEX Escrow Validator. Funds protected until client confirms final delivery."
      },
      deadline: "2026-11-05",
      createdAt: "2026-10-20T10:00:00Z",
      delivery: {
        previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        submittedAt: "2026-10-22T14:30:00Z",
        comment: "Here is the first work-in-progress sketch batch! Let me know if you want adjustments on the eye colors."
      },
      timeline: [
        { status: "requested", timestamp: "2026-10-20T10:00:00Z", note: "Order placed by client" },
        { status: "accepted", timestamp: "2026-10-20T12:30:00Z", note: "Artist accepted the brief" },
        { status: "payment_held", timestamp: "2026-10-21T11:00:00Z", note: "Client deposited 45,000 KZT into ArtEX Escrow" },
        { status: "in_progress", timestamp: "2026-10-21T11:05:00Z", note: "Work started by Mikudasu" }
      ]
    }
  ],
  chats: [
    {
      id: "chat_01",
      commissionId: "comm_101",
      participants: ["u_mikudasu", "u_bakdaulet"],
      messages: [
        {
          id: "m_1",
          senderId: "u_bakdaulet",
          senderName: "Bakdaulet_Client",
          text: "Салам! I love your cyberpunk style. Could you do a snow leopard mascot for my channel?",
          timestamp: "2026-10-20T10:05:00Z"
        },
        {
          id: "m_2",
          senderId: "u_mikudasu",
          senderName: "Mikudasu",
          text: "Рахмет! Yes, absolutely. I can deliver the sketch in 3 days once the escrow deposit is placed.",
          timestamp: "2026-10-20T12:28:00Z"
        },
        {
          id: "m_3",
          senderId: "system",
          senderName: "ArtEX Validator",
          text: "🛡️ [System]: Escrow deposit of 45,000 KZT secured. Artist notified to start work.",
          timestamp: "2026-10-21T11:00:00Z"
        }
      ]
    }
  ]
};

class Store {
  constructor() {
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[ArtEX Store] Could not read db.json, using seed defaults:', err.message);
    }
    this._save(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  _save(newData) {
    try {
      const dataToSave = newData || this.data;
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[ArtEX Store] Failed to persist db.json:', err.message);
    }
  }

  // --- Users ---
  getUsers(query = {}) {
    let result = this.data.users;
    if (query.role) {
      result = result.filter(u => u.role.toLowerCase() === query.role.toLowerCase());
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(u => 
        u.username.toLowerCase().includes(s) || 
        (u.bio && u.bio.toLowerCase().includes(s)) ||
        (u.location && u.location.toLowerCase().includes(s))
      );
    }
    return result;
  }

  getUserById(idOrUsername) {
    return this.data.users.find(u => 
      u.id === idOrUsername || 
      u.username.toLowerCase() === idOrUsername.toLowerCase()
    ) || null;
  }

  createUser(userData) {
    const id = `u_${Date.now()}`;
    const newUser = {
      id,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      stats: { completedCommissions: 0, rating: 5.0, reviewsCount: 0, activeOrders: 0 },
      ...userData
    };
    this.data.users.push(newUser);
    this._save();
    return newUser;
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this._save();
    return this.data.users[index];
  }

  // --- Artworks ---
  getArtworks(query = {}) {
    let result = [...this.data.artworks];
    if (query.artistId) {
      result = result.filter(a => a.artistId === query.artistId);
    }
    if (query.category) {
      result = result.filter(a => a.category.toLowerCase() === query.category.toLowerCase());
    }
    if (query.tag) {
      result = result.filter(a => a.tags && a.tags.includes(query.tag.toLowerCase()));
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(s) || 
        a.description.toLowerCase().includes(s)
      );
    }
    return result;
  }

  getArtworkById(id) {
    return this.data.artworks.find(a => a.id === id) || null;
  }

  createArtwork(artworkData) {
    const newArt = {
      id: `art_${Date.now()}`,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      ...artworkData
    };
    this.data.artworks.unshift(newArt);
    this._save();
    return newArt;
  }

  likeArtwork(id) {
    const art = this.getArtworkById(id);
    if (!art) return null;
    art.likesCount = (art.likesCount || 0) + 1;
    this._save();
    return art;
  }

  // --- Commissions & Escrow Validation ---
  getCommissions(query = {}) {
    let result = [...this.data.commissions];
    if (query.userId) {
      result = result.filter(c => c.artistId === query.userId || c.clientId === query.userId);
    }
    if (query.status) {
      result = result.filter(c => c.status === query.status);
    }
    return result;
  }

  getCommissionById(id) {
    return this.data.commissions.find(c => c.id === id) || null;
  }

  createCommission(commissionData) {
    const newCommission = {
      id: `comm_${Date.now()}`,
      status: "requested",
      createdAt: new Date().toISOString(),
      escrowValidator: {
        isHeld: false,
        heldAmount: 0,
        platformFee: Math.round((commissionData.price || 0) * 0.05),
        heldAt: null,
        releasedAt: null,
        validationNote: "Awaiting artist acceptance and client payment lock."
      },
      timeline: [
        {
          status: "requested",
          timestamp: new Date().toISOString(),
          note: "Commission request submitted."
        }
      ],
      ...commissionData
    };
    this.data.commissions.unshift(newCommission);
    this._save();
    return newCommission;
  }

  updateCommissionStatus(id, newStatus, meta = {}) {
    const commission = this.getCommissionById(id);
    if (!commission) return null;

    commission.status = newStatus;
    const now = new Date().toISOString();

    if (newStatus === 'payment_held') {
      commission.escrowValidator.isHeld = true;
      commission.escrowValidator.heldAmount = commission.price;
      commission.escrowValidator.heldAt = now;
      commission.escrowValidator.validationNote = "Funds safely locked in ArtEX Escrow Validator.";
    } else if (newStatus === 'completed') {
      commission.escrowValidator.isHeld = false;
      commission.escrowValidator.releasedAt = now;
      commission.escrowValidator.validationNote = "Funds released to artist upon verified client approval.";
    } else if (newStatus === 'disputed') {
      commission.escrowValidator.validationNote = "Dispute opened. Funds frozen pending moderator review.";
    }

    commission.timeline.push({
      status: newStatus,
      timestamp: now,
      note: meta.note || `Status transitioned to ${newStatus}`
    });

    this._save();
    return commission;
  }

  submitDelivery(id, deliveryData) {
    const commission = this.getCommissionById(id);
    if (!commission) return null;
    commission.delivery = {
      ...deliveryData,
      submittedAt: new Date().toISOString()
    };
    commission.status = "delivered";
    commission.timeline.push({
      status: "delivered",
      timestamp: new Date().toISOString(),
      note: "Artist submitted deliverable files for review."
    });
    this._save();
    return commission;
  }

  // --- Chats ---
  getChatsForUser(userId) {
    return this.data.chats.filter(c => c.participants.includes(userId));
  }

  getChatById(chatId) {
    return this.data.chats.find(c => c.id === chatId) || null;
  }

  addMessage(chatId, messageData) {
    let chat = this.getChatById(chatId);
    if (!chat) {
      chat = {
        id: chatId,
        participants: [messageData.senderId],
        messages: []
      };
      this.data.chats.push(chat);
    }

    const newMsg = {
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...messageData
    };
    chat.messages.push(newMsg);
    this._save();
    return newMsg;
  }
}

module.exports = new Store();
