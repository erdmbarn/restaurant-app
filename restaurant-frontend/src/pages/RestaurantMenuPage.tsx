import { useState, useEffect } from 'react';
import { createMenu, updateMenu, deleteMenu, getMonthlyMenus } from '../services/menuService';
import { getAllProducts, createProduct, updateProduct, deleteProduct, Product } from '../services/productService';
import { Menu } from '../types';

const CATEGORIES = ['SOUP', 'MAIN_COURSE', 'SIDE_DISH', 'DESSERT', 'BEVERAGE', 'SALAD'];
const categoryLabels: Record<string, string> = {
  SOUP: 'Corba', MAIN_COURSE: 'Ana Yemek', SIDE_DISH: 'Yan Yemek',
  DESSERT: 'Tatli', BEVERAGE: 'Icecek', SALAD: 'Salata',
};
const MONTHS = ['Ocak','Subat','Mart','Nisan','Mayis','Haziran','Temmuz','Agustos','Eylul','Ekim','Kasim','Aralik'];

type Tab = 'manage' | 'create' | 'products';
interface ProductForm { name: string; description: string; price: string; category: string; available: boolean; }
const emptyProductForm = (): ProductForm => ({ name: '', description: '', price: '', category: 'MAIN_COURSE', available: true });

export default function RestaurantMenuPage() {
  const [tab, setTab] = useState<Tab>('manage');
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const [menus, setMenus] = useState<Menu[]>([]);
  const [manageLoading, setManageLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editSelectedIds, setEditSelectedIds] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');

  const [createDate, setCreateDate] = useState(new Date().toISOString().split('T')[0]);
  const [createSelectedIds, setCreateSelectedIds] = useState<string[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');
  const [createError, setCreateError] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm());
  const [productLoading, setProductLoading] = useState(false);
  const [productSuccess, setProductSuccess] = useState('');
  const [productError, setProductError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
  if (tab === 'manage') loadMenus();
}, [tab, selectedYear, selectedMonth]);
  useEffect(() => { if (tab === 'products' || tab === 'create') loadProducts(); }, [tab]);
  useEffect(() => { if (editingMenu) loadProducts(); }, [editingMenu]);

  const loadMenus = () => {
    setManageLoading(true);
    getMonthlyMenus(selectedYear, selectedMonth)
      .then((data) => setMenus(data.sort((a, b) => a.date.localeCompare(b.date))))
      .catch(() => setMenus([]))
      .finally(() => setManageLoading(false));
  };

  const loadProducts = () => {
    setProductsLoading(true);
    getAllProducts().then(setProducts).catch(() => {}).finally(() => setProductsLoading(false));
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  const toggleId = (id: string, ids: string[], setIds: (v: string[]) => void) =>
    setIds(ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createSelectedIds.length === 0) { setCreateError('En az bir urun secin.'); return; }
    setCreateLoading(true); setCreateError(''); setCreateSuccess('');
    try {
      await createMenu({ date: createDate, productIds: createSelectedIds });
      setCreateSuccess('Menu basariyla olusturuldu!');
      setCreateSelectedIds([]);
      loadMenus();
    } catch { setCreateError('Menu olusturulamadi. Bu tarih icin zaten menu var olabilir.'); }
    finally { setCreateLoading(false); }
  };

  const startEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setEditSuccess(''); setEditError('');
    // Mevcut menudeki urunleri product listesiyle eslestirelim (isim bazli)
    getAllProducts().then(prods => {
      const matchedIds = prods
        .filter(p => menu.items.some(i => i.name === p.name))
        .map(p => p.id);
      setEditSelectedIds(matchedIds);
      setProducts(prods);
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenu) return;
    setEditLoading(true); setEditError(''); setEditSuccess('');
    try {
      if (editSelectedIds.length === 0) {
        // Tum urunler kaldirildi - menuyu sil
        await deleteMenu(editingMenu.id);
        setEditingMenu(null);
        loadMenus();
        return;
      }
      await updateMenu(editingMenu.id, { date: editingMenu.date, productIds: editSelectedIds });
      setEditSuccess('Menu guncellendi!');
      loadMenus();
    } catch { setEditError('Islem basarisiz.'); }
    finally { setEditLoading(false); }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('Bu menuyu silmek istediginize emin misiniz?')) return;
    try { await deleteMenu(menuId); loadMenus(); } catch { alert('Menu silinemedi.'); }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductLoading(true); setProductError(''); setProductSuccess('');
    const data = { name: productForm.name, description: productForm.description, price: parseFloat(productForm.price), category: productForm.category, available: productForm.available };
    try {
      if (editingProduct) { await updateProduct(editingProduct.id, data); setProductSuccess('Urun guncellendi!'); }
      else { await createProduct(data); setProductSuccess('Urun olusturuldu!'); }
      setProductForm(emptyProductForm()); setEditingProduct(null); setShowProductForm(false);
      loadProducts();
    } catch { setProductError('Islem basarisiz.'); }
    finally { setProductLoading(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu urunu silmek istediginize emin misiniz?')) return;
    try { await deleteProduct(id); loadProducts(); } catch { alert('Urun silinemedi.'); }
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, description: p.description || '', price: p.price.toString(), category: p.category, available: p.available });
    setShowProductForm(true); setProductSuccess(''); setProductError('');
  };

  const groupByCategory = (prods: Product[]) =>
    prods.reduce((acc, p) => { if (!acc[p.category]) acc[p.category] = []; acc[p.category].push(p); return acc; }, {} as Record<string, Product[]>);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Menu Yonetimi</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {([['manage', 'Mevcut Menuler'], ['create', 'Yeni Menu Olustur'], ['products', 'Urun Yonetimi']] as const).map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); setEditingMenu(null); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${tab === key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* MEVCUT MENULER */}
      {tab === 'manage' && !editingMenu && (
        <div>
          <div className="flex gap-3 mb-6">
            <select className="input w-auto" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
            <select className="input w-auto" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {manageLoading ? <p className="text-gray-400 text-center py-12">Yukleniyor...</p>
          : menus.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-gray-500">{MONTHS[selectedMonth-1]} {selectedYear} icin menu yok.</p>
              <button onClick={() => setTab('create')} className="btn-primary mt-4 px-6 py-2">Menu Olustur</button>
            </div>
          ) : (
            <div className="space-y-4">
              {menus.map((menu) => (
                <div key={menu.id} className="card">
                  <div className="flex justify-between items-center mb-3">
                    <div><h3 className="font-semibold text-gray-800">{formatDate(menu.date)}</h3><p className="text-sm text-gray-400">{menu.items.length} urun</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(menu)} className="btn-primary text-sm py-1.5 px-4">Duzenle</button>
                      <button onClick={() => handleDeleteMenu(menu.id)} className="btn-danger text-sm py-1.5 px-4">Sil</button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {menu.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-600">
                        <span>{categoryLabels[item.category] || item.category} - {item.name}</span>
                        <span className="font-medium text-orange-500">TL{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MENU DUZENLE */}
      {tab === 'manage' && editingMenu && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setEditingMenu(null)} className="text-orange-500 font-medium text-sm">Geri</button>
            <h2 className="text-xl font-bold text-gray-800">{formatDate(editingMenu.date)} - Duzenle</h2>
          </div>
          <p className="text-sm text-gray-500 mb-3">Menude olmasini istediginiz urunleri secin. Hicbir urun secmezseniz menu silinir.</p>
          {productsLoading ? <p className="text-gray-400 text-center py-8">Yukleniyor...</p> : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                {Object.entries(groupByCategory(products)).map(([cat, prods]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">{categoryLabels[cat] || cat}</p>
                    <div className="space-y-1">
                      {prods.map(p => (
                        <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${editSelectedIds.includes(p.id) ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="checkbox" checked={editSelectedIds.includes(p.id)} onChange={() => toggleId(p.id, editSelectedIds, setEditSelectedIds)} className="w-4 h-4 accent-orange-500" />
                          <span className="flex-1 text-sm font-medium text-gray-800">{p.name}</span>
                          <span className="text-sm text-orange-500 font-medium">TL{p.price.toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">{editSelectedIds.length} urun secildi</p>
              {editSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">{editSuccess}</div>}
              {editError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">{editError}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditingMenu(null)} className="btn-secondary flex-1 py-3">Iptal</button>
                <button type="submit" className="btn-primary flex-1 py-3" disabled={editLoading}>
                  {editLoading ? 'Kaydediliyor...' : editSelectedIds.length === 0 ? 'Menuyu Sil' : 'Kaydet'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* YENI MENU OLUSTUR */}
      {tab === 'create' && (
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
            <input type="date" className="input" value={createDate} onChange={(e) => setCreateDate(e.target.value)} required />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Menude olmasini istediginiz urunleri secin:</p>
            {productsLoading ? <p className="text-gray-400 text-center py-8">Yukleniyor...</p> : products.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-500 mb-3">Henuz urun eklenmemis.</p>
                <button type="button" onClick={() => setTab('products')} className="btn-primary px-4 py-2 text-sm">Urun Ekle</button>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(groupByCategory(products)).map(([cat, prods]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">{categoryLabels[cat] || cat}</p>
                    <div className="space-y-1">
                      {prods.map(p => (
                        <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${createSelectedIds.includes(p.id) ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="checkbox" checked={createSelectedIds.includes(p.id)} onChange={() => toggleId(p.id, createSelectedIds, setCreateSelectedIds)} className="w-4 h-4 accent-orange-500" />
                          <span className="flex-1 text-sm font-medium text-gray-800">{p.name}</span>
                          <span className="text-sm text-orange-500 font-medium">TL{p.price.toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {createSelectedIds.length > 0 && <p className="text-sm text-gray-500">{createSelectedIds.length} urun secildi</p>}
          {createSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">{createSuccess}</div>}
          {createError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">{createError}</div>}
          <button type="submit" className="btn-primary w-full py-3 text-lg" disabled={createLoading}>{createLoading ? 'Olusturuluyor...' : 'Menuyu Olustur'}</button>
        </form>
      )}

      {/* URUN YONETIMI */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Urunler</h2>
            <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm(emptyProductForm()); setProductSuccess(''); setProductError(''); }}
              className="btn-primary px-4 py-2 text-sm">+ Yeni Urun</button>
          </div>
          {showProductForm && (
            <div className="card mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editingProduct ? 'Urunu Duzenle' : 'Yeni Urun Ekle'}</h3>
              <form onSubmit={handleProductSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-600 mb-1">Urun Adi *</label><input className="input" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} required /></div>
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-600 mb-1">Aciklama</label><input className="input" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Fiyat (TL) *</label><input type="number" step="0.01" min="0" className="input" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} required /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
                    <select className="input" value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" checked={productForm.available} onChange={(e) => setProductForm({...productForm, available: e.target.checked})} className="w-4 h-4 accent-orange-500" />
                    <label className="text-sm text-gray-600">Aktif</label>
                  </div>
                </div>
                {productSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">{productSuccess}</div>}
                {productError && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{productError}</div>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="btn-secondary flex-1 py-2">Iptal</button>
                  <button type="submit" className="btn-primary flex-1 py-2" disabled={productLoading}>{productLoading ? 'Kaydediliyor...' : editingProduct ? 'Guncelle' : 'Kaydet'}</button>
                </div>
              </form>
            </div>
          )}
          {productsLoading ? <p className="text-gray-400 text-center py-12">Yukleniyor...</p>
          : products.length === 0 ? <div className="card text-center py-16"><p className="text-gray-500">Henuz urun eklenmemis.</p></div>
          : (
            <div className="space-y-2">
              {Object.entries(groupByCategory(products)).map(([cat, prods]) => (
                <div key={cat}>
                  <p className="text-xs font-semibold text-gray-500 mb-1 mt-3 uppercase">{categoryLabels[cat] || cat}</p>
                  {prods.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 mb-1">
                      <div>
                        <span className={`font-medium text-sm ${!p.available ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{p.name}</span>
                        {p.description && <span className="text-xs text-gray-400 ml-2">{p.description}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500 font-medium text-sm">TL{p.price.toFixed(2)}</span>
                        <button onClick={() => startEditProduct(p)} className="text-xs text-blue-500 hover:text-blue-600">Duzenle</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-xs text-red-400 hover:text-red-600">Sil</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
