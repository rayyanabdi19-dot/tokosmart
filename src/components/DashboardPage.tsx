import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Clock, CreditCard, Megaphone, ExternalLink, ShoppingBag, Store, AlertTriangle, Calendar, Moon, Sun } from 'lucide-react';

const DashboardPage = () => {
  const { shift, setShowTransactionModal, setShowTopupModal, setSelectedTransaction, setShowReceiptModal, setCurrentPage, user } = useApp();
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkLicense = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      const { data } = await supabase.from('licenses').select('*').eq('user_id', authUser.id).single();
      if (data && (data as any).license_type === 'trial') {
        const expires = new Date((data as any).expires_at);
        const days = Math.max(0, Math.ceil((expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        if (days <= 7) setTrialDaysLeft(days);
      }
    };
    checkLicense();
  }, []);

  const totalSales = shift.transactions.filter(t => t.type === 'sale' || t.type === 'pos-sale').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = shift.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalTopups = shift.transactions.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const currentBalance = shift.openingBalance + totalSales + totalTopups - totalExpenses;

  const viewReceipt = (tx: typeof shift.transactions[0]) => {
    setSelectedTransaction(tx);
    setShowReceiptModal(true);
  };

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Store Info & Motif */}
      <div className="pos-gradient px-6 pt-12 pb-8 rounded-b-3xl relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary-foreground/5" />
        <div className="absolute top-8 right-20 w-16 h-16 rounded-full bg-primary-foreground/5" />

        <div className="relative z-10">
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
          </div>
          <p className="text-primary-foreground/70 text-xs mb-4 ml-[52px]">Welcome, {user?.name}</p>

          {/* Live Clock & Calendar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2.5 bg-primary-foreground/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-primary-foreground/80" />
              <div>
                <p className="text-primary-foreground text-lg font-bold tracking-wider font-mono leading-none">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2.5 bg-primary-foreground/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-primary-foreground/80" />
              <div>
                <p className="text-primary-foreground text-xs font-semibold leading-none">{dayNames[currentTime.getDay()]}</p>
                <p className="text-primary-foreground/70 text-[10px] mt-0.5">{currentTime.getDate()} {monthNames[currentTime.getMonth()]} {currentTime.getFullYear()}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-foreground/10 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-primary-foreground/70 text-xs mb-1">Current Balance</p>
            <p className="text-primary-foreground text-3xl font-bold">Rp {currentBalance.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Trial Warning */}
      {trialDaysLeft !== null && (
        <div className="px-6 mt-3">
          <button onClick={() => setCurrentPage('license')} className="w-full flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">
                {trialDaysLeft === 0 ? 'Trial telah berakhir!' : `Trial berakhir dalam ${trialDaysLeft} hari`}
              </p>
              <p className="text-xs text-muted-foreground">Ketuk untuk lihat detail lisensi</p>
            </div>
          </button>
        </div>
      )}

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
