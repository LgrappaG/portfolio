# 🚀 PHASE 2 - BACKEND DEVELOPMENT PLAN

**Başlangıç:** 25-Mar-2026
**Tahmini Süre:** 2-3 hafta
**Tech Stack:** Express.js + TypeScript + Prisma + Redis
**GitHub User:** LgrappaG

---

## 📊 ARCHITECTURE OVERVIEW

```
┌────────────────────────────────────────────────┐
│           Express.js Server                     │
├────────────────────────────────────────────────┤
│  Routes Layer (HTTP)                           │
│  ├─ projectsRoutes.ts                          │
│  ├─ githubRoutes.ts                            │
│  └─ skillsRoutes.ts                            │
├────────────────────────────────────────────────┤
│  Controllers Layer (Request Handling)          │
│  ├─ ProjectController                          │
│  ├─ GitHubController                           │
│  └─ SkillsController                           │
├────────────────────────────────────────────────┤
│  Services Layer (Business Logic)               │
│  ├─ GitHubService ← @octokit/rest              │
│  ├─ ProjectService                             │
│  ├─ CacheService ← Redis                       │
│  └─ GameDevDetection                           │
├────────────────────────────────────────────────┤
│  Database Layer (Prisma ORM)                   │
│  └─ PostgreSQL (8 tables)                      │
├────────────────────────────────────────────────┤
│  Jobs Layer (Background Tasks)                 │
│  ├─ GitHubSyncJob (cron: every 6h)             │
│  └─ CacheRefreshJob                            │
└────────────────────────────────────────────────┘
```

---

## 📁 DIRECTORY STRUCTURE

```
backend/src/
├── server.ts                    ← Main entry point
├── config/
│   ├── database.ts            ← Prisma client
│   ├── redis.ts               ← Redis connection
│   ├── github.ts              ← GitHub config
│   └── environment.ts         ← Env validation
│
├── controllers/
│   ├── projectController.ts   ← Project HTTP handlers
│   ├── githubController.ts    ← GitHub API handlers
│   ├── articleController.ts   ← Article handlers
│   ├── skillController.ts     ← Skill handlers
│   └── analyticsController.ts ← Analytics handlers
│
├── services/
│   ├── GitHubService.ts       ⭐ GitHub API integration
│   ├── ProjectService.ts      ⭐ Project CRUD & sync
│   ├── CacheService.ts        ⭐ Redis operations
│   ├── GameDevDetectionService.ts ⭐ Game classification
│   ├── ArticleService.ts      ← Blog operations
│   └── AnalyticsService.ts    ← Stats tracking
│
├── routes/
│   ├── projectRoutes.ts       ← /api/projects/*
│   ├── githubRoutes.ts        ← /api/github/*
│   ├── articleRoutes.ts       ← /api/articles/*
│   ├── skillRoutes.ts         ← /api/skills/*
│   └── analyticsRoutes.ts     ← /api/analytics/*
│
├── middleware/
│   ├── errorHandler.ts        ← Error handling
│   ├── validation.ts          ← Request validation
│   ├── logger.ts              ← Logging
│   ├── rateLimit.ts           ← Rate limiting
│   └── auth.ts                ← JWT auth (future)
│
├── jobs/
│   ├── githubSyncJob.ts       ⭐ 6-hour scheduler
│   └── cacheRefreshJob.ts     ← Cache management
│
├── types/
│   ├── index.ts               ← Common types
│   ├── github.ts              ← GitHub API types
│   ├── project.ts             ← Project types
│   └── api.ts                 ← API response types
│
├── utils/
│   ├── validators.ts          ← Input validation
│   ├── formatters.ts          ← Data formatting
│   ├── helpers.ts             ← Common functions
│   └── constants.ts           ← Constants
│
└── database/
    ├── prisma.ts              ← Prisma client export
    └── seed.ts                ← Seed data

tests/
├── unit/
│   ├── services/
│   │   ├── GitHubService.test.ts
│   │   ├── ProjectService.test.ts
│   │   └── GameDevDetection.test.ts
│   └── utils/
│
├── integration/
│   ├── projects.test.ts
│   ├── github.test.ts
│   └── articles.test.ts
│
└── mocks/
    ├── github-responses.json
    └── mockGitHubService.ts
```

---

## 🔌 GITHUB SERVICE (GitHubService.ts)

### **Responsibilities:**
- Fetch user data from GitHub
- List all repositories
- Enrich repo data (languages, stats)
- Handle rate limiting
- Cache responses in Redis

### **Key Methods:**

