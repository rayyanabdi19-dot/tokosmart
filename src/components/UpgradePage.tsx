
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Check, Crown, Zap, Star, KeyRound, Loader2 } from 'lucide-react';

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
  const { setCurrentPage, addNotification } = useApp();
  const [licenseCode, setLicenseCode] = useState('');
  const [activating, setActivating] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleSelect = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    const msg = `Halo, saya ingin upgrade ke paket ${plan?.name} (Rp ${plan?.price.toLocaleString('id-ID')}${plan?.period}) KasirPro`;
    window.open(`https://wa.me/6282186371356?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleActivateCode = async () => {
    const code = licenseCode.trim();
    if (!code || code.length < 4) {
      addNotification('Masukkan kode lisensi yang valid', 'error');
      return;
    }
    setActivating(true);
    try {
      const { data, error } = await supabase.functions.invoke('activate-license', {
        body: { code },
      });
      if (error) throw error;
      if (data?.error) {
        addNotification(data.error, 'error');
      } else {
        addNotification('Lisensi premium berhasil diaktifkan! 🎉', 'success');
        setLicenseCode('');
        setShowCodeInput(false);
        setTimeout(() => setCurrentPage('license'), 1500);
      }
    } catch (err: any) {
      addNotification(err.message || 'Gagal mengaktifkan kode', 'error');
    } finally {
      setActivating(false);
    }
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

        {/* Activate License Code Section */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Punya Kode Lisensi?</p>
              <p className="text-xs text-muted-foreground">Aktifkan langsung tanpa WhatsApp</p>
            </div>
            {!showCodeInput && (
              <button
                onClick={() => setShowCodeInput(true)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                Aktifkan
              </button>
            )}
          </div>

          {showCodeInput && (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={licenseCode}
                onChange={e => setLicenseCode(e.target.value.toUpperCase())}
                placeholder="Masukkan kode lisensi"
                maxLength={50}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-center font-mono text-lg tracking-widest placeholder:text-muted-foreground placeholder:tracking-normal placeholder:font-sans placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowCodeInput(false); setLicenseCode(''); }}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleActivateCode}
                  disabled={activating || licenseCode.trim().length < 4}
                  className="flex-1 py-3 rounded-xl pos-gradient text-primary-foreground font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {activating ? 'Memproses...' : 'Aktivasi'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-6">
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
          Pembayaran diproses via WhatsApp. Atau gunakan kode lisensi di atas.
        </p>
      </div>
    </div>
  );
};

export default UpgradePage;
