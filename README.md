# 💰 SpendWise — Smart Personal Expense Tracker

> Track every dollar. Master your money.

A modern full-stack expense tracker built with the MERN stack featuring JWT authentication, real-time search, role-based access control, and a stunning glassmorphism UI.

## 🎯 The Problem It Solves

Most people struggle to keep track of where their money goes day to day. Pen-and-paper logs get lost, generic spreadsheets are too rigid, and most existing apps either bury simple actions behind too many screens or hide your data behind a paywall. **SpendWise** is a lightweight, single-page web app that lets a user sign up, log every expense in seconds, search through past spending instantly, and see clear visual breakdowns of where their money is going — all from one clean, focused interface.

For administrators (e.g. a household lead or a small team), SpendWise also provides oversight: a full audit log of every action and the ability to manage user accounts.

## 🌐 Live Demo

- **Frontend:** https://spendwise-hazel-one.vercel.app
- **Backend API:** https://spendwise-e6x4.onrender.com

### Test Credentials

We provide two seeded accounts so you can clearly see the role-based access control in action.

| Role | Email | Password | Demonstrates |
|------|-------|----------|--------------|
| Regular User | `test@test.com` | `123456` | Standard user flow — dashboard, expenses, search |
| Admin User | `admin@test.com` | `admin123` | Admin-only routes — user management, activity log |

