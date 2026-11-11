/**
 * VOLIA NIG LTD — Express Backend Interview Scheduling, Evaluation & Feedback Routes
 */

import express from 'express';
import {
  interviews,
  applications,
  interviewFeedback,
  auditLogs,
  users,
  checkInterviewerConflict,
} from '../data/store.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';
import { dispatchNotification } from '../services/notificationService.js';

export const interviewsRouter = express.Router();

/**
 * Admin: List interviews with filtering
 * GET /api/v1/admin/interviews
 */
interviewsRouter.get('/', authenticateToken, (req, res) => {
  const { status, type, interviewerId, department, jobId, date } = req.query;

  let filtered = [...interviews];

  // Role-based visibility: interviewers only see their assigned sessions unless super_admin or hr_admin
  if (req.user.role === 'interviewer') {
    filtered = filtered.filter(
      (i) =>
        i.interviewerIds?.includes(req.user.id) ||
        i.interviewerNames?.some((n) => n.toLowerCase().includes(req.user.name.toLowerCase()))
    );
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((i) => i.status === status);
  }

  if (type && type !== 'all') {
    filtered = filtered.filter((i) => i.interviewType === type);
  }

  if (interviewerId && interviewerId !== 'all') {
    filtered = filtered.filter((i) => i.interviewerIds?.includes(interviewerId));
  }

  if (department && department !== 'all') {
    filtered = filtered.filter((i) => {
      const app = applications.find((a) => a.id === i.applicationId);
      return app && app.jobDepartment.toLowerCase() === department.toLowerCase();
    });
  }

  if (jobId && jobId !== 'all') {
    filtered = filtered.filter((i) => {
      const app = applications.find((a) => a.id === i.applicationId);
      return app && app.jobId === jobId;
    });
  }

  if (date) {
    const targetDate = new Date(date).toISOString().split('T')[0];
    filtered = filtered.filter((i) => i.scheduledAt.startsWith(targetDate));
  }

  // Attach feedback count to each interview
  const result = filtered.map((item) => {
    const fbs = interviewFeedback.filter((f) => f.interviewId === item.id);
    return {
      ...item,
      feedbackCount: fbs.length,
      feedbacks: fbs,
    };
  });

  return res.json({
    success: true,
    data: result,
    total: result.length,
  });
});

/**
 * Admin: Retrieve specific interview with feedback and applicant details
 * GET /api/v1/admin/interviews/:id
 */
interviewsRouter.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const interview = interviews.find((i) => i.id === id);

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview session not found.',
    });
  }

  const application = applications.find((a) => a.id === interview.applicationId);
  const feedbacks = interviewFeedback.filter((f) => f.interviewId === interview.id);

  return res.json({
    success: true,
    data: {
      ...interview,
      application,
      feedbacks,
    },
  });
});

/**
 * Admin: Schedule an interview panel with server-side validations
 * POST /api/v1/admin/interviews
 */