```typescript
class GitHubService {
  // Initialization with Octokit
  constructor(token: string)

  // User Operations
  async getUserData(username: string): Promise<GitHubUser>
  async getUserStats(username: string): Promise<UserStats>

  // Repository Operations
  async getAllRepos(username: string): Promise<EnrichedRepo[]>
  async getRepoLanguages(owner: string, repo: string): Promise<Languages>
  async getContributors(owner: string, repo: string): Promise<number>

  // Data Enrichment
  async enrichRepository(repo: any): Promise<EnrichedRepo>
  detectGameDev(repo: any, languages: any): boolean

  // Caching
  getCachedRepos(username: string): Promise<EnrichedRepo[] | null>
  setCachedRepos(username: string, repos: EnrichedRepo[]): Promise<void>
}
```

### **Game Dev Detection Logic:**

```typescript
private detectGameDev(repo: any, languages: any): boolean {
  // Keywords to detect game dev projects
  const gameKeywords = [
    'game',
    'unity',
    'godot',
    'unreal',
    'pygame',
    'game-dev',
    'game-engine',
    '3d',
    'itch'
  ];

  // Game engines
  const gameEngines = ['Unity', 'Godot', 'Unreal', 'Phaser', 'Babylon.js'];

  // Combine all text fields
  const text = `${repo.name} ${repo.description || ''} ${repo.topics?.join(' ') || ''}`.toLowerCase();

  // Check keywords
  const hasGameKeyword = gameKeywords.some(kw => text.includes(kw));

  // Check languages
  const hasGameLanguage = gameEngines.some(engine =>
    Object.keys(languages || {}).some(lang => lang.includes(engine))
  );

  return hasGameKeyword || hasGameLanguage;
}
```

---

## 💾 PROJECT SERVICE (ProjectService.ts)

### **Responsibilities:**
- CRUD operations for projects
- GitHub sync to database
- Featured project management
- Project filtering & search
- Category management

### **Key Methods:**

```typescript
class ProjectService {
  // Sync Operations
  async syncProjectsFromGitHub(username: string): Promise<number>

  // CRUD
  async getProjectById(id: number): Promise<Project | null>
  async getProjects(filters: ProjectFilter): Promise<PaginatedProjects>
  async getFeaturedProjects(): Promise<Project[]>
  async getGameDevProjects(): Promise<Project[]>

  // Management
  async createProject(data: CreateProjectInput): Promise<Project>
  async updateProject(id: number, data: UpdateProjectInput): Promise<Project>
  async deleteProject(id: number): Promise<boolean>
  async setFeatured(id: number, featured: boolean): Promise<Project>

  // Search & Filter
  async searchProjects(query: string): Promise<Project[]>
  async filterProjects(filters: ProjectFilter): Promise<Project[]>

  // Statistics
  async getProjectStats(): Promise<ProjectStats>
}
```

### **Sync Flow:**

```typescript
async syncProjectsFromGitHub(username: string): Promise<number> {
  // 1. Fetch all repos from GitHub
  const repos = await this.githubService.getAllRepos(username);

  let syncedCount = 0;

  // 2. For each repo, upsert to database
  for (const repo of repos) {
    const upserted = await prisma.project.upsert({
      where: { githubId: repo.id },
      update: {
        name: repo.name,
        description: repo.description,
        starsCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        isGameDev: this.detectGameDev(repo),
        technologies: Object.keys(repo.languages || {}),
        syncedAt: new Date(),
      },
      create: {
        githubId: repo.id,
        name: repo.name,
        slug: this.generateSlug(repo.name),
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        starsCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        isGameDev: this.detectGameDev(repo),
        technologies: Object.keys(repo.languages || {}),
      },
    });

    syncedCount++;
  }

  return syncedCount;
}
```

---

## 🔄 CACHE SERVICE (CacheService.ts)

### **Responsibilities:**
- Redis connection management
- Cache get/set/delete
- TTL management
- Cache invalidation

### **Key Methods:**

```typescript
class CacheService {
  constructor(redisUrl: string)

  async get<T>(key: string): Promise<T | null>
  async set<T>(key: string, value: T, ttl?: number): Promise<void>
  async delete(key: string): Promise<void>
  async invalidatePattern(pattern: string): Promise<void>
  async clear(): Promise<void>

  // Specific caches
  async cacheRepos(username: string, repos: any[]): Promise<void>
  async getCachedRepos(username: string): Promise<any[] | null>
  async invalidateReposCache(username: string): Promise<void>
}
```

### **Cache Keys Strategy:**

