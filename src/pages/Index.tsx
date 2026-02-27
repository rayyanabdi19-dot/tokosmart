import { AppProvider, useApp } from '@/context/AppContext';
import AuthPage from '@/components/AuthPage';
import OpenStorePage from '@/components/OpenStorePage';
import DashboardPage from '@/components/DashboardPage';
import CashbookPage from '@/components/CashbookPage';
import ReportPage from '@/components/ReportPage';
import AccountPage from '@/components/AccountPage';
import AdminSettingsPage from '@/components/AdminSettingsPage';
import FaqPage from '@/components/FaqPage';
import POSPage from '@/components/POSPage';
import ProductManagementPage from '@/components/ProductManagementPage';
import SalesReportPage from '@/components/SalesReportPage';
import StaffManagementPage from '@/components/StaffManagementPage';
import PrinterSettingsPage from '@/components/PrinterSettingsPage';
import NotificationSettingsPage from '@/components/NotificationSettingsPage';
import DataBackupPage from '@/components/DataBackupPage';
import BottomNav from '@/components/BottomNav';
import TransactionModal from '@/components/TransactionModal';
import TopupModal from '@/components/TopupModal';
import ReceiptModal from '@/components/ReceiptModal';
import CloseShiftModal from '@/components/CloseShiftModal';
import NotificationToast from '@/components/NotificationToast';

const noBottomNavPages = ['open-store', 'admin-settings', 'faq', 'pos', 'staff-management', 'printer-settings', 'notification-settings', 'data-backup', 'product-management', 'sales-report'];

const AppContent = () => {
  const { user, currentPage } = useApp();

  if (!user) return <AuthPage />;

  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      {currentPage === 'open-store' && <OpenStorePage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'cashbook' && <CashbookPage />}
      {currentPage === 'report' && <ReportPage />}
      {currentPage === 'account' && <AccountPage />}
      {currentPage === 'admin-settings' && <AdminSettingsPage />}
      {currentPage === 'faq' && <FaqPage />}
      {currentPage === 'pos' && <POSPage />}
      {currentPage === 'product-management' && <ProductManagementPage />}
      {currentPage === 'sales-report' && <SalesReportPage />}
      {currentPage === 'staff-management' && <StaffManagementPage />}
      {currentPage === 'printer-settings' && <PrinterSettingsPage />}
      {currentPage === 'notification-settings' && <NotificationSettingsPage />}
      {currentPage === 'data-backup' && <DataBackupPage />}

      {!noBottomNavPages.includes(currentPage) && <BottomNav />}

      <TransactionModal />
      <TopupModal />
      <ReceiptModal />
      <CloseShiftModal />
      <NotificationToast />
    </div>
  );
};

const Index = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default Index;
