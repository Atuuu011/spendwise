# 👥 Workload Allocation — SpendWise

Project members: **Atharva Shejwal** and **Vikas**

This document tracks file-level ownership and major responsibilities for the SpendWise group assignment. Both members reviewed each other's code, but the primary author of each file is listed below.

---

## 📁 Backend (\`/backend\`)

### Atharva — Authentication, Security & User layer

| File | Description |
|------|-------------|
| \`config/db.js\` | MongoDB Atlas connection setup |
| \`models/User.js\` | User schema with bcrypt password hashing |
| \`middleware/authMiddleware.js\` | JWT verification middleware |
| \`middleware/adminMiddleware.js\` | Admin role guard |
| \`middleware/errorHandler.js\` | Global error handler |
| \`utils/generateToken.js\` | JWT token signer |
| \`controllers/authController.js\` | Register, login, logout, getMe |
| \`routes/authRoutes.js\` | Auth endpoints |
| \`server.js\` | Express app entry point, CORS, routing |

### Vikas — Expenses, Admin & Activity layer

| File | Description |
|------|-------------|
| \`models/Expense.js\` | Expense schema with text index |
| \`models/UserActivity.js\` | Activity log schema (3rd entity) |
| \`middleware/activityLogger.js\` | Auto-logs every action |
| \`controllers/expenseController.js\` | Full CRUD + live search + stats |
| \`controllers/userController.js\` | Admin: list & delete users |
| \`controllers/activityController.js\` | Admin: list recent activities |
| \`routes/expenseRoutes.js\` | Expense endpoints |
| \`routes/userRoutes.js\` | Admin user endpoints |
| \`routes/activityRoutes.js\` | Admin activity endpoints |

---

## 🎨 Frontend (\`/frontend/src\`)

### Atharva — Auth, Dashboard, Layout & Project setup

| File | Description |
|------|-------------|
| \`pages/Login.jsx\` | Login page with glassmorphism design |
| \`pages/Register.jsx\` | Registration page |
| \`pages/Dashboard.jsx\` | Dashboard with stats, pie chart, monthly bar chart |
| \`components/Navbar.jsx\` | Hamburger drawer navigation |
| \`components/Loader.jsx\` | Loading spinner |
| \`components/StatCard.jsx\` | Dashboard stat cards |
| \`components/ProtectedRoute.jsx\` | Auth-required route guard |
| \`components/AdminRoute.jsx\` | Admin-only route guard |
| \`context/AuthContext.jsx\` | Global auth state |
| \`services/api.js\` | Axios instance with JWT injection |
| \`App.jsx\` | Routes wiring |
| \`main.jsx\` | App entry point |
| \`index.css\` | Global styles + glassmorphism utilities |
| \`tailwind.config.js\` | Tailwind theme |
| \`vite.config.js\` | Vite + backend proxy config |

### Vikas — Expenses, Admin, Reusable components

| File | Description |
|------|-------------|
| \`pages/Expenses.jsx\` | Expense list with live search + CRUD |
| \`pages/AdminUsers.jsx\` | Admin user management |
| \`pages/AdminActivities.jsx\` | Admin activity feed |
| \`components/ExpenseForm.jsx\` | Create/edit expense form |
| \`components/SearchBar.jsx\` | Reusable search input |
| \`components/Modal.jsx\` | Reusable modal wrapper |
| \`hooks/useDebounce.js\` | Debounce hook for live search |
| \`utils/formatters.js\` | Currency, date, category formatters |

---

## 📚 Documentation & Deployment

### Atharva
- MongoDB Atlas setup (cluster, network, database user)
- GitHub repository setup and initial push
- Backend deployment to Render
- Environment variable configuration

### Vikas
- README.md (project description, setup, API docs)
- WORKLOAD.md (this file)
- Frontend deployment to Vercel
- Demo video recording and editing
- Final submission package

---

## 🤝 Collaborative Effort

Both members:
- Reviewed each other's code before merging
- Tested each other's features end-to-end
- Resolved bugs together (e.g., bcryptjs → bcrypt migration)
- Discussed design and UX decisions
- Participated in tutorial demos