```
github:user:{username}           // User info (1 hour TTL)
github:repos:{username}          // All repos (6 hour TTL)
github:repo:{owner}:{name}       // Single repo (1 hour TTL)
project:id:{id}                  // Project by ID (1 day TTL)
project:search:{query}           // Search results (1 hour TTL)
project:featured                 // Featured projects (1 day TTL)
project:stats                    // Overall stats (6 hour TTL)
```

---

## 🌐 REST API ENDPOINTS

### **Projects Endpoints**

#### `GET /api/projects`
**Description:** List all projects with filtering and pagination
**Query Params:**
```
- page: number (default: 1)
- limit: number (default: 12)
- category: 'software-dev' | 'game-dev' | 'tool'
- language: string (e.g., 'TypeScript', 'C#', 'Python')
- sort: 'recent' | 'popular' | 'oldest'
- search: string (search in name/description)
- featured: boolean
```

**Response:**
```typescript
{
  success: true,
  data: {
    projects: Project[],
    total: number,
    page: number,
    pages: number
  }
}
```

#### `GET /api/projects/:id`
**Description:** Get single project details with related data
**Response:**
```typescript
{
  success: true,
  data: {
    id: number,
    name: string,
    description: string,
    url: string,
    starsCount: number,
    forksCount: number,
    isGameDev: boolean,
    technologies: string[],
    details: {
      summary: string,
      features: string[],
      screenshots: string[],
      learningPoints: string[]
    }
  }
}
```

#### `GET /api/projects/featured`
**Description:** Get featured projects
**Response:**
```typescript
{
  success: true,
  data: Project[]
}
```

#### `GET /api/projects/game-dev`
**Description:** Get all game development projects
**Response:**
```typescript
{
  success: true,
  data: Project[]
}
```

### **GitHub Endpoints**

#### `GET /api/github/user`
**Description:** Get GitHub user information (cached)
**Response:**
```typescript
{
  success: true,
  data: {
    login: string,
    name: string,
    bio: string,
    avatar_url: string,
    followers: number,
    following: number,
    public_repos: number,
    created_at: string
  }
}
```

#### `GET /api/github/stats`
**Description:** Get aggregated GitHub statistics
**Response:**
```typescript
{
  success: true,
  data: {
    totalProjects: number,
    totalStars: number,
    totalForks: number,
    averageStars: number,
    languages: Record<string, number>,
    gameDevProjects: number,
    softwareProjects: number,
    lastSync: string
  }
}
```

#### `POST /api/github/sync` (Admin Only)
**Description:** Manually trigger GitHub sync
**Request:**
```typescript
{
  username: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    syncedProjects: number,
    timestamp: string
  }
}
```

### **Skills Endpoints**

#### `GET /api/skills`
**Description:** Get all skills with categories
**Query Params:**
```
- category: 'frontend' | 'backend' | 'gamedev' | 'devops'
- featured: boolean
```

**Response:**
```typescript
{
  success: true,
  data: {
    frontend: Skill[],
    backend: Skill[],
    gamedev: Skill[],
    devops: Skill[]
  }
}
```

---

## 📅 BACKGROUND JOBS

### **GitHub Sync Job (6-hour scheduler)**

```typescript
// jobs/githubSyncJob.ts

import cron from 'node-cron';
import { GitHubService } from '../services/GitHubService';
import { ProjectService } from '../services/ProjectService';
import { logger } from '../utils/logger';

export class GitHubSyncJob {
  private githubService: GitHubService;
  private projectService: ProjectService;

  constructor() {
    this.githubService = new GitHubService(process.env.GITHUB_TOKEN!);
    this.projectService = new ProjectService(this.githubService);
  }

  start() {
    // Run every 6 hours (0:00, 6:00, 12:00, 18:00)
    cron.schedule('0 */6 * * *', async () => {
      try {
        logger.info('🔄 Starting GitHub sync job...');

        const syncedCount = await this.projectService.syncProjectsFromGitHub(
          process.env.GITHUB_USERNAME!
        );

        logger.info(`✅ GitHub sync completed. Synced ${syncedCount} projects`);

        // Invalidate cache
        await cacheService.invalidateReposCache(process.env.GITHUB_USERNAME!);
        logger.info('♻️ Cache invalidated');
      } catch (error) {
        logger.error('❌ GitHub sync job failed:', error);
      }
    });

    logger.info('✨ GitHub sync job scheduled (every 6 hours)');
  }
}

// Usage in server.ts:
const syncJob = new GitHubSyncJob();
syncJob.start();
```

