import { create } from 'zustand';
import { ProjectFilter } from '@/types';

interface FilterStore {
  // State
  category: string | null;
  languages: string[];
  searchQuery: string;
  sortBy: 'recent' | 'popular' | 'oldest';
  page: number;
  limit: number;
  isGameDev: boolean | null;
  isFeatured: boolean | null;

  // Actions
  setCategory: (category: string | null) => void;
  setLanguages: (languages: string[]) => void;
  addLanguage: (language: string) => void;
  removeLanguage: (language: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'recent' | 'popular' | 'oldest') => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setIsGameDev: (isGameDev: boolean | null) => void;
  setIsFeatured: (isFeatured: boolean | null) => void;
  clearAll: () => void;
  getActiveFilters: () => ProjectFilter;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  category: null,
  languages: [],
  searchQuery: '',
  sortBy: 'recent',
  page: 1,
  limit: 12,
  isGameDev: null,
  isFeatured: null,

  setCategory: (category) => set({ category, page: 1 }),
  setLanguages: (languages) => set({ languages, page: 1 }),
  addLanguage: (language) => {
    const current = get().languages;
    if (!current.includes(language)) {
      set({ languages: [...current, language], page: 1 });
    }
  },
  removeLanguage: (language) => {
    const current = get().languages;
    set({ languages: current.filter((l) => l !== language), page: 1 });
  },
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setIsGameDev: (isGameDev) => set({ isGameDev, page: 1 }),
  setIsFeatured: (isFeatured) => set({ isFeatured, page: 1 }),

  clearAll: () =>
    set({
      category: null,
      languages: [],
      searchQuery: '',
      sortBy: 'recent',
      page: 1,
      isGameDev: null,
      isFeatured: null,
    }),

  getActiveFilters: () => {
    const state = get();
    return {
      category: state.category || undefined,
      language: state.languages[0] || undefined,
      search: state.searchQuery || undefined,
      sort: state.sortBy,
      page: state.page,
      limit: state.limit,
      isGameDev: state.isGameDev || undefined,
      featured: state.isFeatured || undefined,
    };
  },
}));
