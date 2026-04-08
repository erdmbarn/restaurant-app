import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import RestaurantOrdersPage from "./pages/RestaurantOrdersPage";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";

function ProtectedRoute({ children, requireRestaurant = false }: {
  children: React.ReactNode;
  requireRestaurant?: boolean;
}) {
  const { isAuthenticated, isRestaurant } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireRestaurant && !isRestaurant) return <Navigate to="/menu" />;
  if (!requireRestaurant && isRestaurant) return <Navigate to="/restaurant/orders" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/restaurant/orders" element={<ProtectedRoute requireRestaurant><RestaurantOrdersPage /></ProtectedRoute>} />
        <Route path="/restaurant/menu" element={<ProtectedRoute requireRestaurant><RestaurantMenuPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}