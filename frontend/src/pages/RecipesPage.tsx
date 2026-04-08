import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { recipesApi } from '../api/recipes';
import { useRecipeStore } from '../store/useRecipeStore';
import type { Recipe } from '../types';

export function RecipesPage() {
  const { recipes, setRecipes, removeRecipe, isLoading, setLoading } = useRecipeStore();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    recipesApi.getAll()
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (recipe: Recipe) => {
    if (!confirm(`"${recipe.title}" 레시피를 삭제할까요?`)) return;
    setDeletingId(recipe.recipeId);
    try {
      await recipesApi.remove(recipe.recipeId);
      removeRecipe(recipe.recipeId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in-up">
        {/* 헤더 */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm text-brown-400 mb-1">나의 레시피</p>
            <h1 className="text-3xl font-bold text-brown-800">레시피</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/categories">
              <Button variant="ghost" size="sm">카테고리 관리</Button>
            </Link>
            <Link to="/recipes/new">
              <Button>+ 새 레시피</Button>
            </Link>
          </div>
        </div>

        {/* 레시피 목록 */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} variant="subtle" padding="md">
                <div className="h-5 bg-brown-100/60 rounded animate-pulse w-1/3" />
              </GlassCard>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <GlassCard variant="subtle" padding="lg" className="text-center">
            <p className="text-4xl mb-3">🍳</p>
            <p className="text-sm text-brown-500 mb-4">아직 등록된 레시피가 없어요</p>
            <Link to="/recipes/new">
              <Button>첫 레시피 만들기</Button>
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recipes.map((recipe, i) => (
              <GlassCard
                key={recipe.recipeId}
                variant="default"
                padding="none"
                className={`overflow-hidden animate-fade-in-up`}
                style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
              >
                {/* 썸네일 영역 */}
                <div className="h-28 bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
                  {recipe.thumbnailUrl ? (
                    <img src={recipe.thumbnailUrl} alt={recipe.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl select-none">🍽️</span>
                  )}
                  {recipe.cookingTime && (
                    <span className="absolute bottom-2 right-2 glass text-xs px-2 py-0.5 rounded-full text-brown-600">
                      ⏱ {recipe.cookingTime}분
                    </span>
                  )}
                </div>

                {/* 내용 */}
                <div className="p-4">
                  <h3 className="font-semibold text-brown-800 mb-1 leading-snug">{recipe.title}</h3>
                  {recipe.categories && recipe.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.categories.map((cat) => (
                        <Badge key={cat.categoryId} color="brown">{cat.name}</Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-brown-400 mb-3">
                    {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/recipes/${recipe.recipeId}`} className="flex-1">
                      <Button size="sm" variant="secondary" fullWidth>수정</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(recipe)}
                      loading={deletingId === recipe.recipeId}
                      className="text-red-400 hover:text-red-500"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
