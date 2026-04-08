import client from './client';
import type { Category, CategoryFormData } from '../types';

export const categoriesApi = {
  getAll: () =>
    client.get<Category[]>('/categories').then((r) => r.data),

  create: (data: CategoryFormData) =>
    client.post<Category>('/categories', data).then((r) => r.data),

  update: (categoryId: number, data: Partial<CategoryFormData>) =>
    client.put<Category>(`/categories/${categoryId}`, data).then((r) => r.data),

  remove: (categoryId: number) =>
    client.delete(`/categories/${categoryId}`),
};
