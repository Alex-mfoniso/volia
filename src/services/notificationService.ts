/**
 * VOLIA NIG LTD — Notification & Communication Service
 */

import { NotificationItem, NotificationPreference } from '@/types';
import { apiClient } from './api/apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

let memoryNotifications: NotificationItem[] = [
  {
    id: 'notif-01',
    userId: 'usr-1',
    type: 'application_received',
    title: 'New Commission Application',
    message: 'Nnamdi Okeke submitted an application for Senior Quantity Surveyor (Cost Engineering).',
    relatedEntityId: 'app-003',
    relatedEntityType: 'application',
    isRead: false,
    createdAt: '2026-10-26T09:10:00Z',
  },
  {
    id: 'notif-02',
    userId: 'usr-1',
    type: 'interview_invitation',
    title: 'Assigned to Evaluation Panel',
    message: 'You have been assigned to evaluate Oluwaseun Adeyemi for Senior Structural Engineer.',
    relatedEntityId: 'int-001',
    relatedEntityType: 'interview',
    isRead: false,
    createdAt: '2026-10-24T14:05:00Z',
  },
  {
    id: 'notif-03',
    userId: 'usr-1',
    type: 'feedback_submitted',
    title: 'Technical Evaluation Submitted',
    message: 'Engr. Chukwuemeka Okonkwo submitted feedback for candidate Oluwaseun Adeyemi: Strongly Recommend.',
    relatedEntityId: 'int-001',
    relatedEntityType: 'interview',
    isRead: true,
    createdAt: '2026-11-05T16:00:00Z',
  },
];

let memoryPreferences: NotificationPreference = {
  id: 'pref-01',
  userId: 'usr-1',
  emailEnabled: true,
  inAppEnabled: true,
  notifyOnStatusChange: true,
  notifyOnInterviewScheduled: true,
  notifyOnFeedbackSubmitted: true,
};

class NotificationService {
  /**
   * Retrieve in-app notifications
   */
  public async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ data: NotificationItem[]; unreadCount: number }>(
        '/admin/notifications'
      );
      return {
        notifications: response.data || [],
        unreadCount: response.unreadCount || 0,
      };
    }

    const unread = memoryNotifications.filter((n) => !n.isRead).length;
    return {
      notifications: memoryNotifications,
      unreadCount: unread,
    };
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(id: string): Promise<NotificationItem> {
    if (!USE_MOCK) {
      return apiClient.patch<NotificationItem>(`/admin/notifications/${id}/read`, {});
    }

    const notif = memoryNotifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
    return notif || memoryNotifications[0];
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(): Promise<void> {
    if (!USE_MOCK) {
      await apiClient.post('/admin/notifications/read-all', {});
      return;
    }

    memoryNotifications.forEach((n) => {
      n.isRead = true;
    });
  }

  /**
   * Get notification preferences
   */
  public async getPreferences(): Promise<NotificationPreference> {
    if (!USE_MOCK) {
      return apiClient.get<NotificationPreference>('/admin/notifications/preferences');
    }
    return memoryPreferences;
  }

  /**
   * Update notification preferences
   */
  public async updatePreferences(
    pref: Partial<NotificationPreference>
  ): Promise<NotificationPreference> {
    if (!USE_MOCK) {
      return apiClient.put<NotificationPreference>('/admin/notifications/preferences', pref);
    }
    memoryPreferences = { ...memoryPreferences, ...pref };
    return memoryPreferences;
  }
}

export const notificationService = new NotificationService();
