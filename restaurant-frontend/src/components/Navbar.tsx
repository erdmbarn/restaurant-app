import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout, isRestaurant } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">&#127869;</span>
          <span className="font-bold text-xl text-orange-500">Restaurant</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {!isRestaurant && (
                <>
                  <Link to="/menu" className="text-gray-600 hover:text-orange-500 font-medium">Menu</Link>
                  <Link to="/orders" className="text-gray-600 hover:text-orange-500 font-medium">Siparislerim</Link>
                </>
              )}
              {isRestaurant && (
                <>
                  <Link to="/restaurant/orders" className="text-gray-600 hover:text-orange-500 font-medium">Siparisler</Link>
                  <Link to="/restaurant/menu" className="text-gray-600 hover:text-orange-500 font-medium">Menu Yonet</Link>
                </>
              )}
              <span className="text-sm text-gray-500">&#128100; {user.fullName}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5">Cikis</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium">Giris</Link>
              <Link to="/register" className="btn-primary text-sm">Kayit Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}