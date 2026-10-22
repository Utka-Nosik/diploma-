# Architecture and Diagrams — ArtEX

## Overview

This document describes the system architecture of the ArtEX platform and includes the three required diagrams: System Context Diagram, Use Case Diagram, and Component Diagram (draft).

---

## 1. Architectural Description

ArtEX follows a **client-server architecture** with a lightweight Node.js/Express backend and a vanilla JS frontend. Data is persisted in Firebase Firestore, which also handles real-time sync and authentication.

**Key architectural principles:**
- **Separation of concerns:** Frontend (presentation), backend (business logic/routing), and database (persistence) are kept separate.
- **Stateless REST API:** The backend exposes stateless HTTP endpoints; session state is managed client-side via Firebase Auth tokens.
- **Validation-as-a-service:** The transaction validation logic is centralised on the backend to ensure neither party can manipulate the outcome.

**Technology stack summary:**

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Hosting | TBD (Firebase Hosting / VPS) |

---

## 2. System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          ArtEX Platform                         │
│                                                                 │
│   ┌──────────┐    REST API    ┌─────────────┐                  │
│   │ Frontend │◄──────────────►│   Backend   │                  │
│   │  (Browser│                │ Node/Express│                  │
│   │    JS)   │                └──────┬──────┘                  │
│   └──────────┘                       │                         │
│                                      │ Firebase SDK            │
│                               ┌──────▼──────┐                  │
│                               │  Firebase   │                  │
│                               │  Firestore  │                  │
│                               │    + Auth   │                  │
│                               └─────────────┘                  │
└─────────────────────────────────────────────────────────────────┘

External Actors:
  👤 Artist (Seller) — registers, uploads artworks, confirms dispatch
  👤 Buyer           — browses, purchases, confirms receipt
  🔧 Admin           — moderates disputes, manages users
  💳 Payment Gateway — (future integration, e.g. Stripe)
```

**Narrative:**
- The **Frontend** (browser) communicates with the **Backend** over a REST API.
- The **Backend** validates business rules (especially transaction logic) and reads/writes to **Firebase Firestore**.
- **Firebase Authentication** issues JWT tokens which the frontend sends with every API request.
- External actors interact exclusively through the browser-based UI.

---

## 3. Use Case Diagram

```
                          ┌────────────────────────────────────────┐
                          │             ArtEX System               │
                          │                                        │
  ┌────────┐              │  ○ Register / Login                    │
  │        │──────────────│  ○ Edit Profile                        │
  │ Artist │──────────────│  ○ Upload Artwork                      │
  │(Seller)│──────────────│  ○ Manage Listings                     │
  │        │──────────────│  ○ Confirm Dispatch                    │
  │        │              │  ○ Chat with Buyer                     │
  └────────┘              │                                        │
                          │  ○ Register / Login                    │
  ┌────────┐              │  ○ Browse Artworks                     │
  │        │──────────────│  ○ Purchase Artwork                    │
  │ Buyer  │──────────────│  ○ Confirm Receipt                     │
  │        │──────────────│  ○ Chat with Artist                    │
  └────────┘              │                                        │
                          │  ○ Review Flagged Transactions         │
  ┌────────┐              │  ○ Ban / Warn Users                    │
  │ Admin  │──────────────│  ○ View Platform Statistics            │
  └────────┘              │                                        │
                          └────────────────────────────────────────┘

Key shared use cases:
  - «include» Purchase Artwork → Validate Transaction (system auto-validates)
  - «include» Upload Artwork → Moderate Content (admin reviews flagged uploads)
  - «extend»  Confirm Receipt → Release Funds (triggered on confirmation)
```

---

## 4. Component Diagram (Draft)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Browser)                       │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Auth UI  │  │ Gallery  │  │  Chat UI │  │ Profile / TX │   │
│  │(login/reg│  │  Pages   │  │          │  │  Dashboard   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       └─────────────┴─────────────┴────────────────┘           │
│                            │ REST / Fetch API                   │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                   Backend (Node.js + Express)                   │
│                            │                                    │
│  ┌─────────────┐  ┌────────▼──────┐  ┌────────────────────┐   │
│  │ Auth Router │  │ Artwork Router│  │ Transaction Router  │   │
│  │ /api/auth   │  │ /api/artworks │  │ /api/transactions   │   │
│  └──────┬──────┘  └───────┬───────┘  └──────────┬──────────┘   │
│         │                 │                       │              │
│  ┌──────▼─────────────────▼───────────────────────▼──────────┐ │
│  │                   Firebase SDK (Admin)                     │ │
│  └──────────────────────────┬───────────────────────────────┘  │
└───────────────────────────── │ ────────────────────────────────┘
                               │
┌──────────────────────────────┼────────────────────────────────┐
│                         Firebase                               │
│                              │                                 │
│  ┌───────────────────┐  ┌────▼──────────────┐                 │
│  │  Authentication   │  │     Firestore      │                 │
│  │  (JWT Tokens)     │  │  users / artworks  │                 │
│  └───────────────────┘  │  transactions /    │                 │
│                         │  messages          │                 │
│                         └───────────────────┘                  │
└────────────────────────────────────────────────────────────────┘
```

**Key component relationships:**
- The **Auth Router** verifies Firebase tokens on protected routes.
- The **Artwork Router** handles CRUD for artwork listings.
- The **Transaction Router** contains the core validation logic — it acts as the trusted third party, holding state and enforcing the confirmation flow.
- All routers access Firestore via the **Firebase Admin SDK** on the backend (never directly from the client for sensitive operations).
