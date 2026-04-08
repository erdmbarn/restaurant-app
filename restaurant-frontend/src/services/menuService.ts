import api from './api';
import { ApiResponse, Menu } from '../types';

export const getTodayMenu = async () => {
  const res = await api.get<ApiResponse<Menu>>('/api/menus/today');
  return res.data.data;
};

export const getWeeklyMenus = async () => {
  const res = await api.get<ApiResponse<Menu[]>>('/api/menus/week');
  return res.data.data;
};

export const getMonthlyMenus = async (year?: number, month?: number) => {
  const params = year && month ? `?year=${year}&month=${month}` : '';
  const res = await api.get<ApiResponse<Menu[]>>(`/api/menus/month${params}`);
  return res.data.data;
};

export const getMenuById = async (menuId: string) => {
  const res = await api.get<ApiResponse<Menu>>(`/api/menus/${menuId}`);
  return res.data.data;
};

export const createMenu = async (data: { date: string; productIds: string[] }) => {
  const res = await api.post<ApiResponse<Menu>>('/api/menus', data);
  return res.data.data;
};

export const updateMenu = async (menuId: string, data: { date: string; productIds: string[] }) => {
  const res = await api.put<ApiResponse<Menu>>(`/api/menus/${menuId}`, data);
  return res.data.data;
};

export const deleteMenu = async (menuId: string) => {
  await api.delete(`/api/menus/${menuId}`);
};
