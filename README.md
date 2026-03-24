# 🎨 Portfolio Web Site

A modern, full-stack portfolio website showcasing software development and game development projects, with GitHub integration and blog functionality.

**Live:** (Coming Soon)
**GitHub:** https://github.com/LgrappaG/Workflows-Agents

## 🎯 Features

- ✅ Automatic GitHub repository synchronization
- ✅ Game development showcase section
- ✅ Blog system with markdown support
- ✅ Project filtering and search
- ✅ Responsive design with animations
- ✅ Contact form (no login required)
- ✅ GitHub API integration with caching
- ✅ SEO optimized
- ✅ Dark mode support (planned)
- ✅ Analytics integration

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14+ with TypeScript
- **Styling:** Tailwind CSS + CSS Modules
- **Components:** shadcn/ui, Framer Motion
- **State:** Zustand + Context API
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Caching:** Redis
- **GitHub API:** @octokit/rest

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Analytics:** Google Analytics

## 📦 Project Structure

```
portfolio/
├── frontend/           # Next.js app
├── backend/           # Express.js API
├── .github/workflows/ # CI/CD pipelines
├── docker-compose.yml # Local dev environment
├── PORTFOLIO_SETUP.md # Setup guide & database schema
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- GitHub Personal Access Token

### Local Development

1. **Clone and setup**
```bash
git clone <repo-url> portfolio
cd portfolio
cp .env.example .env

# Add your GitHub token to .env
```

2. **Start services**
```bash
npm run docker:up
npm install
```

3. **Initialize database**
```bash
npm run db:migrate
npm run db:seed
```

4. **Start dev servers**
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

### Using Docker Compose

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
```

## 📊 Database Schema

See [PORTFOLIO_SETUP.md](./PORTFOLIO_SETUP.md) for detailed schema documentation.

**Main Tables:**
- `users` - Admin users (future)
- `projects` - GitHub repository data
- `project_details` - Custom project metadata
- `articles` - Blog posts
- `skills` - Technology skills
- `experience` - Career timeline
- `github_activity` - API cache
- `page_analytics` - Site analytics

## 🔄 GitHub Integration

Projects are automatically synced from GitHub every 6 hours:
- Fetches all repositories
- Categorizes game dev projects
- Updates statistics (stars, forks)
- Caches data in Redis for performance

### Game Dev Detection
Automatically identifies game development projects based on:
- Repository name/description keywords
- Programming languages (C#, C++, GDScript, etc.)
- Topics/tags (unity, godot, unreal, etc.)

### How to Customize Categories

Edit project categories in admin panel or directly in database:
```sql
UPDATE projects SET category = 'game-dev' WHERE is_game_dev = TRUE;
UPDATE projects SET featured = TRUE WHERE slug IN ('project1', 'project2');
```

## 🔐 Environment Variables

See `.env.example` for all required variables.

**Critical Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection
- `GITHUB_TOKEN` - GitHub personal access token
- `SENDGRID_API_KEY` - Email service (optional)

## 📝 API Endpoints

### Projects
- `GET /api/projects` - List all projects (paginated, filtered)
- `GET /api/projects/:id` - Project details
- `GET /api/projects/featured` - Featured projects
- `GET /api/projects/game-dev` - Game dev projects

### GitHub
- `GET /api/github/user` - Current user info
- `GET /api/github/stats` - GitHub statistics
- `POST /api/github/sync` - Manual sync (admin only)

### Blog
- `GET /api/articles` - List articles
- `GET /api/articles/:slug` - Article content

### Other
- `GET /api/skills` - Technology skills
- `GET /api/experience` - Career timeline
- `POST /api/contact` - Contact form

See [API Documentation](./docs/API.md) for full details.

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# Coverage report
npm run test:coverage
```

## 🚢 Deployment

### Staging
```bash
git push origin develop
# GitHub Actions automatically deploys to staging
```

### Production
```bash
git push origin main
# GitHub Actions automatically deploys to production
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- [Setup Guide & Database Schema](./PORTFOLIO_SETUP.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 👤 Created by

**LgrappaG**
GitHub: https://github.com/LgrappaG
Portfolio: https://portfolio.example.com

---

**Last Updated:** March 25, 2026
**Status:** 🚀 Phase 1 - Setup & Planning
