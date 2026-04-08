import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { recipesApi } from '../api/recipes';
import { categoriesApi } from '../api/categories';
import { useRecipeStore } from '../store/useRecipeStore';
import type { Category, Ingredient, RecipeStep, StepType } from '../types';

export function RecipePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { addRecipe, updateRecipe } = useRecipeStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [review, setReview] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<StepType>('FOOD');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: undefined, unit: '', sortOrder: 0 },
  ]);
  const [steps, setSteps] = useState<RecipeStep[]>([
    { stepType: 'FOOD', stepOrder: 1, description: '' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories);
    if (isEdit) {
      recipesApi.getOne(Number(id)).then((recipe) => {
        setTitle(recipe.title);
        setCookingTime(recipe.cookingTime?.toString() ?? '');
        setReview(recipe.review ?? '');
        setMemo(recipe.memo ?? '');
        setSelectedCategories(recipe.categories?.map((c) => c.categoryId) ?? []);
        setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', amount: undefined, unit: '', sortOrder: 0 }]);
        setSteps(recipe.steps.length > 0 ? recipe.steps : [{ stepType: 'FOOD', stepOrder: 1, description: '' }]);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const payload = {
        title,
        cookingTime: cookingTime ? Number(cookingTime) : undefined,
        review: review || undefined,
        memo: memo || undefined,
        categoryIds: selectedCategories,
        ingredients,
        steps,
      };
      if (isEdit) {
        await recipesApi.update(Number(id), payload);
      } else {
        await recipesApi.create(payload);
      }
      navigate('/recipes');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { name: '', amount: undefined, unit: '', sortOrder: prev.length },
    ]);
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      { stepType: activeStep, stepOrder: prev.filter((s) => s.stepType === activeStep).length + 1, description: '' },
    ]);
  };

  const sectionList: { type: StepType; label: string; emoji: string }[] = [
    { type: 'FOOD',  label: '음식 레시피', emoji: '🍳' },
    { type: 'SAUCE', label: '소스 레시피', emoji: '🥫' },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-brown-400 hover:text-brown-600 mb-3 flex items-center gap-1 transition-colors"
          >
            ← 돌아가기
          </button>
          <h1 className="text-3xl font-bold text-brown-800">{isEdit ? '레시피 수정' : '새 레시피'}</h1>
        </div>

        <div className="flex flex-col gap-5">
          {/* 기본 정보 */}
          <GlassCard variant="strong" padding="lg">
            <h2 className="text-base font-semibold text-brown-700 mb-4">기본 정보</h2>
            <div className="flex flex-col gap-4">
              <Input
                label="요리명"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 엄마의 된장찌개"
                required
              />
              <Input
                label="소요 시간 (분)"
                type="number"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                placeholder="30"
              />

              {/* 카테고리 선택 */}
              <div>
                <p className="text-sm font-medium text-brown-800 mb-2">카테고리</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.categoryId}
                      onClick={() => toggleCategory(cat.categoryId)}
                      className="transition-transform active:scale-95"
                    >
                      <Badge
                        color={selectedCategories.includes(cat.categoryId) ? 'primary' : 'brown'}
                      >
                        {selectedCategories.includes(cat.categoryId) ? '✓ ' : ''}{cat.name}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* 재료 */}
          <GlassCard variant="strong" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-brown-700">재료</h2>
              <Button size="sm" variant="ghost" onClick={addIngredient}>+ 추가</Button>
            </div>
            <div className="flex flex-col gap-3">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="재료명"
                    value={ing.name}
                    onChange={(e) => setIngredients((prev) => prev.map((it, j) => j === i ? { ...it, name: e.target.value } : it))}
                    className="flex-1"
                  />
                  <Input
                    placeholder="양"
                    type="number"
                    value={ing.amount ?? ''}
                    onChange={(e) => setIngredients((prev) => prev.map((it, j) => j === i ? { ...it, amount: Number(e.target.value) } : it))}
                    className="w-20"
                  />
                  <Input
                    placeholder="단위"
                    value={ing.unit ?? ''}
                    onChange={(e) => setIngredients((prev) => prev.map((it, j) => j === i ? { ...it, unit: e.target.value } : it))}
                    className="w-20"
                  />
                  {ingredients.length > 1 && (
                    <button
                      onClick={() => setIngredients((prev) => prev.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-500 text-sm px-1 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 조리순서 */}
          <GlassCard variant="strong" padding="lg">
            <h2 className="text-base font-semibold text-brown-700 mb-4">조리순서</h2>

            {/* 타입 탭 */}
            <div className="flex glass-subtle rounded-xl p-1 mb-4 gap-1">
              {sectionList.map(({ type, label, emoji }) => (
                <button
                  key={type}
                  onClick={() => setActiveStep(type)}
                  className={[
                    'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5',
                    activeStep === type
                      ? 'glass text-primary-600 shadow-sm'
                      : 'text-brown-400 hover:text-brown-600',
                  ].join(' ')}
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {steps
                .filter((s) => s.stepType === activeStep)
                .map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full glass flex items-center justify-center text-xs font-bold text-primary-600 shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <Textarea
                      placeholder={`${i + 1}단계 내용을 입력하세요`}
                      value={step.description}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((s) =>
                            s.stepType === activeStep && prev.filter((x) => x.stepType === activeStep).indexOf(s) === i
                              ? { ...s, description: e.target.value }
                              : s
                          )
                        )
                      }
                      rows={2}
                      className="flex-1"
                    />
                  </div>
                ))}
              <Button size="sm" variant="secondary" onClick={addStep}>
                + 단계 추가
              </Button>
            </div>
          </GlassCard>

          {/* 후기 / 메모 */}
          <GlassCard variant="default" padding="lg">
            <h2 className="text-base font-semibold text-brown-700 mb-4">후기 & 메모 (선택)</h2>
            <div className="flex flex-col gap-4">
              <Textarea
                label="후기"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="이 레시피를 만들어본 느낌을 적어보세요"
                rows={3}
              />
              <Textarea
                label="메모"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="다음에 만들 때 참고할 내용"
                rows={2}
              />
            </div>
          </GlassCard>

          {/* 저장 버튼 */}
          <div className="flex gap-3 pb-4">
            <Button variant="secondary" fullWidth onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button fullWidth loading={loading} onClick={handleSave} disabled={!title.trim()}>
              {isEdit ? '수정 완료' : '레시피 저장'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
