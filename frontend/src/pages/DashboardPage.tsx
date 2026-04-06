import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import type { Recipe } from '../types';

const mockRecipes: Recipe[] = [
  {
    recipeId: 1, userId: 1, title: '엄마의 된장찌개', cookingTime: 30,
    thumbnailUrl: '', review: '언제 먹어도 그리운 맛', createdAt: '', updatedAt: '',
    categories: [{ categoryId: 1, userId: 1, name: '엄마 레시피', sortOrder: 0 }],
  },
  {
    recipeId: 2, userId: 1, title: '바나나 파운드케이크', cookingTime: 60,
    thumbnailUrl: '', review: '촉촉하고 달콤해서 아무도 거부 못하는 맛이에요. 집들이 선물로도 최고!', createdAt: '', updatedAt: '',
    categories: [{ categoryId: 2, userId: 1, name: '베이킹', sortOrder: 1 }],
  },
  {
    recipeId: 3, userId: 1, title: '간장계란볶음밥', cookingTime: 15,
    thumbnailUrl: '', review: '자취생의 소울푸드', createdAt: '', updatedAt: '',
    categories: [{ categoryId: 3, userId: 1, name: '간단요리', sortOrder: 2 }],
  },
  {
    recipeId: 4, userId: 1, title: '크림 뇨끼 파스타', cookingTime: 35,
    thumbnailUrl: '', review: '크리미하고 진한 맛, 식당보다 맛있다는 말 들어봤어요', createdAt: '', updatedAt: '',
    categories: [{ categoryId: 4, userId: 1, name: '양식', sortOrder: 3 }],
  },
  {
    recipeId: 5, userId: 1, title: '매콤 제육볶음', cookingTime: 20,
    thumbnailUrl: '', review: '매콤달콤, 밥도둑이 따로 없어요', createdAt: '', updatedAt: '',
    categories: [{ categoryId: 1, userId: 1, name: '한식', sortOrder: 4 }],
  },
];

const steps = [
  {
    num: '01', label: 'Design',
    title: '레시피 선택',
    desc: '소중한 레시피 하나하나를 정성스럽게 골라 나만의 컬렉션을 완성하세요.',
    icon: '📝',
  },
  {
    num: '02', label: 'Materials',
    title: '순서 구성',
    desc: '레시피의 흐름을 잡고 최적의 순서로 구성해 책의 완성도를 높이세요.',
    icon: '🔀',
  },
  {
    num: '03', label: 'Craftmanship',
    title: '책 생성',
    desc: '고품질 인쇄로 나만의 레시피북을 실물 책으로 만들어냅니다.',
    icon: '📖',
  },
  {
    num: '04', label: 'Finish',
    title: '주문 배송',
    desc: '완성된 레시피북을 집 앞으로 배송해 드립니다.',
    icon: '📦',
  },
];

const foodEmoji = ['🍲', '🎂', '🍳', '🥘', '🍜', '🥗', '🍱', '🫕'];

