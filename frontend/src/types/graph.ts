// Graph-specific types for Project Universe visualization

/**
 * Represents a node in the force-directed graph
 * Each node corresponds to a GitHub project/repository
 */
export interface GraphNode {
  // Identifiers
  id: string;           // repo ID as string for force-graph
  name: string;         // repository name

  // Visualization
  val: number;          // node size = stars + forks (used for force-graph sizing)
  color: string;        // hex color based on primary language
  glow?: string;        // optional glow color on hover

  // Categorization
  category: 'web-dev' | 'game-dev' | 'tools';
  language: string | null;
  languages: Record<string, number>;

  // GitHub stats
  stars: number;
  forks: number;
  issues: number;
  description: string | null;

  // URLs and metadata
  url: string;          // GitHub repo URL
  homepage: string | null;
  topics: string[];
  isGameDev: boolean;

  // Force simulation (managed by force-graph)
  fx?: number;
  fy?: number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
}

/**
 * Represents a link/edge between two nodes
 * Shows relationship: shared technology OR same category
 */
export interface GraphLink {
  source: string;       // source node ID
  target: string;       // target node ID
  type: 'technology' | 'category';
  color: string;        // cyan for tech, purple for category
  value?: number;       // link strength indicator (0-1)
  technologies?: string[]; // shared tech for tech links
  label?: string;       // tooltip text (shared technology or category)
}

/**
 * Complete graph data structure
 */
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  timestamp?: number;   // cache timestamp
}

/**
 * Universe store state and actions
 */
export interface UniverseStoreState {
  // Data
  graphData: GraphData | null;
  selectedNode: GraphNode | null;
  hoveredNode: GraphNode | null;

  // UI State
  zoomLevel: number;    // 1-5 scale
  isLoading: boolean;
  error: string | null;

  // Filters
  filters: {
    category: 'all' | 'web-dev' | 'game-dev' | 'tools';
    minStars?: number;
    language?: string;
  };
}

export interface UniverseStoreActions {
  // Data operations
  fetchGraphData: () => Promise<void>;
  refreshGraphData: () => Promise<void>;

  // Selection
  selectNode: (node: GraphNode | null) => void;
  setHoveredNode: (node: GraphNode | null) => void;

  // Zoom
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // Filters
  setFilter: (key: keyof UniverseStoreState['filters'], value: any) => void;
  clearFilters: () => void;

  // Error handling
  setError: (error: string | null) => void;
}

export interface UniverseStore extends UniverseStoreState, UniverseStoreActions {}

/**
 * Type for a raw GitHub repository (from API)
 */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  languages?: Record<string, number>;
  html_url: string;
  homepage: string | null;
  topics: string[];
}

/**
 * Helper type for link building
 */
export interface LinkBuildResult {
  technologyLinks: GraphLink[];
  categoryLinks: GraphLink[];
  all: GraphLink[];
}
