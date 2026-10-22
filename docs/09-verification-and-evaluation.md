# Verification and Evaluation Plan — ArtEX

## Overview

This document defines the testing plan, outcome metrics, measurement conditions, and baseline comparison for the ArtEX platform.

---

## 1. Project Aim (Recap)

**Goal:** Build a trustworthy online marketplace for artists where transactions are validated by the platform itself, protecting both buyers and sellers from fraud.

**Success looks like:** A working web platform where an artist can upload artwork, a buyer can purchase it, and the transaction completes only when both parties confirm — with no money lost or disputes unresolved.

---

## 2. Testing Plan

### 2.1 Unit Tests
| Test ID | Component | What is tested | Expected result |
|---------|-----------|---------------|----------------|
| UT-01 | Transaction Router | `confirmDispatch()` changes status to `DISPATCHED` | Status === "DISPATCHED" |
| UT-02 | Transaction Router | `confirmReceipt()` releases funds and sets `COMPLETED` | Status === "COMPLETED" |
| UT-03 | Auth Middleware | Request without JWT token is rejected | HTTP 401 Unauthorized |
| UT-04 | Artwork Router | Artwork upload with missing required field fails | HTTP 400 Bad Request |
| UT-05 | Transaction Router | Buyer cannot confirm dispatch (only seller can) | HTTP 403 Forbidden |

### 2.2 Integration Tests
| Test ID | Scenario | Steps | Expected result |
|---------|----------|-------|----------------|
| IT-01 | Full purchase flow | Register buyer → browse gallery → buy artwork → seller confirms → buyer confirms | Transaction reaches COMPLETED, both notified |
| IT-02 | Dispute flow | Buyer does not confirm within timeout period | Transaction flagged as DISPUTED, admin notified |
| IT-03 | Auth flow | Register → login → access protected route | Returns user data with valid token |
| IT-04 | Artwork CRUD | Upload → edit → delete artwork | Artwork removed from listing |

### 2.3 User Acceptance Tests (UAT)
| Test ID | Scenario | Actor | Pass Condition |
|---------|----------|-------|---------------|
| UAT-01 | Artist uploads artwork | Artist | Artwork visible in gallery within 5 seconds |
| UAT-02 | Buyer completes purchase | Buyer | Transaction status changes to COMPLETED |
| UAT-03 | Chat usage | Buyer + Artist | Messages delivered in real time |
| UAT-04 | Mobile UI | Any user | All pages usable on 375px screen |

### 2.4 Security Tests
| Test ID | Test | Expected result |
|---------|------|----------------|
| ST-01 | Send request with tampered JWT | HTTP 401 |
| ST-02 | Attempt to complete another user's transaction | HTTP 403 |
| ST-03 | SQL/NoSQL injection in input fields | Input sanitised, no data leak |
| ST-04 | Access artwork upload endpoint without authentication | HTTP 401 |

---

## 3. Outcome Metrics

| Metric | Target | How measured |
|--------|--------|-------------|
| Transaction completion rate | ≥ 90% of initiated transactions reach COMPLETED or are legitimately cancelled | Firestore query on transaction statuses |
| Page load time (core pages) | < 3 seconds on 4G | Chrome DevTools Lighthouse audit |
| API response time | < 500ms for 95% of requests under normal load | Manual timing / future load test |
| Zero plaintext passwords | 100% | Code review + Firebase Auth confirmation |
| Mobile usability score | Lighthouse mobile score ≥ 80 | Lighthouse audit |
| Bug rate post-UAT | 0 critical bugs, ≤ 3 minor bugs | GitHub Issues tracker |

---

## 4. Measurement Conditions

- **Environment:** Tests run on local development environment (Node.js server on `localhost:3000`) and against a staging Firebase project.
- **Test data:** A set of seed users (buyer, seller, admin) and at least 5 sample artworks created before each test run.
- **Tools used:**
  - Manual testing via browser + Postman
  - Chrome DevTools (Lighthouse for performance/mobile)
  - GitHub Issues for tracking bugs found during UAT
- **Timing:** Unit and integration tests run before each commit (manual for now; CI/CD in future scope). UAT performed at end of each development milestone.

---

## 5. Baseline Solution for Comparison

| Aspect | Baseline (no platform) | ArtEX |
|--------|----------------------|-------|
| Transaction safety | Buyer pays directly, no guarantee | Platform holds & validates before release |
| Dispute resolution | No mechanism — depends on goodwill | System flags disputes, admin can intervene |
| Artist visibility | Artist shares work on social media (no sales) | Centralised gallery with purchase flow |
| Communication | DMs on external platforms | In-platform chat tied to transaction |

**Comparison approach:** During UAT we will simulate a transaction flow both through ArtEX and through a manual (email-based) process and measure: time to complete, steps required, and ambiguity in outcome. ArtEX should demonstrate a measurably clearer and safer process.

---

## 6. How Achievement of Project Aim Will Be Demonstrated

The project aim will be demonstrated by:

1. **Live demo** of the full transaction lifecycle: register → upload artwork → purchase → confirm dispatch → confirm receipt → COMPLETED status visible.
2. **Security evidence:** Showing the JWT token middleware rejecting unauthorised requests.
3. **Metrics report:** Running Lighthouse and presenting scores for performance and mobile usability.
4. **Transaction log:** Showing Firestore records that track every state change with timestamps — proving the system is auditable and transparent.
