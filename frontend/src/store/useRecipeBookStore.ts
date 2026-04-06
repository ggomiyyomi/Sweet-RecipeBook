import { create } from 'zustand';
import type { RecipeBook, RecipeBookItem } from '../types';

interface RecipeBookState {
  books: RecipeBook[];
  currentBook: RecipeBook | null;
  isLoading: boolean;

  setBooks: (books: RecipeBook[]) => void;
  setCurrentBook: (book: RecipeBook | null) => void;
  addBook: (book: RecipeBook) => void;
  updateBook: (recipeBookId: number, data: Partial<RecipeBook>) => void;
  removeBook: (recipeBookId: number) => void;

  // 레시피북 아이템 조작
  addItem: (item: RecipeBookItem) => void;
  removeItem: (itemId: number) => void;
  reorderItems: (items: RecipeBookItem[]) => void;
  updateItemSection: (itemId: number, sectionTitle: string) => void;

  setLoading: (loading: boolean) => void;
}

export const useRecipeBookStore = create<RecipeBookState>((set, get) => ({
  books: [],
  currentBook: null,
  isLoading: false,

  setBooks: (books) => set({ books }),

  setCurrentBook: (book) => set({ currentBook: book }),

  addBook: (book) =>
    set((state) => ({ books: [book, ...state.books] })),

  updateBook: (recipeBookId, data) =>
    set((state) => ({
      books: state.books.map((b) =>
        b.recipeBookId === recipeBookId ? { ...b, ...data } : b
      ),
      currentBook:
        state.currentBook?.recipeBookId === recipeBookId
          ? { ...state.currentBook, ...data }
          : state.currentBook,
    })),

  removeBook: (recipeBookId) =>
    set((state) => ({
      books: state.books.filter((b) => b.recipeBookId !== recipeBookId),
      currentBook:
        state.currentBook?.recipeBookId === recipeBookId ? null : state.currentBook,
    })),

  addItem: (item) => {
    const current = get().currentBook;
    if (!current) return;
    set({
      currentBook: {
        ...current,
        items: [...(current.items ?? []), item],
      },
    });
  },

  removeItem: (itemId) => {
    const current = get().currentBook;
    if (!current) return;
    set({
      currentBook: {
        ...current,
        items: (current.items ?? []).filter((i) => i.itemId !== itemId),
      },
    });
  },

  reorderItems: (items) => {
    const current = get().currentBook;
    if (!current) return;
    set({ currentBook: { ...current, items } });
  },

  updateItemSection: (itemId, sectionTitle) => {
    const current = get().currentBook;
    if (!current) return;
    set({
      currentBook: {
        ...current,
        items: (current.items ?? []).map((i) =>
          i.itemId === itemId ? { ...i, sectionTitle } : i
        ),
      },
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
