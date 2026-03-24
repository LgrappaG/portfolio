import cron from 'node-cron';
import { ProjectService } from '@/services/ProjectService';
import { CacheService } from '@/services/CacheService';
import { logger } from '@/utils/logger';

export class GitHubSyncJob {
  private projectService: ProjectService;
  private cacheService: CacheService;
  private isRunning: boolean = false;

  constructor(projectService: ProjectService, cacheService: CacheService) {
    this.projectService = projectService;
    this.cacheService = cacheService;
  }

  /**
   * Start the GitHub sync job scheduler
   * Runs every 6 hours (0:00, 6:00, 12:00, 18:00)
   */
  start(): void {
    // Schedule: every 6 hours
    // Cron pattern: 0 */6 * * *
    // 0    - At minute 0
    // */6  - Every 6 hours
    // *    - Every day of month
    // *    - Every month
    // *    - Every day of week

    const job = cron.schedule('0 */6 * * *', async () => {
      if (this.isRunning) {
        logger.warn('⚠️ GitHub sync job is already running, skipping...');
        return;
      }

      await this.executeSync();
    });

    logger.info('✨ GitHub sync job scheduled (every 6 hours)');
    logger.info('📅 Next sync times: 00:00, 06:00, 12:00, 18:00 UTC');

    // Store job reference for potential graceful shutdown
    this.job = job;
  }

  /**
   * Execute the sync operation
   */
  private async executeSync(): Promise<void> {
    try {
      this.isRunning = true;
      const username = process.env.GITHUB_USERNAME || 'LgrappaG';
      const startTime = Date.now();

      logger.info('🔄 Starting GitHub sync job...');
      logger.debug(`Username: ${username}`);

      // Perform sync
      const syncedCount = await this.projectService.syncProjectsFromGitHub(username);

      // Invalidate caches
      logger.info('♻️ Invalidating caches...');
      await this.cacheService.invalidatePattern('project:*');
      await this.cacheService.invalidatePattern(`github:repos:${username}`);
      await this.cacheService.invalidatePattern('github:user:*');

      const duration = Date.now() - startTime;

      logger.info(
        `✅ GitHub sync completed successfully in ${duration}ms. Synced ${syncedCount} projects`
      );
    } catch (error) {
      logger.error('❌ GitHub sync job failed:', error instanceof Error ? error.message : error);

      // Log full error for debugging
      if (error instanceof Error) {
        logger.debug('Error stack:', error.stack);
      }
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Manually trigger sync (useful for admin endpoints)
   */
  async triggerSync(): Promise<number> {
    if (this.isRunning) {
      throw new Error('Sync is already in progress');
    }

    try {
      this.isRunning = true;
      const username = process.env.GITHUB_USERNAME || 'LgrappaG';

      logger.info('🔄 Manual GitHub sync triggered');

      const syncedCount = await this.projectService.syncProjectsFromGitHub(username);

      await this.cacheService.invalidatePattern('project:*');
      await this.cacheService.invalidatePattern(`github:repos:${username}`);

      logger.info(`✅ Manual GitHub sync completed. Synced ${syncedCount} projects`);

      return syncedCount;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.job) {
      this.job.stop();
      logger.info('⏹️ GitHub sync job stopped');
    }
  }

  /**
   * Get sync status
   */
  getStatus(): { isRunning: boolean; nextSync?: string } {
    return {
      isRunning: this.isRunning,
      nextSync: this.job ? 'Next scheduled time: 0:00, 6:00, 12:00, 18:00 UTC' : undefined,
    };
  }

  private job?: cron.ScheduledTask;
}

// Singleton instance
let syncJobInstance: GitHubSyncJob | null = null;

export function getGitHubSyncJob(
  projectService: ProjectService,
  cacheService: CacheService
): GitHubSyncJob {
  if (!syncJobInstance) {
    syncJobInstance = new GitHubSyncJob(projectService, cacheService);
  }
  return syncJobInstance;
}

export default GitHubSyncJob;
