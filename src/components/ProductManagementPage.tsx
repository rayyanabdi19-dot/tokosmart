import React, { useState } from 'react';
import { useApp, Product } from '@/context/AppContext';
import { ArrowLeft, Plus, Edit2, Trash2, X, Package, Camera } from 'lucide-react';

const emojiOptions = ['📱', '📶', '⚡', '📒', '🖊️', '✏️', '🧹', '💳', '🎮', '🛒', '🧴', '🍜', '☕', '🧊', '📦', '🎁'];
const categoryOptions = ['Pulsa', 'Paket Data', 'Token', 'ATK', 'E-Wallet', 'Voucher', 'Makanan', 'Minuman', 'Lainnya'];

const ProductManagementPage = () => {
  const { setCurrentPage, products, addProduct, updateProduct, deleteProduct } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);
  const [image, setImage] = useState(emojiOptions[0]);
  const [stock, setStock] = useState('99');
  const [filter, setFilter] = useState('All');

  const openNew = () => {
    setEditProduct(null);
    setName(''); setPrice(''); setCost(''); setCategory(categoryOptions[0]); setImage(emojiOptions[0]); setStock('99');
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setName(p.name); setPrice(p.price.toString()); setCost(p.cost.toString()); setCategory(p.category); setImage(p.image); setStock(p.stock.toString());
    setShowForm(true);
  };

  const handleSave = () => {
    const priceNum = parseInt(price) || 0;
    const costNum = parseInt(cost) || 0;
    const stockNum = parseInt(stock) || 0;
    if (!name || priceNum <= 0) return;

    if (editProduct) {
      updateProduct({ ...editProduct, name, price: priceNum, cost: costNum, category, image, stock: stockNum });
    } else {
      addProduct({ name, price: priceNum, cost: costNum, category, image, stock: stockNum });
    }
    setShowForm(false);
  };

  const cats = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-10 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setCurrentPage('admin-settings')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold text-foreground flex-1">Kelola Produk</h1>
          <button onClick={openNew} className="bg-primary text-primary-foreground p-2 rounded-xl"><Plus className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${filter === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border">
            <span className="text-2xl w-10 text-center">{p.image}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.category} • Stok: {p.stock}</p>
              <div className="flex gap-2 mt-0.5">
                <span className="text-xs font-bold text-primary">Jual: Rp {p.price.toLocaleString('id-ID')}</span>
                <span className="text-xs text-muted-foreground">Modal: Rp {p.cost.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button onClick={() => openEdit(p)} className="p-2 text-muted-foreground hover:text-primary"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => deleteProduct(p.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Belum ada produk</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40" onClick={() => setShowForm(false)}>
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">{editProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Foto/Ikon Produk</label>
                <div className="flex gap-2 flex-wrap">
                  {emojiOptions.map(e => (
                    <button key={e} onClick={() => setImage(e)} className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border ${image === e ? 'border-primary bg-primary/10' : 'border-border'}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama Produk</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama produk" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Harga Jual</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Harga Modal</label>
                  <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
                <div className="flex gap-2 flex-wrap">
                  {categoryOptions.map(c => (
                    <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Stok</label>
                <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <button onClick={handleSave} className="w-full mt-5 py-3.5 rounded-xl pos-gradient text-primary-foreground font-semibold shadow-lg">
              {editProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
