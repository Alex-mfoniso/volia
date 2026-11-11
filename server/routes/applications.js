/**
 * VOLIA NIG LTD — Express Backend Applications & Candidate Processing
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { applications, candidates, jobs, auditLogs, VALID_STAGE_TRANSITIONS } from '../data/store.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { dispatchNotification } from '../services/notificationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../uploads/documents');

export const applicationsRouter = express.Router();

/**
 * Public: Candidate submits job application
 * POST /api/v1/careers/apply
 */
applicationsRouter.post(
  '/apply',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'portfolio', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const files = req.files;
      const body = req.body;

      if (!files?.resume || files.resume.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'A current curriculum vitae (PDF or DOCX) is required.',
        });
      }

      if (!body.fullName || !body.email || !body.phone) {
        return res.status(400).json({
          success: false,
          message: 'Full name, email address, and telephone number are required.',
        });
      }

      if (body.consentDataProcessing !== 'true' && body.consentDataProcessing !== true) {
        return res.status(400).json({
          success: false,
          message: 'You must consent to NDPA data processing to submit an application.',
        });
      }

      const resumeFile = files.resume[0];
      const portfolioFile = files.portfolio?.[0];

      // Validate associated job existence, publication state, and deadline
      const job = jobs.find((j) => j.id === body.jobId || j.slug === body.jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'The requested job vacancy was not found or has been removed.',
        });
      }

      if (job.status !== 'published') {
        return res.status(400).json({
          success: false,
          message: `This vacancy is currently ${job.status} and cannot accept new applications.`,
        });
      }

      if (job.closingDate && new Date(job.closingDate).getTime() < Date.now()) {
        return res.status(400).json({
          success: false,
          message: `Applications for this vacancy closed on ${new Date(job.closingDate).toLocaleDateString()}.`,
        });
      }

      // Check for duplicate application
      const duplicate = applications.find(
        (a) => a.jobId === job.id && a.candidate.email.toLowerCase() === body.email.trim().toLowerCase()
      );
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `An application has already been submitted with email '${body.email}' for this vacancy (Reference: ${
            duplicate.confirmationCode || duplicate.id
          }).`,
        });
      }

      const jobTitle = job.title;
      const jobDepartment = job.department;

      const candidateId = `cand-${Date.now().toString(36)}`;
      const newCandidate = {
        id: candidateId,
        fullName: body.fullName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        currentLocation: body.location || 'Nigeria',
        currentTitle: body.currentJobTitle || 'Consulting Engineer',
        yearsOfExperience: Number(body.yearsOfExperience) || 0,
        highestDegree: body.highestDegree || body.highestQualification || 'B.Sc. / B.Eng.',
        professionalAccreditation: body.professionalAccreditation || undefined,
        noticePeriodWeeks: Number(body.noticePeriodWeeks) || 4,
        linkedInUrl: body.linkedInUrl || undefined,
        portfolioUrl: body.portfolioUrl || undefined,
      };

      // Check if candidate already exists by email, update or insert
      const existingCandidateIdx = candidates.findIndex(
        (c) => c.email.toLowerCase() === newCandidate.email
      );
      if (existingCandidateIdx >= 0) {
        candidates[existingCandidateIdx] = { ...candidates[existingCandidateIdx], ...newCandidate };
      } else {
        candidates.push(newCandidate);
      }

      const applicationId = `app-${Date.now().toString(36)}`;
      const confirmationCode = `VOLIA-APP-${Math.floor(100000 + Math.random() * 900000)}`;

      const newApplication = {
        id: applicationId,
        jobId: job ? job.id : body.jobId,
        jobTitle,
        jobDepartment,
        candidate: newCandidate,
        coverLetter: body.coverLetter || '',
        resume: {
          id: `doc-${Date.now()}-res`,
          name: resumeFile.originalname,
          sizeBytes: resumeFile.size,
          mimeType: resumeFile.mimetype,
          uploadedAt: new Date().toISOString(),
          downloadEndpoint: `/api/v1/admin/applications/${applicationId}/document/resume`,
          filepath: resumeFile.path,
        },
        portfolioDocument: portfolioFile
          ? {
              id: `doc-${Date.now()}-port`,
              name: portfolioFile.originalname,
              sizeBytes: portfolioFile.size,
              mimeType: portfolioFile.mimetype,
              uploadedAt: new Date().toISOString(),
              downloadEndpoint: `/api/v1/admin/applications/${applicationId}/document/portfolio`,
              filepath: portfolioFile.path,
            }
          : undefined,
        stage: 'applied',
        rating: 3,
        stageHistory: [
          {
            stage: 'applied',
            changedById: 'system',
            changedByName: 'Candidate Submission',
            changedAt: new Date().toISOString(),
            note: 'Application received and verified via talent portal.',
          },
        ],
        notes: [],
        interviews: [],
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      applications.unshift(newApplication);

      if (job) {
        job.applicationCount = (job.applicationCount || 0) + 1;
      }

      // Record audit log
      auditLogs.unshift({
        id: `aud-${Date.now()}`,
        actorId: 'system',
        actorName: 'Candidate Portal',
        action: 'APPLICATION_SUBMITTED',
        entityType: 'application',
        entityId: applicationId,
        details: `Application received from ${newCandidate.fullName} for ${jobTitle}.`,
        ipAddress: req.ip || '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      return res.status(201).json({
        success: true,
        data: {
          applicationId,
          confirmationCode,
        },
        message: 'Your application has been received and registered securely.',
      });
    } catch (err) {
      console.error('Application submission error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to process application. Please review your file sizes and try again.',
      });
    }
  }
);

