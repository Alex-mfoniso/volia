/**
 * VOLIA NIG LTD — Candidate Application & Pipeline Progression Service
 * Enforces secure resume handling, recruitment stage progression, and decision governance.
 */

import {
  JobApplication,
  JobApplicationSubmission,
  ApplicationStage,
  ApplicationNote,
  RecruitmentDecisionPayload,
} from '@/types';
import { MOCK_APPLICATIONS } from '@/data/mockRecruitmentData';
import { apiClient } from './api/apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

let memoryApplications = [...MOCK_APPLICATIONS];

export interface PipelineData {
  columns: Record<ApplicationStage, JobApplication[]>;
  totalCount: number;
  counts: Record<ApplicationStage, number>;
}

export interface PipelineFilterParams {
  jobId?: string;
  department?: string;
  recruiterId?: string;
  search?: string;
}

class JobApplicationService {
  /**
   * Public: Candidate submits job application
   */
  public async submitApplication(
    submission: JobApplicationSubmission
  ): Promise<{ applicationId: string; confirmationCode: string }> {
    // 1. Validation checks
    if (!submission.resumeFile) {
      throw new Error('A current curriculum vitae (PDF or DOCX) is required.');
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimeTypes.includes(submission.resumeFile.type)) {
      throw new Error('Resume file format must be .pdf, .doc, or .docx.');
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit
    if (submission.resumeFile.size > maxSizeBytes) {
      throw new Error('Resume file size exceeds the 5MB upload limit.');
    }

    if (!submission.consentDataProcessing) {
      throw new Error('You must consent to the processing of your application data.');
    }

    if (!USE_MOCK) {
      const formData = new FormData();
      formData.append('jobId', submission.jobId);
      formData.append('fullName', submission.fullName);
      formData.append('email', submission.email);
      formData.append('phone', submission.phone);
      formData.append('location', submission.location);
      formData.append('yearsOfExperience', String(submission.yearsOfExperience));
      formData.append('noticePeriodWeeks', String(submission.noticePeriodWeeks));
      if (submission.linkedInUrl) formData.append('linkedInUrl', submission.linkedInUrl);
      if (submission.portfolioUrl) formData.append('portfolioUrl', submission.portfolioUrl);
      if (submission.highestDegree) formData.append('highestDegree', submission.highestDegree);
      if (submission.professionalAccreditation) {
        formData.append('professionalAccreditation', submission.professionalAccreditation);
      }
      if (submission.coverLetter) formData.append('coverLetter', submission.coverLetter);
      formData.append('consentDataProcessing', 'true');
      formData.append('resume', submission.resumeFile);
      if (submission.portfolioFile) formData.append('portfolio', submission.portfolioFile);

      return apiClient.upload<{ applicationId: string; confirmationCode: string }>(
        '/careers/apply',
        formData
      );
    }

    // Mock Application Storage
    const newId = `app-${Date.now()}`;
    const confirmationCode = `VOLIA-APP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApplication: JobApplication = {
      id: newId,
      jobId: submission.jobId,
      jobTitle: 'Candidate Commission Application',
      jobDepartment: 'Engineering',
      candidate: {
        id: `cand-${Date.now()}`,
        fullName: submission.fullName,
        email: submission.email,
        phone: submission.phone,
        currentLocation: submission.location,
        yearsOfExperience: submission.yearsOfExperience,
        noticePeriodWeeks: submission.noticePeriodWeeks,
        linkedInUrl: submission.linkedInUrl,
        portfolioUrl: submission.portfolioUrl,
        highestDegree: submission.highestDegree,
        professionalAccreditation: submission.professionalAccreditation,
      },
      coverLetter: submission.coverLetter,
      resume: {
        id: `doc-${Date.now()}`,
        name: submission.resumeFile.name,
        sizeBytes: submission.resumeFile.size,
        mimeType: submission.resumeFile.type,
        uploadedAt: new Date().toISOString(),
        downloadEndpoint: `/api/v1/admin/applications/${newId}/document/resume`,
      },
      stage: 'applied',
      rating: 3,
      assignedRecruiter: { id: 'usr-3', name: 'Tariq Ibrahim' },
      stageHistory: [
        {
          stage: 'applied',
          changedById: 'system',
          changedByName: 'Candidate Submission',
          changedAt: new Date().toISOString(),
        },
      ],
      notes: [],
      interviews: [],
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryApplications = [newApplication, ...memoryApplications];

    return {
      applicationId: newId,
      confirmationCode,
    };
  }

  /**
   * Admin: List applications with stage and search filters
   */
  public async getApplications(params?: {
    stage?: string;
    jobId?: string;
    search?: string;
  }): Promise<JobApplication[]> {
    if (!USE_MOCK) {
      return apiClient.get<JobApplication[]>('/admin/applications', params as Record<string, string>);
    }

    return memoryApplications.filter((app) => {
      if (params?.stage && params.stage !== 'all' && app.stage !== params.stage) {
        return false;
      }
      if (params?.jobId && params.jobId !== 'all' && app.jobId !== params.jobId) {
        return false;
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        const matchesName = app.candidate.fullName.toLowerCase().includes(query);
        const matchesEmail = app.candidate.email.toLowerCase().includes(query);
        const matchesJob = app.jobTitle.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesJob) return false;
      }
      return true;
    });
  }

  /**
   * Admin: Retrieve specific application
   */
  public async getApplicationById(id: string): Promise<JobApplication | null> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<JobApplication>(`/admin/applications/${id}`);
      } catch {
        return null;
      }
    }

    return memoryApplications.find((a) => a.id === id) || null;
  }

  /**
   * Admin: Retrieve structured Kanban pipeline data
   */
  public async getPipeline(filters?: PipelineFilterParams): Promise<PipelineData> {
    if (!USE_MOCK) {
      return apiClient.get<PipelineData>(
        '/admin/applications/pipeline',
        filters as Record<string, string>
      );
    }

    let filtered = [...memoryApplications];
    if (filters?.jobId && filters.jobId !== 'all') {
      filtered = filtered.filter((a) => a.jobId === filters.jobId);
    }
    if (filters?.department && filters.department !== 'all') {
      filtered = filtered.filter(
        (a) => a.jobDepartment.toLowerCase() === filters.department?.toLowerCase()
      );
    }
    if (filters?.recruiterId && filters.recruiterId !== 'all') {
      filtered = filtered.filter((a) => a.assignedRecruiter?.id === filters.recruiterId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter((a) => {
        return (
          a.candidate.fullName.toLowerCase().includes(q) ||
          a.candidate.email.toLowerCase().includes(q) ||
          a.jobTitle.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
        );
      });
    }

    const columns: Record<ApplicationStage, JobApplication[]> = {
      applied: filtered.filter((a) => a.stage === 'applied'),
      screening: filtered.filter((a) => a.stage === 'screening'),
      shortlisted: filtered.filter((a) => a.stage === 'shortlisted'),
      interview: filtered.filter((a) => a.stage === 'interview'),
      assessment: filtered.filter((a) => a.stage === 'assessment'),
      offer: filtered.filter((a) => a.stage === 'offer'),
      hired: filtered.filter((a) => a.stage === 'hired'),
      rejected: filtered.filter((a) => a.stage === 'rejected'),
    };

    return {
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
    };
  }

  /**
   * Admin: Advance or change recruitment stage with server validation & rollback
   */
  public async updateApplicationStage(
    id: string,
    stage: ApplicationStage,
    actorName = 'HR Administrator',
    note?: string,
    isOverride = false,
    reason?: string
  ): Promise<JobApplication> {
    if (!USE_MOCK) {
      return apiClient.patch<JobApplication>(`/admin/applications/${id}/stage`, {
        stage,
        note,
        isOverride,
        reason,
      });
    }

    const appIndex = memoryApplications.findIndex((a) => a.id === id);
    if (appIndex === -1) {
      throw new Error(`Application ${id} not found.`);
    }

    const target = memoryApplications[appIndex];
    const newHistory = [
      ...target.stageHistory,
      {
        stage,
        changedById: 'current-user',
        changedByName: actorName,
        changedAt: new Date().toISOString(),
        note: note || (isOverride ? `Override: ${reason}` : `Transitioned to ${stage}`),
        reason,
      },
    ];

    const updated: JobApplication = {
      ...target,
      stage,
      stageHistory: newHistory,
      updatedAt: new Date().toISOString(),
    };

    memoryApplications[appIndex] = updated;
    return updated;
  }

  /**
   * Admin: Record formal recruitment decision (Offer, Hire, Reject)
   */
  public async recordDecision(
    id: string,
    payload: RecruitmentDecisionPayload
  ): Promise<JobApplication> {
    if (!USE_MOCK) {
      return apiClient.post<JobApplication>(`/admin/applications/${id}/decision`, payload);
    }

    return this.updateApplicationStage(
      id,
      payload.decision as ApplicationStage,
      'HR Directorate',
      payload.notes,
      true,
      payload.reason
    );
  }

  /**
   * Admin: Assign recruiter
   */
  public async assignRecruiter(
    id: string,
    recruiterId: string,
    recruiterName: string
  ): Promise<JobApplication> {
    if (!USE_MOCK) {
      return apiClient.patch<JobApplication>(`/admin/applications/${id}/assign`, {
        recruiterId,
        recruiterName,
      });
    }

    const target = memoryApplications.find((a) => a.id === id);
    if (!target) throw new Error(`Application ${id} not found.`);

    target.assignedRecruiter = { id: recruiterId, name: recruiterName };
    target.updatedAt = new Date().toISOString();
    return target;
  }

  /**
   * Admin: Add internal evaluation note
   */
  public async addNote(
    applicationId: string,
    content: string,
    authorName: string,
    isPrivate = false
  ): Promise<ApplicationNote> {
    if (!USE_MOCK) {
      return apiClient.post<ApplicationNote>(
        `/admin/applications/${applicationId}/notes`,
        { content, isPrivate }
      );
    }

    const app = memoryApplications.find((a) => a.id === applicationId);
    if (!app) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    const newNote: ApplicationNote = {
      id: `note-${Date.now()}`,
      authorId: 'current-user',
      authorName,
      content,
      isPrivate,
      createdAt: new Date().toISOString(),
    };

    app.notes.push(newNote);
    return newNote;
  }

  /**
   * Admin: Secure Resume Download URL
   */
  public getSecureDocumentUrl(applicationId: string, docId: string): string {
    return `/api/v1/admin/applications/${applicationId}/document/${docId}`;
  }
}

export const jobApplicationService = new JobApplicationService();
export default jobApplicationService;
