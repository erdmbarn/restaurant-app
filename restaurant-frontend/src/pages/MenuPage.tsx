import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayMenu, getWeeklyMenus, getMonthlyMenus } from '../services/menuService';
import { createOrder } from '../services/orderService';
import { getMyOrders } from '../services/orderService';
import { Menu, MenuItem } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryLabels: Record<string, string> = {
  SOUP: 'Corba', MAIN_COURSE: 'Ana Yemek', SIDE_DISH: 'Yan Yemek',
  DESSERT: 'Tatli', BEVERAGE: 'Icecek', SALAD: 'Salata',
};

const MONTHS = ['Ocak','Subat','Mart','Nisan','Mayis','Haziran','Temmuz','Agustos','Eylul','Ekim','Kasim','Aralik'];

type Tab = 'today' | 'weekly' | 'monthly';

export default function MenuPage() {
  const [tab, setTab] = useState<Tab>('today');
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [weeklyMenus, setWeeklyMenus] = useState<Menu[]>([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [monthlyMenus, setMonthlyMenus] = useState<Menu[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [orderCount, setOrderCount] = useState(0);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    getTodayMenu().then(setMenu).catch(() => setError('Bugun icin menu bulunamadi.')).finally(() => setLoading(false));
    getMyOrders().then(orders => setOrderCount(orders.length)).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'weekly' && weeklyMenus.length === 0) {
      setWeeklyLoading(true);
      getWeeklyMenus().then((data) => setWeeklyMenus(data.sort((a, b) => a.date.localeCompare(b.date)))).catch(() => setWeeklyMenus([])).finally(() => setWeeklyLoading(false));
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'monthly') {
      setMonthlyLoading(true);
      setSelectedMenu(null);
      getMonthlyMenus(selectedYear, selectedMonth)
        .then((data) => setMonthlyMenus(data.sort((a, b) => a.date.localeCompare(b.date))))
        .catch(() => setMonthlyMenus([]))
        .finally(() => setMonthlyLoading(false));
    }
  }, [tab, selectedYear, selectedMonth]);

  const addToCart = (item: MenuItem) => {
    if (!item.available) return;
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };
  const removeFromCart = (itemId: string) => {
    setCart((prev) => { const next = { ...prev }; if (next[itemId] > 1) next[itemId]--; else delete next[itemId]; return next; });
  };
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = menu ? Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.items.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0) : 0;

  const discountRate = orderCount >= 20 ? 0.15 : orderCount >= 10 ? 0.10 : orderCount >= 5 ? 0.05 : 0;
  const discountAmount = totalPrice * discountRate;
  const finalPrice = totalPrice - discountAmount;

  const nextMilestone = orderCount < 5 ? 5 : orderCount < 10 ? 10 : orderCount < 20 ? 20 : null;
  const nextDiscount = orderCount < 5 ? 5 : orderCount < 10 ? 10 : orderCount < 20 ? 15 : null;
  const progressMax = orderCount < 5 ? 5 : orderCount < 10 ? 10 : 20;
  const progressVal = Math.min(orderCount, progressMax);

  const handleOrder = async () => {
    if (!menu || totalItems === 0) return;
    setOrdering(true);
    try {
      await createOrder({ menuId: menu.id, items: Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity })) });
      setCart({});
      setSuccess('Siparisınız alindi!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch { setError('Siparis olusturulamadi.'); } finally { setOrdering(false); }
  };

  const grouped = (m: Menu) => m.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  const isToday = (dateStr: string) =>
    new Date(dateStr).toDateString() === new Date().toDateString();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Menu</h1>
        <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="flex gap-2 mb-8">
        {([['today', 'Bugunun Menusu'], ['weekly', 'Haftalik Menu'], ['monthly', 'Aylik Menu']] as const).map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); setSelectedMenu(null); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${tab === key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'today' && (
        <>
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">{success}</div>}
          {error && <div className="bg-orange-50 border border-orange-200 text-orange-700 px-6 py-10 rounded-xl text-center"><p>{error}</p></div>}
          {menu && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {Object.entries(grouped(menu)).map(([category, items]) => (
                  <div key={category}>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">{categoryLabels[category] || category}</h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className={`card flex items-center justify-between ${!item.available ? 'opacity-50' : ''}`}>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                            <p className="text-orange-500 font-bold mt-1">TL{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {cart[item.id] ? (<><button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold">-</button><span className="w-6 text-center font-semibold">{cart[item.id]}</span></>) : null}
                            <button onClick={() => addToCart(item)} disabled={!item.available} className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold disabled:opacity-40">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1 space-y-4">
                {nextMilestone && (
                  <div className="card">
                    <p className="text-xs font-medium text-gray-600 mb-2">{nextMilestone - orderCount} siparis sonra %{nextDiscount} indirim!</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${(progressVal / progressMax) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{orderCount} / {progressMax} siparis</p>
                  </div>
                )}
                {discountRate > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-700 font-medium">
                    %{discountRate * 100} indirim uygulanacak!
                  </div>
                )}
                <div className="card sticky top-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Sepetim</h2>
                  {totalItems === 0 ? <p className="text-gray-400 text-sm text-center py-6">Urun eklenmedi</p> : (
                    <>
                      <div className="space-y-2 mb-4">
                        {Object.entries(cart).map(([id, qty]) => {
                          const item = menu.items.find((i) => i.id === id);
                          if (!item) return null;
                          return <div key={id} className="flex justify-between text-sm"><span>{item.name} x{qty}</span><span>TL{(item.price * qty).toFixed(2)}</span></div>;
                        })}
                      </div>
                      <div className="border-t pt-3 mb-4 space-y-1">
                        <div className="flex justify-between text-sm text-gray-500"><span>Ara Toplam</span><span>TL{totalPrice.toFixed(2)}</span></div>
                        {discountAmount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Indirim (%{discountRate * 100})</span><span>-TL{discountAmount.toFixed(2)}</span></div>}
                        <div className="flex justify-between font-bold text-gray-800 pt-1 border-t"><span>Toplam</span><span className="text-orange-500">TL{finalPrice.toFixed(2)}</span></div>
                      </div>
                      <button onClick={handleOrder} disabled={ordering} className="btn-primary w-full py-3">{ordering ? 'Veriliyor...' : 'Siparis Ver'}</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'weekly' && (
        <div>{weeklyLoading ? <LoadingSpinner /> : selectedMenu ? (
          <div>
            <button onClick={() => setSelectedMenu(null)} className="text-orange-500 font-medium text-sm mb-4 block">Geri Don</button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{formatDate(selectedMenu.date)}{isToday(selectedMenu.date) && <span className="ml-2 text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Bugun</span>}</h2>
            {Object.entries(grouped(selectedMenu)).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{categoryLabels[category] || category}</h3>
                {items.map((item) => (<div key={item.id} className="card flex justify-between items-center mb-2"><span className="font-semibold text-gray-800">{item.name}</span><span className="text-orange-500 font-bold">TL{item.price.toFixed(2)}</span></div>))}
              </div>
            ))}
          </div>
        ) : weeklyMenus.length === 0 ? (
          <div className="card text-center py-16"><p className="text-gray-500">Bu hafta icin menu planlanmamis.</p></div>
        ) : (
          <div className="space-y-3">
            {weeklyMenus.map((m) => (
              <button key={m.id} onClick={() => setSelectedMenu(m)} className="w-full card text-left hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <div><div className="flex items-center gap-2"><h3 className="font-semibold text-gray-800">{formatDate(m.date)}</h3>{isToday(m.date) && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Bugun</span>}</div><p className="text-sm text-gray-400">{m.items.filter(i => i.available).length} urun mevcut</p></div>
                  <span className="text-orange-400">-&gt;</span>
                </div>
              </button>
            ))}
          </div>
        )}</div>
      )}

      {tab === 'monthly' && (
        <div>
          <div className="flex gap-3 mb-6">
            <select className="input w-auto" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
            <select className="input w-auto" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {monthlyLoading ? <LoadingSpinner /> : selectedMenu ? (
            <div>
              <button onClick={() => setSelectedMenu(null)} className="text-orange-500 font-medium text-sm mb-4 block">Geri Don</button>
              <h2 className="text-xl font-bold text-gray-800 mb-6">{formatDate(selectedMenu.date)}{isToday(selectedMenu.date) && <span className="ml-2 text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Bugun</span>}</h2>
              {Object.entries(grouped(selectedMenu)).map(([category, items]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">{categoryLabels[category] || category}</h3>
                  {items.map((item) => (<div key={item.id} className="card flex justify-between items-center mb-2"><span className="font-semibold text-gray-800">{item.name}</span><span className="text-orange-500 font-bold">TL{item.price.toFixed(2)}</span></div>))}
                </div>
              ))}
            </div>
          ) : monthlyMenus.length === 0 ? (
            <div className="card text-center py-16"><p className="text-gray-500">{MONTHS[selectedMonth-1]} {selectedYear} icin menu planlanmamis.</p></div>
          ) : (
            <div className="space-y-3">
              {monthlyMenus.map((m) => (
                <button key={m.id} onClick={() => setSelectedMenu(m)} className="w-full card text-left hover:shadow-md transition-all">
                  <div className="flex justify-between items-center">
                    <div><div className="flex items-center gap-2"><h3 className="font-semibold text-gray-800">{formatDate(m.date)}</h3>{isToday(m.date) && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Bugun</span>}</div><p className="text-sm text-gray-400">{m.items.filter(i => i.available).length} urun mevcut</p></div>
                    <span className="text-orange-400">-&gt;</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
