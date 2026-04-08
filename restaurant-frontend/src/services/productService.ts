import api from './api';
import { ApiResponse } from '../types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get<ApiResponse<Product[]>>('/api/products');
  return res.data.data;
};

export const createProduct = async (data: {
  name: string; description: string; price: number; category: string; available: boolean;
}): Promise<Product> => {
  const res = await api.post<ApiResponse<Product>>('/api/products', data);
  return res.data.data;
};

export const updateProduct = async (id: string, data: {
  name: string; description: string; price: number; category: string; available: boolean;
}): Promise<Product> => {
  const res = await api.put<ApiResponse<Product>>(`/api/products/${id}`, data);
  return res.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/api/products/${id}`);
};
