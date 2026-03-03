import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, Profile } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type Page = 'open-store' | 'dashboard' | 'cashbook' | 'report' | 'account' | 'admin-settings' | 'faq' | 'pos' | 'staff-management' | 'printer-settings' | 'notification-settings' | 'data-backup' | 'product-management' | 'sales-report' | 'about-developer' | 'license';

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  image: string;
  stock: number;
  barcode?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'expense' | 'topup' | 'pos-sale';
  amount: number;
  description: string;
  category: string;
  timestamp: Date;
  paymentMethod: 'cash' | 'card' | 'e-wallet';
  items?: CartItem[];
  cashReceived?: number;
  changeAmount?: number;
}

export interface User {
  name: string;
  email: string;
  role: 'cashier' | 'admin';
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
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
  products: Product[];
  setProducts: (p: Product[]) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  signOut: () => void;
  authLoading: boolean;
}

const defaultProducts: Product[] = [
  { id: '1', name: 'Pulsa 10K', price: 12000, cost: 10000, category: 'Pulsa', image: '📱', stock: 99 },
  { id: '2', name: 'Pulsa 25K', price: 27000, cost: 25000, category: 'Pulsa', image: '📱', stock: 99 },
  { id: '3', name: 'Pulsa 50K', price: 52000, cost: 50000, category: 'Pulsa', image: '📱', stock: 99 },
  { id: '4', name: 'Paket Data 5GB', price: 45000, cost: 40000, category: 'Paket Data', image: '📶', stock: 99 },
  { id: '5', name: 'Token Listrik 50K', price: 52000, cost: 50000, category: 'Token', image: '⚡', stock: 99 },
  { id: '6', name: 'Token Listrik 100K', price: 102000, cost: 100000, category: 'Token', image: '⚡', stock: 99 },
  { id: '7', name: 'Buku Tulis', price: 5000, cost: 3500, category: 'ATK', image: '📒', stock: 50 },
  { id: '8', name: 'Pulpen', price: 3000, cost: 1500, category: 'ATK', image: '🖊️', stock: 100 },
  { id: '9', name: 'Pensil 2B', price: 2000, cost: 1000, category: 'ATK', image: '✏️', stock: 80 },
  { id: '10', name: 'Penghapus', price: 2000, cost: 800, category: 'ATK', image: '🧹', stock: 60 },
  { id: '11', name: 'E-Wallet TopUp', price: 10000, cost: 10000, category: 'E-Wallet', image: '💳', stock: 99 },
  { id: '12', name: 'Voucher Game 25K', price: 27000, cost: 25000, category: 'Voucher', image: '🎮', stock: 99 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { authUser, profile, loading: authLoading, signOut: authSignOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('open-store');
  const [shift, setShift] = useState<ShiftData>({
    isOpen: false, openedAt: null, openingBalance: 0, transactions: [],
  });
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sync auth user to app user
  useEffect(() => {
    if (profile) {
      setUser({
        name: profile.name,
        email: profile.email || '',
        role: (profile.role as 'admin' | 'cashier') || 'admin',
        storeName: profile.store_name || 'Profil Toko',
        storeAddress: profile.store_address || '',
        storePhone: profile.store_phone || '',
      });
      // Load products from DB
      loadProducts();
    } else if (!authLoading) {
      setUser(null);
    }
  }, [profile, authLoading]);

  const loadProducts = async () => {
    if (!authUser) return;
    const { data } = await supabase.from('products').select('*').eq('user_id', authUser.id);
    if (data && data.length > 0) {
      setProducts(data.map(p => ({
        id: p.id, name: p.name, price: Number(p.price), cost: Number(p.cost),
        category: p.category || 'Umum', image: p.image || '📦',
        stock: p.stock || 0, barcode: p.barcode || undefined,
      })));
    } else {
      // Seed default products for new users
      setProducts(defaultProducts);
      if (authUser) {
        const inserts = defaultProducts.map(p => ({
          user_id: authUser.id, name: p.name, price: p.price, cost: p.cost,
          category: p.category, image: p.image, stock: p.stock,
        }));
        await supabase.from('products').insert(inserts);
        loadProducts(); // reload to get DB IDs
      }
    }
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setCurrentPage('open-store');
    setShift({ isOpen: false, openedAt: null, openingBalance: 0, transactions: [] });
  };

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

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = { ...tx, id: Date.now().toString(), timestamp: new Date() };
    setShift(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
    addNotification(`${tx.type === 'sale' ? 'Sale' : tx.type === 'topup' ? 'Top-up' : tx.type === 'pos-sale' ? 'POS Sale' : 'Expense'} of Rp ${tx.amount.toLocaleString()} recorded`, 'success');

    // Save to DB
    if (authUser) {
      await supabase.from('transactions').insert({
        user_id: authUser.id, type: tx.type, amount: tx.amount,
        description: tx.description, category: tx.category,
        payment_method: tx.paymentMethod,
        items: tx.items ? JSON.parse(JSON.stringify(tx.items)) : null,
        cash_received: tx.cashReceived || null,
        change_amount: tx.changeAmount || null,
      });
    }
  };

  const addNotification = (message: string, type: Notification['type']) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addProduct = async (p: Omit<Product, 'id'>) => {
    const tempId = Date.now().toString();
    setProducts(prev => [...prev, { ...p, id: tempId }]);
    addNotification('Product added!', 'success');
    if (authUser) {
      const { data } = await supabase.from('products').insert({
        user_id: authUser.id, name: p.name, price: p.price, cost: p.cost,
        category: p.category, image: p.image, stock: p.stock, barcode: p.barcode || null,
      }).select().single();
      if (data) {
        setProducts(prev => prev.map(pr => pr.id === tempId ? { ...pr, id: data.id } : pr));
      }
    }
  };

  const updateProduct = async (p: Product) => {
    setProducts(prev => prev.map(pr => pr.id === p.id ? p : pr));
    addNotification('Product updated!', 'success');
    if (authUser) {
      await supabase.from('products').update({
        name: p.name, price: p.price, cost: p.cost,
        category: p.category, image: p.image, stock: p.stock, barcode: p.barcode || null,
      }).eq('id', p.id);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addNotification('Product deleted!', 'info');
    if (authUser) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(c => c.product.id !== productId));
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(c => c.product.id === productId ? { ...c, qty } : c));
  };

  const clearCart = () => setCart([]);

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
      products, setProducts, addProduct, updateProduct, deleteProduct,
      cart, setCart, addToCart, removeFromCart, updateCartQty, clearCart,
      signOut, authLoading,
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
