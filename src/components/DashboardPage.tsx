import React from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Clock, CreditCard, Megaphone, ExternalLink, ShoppingBag, Store } from 'lucide-react';

const DashboardPage = () => {
  const { shift, setShowTransactionModal, setShowTopupModal, setSelectedTransaction, setShowReceiptModal, setCurrentPage, user } = useApp();

  const totalSales = shift.transactions.filter(t => t.type === 'sale' || t.type === 'pos-sale').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = shift.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalTopups = shift.transactions.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const currentBalance = shift.openingBalance + totalSales + totalTopups - totalExpenses;

  const viewReceipt = (tx: typeof shift.transactions[0]) => {
    setSelectedTransaction(tx);
    setShowReceiptModal(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Store Info */}
      <div className="pos-gradient px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-primary-foreground text-lg font-bold">{user?.storeName || 'Profil Toko'}</h1>
              {user?.storeAddress && <p className="text-primary-foreground/60 text-[10px]">{user.storeAddress}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-foreground/20 rounded-full px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-primary-foreground" />
            <span className="text-primary-foreground text-xs font-medium">
              {shift.openedAt ? new Date(shift.openedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </span>
          </div>
        </div>
        <p className="text-primary-foreground/70 text-xs mb-4 ml-[52px]">Welcome, {user?.name}</p>

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

      {/* Promo Banner */}
      <div className="px-6 mt-5">
        <a href="https://bmri.id/reflivin?af_adset=MGM7MLZ6LS&deep_link_sub1=null&deep_link_sub2=MGM7MLZ6LS" target="_blank" rel="noopener noreferrer"
          className="block bg-gradient-to-r from-primary to-accent rounded-2xl p-4 border border-primary/20 overflow-hidden relative">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-4 h-4 text-primary-foreground" />
            <span className="text-xs font-bold text-primary-foreground uppercase tracking-wide">Promo</span>
            <ExternalLink className="w-3 h-3 text-primary-foreground/70 ml-auto" />
          </div>
          <div className="overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-sm font-semibold text-primary-foreground">
                🎉 Yuk, pakai Livin' by Mandiri! Download di sini 👉 bmri.id/reflivin • Kode referral: MGM7MLZ6LS • FAQ: bmri.id/livinmgm • Daftar Mandiri Agen: bmri.id/join-mandiriagen • 🎁 Program Welcome Gift Mandiri Agen 👉 bankmandiri.co.id/program-welcome-gift-mandiri-agen • Layanan setor, tarik tunai, transfer & pembayaran tagihan! • Bank Mandiri berizin & diawasi OJK dan Bank Indonesia 🏦
              </span>
            </div>
          </div>
        </a>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setCurrentPage('pos')} className="flex flex-col items-center gap-2 bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl pos-gradient flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-xs font-semibold text-foreground">Kasir Toko</p>
          </button>
          <button onClick={() => setShowTransactionModal(true)} className="flex flex-col items-center gap-2 bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center">
              <Plus className="w-5 h-5 text-success-foreground" />
            </div>
            <p className="text-xs font-semibold text-foreground">New Sale</p>
          </button>
          <button onClick={() => setShowTopupModal(true)} className="flex flex-col items-center gap-2 bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-accent-foreground" />
            </div>
            <p className="text-xs font-semibold text-foreground">Top-up</p>
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
                  tx.type === 'sale' || tx.type === 'pos-sale' ? 'bg-success/10' : tx.type === 'topup' ? 'bg-accent/10' : 'bg-destructive/10'
                }`}>
                  {tx.type === 'sale' || tx.type === 'pos-sale' ? <ArrowDownLeft className="w-4 h-4 text-success" /> :
                   tx.type === 'topup' ? <Wallet className="w-4 h-4 text-accent" /> :
                   <ArrowUpRight className="w-4 h-4 text-destructive" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
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
