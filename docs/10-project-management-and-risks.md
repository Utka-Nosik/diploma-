# Project Management and Risks — ArtEX

## 1. Git Repository

**Repository:** https://github.com/Utka-Nosik/diploma-.git  
**Branch strategy:** All development happens on `main` for now. Feature branches will be introduced as the team grows.

**Commit conventions:**
- Each major document or feature addition gets its own commit
- Commit messages describe what was added/changed

---

## 2. YouTrack / Task Tracker

> **Note:** A YouTrack project will be set up at `https://youtrack.jetbrains.com` for sprint planning and task tracking. Below is the initial task breakdown.

### Current Task Board (Initial Sprint)

| Task ID | Task | Assignee | Status | Priority |
|---------|------|----------|--------|----------|
| ART-01 | Set up Node.js + Express server | Team | ✅ Done | High |
| ART-02 | Create basic frontend HTML structure | Team | ✅ Done | High |
| ART-03 | Connect frontend to backend (API call) | Team | ✅ Done | High |
| ART-04 | Write Technology Comparison doc | Team | ✅ Done | Medium |
| ART-05 | Write Requirements Specification | Team | ✅ Done | Medium |
| ART-06 | Write Architecture & Diagrams doc | Team | ✅ Done | Medium |
| ART-07 | Write UX / Prototype doc | Team | ✅ Done | Medium |
| ART-08 | Write Verification & Evaluation Plan | Team | ✅ Done | Medium |
| ART-09 | Implement Firebase Authentication | Team | 🔲 To Do | High |
| ART-10 | Implement artwork upload (backend + frontend) | Team | 🔲 To Do | High |
| ART-11 | Implement transaction validation system | Team | 🔲 To Do | High |
| ART-12 | Implement in-platform chat | Team | 🔲 To Do | Medium |
| ART-13 | Build gallery page with filters | Team | 🔲 To Do | Medium |
| ART-14 | Build profile page (edit + view) | Team | 🔲 To Do | Medium |
| ART-15 | Admin panel: review flagged transactions | Team | 🔲 To Do | Low |

---

## 3. Allocation of Responsibilities

| Area | Responsibility |
|------|---------------|
| Backend (Node.js, Firebase, API) | Backend developer |
| Frontend (HTML, CSS, JS, UI) | Frontend developer |
| Transaction logic & security | Both (reviewed together) |
| Documentation & diagrams | Both |
| Testing (UAT, Postman) | Both |
| Project management & commits | Both |

---

## 4. Project Milestones

| Milestone | Description | Target Date |
|-----------|-------------|-------------|
| **M1 — Foundation** | Server running, basic frontend connected to backend, docs started | ✅ October 2026 |
| **M2 — Auth & Profiles** | Firebase Auth integrated, user profiles working | November 2026 |
| **M3 — Gallery & Listings** | Artists can upload, buyers can browse | November 2026 |
| **M4 — Transactions** | Full buy → validate → complete flow working | December 2026 |
| **M5 — Chat & Notifications** | In-platform chat and transaction notifications | December 2026 |
| **M6 — Polish & Testing** | UAT, bug fixing, UI improvements, Lighthouse audit | January 2027 |
| **M7 — Final Demo** | Complete working platform, all docs finalised | February 2027 |

---

## 5. Risks and Mitigations

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|-----------|--------|-----------|
| R-01 | Firebase Firestore costs exceed free tier limits | Medium | Medium | Monitor usage dashboard; implement pagination to reduce reads |
| R-02 | Transaction validation logic has edge-case bugs (e.g. double-confirm) | High | High | Thorough unit testing of all state transitions; use Firestore transactions (atomic writes) |
| R-03 | Payment gateway integration is complex and delayed | Medium | High | Use mocked payment for demo; integrate Stripe in post-diploma phase |
| R-04 | Scope creep — too many features added before core is stable | High | Medium | Strict MoSCoW prioritisation; admin approves any scope changes |
| R-05 | Team member unavailable for a period | Low | High | All code committed and documented; each area has shared understanding |
| R-06 | Security vulnerability in authentication | Low | High | Use Firebase Auth (battle-tested); validate tokens server-side on every request |
| R-07 | Poor mobile performance due to large image uploads | Medium | Medium | Compress images before upload; implement lazy loading in gallery |

---

## 6. Dependencies

| Dependency | Type | Impact if unavailable |
|------------|------|-----------------------|
| Firebase (Auth + Firestore) | External service | Core auth and data storage would fail |
| Node.js runtime | Local + server | Backend cannot run |
| GitHub | Version control hosting | Code backup and collaboration affected |
| Internet connection | Infrastructure | Firebase SDK requires connectivity |

---

## 7. Next Steps

The immediately actionable next steps after completing documentation:

1. **Set up Firebase project** — create Firestore database and enable Authentication
2. **Implement `/api/auth` routes** — register and login endpoints using Firebase Admin SDK
3. **Build gallery page** — static HTML + CSS listing page with sample artwork cards
4. **Artwork upload form** — form on frontend + POST `/api/artworks` on backend
5. **Create YouTrack project** — move task board above into YouTrack for sprint tracking