/**
 * Admin: Pipeline Kanban aggregation
 * GET /api/v1/admin/applications/pipeline
 */
applicationsRouter.get('/pipeline', authenticateToken, (req, res) => {
  const { jobId, department, recruiterId, search } = req.query;

  let filtered = [...applications];

  if (jobId && jobId !== 'all') {
    filtered = filtered.filter((a) => a.jobId === jobId);
  }

  if (department && department !== 'all') {
    filtered = filtered.filter((a) => a.jobDepartment.toLowerCase() === department.toLowerCase());
  }

  if (recruiterId && recruiterId !== 'all') {
    filtered = filtered.filter((a) => a.assignedRecruiter?.id === recruiterId);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((a) => {
      const matchName = a.candidate.fullName.toLowerCase().includes(q);
      const matchEmail = a.candidate.email.toLowerCase().includes(q);
      const matchJob = a.jobTitle.toLowerCase().includes(q);
      const matchRef = a.id.toLowerCase().includes(q);
      return matchName || matchEmail || matchJob || matchRef;
    });
  }

  const columns = {
    applied: filtered.filter((a) => a.stage === 'applied'),
    screening: filtered.filter((a) => a.stage === 'screening'),
    shortlisted: filtered.filter((a) => a.stage === 'shortlisted'),
    interview: filtered.filter((a) => a.stage === 'interview'),
    assessment: filtered.filter((a) => a.stage === 'assessment'),
    offer: filtered.filter((a) => a.stage === 'offer'),
    hired: filtered.filter((a) => a.stage === 'hired'),
    rejected: filtered.filter((a) => a.stage === 'rejected'),
  };

  return res.json({
    success: true,
    data: {
      columns,
      totalCount: filtered.length,
      counts: {
        applied: columns.applied.length,
        screening: columns.screening.length,
        shortlisted: columns.shortlisted.length,
        interview: columns.interview.length,
        assessment: columns.assessment.length,
        offer: columns.offer.length,
        hired: columns.hired.length,
        rejected: columns.rejected.length,
      },
    },
  });
});

/**
 * Admin: List applications
 * GET /api/v1/admin/applications
 */
applicationsRouter.get('/', authenticateToken, (req, res) => {
  const { stage, jobId, search } = req.query;

  let filtered = [...applications];

  if (stage && stage !== 'all') {
    filtered = filtered.filter((a) => a.stage === stage);
  }

  if (jobId && jobId !== 'all') {
    filtered = filtered.filter((a) => a.jobId === jobId);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((a) => {
      const matchName = a.candidate.fullName.toLowerCase().includes(q);
      const matchEmail = a.candidate.email.toLowerCase().includes(q);
      const matchJob = a.jobTitle.toLowerCase().includes(q);
      return matchName || matchEmail || matchJob;
    });
  }

  return res.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
});

/**
 * Admin: Retrieve specific application
 * GET /api/v1/admin/applications/:id
 */
applicationsRouter.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const application = applications.find((a) => a.id === id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found.',
    });
  }

  return res.json({
    success: true,
    data: application,
  });
});

/**
 * Admin: Update recruitment stage with transition validation & auditing
 * PATCH /api/v1/admin/applications/:id/stage (and /status)
 */
