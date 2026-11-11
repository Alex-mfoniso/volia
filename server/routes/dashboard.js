/**
 * VOLIA NIG LTD — Express Backend Dashboard Metrics & Activity
 */

import express from 'express';
import { jobs, applications, candidates, interviews, auditLogs } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

export const dashboardRouter = express.Router();

/**
 * Admin: Get executive recruitment metrics
 * GET /api/v1/admin/dashboard/metrics
 */
dashboardRouter.get('/metrics', authenticateToken, (req, res) => {
  const activeJobs = jobs.filter((j) => j.status === 'published').length;
  const totalApps = applications.length;
  const inReview = applications.filter((a) =>
    ['screening', 'shortlisted'].includes(a.stage)
  ).length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;
  const offersPending = applications.filter((a) => a.stage === 'offer').length;
  const hiresThisQuarter = applications.filter((a) => a.stage === 'hired').length;

  const stageBreakdown = {
    applied: 0,
    screening: 0,
    shortlisted: 0,
    interview: 0,
    assessment: 0,
    offer: 0,
    hired: 0,
    rejected: 0,
  };

  for (const app of applications) {
    if (stageBreakdown[app.stage] !== undefined) {
      stageBreakdown[app.stage]++;
    }
  }

  const departmentBreakdown = {
    Engineering: 0,
    Architecture: 0,
    'Quantity Surveying': 0,
    'Project Management': 0,
    'Executive & Operations': 0,
  };

  for (const app of applications) {
    if (departmentBreakdown[app.jobDepartment] !== undefined) {
      departmentBreakdown[app.jobDepartment]++;
    }
  }

  return res.json({
    success: true,
    data: {
      totalActiveJobs: activeJobs,
      totalApplications: totalApps,
      totalCandidates: candidates.length,
      inReviewCount: inReview,
      interviewsScheduled: scheduledInterviews,
      offersPending,
      hiresThisQuarter,
      stageBreakdown,
      departmentBreakdown,
    },
  });
});

/**
 * Admin: Get recent activity stream and audit logs
 * GET /api/v1/admin/dashboard/activity
 */
const handleActivity = (req, res) => {
  const recentApplications = applications.slice(0, 5);
  const recentAudit = auditLogs.slice(0, 20);

  return res.json({
    success: true,
    data: recentAudit,
    meta: {
      recentApplications,
      recentAuditLogs: recentAudit,
    },
  });
};

dashboardRouter.get('/activity', authenticateToken, handleActivity);
dashboardRouter.get('/activities', authenticateToken, handleActivity);
