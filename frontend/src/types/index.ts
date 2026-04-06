// ─────────────────────────────────────────
// User
// ─────────────────────────────────────────

export interface User {
  userId: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// ─────────────────────────────────────────
// Recipe
// ─────────────────────────────────────────

export interface Recipe {
  recipeId: number;
  userId: number;
  title: string;
  thumbnailUrl?: string;
  cookingTime?: number;
  review?: string;
  memo?: string;
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  ingredientId?: number;
  recipeId?: number;
  name: string;
  amount?: number;
  unit?: string;
  sortOrder: number;
}

export type StepType = 'FOOD' | 'SAUCE';

export interface RecipeStep {
  stepId?: number;
  recipeId?: number;
  stepType: StepType;
  stepOrder: number;
  description: string;
  imageUrl?: string;
}

export interface Memory {
  memoryId?: number;
  recipeId?: number;
  memoryDate?: string;
  withWhom?: string;
  images?: MemoryImage[];
  createdAt?: string;
}

export interface MemoryImage {
  memoryImageId?: number;
  memoryId?: number;
  imageUrl: string;
  sortOrder: number;
}

export interface RecipeDetail extends Recipe {
  ingredients: Ingredient[];
  steps: RecipeStep[];
  memory?: Memory;
}

export interface RecipeFormData {
  title: string;
  thumbnailUrl?: string;
  cookingTime?: number;
  review?: string;
  memo?: string;
  categoryIds: number[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  memory?: Omit<Memory, 'memoryId' | 'recipeId' | 'createdAt'>;
}

// ─────────────────────────────────────────
// Category
// ─────────────────────────────────────────

export interface Category {
  categoryId: number;
  userId: number;
  name: string;
  sortOrder: number;
}

export interface CategoryFormData {
  name: string;
  sortOrder?: number;
}

// ─────────────────────────────────────────
// RecipeBook
// ─────────────────────────────────────────

export type RecipeBookStatus = 'DRAFT' | 'GENERATED' | 'ORDERED';

export interface RecipeBook {
  recipeBookId: number;
  userId: number;
  title: string;
  status: RecipeBookStatus;
  externalBookId?: string;
  items?: RecipeBookItem[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeBookItem {
  itemId?: number;
  recipeBookId?: number;
  recipeId: number;
  recipe?: Pick<Recipe, 'recipeId' | 'title' | 'thumbnailUrl' | 'cookingTime'>;
  sectionTitle?: string;
  sortOrder: number;
}

// ─────────────────────────────────────────
// Order
// ─────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  orderId: number;
  userId: number;
  recipeBookId: number;
  recipeBook?: Pick<RecipeBook, 'recipeBookId' | 'title'>;
  externalOrderId?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────
// API 공통
// ─────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
