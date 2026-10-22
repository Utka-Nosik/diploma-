# UX / Prototype — ArtEX

## Overview

This document describes the key user scenarios for the ArtEX platform, including wireframe mockup descriptions and API interaction examples (since a full graphical UI is under development).

---

## 1. Key User Scenarios

### Scenario A: Artist uploads an artwork
1. Artist logs in → navigates to **"My Gallery"** page
2. Clicks **"Upload Artwork"** button
3. Fills in: title, description, price, category, and uploads an image file
4. Clicks **"Publish"** → artwork appears in the public listing

### Scenario B: Buyer discovers and purchases an artwork
1. Buyer opens the **Gallery** page (no login required to browse)
2. Filters by category or price
3. Opens an artwork detail page → sees title, image, description, price, artist profile link
4. Clicks **"Buy"** (requires login) → purchase request is created
5. System notifies both the buyer and the artist

### Scenario C: Transaction validation flow
1. Buyer initiates purchase → transaction status: `PENDING`
2. Seller confirms they will dispatch → status: `DISPATCHED`
3. Buyer confirms receipt → status: `COMPLETED` → funds released to seller
4. If either side does not confirm within N days → status: `DISPUTED` → admin is notified

### Scenario D: Chat between buyer and seller
1. After a purchase is initiated, a **chat thread** is created between buyer and seller
2. Both parties can exchange messages about delivery details
3. Chat is locked after transaction is `COMPLETED` or `CANCELLED`

---

## 2. Wireframe Descriptions (Text-Based Mockups)

### 2.1 Home / Landing Page
```
┌────────────────────────────────────────────┐
│  🎨 ArtEX          [Login]  [Register]     │
├────────────────────────────────────────────┤
│                                            │
│   "Buy and sell art — safely."            │
│                                            │
│   [Browse Gallery]    [Sell Your Art]      │
│                                            │
├────────────────────────────────────────────┤
│  Featured Artworks                         │
│  ┌──────┐ ┌──────┐ ┌──────┐              │
│  │ img  │ │ img  │ │ img  │              │
│  │Title │ │Title │ │Title │              │
│  │$120  │ │$80   │ │$200  │              │
│  └──────┘ └──────┘ └──────┘              │
└────────────────────────────────────────────┘
```

### 2.2 Artwork Detail Page
```
┌────────────────────────────────────────────┐
│  ← Back to Gallery                         │
├──────────────────┬─────────────────────────┤
│                  │ Title: "Neon Dreams"     │
│   [Artwork Image]│ Artist: @mikudasu        │
│                  │ Price: $150              │
│                  │                          │
│                  │ Description:             │
│                  │ Digital illustration ... │
│                  │                          │
│                  │ [Buy Now]                │
└──────────────────┴─────────────────────────┘
```

### 2.3 Transaction Dashboard (Buyer View)
```
┌────────────────────────────────────────────┐
│  My Purchases                              │
├────────────────────────────────────────────┤
│  "Neon Dreams"  by @mikudasu              │
│  Status: DISPATCHED  [Confirm Receipt ✓]  │
│  [Open Chat]                               │
├────────────────────────────────────────────┤
│  "Wave Rider"   by @artnova               │
│  Status: PENDING — waiting for seller     │
└────────────────────────────────────────────┘
```

### 2.4 Profile Page
```
┌────────────────────────────────────────────┐
│  [Avatar]  Mikudasu                        │
│            @mikudasu · Joined May 2026     │
│            "Digital artist & cat lover"   │
├────────────────────────────────────────────┤
│  Artworks (12)  │  Sales (5)  │ Following  │
├────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐              │
│  │ img  │ │ img  │ │ img  │              │
│  └──────┘ └──────┘ └──────┘              │
└────────────────────────────────────────────┘
```

---

## 3. API Input / Output Examples

### POST /api/auth/register
**Input:**
```json
{
  "username": "mikudasu",
  "email": "dararan41@gmail.com",
  "password": "securepassword123"
}
```
**Output (success):**
```json
{
  "uid": "abc123",
  "username": "mikudasu",
  "token": "<firebase-jwt>"
}
```

---

### POST /api/artworks
**Input:**
```json
{
  "title": "Neon Dreams",
  "description": "A vibrant digital illustration of a neon cityscape",
  "price": 150,
  "category": "digital",
  "imageUrl": "https://storage.firebase.../neon-dreams.jpg"
}
```
**Output (success):**
```json
{
  "artworkId": "artwork_xyz789",
  "status": "published",
  "createdAt": "2026-10-22T16:30:00Z"
}
```

---

### POST /api/transactions
**Input:**
```json
{
  "artworkId": "artwork_xyz789",
  "buyerId": "uid_buyer123"
}
```
**Output:**
```json
{
  "transactionId": "tx_001",
  "status": "PENDING",
  "artworkId": "artwork_xyz789",
  "buyerId": "uid_buyer123",
  "sellerId": "uid_mikudasu",
  "amount": 150,
  "createdAt": "2026-10-22T17:00:00Z"
}
```

---

### PATCH /api/transactions/tx_001/confirm-receipt
**Input:**
```json
{
  "userId": "uid_buyer123"
}
```
**Output:**
```json
{
  "transactionId": "tx_001",
  "status": "COMPLETED",
  "fundsReleasedAt": "2026-10-22T18:00:00Z"
}
```

---

## 4. External System Interactions

| External System | How ArtEX Interacts |
|----------------|---------------------|
| Firebase Auth | Issues and validates JWT tokens on login/register |
| Firebase Firestore | Stores all platform data; real-time listeners for transaction status |
| (Future) Stripe / Payment Gateway | Will handle actual fund holding and release; currently mocked |
| Email Service (future) | Transaction notifications sent via email |