const handleStageUpdate = async (req, res) => {
  const { id } = req.params;
  const stage = req.body.stage;
  const note = req.body.note || req.body.notes;
  const reason = req.body.reason || req.body.overrideReason;
  const isOverride = Boolean(req.body.isOverride || req.body.override);

  const application = applications.find((a) => a.id === id);
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found.',
    });
  }

  const previousStage = application.stage;

  // 1. Validate Transition
  const allowedNext = VALID_STAGE_TRANSITIONS[previousStage] || [];
  const isSuperOrHrAdmin = req.user.role === 'super_admin' || req.user.role === 'hr_admin';

  if (!allowedNext.includes(stage)) {
    // If not a standard transition, only super_admin/hr_admin may override with an explicit reason
    if (!isSuperOrHrAdmin || !isOverride || !reason) {
      return res.status(422).json({
        success: false,
        message: `Invalid stage transition from '${previousStage}' to '${stage}'. Permitted transitions: ${
          allowedNext.length > 0 ? allowedNext.join(', ') : 'None (Terminal Stage)'
        }.${isSuperOrHrAdmin ? ' Administrative overrides require an explicit override reason.' : ''}`,
        currentStage: previousStage,
      });
    }
  }

  // 2. Perform transition
  application.stage = stage;
  application.updatedAt = new Date().toISOString();

  const historyItem = {
    stage,
    previousStage,
    changedById: req.user.id,
    changedByName: req.user.name,
    changedAt: new Date().toISOString(),
    note: note || (isOverride ? `Administrative override: ${reason}` : `Advanced to ${stage}.`),
    reason: reason || undefined,
  };

  application.stageHistory.push(historyItem);

  // 3. Dispatch Candidate and Internal Notifications
  await dispatchNotification({
    userId: 'all_hr',
    recipientEmail: application.candidate.email,
    recipientName: application.candidate.fullName,
    type: 'application_status_updated',
    title: `Candidate Advanced: ${stage.toUpperCase()}`,
    message: `${application.candidate.fullName} has been moved to ${stage} for ${application.jobTitle}.`,
    relatedEntityId: application.id,
    relatedEntityType: 'application',
    emailData: {
      jobTitle: application.jobTitle,
      applicationReference: application.id.toUpperCase(),
      stage,
      message: `Your application stage has been updated to: ${stage.replace('_', ' ').toUpperCase()}.`,
    },
  });

  // 4. Audit Log
  auditLogs.unshift({
    id: `aud-${Date.now().toString(36)}`,
    actorId: req.user.id,
    actorName: req.user.name,
    action: isOverride ? 'APPLICATION_STAGE_OVERRIDDEN' : 'APPLICATION_STAGE_CHANGED',
    entityType: 'application',
    entityId: id,
    details: `Transitioned candidate ${application.candidate.fullName} from ${previousStage} to ${stage}. ${
      reason ? `Reason: ${reason}` : ''
    }`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    data: application,
    message: `Candidate stage successfully updated to ${stage}.`,
  });
};

applicationsRouter.patch('/:id/stage', authenticateToken, requireRoles(['super_admin', 'hr_admin', 'recruiter']), handleStageUpdate);
applicationsRouter.patch('/:id/status', authenticateToken, requireRoles(['super_admin', 'hr_admin', 'recruiter']), handleStageUpdate);

/**
 * Admin: Assign recruiter
 * PATCH /api/v1/admin/applications/:id/assign
 */
