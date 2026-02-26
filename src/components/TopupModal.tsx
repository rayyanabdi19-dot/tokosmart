import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X } from 'lucide-react';

const TopupModal = () => {
  const { showTopupModal, setShowTopupModal, addTransaction } = useApp();
  const [amount, setAmount] = useState('');

  if (!showTopupModal) return null;

  const handleSubmit = () => {
    const num = parseInt(amount.replace(/\D/g, '')) || 0;
    if (num <= 0) return;
    addTransaction({ type: 'topup', amount: num, description: 'Cash Top-up', category: 'Top-up', paymentMethod: 'cash' });
    setAmount(''); setShowTopupModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40" onClick={() => setShowTopupModal(false)}>
      <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">Cash Top-up</h2>
          <button onClick={() => setShowTopupModal(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
            <input type="text" value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, '') ? parseInt(e.target.value.replace(/\D/g, '')).toLocaleString('id-ID') : '')}
              placeholder="0" className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground text-lg font-bold text-right focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {[50000, 100000, 200000, 500000].map(v => (
            <button key={v} onClick={() => setAmount(v.toLocaleString('id-ID'))}
              className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-primary/10 transition-colors">
              {(v / 1000)}K
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} className="w-full mt-5 py-3.5 rounded-xl pos-gradient text-primary-foreground font-semibold shadow-lg">
          Add Top-up
        </button>
      </div>
    </div>
  );
};

export default TopupModal;
