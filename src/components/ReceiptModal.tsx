import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Receipt, Printer, MessageCircle } from 'lucide-react';

const ReceiptModal = () => {
  const { showReceiptModal, setShowReceiptModal, selectedTransaction, user } = useApp();

  if (!showReceiptModal || !selectedTransaction) return null;

  const tx = selectedTransaction;

  const handlePrint = () => { window.print(); };

  const handleWhatsApp = () => {
    const lines = [
      `🧾 *STRUK PEMBAYARAN*`,
      `📍 ${user?.storeName}`,
      user?.storeAddress ? `📫 ${user.storeAddress}` : '',
      user?.storePhone ? `📞 ${user.storePhone}` : '',
      `📅 ${new Date(tx.timestamp).toLocaleString('id-ID')}`,
      `━━━━━━━━━━━━━━━━━━`,
      `${tx.description}`,
      `━━━━━━━━━━━━━━━━━━`,
      `*TOTAL: Rp ${tx.amount.toLocaleString('id-ID')}*`,
      `💳 Bayar: ${tx.paymentMethod}`,
      ...(tx.cashReceived ? [
        `💵 Tunai: Rp ${tx.cashReceived.toLocaleString('id-ID')}`,
        `💰 Kembalian: Rp ${(tx.changeAmount || 0).toLocaleString('id-ID')}`,
      ] : []),
      ``,
      `Terima kasih! 🙏`,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6" onClick={() => setShowReceiptModal(false)}>
      <div className="bg-card w-full max-w-sm rounded-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="pos-gradient p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary-foreground" />
            <h2 className="text-sm font-bold text-primary-foreground">Receipt</h2>
          </div>
          <button onClick={() => setShowReceiptModal(false)} className="text-primary-foreground/70"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5">
          <div className="text-center mb-3">
            <p className="font-bold text-foreground">{user?.storeName}</p>
            {user?.storeAddress && <p className="text-xs text-muted-foreground">{user.storeAddress}</p>}
            {user?.storePhone && <p className="text-xs text-muted-foreground">📞 {user.storePhone}</p>}
            <p className="text-xs text-muted-foreground mt-1">{new Date(tx.timestamp).toLocaleString('id-ID')}</p>
          </div>

          <div className="border-t border-dashed border-border pt-3 space-y-2">
            <Row label="Type" value={tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} />
            <Row label="Description" value={tx.description} />
            <Row label="Category" value={tx.category} />
            <Row label="Payment" value={tx.paymentMethod} />
          </div>

          {tx.items && tx.items.length > 0 && (
            <div className="border-t border-dashed border-border pt-3 mt-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Items:</p>
              {tx.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-foreground">{item.product.name} x{item.qty}</span>
                  <span className="text-foreground">Rp {(item.product.price * item.qty).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-dashed border-border pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">Rp {tx.amount.toLocaleString('id-ID')}</span>
            </div>
            {tx.cashReceived && (
              <>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Tunai</span>
                  <span className="text-foreground">Rp {tx.cashReceived.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="font-semibold text-success">Kembalian</span>
                  <span className="font-bold text-success">Rp {(tx.changeAmount || 0).toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground pt-3">Terima kasih! 🙏</p>
        </div>

        <div className="px-5 pb-5 grid grid-cols-2 gap-2">
          <button onClick={handlePrint} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Printer className="w-4 h-4" /> Cetak
          </button>
          <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-xs font-medium text-foreground capitalize">{value}</span>
  </div>
);

export default ReceiptModal;
