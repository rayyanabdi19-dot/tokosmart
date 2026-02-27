import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Printer, Wifi, Bluetooth, Usb, CheckCircle2 } from 'lucide-react';

const PrinterSettingsPage = () => {
  const { setCurrentPage } = useApp();
  const [connection, setConnection] = useState<'bluetooth' | 'wifi' | 'usb'>('bluetooth');
  const [paperSize, setPaperSize] = useState<'58mm' | '80mm'>('58mm');
  const [autoPrint, setAutoPrint] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-10 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage('admin-settings')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold text-foreground">Pengaturan Printer</h1>
        </div>
      </div>
      <div className="px-5 py-4 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Koneksi Printer</p>
          <div className="flex gap-2">
            {([
              { key: 'bluetooth', icon: Bluetooth, label: 'Bluetooth' },
              { key: 'wifi', icon: Wifi, label: 'WiFi' },
              { key: 'usb', icon: Usb, label: 'USB' },
            ] as const).map(c => (
              <button key={c.key} onClick={() => setConnection(c.key)} className={`flex-1 py-3 rounded-xl text-xs font-medium flex flex-col items-center gap-1.5 ${connection === c.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <c.icon className="w-5 h-5" />{c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Ukuran Kertas</p>
          <div className="flex gap-2">
            {(['58mm', '80mm'] as const).map(s => (
              <button key={s} onClick={() => setPaperSize(s)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${paperSize === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Auto Print Struk</p>
              <p className="text-xs text-muted-foreground">Print otomatis setelah checkout</p>
            </div>
            <button onClick={() => setAutoPrint(!autoPrint)} className={`w-12 h-7 rounded-full transition-colors ${autoPrint ? 'bg-primary' : 'bg-muted'} relative`}>
              <div className={`w-5 h-5 rounded-full bg-card shadow absolute top-1 transition-transform ${autoPrint ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <button className="w-full py-3 rounded-xl border border-primary text-primary text-sm font-medium flex items-center justify-center gap-2">
          <Printer className="w-4 h-4" /> Test Print
        </button>
      </div>
    </div>
  );
};

export default PrinterSettingsPage;
