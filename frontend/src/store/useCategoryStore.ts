import { create } from 'zustand';
import type { Category } from '../types';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;

  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (categoryId: number, data: Partial<Category>) => void;
  removeCategory: (categoryId: number) => void;
  reorder: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,

  setCategories: (categories) => set({ categories }),

  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),

  updateCategory: (categoryId, data) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.categoryId === categoryId ? { ...c, ...data } : c
      ),
    })),

  removeCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.categoryId !== categoryId),
    })),

  reorder: (categories) => set({ categories }),

  setLoading: (isLoading) => set({ isLoading }),
}));
