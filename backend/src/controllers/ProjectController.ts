import { Request, Response } from 'express';
import { ProjectService } from '@/services/ProjectService';
import { GitHubService } from '@/services/GitHubService';
import { CacheService } from '@/services/CacheService';
import { logger } from '@/utils/logger';
import { ApiResponse, PaginatedResponse, ProjectStatsResponse } from '@/types';
import { validatePagination, validateSearchQuery, parseBooleanString } from '@/utils/validators';

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  /**
   * GET /api/projects
   * Get paginated projects with filtering and search
   */
  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        language,
        sort = 'recent',
        search,
        featured,
        isGameDev,
      } = req.query;

      // ✅ SECURITY FIX: Validate pagination bounds
      const { page: validPage, limit: validLimit } = validatePagination(page, limit);

      const filters = {
        page: validPage,
        limit: validLimit,
        category: category as string | undefined,
        language: language as string | undefined,
        sort: sort as 'recent' | 'popular' | 'oldest',
        search: search as string | undefined,
        featured: parseBooleanString(featured as any),
        isGameDev: parseBooleanString(isGameDev as any),
      };

      const result = await this.projectService.getProjects(filters);

      res.status(200).json({
        success: true,
        data: result.projects,
        total: result.total,
        page: result.page,
        pages: result.pages,
      } as PaginatedResponse<any>);
    } catch (error) {
      logger.error('Error in getProjects:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch projects',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<null>);
    }
  }

  /**
   * GET /api/projects/:id
   * Get single project with details
   */
  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);

      if (isNaN(projectId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid project ID',
        });
        return;
      }

      const project = await this.projectService.getProjectById(projectId);

      res.status(200).json({
        success: true,
        data: project,
      } as ApiResponse<any>);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Project not found',
        });
        return;
      }

      logger.error('Error in getProjectById:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch project',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/projects/featured
   * Get featured projects (3-6 items)
   */
  async getFeaturedProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getFeaturedProjects();

      res.status(200).json({
        success: true,
        data: projects,
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('Error in getFeaturedProjects:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch featured projects',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/projects/game-dev
   * Get game development projects
   */
  async getGameDevProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getGameDevProjects();

      res.status(200).json({
        success: true,
        data: projects,
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('Error in getGameDevProjects:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game dev projects',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/projects/search
   * Search projects by query
   */
  async searchProjects(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string' || q.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
        return;
      }

      // ✅ SECURITY FIX: Validate and sanitize search query
      const { valid, query: sanitizedQuery } = validateSearchQuery(q);

      if (!valid) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Search query must be 1-100 alphanumeric characters (spaces, hyphens, dots allowed)',
        });
        return;
      }

      const projects = await this.projectService.searchProjects(sanitizedQuery);

      res.status(200).json({
        success: true,
        data: projects,
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('Error in searchProjects:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/projects/stats
   * Get project statistics
   */
  async getProjectStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.projectService.getProjectStats();

      res.status(200).json({
        success: true,
        data: stats,
      } as ApiResponse<ProjectStatsResponse>);
    } catch (error) {
      logger.error('Error in getProjectStats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/projects
   * Create new project (admin only)
   */
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, url, technologies } = req.body;

      if (!name || !url) {
        res.status(400).json({
          success: false,
          error: 'Name and URL are required',
        });
        return;
      }

      const project = await this.projectService.createProject({
        name,
        description,
        url,
        technologies: technologies || [],
      });

      res.status(201).json({
        success: true,
        data: project,
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('Error in createProject:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create project',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * PUT /api/projects/:id
   * Update project (admin only)
   */
  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);

      if (isNaN(projectId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid project ID',
        });
        return;
      }

      const project = await this.projectService.updateProject(projectId, req.body);

      res.status(200).json({
        success: true,
        data: project,
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('Error in updateProject:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update project',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/projects/:id
   * Delete project (admin only)
   */
  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);

      if (isNaN(projectId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid project ID',
        });
        return;
      }

      await this.projectService.deleteProject(projectId);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      } as ApiResponse<null>);
    } catch (error) {
      logger.error('Error in deleteProject:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete project',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * PATCH /api/projects/:id/featured
   * Toggle featured status (admin only)
   */
  async toggleFeatured(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { featured } = req.body;

      const projectId = parseInt(id);

      if (isNaN(projectId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid project ID',
        });
        return;
      }

      if (typeof featured !== 'boolean') {
        res.status(400).json({
          success: false,
          error: 'Featured status must be a boolean',
        });
        return;
      }

      const project = await this.projectService.setFeatured(projectId, featured);

      res.status(200).json({
        success: true,
        data: project,
      } as ApiResponse<any>);
    } catch (error) {
      logger.error('Error in toggleFeatured:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle featured status',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
