import api from './api';
import { ApiResponse, Order, OrderStatus } from '../types';

export const createOrder = async (data: {
  menuId: string;
  items: { menuItemId: string; quantity: number }[];
}) => {
  const res = await api.post<ApiResponse<Order>>('/api/orders', data);
  return res.data.data;
};

export const getMyOrders = async () => {
  const res = await api.get<ApiResponse<Order[]>>('/api/orders/my');
  return res.data.data;
};

export const getAllOrders = async () => {
  const res = await api.get<ApiResponse<Order[]>>('/api/orders');
  return res.data.data;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const res = await api.patch<ApiResponse<Order>>(`/api/orders/${orderId}/status`, { status });
  return res.data.data;
};

export const requestRefund = async (
  orderId: string,
  reason: string,
  items?: { menuItemId: string; quantity: number }[]
) => {
  const res = await api.post<ApiResponse<Order>>(`/api/orders/${orderId}/refund`, { reason, items });
  return res.data.data;
};

export const addItemToOrder = async (orderId: string, data: { menuItemId: string; quantity: number }) => {
  const res = await api.post<ApiResponse<Order>>(`/api/orders/${orderId}/items`, data);
  return res.data.data;
};

export const removeItemFromOrder = async (orderId: string, menuItemId: string) => {
  const res = await api.delete<ApiResponse<Order>>(`/api/orders/${orderId}/items/${menuItemId}`);
  return res.data.data;
};

export const cancelOrder = async (orderId: string) => {
  const res = await api.delete<ApiResponse<Order>>(`/api/orders/${orderId}`);
  return res.data.data;
};
