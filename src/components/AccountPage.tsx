import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Shield, Store, LogOut, Settings, HelpCircle, Phone, Info, Code, Edit3, Save, X, MapPin } from 'lucide-react';

const AccountPage = () => {
  const { user, setUser, setCurrentPage, signOut } = useApp();
  const { updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [storeAddress, setStoreAddress] = useState(user?.storeAddress || '');
  const [storePhone, setStorePhone] = useState(user?.storePhone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!storeName.trim()) return;
    setSaving(true);
    const result = await updateProfile({
      store_name: storeName.trim(),
      store_address: storeAddress.trim(),
      store_phone: storePhone.trim(),
    });
    if (!result?.error && user) {
      setUser({ ...user, storeName: storeName.trim(), storeAddress: storeAddress.trim(), storePhone: storePhone.trim() });
    }
    setSaving(false);
    setEditing(false);
  };

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

        {/* Store Profile Section */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Profil Toko</p>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-primary font-medium">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg bg-muted text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                <button onClick={handleSave} disabled={saving} className="p-1.5 rounded-lg bg-primary text-primary-foreground"><Save className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nama Toko</label>
                <input value={storeName} onChange={e => setStoreName(e.target.value)} maxLength={100}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Alamat</label>
                <input value={storeAddress} onChange={e => setStoreAddress(e.target.value)} maxLength={200}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">No. Telepon</label>
                <input value={storePhone} onChange={e => setStorePhone(e.target.value)} maxLength={20}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-foreground">{user?.storeName || 'Belum diatur'}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-foreground">{user?.storeAddress || 'Belum diatur'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-foreground">{user?.storePhone || 'Belum diatur'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
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
