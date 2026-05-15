# PollSync

**Deployed Link:** https://live-polling-application-rose.vercel.app/

**Demo Video:** _Add demo video URL here_

PollSync is a full-stack polling application where creators can build polls, share vote links, collect responses, watch creator-only realtime updates, and publish final results. It includes authentication, protected creator dashboards, public voting pages, analytics links, Socket.io-powered live updates, and chart-based result views.

## Features

- User registration and login with JWT authentication
- Creator dashboard for managing polls
- Create polls with multiple questions and 2 to 4 options
- Draft, active, and ended poll states
- Public vote links for participants
- Anonymous voting support when enabled by the creator
- Duplicate vote protection per question
- Creator-only realtime analytics page
- Socket.io updates after votes are recorded
- Bar and pie charts using Recharts
- Public final-result page after creator publishes results
- Copy vote link, analytics link, and final result link actions
- Automatic poll expiry based on configured duration

## Tech Stack

**Frontend**

- React
- Vite
- React Router
- Axios
- Socket.io Client
- Recharts
- CSS modules/global CSS

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Joi validation
- Socket.io
- Nodemailer
- Docker Compose for local MongoDB

## Project Structure

```txt
PollSync/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── config/
│   │   │   ├── dto/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   └── module/
│   │       ├── auth/
│   │       ├── poll/
│   │       ├── public/
│   │       └── vote/
│   ├── docker-compose.yml
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Local Setup

### Prerequisites

- Node.js
- npm
- Docker Desktop, if using the included MongoDB Docker setup
- MongoDB Atlas account, if using a cloud database instead of Docker

### 1. Clone The Repository

```bash
git clone <your-repository-url>
cd "PollSync"
```

### 2. Start MongoDB

Using Docker Compose from the backend folder:

```bash
cd backend
docker compose up -d
```

This starts:

- MongoDB at `localhost:27017`
- Mongo Express at `http://localhost:8081`

You can also use MongoDB Atlas. In that case, replace `MONGODB_URI` in `backend/.env` with your Atlas connection string.

### 3. Configure Backend Environment

Create or update:

```txt
backend/.env
```

Example:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/authdb?authSource=admin

JWT_ACCESS_SECRET=replace_with_a_long_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=replace_with_a_long_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=replace_with_smtp_user
SMTP_PASS=replace_with_smtp_password
SMTP_FROM_NAME=PollSync
SMTP_FROM_EMAIL=noreply@pollsync.com
```

Required backend variables:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

SMTP variables are only needed for email-based password reset or verification flows.

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5. Run Backend

```bash
npm start
```

Backend runs at:

```txt
http://localhost:8080
```

### 6. Configure Frontend Environment

For local development, the frontend can use the Vite proxy and does not strictly need a `.env` file.

Optional:

```txt
frontend/.env
```

```env
VITE_API_BASE_URL=/api
VITE_SOCKET_URL=http://localhost:8080
```

### 7. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 8. Run Frontend

```bash
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

## How To Use

1. Register or log in as a poll creator.
2. Create a new poll from the dashboard.
3. Add one or more questions and options.
4. Start the poll.
5. Copy the vote link and share it with participants.
6. Open the realtime updates page to watch incoming votes.
7. End the poll when voting is complete.
8. Copy analytics or publish final results.
9. Share the final result link after publishing.

## Local Voting Test Flow

`localhost` means your own computer, not a specific user. To test multiple voters locally:

- Use normal Chrome for the poll creator.
- Use Incognito for voter 1.
- Close all Incognito windows and reopen for another anonymous voter.
- Or use another browser such as Edge or Firefox.
- Or clear site data/localStorage for `localhost:5173`.

The same vote link is shared with everyone:

```txt
http://localhost:5173/p/<shareCode>
```

Each voter is identified by logged-in account or browser fingerprint. A voter can vote once per question.

## Realtime Updates

Creators can open:

```txt
/polls/:pollId/realtime
```

This route is protected. Only the poll creator can join the live poll room.

Realtime updates use Socket.io:

- Creator joins room: `poll:<pollId>`
- Vote submission emits: `poll-vote-updated`
- Realtime page updates charts and totals
- A quiet refresh fallback keeps the page updated if a local socket connection fails

## Important Routes

### Frontend

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | Creator dashboard |
| `/polls/create` | Create poll |
| `/polls/:pollId/builder` | Manage poll |
| `/polls/:pollId/realtime` | Creator realtime analytics |
| `/p/:shareCode` | Public vote/final result page |
| `/analytics/:analyticsCode` | Public analytics page |

### Backend API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get logged-in user |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `PUT` | `/api/auth/reset-password/:token` | Reset password |
| `POST` | `/api/polls` | Create poll |
| `GET` | `/api/polls/my-polls` | Get creator polls |
| `GET` | `/api/polls/:pollId` | Get creator poll details |
| `PATCH` | `/api/polls/:pollId` | Update poll |
| `POST` | `/api/polls/:pollId/question` | Add question |
| `GET` | `/api/polls/:pollId/analytics` | Creator-only analytics |
| `PATCH` | `/api/polls/:pollId/publish-results` | Publish final results |
| `GET` | `/api/public/polls/:shareCode` | Get public poll |
| `GET` | `/api/public/analytics/:analyticsCode` | Get analytics by analytics code |
| `POST` | `/api/votes` | Submit vote |

## Scripts

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

## Deployment Notes

When deploying, update environment variables:

Backend:

```env
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_ACCESS_SECRET=<strong-secret>
JWT_REFRESH_SECRET=<strong-secret>
FRONTEND_URL=<your-frontend-url>
CLIENT_URL=<your-frontend-url>
```

Frontend:

```env
VITE_API_BASE_URL=<your-backend-url>/api
VITE_SOCKET_URL=<your-backend-url>
```

Also make sure the backend Socket.io CORS settings allow the deployed frontend URL.

## Author

Sanghita Seal
