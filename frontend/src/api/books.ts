import client from './client';
import type { RecipeBook } from '../types';

export interface BookItem {
  recipeId: number;
  sectionTitle?: string;
  sortOrder: number;
}

export interface BookCreatePayload {
  title: string;
  bookSpecUid?: string;
  coverTemplateUid?: string;
  coverParams?: Record<string, unknown>;
  contentTemplateUid?: string;
  items: BookItem[];
}

export interface BookUpdatePayload {
  title?: string;
  items?: BookItem[];
}

export const booksApi = {
  getAll: () =>
    client.get<RecipeBook[]>('/books').then((r) => r.data),

  getOne: (recipeBookId: number) =>
    client.get<RecipeBook>(`/books/${recipeBookId}`).then((r) => r.data),

  create: (data: BookCreatePayload) =>
    client.post('/books', data), // 201 no body

  update: (recipeBookId: number, data: BookUpdatePayload) =>
    client.put(`/books/${recipeBookId}`, data), // 204 no body

  remove: (recipeBookId: number) =>
    client.delete(`/books/${recipeBookId}`),

  getSpecs: () =>
    client.get('/books/specs').then((r) => r.data),

  getTemplates: () =>
    client.get('/books/templates').then((r) => r.data),

  getTemplate: (templateUid: string) =>
    client.get(`/books/templates/${templateUid}`).then((r) => r.data),
};
