import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuthStore } from '../store/useAuthStore';
import { useRecipeBookStore } from '../store/useRecipeBookStore';
import { booksApi } from '../api/books';
import type { RecipeBook } from '../types';

const statusLabel: Record<RecipeBook['status'], string> = {
  DRAFT:     '작성 중',
  GENERATED: '생성 완료',
  ORDERED:   '주문 완료',
};

const statusColor: Record<RecipeBook['status'], string> = {
  DRAFT:     'bg-primary-100/80 text-primary-700',
  GENERATED: 'bg-emerald-100/80 text-emerald-700',
  ORDERED:   'bg-sky-100/80 text-sky-700',
};



export function DashboardPage() {
  const { user } = useAuthStore();
  const { books, setBooks } = useRecipeBookStore();
  const hasBooks = user && books.length > 0;

  useEffect(() => {
    if (user) {
      booksApi.getAll().then(setBooks).catch(() => {});
    }
  }, [user]);
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
          <p className="text-xs text-brown-500 mb-4 tracking-[0.25em] uppercase">Create Your Recipe Book</p>
          <h1 className="text-7xl font-bold text-brown-800 mb-6 leading-tight">
            재현하다
          </h1>
          <p className="text-xl text-brown-600 mb-10 leading-relaxed">
            소중한 나만의 레시피를<br />아름다운 책으로 담아보세요.
          </p>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-[10px] text-brown-400 tracking-[0.2em]">SCROLL</span>
          <span className="text-brown-400">↓</span>
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
              나만의 레시피의 시작,<br />재현하다
            </h2>
          </div>

          {/* 레시피북 있을 때: 가로 스크롤 */}
          {hasBooks ? (
            <div
              className="flex gap-5 overflow-x-auto pb-6 px-8 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
              <div className="shrink-0 w-[max(0px,calc((100vw-1152px)/2))]" />

              {books.map((book, i) => (
                <Link
                  key={book.recipeBookId}
                  to={`/books/${book.recipeBookId}`}
                  className={[
                    'shrink-0 snap-center w-72 rounded-2xl overflow-hidden transition-all duration-300 glass',
                    i === 1
                      ? 'shadow-2xl scale-105 ring-1 ring-white/40'
                      : 'opacity-80 hover:opacity-100 hover:shadow-xl',
                  ].join(' ')}
                >
                  {/* 커버 */}
                  <div className="relative h-48 bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-7xl select-none">📚</span>
                    <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[book.status]}`}>
                      {statusLabel[book.status]}
                    </span>
                    <span className="absolute top-3 right-3 glass w-8 h-8 rounded-full flex items-center justify-center text-xs text-brown-600">
                      ↗
                    </span>
                  </div>

                  {/* 내용 */}
                  <div className="p-5">
                    <h3 className="font-semibold text-brown-800 text-lg mb-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-brown-400">
                      수정일 {new Date(book.updatedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </Link>
              ))}

              <div className="shrink-0 w-[max(0px,calc((100vw-1152px)/2))]" />
            </div>
          ) : (
            /* 레시피북 없거나 비로그인: CTA 카드 하나 */
            <div className="flex justify-center px-8">
              <Link
                to={user ? '/books' : '/login'}
                className="w-72 rounded-2xl glass-subtle flex flex-col items-center justify-center border-2 border-dashed border-primary-200/60 min-h-85 hover:bg-white/40 transition-all"
              >
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-5">
                  <span className="text-3xl">📖</span>
                </div>
                <p className="text-base font-semibold text-brown-600 mb-1">
                  {user ? '첫 레시피북 만들기' : '로그인하고 시작하기'}
                </p>
                <p className="text-xs text-brown-400">
                  {user ? '나만의 레시피를 책으로 담아보세요' : '재현하다와 함께해요'}
                </p>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 4: 책 템플릿 ───────────────────────────── */}
      <section
        className="relative py-32 px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d2318 0%, #1A0F08 60%, #2c1810 100%)' }}
      >
        {/* 배경 장식 */}
        <div
          className="absolute rounded-full blur-[120px] pointer-events-none opacity-10"
          style={{ bottom: 80, right: 80, width: 500, height: 500, background: '#D4703A' }}
        />

        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <p className="text-primary-400 text-xs tracking-[0.25em] uppercase mb-4">나만의 책을 꾸며요</p>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              BOOK TAMPLATES
            </h2>
          </div>

          {/* 템플릿 카드 그리드 (API 연결 전 플레이스홀더) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: '클래식 화이트', desc: '깔끔하고 단정한 기본 디자인', emoji: '📄', tag: 'Classic' },
              { name: '웜 베이지',    desc: '따뜻한 감성의 빈티지 스타일', emoji: '🍂', tag: 'Warm' },
              { name: '다크 모던',   desc: '세련된 다크 톤 프리미엄 디자인', emoji: '🖤', tag: 'Modern' },
              { name: '플로럴',      desc: '꽃과 자연을 담은 감성 디자인', emoji: '🌸', tag: 'Floral' },
              { name: '미니멀',      desc: '여백의 미를 살린 미니멀 스타일', emoji: '✦', tag: 'Minimal' },
              { name: '패밀리',      desc: '가족과의 추억을 담은 따뜻한 디자인', emoji: '🏠', tag: 'Family' },
            ].map((template) => (
              <div
                key={template.name}
                className="glass-dark rounded-2xl overflow-hidden group cursor-pointer hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* 미리보기 */}
                <div className="h-44 bg-white/5 flex flex-col items-center justify-center gap-3 relative">
                  <span className="text-6xl">{template.emoji}</span>
                  <span className="text-xs text-primary-400 tracking-widest uppercase">{template.tag}</span>
                  <span className="absolute top-3 right-3 text-xs text-brown-500 group-hover:text-primary-400 transition-colors">↗</span>
                </div>
                {/* 정보 */}
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                  <p className="text-brown-400 text-sm">{template.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* API 연결 안내 (개발용) */}
          <p className="text-center text-brown-600 text-xs mt-10">
            * 템플릿 데이터는 api.sweetbook.com 연동 후 교체됩니다
          </p>
        </div>
      </section>
    </div>
  );
}
