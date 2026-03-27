import { Router, Request, Response } from 'express';
import { GitHubController } from '@/controllers/GitHubController';
import { GitHubService } from '@/services/GitHubService';
import { ProjectService } from '@/services/ProjectService';
import { CacheService } from '@/services/CacheService';
import { authMiddleware, adminOnly } from '@/middleware/authMiddleware';
import { adminActionLimiter } from '@/middleware/rateLimitMiddleware';

export function createGitHubRoutes(
  githubService: GitHubService,
  projectService: ProjectService,
  cacheService: CacheService
): Router {
  const router = Router();
  const githubController = new GitHubController(
    githubService,
    projectService,
    cacheService
  );

  /**
   * Public Routes
   */

  // GET /api/github/user - Get GitHub user info
  router.get('/user', (req: Request, res: Response) =>
    githubController.getUser(req, res)
  );

  // GET /api/github/stats - Get GitHub statistics
  router.get('/stats', (req: Request, res: Response) =>
    githubController.getStats(req, res)
  );

  // GET /api/github/repos - Get all repositories
  router.get('/repos', (req: Request, res: Response) =>
    githubController.getRepositories(req, res)
  );

  // GET /api/github/health - Health check
  router.get('/health', (req: Request, res: Response) =>
    githubController.getHealth(req, res)
  );

  /**
   * ✅ SECURITY FIX: Admin Routes (Protected by authMiddleware + adminOnly)
   */

  // POST /api/github/sync - Manual sync trigger (admin only)
  router.post(
    '/sync',
    authMiddleware,
    adminOnly,
    adminActionLimiter,
    (req: Request, res: Response) => githubController.syncProjects(req, res)
  );

  return router;
}

export default createGitHubRoutes;

