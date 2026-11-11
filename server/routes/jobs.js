/**
 * VOLIA NIG LTD — Express Backend Job Vacancy Routes
 */

import express from 'express';
import crypto from 'crypto';
import { jobs, applications } from '../data/store.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';

export const jobsRouter = express.Router();

/**
 * Public: List published vacancies
 * GET /api/v1/jobs
 */
jobsRouter.get('/', (req, res) => {
  const { search, department, type, experienceLevel } = req.query;

  let filtered = jobs.filter((j) => j.status === 'published');

  if (department && department !== 'all') {
    filtered = filtered.filter((j) => j.department.toLowerCase() === department.toLowerCase());
  }

  if (type && type !== 'all') {
    filtered = filtered.filter((j) => (j.type || j.employmentType) === type);
  }

  if (experienceLevel && experienceLevel !== 'all') {
    filtered = filtered.filter((j) => j.experienceLevel === experienceLevel);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((j) => {
      return (
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        (j.overview && j.overview.toLowerCase().includes(q))
      );
    });
  }

  return res.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
});

/**
 * Public: Retrieve specific vacancy by slug or ID
 * GET /api/v1/jobs/:slug
 */
jobsRouter.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const job = jobs.find((j) => j.slug === slug || j.id === slug);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Recruitment specification not found.',
    });
  }

  return res.json({
    success: true,
    data: job,
  });
});

/**
 * Admin: List all vacancies (published, draft, closed, archived)
 * GET /api/v1/admin/jobs
 */
jobsRouter.get('/admin/all', authenticateToken, (req, res) => {
  const { search, department, status } = req.query;

  let filtered = [...jobs];

  if (status && status !== 'all') {
    filtered = filtered.filter((j) => j.status === status);
  }

  if (department && department !== 'all') {
    filtered = filtered.filter((j) => j.department.toLowerCase() === department.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((j) => {
      return (
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    });
  }

  return res.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
});

/**
 * Admin: Create new vacancy
 * POST /api/v1/admin/jobs
 */
jobsRouter.post(
  '/admin/create',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin']),
  (req, res) => {
    const payload = req.body;

    if (!payload.title || !payload.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Position title is required.',
      });
    }

    const id = `job-${Date.now().toString(36)}`;
    const slug = (payload.title || 'engineering-role')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newJob = {
      id,
      slug,
      title: payload.title,
      department: payload.department || 'Engineering',
      location: payload.location || 'Abuja, FCT',
      type: payload.type || 'full_time',
      employmentType: payload.employmentType || payload.type || 'full_time',
      workArrangement: payload.workArrangement || 'on_site',
      experienceLevel: payload.experienceLevel || 'senior',
      status: payload.status || 'draft',
      overview: payload.overview || '',
      description: payload.description || payload.overview || '',
      responsibilities: payload.responsibilities || [],
      requirements: payload.requirements || [],
      qualifications: payload.qualifications || payload.requirements || [],
      experienceRequirements: payload.experienceRequirements || payload.requirements || [],
      skills: payload.skills || [],
      desirableQualifications: payload.desirableQualifications || [],
      remunerationNote: payload.remunerationNote || 'Competitive consultancy package.',
      openingsCount: Number(payload.openingsCount) || 1,
      applicationCount: 0,
      featured: Boolean(payload.featured),
      publicationDate: payload.publicationDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: payload.status === 'published' ? new Date().toISOString() : undefined,
    };

    jobs.unshift(newJob);

    return res.status(201).json({
      success: true,
      data: newJob,
      message: 'Position specification successfully created.',
    });
  }
);

/**
 * Admin: Retrieve job by ID with candidate applications
 * GET /api/v1/admin/jobs/:id
 */
jobsRouter.get('/admin/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const job = jobs.find((j) => j.id === id || j.slug === id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job posting not found.',
    });
  }

  const jobApplications = applications.filter((a) => a.jobId === job.id);

  return res.json({
    success: true,
    data: {
      ...job,
      applications: jobApplications,
    },
  });
});

/**
 * Admin: Update vacancy
 * PUT /api/v1/admin/jobs/:id
 */
jobsRouter.put(
  '/admin/:id',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin']),
  (req, res) => {
    const { id } = req.params;
    const index = jobs.findIndex((j) => j.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    const payload = req.body;
    const existing = jobs[index];

    const updated = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
      publishedAt:
        payload.status === 'published' && !existing.publishedAt
          ? new Date().toISOString()
          : existing.publishedAt,
    };

    jobs[index] = updated;

    return res.json({
      success: true,
      data: updated,
      message: 'Position specification successfully updated.',
    });
  }
);

/**
 * Admin: Update vacancy status
 * PATCH /api/v1/admin/jobs/:id/status
 */
jobsRouter.patch(
  '/admin/:id/status',
  authenticateToken,
  requireRoles(['super_admin', 'hr_admin']),
  (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const job = jobs.find((j) => j.id === id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    job.status = status;
    job.updatedAt = new Date().toISOString();
    if (status === 'published' && !job.publishedAt) {
      job.publishedAt = new Date().toISOString();
    }

    return res.json({
      success: true,
      data: job,
      message: `Status updated to ${status}.`,
    });
  }
);
