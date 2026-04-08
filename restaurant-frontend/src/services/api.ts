import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:8080", headers: { "Content-Type": "application/json" } });
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) { const { token } = JSON.parse(user); config.headers.Authorization = `Bearer ${token}`; }
  return config;
});
api.interceptors.response.use((r) => r, (error) => {
  if (error.response?.status === 401) { localStorage.removeItem("user"); window.location.href = "/login"; }
  return Promise.reject(error);
});
export default api;