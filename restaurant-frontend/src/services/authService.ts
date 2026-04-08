import api from "./api";
import { ApiResponse, User } from "../types";
export const register = async (data: { fullName: string; email: string; password: string; role: "CUSTOMER" | "RESTAURANT" }) => {
  const res = await api.post<ApiResponse<User>>("/api/auth/register", data); return res.data.data;
};
export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<ApiResponse<User>>("/api/auth/login", data); return res.data.data;
};