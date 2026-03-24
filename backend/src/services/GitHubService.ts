import { Octokit } from '@octokit/rest';
import { CacheService } from './CacheService';
import { logger } from '@/utils/logger';

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

interface EnrichedRepo {
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

export class GitHubService {
  private octokit: Octokit;
  private cacheService: CacheService;
  private CACHE_TTL = 3600; // 1 hour
  private REPOS_CACHE_TTL = 21600; // 6 hours

  constructor(token: string, cacheService: CacheService) {
    this.octokit = new Octokit({
      auth: token,
      throttle: {
        onRateLimit: (retryAfter, options, octokit) => {
          logger.warn(
            `⚠️ Rate limited. Retrying after ${retryAfter} seconds`
          );
          return true;
        },
        onAbuseLimit: (retryAfter, options, octokit) => {
          logger.error(`❌ Abuse limit hit. Retrying after ${retryAfter} seconds`);
          return false;
        },
      },
    });
    this.cacheService = cacheService;
  }

  /**
   * Get GitHub user data
   */
  async getUserData(username: string): Promise<GitHubUser> {
    const cacheKey = `github:user:${username}`;

    // Try cache first
    const cached = await this.cacheService.get<GitHubUser>(cacheKey);
    if (cached) {
      logger.debug(`📦 User data from cache: ${username}`);
      return cached;
    }

    try {
      const { data } = await this.octokit.users.getByUsername({ username });

      const userData: GitHubUser = {
        login: data.login,
        name: data.name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url,
        followers: data.followers,
        following: data.following,
        public_repos: data.public_repos,
        created_at: data.created_at,
      };

      // Cache for 1 hour
      await this.cacheService.set(cacheKey, userData, this.CACHE_TTL);

      logger.info(`✅ Fetched user data: ${username}`);
      return userData;
    } catch (error) {
      logger.error(`❌ Error fetching user data for ${username}:`, error);
      throw new Error(`Failed to fetch GitHub user: ${username}`);
    }
  }

  /**
   * Get all repositories for a user
   */
  async getAllRepos(username: string): Promise<EnrichedRepo[]> {
    const cacheKey = `github:repos:${username}`;

    // Try cache first
    const cached = await this.cacheService.get<EnrichedRepo[]>(cacheKey);
    if (cached) {
      logger.debug(`📦 Repos from cache: ${username}`);
      return cached;
    }

    try {
      let allRepos: any[] = [];
      let page = 1;
      let hasMore = true;

      logger.info(`🔄 Fetching repositories for ${username}...`);

      while (hasMore) {
        const { data } = await this.octokit.repos.listForUser({
          username,
          type: 'owner',
          sort: 'updated',
          direction: 'desc',
          per_page: 100,
          page,
        });

        if (data.length === 0) {
          hasMore = false;
        } else {
          allRepos = [...allRepos, ...data];
          page++;
        }
      }

      logger.info(`✅ Fetched ${allRepos.length} repositories for ${username}`);

      // Enrich each repository
      const enrichedRepos = await Promise.all(
        allRepos.map(repo => this.enrichRepository(repo, username))
      );

      // Cache for 6 hours
      await this.cacheService.set(
        cacheKey,
        enrichedRepos,
        this.REPOS_CACHE_TTL
      );

      return enrichedRepos;
    } catch (error) {
      logger.error(`❌ Error fetching repos for ${username}:`, error);
      throw new Error(`Failed to fetch repositories for ${username}`);
    }
  }

  /**
   * Enrich repository data with additional information
   */
  private async enrichRepository(
    repo: any,
    username: string
  ): Promise<EnrichedRepo> {
    try {
      // Get languages
      const languages = await this.getRepoLanguages(username, repo.name);

      // Get contributors count
      const contributorsCount = await this.getContributorCount(
        username,
        repo.name
      );

      // Detect if it's a game dev project
      const isGameDev = this.detectGameDev(repo, languages);

      return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        languages,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        open_issues: repo.open_issues_count,
        topics: repo.topics || [],
        is_game_dev: isGameDev,
        contributors_count: contributorsCount,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
      };
    } catch (error) {
      logger.warn(
        `⚠️ Error enriching repo ${repo.name}:`,
        error instanceof Error ? error.message : error
      );
      // Return basic enriched data
      return {
        ...repo,
        languages: {},
        is_game_dev: false,
        contributors_count: 0,
      };
    }
  }

