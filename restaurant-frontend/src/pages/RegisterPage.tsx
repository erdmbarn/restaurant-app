import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register as registerService } from "../services/authService";
export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "CUSTOMER" as "CUSTOMER" | "RESTAURANT" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { const user = await registerService(form); login(user); navigate(user.role === "RESTAURANT" ? "/restaurant/orders" : "/menu"); }
    catch { setError("Kayit basarisiz. E-posta zaten kullanımda olabilir."); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8"><div className="text-5xl mb-3">🍽️</div><h1 className="text-2xl font-bold">Kayit Ol</h1></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label><input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label><input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Sifre</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hesap Turu</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setForm({ ...form, role: "CUSTOMER" })} className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${form.role === "CUSTOMER" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>Musteri</button>
              <button type="button" onClick={() => setForm({ ...form, role: "RESTAURANT" })} className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${form.role === "RESTAURANT" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>Restoran</button>
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? "Kayit yapiliyor..." : "Kayit Ol"}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Hesabiniz var mi? <Link to="/login" className="text-orange-500 font-medium">Giris Yap</Link></p>
      </div>
    </div>
  );
}