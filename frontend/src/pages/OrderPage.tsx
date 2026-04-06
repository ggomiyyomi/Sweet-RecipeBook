import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import type { Order } from '../types';

const mockOrders: Order[] = [
  {
    orderId: 1, userId: 1, recipeBookId: 2,
    recipeBook: { recipeBookId: 2, title: '나의 베이킹 노트' },
    externalOrderId: 'ORD-20260402-001',
    status: 'SHIPPING',
    createdAt: '2026-04-02T10:30:00', updatedAt: '2026-04-03T09:00:00',
  },
];

const statusLabel: Record<Order['status'], string> = {
  PENDING:   '결제 대기',
  CONFIRMED: '주문 확인',
  SHIPPING:  '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소됨',
};

const statusColor: Record<Order['status'], 'yellow' | 'blue' | 'green' | 'brown' | 'red'> = {
  PENDING:   'yellow',
  CONFIRMED: 'blue',
  SHIPPING:  'primary' as any,
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const statusSteps: Order['status'][] = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];

export function OrderPage() {
  return (
    <AppLayout>
      <div className="animate-fade-in-up">
        <div className="mb-8">
          <p className="text-sm text-brown-400 mb-1">나의 주문 내역</p>
          <h1 className="text-3xl font-bold text-brown-800">주문</h1>
        </div>

        {mockOrders.length === 0 ? (
          <GlassCard variant="subtle" padding="lg" className="text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm text-brown-400">아직 주문 내역이 없어요</p>
            <p className="text-xs text-brown-300 mt-1">레시피북을 완성하고 주문해보세요</p>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-5">
            {mockOrders.map((order) => (
              <GlassCard key={order.orderId} variant="strong" padding="lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-brown-800">
                      {order.recipeBook?.title ?? '레시피북'}
                    </h3>
                    <p className="text-xs text-brown-400 mt-0.5">
                      주문번호 {order.externalOrderId ?? `#${order.orderId}`}
                    </p>
                  </div>
                  <Badge color={statusColor[order.status] as any} dot>
                    {statusLabel[order.status]}
                  </Badge>
                </div>

                {/* 배송 진행 표시 */}
                {order.status !== 'CANCELLED' && (
                  <div className="flex items-center gap-1 mt-4">
                    {statusSteps.map((step, i) => {
                      const currentIdx = statusSteps.indexOf(order.status);
                      const isDone = i <= currentIdx;
                      return (
                        <div key={step} className="flex items-center gap-1 flex-1">
                          <div
                            className={[
                              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shrink-0',
                              isDone
                                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                                : 'glass text-brown-300',
                            ].join(' ')}
                          >
                            {isDone ? '✓' : i + 1}
                          </div>
                          {i < statusSteps.length - 1 && (
                            <div
                              className={[
                                'flex-1 h-0.5 rounded-full transition-all',
                                i < currentIdx ? 'bg-primary-400' : 'bg-brown-200/40',
                              ].join(' ')}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-brown-400 mt-4 text-right">
                  주문일 {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