The admin account is created by running `npm run seed-admin` from the `backend/` folder (see the [Admin Seeding](#️-admin-seeding) section below).

## ✨ Features

### 👤 User Features
- 🔐 Secure registration & login with JWT + bcrypt password hashing
- 💰 Full CRUD operations on expenses
- 🔍 Live search — filters expenses instantly as you type (debounced 300 ms)
- 📊 Dashboard with stat cards, category pie chart, and 6-month trend bar chart
- 🏷️ Categorized expenses (Food, Travel, Shopping, Bills, Entertainment, Other)
- 📱 Fully responsive design

### 🛡️ Admin Features
- 👥 View and manage all user accounts
- 📜 Audit log of every user action (register, login, logout, CRUD)
- 🗑️ Delete users (cascades to their expenses & activity logs)

### 🎨 UX & Design
- 🌌 Modern glassmorphism dark theme with indigo/purple gradients
- ☰ Slide-out hamburger drawer navigation
- ✨ Smooth animations & transitions
- 🍞 Toast notifications via react-hot-toast
- 🛡️ Protected and admin-only routes via React Router
- 🚫 Custom 404 page for any unknown URL

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — SPA framework + dev server
- **Tailwind CSS v3** — utility-first styling
- **React Router v6** — client-side routing
- **Axios** — HTTP client with auto-JWT interceptor
- **Recharts** — pie + bar charts on the dashboard
- **Lucide React** — icon library
- **React Hot Toast** — toast notifications

### Backend
- **Node.js** + **Express** — REST API server
- **MongoDB Atlas** + **Mongoose** — cloud database + ODM
- **JWT** (jsonwebtoken) — stateless authentication
- **Bcrypt** — password hashing (10 salt rounds)
- **Express-async-handler** — clean async error handling
- **CORS** — configured with regex matching for Vercel preview URLs

### Deployment
- **Vercel** — frontend hosting
- **Render** — backend hosting (with UptimeRobot keep-alive ping)
- **MongoDB Atlas** — managed database (M0 free tier, Singapore region)

## 📁 Project Structure

```
spendwise/
├── backend/
│   ├── config/                # MongoDB connection setup
│   │   └── db.js
│   ├── controllers/           # Route handler logic
│   │   ├── authController.js          # register / login / logout / getMe
│   │   ├── expenseController.js       # full CRUD + live search + stats
│   │   ├── userController.js          # admin: list and delete users
│   │   └── activityController.js      # admin: list recent activities
│   ├── middleware/            # Express middleware
│   │   ├── authMiddleware.js          # JWT verification
│   │   ├── adminMiddleware.js         # role guard
│   │   ├── activityLogger.js          # auto-audit every action
│   │   └── errorHandler.js            # global error handler
│   ├── models/                # Mongoose schemas (3 entities)
│   │   ├── User.js                    # auth + role + bcrypt pre-save hook
│   │   ├── Expense.js                 # title, amount, category, text index
│   │   └── UserActivity.js            # action audit log
│   ├── routes/                # Express route mounting
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── userRoutes.js
│   │   └── activityRoutes.js
│   ├── utils/                 # Helpers
│   │   └── generateToken.js           # JWT signer
│   ├── scripts/               # Standalone admin/dev scripts
│   │   ├── exportDb.js                # dumps all collections to JSON
│   │   ├── seedAdmin.js               # creates the demo admin user
│   │   └── promoteAdmin.js            # promotes an existing user to admin
│   ├── database-export/       # Submission database export (JSON)
│   │   ├── users.json
│   │   ├── expenses.json
│   │   └── useractivities.json
│   ├── server.js              # Express entry point, CORS, route mounting
│   ├── package.json
│   └── .env                   # PORT, MONGO_URI, JWT_SECRET, etc. (gitignored)
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── Navbar.jsx             # slide-out hamburger drawer
    │   │   ├── Loader.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── Modal.jsx              # reusable glass modal wrapper
    │   │   ├── SearchBar.jsx
    │   │   ├── ExpenseForm.jsx        # create/edit shared form
    │   │   ├── ProtectedRoute.jsx     # JWT-gated routes
    │   │   └── AdminRoute.jsx         # role-gated routes
    │   ├── pages/             # Top-level routed pages
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx          # stat cards + pie + bar charts
    │   │   ├── Expenses.jsx           # list + live search + CRUD
    │   │   ├── AdminUsers.jsx         # admin user management
    │   │   ├── AdminActivities.jsx    # admin activity feed
    │   │   └── NotFound.jsx           # custom 404 page
    │   ├── context/           # React Context providers
    │   │   └── AuthContext.jsx        # global user + token state
    │   ├── services/          # API layer
    │   │   └── api.js                 # Axios instance with JWT interceptor
    │   ├── hooks/             # Custom React hooks
    │   │   └── useDebounce.js         # debounce helper for live search
    │   ├── utils/             # Pure helpers
    │   │   └── formatters.js          # currency, date, category formatters
    │   ├── App.jsx                    # Router setup
    │   ├── main.jsx                   # React entry point
    │   └── index.css                  # Tailwind directives + design tokens
    ├── vercel.json            # SPA rewrite rule for direct URL access
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── .env                   # VITE_API_URL (gitignored)
```

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js 18+** (tested with v24)
- **npm 9+**
- **MongoDB Atlas account** (free M0 cluster works fine)

### 1. Clone the repo
```bash
git clone https://github.com/Atuuu011/spendwise.git
cd spendwise
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```

You should see `🚀 Server running on port 5001` and `✅ MongoDB Connected`.

### 3. Frontend setup (new terminal)
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the dev server:
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

## 🗄️ Database Export

The repo ships with a JSON export of all three collections in `backend/database-export/`:
- `users.json` — registered users (passwords stripped)
- `expenses.json` — all expense records
- `useractivities.json` — the audit log

To regenerate the export against your own database, run from the `backend/` folder:
```bash
npm run export-db
```

The script lives in `backend/scripts/exportDb.js` and uses the same `MONGO_URI` from your `.env`.

## 🛡️ Admin Seeding

The repo ships with a one-shot script that creates the demo admin user (or promotes them if they already exist). Run from the `backend/` folder:

```bash
npm run seed-admin
```

This creates:
- **Name:** Admin User
- **Email:** admin@test.com
- **Password:** admin123
- **Role:** admin

The script is **idempotent** — running it twice is safe. If the user already exists with the `admin` role, it does nothing. If the user exists but is a regular user, it promotes them.

To promote any other existing user to admin instead:

```bash
npm run promote-admin -- their.email@example.com
```

Both scripts live in `backend/scripts/` and use the same `MONGO_URI` from your `.env`.

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create a new user, return JWT |
| POST | `/login` | Public | Authenticate, return JWT |
| POST | `/logout` | Private | Log the action, client clears token |
| GET | `/me` | Private | Get current user from JWT |

### Expenses (`/api/expenses`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/?search=` | Private | List all expenses for current user (with optional search) |
| POST | `/` | Private | Create new expense |
| GET | `/:id` | Private | Get one expense |
| PUT | `/:id` | Private | Update an expense |
| DELETE | `/:id` | Private | Delete an expense |
| GET | `/stats/summary` | Private | Aggregated stats (total, monthly, by category) |

### Admin (`/api/users`, `/api/activities`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | List all users |
| DELETE | `/users/:id` | Admin | Delete user (cascade) |
| GET | `/activities` | Admin | List recent activity log entries |

## 🔒 Security

- ✅ Passwords hashed with **bcrypt** (10 salt rounds, native bindings)
- ✅ JWT signed with secret from environment variables
- ✅ Protected routes verify token on every request via `authMiddleware`
- ✅ Role-based access (`user` vs `admin`) enforced via `adminMiddleware`
- ✅ User-owned resource checks (you can only edit/delete your own expenses)
- ✅ CORS allowlist with regex matching for Vercel preview URLs
- ✅ No secrets committed — see `.gitignore`
- ✅ Passwords stripped from database export

## 👥 Team

| Name | Student ID | GitHub | Email |
|------|-----------|--------|-------|
| Atharva Shejwal | 26156923 | [@Atuuu011](https://github.com/Atuuu011) | atharvashejwal11@gmail.com |
| Vikas Ramesh | 26155135 | [@Vikasgowda13](https://github.com/Vikasgowda13) | vikasgowda1999@gmail.com |

See [`WORKLOAD.md`](./WORKLOAD.md) for the detailed file-by-file breakdown of who built what.

## 📝 License

MIT