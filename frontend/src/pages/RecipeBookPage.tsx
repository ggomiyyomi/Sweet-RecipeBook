import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import type { RecipeBook } from '../types';

const mockBooks: RecipeBook[] = [
  {
    recipeBookId: 1, userId: 1, title: '가족 레시피 모음집',
    status: 'DRAFT', createdAt: '2026-04-01', updatedAt: '2026-04-03',
  },
  {
    recipeBookId: 2, userId: 1, title: '나의 베이킹 노트',
    status: 'GENERATED', externalBookId: 'ext-123',
    createdAt: '2026-03-20', updatedAt: '2026-04-02',
  },
];

const statusLabel: Record<RecipeBook['status'], string> = {
  DRAFT: '작성 중',
  GENERATED: '생성 완료',
  ORDERED: '주문 완료',
};

const statusColor: Record<RecipeBook['status'], 'brown' | 'green' | 'blue'> = {
  DRAFT: 'brown',
  GENERATED: 'green',
  ORDERED: 'blue',
};

export function RecipeBookPage() {
  return (
    <AppLayout>
      <div className="animate-fade-in-up">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm text-brown-400 mb-1">나만의 레시피북</p>
            <h1 className="text-3xl font-bold text-brown-800">레시피북</h1>
          </div>
          <Button>
            <span>+</span> 새 레시피북
          </Button>
        </div>

        {/* 사용 흐름 안내 */}
        <GlassCard variant="subtle" padding="md" className="mb-8">
          <div className="flex items-center gap-6 overflow-x-auto pb-1">
            {[
              { step: '1', label: '레시피 선택', icon: '📝' },
              { step: '2', label: '순서 구성',   icon: '🔀' },
              { step: '3', label: '책 생성',     icon: '📖' },
              { step: '4', label: '주문',        icon: '📦' },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <span className="text-xs text-brown-500 whitespace-nowrap">{item.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-brown-300 text-sm">→</span>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 레시피북 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {mockBooks.map((book, i) => (
            <Link key={book.recipeBookId} to={`/books/${book.recipeBookId}`}>
              <GlassCard
                hover
                variant="default"
                padding="none"
                className={`overflow-hidden animate-fade-in-up delay-${(i + 1) * 100}`}
              >
                {/* 커버 */}
                <div className="h-36 bg-linear-to-br from-primary-200 to-primary-300 flex items-center justify-center relative">
                  <span className="text-5xl">📚</span>
                  <div className="absolute top-3 right-3">
                    <Badge color={statusColor[book.status]} dot>
                      {statusLabel[book.status]}
                    </Badge>
                  </div>
                </div>

                {/* 정보 */}
                <div className="p-5">
                  <h3 className="font-semibold text-brown-800 mb-1">{book.title}</h3>
                  <p className="text-xs text-brown-400">
                    수정일 {new Date(book.updatedAt).toLocaleDateString('ko-KR')}
                  </p>

                  <div className="flex gap-2 mt-4">
                    {book.status === 'DRAFT' && (
                      <Button size="sm" variant="secondary" className="flex-1">
                        편집하기
                      </Button>
                    )}
                    {book.status === 'GENERATED' && (
                      <Button size="sm" className="flex-1">주문하기</Button>
                    )}
                    {book.status === 'ORDERED' && (
                      <Button size="sm" variant="ghost" className="flex-1">
                        주문 확인
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}

          {/* 새 레시피북 추가 카드 */}
          <GlassCard
            hover
            variant="subtle"
            padding="none"
            className="h-full min-h-[220px] flex items-center justify-center border-dashed border-2 border-primary-200/60"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-3">
                <span className="text-xl text-primary-500">+</span>
              </div>
              <p className="text-sm text-brown-400">새 레시피북 만들기</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}
