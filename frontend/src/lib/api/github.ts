import { apiClient } from './client';
import { GitHubUser, GitHubStats, ApiResponse } from '@/types';

export const githubAPI = {
  // Get GitHub user info
  getUser: async () => {
    const response = await apiClient.get<ApiResponse<GitHubUser>>('/github/user');
    return response.data.data;
  },

  // Get GitHub statistics
  getStats: async () => {
    const response = await apiClient.get<ApiResponse<GitHubStats>>('/github/stats');
    return response.data.data;
  },

  // Get all repositories
  getRepositories: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/github/repos');
    return response.data.data || [];
  },

  // Health check
  getHealth: async () => {
    const response = await apiClient.get<ApiResponse<{ status: string }>>('/github/health');
    return response.data.data;
  },

  // Manual sync (admin only)
  syncProjects: async () => {
    const response = await apiClient.post<
      ApiResponse<{ syncedProjects: number; timestamp: string }>
    >('/github/sync');
    return response.data.data;
  },
};

export default githubAPI;
