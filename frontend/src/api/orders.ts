import client from './client';
import type { Order } from '../types';

interface ShippingAddress {
  recipient: string;
  phone: string;
  address: string;
  detailAddress?: string;
  zipCode: string;
}

export const ordersApi = {
  getAll: () =>
    client.get<Order[]>('/orders').then((r) => r.data),

  getOne: (orderId: number) =>
    client.get<Order>(`/orders/${orderId}`).then((r) => r.data),

  create: (data: { recipeBookId: number; shippingAddress: ShippingAddress }) =>
    client.post<Order>('/orders', data).then((r) => r.data),

  cancel: (orderId: number) =>
    client.post<Order>(`/orders/${orderId}/cancel`).then((r) => r.data),

  updateShipping: (orderId: number, address: ShippingAddress) =>
    client.patch<Order>(`/orders/${orderId}/shipping`, address).then((r) => r.data),
};
