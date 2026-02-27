import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, UserPlus, Users, Shield, ShieldCheck, Trash2, X } from 'lucide-react';

interface Staff { id: string; name: string; email: string; role: 'cashier' | 'admin'; }

const StaffManagementPage = () => {
  const { setCurrentPage } = useApp();
  const [staffList, setStaffList] = useState<Staff[]>([
    { id: '1', name: 'Admin Utama', email: 'admin@toko.com', role: 'admin' },
    { id: '2', name: 'Kasir 1', email: 'kasir1@toko.com', role: 'cashier' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'cashier' | 'admin'>('cashier');

  const handleAdd = () => {
    if (!newName || !newEmail) return;
    setStaffList(prev => [...prev, { id: Date.now().toString(), name: newName, email: newEmail, role: newRole }]);
    setNewName(''); setNewEmail(''); setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-10 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage('admin-settings')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold text-foreground flex-1">Kelola Staff</h1>
          <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground p-2 rounded-xl"><UserPlus className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="px-5 py-4 space-y-2">
        {staffList.map(s => (
          <div key={s.id} className="flex items-center gap-3 bg-card rounded-xl p-3.5 border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              {s.role === 'admin' ? <ShieldCheck className="w-5 h-5 text-primary" /> : <Users className="w-5 h-5 text-primary" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.email} • <span className="capitalize">{s.role}</span></p>
            </div>
            <button onClick={() => setStaffList(prev => prev.filter(st => st.id !== s.id))} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40" onClick={() => setShowAdd(false)}>
          <div className="bg-card w-full max-w-lg rounded-t-3xl p-5 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Tambah Staff</h2>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nama" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="flex gap-2">
                {(['cashier', 'admin'] as const).map(r => (
                  <button key={r} onClick={() => setNewRole(r)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize ${newRole === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{r}</button>
                ))}
              </div>
            </div>
            <button onClick={handleAdd} className="w-full mt-5 py-3.5 rounded-xl pos-gradient text-primary-foreground font-semibold">Tambah Staff</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementPage;
