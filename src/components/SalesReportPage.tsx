import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Download, TrendingUp, DollarSign, ShoppingBag, BarChart3 } from 'lucide-react';
import * as XLSX from 'xlsx';

const SalesReportPage = () => {
  const { setCurrentPage, shift, products } = useApp();

  const posSales = shift.transactions.filter(t => t.type === 'pos-sale');
  const allSales = shift.transactions.filter(t => t.type === 'sale' || t.type === 'pos-sale');

  const totalRevenue = allSales.reduce((s, t) => s + t.amount, 0);

  // Calculate profit from POS sales with items
  const totalProfit = posSales.reduce((sum, tx) => {
    if (tx.items) {
      return sum + tx.items.reduce((s, item) => s + (item.product.price - item.product.cost) * item.qty, 0);
    }
    return sum;
  }, 0);

  const totalItems = posSales.reduce((sum, tx) => {
    if (tx.items) return sum + tx.items.reduce((s, i) => s + i.qty, 0);
    return sum;
  }, 0);

  // Product breakdown
  const productBreakdown: Record<string, { name: string; qty: number; revenue: number; profit: number }> = {};
  posSales.forEach(tx => {
    tx.items?.forEach(item => {
      const key = item.product.id;
      if (!productBreakdown[key]) {
        productBreakdown[key] = { name: item.product.name, qty: 0, revenue: 0, profit: 0 };
      }
      productBreakdown[key].qty += item.qty;
      productBreakdown[key].revenue += item.product.price * item.qty;
      productBreakdown[key].profit += (item.product.price - item.product.cost) * item.qty;
    });
  });

  const breakdown = Object.values(productBreakdown).sort((a, b) => b.revenue - a.revenue);

  const exportExcel = () => {
    const data = breakdown.map(b => ({
      'Nama Produk': b.name,
      'Qty Terjual': b.qty,
      'Total Penjualan': b.revenue,
      'Total Laba': b.profit,
      'Margin %': b.revenue > 0 ? Math.round((b.profit / b.revenue) * 100) : 0,
    }));

    data.push({
      'Nama Produk': 'TOTAL',
      'Qty Terjual': totalItems,
      'Total Penjualan': totalRevenue,
      'Total Laba': totalProfit,
      'Margin %': totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0,
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Penjualan');
    XLSX.writeFile(wb, `Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-10 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage('report')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold text-foreground flex-1">Laporan Laba Penjualan</h1>
          <button onClick={exportExcel} className="flex items-center gap-1.5 bg-success text-success-foreground px-3 py-2 rounded-xl text-xs font-medium">
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <DollarSign className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Total Penjualan</p>
            <p className="text-lg font-bold text-foreground">Rp {totalRevenue.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <TrendingUp className="w-5 h-5 text-success mb-2" />
            <p className="text-xs text-muted-foreground">Total Laba</p>
            <p className="text-lg font-bold text-success">Rp {totalProfit.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <ShoppingBag className="w-5 h-5 text-accent mb-2" />
            <p className="text-xs text-muted-foreground">Items Terjual</p>
            <p className="text-lg font-bold text-foreground">{totalItems}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <BarChart3 className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Margin Rata²</p>
            <p className="text-lg font-bold text-foreground">{totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}%</p>
          </div>
        </div>

        {/* Product Breakdown */}
        {breakdown.length > 0 ? (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Detail Per Produk</h2>
            </div>
            <div className="divide-y divide-border">
              {breakdown.map((b, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.qty} terjual</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">Rp {b.revenue.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-success font-medium">Laba: Rp {b.profit.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <BarChart3 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Belum ada data penjualan POS</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Mulai jualan dari menu Kasir Toko</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReportPage;
