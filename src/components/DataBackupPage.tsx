import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Download, Upload, Database, Trash2, HardDrive } from 'lucide-react';

const DataBackupPage = () => {
  const { setCurrentPage, shift, products, addNotification } = useApp();

  const handleExport = () => {
    const data = { shift, products, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Data exported successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-10 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage('admin-settings')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold text-foreground">Data & Backup</h1>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive className="w-5 h-5 text-primary" />
            <p className="text-sm font-semibold text-foreground">Status Data</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">{products.length}</p>
              <p className="text-xs text-muted-foreground">Produk</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">{shift.transactions.length}</p>
              <p className="text-xs text-muted-foreground">Transaksi</p>
            </div>
          </div>
        </div>

        <button onClick={handleExport} className="w-full flex items-center gap-3 bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><Download className="w-5 h-5 text-success" /></div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Export Data</p>
            <p className="text-xs text-muted-foreground">Download backup file (JSON)</p>
          </div>
        </button>

        <div className="w-full flex items-center gap-3 bg-card rounded-2xl p-4 border border-border opacity-50">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Upload className="w-5 h-5 text-primary" /></div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Import Data</p>
            <p className="text-xs text-muted-foreground">Restore dari file backup</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBackupPage;
