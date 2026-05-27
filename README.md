# 💰 SpendWise — Smart Personal Expense Tracker

> Track every dollar. Master your money.

A modern full-stack expense tracker built with the MERN stack featuring JWT authentication, real-time search, role-based access control, and a stunning glassmorphism UI.

## 🌐 Live Demo

- **Frontend:** *live frontend url:- https://spendwise-git-main-atharva-s-projects15.vercel.app/login*
- **Backend API:** *live backend url:- https://spendwise-e6x4.onrender.com*

## Test Credentials
- Email.com: test@test.com
- Password: 123456

## ✨ Features

### 👤 User Features
- 🔐 Secure registration & login with JWT + bcrypt password hashing
- 💰 Full CRUD operations on expenses
- 🔍 Live search — filters expenses instantly as you type
- 📊 Dashboard with stat cards, category pie chart, and monthly trend bar chart
- 🏷️ Categorized expenses (Food, Travel, Shopping, Bills, Entertainment, Other)
- 📱 Fully responsive design

### 🛡️ Admin Features
- 👥 View and manage all user accounts
- 📜 Audit log of every user action
- 🗑️ Delete users (cascades to their expenses & activity logs)

### 🎨 UX & Design
- 🌌 Modern glassmorphism dark theme with indigo/purple gradients
- ☰ Slide-out hamburger drawer navigation
- ✨ Smooth animations & transitions
- 🍞 Toast notifications
- 🛡️ Protected and admin-only routes

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios (with auto-JWT interceptor)
- Recharts (pie + bar charts)
- Lucide React (icons)
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Express-async-handler

## 📁 Project Structure

\`\`\`
spendwise/
├── backend/
│   ├── config/             # DB connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, admin, activity logger, error handler
│   ├── models/             # Mongoose schemas (User, Expense, UserActivity)
│   ├── routes/             # Express routers
│   ├── utils/              # JWT generator
│   └── server.js
└── frontend/
    └── src/
        ├── components/     # Reusable UI components
        ├── pages/          # Login, Register, Dashboard, Expenses, Admin
        ├── context/        # AuthContext (global state)
        ├── services/       # Axios instance
        ├── hooks/          # useDebounce
        ├── utils/          # Formatters
        └── App.jsx
\`\`\`

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account

### 1. Clone
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/spendwise.git
cd spendwise
\`\`\`

### 2. Backend
\`\`\`bash
cd backend
npm install
\`\`\`

Create \`backend/.env\`:
\`\`\`env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
\`\`\`

Run: \`npm run dev\`

### 3. Frontend
\`\`\`bash
cd frontend
npm install
\`\`\`

Create \`frontend/.env\`:
\`\`\`env
VITE_API_URL=http://localhost:5001/api
\`\`\`

Run: \`npm run dev\` and open http://localhost:5173

## 📡 API Endpoints

### Auth
- POST /api/auth/register — public
- POST /api/auth/login — public
- POST /api/auth/logout — private
- GET /api/auth/me — private

### Expenses
- GET /api/expenses?search= — private
- POST /api/expenses — private
- GET /api/expenses/:id — private
- PUT /api/expenses/:id — private
- DELETE /api/expenses/:id — private
- GET /api/expenses/stats/summary — private

### Admin
- GET /api/users — admin
- DELETE /api/users/:id — admin
- GET /api/activities — admin

## 🔒 Security

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT signed with secret from env vars
- ✅ Protected routes verify token on every request
- ✅ Role-based access (user vs admin)
- ✅ User-owned resource checks
- ✅ No secrets committed (see .gitignore)

## 👥 Team

- **Atharva Shejwal** — Backend auth, JWT, User model, Dashboard, Auth pages, deployment
- **Vikas** — Expense CRUD, live search, admin pages, activity logging, components

See WORKLOAD.md for the detailed file-by-file breakdown.

## 📝 License

MIT