---

## 🧪 TESTING STRATEGY

### **Unit Tests (UserGitHubService.test.ts)**

```typescript
describe('GitHubService', () => {
  let githubService: GitHubService;
  let mockOctokit: jest.Mocked<Octokit>;

  beforeEach(() => {
    mockOctokit = jest.createMockFromModule('@octokit/rest');
    githubService = new GitHubService('mock-token');
  });

  test('should fetch user data successfully', async () => {
    const mockUserData = {
      login: 'testuser',
      name: 'Test User',
      followers: 100,
    };

    mockOctokit.users.getByUsername.mockResolvedValueOnce({
      data: mockUserData,
    } as any);

    const result = await githubService.getUserData('testuser');

    expect(result).toEqual(mockUserData);
    expect(mockOctokit.users.getByUsername).toHaveBeenCalledWith({
      username: 'testuser',
    });
  });

  test('should detect game dev projects correctly', () => {
    const gameRepo = {
      name: 'UnityGame',
      description: 'A 3D game made with Unity',
    };

    const nonGameRepo = {
      name: 'node-api',
      description: 'REST API backend',
    };

    expect(githubService.detectGameDev(gameRepo, {})).toBe(true);
    expect(githubService.detectGameDev(nonGameRepo, {})).toBe(false);
  });
});
```

### **Integration Tests (projects.test.ts)**

```typescript
describe('Projects API', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('GET /api/projects should return paginated results', async () => {
    const mockProjects = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
    ];

    jest.spyOn(projectService, 'getProjects').mockResolvedValueOnce({
      projects: mockProjects,
      total: 2,
      page: 1,
    });

    await projectController.getProjects(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        projects: mockProjects,
      }),
    });
  });
});
```

---

## 📋 TYPE DEFINITIONS (types/index.ts)

```typescript
// GitHub types
export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface EnrichedRepo {
  id: number;
  name: string;
  description: string;
  url: string;
  languages: Record<string, number>;
  stargazers_count: number;
  forks_count: number;
  contributors_count: number;
  is_game_dev: boolean;
  topics: string[];
}

// Project types
export interface Project {
  id: number;
  githubId: number;
  name: string;
  slug: string;
  description: string;
  url: string;
  starsCount: number;
  forksCount: number;
  isGameDev: boolean;
  technologies: string[];
  featured: boolean;
  category: string;
}

export interface ProjectFilter {
  page?: number;
  limit?: number;
  category?: string;
  language?: string;
  sort?: 'recent' | 'popular' | 'oldest';
  search?: string;
  featured?: boolean;
  isGameDev?: boolean;
}

export interface PaginatedProjects {
  projects: Project[];
  total: number;
  page: number;
  pages: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## 🔐 ENVIRONMENT VARIABLES

**Required for Phase 2:**
```bash
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=LgrappaG

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/portfolio_db

# Redis
REDIS_URL=redis://localhost:6379

# Server
NODE_ENV=development
PORT=5000

# Logging
LOG_LEVEL=debug
```

---

## 📅 IMPLEMENTATION ORDER

### **Week 1:**
1. ✅ Create base services (CacheService, GitHubService skeleton)
2. ✅ Setup Prisma database connection
3. ✅ Implement GitHubService fully
4. ✅ Implement GameDevDetectionService
5. ✅ Implement ProjectService (CRUD + sync)

### **Week 2:**
1. ✅ Create controllers (ProjectController, GitHubController)
2. ✅ Create routes (projects, github, skills)
3. ✅ Setup error handling middleware
4. ✅ Add input validation
5. ✅ Setup GitHub sync job scheduler

### **Week 3:**
1. ✅ Write unit tests for services
2. ✅ Write integration tests for API endpoints
3. ✅ Test GitHub sync with real LgrappaG repos
4. ✅ Performance optimization
5. ✅ Documentation

---

## 🎯 NEXT STEPS

1. **Create database.ts** - Prisma client setup
2. **Create redis.ts** - Redis connection
3. **Create GitHubService.ts** - GitHub API integration
4. **Create ProjectService.ts** - Database operations
5. **Create CacheService.ts** - Redis caching
6. **Create ProjectController.ts** - HTTP handlers
7. **Create project routes** - API endpoints
8. **Create GitHub sync job** - Background scheduler

---

**Status:** 🚀 Ready to implement

**Next Command:**
```bash
cd portfolio
npm install -w backend  # Install dependencies
npm run db:migrate      # Run database migrations
npm run dev            # Start development
```

Ready to start implementing? 💪
