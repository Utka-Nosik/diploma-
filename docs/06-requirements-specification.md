# Requirements Specification — ArtEX

## Project Overview

**ArtEX** is a web platform for artists to showcase and sell their digital and physical artworks. The platform acts as a trusted intermediary/validator during transactions to ensure fair, transparent deals between buyers and sellers.

---

## 1. Functional Requirements

### 1.1 User Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Users must be able to register with email and password | Must Have |
| FR-02 | Users must be able to log in and log out | Must Have |
| FR-03 | Users must be able to view and edit their profile (avatar, bio, username) | Must Have |
| FR-04 | Users must be able to follow other artists | Should Have |
| FR-05 | Users must be able to search for artists by name | Should Have |

### 1.2 Artwork Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-06 | Artists must be able to upload artworks (image + title + description + price) | Must Have |
| FR-07 | Artists must be able to set artwork visibility (public / private) | Should Have |
| FR-08 | Users must be able to browse and view artwork listings | Must Have |
| FR-09 | Users must be able to filter artworks by category, price range, and artist | Should Have |
| FR-10 | Artists must be able to delete or update their own listings | Must Have |

### 1.3 Transaction & Validation System
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-11 | Buyers must be able to initiate a purchase request on an artwork | Must Have |
| FR-12 | The system must act as a validated intermediary: funds held until delivery is confirmed | Must Have |
| FR-13 | Sellers must confirm dispatch; buyers must confirm receipt before funds are released | Must Have |
| FR-14 | The system must flag and freeze transactions that show signs of dispute | Should Have |
| FR-15 | Both parties must be notified at each step of the transaction lifecycle | Must Have |

### 1.4 Messaging
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-16 | Buyers and sellers must be able to communicate via in-platform chat | Must Have |
| FR-17 | Chat history must be preserved and accessible to both parties | Should Have |

### 1.5 Admin / Moderation
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-18 | Admins must be able to review flagged transactions | Should Have |
| FR-19 | Admins must be able to ban users who violate platform rules | Should Have |

---

## 2. Non-Functional Requirements

| ID | Requirement | Category | Priority |
|----|-------------|----------|----------|
| NFR-01 | The platform must load core pages within 3 seconds on a standard connection | Performance | Must Have |
| NFR-02 | All user data must be transmitted over HTTPS | Security | Must Have |
| NFR-03 | Passwords must be stored as hashes (never in plaintext) | Security | Must Have |
| NFR-04 | The UI must be responsive and usable on mobile, tablet, and desktop | Usability | Should Have |
| NFR-05 | The system must support at least 100 concurrent users in the initial release | Scalability | Should Have |
| NFR-06 | The platform must achieve 99% uptime during normal operations | Reliability | Should Have |
| NFR-07 | The codebase must be documented so another developer can onboard within a week | Maintainability | Nice to Have |

---

## 3. Priorities (MoSCoW)

| Priority | Meaning |
|----------|---------|
| **Must Have** | Core functionality — the product does not work without it |
| **Should Have** | Important but not launch-blocking |
| **Could Have** | Desirable if time allows |
| **Won't Have** | Out of scope for this version |

---

## 4. Acceptance Criteria

| ID | Acceptance Criterion | Linked Requirement |
|----|---------------------|--------------------|
| AC-01 | A user can register, log in, and see their profile without errors | FR-01, FR-02, FR-03 |
| AC-02 | An artist can upload an artwork and it appears in the public listing | FR-06, FR-08 |
| AC-03 | A buyer can initiate a purchase and both parties receive a notification | FR-11, FR-15 |
| AC-04 | Funds are not released until both seller confirms dispatch AND buyer confirms receipt | FR-12, FR-13 |
| AC-05 | All pages load within 3 seconds on a 4G connection | NFR-01 |
| AC-06 | No plaintext passwords are stored in the database | NFR-03 |
| AC-07 | The UI renders correctly on a 375px-wide mobile screen | NFR-04 |
