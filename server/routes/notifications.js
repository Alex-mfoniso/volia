/**
 * VOLIA NIG LTD — Express Backend In-App Notifications & Preference Routes
 */

import express from 'express';
import { notifications, notificationPreferences } from '../data/store.js';
import { notificationDeliveries } from '../services/notificationService.js';
import { authenticateToken } from '../middleware/auth.js';

export const notificationsRouter = express.Router();

/**
 * Admin: List in-app notifications
 * GET /api/v1/admin/notifications
 */
notificationsRouter.get('/', authenticateToken, (req, res) => {
  const currentUserId = req.user.id;

  // Filter notifications for this user or broadcast to all_hr
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUserId || n.userId === 'all_hr' || n.userId === 'panel_member'
  );

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  return res.json({
    success: true,
    data: userNotifications,
    unreadCount,
    total: userNotifications.length,
  });
});

/**
 * Admin: Mark single notification as read
 * PATCH /api/v1/admin/notifications/:id/read
 */
notificationsRouter.patch('/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  const notif = notifications.find((n) => n.id === id);

  if (!notif) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found.',
    });
  }

  notif.isRead = true;

  return res.json({
    success: true,
    data: notif,
    message: 'Notification marked as read.',
  });
});

/**
 * Admin: Mark all notifications as read
 * POST /api/v1/admin/notifications/read-all
 */
notificationsRouter.post('/read-all', authenticateToken, (req, res) => {
  const currentUserId = req.user.id;

  for (const notif of notifications) {
    if (notif.userId === currentUserId || notif.userId === 'all_hr' || notif.userId === 'panel_member') {
      notif.isRead = true;
    }
  }

  return res.json({
    success: true,
    message: 'All notifications marked as read.',
  });
});

/**
 * Admin: Get notification preferences
 * GET /api/v1/admin/notifications/preferences
 */
notificationsRouter.get('/preferences', authenticateToken, (req, res) => {
  let pref = notificationPreferences.find((p) => p.userId === req.user.id);

  if (!pref) {
    pref = {
      id: `pref-${Date.now()}`,
      userId: req.user.id,
      emailEnabled: true,
      inAppEnabled: true,
      notifyOnStatusChange: true,
      notifyOnInterviewScheduled: true,
      notifyOnFeedbackSubmitted: true,
    };
    notificationPreferences.push(pref);
  }

  return res.json({
    success: true,
    data: pref,
  });
});

/**
 * Admin: Update notification preferences
 * PUT /api/v1/admin/notifications/preferences
 */
notificationsRouter.put('/preferences', authenticateToken, (req, res) => {
  const {
    emailEnabled,
    inAppEnabled,
    notifyOnStatusChange,
    notifyOnInterviewScheduled,
    notifyOnFeedbackSubmitted,
  } = req.body;

  let pref = notificationPreferences.find((p) => p.userId === req.user.id);
  if (!pref) {
    pref = {
      id: `pref-${Date.now()}`,
      userId: req.user.id,
      emailEnabled: true,
      inAppEnabled: true,
      notifyOnStatusChange: true,
      notifyOnInterviewScheduled: true,
      notifyOnFeedbackSubmitted: true,
    };
    notificationPreferences.push(pref);
  }

  if (emailEnabled !== undefined) pref.emailEnabled = Boolean(emailEnabled);
  if (inAppEnabled !== undefined) pref.inAppEnabled = Boolean(inAppEnabled);
  if (notifyOnStatusChange !== undefined) pref.notifyOnStatusChange = Boolean(notifyOnStatusChange);
  if (notifyOnInterviewScheduled !== undefined) {
    pref.notifyOnInterviewScheduled = Boolean(notifyOnInterviewScheduled);
  }
  if (notifyOnFeedbackSubmitted !== undefined) {
    pref.notifyOnFeedbackSubmitted = Boolean(notifyOnFeedbackSubmitted);
  }

  return res.json({
    success: true,
    data: pref,
    message: 'Notification preferences saved.',
  });
});

/**
 * Admin: View email delivery queue records
 * GET /api/v1/admin/notifications/deliveries
 */
notificationsRouter.get('/deliveries', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    data: notificationDeliveries,
    total: notificationDeliveries.length,
  });
});
