import { createBrowserRouter } from 'react-router-dom';
import { LoginPage }      from '../pages/LoginPage';
import { DashboardPage }  from '../pages/DashboardPage';
import { RecipePage }     from '../pages/RecipePage';
import { CategoryPage }   from '../pages/CategoryPage';
import { RecipeBookPage } from '../pages/RecipeBookPage';
import { OrderPage }      from '../pages/OrderPage';

export const router = createBrowserRouter([
  { path: '/login',          element: <LoginPage /> },
  { path: '/',               element: <DashboardPage /> },
  { path: '/recipes/new',    element: <RecipePage /> },
  { path: '/recipes/:id',    element: <RecipePage /> },
  { path: '/categories',     element: <CategoryPage /> },
  { path: '/books',          element: <RecipeBookPage /> },
  { path: '/books/:id',      element: <RecipeBookPage /> },
  { path: '/orders',         element: <OrderPage /> },
]);
