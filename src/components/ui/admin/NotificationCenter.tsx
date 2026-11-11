import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  FileText,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem } from '@/types';
import { notificationService } from '@/services/notificationService';
import { cn } from '@/lib/utils';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleMarkAllRead = async () => {
    setIsLoading(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_received':
        return <FileText className="w-4 h-4 text-accent" />;
      case 'interview_invitation':
      case 'interview_rescheduled':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'feedback_submitted':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'recruitment_outcome':
        return <CheckCircle className="w-4 h-4 text-status-success" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ink-muted" />;
    }
  };

  const getEntityLink = (notif: NotificationItem) => {
    if (notif.relatedEntityType === 'interview') return '/admin/interviews';
    if (notif.relatedEntityType === 'application' && notif.relatedEntityId) {
      return `/admin/applications/${notif.relatedEntityId}`;
    }
    return '/admin/pipeline';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-ink-muted hover:text-ink hover:bg-canvas-surface transition-colors relative"
        title="Recruitment Notifications"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-accent text-[9px] font-bold text-white flex items-center justify-center font-mono">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Surface */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-border shadow-xl z-50 font-sans animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-border bg-canvas-surface flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xs font-semibold uppercase tracking-wider text-ink">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono bg-accent/15 text-accent px-1.5 py-0.2 font-medium border border-accent/30">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isLoading}
                className="text-[11px] text-accent hover:text-ink font-medium inline-flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto admin-scrollbar divide-y divide-border/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-ink-muted">
                <Bell className="w-6 h-6 mx-auto mb-2 text-border" />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    'p-3 hover:bg-canvas transition-colors flex gap-3 items-start',
                    !notif.isRead && 'bg-accent/5'
                  )}
                >
                  <div className="shrink-0 p-1.5 bg-white border border-border mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-medium text-ink truncate leading-tight font-sans">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                          className="shrink-0 w-2 h-2 rounded-full bg-accent hover:opacity-70 transition-opacity"
                          title="Mark read"
                        />
                      )}
                    </div>

                    <p className="text-[11px] text-ink-muted line-clamp-2 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-ink-muted">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(notif.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <Link
                        to={getEntityLink(notif)}
                        onClick={() => setIsOpen(false)}
                        className="text-accent hover:text-ink font-semibold uppercase tracking-wider inline-flex items-center gap-0.5"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-border bg-canvas-surface text-center">
            <Link
              to="/admin/pipeline"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-ink-muted hover:text-accent font-medium"
            >
              Recruitment Workflow Pipeline &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
