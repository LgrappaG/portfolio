import { Request, Response } from 'express';
import { GitHubService } from '@/services/GitHubService';
import { ProjectService } from '@/services/ProjectService';
import { CacheService } from '@/services/CacheService';
import { logger } from '@/utils/logger';
import { ApiResponse, GitHubStatsResponse, SyncResponse } from '@/types';

export class GitHubController {
  private githubService: GitHubService;
  private projectService: ProjectService;
  private cacheService: CacheService;

  constructor(
    githubService: GitHubService,
    projectService: ProjectService,
    cacheService: CacheService
  ) {
    this.githubService = githubService;
    this.projectService = projectService;
    this.cacheService = cacheService;
  }

  /**
   * GET /api/github/user
   * Get GitHub user information
   */
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const username = process.env.GITHUB_USERNAME || 'LgrappaG';

      const user = await this.githubService.getUserData(username);

      res.status(200).json({
        success: true,
        data: user,
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('Error in getUser:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch GitHub user',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<null>);
    }
  }

  /**
   * GET /api/github/stats
   * Get aggregated GitHub statistics
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const username = process.env.GITHUB_USERNAME || 'LgrappaG';

      const stats = await this.githubService.getRepositoryStats(username);

      const response: GitHubStatsResponse = {
        totalRepositories: stats.totalRepositories,
        totalStars: stats.totalStars,
        totalForks: stats.totalForks,
        averageStars: stats.averageStars,
        languages: stats.languages,
        gameDevProjects: stats.gameDevProjects,
        softwareProjects: stats.softwareProjects,
        mostStarred: stats.mostStarred || null,
        mostForked: stats.mostForked || null,
        recentlyUpdated: stats.recentlyUpdated || [],
      };

      res.status(200).json({
        success: true,
        data: response,
      } as ApiResponse<GitHubStatsResponse>);
    } catch (error) {
      logger.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch GitHub statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<null>);
    }
  }

  /**
   * POST /api/github/sync
   * Manually trigger GitHub sync (admin only)
   */
  async syncProjects(req: Request, res: Response): Promise<void> {
    try {
      const username = process.env.GITHUB_USERNAME || 'LgrappaG';

      logger.info(`🔄 Manual sync triggered for ${username}`);

      const syncedCount = await this.projectService.syncProjectsFromGitHub(username);

      // Invalidate related caches
      await this.cacheService.invalidatePattern('project:*');
      await this.cacheService.invalidatePattern(`github:repos:${username}`);

      res.status(200).json({
        success: true,
        data: {
          syncedProjects: syncedCount,
          timestamp: new Date().toISOString(),
        } as SyncResponse,
      } as ApiResponse<SyncResponse>);
    } catch (error) {
      logger.error('Error in syncProjects:', error);
      res.status(500).json({
        success: false,
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<null>);
    }
  }

  /**
   * GET /api/github/repos
   * Get list of all GitHub repositories
   */
  async getRepositories(req: Request, res: Response): Promise<void> {
    try {
      const username = process.env.GITHUB_USERNAME || 'LgrappaG';

      const repos = await this.githubService.getAllRepos(username);

      res.status(200).json({
        success: true,
        data: repos,
        total: repos.length,
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('Error in getRepositories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch repositories',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<null>);
    }
  }

  /**
   * GET /api/github/health
   * Check GitHub API connection status
   */
  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const username = process.env.GITHUB_USERNAME || 'LgrappaG';

      // Try to fetch user to verify connection
      await this.githubService.getUserData(username);

      res.status(200).json({
        success: true,
        data: {
          status: 'healthy',
          username,
          timestamp: new Date().toISOString(),
        },
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('GitHub API health check failed:', error);
      res.status(503).json({
        success: false,
        error: 'GitHub API is unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<null>);
    }
  }
}
