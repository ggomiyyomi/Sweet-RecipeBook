import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { booksApi } from '../api/books';
import { recipesApi } from '../api/recipes';
import { ordersApi } from '../api/orders';
import type { OrderCreatePayload } from '../api/orders';
import { useRecipeBookStore } from '../store/useRecipeBookStore';
import type { RecipeBook, Recipe } from '../types';

// ─── 상태 표시 ───────────────────────────────────────────
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

// ─── 주문 폼 ─────────────────────────────────────────────
function OrderModal({ book, onClose, onDone }: {
  book: RecipeBook;
  onClose: () => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    recipientName: '', recipientPhone: '', postalCode: '',
    address: '', addressDetail: '', quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: OrderCreatePayload = {
        recipeBookId: book.recipeBookId,
        quantity: Number(form.quantity),
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        postalCode: form.postalCode,
        address: form.address,
        addressDetail: form.addressDetail || undefined,
      };
      await ordersApi.create(payload);
      onDone();
    } catch (err: any) {
      setError(err.response?.data?.message ?? '주문에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <GlassCard
        variant="strong"
        padding="lg"
        className="relative w-full max-w-md animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-brown-800 mb-1">주문하기</h2>
        <p className="text-sm text-brown-400 mb-6">📚 {book.title}</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50/80 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="수령인"
              name="recipientName"
              value={form.recipientName}
              onChange={handleChange}
              placeholder="홍길동"
              required
            />
            <Input
              label="수량"
              name="quantity"
              type="number"
              value={String(form.quantity)}
              onChange={handleChange}
              placeholder="1"
              required
            />
          </div>
          <Input
            label="연락처"
            name="recipientPhone"
            value={form.recipientPhone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            required
          />
          <Input
            label="우편번호"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            placeholder="12345"
            required
          />
          <Input
            label="주소"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="서울특별시 강남구 테헤란로 123"
            required
          />
          <Input
            label="상세 주소"
            name="addressDetail"
            value={form.addressDetail}
            onChange={handleChange}
            placeholder="101동 202호 (선택)"
          />

          <div className="flex gap-3 mt-2">
            <Button variant="secondary" fullWidth type="button" onClick={onClose}>
              취소
            </Button>
            <Button fullWidth type="submit" loading={loading}>
              주문 완료
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

// ─── 책 생성 폼 ───────────────────────────────────────────
function BookCreatePanel({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState('');
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    recipesApi.getAll()
      .then(setAllRecipes)
      .finally(() => setFetching(false));
  }, []);

  const toggle = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleCreate = async () => {
    if (!title.trim() || selectedIds.size === 0) return;
    setLoading(true);
    try {
      const items = [...selectedIds].map((recipeId, i) => ({ recipeId, sortOrder: i }));
      await booksApi.create({ title: title.trim(), items });
      onDone();
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard variant="strong" padding="lg" className="mb-6 animate-fade-in-up">
      <h2 className="text-base font-semibold text-brown-700 mb-4">새 레시피북 만들기</h2>

      <Input
        label="책 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="예: 가족 레시피 모음집"
        className="mb-4"
      />

      <p className="text-sm font-medium text-brown-700 mb-2">
        레시피 선택 <span className="text-xs text-brown-400">({selectedIds.size}개 선택됨)</span>
      </p>

      {fetching ? (
        <div className="flex flex-col gap-2 mb-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 bg-brown-100/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : allRecipes.length === 0 ? (
        <p className="text-sm text-brown-400 mb-4 py-2">등록된 레시피가 없어요. 먼저 레시피를 추가해주세요.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 mb-4">
          {allRecipes.map((recipe) => {
            const selected = selectedIds.has(recipe.recipeId);
            return (
              <button
                key={recipe.recipeId}
                type="button"
                onClick={() => toggle(recipe.recipeId)}
                className={[
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all',
                  selected
                    ? 'glass bg-primary-50/60 ring-1 ring-primary-300'
                    : 'glass-subtle hover:bg-white/40',
                ].join(' ')}
              >
                <span className={[
                  'w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 transition-all',
                  selected ? 'bg-primary-500 text-white' : 'border border-brown-300',
                ].join(' ')}>
                  {selected && '✓'}
                </span>
                <span className="text-sm font-medium text-brown-800 flex-1">{recipe.title}</span>
                {recipe.cookingTime && (
                  <span className="text-xs text-brown-400">⏱ {recipe.cookingTime}분</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={onDone}>
          취소
        </Button>
        <Button
          fullWidth
          loading={loading}
          disabled={!title.trim() || selectedIds.size === 0}
          onClick={handleCreate}
        >
          책 생성
        </Button>
      </div>
    </GlassCard>
  );
}

// ─── 책 목록 뷰 ──────────────────────────────────────────
function BookListView() {
  const navigate = useNavigate();
  const { books, setBooks, setLoading } = useRecipeBookStore();
  const [creating, setCreating] = useState(false);

  const reload = () => {
    setLoading(true);
    booksApi.getAll().then(setBooks).finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm text-brown-400 mb-1">나만의 레시피북</p>
          <h1 className="text-3xl font-bold text-brown-800">레시피북</h1>
        </div>
        {!creating && (
          <Button onClick={() => setCreating(true)}>+ 새 레시피북</Button>
        )}
      </div>

      {creating && (
        <BookCreatePanel onDone={() => { setCreating(false); reload(); }} />
      )}

      {/* 사용 흐름 */}
      <GlassCard variant="subtle" padding="md" className="mb-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          {[
            { icon: '🍳', label: '레시피 등록' },
            { icon: '📝', label: '레시피 선택' },
            { icon: '📚', label: '책 생성' },
            { icon: '📦', label: '주문' },
          ].map((item, i, arr) => (
            <div key={item.label} className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-base">
                  {item.icon}
                </div>
                <span className="text-xs text-brown-500 whitespace-nowrap">{item.label}</span>
              </div>
              {i < arr.length - 1 && <span className="text-brown-300">→</span>}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 책 목록 */}
      {books.length === 0 && !creating ? (
        <GlassCard variant="subtle" padding="lg" className="text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-sm text-brown-400 mb-4">아직 레시피북이 없어요</p>
          <Button onClick={() => setCreating(true)}>첫 레시피북 만들기</Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {books.map((book) => (
            <GlassCard
              key={book.recipeBookId}
              hover
              variant="default"
              padding="none"
              className="overflow-hidden"
              onClick={() => navigate(`/books/${book.recipeBookId}`)}
            >
              <div className="h-32 bg-linear-to-br from-primary-200 to-primary-300 flex items-center justify-center relative">
                <span className="text-5xl">📚</span>
                <div className="absolute top-3 right-3">
                  <Badge color={statusColor[book.status]} dot>{statusLabel[book.status]}</Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-brown-800 mb-1">{book.title}</h3>
                <p className="text-xs text-brown-400">수정일 {new Date(book.updatedAt).toLocaleDateString('ko-KR')}</p>
                <div className="mt-3">
                  {book.status === 'DRAFT' && (
                    <Badge color="brown">레시피 구성 중</Badge>
                  )}
                  {book.status === 'GENERATED' && (
                    <Badge color="green">주문 가능</Badge>
                  )}
                  {book.status === 'ORDERED' && (
                    <Badge color="blue">주문 완료</Badge>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 책 상세 뷰 ──────────────────────────────────────────
function BookDetailView({ bookId }: { bookId: number }) {
  const navigate = useNavigate();
  const [book, setBook] = useState<RecipeBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrder, setShowOrder] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const loadBook = () => {
    setLoading(true);
    booksApi.getOne(bookId).then(setBook).finally(() => setLoading(false));
  };

  useEffect(() => { loadBook(); }, [bookId]);

  const handleOrderDone = () => {
    setShowOrder(false);
    setOrderDone(true);
    loadBook();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 bg-brown-100/60 rounded w-1/3" />
        <div className="h-40 bg-brown-100/60 rounded-2xl" />
      </div>
    );
  }

  if (!book) return <p className="text-brown-400">책을 찾을 수 없어요.</p>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {showOrder && (
        <OrderModal book={book} onClose={() => setShowOrder(false)} onDone={handleOrderDone} />
      )}

      <button
        onClick={() => navigate('/books')}
        className="text-sm text-brown-400 hover:text-brown-600 mb-4 flex items-center gap-1 transition-colors"
      >
        ← 레시피북 목록
      </button>

      {orderDone && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-sm text-emerald-700 font-medium">
          ✓ 주문이 완료되었어요! 주문 내역에서 확인하세요.
        </div>
      )}

      {/* 책 헤더 */}
      <GlassCard variant="strong" padding="lg" className="mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brown-800 mb-1">{book.title}</h1>
            <p className="text-xs text-brown-400">
              생성일 {new Date(book.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <Badge color={statusColor[book.status]} dot>{statusLabel[book.status]}</Badge>
        </div>

        {book.status === 'GENERATED' && !orderDone && (
          <Button className="mt-5 w-full" onClick={() => setShowOrder(true)}>
            📦 이 책 주문하기
          </Button>
        )}
        {book.status === 'ORDERED' && (
          <Button variant="ghost" className="mt-5 w-full" onClick={() => navigate('/orders')}>
            주문 내역 확인 →
          </Button>
        )}
      </GlassCard>

      {/* 레시피 목록 */}
      <GlassCard variant="default" padding="lg">
        <h2 className="text-base font-semibold text-brown-700 mb-4">
          수록된 레시피 <span className="text-xs text-brown-400">({book.items?.length ?? 0}개)</span>
        </h2>

        {!book.items || book.items.length === 0 ? (
          <p className="text-sm text-brown-400">레시피가 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {book.items.map((item, i) => (
              <div
                key={item.itemId ?? i}
                className="flex items-center gap-3 py-2 border-b border-white/30 last:border-0"
              >
                <span className="w-6 h-6 rounded-full glass flex items-center justify-center text-xs font-bold text-primary-600 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brown-800">
                    {(item as any).recipeTitle ?? (item as any).recipe?.title ?? '레시피'}
                  </p>
                  {(item as any).sectionTitle && (
                    <p className="text-xs text-brown-400">{(item as any).sectionTitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────
export function RecipeBookPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppLayout>
      {id ? <BookDetailView bookId={Number(id)} /> : <BookListView />}
    </AppLayout>
  );
}
