import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ordersApi } from '../api/orders';
import type { Order } from '../types';

const statusLabel: Record<Order['status'], string> = {
  PENDING:   '결제 대기',
  CONFIRMED: '주문 확인',
  SHIPPING:  '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소됨',
};

const statusColor: Record<Order['status'], any> = {
  PENDING:   'yellow',
  CONFIRMED: 'blue',
  SHIPPING:  'primary',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const statusSteps: Order['status'][] = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];

const cancelableStatuses: Order['status'][] = ['PENDING', 'CONFIRMED'];

export function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadOrders = () => {
    setLoading(true);
    ordersApi.getAll().then(setOrders).finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleCancel = async (order: Order) => {
    if (!confirm('주문을 취소할까요?')) return;
    setCancellingId(order.orderId);
    try {
      await ordersApi.cancel(order.orderId);
      loadOrders();
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in-up">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm text-brown-400 mb-1">나의 주문 내역</p>
            <h1 className="text-3xl font-bold text-brown-800">주문</h1>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/books')}>
            레시피북에서 주문하기 →
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <GlassCard key={i} variant="strong" padding="lg">
                <div className="h-4 bg-brown-100/60 rounded animate-pulse w-1/3 mb-3" />
                <div className="h-3 bg-brown-100/60 rounded animate-pulse w-1/4" />
              </GlassCard>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <GlassCard variant="subtle" padding="lg" className="text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm text-brown-400 mb-1">아직 주문 내역이 없어요</p>
            <p className="text-xs text-brown-300 mb-5">레시피북을 완성하고 주문해보세요</p>
            <Button onClick={() => navigate('/books')}>레시피북 보러가기</Button>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => (
              <GlassCard key={order.orderId} variant="strong" padding="lg">
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-brown-400 mb-0.5">
                      주문번호 {order.externalOrderId ?? `#${order.orderId}`}
                    </p>
                    <p className="text-xs text-brown-400">레시피북 ID: {order.recipeBookId}</p>
                  </div>
                  <Badge color={statusColor[order.status]} dot>
                    {statusLabel[order.status]}
                  </Badge>
                </div>

                {/* 배송 진행 표시 */}
                {order.status !== 'CANCELLED' && (
                  <div className="flex items-center gap-1 mb-4">
                    {statusSteps.map((step, i) => {
                      const currentIdx = statusSteps.indexOf(order.status as any);
                      const isDone = i <= currentIdx;
                      return (
                        <div key={step} className="flex items-center gap-1 flex-1">
                          <div className={[
                            'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                            isDone
                              ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                              : 'glass text-brown-300',
                          ].join(' ')}>
                            {isDone ? '✓' : i + 1}
                          </div>
                          {i < statusSteps.length - 1 && (
                            <div className={[
                              'flex-1 h-0.5 rounded-full',
                              i < currentIdx ? 'bg-primary-400' : 'bg-brown-200/40',
                            ].join(' ')} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 하단 */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-brown-400">
                    주문일 {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                  {cancelableStatuses.includes(order.status) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-500"
                      loading={cancellingId === order.orderId}
                      onClick={() => handleCancel(order)}
                    >
                      주문 취소
                    </Button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
