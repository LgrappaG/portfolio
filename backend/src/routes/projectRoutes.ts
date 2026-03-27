import { Router, Request, Response } from 'express';
import { ProjectController } from '@/controllers/ProjectController';
import { ProjectService } from '@/services/ProjectService';
import { GitHubService } from '@/services/GitHubService';
import { CacheService } from '@/services/CacheService';
import { authMiddleware, adminOnly } from '@/middleware/authMiddleware';
import { adminActionLimiter, searchLimiter } from '@/middleware/rateLimitMiddleware';

export function createProjectRoutes(
  githubService: GitHubService,
  projectService: ProjectService,
  cacheService: CacheService
): Router {
  const router = Router();
  const projectController = new ProjectController(projectService);

  /**
   * Public Routes
   */

  // GET /api/projects - List all projects with filtering
  router.get('/', (req: Request, res: Response) =>
    projectController.getProjects(req, res)
  );

  // GET /api/projects/featured - Get featured projects
  router.get('/featured', (req: Request, res: Response) =>
    projectController.getFeaturedProjects(req, res)
  );

  // GET /api/projects/game-dev - Get game development projects
  router.get('/game-dev', (req: Request, res: Response) =>
    projectController.getGameDevProjects(req, res)
  );

  // GET /api/projects/search - Search projects (with rate limiting)
  router.get('/search', searchLimiter, (req: Request, res: Response) =>
    projectController.searchProjects(req, res)
  );

  // GET /api/projects/stats - Get project statistics
  router.get('/stats', (req: Request, res: Response) =>
    projectController.getProjectStats(req, res)
  );

  // GET /api/projects/:id - Get single project
  router.get('/:id', (req: Request, res: Response) =>
    projectController.getProjectById(req, res)
  );

  /**
   * ✅ SECURITY FIX: Admin Routes (Protected by authMiddleware + adminOnly)
   */

  // POST /api/projects - Create new project (admin only)
  router.post(
    '/',
    authMiddleware,
    adminOnly,
    adminActionLimiter,
    (req: Request, res: Response) => projectController.createProject(req, res)
  );

  // PUT /api/projects/:id - Update project (admin only)
  router.put(
    '/:id',
    authMiddleware,
    adminOnly,
    adminActionLimiter,
    (req: Request, res: Response) => projectController.updateProject(req, res)
  );

  // DELETE /api/projects/:id - Delete project (admin only)
  router.delete(
    '/:id',
    authMiddleware,
    adminOnly,
    adminActionLimiter,
    (req: Request, res: Response) => projectController.deleteProject(req, res)
  );

  // PATCH /api/projects/:id/featured - Toggle featured status (admin only)
  router.patch(
    '/:id/featured',
    authMiddleware,
    adminOnly,
    adminActionLimiter,
    (req: Request, res: Response) => projectController.toggleFeatured(req, res)
  );

  return router;
}

export default createProjectRoutes;

