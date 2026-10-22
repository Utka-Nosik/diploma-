# Technology Comparison — ArtEX

## Overview

This document compares alternative technology choices for three key technical decisions in the ArtEX platform: **server platform**, **data storage**, and **component interaction method**.

---

## 1. Server Platform

| Option | Pros | Cons |
|--------|------|------|
| **Node.js + Express** ✅ | Lightweight, fast I/O, large ecosystem, same language as frontend (JS), easy real-time support | Single-threaded, not ideal for CPU-heavy tasks |
| Python + Django | Full-featured, excellent ORM, mature ecosystem | Higher memory usage, more boilerplate, slower startup |
| Python + FastAPI | Async-native, auto-generates docs (OpenAPI), fast | Smaller ecosystem than Django, less convention |

**Decision:** Node.js + Express  
**Justification:** ArtEX is an I/O-bound platform (user uploads, API calls, real-time notifications). Node.js excels at handling concurrent connections with low overhead. The JS-everywhere approach also reduces cognitive overhead since the frontend is already JS-based. Express is minimal and un-opinionated which gives flexibility as the project grows.

---

## 2. Data Storage

| Option | Pros | Cons |
|--------|------|------|
| **Firebase Firestore** ✅ | Real-time sync, no server management, scales automatically, built-in auth | Vendor lock-in, costs scale with reads/writes, limited query complexity |
| PostgreSQL | Powerful relational queries, ACID transactions, open source | Requires server setup/maintenance, more complex scaling |
| MongoDB | Flexible document model, easy horizontal scaling | Weaker consistency guarantees, less structured data can cause issues |

**Decision:** Firebase Firestore  
**Justification:** ArtEX's early stage benefits greatly from Firebase's managed infrastructure — no DevOps overhead, built-in authentication, real-time listeners for notifications (e.g., when a transaction is validated), and seamless integration with the frontend. The data model (users, artworks, transactions) maps well to document storage.

---

## 3. Component Interaction Method

| Option | Pros | Cons |
|--------|------|------|
| **REST API** ✅ | Simple, stateless, well-understood, easy to test with tools like Postman | Over-fetching/under-fetching, multiple round-trips for complex data |
| GraphQL | Flexible queries, single endpoint, strongly typed schema | Higher complexity, steeper learning curve, overkill for simple CRUD |
| WebSockets | True real-time bidirectional communication | Persistent connections, harder to scale, more complex state management |

**Decision:** REST API (with WebSocket consideration for future real-time features)  
**Justification:** For the current scope of ArtEX — user profiles, artwork listings, transaction validation — REST is a natural fit. It is easy to reason about, well-supported by Express, and testable. Real-time features (e.g., live transaction status updates) can be layered on top with WebSockets or Firebase listeners without re-architecting the REST layer.

---

## Summary Table

| Decision | Chosen Technology | Key Reason |
|----------|------------------|------------|
| Server Platform | Node.js + Express | Fast I/O, JS ecosystem, lightweight |
| Data Storage | Firebase Firestore | Managed, real-time, no DevOps overhead |
| Component Interaction | REST API | Simple, testable, well-suited to CRUD operations |
