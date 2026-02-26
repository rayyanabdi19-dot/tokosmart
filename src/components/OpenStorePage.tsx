import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Store, DollarSign } from 'lucide-react';

const OpenStorePage = () => {
  const { openShift, user } = useApp();
  const [balance, setBalance] = useState('');

  const handleOpen = () => {
    const amount = parseInt(balance.replace(/\D/g, '')) || 0;
    openShift(amount);
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    return num ? parseInt(num).toLocaleString('id-ID') : '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm text-center">
        <div className="w-20 h-20 rounded-3xl pos-gradient flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Store className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Open Shift</h1>
        <p className="text-muted-foreground text-sm mb-8">{user?.storeName} • {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="bg-card rounded-2xl p-6 border border-border mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block text-left">Opening Cash Balance</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp</span>
            <input
              type="text"
              value={balance}
              onChange={e => setBalance(formatCurrency(e.target.value))}
              placeholder="0"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-background text-foreground text-xl font-bold text-right focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <button
          onClick={handleOpen}
          className="w-full py-4 rounded-xl pos-gradient text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
        >
          Open Store
        </button>
      </div>
    </div>
  );
};

export default OpenStorePage;
