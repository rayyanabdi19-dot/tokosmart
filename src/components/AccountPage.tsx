import React from 'react';
import { useApp } from '@/context/AppContext';
import { User, Mail, Shield, Store, LogOut, Settings, HelpCircle, Phone, Info, Code } from 'lucide-react';

const AccountPage = () => {
  const { user, setCurrentPage, signOut } = useApp();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <h1 className="text-xl font-bold text-foreground mb-6">Account</h1>

        <div className="bg-card rounded-2xl p-5 border border-border mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl pos-gradient flex items-center justify-center">
            <User className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium capitalize">{user?.role}</span>
          </div>
        </div>

        <div className="space-y-2">
          <MenuItem icon={<Store className="w-5 h-5" />} label="Store Info" subtitle={user?.storeName || ''} />
          <MenuItem icon={<Mail className="w-5 h-5" />} label="Email" subtitle={user?.email || ''} />
          <MenuItem icon={<Shield className="w-5 h-5" />} label="Security" subtitle="Change password" />
          {user?.role === 'admin' && (
            <button onClick={() => setCurrentPage('admin-settings')} className="w-full">
              <MenuItem icon={<Settings className="w-5 h-5" />} label="Admin Settings" subtitle="Manage store" />
            </button>
          )}
          <button onClick={() => setCurrentPage('faq')} className="w-full">
            <MenuItem icon={<HelpCircle className="w-5 h-5" />} label="FAQ & Help" subtitle="Get support" />
          </button>
          <a href="https://wa.me/6282186371356" target="_blank" rel="noopener noreferrer" className="block w-full">
            <MenuItem icon={<Phone className="w-5 h-5" />} label="Hubungi Helpdesk" subtitle="WhatsApp: 0821-8637-1356" />
          </a>
          <MenuItem icon={<Info className="w-5 h-5" />} label="Versi Aplikasi" subtitle="KasirPro v1.0.0" />
          <button onClick={() => setCurrentPage('about-developer')} className="w-full">
            <MenuItem icon={<Code className="w-5 h-5" />} label="Tentang Developer" subtitle="Info pengembang" />
          </button>
        </div>

        <button
          onClick={signOut}
          className="w-full mt-8 flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/20 text-destructive font-medium text-sm hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, subtitle }: { icon: React.ReactNode; label: string; subtitle: string }) => (
  <div className="flex items-center gap-3 bg-card rounded-xl p-3.5 border border-border">
    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">{icon}</div>
    <div className="flex-1 text-left">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

export default AccountPage;
