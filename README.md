# 🗂️ TaskFlow — Collaborative Project Management App

> **Module:** JavaScript · Express · MongoDB · Docker · GitHub  
> **Deadline:** 20 May 2026  
 

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Team & Feature Assignments](#team--feature-assignments)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Git Workflow](#git-workflow)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Deliverables](#deliverables)

---

## 📖 About the Project

**TaskFlow** is a fullstack web application for collaborative project management.  
Users can create projects, manage tasks, assign team members, and track activity — all in one place.

### Key Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | 🔐 Authentication | Register / Login with JWT + bcrypt |
| 2 | 📁 Projects | Create, edit, delete projects with pagination |
| 3 | ✅ Tasks | Full CRUD with priority & status validation |
| 4 | 👤 Assignment | Assign tasks to team members |
| 5 | 📊 Dashboard | Personal stats via MongoDB aggregation |
| 6 | 🔍 Filter & Search | Filter by status, priority, member + keyword search |
| 7 | 💾 Draft Save | Auto-save form data to localStorage |
| 8 | 👥 Members | Invite/remove members by email |
| 9 | 📜 Activity Log | Chronological history of all project actions |
| 10 | 🔔 Notifications | Client-side polling + badge + localStorage archive |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript, Axios, HTML/CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (in Docker) + Mongoose |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **DevOps** | Docker, Docker Compose |
| **Version Control** | Git + GitHub (Conventional Commits) |

---


---

## 📁 Project Structure

```
taskflow/
├── docker-compose.yml          # Starts the entire app
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── .env                    # ⛔ Never commit this file
│   ├── package.json
│   └── src/
│       ├── index.js            # Express entry point
│       ├── config/
│       │   └── db.js           # Mongoose connection
│       ├── models/
│       │   ├── User.js
│       │   ├── Project.js
│       │   ├── Task.js
│       │   ├── Activity.js
│       │   └── Notification.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── projectController.js
│       │   ├── taskController.js
│       │   ├── dashboardController.js
│       │   ├── memberController.js
│       │   ├── activityController.js
│       │   └── notificationController.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── projects.js
│       │   ├── tasks.js
│       │   ├── dashboard.js
│       │   ├── members.js
│       │   ├── activities.js
│       │   └── notifications.js
│       └── middlewares/
│           ├── authMiddleware.js   # Verifies JWT on protected routes
│           └── validate.js         # Input validation
│
└── frontend/
    ├── Dockerfile
    ├── index.html
    ├── main.js
    └── src/
        ├── components/
        ├── pages/
        └── services/
            └── api.js              # Axios instance with JWT header
```

---

## 🚀 Getting Started

### Requirements

- [Git](https://git-scm.com/download/win)
- [Node.js 20 LTS](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with WSL2)

### 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2 — Create your `.env` file

```bash
# backend/.env  — never commit this!
PORT=5000
MONGO_URI=mongodb://root:rootpassword@mongo:27017/taskflow?authSource=admin
JWT_SECRET=replace_with_a_very_long_random_string
JWT_EXPIRES_IN=7d
```

### 3 — Start everything with Docker

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Backend API | http://localhost:5000 |
| Frontend | http://localhost:5173 |
| MongoDB | localhost:27017 |

### Other useful commands

```bash
docker compose up           # start without rebuilding
docker compose down         # stop containers
docker compose down -v      # stop + wipe database
docker logs taskflow_backend  # view backend logs
```

---

## 🌿 Git Workflow

We follow a **Feature Branch Workflow**. Here is how every team member works day to day:

### Step-by-step

```bash
# 1. Always start from an up-to-date develop branch
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Work, then commit regularly
git add .
git commit -m "feat: describe what you did"

# 4. Push your branch
git push -u origin feature/your-feature-name

# 5. Open a Pull Request on GitHub
#    → base: develop  ←  compare: feature/your-feature-name
#    → Ask at least ONE teammate to review before merging
```

### Rules

- ✅ `main` — stable, production-ready code only
- ✅ `develop` — integration branch, all features merge here
- ✅ All merges go through **Pull Requests** reviewed by a teammate
- ⛔ Never push directly to `main` or `develop`
- ⛔ Never commit `.env` files

---

## 🌲 Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable releases only — never commit directly |
| `develop` | Integration — merge all features here |
| `feature/authentification` | Feature 1 |
| `feature/projets` | Feature 2 |
| `feature/taches` | Feature 3 |
| `feature/assignation` | Feature 4 |
| `feature/dashboard` | Feature 5 |
| `feature/filtrage` | Feature 6 |
| `feature/brouillons` | Feature 7 |
| `feature/membres` | Feature 8 |
| `feature/activites` | Feature 9 |
| `feature/notifications` | Feature 10 |

---

## ✍️ Commit Convention

We follow **[Conventional Commits](https://www.conventionalcommits.org/)**.

### Format

```
type: short description in lowercase
```

### Types

| Type | When to use |
|------|-------------|
| `feat:` | Adding a new feature |
| `fix:` | Fixing a bug |
| `docs:` | Documentation changes |
| `refactor:` | Code cleanup, no feature change |
| `style:` | Formatting only |
| `test:` | Adding or updating tests |
| `chore:` | Config files, dependencies |

### Examples

```bash
git commit -m "feat: add user schema with bcrypt password hashing"
git commit -m "feat: implement JWT login route"
git commit -m "feat: add authentication middleware"
git commit -m "fix: correct password comparison logic"
git commit -m "feat: add project schema with owner reference"
git commit -m "feat: implement project CRUD routes"
git commit -m "feat: add cascade delete on project removal"
git commit -m "docs: update README with team assignments"
```

---

## 🔌 API Overview

All routes except `/api/auth/*` require the header:

```
Authorization: Bearer <your_jwt_token>
```

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |

### Projects

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects?page=1&limit=10` | List projects (paginated) |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project + cascade tasks |

### Tasks

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects/:id/tasks` | All tasks for a project |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Update status only |

### Dashboard & More

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/dashboard` | Personal stats (aggregation) |
| GET | `/api/projects/:id/activities` | Activity feed |
| GET | `/api/notifications` | Unread notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Express server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://root:pass@mongo:27017/taskflow?authSource=admin` |
| `JWT_SECRET` | Secret key for signing tokens | `a_very_long_random_string` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |

> Create `backend/.env` from the example above. This file is in `.gitignore` and must **never** be committed.

---

## 📦 Deliverables — 20 May 2026

- [ ] GitHub repository link (public, instructor has access)
- [ ] All 10 feature branches with Pull Requests visible in history
- [ ] Every team member has commits on their personal GitHub account
- [ ] `docker compose up --build` starts the entire application
- [ ] Demo video — max 2 minutes showing the features
- [ ] Form filled: https://forms.gle/5jAUEv1fu2ea2Hgd6

---

## ⚠️ Eliminatory Faults

These mistakes result in **automatic disqualification**:

- Storing passwords in plain text (must use bcryptjs, min 10 rounds)
- Committing the `.env` file to Git
- MongoDB running directly on the host machine instead of Docker
- A team member with **zero commits** in the Git history

---

*TaskFlow — Module Project 2026*
