/**
 * VOLIA NIG LTD — Express Backend Candidates Directory Routes
 */

import express from 'express';
import { candidates, applications, interviews } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

export const candidatesRouter = express.Router();

/**
 * Admin: List candidates with aggregation
 * GET /api/v1/admin/candidates
 */
candidatesRouter.get('/', authenticateToken, (req, res) => {
  const { search, minExperience, accreditation, location } = req.query;

  // Build candidate dossiers
  const dossiers = candidates.map((candidate) => {
    const candidateApps = applications
      .filter((a) => a.candidate.id === candidate.id || a.candidate.email === candidate.email)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    const candidateInterviews = interviews.filter((i) =>
      candidateApps.some((a) => a.id === i.applicationId)
    );

    const latestApp = candidateApps[0];

    return {
      candidate,
      applications: candidateApps,
      interviews: candidateInterviews,
      totalApplications: candidateApps.length,
      latestStage: latestApp ? latestApp.stage : 'applied',
      latestJobTitle: latestApp ? latestApp.jobTitle : 'General Consideration',
      latestAppliedAt: latestApp ? latestApp.appliedAt : candidate.createdAt || new Date().toISOString(),
    };
  });

  let filtered = dossiers;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((d) => {
      const c = d.candidate;
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.currentTitle && c.currentTitle.toLowerCase().includes(q)) ||
        (c.professionalAccreditation && c.professionalAccreditation.toLowerCase().includes(q))
      );
    });
  }

  if (minExperience && Number(minExperience) > 0) {
    filtered = filtered.filter((d) => d.candidate.yearsOfExperience >= Number(minExperience));
  }

  if (accreditation && accreditation !== 'all') {
    const acc = accreditation.toLowerCase();
    filtered = filtered.filter((d) =>
      d.candidate.professionalAccreditation?.toLowerCase().includes(acc)
    );
  }

  if (location && location !== 'all') {
    filtered = filtered.filter((d) =>
      d.candidate.currentLocation?.toLowerCase().includes(location.toLowerCase())
    );
  }

  return res.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
});

/**
 * Admin: Retrieve single candidate dossier
 * GET /api/v1/admin/candidates/:id
 */
candidatesRouter.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: 'Candidate record not found.',
    });
  }

  const candidateApps = applications
    .filter((a) => a.candidate.id === candidate.id || a.candidate.email === candidate.email)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  const candidateInterviews = interviews.filter((i) =>
    candidateApps.some((a) => a.id === i.applicationId)
  );

  const latestApp = candidateApps[0];

  const dossier = {
    candidate,
    applications: candidateApps,
    interviews: candidateInterviews,
    totalApplications: candidateApps.length,
    latestStage: latestApp ? latestApp.stage : 'applied',
    latestJobTitle: latestApp ? latestApp.jobTitle : 'General Consideration',
    latestAppliedAt: latestApp ? latestApp.appliedAt : new Date().toISOString(),
  };

  return res.json({
    success: true,
    data: dossier,
  });
});
