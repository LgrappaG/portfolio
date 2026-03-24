import prisma from '@/database/prisma';
import { GitHubService, EnrichedRepo } from './GitHubService';
import { CacheService } from './CacheService';
import { logger } from '@/utils/logger';

interface ProjectFilter {
  page?: number;
  limit?: number;
  category?: string;
  language?: string;
  sort?: 'recent' | 'popular' | 'oldest';
  search?: string;
  featured?: boolean;
  isGameDev?: boolean;
}

interface PaginatedProjects {
  projects: any[];
  total: number;
  page: number;
  pages: number;
}

export class ProjectService {
  private githubService: GitHubService;
  private cacheService: CacheService;

  constructor(githubService: GitHubService, cacheService: CacheService) {
    this.githubService = githubService;
    this.cacheService = cacheService;
  }

  /**
   * Sync projects from GitHub to database
   */
  async syncProjectsFromGitHub(username: string): Promise<number> {
    try {
      logger.info(`🔄 Starting GitHub sync for ${username}...`);

      const repos = await this.githubService.getAllRepos(username);

      let syncedCount = 0;

      for (const repo of repos) {
        const slug = this.generateSlug(repo.name);

        const project = await prisma.project.upsert({
          where: { githubId: repo.id },
          update: {
            name: repo.name,
            description: repo.description,
            url: repo.url,
            homepage: repo.homepage,
            language: repo.language,
            starsCount: repo.stargazers_count,
            forksCount: repo.forks_count,
            watchersCount: repo.watchers_count,
            openIssues: repo.open_issues,
            contributorsCount: repo.contributors_count,
            isGameDev: repo.is_game_dev,
            tags: repo.topics,
            technologies: Object.keys(repo.languages),
            syncedAt: new Date(),
            category: repo.is_game_dev ? 'game-dev' : 'software-dev',
          },
          create: {
            githubId: repo.id,
            name: repo.name,
            slug,
            description: repo.description,
            url: repo.url,
            homepage: repo.homepage,
            language: repo.language,
            starsCount: repo.stargazers_count,
            forksCount: repo.forks_count,
            watchersCount: repo.watchers_count,
            openIssues: repo.open_issues,
            contributorsCount: repo.contributors_count,
            isGameDev: repo.is_game_dev,
            tags: repo.topics,
            technologies: Object.keys(repo.languages),
            category: repo.is_game_dev ? 'game-dev' : 'software-dev',
            syncedAt: new Date(),
          },
        });

        syncedCount++;
        logger.debug(`✅ Synced project: ${project.name}`);
      }

      logger.info(`✅ GitHub sync completed for ${username}. Synced ${syncedCount} projects`);

      // Invalidate cache
      await this.cacheService.invalidatePattern('project:*');

      return syncedCount;
    } catch (error) {
      logger.error('❌ Error syncing projects from GitHub:', error);
      throw error;
    }
  }

  /**
   * Get paginated projects with filtering
   */
  async getProjects(filters: ProjectFilter = {}): Promise<PaginatedProjects> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (filters.category) {
        where.category = filters.category;
      }

      if (filters.isGameDev !== undefined) {
        where.isGameDev = filters.isGameDev;
      }

      if (filters.featured !== undefined) {
        where.featured = filters.featured;
      }

      if (filters.language) {
        where.technologies = {
          has: filters.language,
        };
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Build orderBy
      let orderBy: any = { syncedAt: 'desc' };
      if (filters.sort === 'popular') {
        orderBy = { starsCount: 'desc' };
      } else if (filters.sort === 'oldest') {
        orderBy = { createdAt: 'asc' };
      }

      // Get total count
      const total = await prisma.project.count({ where });

      // Get projects
      const projects = await prisma.project.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          details: true,
        },
      });

      const pages = Math.ceil(total / limit);

      return {
        projects,
        total,
        page,
        pages,
      };
    } catch (error) {
      logger.error('Error fetching projects:', error);
      throw error;
    }
  }

  /**
   * Get single project by ID
   */
  async getProjectById(id: number): Promise<any> {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: { details: true },
      });

      if (!project) {
        throw new Error(`Project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      logger.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get featured projects
   */
  async getFeaturedProjects(): Promise<any[]> {
    try {
      return await prisma.project.findMany({
        where: { featured: true },
        orderBy: { starsCount: 'desc' },
        take: 6,
        include: { details: true },
      });
    } catch (error) {
      logger.error('Error fetching featured projects:', error);
      throw error;
    }
  }

  /**
   * Get game development projects
   */
  async getGameDevProjects(): Promise<any[]> {
    try {
      return await prisma.project.findMany({
        where: { isGameDev: true },
        orderBy: { starsCount: 'desc' },
        include: { details: true },
      });
    } catch (error) {
      logger.error('Error fetching game dev projects:', error);
      throw error;
    }
  }

  /**
   * Create project
   */
  async createProject(data: any): Promise<any> {
    try {
      const slug = this.generateSlug(data.name);

      return await prisma.project.create({
        data: {
          ...data,
          slug,
        },
        include: { details: true },
      });
    } catch (error) {
      logger.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Update project
   */
  async updateProject(id: number, data: any): Promise<any> {
    try {
      return await prisma.project.update({
        where: { id },
        data,
        include: { details: true },
      });
    } catch (error) {
      logger.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete project
   */
  async deleteProject(id: number): Promise<boolean> {
    try {
      await prisma.project.delete({ where: { id } });
      return true;
    } catch (error) {
      logger.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Set featured status
   */
  async setFeatured(id: number, featured: boolean): Promise<any> {
    try {
      return await prisma.project.update({
        where: { id },
        data: { featured },
        include: { details: true },
      });
    } catch (error) {
      logger.error(`Error setting featured status for project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search projects
   */
  async searchProjects(query: string): Promise<any[]> {
    try {
      return await prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { details: true },
      });
    } catch (error) {
      logger.error('Error searching projects:', error);
      throw error;
    }
  }

  /**
   * Filter projects by criteria
   */
  async filterProjects(filters: ProjectFilter): Promise<any[]> {
    return this.getProjects(filters).then(result => result.projects);
  }

  /**
   * Get project statistics
   */
  async getProjectStats(): Promise<any> {
    try {
      const total = await prisma.project.count();
      const gameDevCount = await prisma.project.count({ where: { isGameDev: true } });
      const softwareCount = await prisma.project.count({ where: { isGameDev: false } });
      const featured = await prisma.project.count({ where: { featured: true } });

      const topByStars = await prisma.project.findFirst({
        orderBy: { starsCount: 'desc' },
      });

      const topByForks = await prisma.project.findFirst({
        orderBy: { forksCount: 'desc' },
      });

      const totalStars = (
        await prisma.project.aggregate({
          _sum: { starsCount: true },
        })
      )._sum.starsCount || 0;

      const totalForks = (
        await prisma.project.aggregate({
          _sum: { forksCount: true },
        })
      )._sum.forksCount || 0;

      return {
        total,
        gameDevCount,
        softwareCount,
        featured,
        totalStars,
        totalForks,
        averageStars: total > 0 ? Math.round(totalStars / total) : 0,
        topByStars,
        topByForks,
      };
    } catch (error) {
      logger.error('Error fetching project statistics:', error);
      throw error;
    }
  }

  /**
   * Generate URL-friendly slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
