import client from './client';
import type { Order } from '../types';

export interface OrderCreatePayload {
  recipeBookId: number;
  quantity: number;
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  address: string;
  addressDetail?: string;
}

export interface ShippingUpdatePayload {
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  address: string;
  addressDetail?: string;
}

export const ordersApi = {
  getAll: () =>
    client.get<Order[]>('/orders').then((r) => r.data),

  getOne: (orderId: number) =>
    client.get<Order>(`/orders/${orderId}`).then((r) => r.data),

  create: (data: OrderCreatePayload) =>
    client.post('/orders', data), // 201 no body

  cancel: (orderId: number, cancelReason = '고객 요청 취소') =>
    client.post(`/orders/${orderId}/cancel`, null, { params: { cancelReason } }),

  updateShipping: (orderId: number, data: ShippingUpdatePayload) =>
    client.patch(`/orders/${orderId}/shipping`, data),
};
