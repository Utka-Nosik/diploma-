# Design and Development of a Full-Stack Web Application for Safe Artist–Client Commission Exchange

The project is a comfortable platform that offers everything a person needs to start a journey as a commission artist. Artists can present their work and get inspired by others (or inspire them), promote themselves, and take commissions in one place. A mediating layer between artist and client guarantees that the commission process is carried out fairly and with integrity.


## Project overview

### Problem statement

Three connected problems were identified. At this stage they are working hypotheses; Section 2 describes how each is going to be verified.
Artists.
Artists struggle to market themselves effectively on ordinary social media, where their audience consists mostly of non-artists. Taking the first step into commission work is risky: newcomers may be scammed (non-payment, chargebacks, fake commission requests) or have their work plagiarised.
Supporters of artists.
People who follow their favourite creators find it hard to see all their works in one place, because creators’ output is scattered across the internet and artists often migrate between social media platforms.
Both sides.
Artists and clients both need confidence that a commission will be completed fairly and with integrity. Today, in most cases, no neutral party exists to guarantee this - the project aims to become that party.


### Target users

- **Artists** who want to showcase a portfolio and receive commission requests.
- **Clients and art enthusiasts** who want to discover artists and commission artwork.

### Expected outcomes

- Make it easier to browse artwork and find artists.
- Provide artist profiles and portfolio information in one place.
- Demonstrate a commission workflow with status updates and related chat.

### Scope and development status

The current project is a working prototype with a gallery, artist directory and profiles, commission flows, chats, and a JSON-backed API. Authentication is mocked; payment and escrow are demonstrations only and do not process real transactions. Production-ready authentication, payments, and persistent production infrastructure are outside the current prototype scope.

### Technologies

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, and browser-side JavaScript
- **Data:** JSON-backed local data store
- **Other:** npm, CORS middleware

### Team


| Team Members| Responsobilities |
| --- | --- |
| Abrayev Daniyal | Frontend Dev |
| Abdikul Bakdaulet | Backend Dev |


**Supervisor:** Botagoz Mirzagalikova

### Project links

- **YouTrack project:** [YouTrack](https://artex.youtrack.cloud/projects/AWS)
- **Project documentation:** [Documentation](https://docs.google.com/document/d/1T23-jNKXgyj6EZ1w5x4RADl2IdUHlHtGefdcC9VqiD8/edit?usp=sharing)

## Screenshots

![ArtEX gallery screenshot placeholder](docs/images/gallery.png)

![Artist profile screenshot placeholder](docs/images/profile.png)

![Commissions and chats screenshot placeholder](docs/images/commissions-and-chats.png)

## Getting started

### Requirements

- Node.js
- npm

### Run locally

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser. The gallery is also available at [http://localhost:3000/index.html](http://localhost:3000/index.html).

The server uses port `3000` by default. Set the `PORT` environment variable to use another port.

## Demo access notice

> **To enter the demo account, open the [login page](http://localhost:3000/pages/login.html) and press “Forgot password?”** Authentication is currently a mock service; the link returns you to the app. There is no real password reset, password verification, or email delivery, so you do not need real credentials.

## Features

- Browse artwork and artist profiles.
- Search and filter artists and artwork.
- View and update profile information.
- Create commission requests and follow their status.
- View commission-related chats and send messages.
- Use a JSON-backed sample data store for local development.

## API overview

The API is served from the same origin as the frontend:

| Area | Base path | Examples |
| --- | --- | --- |
| Health check | `/api/health` | Check whether the server is running |
| Authentication | `/api/auth` | Register, mock login, and current demo user |
| Users | `/api/users` | List, search, view, and update profiles |
| Artworks | `/api/artworks` | List, filter, create, and like artworks |
| Commissions | `/api/commissions` | Create and update commission orders, submit deliveries |
| Chats | `/api/chats` | List chats, view a thread, and send messages |

## Project structure

```text
.
├── data/          # Sample JSON data and data-store logic
├── frontend/      # Static pages, styles, and browser scripts
├── routes/        # Express API route handlers
├── package.json
└── server.js       # Express server and static frontend hosting
```

## Development note

This is a prototype, not a production service. Authentication, payment, and escrow behavior are mocked; do not use real credentials or rely on it to process payments.
