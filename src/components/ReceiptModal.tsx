import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Receipt } from 'lucide-react';

const ReceiptModal = () => {
  const { showReceiptModal, setShowReceiptModal, selectedTransaction, user } = useApp();

  if (!showReceiptModal || !selectedTransaction) return null;

  const tx = selectedTransaction;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6" onClick={() => setShowReceiptModal(false)}>
      <div className="bg-card w-full max-w-sm rounded-2xl p-6 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Receipt</h2>
          </div>
          <button onClick={() => setShowReceiptModal(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="border-t border-dashed border-border pt-4 space-y-3">
          <div className="text-center">
            <p className="font-bold text-foreground">{user?.storeName}</p>
            <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString('id-ID')}</p>
          </div>

          <div className="border-t border-dashed border-border pt-3 space-y-2">
            <Row label="Type" value={tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} />
            <Row label="Description" value={tx.description} />
            <Row label="Category" value={tx.category} />
            <Row label="Payment" value={tx.paymentMethod} />
          </div>

          <div className="border-t border-dashed border-border pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">Rp {tx.amount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2">Thank you for your business!</p>
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
