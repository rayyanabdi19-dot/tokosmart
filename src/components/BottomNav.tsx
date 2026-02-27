import React from 'react';
import { useApp, Page } from '@/context/AppContext';
import { LayoutDashboard, BookOpen, BarChart3, User, XCircle, ShoppingBag } from 'lucide-react';

const tabs: { page: Page; icon: typeof LayoutDashboard; label: string }[] = [
  { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'pos', icon: ShoppingBag, label: 'Kasir' },
  { page: 'cashbook', icon: BookOpen, label: 'Cashbook' },
  { page: 'report', icon: BarChart3, label: 'Reports' },
  { page: 'account', icon: User, label: 'Account' },
];

const BottomNav = () => {
  const { currentPage, setCurrentPage, setShowCloseShiftModal } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {tabs.map(tab => {
          const active = currentPage === tab.page;
          return (
            <button
              key={tab.page}
              onClick={() => setCurrentPage(tab.page)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowCloseShiftModal(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-destructive transition-colors"
        >
          <XCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">Close</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
