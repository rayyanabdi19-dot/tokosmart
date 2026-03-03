
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface License {
  id: string;
  license_type: string;
  started_at: string;
  expires_at: string;
  is_active: boolean;
}

const LicensePage = () => {
  const { setCurrentPage } = useApp();
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLicense();
  }, []);

  const fetchLicense = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setLicense(data as License);
    } else {
      // Create trial license for existing users
      const { data: newLicense } = await supabase
        .from('licenses')
        .insert({ user_id: user.id, license_type: 'trial' })
        .select()
        .single();
      if (newLicense) setLicense(newLicense as License);
    }
    setLoading(false);
  };

  const now = new Date();
  const expiresAt = license ? new Date(license.expires_at) : null;
  const startedAt = license ? new Date(license.started_at) : null;
  const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const totalDays = startedAt && expiresAt ? Math.ceil((expiresAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)) : 30;
  const progress = totalDays > 0 ? Math.min(100, Math.max(0, ((totalDays - daysLeft) / totalDays) * 100)) : 0;
  const isExpired = daysLeft === 0;
  const isTrial = license?.license_type === 'trial';

  const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCurrentPage('account')} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Lisensi</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-xl pos-gradient animate-pulse" />
          </div>
        ) : (
          <>
            {/* Status Card */}
            <div className={`rounded-2xl p-5 border mb-6 ${isExpired ? 'bg-destructive/5 border-destructive/20' : isTrial ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isExpired ? 'bg-destructive/10' : isTrial ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                  {isExpired ? <AlertTriangle className="w-6 h-6 text-destructive" /> : isTrial ? <Clock className="w-6 h-6 text-amber-500" /> : <CheckCircle className="w-6 h-6 text-emerald-500" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {isExpired ? 'Trial Berakhir' : isTrial ? 'Masa Trial' : 'Premium'}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isExpired ? 'bg-destructive/10 text-destructive' : isTrial ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                    {isExpired ? 'Expired' : isTrial ? `${daysLeft} hari tersisa` : 'Aktif'}
                  </span>
                </div>
              </div>

              {isTrial && !isExpired && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-card rounded-2xl p-4 border border-border mb-6 space-y-3">
              <p className="text-sm font-semibold text-foreground mb-2">Detail Lisensi</p>
              <DetailRow label="Tipe" value={isTrial ? 'Trial (30 Hari)' : 'Premium'} />
              <DetailRow label="Mulai" value={startedAt ? formatDate(startedAt) : '-'} />
              <DetailRow label="Berakhir" value={expiresAt ? formatDate(expiresAt) : '-'} />
              <DetailRow label="Status" value={isExpired ? 'Expired' : 'Aktif'} />
            </div>

            {/* Info */}
            <div className="bg-card rounded-2xl p-4 border border-border space-y-2">
              <p className="text-sm font-semibold text-foreground mb-2">Fitur Trial</p>
              {['Semua fitur POS', 'Manajemen produk', 'Laporan penjualan', 'Buku kas', 'Struk digital'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm text-foreground">{f}</p>
                </div>
              ))}
            </div>

            {(isExpired || isTrial) && (
              <a
                href="https://wa.me/6282186371356?text=Halo%2C%20saya%20ingin%20upgrade%20lisensi%20KasirPro"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-6 py-3.5 rounded-xl pos-gradient text-center text-primary-foreground font-semibold text-sm"
              >
                {isExpired ? 'Perpanjang Lisensi' : 'Upgrade ke Premium'}
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default LicensePage;
