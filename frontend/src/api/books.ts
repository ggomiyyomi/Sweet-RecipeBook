import client from './client';
import type { RecipeBook } from '../types';

interface BookFormData {
  title: string;
  recipeIds?: number[];
}

export const booksApi = {
  getAll: () =>
    client.get<RecipeBook[]>('/books').then((r) => r.data),

  getOne: (recipeBookId: number) =>
    client.get<RecipeBook>(`/books/${recipeBookId}`).then((r) => r.data),

  create: (data: BookFormData) =>
    client.post<RecipeBook>('/books', data).then((r) => r.data),

  update: (recipeBookId: number, data: { title: string }) =>
    client.put<RecipeBook>(`/books/${recipeBookId}`, data).then((r) => r.data),

  remove: (recipeBookId: number) =>
    client.delete(`/books/${recipeBookId}`),

  getSpecs: () =>
    client.get('/books/specs').then((r) => r.data),

  getTemplates: () =>
    client.get('/books/templates').then((r) => r.data),

  getTemplate: (templateUid: string) =>
    client.get(`/books/templates/${templateUid}`).then((r) => r.data),
};
