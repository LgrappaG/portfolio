import type { GitHubRepo, GraphNode, GraphLink, GraphData } from '@/types/graph';

/**
 * Language to color mapping
 */
const LANGUAGE_COLORS: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Python': '#3572a5',
  'Rust': '#ce422b',
  'Go': '#00add8',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'C#': '#239120',
  'Ruby': '#cc342d',
  'PHP': '#777bb4',
  'Kotlin': '#f18e33',
  'Swift': '#fa7343',
  'C': '#555555',
  'Shell': '#89e051',
  'GDScript': '#355570',
  'default': '#858585',
};

/**
 * Get color for a language
 */
function getLanguageColor(language: string | null): string {
  if (!language) return LANGUAGE_COLORS.default;
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
}

/**
 * Detect project category based on language and repo metadata
 */
function detectCategory(
  repo: GitHubRepo,
  isGameDev: boolean = false
): 'web-dev' | 'game-dev' | 'tools' {
  // Check if already marked as game dev
  if (isGameDev) return 'game-dev';

  const description = (repo.description || '').toLowerCase();
  const name = (repo.name || '').toLowerCase();
  const topics = (repo.topics || []).map((t) => t.toLowerCase());

  // Game dev keywords
  const gameKeywords = ['game', 'unity', 'godot', 'unreal', 'pygame', 'phaser', 'babylon', 'three.js', 'webgl', 'engine'];
  const gameLanguages = ['C#', 'C++', 'GDScript', 'Lua', 'Rust'];

  if (gameLanguages.includes(repo.language || '')) return 'game-dev';
  if (gameKeywords.some((k) => description.includes(k) || name.includes(k))) return 'game-dev';
  if (topics.some((t) => gameKeywords.some((k) => t.includes(k)))) return 'game-dev';

  // Web dev keywords
  const webLanguages = ['TypeScript', 'JavaScript', 'Python', 'Java', 'PHP', 'Go', 'Ruby', 'Kotlin', 'C#'];
  const webKeywords = ['react', 'vue', 'angular', 'next', 'express', 'django', 'flask', 'fastapi', 'node', 'web', 'api', 'rest'];

  if (webLanguages.includes(repo.language || '')) {
    if (webKeywords.some((k) => description.includes(k) || name.includes(k))) return 'web-dev';
    if (topics.some((t) => webKeywords.some((k) => t.includes(k)))) return 'web-dev';
  }

  // Default to tools
  return 'tools';
}

/**
 * Transform GitHub repos to graph nodes
 */
export function buildNodes(repos: GitHubRepo[]): GraphNode[] {
  return repos.map((repo) => {
    const starsAndForks = repo.stargazers_count + repo.forks_count;
    const val = Math.max(starsAndForks, 5); // Minimum size of 5

    return {
      id: repo.id.toString(),
      name: repo.name,
      val,
      color: getLanguageColor(repo.language),
      category: detectCategory(repo),
      language: repo.language,
      languages: repo.languages || {},
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      topics: repo.topics || [],
      isGameDev: detectCategory(repo) === 'game-dev',
    };
  });
}

/**
 * Build links between nodes based on shared technology or category
 */
export function buildLinks(nodes: GraphNode[]): GraphLink[] {
  const links: GraphLink[] = [];
  const seenPairs = new Set<string>();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      // Create a unique key for this pair (order-independent)
      const pairKey = [nodeA.id, nodeB.id].sort().join('-');

      if (seenPairs.has(pairKey)) continue;

      // Check for technology link (same language)
      const sameLang = nodeA.language && nodeA.language === nodeB.language;
      if (sameLang) {
        seenPairs.add(pairKey);
        links.push({
          source: nodeA.id,
          target: nodeB.id,
          type: 'technology',
          color: '#06b6d4', // Cyan
          technologies: [nodeA.language!],
          label: `Both use ${nodeA.language}`,
          value: 1.0,
        });
        continue; // Skip category link if tech link found
      }

      // Check for category link (same category)
      const sameCategory = nodeA.category === nodeB.category;
      if (sameCategory) {
        seenPairs.add(pairKey);
        links.push({
          source: nodeA.id,
          target: nodeB.id,
          type: 'category',
          color: '#a855f7', // Purple
          label: `Both are ${nodeA.category.replace('-', ' ')}`,
          value: 0.5,
        });
      }
    }
  }

  return links;
}

/**
 * Build complete graph data from GitHub repositories
 */
export function buildGraphData(repos: GitHubRepo[]): GraphData {
  const nodes = buildNodes(repos);
  const links = buildLinks(nodes);

  return {
    nodes,
    links,
    timestamp: Date.now(),
  };
}

/**
 * Find connected nodes for a given node
 */
export function findConnectedNodes(nodeId: string, links: GraphLink[]): string[] {
  const connected = new Set<string>();

  links.forEach((link) => {
    const source = String(link.source);
    const target = String(link.target);

    if (source === nodeId) connected.add(target);
    if (target === nodeId) connected.add(source);
  });

  return Array.from(connected);
}

/**
 * Get statistics about the graph
 */
export function getGraphStats(data: GraphData) {
  const totalProjects = data.nodes.length;
  const totalConnections = data.links.length;
  const techLinks = data.links.filter((l) => l.type === 'technology').length;
  const categoryLinks = data.links.filter((l) => l.type === 'category').length;

  const categories = {
    'web-dev': data.nodes.filter((n) => n.category === 'web-dev').length,
    'game-dev': data.nodes.filter((n) => n.category === 'game-dev').length,
    'tools': data.nodes.filter((n) => n.category === 'tools').length,
  };

  return {
    totalProjects,
    totalConnections,
    techLinks,
    categoryLinks,
    categories,
  };
}