export function DashboardPage() {
  return (
    <div>
      <Header />

      {/* ── Section 1: Hero ───────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-linear-to-br from-primary-50 via-primary-100 to-primary-200" />

        {/* 배경 장식 orbs */}
        <div
          className="absolute rounded-full blur-[100px] pointer-events-none"
          style={{ top: '-10%', right: '-5%', width: 700, height: 700, background: 'rgba(232,131,74,0.35)' }}
        />
        <div
          className="absolute rounded-full blur-[80px] pointer-events-none"
          style={{ bottom: '-5%', left: '-8%', width: 500, height: 500, background: 'rgba(245,168,120,0.3)' }}
        />
        <div
          className="absolute rounded-full blur-[60px] pointer-events-none"
          style={{ top: '35%', left: '25%', width: 350, height: 350, background: 'rgba(255,231,168,0.25)' }}
        />

        {/* 중앙 대형 비주얼 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="relative">
            <span className="block text-[180px] opacity-70 animate-float">🍽️</span>
            <span
              className="absolute text-[75px] opacity-45 animate-float"
              style={{ top: '-60px', right: '-80px', animationDelay: '1.2s' }}
            >
              🌿
            </span>
            <span
              className="absolute text-[55px] opacity-35 animate-float"
              style={{ bottom: '-20px', left: '-90px', animationDelay: '2.4s' }}
            >
              ✨
            </span>
            <span
              className="absolute text-[50px] opacity-30 animate-float"
              style={{ top: '20px', left: '-110px', animationDelay: '0.8s' }}
            >
              🥄
            </span>
          </div>
        </div>

        {/* 텍스트 – 왼쪽 하단 */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 pb-28 w-full">
          <p className="text-xs text-brown-500 mb-4 tracking-[0.25em] uppercase">Sweet Recipe Book</p>
          <h1 className="text-7xl font-bold text-brown-800 mb-6 leading-tight">
            맛을 재현하다
          </h1>
          <p className="text-xl text-brown-600 mb-10 leading-relaxed">
            소중한 나만의 레시피를<br />아름다운 책으로 담아보세요.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/recipes/new">
              <Button size="lg">레시피 추가하기</Button>
            </Link>
            <Link to="/books">
              <Button size="lg" variant="secondary">레시피북 만들기</Button>
            </Link>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-[10px] text-brown-400 tracking-[0.2em]">SCROLL</span>
          <span className="text-brown-400">↓</span>
        </div>
      </section>

      {/* ── Section 2: Features ───────────────────────────── */}
      <section
        className="relative min-h-screen py-32 px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d2318 0%, #1A0F08 60%, #2c1810 100%)' }}
      >
        {/* 배경 장식 */}
        <div
          className="absolute rounded-full blur-[120px] pointer-events-none opacity-15"
          style={{ top: 80, left: 80, width: 400, height: 400, background: '#D4703A' }}
        />
        <div
          className="absolute rounded-full blur-[100px] pointer-events-none opacity-10"
          style={{ bottom: 80, right: 80, width: 300, height: 300, background: '#E8834A' }}
        />

        <div className="max-w-6xl mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-20">
            <p className="text-primary-400 text-xs tracking-[0.25em] uppercase mb-4">How it works</p>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              레시피북 만들기,<br />이렇게 간단해요
            </h2>
            <p className="text-brown-300 text-lg leading-relaxed">
              레시피 선택부터 집 앞 배송까지,<br />모든 과정을 함께 디자인했습니다.
            </p>
          </div>

          {/* 4단계 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step) => (
              <div
                key={step.num}
                className="glass-dark rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs text-brown-400 tracking-widest">
                    STEP {step.num} – {step.label}
                  </span>
                  <span className="text-brown-500 text-sm group-hover:text-primary-400 transition-colors">
                    ↗
                  </span>
                </div>

                <div className="h-24 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                  <span className="text-5xl">{step.icon}</span>
                </div>

                <h3 className="text-white font-semibold text-lg mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-brown-300 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: 레시피 갤러리 ──────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        {/* 배경 */}
        <div className="absolute inset-0 bg-linear-to-br from-primary-50 via-brown-50 to-primary-100" />
        <div
          className="absolute rounded-full blur-[100px] pointer-events-none"
          style={{ top: 0, right: 0, width: 600, height: 600, background: 'rgba(232,131,74,0.2)' }}
        />

        <div className="relative z-10">
          {/* 섹션 헤더 */}
          <div className="max-w-6xl mx-auto px-8 mb-14 text-center">
            <h2 className="text-4xl font-bold text-brown-800 mb-5">
              나의 레시피와 함께한 순간
            </h2>
            <Link
              to="/"
              className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm text-brown-600 hover:bg-white/65 transition-all"
            >
              자세히 보기 →
            </Link>
          </div>

          {/* 가로 스크롤 */}
          <div
            className="flex gap-5 overflow-x-auto pb-6 px-8 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          >
            {/* 왼쪽 spacer (대형 화면 중앙 정렬) */}
            <div className="shrink-0 w-[max(0px,calc((100vw-1152px)/2))]" />

            {mockRecipes.map((recipe, i) => {
              const isFeatured = i === 1;
              return (
                <Link
                  key={recipe.recipeId}
                  to={`/recipes/${recipe.recipeId}`}
                  className={[
                    'shrink-0 snap-center w-72 rounded-2xl overflow-hidden transition-all duration-300 glass',
                    isFeatured
                      ? 'shadow-2xl scale-105 ring-1 ring-white/40'
                      : 'opacity-80 hover:opacity-100 hover:shadow-xl',
                  ].join(' ')}
                >
                  {/* 썸네일 */}
                  <div className="relative h-48 bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-7xl select-none">
                      {foodEmoji[recipe.recipeId % foodEmoji.length]}
                    </span>

                    {isFeatured ? (
                      <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                        Best Recipe
                      </span>
                    ) : null}

                    <span className="absolute top-3 right-3 glass w-8 h-8 rounded-full flex items-center justify-center text-xs text-brown-600">
                      ↗
                    </span>
                  </div>

                  {/* 내용 */}
                  <div className="p-5">
                    <h3 className="font-semibold text-brown-800 text-lg mb-2 leading-snug">
                      {recipe.title}
                    </h3>
                    {recipe.review && (
                      <p className="text-sm text-brown-400 line-clamp-2 mb-4 leading-relaxed">
                        {recipe.review}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {recipe.categories?.map((cat) => (
                        <span
                          key={cat.categoryId}
                          className="text-xs text-brown-500 bg-brown-100/80 px-2.5 py-0.5 rounded-full"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                    {recipe.cookingTime && (
                      <p className="text-xs text-brown-400">⏱ {recipe.cookingTime}분</p>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* 새 레시피 추가 카드 */}
            <Link
              to="/recipes/new"
              className="shrink-0 snap-center w-72 rounded-2xl glass-subtle flex flex-col items-center justify-center border-2 border-dashed border-primary-200/60 min-h-85 hover:bg-white/40 transition-all"
            >
              <div className="w-14 h-14 rounded-full glass flex items-center justify-center mb-4">
                <span className="text-2xl text-primary-500">+</span>
              </div>
              <p className="text-sm text-brown-400">새 레시피 추가</p>
            </Link>

            {/* 오른쪽 spacer */}
            <div className="shrink-0 w-[max(0px,calc((100vw-1152px)/2))]" />
          </div>
        </div>
      </section>
    </div>
  );
}
