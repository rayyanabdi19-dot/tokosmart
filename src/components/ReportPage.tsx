import React from 'react';
import { useApp } from '@/context/AppContext';
import { BarChart3, TrendingUp, ShoppingCart, CreditCard, FileSpreadsheet } from 'lucide-react';

const ReportPage = () => {
  const { shift, setCurrentPage } = useApp();

  const sales = shift.transactions.filter(t => t.type === 'sale' || t.type === 'pos-sale');
  const totalSales = sales.reduce((s, t) => s + t.amount, 0);
  const avgSale = sales.length > 0 ? Math.round(totalSales / sales.length) : 0;

  const byPayment = sales.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-12">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-foreground">Reports</h1>
          <button onClick={() => setCurrentPage('sales-report')} className="flex items-center gap-1.5 bg-success text-success-foreground px-3 py-2 rounded-xl text-xs font-medium">
            <FileSpreadsheet className="w-4 h-4" /> Laporan Laba
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Shift summary & analytics</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <ShoppingCart className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Total Transactions</p>
            <p className="text-xl font-bold text-foreground">{sales.length}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <TrendingUp className="w-5 h-5 text-success mb-2" />
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-foreground">Rp {totalSales.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <BarChart3 className="w-5 h-5 text-accent mb-2" />
            <p className="text-xs text-muted-foreground">Avg. Sale</p>
            <p className="text-xl font-bold text-foreground">Rp {avgSale.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <CreditCard className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Payment Methods</p>
            <p className="text-xl font-bold text-foreground">{Object.keys(byPayment).length}</p>
          </div>
        </div>

        {Object.keys(byPayment).length > 0 && (
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-4">By Payment Method</h2>
            <div className="space-y-3">
              {Object.entries(byPayment).map(([method, amount]) => (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground capitalize">{method}</span>
                    <span className="font-medium text-foreground">Rp {amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full pos-gradient rounded-full" style={{ width: `${(amount / totalSales) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sales.length === 0 && (
          <div className="text-center py-16">
            <BarChart3 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No sales data yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
