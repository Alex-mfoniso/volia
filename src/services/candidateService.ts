/**
 * VOLIA NIG LTD — Candidate Management Service
 * Provides aggregated candidate profile discovery, accreditation verification,
 * and multi-commission application dossier history.
 */

import { CandidateProfile, JobApplication, InterviewSchedule } from '@/types';
import { MOCK_APPLICATIONS, MOCK_INTERVIEWS } from '@/data/mockRecruitmentData';
import { apiClient } from './api/apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

export interface CandidateDossier {
  candidate: CandidateProfile;
  applications: JobApplication[];
  interviews: InterviewSchedule[];
  totalApplications: number;
  latestStage: string;
  latestJobTitle: string;
  latestAppliedAt: string;
}

export interface CandidateFilterParams {
  search?: string;
  minExperience?: number;
  accreditation?: string;
  location?: string;
}

class CandidateService {
  /**
   * Retrieves aggregated candidate dossiers
   */
  public async getCandidates(params?: CandidateFilterParams): Promise<CandidateDossier[]> {
    if (!USE_MOCK) {
      return apiClient.get<CandidateDossier[]>('/admin/candidates', params as Record<string, string>);
    }

    // Build dossiers by aggregating applications
    const candidateMap = new Map<string, { candidate: CandidateProfile; apps: JobApplication[] }>();

    for (const app of MOCK_APPLICATIONS) {
      const candId = app.candidate.id;
      if (!candidateMap.has(candId)) {
        candidateMap.set(candId, { candidate: app.candidate, apps: [] });
      }
      candidateMap.get(candId)!.apps.push(app);
    }

    const dossiers: CandidateDossier[] = Array.from(candidateMap.values()).map(({ candidate, apps }) => {
      // Sort applications latest first
      const sortedApps = [...apps].sort(
        (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );
      const latestApp = sortedApps[0];

      // Associated interviews for this candidate
      const candidateInterviews = MOCK_INTERVIEWS.filter((i) =>
        apps.some((a) => a.id === i.applicationId)
      );

      return {
        candidate,
        applications: sortedApps,
        interviews: candidateInterviews,
        totalApplications: apps.length,
        latestStage: latestApp.stage,
        latestJobTitle: latestApp.jobTitle,
        latestAppliedAt: latestApp.appliedAt,
      };
    });

    return dossiers.filter((dossier) => {
      const c = dossier.candidate;
      if (params?.search) {
        const q = params.search.toLowerCase();
        const matchName = c.fullName.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchPhone = c.phone.toLowerCase().includes(q);
        const matchAccreditation = c.professionalAccreditation?.toLowerCase().includes(q);
        const matchTitle = c.currentTitle?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchAccreditation && !matchTitle) {
          return false;
        }
      }

      if (params?.minExperience !== undefined && params.minExperience > 0) {
        if (c.yearsOfExperience < params.minExperience) return false;
      }

      if (params?.accreditation && params.accreditation !== 'all') {
        const acc = params.accreditation.toLowerCase();
        if (!c.professionalAccreditation?.toLowerCase().includes(acc)) return false;
      }

      if (params?.location && params.location !== 'all') {
        if (!c.currentLocation.toLowerCase().includes(params.location.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Retrieves single candidate dossier by Candidate ID
   */
  public async getCandidateById(id: string): Promise<CandidateDossier | null> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<CandidateDossier>(`/admin/candidates/${id}`);
      } catch {
        return null;
      }
    }

    const allDossiers = await this.getCandidates();
    return allDossiers.find((d) => d.candidate.id === id) || null;
  }
}

export const candidateService = new CandidateService();
