import React, { useState, useCallback } from 'react';
import { useApp, Product, CartItem } from '@/context/AppContext';
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, X, Printer, MessageCircle, ScanLine } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';

const categories = ['All', 'Pulsa', 'Paket Data', 'Token', 'ATK', 'E-Wallet', 'Voucher'];

const POSPage = () => {
  const { setCurrentPage, products, cart, addToCart, removeFromCart, updateCartQty, clearCart, addTransaction, user } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'e-wallet'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [showPosReceipt, setShowPosReceipt] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{ items: CartItem[]; total: number; payment: string; id: string; date: Date; cashReceived: number; change: number } | null>(null);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const changeAmount = paymentMethod === 'cash' ? Math.max(0, cashReceivedNum - cartTotal) : 0;

  const handleBarcodeScan = useCallback((code: string) => {
    setShowScanner(false);
    const product = products.find(p => p.barcode === code || p.id === code || p.name.toLowerCase().includes(code.toLowerCase()));
    if (product) {
      addToCart(product);
    } else {
      setSearch(code);
    }
  }, [products, addToCart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'cash' && cashReceivedNum < cartTotal) return;

    const txData = {
      type: 'pos-sale' as const,
      amount: cartTotal,
      description: cart.map(c => `${c.product.name} x${c.qty}`).join(', '),
      category: 'POS Sale',
      paymentMethod,
      items: [...cart],
      cashReceived: paymentMethod === 'cash' ? cashReceivedNum : undefined,
      changeAmount: paymentMethod === 'cash' ? changeAmount : undefined,
    };
    addTransaction(txData);
    setLastTransaction({
      items: [...cart], total: cartTotal, payment: paymentMethod,
      id: Date.now().toString(), date: new Date(),
      cashReceived: cashReceivedNum, change: changeAmount,
    });
    clearCart();
    setCashReceived('');
    setShowCheckout(false);
    setShowPosReceipt(true);
  };

  const handlePrint = () => window.print();

  const handleWhatsApp = () => {
    if (!lastTransaction) return;
    const lines = [
      `🧾 *STRUK PEMBAYARAN*`,
      `📍 ${user?.storeName}`,
      user?.storeAddress ? `📫 ${user.storeAddress}` : '',
      user?.storePhone ? `📞 ${user.storePhone}` : '',
      `📅 ${lastTransaction.date.toLocaleString('id-ID')}`,
      `━━━━━━━━━━━━━━━━━━`,
      ...lastTransaction.items.map(i => `${i.product.name} x${i.qty} = Rp ${(i.product.price * i.qty).toLocaleString('id-ID')}`),
      `━━━━━━━━━━━━━━━━━━`,
      `*TOTAL: Rp ${lastTransaction.total.toLocaleString('id-ID')}*`,
      `💳 Bayar: ${lastTransaction.payment}`,
      ...(lastTransaction.payment === 'cash' ? [
        `💵 Tunai: Rp ${lastTransaction.cashReceived.toLocaleString('id-ID')}`,
        `💰 Kembalian: Rp ${lastTransaction.change.toLocaleString('id-ID')}`,
      ] : []),
      ``,
      `Terima kasih! 🙏`,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const quickCash = [cartTotal, Math.ceil(cartTotal / 10000) * 10000, Math.ceil(cartTotal / 50000) * 50000, 100000].filter((v, i, a) => a.indexOf(v) === i && v >= cartTotal);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Store Info */}
      <div className="px-4 pt-10 pb-3 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => setCurrentPage('dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{user?.storeName || 'Kasir Toko'}</h1>
            {user?.storeAddress && <p className="text-[10px] text-muted-foreground">{user.storeAddress}</p>}
          </div>
          <button onClick={() => setShowScanner(true)} className="p-2 bg-accent rounded-xl text-accent-foreground">
            <ScanLine className="w-5 h-5" />
          </button>
          <button onClick={() => setShowCheckout(true)} className="relative p-2 bg-primary rounded-xl text-primary-foreground">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </div>
        {/* Search */}
        <div className="relative mb-3 mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk atau scan barcode..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-2.5">
          {filtered.map(p => {
            const inCart = cart.find(c => c.product.id === p.id);
            return (
              <button key={p.id} onClick={() => addToCart(p)} className="bg-card rounded-xl border border-border p-3 text-center hover:border-primary/40 transition-colors relative">
                <div className="text-2xl mb-1">{p.image}</div>
                <p className="text-[11px] font-medium text-foreground leading-tight line-clamp-2">{p.name}</p>
                <p className="text-[10px] font-bold text-primary mt-1">Rp {p.price.toLocaleString('id-ID')}</p>
                {inCart && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">{inCart.qty}</span>
                )}
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Produk tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* Cart Summary Bar */}
      {cartCount > 0 && !showCheckout && (
        <div className="px-4 pb-4 pt-2 bg-card border-t border-border">
          <button onClick={() => setShowCheckout(true)} className="w-full pos-gradient text-primary-foreground rounded-xl py-3.5 font-semibold flex items-center justify-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            Checkout ({cartCount} item) — Rp {cartTotal.toLocaleString('id-ID')}
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40" onClick={() => setShowCheckout(false)}>
          <div className="bg-card w-full max-w-lg rounded-t-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.map(c => (
                <div key={c.product.id} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                  <span className="text-xl">{c.product.image}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{c.product.name}</p>
                    <p className="text-xs text-muted-foreground">Rp {c.product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQty(c.product.id, c.qty - 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-sm font-semibold text-foreground w-6 text-center">{c.qty}</span>
                    <button onClick={() => updateCartQty(c.product.id, c.qty + 1)} className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                    <button onClick={() => removeFromCart(c.product.id)} className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center ml-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-10">
                  <ShoppingCart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Keranjang kosong</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Metode Pembayaran</p>
                  <div className="flex gap-2">
                    {([
                      { key: 'cash', icon: Banknote, label: 'Cash' },
                      { key: 'card', icon: CreditCard, label: 'Card' },
                      { key: 'e-wallet', icon: Smartphone, label: 'E-Wallet' },
                    ] as const).map(m => (
                      <button key={m.key} onClick={() => setPaymentMethod(m.key)} className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${paymentMethod === m.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <m.icon className="w-3.5 h-3.5" />{m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash received input */}
                {paymentMethod === 'cash' && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Uang Diterima</p>
                    <input
                      type="number" value={cashReceived} onChange={e => setCashReceived(e.target.value)}
                      placeholder={`Min. Rp ${cartTotal.toLocaleString('id-ID')}`}
                      className="w-full py-2.5 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex gap-2 mt-2">
                      {quickCash.slice(0, 4).map(v => (
                        <button key={v} onClick={() => setCashReceived(v.toString())}
                          className="flex-1 py-1.5 rounded-lg bg-muted text-muted-foreground text-[10px] font-medium hover:bg-primary/10 transition-colors">
                          Rp {v.toLocaleString('id-ID')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-xl font-bold text-foreground">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  {paymentMethod === 'cash' && cashReceivedNum > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Tunai</span>
                        <span className="text-sm font-medium text-foreground">Rp {cashReceivedNum.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-success">Kembalian</span>
                        <span className="text-lg font-bold text-success">Rp {changeAmount.toLocaleString('id-ID')}</span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={paymentMethod === 'cash' && cashReceivedNum < cartTotal}
                  className="w-full pos-gradient text-primary-foreground rounded-xl py-3.5 font-semibold shadow-lg disabled:opacity-50">
                  Bayar Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POS Receipt Modal */}
      {showPosReceipt && lastTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setShowPosReceipt(false)}>
          <div className="bg-card w-full max-w-sm rounded-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="pos-gradient p-4 text-center">
              <p className="text-primary-foreground text-sm font-bold">✅ Pembayaran Berhasil!</p>
            </div>
            <div className="p-5" id="pos-receipt">
              <div className="text-center mb-3">
                <p className="font-bold text-foreground text-lg">{user?.storeName}</p>
                {user?.storeAddress && <p className="text-xs text-muted-foreground">{user.storeAddress}</p>}
                {user?.storePhone && <p className="text-xs text-muted-foreground">📞 {user.storePhone}</p>}
                <p className="text-xs text-muted-foreground mt-1">{lastTransaction.date.toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted-foreground">No: {lastTransaction.id}</p>
              </div>
              <div className="border-t border-dashed border-border my-3" />
              {lastTransaction.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{item.product.name} x{item.qty}</span>
                  <span className="font-medium text-foreground">Rp {(item.product.price * item.qty).toLocaleString('id-ID')}</span>
                </div>
              ))}
              <div className="border-t border-dashed border-border my-3" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">TOTAL</span>
                <span className="text-xl font-bold text-primary">Rp {lastTransaction.total.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right capitalize">Bayar: {lastTransaction.payment}</p>
              {lastTransaction.payment === 'cash' && (
                <>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Tunai</span>
                    <span className="text-foreground">Rp {lastTransaction.cashReceived.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-semibold text-success">Kembalian</span>
                    <span className="font-bold text-success">Rp {lastTransaction.change.toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
              <div className="border-t border-dashed border-border my-3" />
              <p className="text-center text-xs text-muted-foreground">Terima kasih atas kunjungan Anda! 🙏</p>
            </div>
            <div className="px-5 pb-5 grid grid-cols-2 gap-2">
              <button onClick={handlePrint} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setShowPosReceipt(false)} className="w-full py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Scanner */}
      {showScanner && <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
};

export default POSPage;
