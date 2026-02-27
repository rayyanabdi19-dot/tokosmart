import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Bell, Volume2, Vibrate, Mail } from 'lucide-react';

const NotificationSettingsPage = () => {
  const { setCurrentPage } = useApp();
  const [sound, setSound] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [lowStock, setLowStock] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-12 h-7 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted'} relative`}>
      <div className={`w-5 h-5 rounded-full bg-card shadow absolute top-1 transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-10 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage('admin-settings')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold text-foreground">Notifikasi</h1>
        </div>
      </div>
      <div className="px-5 py-4 space-y-2">
        {[
          { icon: Volume2, label: 'Suara Transaksi', desc: 'Bunyi saat transaksi masuk', value: sound, onChange: () => setSound(!sound) },
          { icon: Vibrate, label: 'Getar', desc: 'Getaran saat ada notifikasi', value: vibrate, onChange: () => setVibrate(!vibrate) },
          { icon: Mail, label: 'Email Report', desc: 'Kirim laporan harian via email', value: emailNotif, onChange: () => setEmailNotif(!emailNotif) },
          { icon: Bell, label: 'Stok Rendah', desc: 'Peringatan saat stok menipis', value: lowStock, onChange: () => setLowStock(!lowStock) },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><item.icon className="w-5 h-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Toggle value={item.value} onChange={item.onChange} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
