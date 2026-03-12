
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Trash2, Copy, KeyRound, Loader2, CheckCircle, XCircle, Send } from 'lucide-react';

interface LicenseCode {
  id: string;
  code: string;
  license_type: string;
  duration_days: number;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

const typeLabel: Record<string, string> = {
  monthly: 'Bulanan',
  yearly: 'Tahunan',
  lifetime: 'Selamanya',
};

const typeBadgeClass: Record<string, string> = {
  monthly: 'bg-primary/10 text-primary',
  yearly: 'bg-amber-500/10 text-amber-600',
  lifetime: 'bg-emerald-500/10 text-emerald-600',
};

const AdminLicenseCodesPage = () => {
  const { setCurrentPage, addNotification } = useApp();
  const [codes, setCodes] = useState<LicenseCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genType, setGenType] = useState('monthly');
  const [genCount, setGenCount] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sendingCodeId, setSendingCodeId] = useState<string | null>(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-license-codes', {
        method: 'GET',
      });
      if (error) throw error;
      setCodes(data?.codes || []);
    } catch (err: any) {
      addNotification(err.message || 'Gagal memuat kode', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const durationMap: Record<string, number> = { monthly: 30, yearly: 365, lifetime: 36500 };
      const { data, error } = await supabase.functions.invoke('admin-license-codes', {
        method: 'POST',
        body: {
          license_type: genType,
          duration_days: durationMap[genType],
          count: genCount,
        },
      });
      if (error) throw error;
      addNotification(`${genCount} kode lisensi berhasil dibuat!`, 'success');
      setShowGenerate(false);
      setGenCount(1);
      fetchCodes();
    } catch (err: any) {
      addNotification(err.message || 'Gagal membuat kode', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-license-codes', {
        method: 'POST',
        body: { id, _action: 'delete' },
      });
      // Use DELETE workaround via POST
      await supabase.functions.invoke('admin-license-codes', {
        method: 'DELETE' as any,
        body: { id },
      });
      setCodes(prev => prev.filter(c => c.id !== id));
      addNotification('Kode lisensi dihapus', 'info');
    } catch (err: any) {
      addNotification(err.message || 'Gagal menghapus', 'error');
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    addNotification('Kode disalin!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const usedCount = codes.filter(c => c.is_used).length;
  const availableCount = codes.filter(c => !c.is_used).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCurrentPage('admin-settings')} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground flex-1">Kode Lisensi</h1>
          <button
            onClick={() => setShowGenerate(true)}
            className="w-9 h-9 rounded-xl pos-gradient flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-lg font-bold text-foreground">{codes.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-lg font-bold text-emerald-600">{availableCount}</p>
            <p className="text-xs text-muted-foreground">Tersedia</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-lg font-bold text-muted-foreground">{usedCount}</p>
            <p className="text-xs text-muted-foreground">Terpakai</p>
          </div>
        </div>

        {/* Generate Modal */}
        {showGenerate && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 mb-6">
            <p className="font-semibold text-foreground mb-4">Generate Kode Baru</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Tipe Lisensi</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['monthly', 'yearly', 'lifetime'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setGenType(type)}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        genType === type
                          ? 'pos-gradient text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {typeLabel[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Jumlah Kode</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={genCount}
                  onChange={e => setGenCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowGenerate(false)}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 py-3 rounded-xl pos-gradient text-primary-foreground font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  {generating ? 'Membuat...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Codes List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : codes.length === 0 ? (
          <div className="text-center py-12">
            <KeyRound className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Belum ada kode lisensi</p>
            <p className="text-xs text-muted-foreground mt-1">Klik + untuk generate kode baru</p>
          </div>
        ) : (
          <div className="space-y-2">
            {codes.map(code => (
              <div
                key={code.id}
                className={`rounded-xl p-4 border transition-all ${
                  code.is_used ? 'bg-muted/50 border-border' : 'bg-card border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${code.is_used ? 'bg-muted' : 'bg-primary/10'}`}>
                    {code.is_used ? (
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-mono text-sm font-semibold tracking-wider ${code.is_used ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {code.code}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeBadgeClass[code.license_type] || 'bg-muted text-muted-foreground'}`}>
                        {typeLabel[code.license_type] || code.license_type}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(code.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!code.is_used && (
                      <button
                        onClick={() => handleCopy(code.code, code.id)}
                        className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
                      >
                        {copiedId === code.id ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    )}
                    {!code.is_used && (
                      <button
                        onClick={() => handleDelete(code.id)}
                        className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLicenseCodesPage;
