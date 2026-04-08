import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/authService";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const user = await loginService({ email, password });
      login(user);
      navigate(user.role === "RESTAURANT" ? "/restaurant/orders" : "/menu");
    } catch { setError("E-posta veya sifre hatali."); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">&#127869;</div>
          <h1 className="text-2xl font-bold">Giris Yap</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input type="email" className="input" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sifre</label>
            <input type="password" className="input" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? "Giris yapiliyor..." : "Giris Yap"}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabiniz yok mu? <Link to="/register" className="text-orange-500 font-medium">Kayit Ol</Link>
        </p>
      </div>
    </div>
  );
}