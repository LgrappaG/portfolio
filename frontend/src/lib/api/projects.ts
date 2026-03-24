import { apiClient } from './client';
import {
  Project,
  ProjectFilter,
  PaginatedResponse,
  ProjectStats,
  ApiResponse,
} from '@/types';

export const projectsAPI = {
  // Get projects with filtering
  getProjects: async (filters: ProjectFilter = {}) => {
    const response = await apiClient.get<PaginatedResponse<Project>>('/projects', {
      params: {
        page: filters.page || 1,
        limit: filters.limit || 12,
        category: filters.category,
        language: filters.language,
        sort: filters.sort || 'recent',
        search: filters.search,
        featured: filters.featured,
        isGameDev: filters.isGameDev,
      },
    });
    return response.data;
  },

  // Get single project
  getProjectById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  // Get project by slug
  getProjectBySlug: async (slug: string) => {
    const response = await apiClient.get<PaginatedResponse<Project>>('/projects', {
      params: {
        search: slug,
        limit: 1,
      },
    });
    return response.data.data[0];
  },

  // Get featured projects
  getFeaturedProjects: async () => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects/featured');
    return response.data.data || [];
  },

  // Get game dev projects
  getGameDevProjects: async () => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects/game-dev');
    return response.data.data || [];
  },

  // Search projects
  searchProjects: async (query: string) => {
    const response = await apiClient.get<PaginatedResponse<Project>>('/projects/search', {
      params: { q: query },
    });
    return response.data.data;
  },

  // Get project statistics
  getProjectStats: async () => {
    const response = await apiClient.get<ApiResponse<ProjectStats>>('/projects/stats');
    return response.data.data;
  },
};

export default projectsAPI;
