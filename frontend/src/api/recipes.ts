import client from './client';
import type { Recipe, RecipeDetail, RecipeFormData } from '../types';

export const recipesApi = {
  getAll: () =>
    client.get<Recipe[]>('/recipes').then((r) => r.data),

  getOne: (recipeId: number) =>
    client.get<RecipeDetail>(`/recipes/${recipeId}`).then((r) => r.data),

  create: (data: RecipeFormData) =>
    client.post('/recipes', data), // 201 no body

  update: (recipeId: number, data: Partial<RecipeFormData>) =>
    client.put(`/recipes/${recipeId}`, data), // 204 no body

  remove: (recipeId: number) =>
    client.delete(`/recipes/${recipeId}`),
};
