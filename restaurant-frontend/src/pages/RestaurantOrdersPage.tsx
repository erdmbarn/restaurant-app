import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const nextStatus: Record<string, OrderStatus> = { IN_PROGRESS: 'PREPARING', PREPARING: 'ON_THE_WAY', ON_THE_WAY: 'DELIVERED' };
const nextLabel: Record<string, string> = { IN_PROGRESS: 'Mutfaga Al', PREPARING: 'Yola Cikti', ON_THE_WAY: 'Teslim Edildi' };

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    getAllOrders()
      .then((d) => setOrders(d.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (id: string, status: OrderStatus) => {
    try { const u = await updateOrderStatus(id, status); setOrders((p) => p.map((o) => o.id === id ? u : o)); }
    catch { alert('Durum guncellenemedi.'); }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);
  const counts = orders.reduce((a, o) => { a[o.status] = (a[o.status] || 0) + 1; return a; }, {} as Record<string, number>);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Siparis Yonetimi</h1>
        <div className="flex gap-2 text-sm flex-wrap">
          {([['ALL', `Tumu (${orders.length})`], ['IN_PROGRESS', `Bekliyor (${counts.IN_PROGRESS || 0})`], ['PREPARING', `Hazirlaniyor (${counts.PREPARING || 0})`], ['ON_THE_WAY', `Yolda (${counts.ON_THE_WAY || 0})`]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key as OrderStatus | 'ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16"><span className="text-5xl block mb-4">📋</span><p className="text-gray-500">Bu kategoride siparis yok.</p></div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono text-sm text-gray-400">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('tr-TR')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  {nextStatus[order.status] && (
                    <button onClick={() => handleUpdate(order.id, nextStatus[order.status])} className="btn-primary text-sm py-1.5 px-3">{nextLabel[order.status]}</button>
                  )}
                  {order.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleUpdate(order.id, 'CANCELLED')} className="btn-danger text-sm py-1.5 px-3">Iptal</button>
                  )}
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>TL{item.subtotal?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-bold text-orange-500">TL{order.totalPrice?.toFixed(2)}</span>
              </div>

              {order.status === 'REFUND_REQUESTED' && (
                <div className="mt-3 pt-3 border-t text-sm space-y-1">
                  <p className="text-orange-600 font-medium">Iade Talebi: {order.refundReason}</p>
                  {order.refundItems && order.refundItems.length > 0 && (
                    <div className="space-y-0.5 text-gray-600">
                      <p className="text-xs font-medium text-gray-500 mt-1">Iade edilecek urunler:</p>
                      {order.refundItems.map((ri, idx) => {
                        const item = order.items.find(i => i.menuItemId === ri.menuItemId);
                        return <p key={idx}>- {item?.name || ri.menuItemId} x{ri.quantity}</p>;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
