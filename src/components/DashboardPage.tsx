import React from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Clock, CreditCard } from 'lucide-react';

const DashboardPage = () => {
  const { shift, setShowTransactionModal, setShowTopupModal, setSelectedTransaction, setShowReceiptModal, user } = useApp();

  const totalSales = shift.transactions.filter(t => t.type === 'sale').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = shift.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalTopups = shift.transactions.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const currentBalance = shift.openingBalance + totalSales + totalTopups - totalExpenses;

  const viewReceipt = (tx: typeof shift.transactions[0]) => {
    setSelectedTransaction(tx);
    setShowReceiptModal(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="pos-gradient px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-sm">Welcome back,</p>
            <h1 className="text-primary-foreground text-lg font-bold">{user?.name}</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-foreground/20 rounded-full px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-primary-foreground" />
            <span className="text-primary-foreground text-xs font-medium">
              {shift.openedAt ? new Date(shift.openedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </span>
          </div>
        </div>

        <div className="bg-primary-foreground/10 rounded-2xl p-5 backdrop-blur-sm">
          <p className="text-primary-foreground/70 text-xs mb-1">Current Balance</p>
          <p className="text-primary-foreground text-3xl font-bold">Rp {currentBalance.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
              <ArrowDownLeft className="w-4 h-4 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Sales</p>
            <p className="text-sm font-bold text-foreground">Rp {totalSales.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <ArrowUpRight className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-sm font-bold text-foreground">Rp {totalExpenses.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
              <Wallet className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Top-ups</p>
            <p className="text-sm font-bold text-foreground">Rp {totalTopups.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowTransactionModal(true)} className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl pos-gradient flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">New Sale</p>
              <p className="text-xs text-muted-foreground">Record transaction</p>
            </div>
          </button>
          <button onClick={() => setShowTopupModal(true)} className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Top-up</p>
              <p className="text-xs text-muted-foreground">Add cash balance</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 mt-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Transactions</h2>
        {shift.transactions.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 border border-border text-center">
            <TrendingUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/70">Start by recording a sale</p>
          </div>
        ) : (
          <div className="space-y-2">
            {shift.transactions.slice(0, 10).map(tx => (
              <button key={tx.id} onClick={() => viewReceipt(tx)} className="w-full flex items-center gap-3 bg-card rounded-xl p-3.5 border border-border hover:border-primary/20 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  tx.type === 'sale' ? 'bg-success/10' : tx.type === 'topup' ? 'bg-accent/10' : 'bg-destructive/10'
                }`}>
                  {tx.type === 'sale' ? <ArrowDownLeft className="w-4 h-4 text-success" /> :
                   tx.type === 'topup' ? <Wallet className="w-4 h-4 text-accent" /> :
                   <ArrowUpRight className="w-4 h-4 text-destructive" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <p className={`text-sm font-semibold ${tx.type === 'expense' ? 'text-destructive' : 'text-success'}`}>
                  {tx.type === 'expense' ? '-' : '+'}Rp {tx.amount.toLocaleString('id-ID')}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
