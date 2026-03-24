import { create } from 'zustand';
import { Project, ProjectFilter } from '@/types';
import { projectsAPI } from '@/lib/api/projects';

interface ProjectStore {
  // State
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;

  // Actions
  fetchProjects: (filters?: ProjectFilter) => Promise<void>;
  fetchProjectBySlug: (slug: string) => Promise<Project | null>;
  fetchFeaturedProjects: () => Promise<void>;
  fetchGameDevProjects: () => Promise<void>;
  selectProject: (project: Project) => void;
  clearSelected: () => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,

  fetchProjects: async (filters?: ProjectFilter) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectsAPI.getProjects({
        ...filters,
        page: filters?.page || 1,
        limit: filters?.limit || 12,
      });
      set({
        projects: data.data,
        total: data.total,
        page: data.page,
        pages: data.pages,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching projects:', error);
    }
  },

  fetchProjectBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectsAPI.getProjectBySlug(slug);
      set({ selectedProject: project, isLoading: false });
      return project;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching project:', error);
      return null;
    }
  },

  fetchFeaturedProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const featured = await projectsAPI.getFeaturedProjects();
      set({ projects: featured, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch featured projects';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchGameDevProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const gameDevProjects = await projectsAPI.getGameDevProjects();
      set({ projects: gameDevProjects, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch game dev projects';
      set({ error: errorMessage, isLoading: false });
    }
  },

  selectProject: (project: Project) => set({ selectedProject: project }),
  clearSelected: () => set({ selectedProject: null }),
  setError: (error: string | null) => set({ error }),
}));
