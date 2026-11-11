/**
 * VOLIA NIG LTD — Interview Scheduling, Governance & Evaluation Service
 */

import {
  InterviewSchedule,
  InterviewFeedback,
  RecruitmentMetrics,
  AuditLogItem,
} from '@/types';
import {
  MOCK_INTERVIEWS,
  MOCK_RECRUITMENT_METRICS,
  MOCK_AUDIT_LOGS,
} from '@/data/mockRecruitmentData';
import { apiClient } from './api/apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

let memoryInterviews = [...MOCK_INTERVIEWS];
let memoryAuditLogs = [...MOCK_AUDIT_LOGS];
let memoryFeedback: InterviewFeedback[] = [
  {
    id: 'fb-001',
    interviewId: 'int-001',
    applicationId: 'app-001',
    interviewerId: 'usr-4',
    interviewerName: 'Chukwuemeka Okonkwo, FNSE',
    technicalCompetency: 5,
    communication: 4,
    relevantExperience: 5,
    problemSolving: 5,
    roleSuitability: 5,
    strengths:
      'Mastery of finite element dynamic analysis in ETABS, profound grasp of post-tensioned beam tendons and wind shear walls.',
    concerns: 'Notice period of 4 weeks must be accounted for in commissioning timetable.',
    comments:
      'Candidate has actively stamped multi-storey commercial towers in Victoria Island. High engineering caliber.',
    recommendation: 'strongly_recommend',
    submittedAt: '2026-11-05T16:00:00Z',
  },
];

export interface InterviewFilterParams {
  status?: string;
  type?: string;
  interviewerId?: string;
  department?: string;
  jobId?: string;
  date?: string;
}

class InterviewService {
  /**
   * Admin: List scheduled interviews with optional filtering
   */
  public async getInterviews(filters?: InterviewFilterParams): Promise<InterviewSchedule[]> {
    if (!USE_MOCK) {
      return apiClient.get<InterviewSchedule[]>('/admin/interviews', filters as Record<string, string>);
    }

    let filtered = [...memoryInterviews];
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter((i) => i.status === filters.status);
    }
    if (filters?.type && filters.type !== 'all') {
      filtered = filtered.filter((i) => i.interviewType === filters.type);
    }
    if (filters?.date) {
      const target = new Date(filters.date).toISOString().split('T')[0];
      filtered = filtered.filter((i) => i.scheduledAt.startsWith(target));
    }

