import Redis from 'redis';
import { logger } from '@/utils/logger';

const DEFAULT_TTL = 3600; // 1 hour in seconds

export class CacheService {
  private client: Redis.RedisClient;
  private isConnected: boolean = false;

  constructor(redisUrl: string = 'redis://localhost:6379') {
    this.client = Redis.createClient({ url: redisUrl });

    // Handle connection events
    this.client.on('connect', () => {
      this.isConnected = true;
      logger.info('✅ Redis connected');
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      logger.error('❌ Redis error:', err);
    });

    this.client.on('close', () => {
      this.isConnected = false;
      logger.warn('⚠️ Redis disconnected');
    });
  }

  /**
   * Establish Redis connection
   */
  async connect(): Promise<void> {
    if (this.isConnected) return;
    await this.client.connect();
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await this.client.quit();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.client.setEx(key, ttl, serialized);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  /**
   * Invalidate all keys matching pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.info(`🗑️ Invalidated ${keys.length} cache keys matching ${pattern}`);
      }
    } catch (error) {
      logger.error(`Cache invalidate pattern error for ${pattern}:`, error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      await this.client.flushDb();
      logger.info('🗑️ Cache cleared');
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      const info = await this.client.info('stats');
      return info;
    } catch (error) {
      logger.error('Cache stats error:', error);
      return null;
    }
  }

  /**
   * Check if connected
   */
  isHealthy(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
let cacheServiceInstance: CacheService | null = null;

export function getCacheService(): CacheService {
  if (!cacheServiceInstance) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    cacheServiceInstance = new CacheService(redisUrl);
  }
  return cacheServiceInstance;
}

export default CacheService;
