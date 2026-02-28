import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Code, Heart, Store, Users } from 'lucide-react';

const AboutDeveloperPage = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-12 pb-10">
        <button onClick={() => setCurrentPage('account')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl pos-gradient flex items-center justify-center mb-4 shadow-lg">
            <Store className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">KasirPro</h1>
          <p className="text-muted-foreground text-sm mt-1">Point of Sale System</p>
          <span className="mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">v1.0.0</span>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Code className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Tentang Aplikasi</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              KasirPro adalah aplikasi Point of Sale (POS) yang dirancang khusus untuk UMKM Indonesia. Dengan fitur lengkap seperti manajemen produk, pencatatan transaksi, laporan penjualan, dan barcode scanner, KasirPro membantu Anda mengelola bisnis dengan lebih efisien.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Fitur Utama</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Kasir POS dengan barcode scanner</li>
              <li>✅ Manajemen produk & stok</li>
              <li>✅ Laporan penjualan & laba rugi</li>
              <li>✅ Cetak struk & kirim WhatsApp</li>
              <li>✅ Multi payment (Cash, Card, E-Wallet)</li>
              <li>✅ Data tersimpan permanen di cloud</li>
            </ul>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-destructive" />
              <h2 className="font-semibold text-foreground">Dibuat Untuk UMKM</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Aplikasi ini dikembangkan dengan tujuan membantu pelaku UMKM di Indonesia untuk mendigitalisasi proses penjualan dan pencatatan keuangan dengan mudah dan terjangkau.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2024 KasirPro. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AboutDeveloperPage;
