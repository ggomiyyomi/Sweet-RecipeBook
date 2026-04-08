import { createBrowserRouter } from 'react-router-dom';
import { LoginPage }      from '../pages/LoginPage';
import { DashboardPage }  from '../pages/DashboardPage';
import { RecipesPage }    from '../pages/RecipesPage';
import { RecipePage }     from '../pages/RecipePage';
import { CategoryPage }   from '../pages/CategoryPage';
import { RecipeBookPage } from '../pages/RecipeBookPage';
import { OrderPage }      from '../pages/OrderPage';
import { MyPage }         from '../pages/MyPage';
import { ProtectedRoute } from './ProtectedRoute';

const guard = (el: JSX.Element) => <ProtectedRoute>{el}</ProtectedRoute>;

export const router = createBrowserRouter([
  { path: '/login',          element: <LoginPage /> },
  { path: '/',               element: <DashboardPage /> },
  { path: '/recipes',        element: guard(<RecipesPage />) },
  { path: '/recipes/new',    element: guard(<RecipePage />) },
  { path: '/recipes/:id',    element: guard(<RecipePage />) },
  { path: '/categories',     element: guard(<CategoryPage />) },
  { path: '/books',          element: guard(<RecipeBookPage />) },
  { path: '/books/:id',      element: guard(<RecipeBookPage />) },
  { path: '/orders',         element: guard(<OrderPage />) },
  { path: '/mypage',         element: guard(<MyPage />) },
]);
