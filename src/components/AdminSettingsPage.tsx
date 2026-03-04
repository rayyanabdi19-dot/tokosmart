import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Users, Printer, Bell, Database, Package, KeyRound } from 'lucide-react';

const AdminSettingsPage = () => {
  const { setCurrentPage } = useApp();

  const items = [
    { icon: <Users className="w-5 h-5" />, label: 'Staff Management', desc: 'Add and manage cashiers', page: 'staff-management' as const },
    { icon: <Package className="w-5 h-5" />, label: 'Kelola Produk', desc: 'Atur produk, foto & stok', page: 'product-management' as const },
    { icon: <KeyRound className="w-5 h-5" />, label: 'Kode Lisensi', desc: 'Generate & kelola kode premium', page: 'admin-license-codes' as const },
    { icon: <Printer className="w-5 h-5" />, label: 'Receipt Printer', desc: 'Configure printer settings', page: 'printer-settings' as const },
    { icon: <Bell className="w-5 h-5" />, label: 'Notifications', desc: 'Alert preferences', page: 'notification-settings' as const },
    { icon: <Database className="w-5 h-5" />, label: 'Data & Backup', desc: 'Export and restore data', page: 'data-backup' as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-12">
        <button onClick={() => setCurrentPage('account')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-foreground mb-6">Admin Settings</h1>

        <div className="space-y-2">
          {items.map(item => (
            <button key={item.label} onClick={() => setCurrentPage(item.page)} className="w-full">
              <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{item.icon}</div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
