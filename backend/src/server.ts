import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import prisma from '@/database/prisma';
import { getCacheService } from '@/services/CacheService';
import { GitHubService } from '@/services/GitHubService';
import { ProjectService } from '@/services/ProjectService';
import { GitHubSyncJob } from '@/jobs/githubSyncJob';
import { logger } from '@/utils/logger';
import createProjectRoutes from '@/routes/projectRoutes';
import createGitHubRoutes from '@/routes/githubRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    logger.debug(`${req.method} ${req.path} - ${status} (${duration}ms)`);
  });

  next();
});

// ============================================
// SERVICES INITIALIZATION
// ============================================

const cacheService = getCacheService();
const githubService = new GitHubService(
  process.env.GITHUB_TOKEN || '',
  cacheService
);
const projectService = new ProjectService(githubService, cacheService);

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Portfolio API v1.0',
    status: 'running',
    documentation: 'https://github.com/LgrappaG/portfolio',
    endpoints: {
      health: '/health',
      projects: '/api/projects',
      github: '/api/github',
    },
  });
});

// Register project routes
app.use('/api/projects', createProjectRoutes(githubService, projectService, cacheService));

// Register GitHub routes
app.use('/api/github', createGitHubRoutes(githubService, projectService, cacheService));

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    path: req.path,
    message: 'The requested endpoint does not exist',
  });
});

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// DATABASE CONNECTION
// ============================================

async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// ============================================
// CACHE CONNECTION
// ============================================

async function connectCache(): Promise<void> {
  try {
    await cacheService.connect();
    logger.info('✅ Cache connected');
  } catch (error) {
    logger.warn('⚠️ Cache connection warning:', error);
  }
}

// ============================================
// BACKGROUND JOBS
// ============================================

function startBackgroundJobs(): void {
  try {
    const syncJob = new GitHubSyncJob(projectService, cacheService);
    syncJob.start();

    logger.info('🔄 Running initial GitHub sync...');
    syncJob.triggerSync().catch((error) => {
      logger.warn('Initial sync failed (will retry on schedule):', error);
    });
  } catch (error) {
    logger.error('❌ Failed to start background jobs:', error);
  }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

async function gracefulShutdown(): Promise<void> {
  logger.info('🛑 Shutting down gracefully...');

  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected');

    await cacheService.disconnect();
    logger.info('✅ Cache disconnected');

    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ============================================
// SERVER STARTUP
// ============================================

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    await connectCache();
    startBackgroundJobs();

    app.listen(PORT, () => {
      logger.info(`✅ Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API URL: ${process.env.API_URL || `http://localhost:${PORT}`}`);
      logger.info('');
      logger.info('📚 Available endpoints:');
      logger.info('  GET  /health - Health check');
      logger.info('  GET  /api/projects - List projects');
      logger.info('  GET  /api/projects/:id - Get project');
      logger.info('  GET  /api/projects/featured - Featured projects');
      logger.info('  GET  /api/projects/game-dev - Game dev projects');
      logger.info('  GET  /api/github/user - GitHub user');
      logger.info('  GET  /api/github/stats - GitHub stats');
      logger.info('  POST /api/github/sync - Trigger sync (admin)');
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
