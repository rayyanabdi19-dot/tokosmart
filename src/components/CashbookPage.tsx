import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowDownLeft, ArrowUpRight, Wallet, BookOpen } from 'lucide-react';

const CashbookPage = () => {
  const { shift } = useApp();

  const totalIn = shift.transactions.filter(t => t.type === 'sale' || t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const totalOut = shift.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <h1 className="text-xl font-bold text-foreground mb-1">Cashbook</h1>
        <p className="text-sm text-muted-foreground mb-6">Today's cash flow</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-success/5 rounded-2xl p-4 border border-success/20">
            <p className="text-xs text-success font-medium mb-1">Cash In</p>
            <p className="text-lg font-bold text-foreground">Rp {totalIn.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-destructive/5 rounded-2xl p-4 border border-destructive/20">
            <p className="text-xs text-destructive font-medium mb-1">Cash Out</p>
            <p className="text-lg font-bold text-foreground">Rp {totalOut.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {shift.transactions.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No entries yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {shift.transactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 bg-card rounded-xl p-3.5 border border-border">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  tx.type === 'expense' ? 'bg-destructive/10' : 'bg-success/10'
                }`}>
                  {tx.type === 'expense' ? <ArrowUpRight className="w-4 h-4 text-destructive" /> :
                   tx.type === 'topup' ? <Wallet className="w-4 h-4 text-success" /> :
                   <ArrowDownLeft className="w-4 h-4 text-success" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.category} • {tx.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === 'expense' ? 'text-destructive' : 'text-success'}`}>
                    {tx.type === 'expense' ? '-' : '+'}Rp {tx.amount.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashbookPage;
