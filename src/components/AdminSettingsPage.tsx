import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Users, Printer, Bell, Database } from 'lucide-react';

const AdminSettingsPage = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-12">
        <button onClick={() => setCurrentPage('account')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-foreground mb-6">Admin Settings</h1>

        <div className="space-y-2">
          <SettingItem icon={<Users className="w-5 h-5" />} label="Staff Management" desc="Add and manage cashiers" />
          <SettingItem icon={<Printer className="w-5 h-5" />} label="Receipt Printer" desc="Configure printer settings" />
          <SettingItem icon={<Bell className="w-5 h-5" />} label="Notifications" desc="Alert preferences" />
          <SettingItem icon={<Database className="w-5 h-5" />} label="Data & Backup" desc="Export and restore data" />
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) => (
  <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  </div>
);

export default AdminSettingsPage;