interviewsRouter.post(
  '/',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin', 'recruiter']),
  async (req, res) => {
    const {
      applicationId,
      interviewRound,
      interviewType,
      interviewerNames,
      interviewerIds,
      scheduledAt,
      durationMinutes,
      mode,
      meetingDetails,
      notes,
    } = req.body;

    // 1. Validate application
    const application = applications.find((a) => a.id === applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application record not found.',
      });
    }

    // 2. Validate candidate eligibility (must not be rejected or already hired)
    if (application.stage === 'rejected' || application.stage === 'hired') {
      return res.status(422).json({
        success: false,
        message: `Candidate cannot be scheduled for an interview while in '${application.stage}' status.`,
      });
    }

    // 3. Validate future date
    const scheduleTime = new Date(scheduledAt).getTime();
    if (isNaN(scheduleTime)) {
      return res.status(400).json({
        success: false,
        message: 'A valid date and time string is required.',
      });
    }

    if (scheduleTime <= Date.now()) {
      return res.status(422).json({
        success: false,
        message: 'Interview must be scheduled for a future date and time.',
      });
    }

    const duration = Number(durationMinutes) || 60;
    const endsAt = new Date(scheduleTime + duration * 60 * 1000).toISOString();

    const resolvedNames = Array.isArray(interviewerNames)
      ? interviewerNames
      : typeof interviewerNames === 'string'
      ? interviewerNames.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Engr. Chukwuemeka Okonkwo, FNSE'];

    // 4. Validate interviewer scheduling conflicts
    const conflict = checkInterviewerConflict({
      interviewerNames: resolvedNames,
      interviewerIds,
      scheduledAt,
      durationMinutes: duration,
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Scheduling conflict detected: Panel lead is already booked for '${
          conflict.candidateName
        }' on ${new Date(conflict.scheduledAt).toLocaleString()}.`,
        conflictWith: conflict,
        conflict,
        conflicts: [conflict],
      });
    }

    const newInterview = {
      id: `int-${Date.now().toString(36)}`,
      applicationId,
      candidateName: application.candidate.fullName,
      candidateEmail: application.candidate.email,
      jobTitle: application.jobTitle,
      interviewRound: interviewRound || 'Round 1: Technical Assessment',
      interviewType: interviewType || 'technical_assessment',
      interviewerNames: resolvedNames,
      interviewerIds: interviewerIds || [],
      scheduledAt,
      endsAt,
      timezone: 'Africa/Lagos',
      durationMinutes: duration,
      mode: mode || 'in_person_abuja',
      meetingDetails: meetingDetails || 'VOLIA Head Office Boardroom, Abuja',
      status: 'scheduled',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    interviews.unshift(newInterview);
    application.interviews.push(newInterview.id);

    // Auto advance stage to interview if previously applied/screening/shortlisted
    if (['applied', 'screening', 'shortlisted'].includes(application.stage)) {
      application.stage = 'interview';
      application.stageHistory.push({
        stage: 'interview',
        changedById: req.user.id,
        changedByName: req.user.name,
        changedAt: new Date().toISOString(),
        note: `Interview scheduled with ${resolvedNames.join(', ')}.`,
      });
    }

    // Dispatch Candidate Invitation Notification
    await dispatchNotification({
      userId: 'all_hr',
      recipientEmail: application.candidate.email,
      recipientName: application.candidate.fullName,
      type: 'interview_invitation',
      title: 'Interview Session Scheduled',
      message: `Interview session scheduled for ${application.candidate.fullName} on ${new Date(
        scheduledAt
      ).toLocaleString()}.`,
      relatedEntityId: newInterview.id,
      relatedEntityType: 'interview',
      emailData: {
        jobTitle: application.jobTitle,
        interviewType: newInterview.interviewType,
        scheduledTime: new Date(scheduledAt).toLocaleString('en-GB', {
          timeZone: 'Africa/Lagos',
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        durationMinutes: duration,
        meetingDetails: newInterview.meetingDetails,
        interviewerNames: resolvedNames.join(', '),
      },
    });

    // Dispatch Panel Member Notifications
    for (const name of resolvedNames) {
      await dispatchNotification({
        userId: 'panel_member',
        type: 'interview_invitation',
        title: 'Assigned to Interview Panel',
        message: `You are scheduled to evaluate ${application.candidate.fullName} for ${application.jobTitle} on ${new Date(
          scheduledAt
        ).toLocaleString()}.`,
        relatedEntityId: newInterview.id,
        relatedEntityType: 'interview',
      });
    }

    auditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      actorId: req.user.id,
      actorName: req.user.name,
      action: 'INTERVIEW_SCHEDULED',
      entityType: 'interview',
      entityId: newInterview.id,
      details: `Scheduled ${newInterview.interviewType} with candidate ${application.candidate.fullName}. Panel: ${resolvedNames.join(
        ', '
      )}.`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      data: newInterview,
      message: 'Interview panel session successfully scheduled and invitations dispatched.',
    });
  }
);

/**
 * Admin: Reschedule interview
 * POST /api/v1/admin/interviews/:id/reschedule
 */
