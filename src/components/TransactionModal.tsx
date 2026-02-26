import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X } from 'lucide-react';

const categories = ['Food & Beverage', 'Retail', 'Service', 'Other'];
const paymentMethods = ['cash', 'card', 'e-wallet'] as const;

const TransactionModal = () => {
  const { showTransactionModal, setShowTransactionModal, addTransaction } = useApp();
  const [type, setType] = useState<'sale' | 'expense'>('sale');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [payment, setPayment] = useState<typeof paymentMethods[number]>('cash');

  if (!showTransactionModal) return null;

  const handleSubmit = () => {
    const num = parseInt(amount.replace(/\D/g, '')) || 0;
    if (num <= 0) return;
    addTransaction({ type, amount: num, description: description || type, category, paymentMethod: payment });
    setAmount(''); setDescription(''); setShowTransactionModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40" onClick={() => setShowTransactionModal(false)}>
      <div className="bg-card w-full max-w-lg rounded-t-3xl p-6 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">New Transaction</h2>
          <button onClick={() => setShowTransactionModal(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-2 mb-4">
          {(['sale', 'expense'] as const).map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${type === t ? 'pos-gradient text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {t === 'sale' ? 'Sale' : 'Expense'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
              <input type="text" value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, '') ? parseInt(e.target.value.replace(/\D/g, '')).toLocaleString('id-ID') : '')}
                placeholder="0" className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground text-lg font-bold text-right focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Coffee order"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Payment</label>
            <div className="flex gap-2">
              {paymentMethods.map(m => (
                <button key={m} onClick={() => setPayment(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${payment === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full mt-5 py-3.5 rounded-xl pos-gradient text-primary-foreground font-semibold shadow-lg">
          Record {type === 'sale' ? 'Sale' : 'Expense'}
        </button>
      </div>
    </div>
  );
};

export default TransactionModal;
