
import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Check, Crown, Zap, Star } from 'lucide-react';

const plans = [
  {
    id: 'monthly',
    name: 'Bulanan',
    price: 25999,
    period: '/bulan',
    features: ['Semua fitur POS', 'Manajemen produk', 'Laporan penjualan', 'Buku kas', 'Struk digital'],
    icon: Zap,
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Tahunan',
    price: 399000,
    period: '/tahun',
    savings: 'Hemat Rp 189.000',
    features: ['Semua fitur Bulanan', 'Prioritas support', 'Backup otomatis', 'Multi perangkat', 'Laporan lanjutan'],
    icon: Crown,
    popular: true,
  },
  {
    id: 'lifetime',
    name: 'Selamanya',
    price: 799000,
    period: 'sekali bayar',
    features: ['Semua fitur Tahunan', 'Update selamanya', 'Support prioritas', 'Fitur eksklusif', 'Tanpa biaya lagi'],
    icon: Star,
    popular: false,
  },
];

const UpgradePage = () => {
  const { setCurrentPage } = useApp();

  const handleSelect = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    const msg = `Halo, saya ingin upgrade ke paket ${plan?.name} (Rp ${plan?.price.toLocaleString('id-ID')}${plan?.period}) KasirPro`;
    window.open(`https://wa.me/6282186371356?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCurrentPage('license')} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Upgrade Premium</h1>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl pos-gradient flex items-center justify-center mx-auto mb-3">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Pilih Paket Premium</h2>
          <p className="text-sm text-muted-foreground mt-1">Akses semua fitur tanpa batas</p>
        </div>

        <div className="space-y-4">
          {plans.map(plan => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-5 border transition-all ${
                  plan.popular
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                    Populer
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{plan.name}</p>
                    {plan.savings && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {plan.savings}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">Rp {plan.price.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-muted-foreground">{plan.period}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <p className="text-sm text-foreground">{f}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelect(plan.id)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.popular
                      ? 'pos-gradient text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-accent'
                  }`}
                >
                  Pilih {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Pembayaran diproses via WhatsApp. Lisensi diaktifkan dalam 1x24 jam.
        </p>
      </div>
    </div>
  );
};

export default UpgradePage;
