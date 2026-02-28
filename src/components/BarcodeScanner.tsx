import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode('barcode-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      (decodedText) => {
        scanner.stop().then(() => {
          onScan(decodedText);
        });
      },
      () => {}
    ).catch((err) => {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan.');
      console.error(err);
    });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60" onClick={onClose}>
      <div className="bg-card w-full max-w-sm rounded-2xl overflow-hidden mx-4" onClick={e => e.stopPropagation()}>
        <div className="pos-gradient p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-foreground" />
            <h2 className="text-sm font-bold text-primary-foreground">Scan Barcode</h2>
          </div>
          <button onClick={onClose} className="text-primary-foreground/70"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">
          <div id="barcode-reader" className="w-full rounded-xl overflow-hidden" />
          {error && <p className="text-destructive text-xs mt-3 text-center">{error}</p>}
          <p className="text-muted-foreground text-xs mt-3 text-center">Arahkan kamera ke barcode produk</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