interviewsRouter.post(
  '/:id/reschedule',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin', 'recruiter']),
  async (req, res) => {
    const { id } = req.params;
    const { newScheduledAt, reason, newMeetingDetails } = req.body;

    const interview = interviews.find((i) => i.id === id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.',
      });
    }

    const newTime = new Date(newScheduledAt).getTime();
    if (isNaN(newTime) || newTime <= Date.now()) {
      return res.status(422).json({
        success: false,
        message: 'New interview date must be in the future.',
      });
    }

    // Check conflict
    const conflict = checkInterviewerConflict({
      interviewerNames: interview.interviewerNames,
      interviewerIds: interview.interviewerIds,
      scheduledAt: newScheduledAt,
      durationMinutes: interview.durationMinutes,
      excludeInterviewId: id,
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Scheduling conflict: An interviewer is already booked on ${new Date(
          conflict.scheduledAt
        ).toLocaleString()}.`,
      });
    }

    const oldScheduledAt = interview.scheduledAt;
    interview.scheduledAt = newScheduledAt;
    interview.endsAt = new Date(newTime + interview.durationMinutes * 60 * 1000).toISOString();
    interview.status = 'rescheduled';
    if (newMeetingDetails) interview.meetingDetails = newMeetingDetails;
    interview.updatedAt = new Date().toISOString();

    const application = applications.find((a) => a.id === interview.applicationId);

    // Notify candidate
    if (application) {
      await dispatchNotification({
        userId: 'all_hr',
        recipientEmail: application.candidate.email,
        recipientName: application.candidate.fullName,
        type: 'interview_rescheduled',
        title: 'Interview Rescheduled',
        message: `Interview for ${application.candidate.fullName} moved to ${new Date(
          newScheduledAt
        ).toLocaleString()}.`,
        relatedEntityId: id,
        relatedEntityType: 'interview',
        emailData: {
          jobTitle: application.jobTitle,
          scheduledTime: new Date(newScheduledAt).toLocaleString('en-GB', {
            timeZone: 'Africa/Lagos',
          }),
          meetingDetails: interview.meetingDetails,
          reason,
        },
      });
    }

    auditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      actorId: req.user.id,
      actorName: req.user.name,
      action: 'INTERVIEW_RESCHEDULED',
      entityType: 'interview',
      entityId: id,
      details: `Rescheduled interview from ${oldScheduledAt} to ${newScheduledAt}. Reason: ${
        reason || 'Not specified'
      }.`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return res.json({
      success: true,
      data: interview,
      message: 'Interview session rescheduled and parties notified.',
    });
  }
);

/**
 * Admin: Cancel interview
 * POST /api/v1/admin/interviews/:id/cancel
 */
interviewsRouter.post(
  '/:id/cancel',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin', 'recruiter']),
  async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const interview = interviews.find((i) => i.id === id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.',
      });
    }

    interview.status = 'cancelled';
    interview.updatedAt = new Date().toISOString();

    const application = applications.find((a) => a.id === interview.applicationId);
    if (application) {
      await dispatchNotification({
        userId: 'all_hr',
        recipientEmail: application.candidate.email,
        recipientName: application.candidate.fullName,
        type: 'interview_cancelled',
        title: 'Interview Cancelled',
        message: `Interview session for ${application.candidate.fullName} was cancelled.`,
        relatedEntityId: id,
        relatedEntityType: 'interview',
        emailData: {
          jobTitle: application.jobTitle,
          reason,
        },
      });
    }

    auditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      actorId: req.user.id,
      actorName: req.user.name,
      action: 'INTERVIEW_CANCELLED',
      entityType: 'interview',
      entityId: id,
      details: `Cancelled interview session. Reason: ${reason || 'Not specified'}.`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return res.json({
      success: true,
      data: interview,
      message: 'Interview session cancelled.',
    });
  }
);

/**
 * Admin: Mark interview completed
 * POST /api/v1/admin/interviews/:id/complete
 */
interviewsRouter.post(
  '/:id/complete',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin', 'recruiter', 'interviewer']),
  async (req, res) => {
    const { id } = req.params;

    const interview = interviews.find((i) => i.id === id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.',
      });
    }

    interview.status = 'completed';
    interview.updatedAt = new Date().toISOString();

    // Alert panel interviewers to submit feedback
    await dispatchNotification({
      userId: 'panel_member',
      type: 'feedback_submitted',
      title: 'Action Required: Submit Interview Feedback',
      message: `Interview with ${interview.candidateName} completed. Please submit your structured evaluation.`,
      relatedEntityId: id,
      relatedEntityType: 'interview',
    });

    auditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      actorId: req.user.id,
      actorName: req.user.name,
      action: 'INTERVIEW_COMPLETED',
      entityType: 'interview',
      entityId: id,
      details: `Marked interview session as completed for candidate ${interview.candidateName}.`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return res.json({
      success: true,
      data: interview,
      message: 'Interview marked as completed. Feedback submission requested.',
    });
  }
);

/**
 * Admin: Assign or remove interviewer
 * POST /api/v1/admin/interviews/:id/assignments
 */
interviewsRouter.post(
  '/:id/assignments',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin']),
  async (req, res) => {
    const { id } = req.params;
    const { interviewerId, interviewerName } = req.body;

    const interview = interviews.find((i) => i.id === id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.',
      });
    }

    if (!interview.interviewerNames.includes(interviewerName)) {
      interview.interviewerNames.push(interviewerName);
    }
    if (interviewerId && !interview.interviewerIds?.includes(interviewerId)) {
      interview.interviewerIds = interview.interviewerIds || [];
      interview.interviewerIds.push(interviewerId);
    }
    interview.updatedAt = new Date().toISOString();

    await dispatchNotification({
      userId: interviewerId || 'panel_member',
      type: 'assignment_created',
      title: 'Added to Interview Panel',
      message: `You were added to the panel for ${interview.candidateName} on ${new Date(
        interview.scheduledAt
      ).toLocaleString()}.`,
      relatedEntityId: id,
      relatedEntityType: 'interview',
    });

    return res.json({
      success: true,
      data: interview,
      message: `Assigned ${interviewerName} to interview panel.`,
    });
  }
);

/**
 * Admin: Retrieve interview feedback records
 * GET /api/v1/admin/interviews/:id/feedback
 */
interviewsRouter.get('/:id/feedback', authenticateToken, (req, res) => {
  const { id } = req.params;
  const feedbacks = interviewFeedback.filter((f) => f.interviewId === id);

  return res.json({
    success: true,
    data: feedbacks,
    total: feedbacks.length,
  });
});

/**
 * Admin: Submit structured interview feedback
 * POST /api/v1/admin/interviews/:id/feedback
 */
interviewsRouter.post(
  '/:id/feedback',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin', 'recruiter', 'interviewer']),
  async (req, res) => {
    const { id } = req.params;
    const {
      technicalCompetency,
      communication,
      relevantExperience,
      problemSolving,
      roleSuitability,
      strengths,
      concerns,
      comments,
      recommendation,
    } = req.body;

    const interview = interviews.find((i) => i.id === id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    const validRecommendations = [
      'strongly_recommend',
      'recommend',
      'further_assessment',
      'do_not_recommend',
      'strong_hire',
      'hire',
      'do_not_hire',
      'hold',
    ];

    if (!validRecommendations.includes(recommendation)) {
      return res.status(400).json({
        success: false,
        message: `Recommendation must be one of: ${validRecommendations.join(', ')}.`,
      });
    }

    const techScore = Number(technicalCompetency) || 4;
    const commScore = Number(communication) || 4;
    const expScore = Number(relevantExperience) || 4;
    const psScore = Number(problemSolving) || 4;
    const suitScore = Number(roleSuitability) || 4;
    const averageScore = Math.round(((techScore + commScore + expScore + psScore + suitScore) / 5) * 10) / 10;

    const newFeedback = {
      id: `fb-${Date.now().toString(36)}`,
      interviewId: id,
      applicationId: interview.applicationId,
      interviewerId: req.user.id,
      interviewerName: req.user.name,
      technicalCompetency: techScore,
      communication: commScore,
      relevantExperience: expScore,
      problemSolving: psScore,
      roleSuitability: suitScore,
      averageScore,
      strengths: strengths || '',
      concerns: concerns || '',
      comments: comments || '',
      recommendation,
      submittedAt: new Date().toISOString(),
    };

    interviewFeedback.push(newFeedback);
    interview.status = 'completed'; // auto mark completed once evaluation submitted
    interview.feedbackSummary = `${req.user.name}: ${recommendation.replace('_', ' ').toUpperCase()}`;
    interview.updatedAt = new Date().toISOString();

    // Alert HR of new feedback
    await dispatchNotification({
      userId: 'all_hr',
      type: 'feedback_submitted',
      title: 'Interview Evaluation Submitted',
      message: `${req.user.name} submitted evaluation for ${interview.candidateName} (${recommendation.replace(
        '_',
        ' '
      )}).`,
      relatedEntityId: id,
      relatedEntityType: 'interview',
    });

    auditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      actorId: req.user.id,
      actorName: req.user.name,
      action: 'FEEDBACK_SUBMITTED',
      entityType: 'interview',
      entityId: id,
      details: `Submitted interview feedback for ${interview.candidateName}. Recommendation: ${recommendation}.`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      data: newFeedback,
      message: 'Interview feedback successfully registered.',
    });
  }
);