  /**
   * Get programming languages used in a repository
   */
  private async getRepoLanguages(
    owner: string,
    repo: string
  ): Promise<Record<string, number>> {
    try {
      const { data } = await this.octokit.repos.listLanguages({ owner, repo });
      return data as Record<string, number>;
    } catch (error) {
      logger.warn(`⚠️ Error fetching languages for ${owner}/${repo}`);
      return {};
    }
  }

  /**
   * Get number of contributors to a repository
   */
  private async getContributorCount(owner: string, repo: string): Promise<number> {
    try {
      const { headers } = await this.octokit.repos.listContributors({
        owner,
        repo,
        per_page: 1,
      });

      // Extract total from Link header
      const link = headers.link;
      if (link) {
        const match = link.match(/&page=(\d+)>; rel="last"/);
        if (match) return parseInt(match[1], 10);
      }
      return 1;
    } catch (error) {
      logger.warn(`⚠️ Error fetching contributor count for ${owner}/${repo}`);
      return 0;
    }
  }

  /**
   * Detect if a repository is a game development project
   */
  private detectGameDev(
    repo: any,
    languages: Record<string, number>
  ): boolean {
    // Keywords that indicate game development
    const gameKeywords = [
      'game',
      'unity',
      'godot',
      'unreal',
      'pygame',
      'game-dev',
      'game-engine',
      '3d',
      '2d',
      'itch',
      'phaser',
      'babylon',
      'three',
      'webgl',
    ];

    // Game engines
    const gameEngines = [
      'Unity',
      'Godot',
      'Unreal',
      'Phaser',
      'Babylon.js',
      'Three.js',
    ];

    // Combine text fields
    const fullText = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();

    // Check for game keywords
    const hasGameKeyword = gameKeywords.some(keyword =>
      fullText.includes(keyword)
    );

    // Check for game engines in languages or description
    const hasGameEngine = gameEngines.some(engine =>
      Object.keys(languages).some(lang => lang.includes(engine)) ||
      fullText.includes(engine.toLowerCase())
    );

    // Check for C#, C++, GDScript, Lua (commonly used in game dev)
    const hasGameLanguage =
      languages['C#'] ||
      languages['C++'] ||
      languages['GDScript'] ||
      languages['Lua'] ||
      languages['Rust'];

    return hasGameKeyword || hasGameEngine || !!hasGameLanguage;
  }

  /**
   * Get repository statistics
   */
  async getRepositoryStats(username: string): Promise<any> {
    const repos = await this.getAllRepos(username);

    const stats = {
      totalRepositories: repos.length,
      totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
      totalForks: repos.reduce((sum, r) => sum + r.forks_count, 0),
      averageStars:
        repos.length > 0
          ? Math.round(
              repos.reduce((sum, r) => sum + r.stargazers_count, 0) /
                repos.length
            )
          : 0,
      languages: this.aggregateLanguages(repos),
      gameDevProjects: repos.filter(r => r.is_game_dev).length,
      softwareProjects: repos.filter(r => !r.is_game_dev).length,
      mostStarred: repos.sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      )[0],
      mostForked: repos.sort((a, b) => b.forks_count - a.forks_count)[0],
      recentlyUpdated: repos
        .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
        .slice(0, 5),
    };

    return stats;
  }

  /**
   * Aggregate languages across all repositories
   */
  private aggregateLanguages(
    repos: EnrichedRepo[]
  ): Record<string, number> {
    const languageMap: Record<string, number> = {};

    for (const repo of repos) {
      for (const [lang, bytes] of Object.entries(repo.languages)) {
        if (!languageMap[lang]) {
          languageMap[lang] = 0;
        }
        languageMap[lang] += bytes;
      }
    }

    return languageMap;
  }
}

export type { GitHubUser, EnrichedRepo };
