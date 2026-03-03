
import React from 'react';
import { useApp } from '@/context/AppContext';
import { AlertTriangle, Crown } from 'lucide-react';

const ExpiredOverlay = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Trial Telah Berakhir</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Masa trial 30 hari Anda telah habis. Upgrade ke Premium untuk melanjutkan menggunakan semua fitur KasirPro.
        </p>
        <button
          onClick={() => setCurrentPage('upgrade')}
          className="w-full py-3.5 rounded-xl pos-gradient text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 mb-3"
        >
          <Crown className="w-4 h-4" />
          Upgrade ke Premium
        </button>
        <button
          onClick={() => setCurrentPage('license')}
          className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm"
        >
          Lihat Detail Lisensi
        </button>
      </div>
    </div>
  );
};

export default ExpiredOverlay;
