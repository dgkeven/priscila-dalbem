import React, { useState } from 'react';
import { Bell, Check, X, Clock, Calendar, DollarSign } from 'lucide-react';
import { Notification } from '../../utils/notifications';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => 
    loadFromStorage('notifications', [])
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveToStorage('notifications', updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveToStorage('notifications', updated);
  };

  const removeNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    saveToStorage('notifications', updated);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_reminder': return Clock;
      case 'new_appointment': return Calendar;
      case 'cancelation': return X;
      case 'payment_reminder': return DollarSign;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment_reminder': return 'text-blue-600 bg-blue-100';
      case 'new_appointment': return 'text-green-600 bg-green-100';
      case 'cancelation': return 'text-red-600 bg-red-100';
      case 'payment_reminder': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-800">Central de Notificações</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-emerald-200 shadow-md'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                      {notification.title}
                    </h4>
                    <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                        title="Marcar como lida"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Remover notificação"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma notificação</p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;