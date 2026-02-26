import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Page = 'open-store' | 'dashboard' | 'cashbook' | 'report' | 'account' | 'admin-settings' | 'faq';

export interface Transaction {
  id: string;
  type: 'sale' | 'expense' | 'topup';
  amount: number;
  description: string;
  category: string;
  timestamp: Date;
  paymentMethod: 'cash' | 'card' | 'e-wallet';
}

export interface User {
  name: string;
  email: string;
  role: 'cashier' | 'admin';
  storeName: string;
}

export interface ShiftData {
  isOpen: boolean;
  openedAt: Date | null;
  openingBalance: number;
  transactions: Transaction[];
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  shift: ShiftData;
  setShift: (shift: ShiftData) => void;
  openShift: (balance: number) => void;
  closeShift: () => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
  showTransactionModal: boolean;
  setShowTransactionModal: (v: boolean) => void;
  showTopupModal: boolean;
  setShowTopupModal: (v: boolean) => void;
  showReceiptModal: boolean;
  setShowReceiptModal: (v: boolean) => void;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  showCloseShiftModal: boolean;
  setShowCloseShiftModal: (v: boolean) => void;
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('open-store');
  const [shift, setShift] = useState<ShiftData>({
    isOpen: false,
    openedAt: null,
    openingBalance: 0,
    transactions: [],
  });
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const openShift = (balance: number) => {
    setShift({ isOpen: true, openedAt: new Date(), openingBalance: balance, transactions: [] });
    setCurrentPage('dashboard');
    addNotification('Shift opened successfully!', 'success');
  };

  const closeShift = () => {
    setShift({ isOpen: false, openedAt: null, openingBalance: 0, transactions: [] });
    setCurrentPage('open-store');
    addNotification('Shift closed successfully!', 'info');
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = { ...tx, id: Date.now().toString(), timestamp: new Date() };
    setShift(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
    addNotification(`${tx.type === 'sale' ? 'Sale' : tx.type === 'topup' ? 'Top-up' : 'Expense'} of Rp ${tx.amount.toLocaleString()} recorded`, 'success');
  };

  const addNotification = (message: string, type: Notification['type']) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, setUser, currentPage, setCurrentPage,
      shift, setShift, openShift, closeShift, addTransaction,
      showTransactionModal, setShowTransactionModal,
      showTopupModal, setShowTopupModal,
      showReceiptModal, setShowReceiptModal,
      selectedTransaction, setSelectedTransaction,
      showCloseShiftModal, setShowCloseShiftModal,
      notifications, addNotification, removeNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
