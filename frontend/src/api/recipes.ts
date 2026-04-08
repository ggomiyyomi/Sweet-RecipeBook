import client from './client';
import type { Recipe, RecipeDetail, RecipeFormData } from '../types';

export const recipesApi = {
  getAll: () =>
    client.get<Recipe[]>('/recipes').then((r) => r.data),

  getOne: (recipeId: number) =>
    client.get<RecipeDetail>(`/recipes/${recipeId}`).then((r) => r.data),

  create: (data: RecipeFormData) =>
    client.post<RecipeDetail>('/recipes', data).then((r) => r.data),

  update: (recipeId: number, data: Partial<RecipeFormData>) =>
    client.put<RecipeDetail>(`/recipes/${recipeId}`, data).then((r) => r.data),

  remove: (recipeId: number) =>
    client.delete(`/recipes/${recipeId}`),
};
