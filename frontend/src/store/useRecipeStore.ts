import { create } from 'zustand';
import type { Recipe, RecipeDetail, RecipeFormData } from '../types';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: RecipeDetail | null;
  isLoading: boolean;
  error: string | null;

  setRecipes: (recipes: Recipe[]) => void;
  setCurrentRecipe: (recipe: RecipeDetail | null) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipeId: number, data: Partial<Recipe>) => void;
  removeRecipe: (recipeId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 폼 임시 저장
  draftForm: Partial<RecipeFormData> | null;
  setDraftForm: (draft: Partial<RecipeFormData> | null) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  currentRecipe: null,
  isLoading: false,
  error: null,
  draftForm: null,

  setRecipes: (recipes) => set({ recipes }),

  setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),

  addRecipe: (recipe) =>
    set((state) => ({ recipes: [recipe, ...state.recipes] })),

  updateRecipe: (recipeId, data) =>
    set((state) => ({
      recipes: state.recipes.map((r) =>
        r.recipeId === recipeId ? { ...r, ...data } : r
      ),
      currentRecipe:
        state.currentRecipe?.recipeId === recipeId
          ? { ...state.currentRecipe, ...data }
          : state.currentRecipe,
    })),

  removeRecipe: (recipeId) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r.recipeId !== recipeId),
      currentRecipe:
        state.currentRecipe?.recipeId === recipeId ? null : state.currentRecipe,
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setDraftForm: (draftForm) => set({ draftForm }),
}));
