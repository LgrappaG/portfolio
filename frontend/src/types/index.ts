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
  createdAt: string;
  updatedAt: string;
  githubUpdatedAt: string | null;
  syncedAt: string;
  details?: ProjectDetail;
}

export interface ProjectDetail {
  id: number;
  projectId: number;
  summary: string | null;
  longDescription: string | null;
  features: string[];
  thumbnailUrl: string | null;
  screenshots: string[];
  demoUrl: string | null;
  videoUrl: string | null;
  learningPoints: string[];
  challenges: string[];
  solutions: string[];
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

export interface ProjectStats {
  total: number;
  gameDevCount: number;
  softwareCount: number;
  featured: number;
  totalStars: number;
  totalForks: number;
  averageStars: number;
}

// ============================================
// GitHub Types
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

export interface GitHubStats {
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  averageStars: number;
  languages: Record<string, number>;
  gameDevProjects: number;
  softwareProjects: number;
  mostStarred: Project | null;
  mostForked: Project | null;
  recentlyUpdated: Project[];
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
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Skill Types
// ============================================

export interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'gamedev' | 'devops' | 'database';
  proficiency: number;
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
  startDate: string;
  endDate: string | null;
  currentPosition: boolean;
  technologies: string[];
  displayOrder: number | null;
}

// ============================================
// UI State Types
// ============================================

export interface UIState {
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface FilteredProjects {
  projects: Project[];
  total: number;
  page: number;
  pages: number;
}
