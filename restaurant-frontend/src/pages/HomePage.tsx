import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function HomePage() {
  const { isAuthenticated, isRestaurant } = useAuth();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-6">&#127869;</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Hos Geldiniz!</h1>
      <p className="text-gray-500 text-lg max-w-md mb-8">Gunluk menuyu goruntuleyin, siparis verin ve takip edin.</p>
      {isAuthenticated ? (
        <Link to={isRestaurant ? "/restaurant/orders" : "/menu"} className="btn-primary text-lg px-8 py-3">
          {isRestaurant ? "Siparis Yonetimine Git" : "Menuyu Goruntule"}
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="btn-primary text-lg px-8 py-3">Giris Yap</Link>
          <Link to="/register" className="btn-secondary text-lg px-8 py-3">Kayit Ol</Link>
        </div>
      )}
    </div>
  );
}