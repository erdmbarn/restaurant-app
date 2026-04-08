import { useEffect, useState } from 'react';
import { getMyOrders, requestRefund, removeItemFromOrder, addItemToOrder, cancelOrder } from '../services/orderService';
import { getTodayMenu } from '../services/menuService';
import { Order, Menu, MenuItem } from '../types';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

interface RefundItem { menuItemId: string; name: string; maxQty: number; selectedQty: number; selected: boolean; }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundItems, setRefundItems] = useState<RefundItem[]>([]);
  const [refundReason, setRefundReason] = useState('');
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [todayMenu, setTodayMenu] = useState<Menu | null>(null);
  const [addingToOrderId, setAddingToOrderId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    getMyOrders()
      .then((data) => setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .finally(() => setLoading(false));
    getTodayMenu().then(setTodayMenu).catch(() => {});
  }, []);

  const startRefund = (order: Order) => {
    setRefundingId(order.id);
    setRefundReason('');
    setRefundItems(order.items.map(i => ({ menuItemId: i.menuItemId, name: i.name, maxQty: i.quantity, selectedQty: 1, selected: false })));
  };

  const handleRefund = async (orderId: string) => {
    if (!refundReason.trim()) return;
    const selected = refundItems.filter(i => i.selected);
    if (selected.length === 0) { alert('En az bir urun secin.'); return; }
    try {
      const updated = await requestRefund(orderId, refundReason, selected.map(i => ({ menuItemId: i.menuItemId, quantity: i.selectedQty })));
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setRefundingId(null);
      setRefundReason('');
      setRefundItems([]);
    } catch { alert('Iade talebi gonderilemedi.'); }
  };

  const handleRemoveItem = async (orderId: string, menuItemId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const item = order.items.find(i => i.menuItemId === menuItemId);
    const isLastItem = order.items.length === 1 && item?.quantity === 1;
    if (isLastItem) {
      if (!confirm('Son urunu kaldirirsiniz siparis iptal edilecek. Devam etmek istiyor musunuz?')) return;
      try { const updated = await cancelOrder(orderId); setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o))); } catch { alert('Siparis iptal edilemedi.'); }
      return;
    }
    try { const updated = await removeItemFromOrder(orderId, menuItemId); setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o))); } catch { alert('Islem basarisiz.'); }
  };

  const handleAddItem = async (orderId: string) => {
    if (!selectedItemId) return;
    try {
      const updated = await addItemToOrder(orderId, { menuItemId: selectedItemId, quantity: selectedQty });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setAddingToOrderId(null); setSelectedItemId(''); setSelectedQty(1);
    } catch { alert('Item eklenemedi.'); }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Siparisi iptal etmek istediginize emin misiniz?')) return;
    try { const updated = await cancelOrder(orderId); setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o))); } catch { alert('Siparis iptal edilemedi.'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Siparislerim</h1>
      {orders.length === 0 ? (
        <div className="card text-center py-16"><span className="text-5xl block mb-4">📋</span><p className="text-gray-500">Henuz siparisınız bulunmuyor.</p></div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div><p className="text-xs text-gray-400 font-mono">#{order.id.slice(-8).toUpperCase()}</p><p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('tr-TR')}</p></div>
                <StatusBadge status={order.status} />
              </div>

              <div className="space-y-1.5 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.name} x{item.quantity}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">TL{item.subtotal.toFixed(2)}</span>
                      {order.status === 'IN_PROGRESS' && (
                        <button onClick={() => handleRemoveItem(order.id, item.menuItemId)} className="w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 font-bold text-xs flex items-center justify-center">-</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-orange-500 text-lg">TL{order.totalPrice?.toFixed(2)}</span>
                  {order.discountApplied && order.discountApplied > 0 && (
                    <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">TL{order.discountApplied.toFixed(2)} indirim uygulandı</span>
                  )}
                </div>
                <div className="flex gap-3">
                  {order.status === 'IN_PROGRESS' && todayMenu && (
                    <button onClick={() => { setAddingToOrderId(order.id); setSelectedItemId(''); setSelectedQty(1); }} className="text-sm text-orange-500 hover:text-orange-600 font-medium">+ Ekle</button>
                  )}
                  {order.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleCancel(order.id)} className="text-sm text-red-500 hover:text-red-600 font-medium">Iptal Et</button>
                  )}
                  {order.status === 'DELIVERED' && (
                    <button onClick={() => startRefund(order)} className="text-sm text-orange-500 hover:text-orange-600 font-medium">Iade Talep Et</button>
                  )}
                </div>
              </div>

              {addingToOrderId === order.id && todayMenu && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <p className="text-sm font-medium text-gray-700">Eklenecek urun:</p>
                  <select className="input text-sm" value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
                    <option value="">Urun secin...</option>
                    {todayMenu.items.filter(i => i.available).map((item: MenuItem) => (
                      <option key={item.id} value={item.id}>{item.name} - TL{item.price.toFixed(2)}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Adet:</label>
                    <input type="number" min={1} max={10} value={selectedQty} onChange={(e) => setSelectedQty(parseInt(e.target.value))} className="input text-sm w-20" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddItem(order.id)} disabled={!selectedItemId} className="btn-primary text-sm py-1.5 flex-1 disabled:opacity-40">Ekle</button>
                    <button onClick={() => setAddingToOrderId(null)} className="btn-secondary text-sm py-1.5">Iptal</button>
                  </div>
                </div>
              )}

              {refundingId === order.id && (
                <div className="mt-3 pt-3 border-t space-y-3">
                  <p className="text-sm font-medium text-gray-700">Iade edilecek urunler:</p>
                  <div className="space-y-2">
                    {refundItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <input type="checkbox" checked={item.selected}
                          onChange={(e) => setRefundItems(prev => prev.map((r, i) => i === idx ? { ...r, selected: e.target.checked } : r))}
                          className="w-4 h-4 accent-orange-500" />
                        <span className="flex-1 text-gray-700">{item.name}</span>
                        {item.selected && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs">Adet:</span>
                            <input type="number" min={1} max={item.maxQty} value={item.selectedQty}
                              onChange={(e) => setRefundItems(prev => prev.map((r, i) => i === idx ? { ...r, selectedQty: Math.min(parseInt(e.target.value) || 1, item.maxQty) } : r))}
                              className="input text-xs w-16 py-1" />
                            <span className="text-gray-400 text-xs">/ {item.maxQty}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <textarea className="input text-sm resize-none" rows={2} placeholder="Iade gerekcesinizi yazin..." value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={() => handleRefund(order.id)} className="btn-primary text-sm py-1.5 flex-1">Gonder</button>
                    <button onClick={() => { setRefundingId(null); setRefundItems([]); }} className="btn-secondary text-sm py-1.5">Iptal</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
