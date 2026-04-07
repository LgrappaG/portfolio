import { create } from 'zustand';
import type {
  UniverseStore,
  GraphData,
  GitHubRepo,
} from '@/types/graph';
import { buildGraphData } from '@/lib/utils/graphBuilder';

/**
 * Universe store: manages graph data, selection, zoom, filters
 */
export const useUniverseStore = create<UniverseStore>((set, get) => ({
  // Initial state
  graphData: null,
  selectedNode: null,
  hoveredNode: null,
  zoomLevel: 1,
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    minStars: 0,
    language: undefined,
  },

  // Fetch graph data from GitHub API
  fetchGraphData: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(
        'https://api.github.com/users/LgrappaG/repos?per_page=100&sort=stars',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
      }

      const repos: GitHubRepo[] = await res.json();
      const graphData = buildGraphData(repos);

      set({ graphData, isLoading: false });
      console.log(`✅ Loaded ${graphData.nodes.length} projects, ${graphData.links.length} connections`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch repositories';
      set({ error: message, isLoading: false });
      console.error('❌ fetchGraphData error:', message);
    }
  },

  // Refresh graph data
  refreshGraphData: async () => {
    const { fetchGraphData } = get();
    await fetchGraphData();
  },

  // Select a node to show in side panel
  selectNode: (node) => {
    set({ selectedNode: node });
  },

  // Track hovered node for visual feedback
  setHoveredNode: (node) => {
    set({ hoveredNode: node });
  },

  // Set zoom level (1-5)
  setZoomLevel: (level) => {
    const clamped = Math.max(1, Math.min(5, level));
    set({ zoomLevel: clamped });
  },

  // Zoom in (increment by 1, max 5)
  zoomIn: () => {
    const { zoomLevel } = get();
    get().setZoomLevel(zoomLevel + 1);
  },

  // Zoom out (decrement by 1, min 1)
  zoomOut: () => {
    const { zoomLevel } = get();
    get().setZoomLevel(zoomLevel - 1);
  },

  // Reset zoom to default
  resetZoom: () => {
    set({ zoomLevel: 1 });
  },

  // Update a filter
  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  // Clear all filters
  clearFilters: () => {
    set({
      filters: {
        category: 'all',
        minStars: 0,
        language: undefined,
      },
    });
  },

  // Set error message
  setError: (error) => {
    set({ error });
  },
}));

/**
 * Selector: filtered graph data based on current filters
 */
export const selectFilteredGraphData = (state: UniverseStore): GraphData | null => {
  if (!state.graphData) return null;

  const { category, language, minStars = 0 } = state.filters;

  let nodes = state.graphData.nodes;

  // Filter by category
  if (category !== 'all') {
    nodes = nodes.filter((n) => n.category === category);
  }

  // Filter by language
  if (language) {
    nodes = nodes.filter((n) => n.language === language);
  }

  // Filter by minimum stars
  if (minStars > 0) {
    nodes = nodes.filter((n) => n.stars >= minStars);
  }

  // Filter links to only include connected nodes
  const nodeIds = new Set(nodes.map((n) => n.id));
  const links = state.graphData.links.filter(
    (l) => nodeIds.has(String(l.source)) && nodeIds.has(String(l.target))
  );

  return { nodes, links };
};
