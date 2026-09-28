"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, CheckCheck, Trash2, ShieldAlert, 
  Building2, ShoppingBag, Wrench, Calendar, Sparkles, 
  ChevronRight, Volume2, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'society' | 'alert' | 'marketplace' | 'service' | 'event';
  time: string;
  read: boolean;
  link?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Water Supply Maintenance Alert',
    message: 'Scheduled overhead tank cleaning tomorrow from 10:00 AM to 2:00 PM. Please store sufficient water.',
    type: 'alert',
    time: '10m ago',
    read: false,
    link: '/notices',
    actionLabel: 'View Notice'
  },
  {
    id: 'notif-2',
    title: 'Maintenance Invoice Generated',
    message: 'Monthly society maintenance bill for ₹3,500 is ready for review.',
    type: 'society',
    time: '1h ago',
    read: false,
    link: '/society',
    actionLabel: 'Pay Dues'
  },
  {
    id: 'notif-3',
    title: 'Visitor Gate Pass Approved',
    message: 'Guest "Vikram Sharma" successfully checked in at Main Gate with QR Pass #VN-9042.',
    type: 'society',
    time: '3h ago',
    read: false,
    link: '/society',
    actionLabel: 'Gate Logs'
  },
  {
    id: 'notif-4',
    title: 'New Neighborhood Listing',
    message: 'A resident in Block B just listed an "Ergonomic Office Chair" for ₹1,800 in Marketplace.',
    type: 'marketplace',
    time: '5h ago',
    read: true,
    link: '/marketplace',
    actionLabel: 'View Item'
  },
  {
    id: 'notif-5',
    title: 'Community Weekend Meetup',
    message: 'Annual Diwali & Society Gathering planning session this Sunday at 5 PM in Clubhouse.',
    type: 'event',
    time: '1d ago',
    read: true,
    link: '/events',
    actionLabel: 'RSVP'
  }
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'society' | 'alert'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load persisted notifications on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nearnest_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load notifications from storage', e);
    }
  }, []);

  // Persist notifications on update
  const saveNotifications = (items: NotificationItem[]) => {
    setNotifications(items);
    try {
      localStorage.setItem('nearnest_notifications', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save notifications', e);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    toast.success('All notifications marked as read');
  };

  const toggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
    toast.success('Notification removed');
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
    toast.success('All notifications cleared');
  };

  const sendTestNotification = () => {
    const testItem: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: '🚨 Test Community Alert',
      message: 'This is a live test alert! Notification bell and real-time alerts are functioning 100%.',
      type: 'alert',
      time: 'Just now',
      read: false,
      link: '/feed',
      actionLabel: 'View'
    };
    const updated = [testItem, ...notifications];
    saveNotifications(updated);
    toast.success('New test notification created!', {
      icon: '🔔',
      duration: 3000
    });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'society') return n.type === 'society';
    if (activeFilter === 'alert') return n.type === 'alert';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-coral-500" />;
      case 'society':
        return <Building2 className="w-4 h-4 text-brand-500" />;
      case 'marketplace':
        return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      case 'service':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        title="Notifications & Alerts"
        aria-label="Notifications"
      >
        <Bell className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'scale-110 text-brand-600' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-coral-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-surface animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Interactive Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface border border-border-hairline rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-border-hairline bg-surface-subtle/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-brand-500/10 p-1.5 rounded-lg text-brand-600">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
                  <p className="text-[11px] text-text-secondary">
                    {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/40 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface rounded-lg text-text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills & Test Trigger */}
            <div className="px-3 py-2 border-b border-border-hairline flex items-center justify-between gap-1 overflow-x-auto bg-canvas/30 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activeFilter === 'all'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-text-secondary hover:bg-surface-subtle'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveFilter('unread')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activeFilter === 'unread'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-text-secondary hover:bg-surface-subtle'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveFilter('alert')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activeFilter === 'alert'
                      ? 'bg-coral-500 text-white shadow-sm'
                      : 'text-text-secondary hover:bg-surface-subtle'
                  }`}
                >
                  Alerts
                </button>
              </div>

              <button
                onClick={sendTestNotification}
                className="text-[10px] text-brand-600 font-semibold flex items-center gap-1 px-2 py-1 rounded-md bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 transition-colors shrink-0"
                title="Send a sample notification to test alerts"
              >
                <Sparkles className="w-3 h-3 text-brand-500" />
                <span>Test Alert</span>
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border-hairline/60">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center mx-auto text-text-tertiary">
                    <CheckCheck className="w-6 h-6 text-brand-500" />
                  </div>
                  <p className="text-xs font-semibold text-text-primary">All caught up!</p>
                  <p className="text-[11px] text-text-secondary">No {activeFilter !== 'all' ? activeFilter : ''} notifications at this moment.</p>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.read) {
                        const updated = notifications.map((item) => (item.id === n.id ? { ...item, read: true } : item));
                        saveNotifications(updated);
                      }
                    }}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-surface-subtle/80 ${
                      !n.read ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-surface border border-border-hairline shrink-0 shadow-sm">
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className={`text-xs truncate ${!n.read ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-text-tertiary shrink-0">{n.time}</span>
                      </div>

                      <p className="text-[11px] text-text-secondary leading-snug line-clamp-2 mb-2">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        {n.link ? (
                          <Link
                            href={n.link}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                          >
                            <span>{n.actionLabel || 'View details'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => toggleReadStatus(n.id, e)}
                            className="p-1 text-text-secondary hover:text-brand-600 rounded"
                            title={n.read ? 'Mark as unread' : 'Mark as read'}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => deleteNotification(n.id, e)}
                            className="p-1 text-text-secondary hover:text-coral-500 rounded"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border-hairline bg-surface-subtle/50 flex items-center justify-between text-xs">
              <Link
                href="/notices"
                onClick={() => setIsOpen(false)}
                className="text-brand-600 hover:underline font-medium text-[11px] flex items-center gap-1"
              >
                <span>All Society Notices</span>
                <ChevronRight className="w-3 h-3" />
              </Link>

              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-text-tertiary hover:text-coral-600 text-[11px] transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
