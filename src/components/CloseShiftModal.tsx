import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, AlertTriangle } from 'lucide-react';

const CloseShiftModal = () => {
  const { showCloseShiftModal, setShowCloseShiftModal, closeShift, shift } = useApp();

  if (!showCloseShiftModal) return null;

  const totalSales = shift.transactions.filter(t => t.type === 'sale').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = shift.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalTopups = shift.transactions.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const finalBalance = shift.openingBalance + totalSales + totalTopups - totalExpenses;

  const handleClose = () => {
    closeShift();
    setShowCloseShiftModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6" onClick={() => setShowCloseShiftModal(false)}>
      <div className="bg-card w-full max-w-sm rounded-2xl p-6 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Close Shift</h2>
          <button onClick={() => setShowCloseShiftModal(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-accent/10 rounded-xl p-4 mb-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">Are you sure you want to close this shift? This action cannot be undone.</p>
        </div>

        <div className="space-y-2 mb-5">
          <SummaryRow label="Opening Balance" value={shift.openingBalance} />
          <SummaryRow label="Total Sales" value={totalSales} positive />
          <SummaryRow label="Total Top-ups" value={totalTopups} positive />
          <SummaryRow label="Total Expenses" value={totalExpenses} negative />
          <div className="border-t border-border pt-2">
            <SummaryRow label="Final Balance" value={finalBalance} bold />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowCloseShiftModal(false)}
            className="py-3 rounded-xl border border-border text-foreground font-medium text-sm">Cancel</button>
          <button onClick={handleClose}
            className="py-3 rounded-xl bg-destructive text-destructive-foreground font-medium text-sm">Close Shift</button>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, positive, negative, bold }: { label: string; value: number; positive?: boolean; negative?: boolean; bold?: boolean }) => (
  <div className="flex justify-between">
    <span className={`text-sm ${bold ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{label}</span>
    <span className={`text-sm ${bold ? 'font-bold text-foreground' : positive ? 'text-success font-medium' : negative ? 'text-destructive font-medium' : 'font-medium text-foreground'}`}>
      Rp {value.toLocaleString('id-ID')}
    </span>
  </div>
);

export default CloseShiftModal;
