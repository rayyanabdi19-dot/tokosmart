import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const NotificationToast = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[60] flex flex-col items-center gap-2 px-6 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} onClick={() => removeNotification(n.id)}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top cursor-pointer max-w-sm w-full ${
            n.type === 'success' ? 'bg-success text-success-foreground' :
            n.type === 'error' ? 'bg-destructive text-destructive-foreground' :
            'bg-primary text-primary-foreground'
          }`}>
          {n.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> :
           n.type === 'error' ? <XCircle className="w-4 h-4 flex-shrink-0" /> :
           <Info className="w-4 h-4 flex-shrink-0" />}
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