    return filtered.sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  }

  /**
   * Admin: Retrieve specific interview session
   */
  public async getInterviewById(id: string): Promise<InterviewSchedule | null> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<InterviewSchedule>(`/admin/interviews/${id}`);
      } catch {
        return null;
      }
    }

    return memoryInterviews.find((i) => i.id === id) || null;
  }

  /**
   * Admin: Schedule new technical / panel interview with conflict detection
   */
  public async scheduleInterview(
    data: Partial<InterviewSchedule>
  ): Promise<InterviewSchedule> {
    if (!USE_MOCK) {
      return apiClient.post<InterviewSchedule>('/admin/interviews', data);
    }

    const newInterview: InterviewSchedule = {
      id: `int-${Date.now()}`,
      applicationId: data.applicationId || 'app-unknown',
      candidateName: data.candidateName || 'Candidate',
      candidateEmail: data.candidateEmail || 'candidate@example.com',
      jobTitle: data.jobTitle || 'Role',
      interviewRound: data.interviewRound || 'Round 1: Technical Assessment',
      interviewType: data.interviewType || 'technical_assessment',
      interviewerNames: data.interviewerNames || ['Amina Bello, MNIA'],
      interviewerIds: data.interviewerIds || [],
      scheduledAt: data.scheduledAt || new Date().toISOString(),
      durationMinutes: data.durationMinutes || 60,
      mode: data.mode || 'virtual_secure_meeting',
      meetingDetails: data.meetingDetails || 'Encrypted Video Bridge',
      status: 'scheduled',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryInterviews.unshift(newInterview);

    memoryAuditLogs.unshift({
      id: `aud-${Date.now()}`,
      actorId: 'current-user',
      actorName: 'HR Recruiter',
      action: 'INTERVIEW_SCHEDULED',
      entityType: 'interview',
      entityId: newInterview.id,
      details: `Scheduled ${newInterview.interviewType} with ${newInterview.candidateName}`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return newInterview;
  }

  /**
   * Admin: Reschedule interview
   */
  public async rescheduleInterview(
    id: string,
    newScheduledAt: string,
    reason?: string,
    newMeetingDetails?: string
  ): Promise<InterviewSchedule> {
    if (!USE_MOCK) {
      return apiClient.post<InterviewSchedule>(`/admin/interviews/${id}/reschedule`, {
        newScheduledAt,
        reason,
        newMeetingDetails,
      });
    }

    const target = memoryInterviews.find((i) => i.id === id);
    if (!target) throw new Error(`Interview ${id} not found.`);

    target.scheduledAt = newScheduledAt;
    target.status = 'rescheduled';
    if (newMeetingDetails) target.meetingDetails = newMeetingDetails;
    target.updatedAt = new Date().toISOString();

    return target;
  }

  /**
   * Admin: Cancel interview
   */
  public async cancelInterview(id: string, reason?: string): Promise<InterviewSchedule> {
    if (!USE_MOCK) {
      return apiClient.post<InterviewSchedule>(`/admin/interviews/${id}/cancel`, { reason });
    }

    const target = memoryInterviews.find((i) => i.id === id);
    if (!target) throw new Error(`Interview ${id} not found.`);

    target.status = 'cancelled';
    target.updatedAt = new Date().toISOString();
    return target;
  }

  /**
   * Admin: Mark interview as completed
   */
  public async completeInterview(id: string): Promise<InterviewSchedule> {
    if (!USE_MOCK) {
      return apiClient.post<InterviewSchedule>(`/admin/interviews/${id}/complete`, {});
    }

    const target = memoryInterviews.find((i) => i.id === id);
    if (!target) throw new Error(`Interview ${id} not found.`);

    target.status = 'completed';
    target.updatedAt = new Date().toISOString();
    return target;
  }

  /**
   * Admin: Assign interviewer to panel
   */
  public async assignInterviewer(
    id: string,
    interviewerId: string,
    interviewerName: string
  ): Promise<InterviewSchedule> {
    if (!USE_MOCK) {
      return apiClient.post<InterviewSchedule>(`/admin/interviews/${id}/assignments`, {
        interviewerId,
        interviewerName,
      });
    }

    const target = memoryInterviews.find((i) => i.id === id);
    if (!target) throw new Error(`Interview ${id} not found.`);

    if (!target.interviewerNames.includes(interviewerName)) {
      target.interviewerNames.push(interviewerName);
    }
    target.updatedAt = new Date().toISOString();
    return target;
  }

  /**
   * Admin: Retrieve interview feedback
   */
  public async getFeedback(interviewId: string): Promise<InterviewFeedback[]> {
    if (!USE_MOCK) {
      return apiClient.get<InterviewFeedback[]>(`/admin/interviews/${interviewId}/feedback`);
    }

    return memoryFeedback.filter((f) => f.interviewId === interviewId);
  }

  /**
   * Admin: Submit structured interview evaluation feedback
   */
  public async submitFeedback(
    interviewId: string,
    feedback: Partial<InterviewFeedback>
  ): Promise<InterviewFeedback> {
    if (!USE_MOCK) {
      return apiClient.post<InterviewFeedback>(`/admin/interviews/${interviewId}/feedback`, feedback);
    }

    const newFeedback: InterviewFeedback = {
      id: `fb-${Date.now()}`,
      interviewId,
      applicationId: feedback.applicationId || 'app-001',
      interviewerId: feedback.interviewerId || 'usr-4',
      interviewerName: feedback.interviewerName || 'Panel Interviewer',
      technicalCompetency: feedback.technicalCompetency || 4,
      communication: feedback.communication || 4,
      relevantExperience: feedback.relevantExperience || 4,
      problemSolving: feedback.problemSolving || 4,
      roleSuitability: feedback.roleSuitability || 4,
      strengths: feedback.strengths || '',
      concerns: feedback.concerns || '',
      comments: feedback.comments || '',
      recommendation: feedback.recommendation || 'recommend',
      submittedAt: new Date().toISOString(),
    };

    memoryFeedback.push(newFeedback);

    const interview = memoryInterviews.find((i) => i.id === interviewId);
    if (interview) {
      interview.status = 'completed';
      interview.feedbackSummary = `${newFeedback.interviewerName}: ${newFeedback.recommendation.toUpperCase()}`;
    }

    return newFeedback;
  }

  /**
   * Legacy status change method
   */
  public async updateInterviewStatus(
    id: string,
    status: InterviewSchedule['status']
  ): Promise<InterviewSchedule> {
    if (status === 'completed') return this.completeInterview(id);
    if (status === 'cancelled') return this.cancelInterview(id);
    if (!USE_MOCK) {
      return apiClient.patch<InterviewSchedule>(`/admin/interviews/${id}`, { status });
    }
    const target = memoryInterviews.find((i) => i.id === id);
    if (!target) throw new Error(`Interview ${id} not found.`);
    target.status = status;
    return target;
  }

  /**
   * Admin: Pipeline & Recruitment Analytics
   */
  public async getRecruitmentMetrics(): Promise<RecruitmentMetrics> {
    if (!USE_MOCK) {
      return apiClient.get<RecruitmentMetrics>('/admin/dashboard/metrics');
    }
    return MOCK_RECRUITMENT_METRICS;
  }

  /**
   * Admin: Audit Trail
   */
  public async getAuditLogs(): Promise<AuditLogItem[]> {
    if (!USE_MOCK) {
      return apiClient.get<AuditLogItem[]>('/admin/dashboard/activity');
    }
    return memoryAuditLogs;
  }
}

export const interviewService = new InterviewService();