applicationsRouter.patch(
  '/:id/assign',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin']),
  async (req, res) => {
    const { id } = req.params;
    const { recruiterId, recruiterName } = req.body;

    const application = applications.find((a) => a.id === id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    application.assignedRecruiter = {
      id: recruiterId,
      name: recruiterName,
    };
    application.updatedAt = new Date().toISOString();

    await dispatchNotification({
      userId: recruiterId,
      type: 'assignment_created',
      title: 'New Candidate Assigned',
      message: `You have been assigned to review ${application.candidate.fullName} for ${application.jobTitle}.`,
      relatedEntityId: application.id,
      relatedEntityType: 'application',
    });

    auditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      actorId: req.user.id,
      actorName: req.user.name,
      action: 'RECRUITER_ASSIGNED',
      entityType: 'application',
      entityId: id,
      details: `Assigned recruiter ${recruiterName} to ${application.candidate.fullName}.`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return res.json({
      success: true,
      data: application,
      message: `Assigned recruiter ${recruiterName} successfully.`,
    });
  }
);

/**
 * Admin: Record formal recruitment decision (Offer, Hire, Reject)
 * POST /api/v1/admin/applications/:id/decision
 */
applicationsRouter.post(
  '/:id/decision',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin']),
  async (req, res) => {
    const { id } = req.params;
    const { decision, reason, notes, sendEmailNotification } = req.body;

    const validDecisions = ['offer', 'hired', 'rejected'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({
        success: false,
        message: `Decision must be one of: ${validDecisions.join(', ')}.`,
      });
    }

    const application = applications.find((a) => a.id === id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    const previousStage = application.stage;
    application.stage = decision;
    application.updatedAt = new Date().toISOString();

    application.stageHistory.push({
      stage: decision,
      previousStage,
      changedById: req.user.id,
      changedByName: req.user.name,
      changedAt: new Date().toISOString(),
      note: `Formal recruitment decision: ${decision.toUpperCase()}. ${reason ? `Reason: ${reason}` : ''}`,
      reason,
    });

    if (notes) {
      application.notes.push({
        id: `note-${Date.now()}`,
        authorId: req.user.id,
        authorName: req.user.name,
        content: `Decision Note: ${notes}`,
        isPrivate: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Only dispatch candidate email if HR explicitly confirmed
    if (sendEmailNotification) {
      await dispatchNotification({
        userId: 'all_hr',
        recipientEmail: application.candidate.email,
        recipientName: application.candidate.fullName,
        type: 'recruitment_outcome',
        title: `Commission Outcome: ${decision.toUpperCase()}`,
        message: `Recruitment outcome communicated to ${application.candidate.fullName}.`,
        relatedEntityId: application.id,
        relatedEntityType: 'application',
        emailData: {
          jobTitle: application.jobTitle,
          department: application.jobDepartment,
          applicationReference: application.id.toUpperCase(),
          decision,
          reason,
        },
      });
    }

    auditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      actorId: req.user.id,
      actorName: req.user.name,
      action: 'RECRUITMENT_DECISION_RECORDED',
      entityType: 'application',
      entityId: id,
      details: `Recorded decision '${decision}' for candidate ${application.candidate.fullName}. Email notified: ${Boolean(
        sendEmailNotification
      )}.`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return res.json({
      success: true,
      data: application,
      message: `Recruitment decision '${decision}' recorded successfully.${
        sendEmailNotification ? ' Candidate communication dispatched.' : ''
      }`,
    });
  }
);

/**
 * Admin: Add review note
 * POST /api/v1/admin/applications/:id/notes
 */
applicationsRouter.post('/:id/notes', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { content, isPrivate } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Note content cannot be empty.',
    });
  }

  const application = applications.find((a) => a.id === id);
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found.',
    });
  }

  const newNote = {
    id: `note-${Date.now()}`,
    authorId: req.user.id,
    authorName: req.user.name,
    content: content.trim(),
    isPrivate: Boolean(isPrivate),
    createdAt: new Date().toISOString(),
  };

  application.notes.push(newNote);

  return res.status(201).json({
    success: true,
    data: newNote,
    message: 'Evaluation note added.',
  });
});

/**
 * Admin: Secure document download with authentication and path traversal protection
 * GET /api/v1/admin/applications/:id/document/:docType
 */
applicationsRouter.get(
  '/:id/document/:docType',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin', 'recruiter', 'interviewer']),
  (req, res) => {
    const { id, docType } = req.params;
    const application = applications.find((a) => a.id === id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application document not found.' });
    }

    const doc = docType === 'portfolio' ? application.portfolioDocument : application.resume;
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found on this application.' });
    }

    // Role check: Interviewers can only access documents for their assigned interviews
    if (req.user.role === 'interviewer') {
      const hasInterview = application.interviews?.some(
        (i) => i.interviewerIds?.includes(req.user.id) || i.panelLeadId === req.user.id
      );
      if (!hasInterview) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Interviewers may only access candidate dossiers for their assigned panels.',
        });
      }
    }

    if (doc.filepath) {
      const resolvedPath = path.resolve(doc.filepath);
      if (!resolvedPath.startsWith(uploadDir)) {
        return res.status(403).json({ success: false, message: 'Access denied: Path traversal attempt detected.' });
      }
      if (fs.existsSync(resolvedPath)) {
        return res.download(resolvedPath, doc.name);
      }
    }

    // If synthetic/mock document, generate a clean sample text response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.name}"`);
    return res.send(
      `VOLIA NIG LTD — Confidential Candidate Application Document\n` +
        `Document Name: ${doc.name}\n` +
        `Candidate: ${application.candidate.fullName}\n` +
        `Position: ${application.jobTitle}\n` +
        `Uploaded: ${doc.uploadedAt}\n` +
        `Status: NDPA 2023 Verified\n`
    );
  }
);
