// ============================================
// GitHub API Types
// ============================================

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
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  languages: Record<string, number>;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues: number;
  topics: string[];
  is_game_dev: boolean;
  contributors_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

// ============================================
// Project Types
// ============================================

export interface Project {
  id: number;
  githubId: number;
  name: string;
  slug: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  starsCount: number;
  forksCount: number;
  watchersCount: number;
  openIssues: number;
  contributorsCount: number;
  category: string | null;
  isGameDev: boolean;
  featured: boolean;
  status: string | null;
  tags: string[];
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
  githubUpdatedAt: Date | null;
  syncedAt: Date;
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

export interface CreateProjectInput {
  githubId: number;
  name: string;
  description?: string;
  url: string;
  homepage?: string;
  language?: string;
  starsCount?: number;
  forksCount?: number;
  technologies?: string[];
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  category?: string;
  featured?: boolean;
  status?: string;
  technologies?: string[];
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pages: number;
}

// ============================================
// Request/Response Types
// ============================================

export interface ProjectStatsResponse {
  total: number;
  gameDevCount: number;
  softwareCount: number;
  featured: number;
  totalStars: number;
  totalForks: number;
  averageStars: number;
  topByStars: Project | null;
  topByForks: Project | null;
}

export interface GitHubStatsResponse {
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  averageStars: number;
  languages: Record<string, number>;
  gameDevProjects: number;
  softwareProjects: number;
  mostStarred: EnrichedRepo | null;
  mostForked: EnrichedRepo | null;
  recentlyUpdated: EnrichedRepo[];
}

export interface SyncResponse {
  syncedProjects: number;
  timestamp: string;
}

// ============================================
// Skill Types
// ============================================

export interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'gamedev' | 'devops' | 'database';
  proficiency: number; // 1-5
  yearsExperience: number;
  iconUrl: string | null;
  featured: boolean;
  displayOrder: number;
}

// ============================================
// Experience Types
// ============================================

export interface Experience {
  id: number;
  title: string;
  company: string | null;
  position: string | null;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  currentPosition: boolean;
  technologies: string[];
  displayOrder: number | null;
}

// ============================================
// Article Types
// ============================================

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  featuredImage: string | null;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
