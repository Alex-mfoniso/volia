/**
 * VOLIA NIG LTD — Express Backend Public Consultation & Project Brief Enquiries
 */

import express from 'express';
import { enquiries } from '../data/store.js';

export const enquiriesRouter = express.Router();

/**
 * Public: Submit consultation request
 * POST /api/v1/enquiries/consultation
 */
enquiriesRouter.post('/consultation', (req, res) => {
  const { fullName, email, phone, organization, serviceInterest, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email address, and consultation message are required.',
    });
  }

  const id = `enq-${Date.now()}`;
  const reference = `VOLIA-CNS-${Math.floor(10000 + Math.random() * 90000)}`;

  const newEnquiry = {
    id,
    type: 'consultation',
    reference,
    fullName,
    email,
    phone: phone || '',
    organization: organization || '',
    serviceInterest: serviceInterest || 'General Engineering Advisory',
    message,
    status: 'received',
    createdAt: new Date().toISOString(),
  };

  enquiries.unshift(newEnquiry);

  return res.status(201).json({
    success: true,
    data: {
      id,
      reference,
    },
    message: 'Your advisory consultation request has been received.',
  });
});

/**
 * Public: Submit project brief
 * POST /api/v1/enquiries/project-brief
 */
enquiriesRouter.post('/project-brief', (req, res) => {
  const {
    projectName,
    clientName,
    email,
    phone,
    projectType,
    estimatedScale,
    siteLocation,
    briefSummary,
  } = req.body;

  if (!projectName || !clientName || !email) {
    return res.status(400).json({
      success: false,
      message: 'Project name, client name, and email address are required.',
    });
  }

  const id = `brf-${Date.now()}`;
  const reference = `VOLIA-BRF-${Math.floor(10000 + Math.random() * 90000)}`;

  const newBrief = {
    id,
    type: 'project_brief',
    reference,
    projectName,
    clientName,
    email,
    phone: phone || '',
    projectType: projectType || 'Commercial & Institutional',
    estimatedScale: estimatedScale || '',
    siteLocation: siteLocation || 'Nigeria',
    briefSummary: briefSummary || '',
    status: 'received',
    createdAt: new Date().toISOString(),
  };

  enquiries.unshift(newBrief);

  return res.status(201).json({
    success: true,
    data: {
      id,
      reference,
    },
    message: 'Project brief submitted to VOLIA Practice Directorate.',
  });
});
