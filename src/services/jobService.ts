/**
 * VOLIA NIG LTD — Job Postings Management Service
 * Supports public portal listings and authenticated HR management
 */

import { JobPosting, JobStatus } from '@/types';
import { MOCK_JOB_POSTINGS } from '@/data/mockRecruitmentData';
import { apiClient } from './api/apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// In-memory state for development mock session
let memoryJobs = [...MOCK_JOB_POSTINGS];

export interface PublicJobFilterOptions {
  department?: string;
  employmentType?: string;
  workArrangement?: string;
  location?: string;
  search?: string;
  sort?: 'newest' | 'closing_soon' | 'title';
}

class JobService {
  /**
   * Public: Retrieve published and open job vacancies
   */
  public async getPublicJobs(filters?: PublicJobFilterOptions): Promise<JobPosting[]> {
    if (!USE_MOCK) {
      return apiClient.get<JobPosting[]>('/careers/jobs', filters as Record<string, string>);
    }

    const now = new Date().toISOString();

    let result = memoryJobs.filter((job) => {
      // Rule: Only published and unclosed vacancies are presented publicly
      if (job.status !== 'published') return false;

      // Check if closingDate has already passed
      if (job.closingDate && job.closingDate < now) return false;

      // Filter: Department
      if (filters?.department && filters.department !== 'All' && job.department !== filters.department) {
        return false;
      }

      // Filter: Employment Type
      if (filters?.employmentType && filters.employmentType !== 'All') {
        const jobType = job.employmentType || job.type;
        if (jobType !== filters.employmentType) return false;
      }

      // Filter: Work Arrangement
      if (filters?.workArrangement && filters.workArrangement !== 'All') {
        if (job.workArrangement !== filters.workArrangement) return false;
      }

      // Filter: Location
      if (filters?.location && filters.location !== 'All') {
        if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Search Query: Title, location, description, or skills
      if (filters?.search && filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesLoc = job.location.toLowerCase().includes(query);
        const matchesDesc = (job.description || job.overview || '').toLowerCase().includes(query);
        const matchesSkills = (job.skills || []).some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesLoc && !matchesDesc && !matchesSkills) return false;
      }

      return true;
    });

    // Sorting
    if (filters?.sort === 'closing_soon') {
      result.sort((a, b) => {
        if (!a.closingDate) return 1;
        if (!b.closingDate) return -1;
        return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
      });
    } else if (filters?.sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: Newest first
      result.sort((a, b) => {
        const dateA = a.publicationDate || a.publishedAt || a.createdAt;
        const dateB = b.publicationDate || b.publishedAt || b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    }

    return result;
  }

  /**
   * Public: Retrieve featured vacancies
   */
  public async getFeaturedJobs(): Promise<JobPosting[]> {
    const all = await this.getPublicJobs();
    return all.filter((j) => j.featured);
  }

  /**
   * Public: Retrieve related open vacancies (same discipline or department)
   */
  public async getRelatedJobs(currentJobId: string, department: string): Promise<JobPosting[]> {
    const all = await this.getPublicJobs();
    const related = all.filter((j) => j.id !== currentJobId && j.department === department);
    if (related.length > 0) return related.slice(0, 3);
    // Fallback: Other open jobs
    return all.filter((j) => j.id !== currentJobId).slice(0, 3);
  }

  /**
   * Public: Retrieve single job by URL slug
   */
  public async getJobBySlug(slug: string): Promise<JobPosting | null> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<JobPosting>(`/careers/jobs/${slug}`);
      } catch {
        return null;
      }
    }

    const job = memoryJobs.find((j) => j.slug === slug);
    return job || null;
  }

  /**
   * Admin: Retrieve all jobs (including drafts, closed, archived)
   */
  public async getAdminJobs(params?: { status?: string; search?: string }): Promise<JobPosting[]> {
    if (!USE_MOCK) {
      return apiClient.get<JobPosting[]>('/admin/jobs', params as Record<string, string>);
    }

    let result = [...memoryJobs];
    if (params?.status && params.status !== 'all') {
      result = result.filter((j) => j.status === params.status);
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      result = result.filter((j) => j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q));
    }
    return result;
  }

  /**
   * Alias for getAdminJobs
   */
  public async getJobs(params?: { status?: string; search?: string }): Promise<JobPosting[]> {
    return this.getAdminJobs(params);
  }

  /**
   * Admin: Retrieve job by ID
   */
  public async getJobById(id: string): Promise<JobPosting | null> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<JobPosting>(`/admin/jobs/${id}`);
      } catch {
        return null;
      }
    }

    return memoryJobs.find((j) => j.id === id) || null;
  }

  /**
   * Admin: Create new job posting
   */
  public async createJob(payload: Partial<JobPosting>): Promise<JobPosting> {
    if (!USE_MOCK) {
      return apiClient.post<JobPosting>('/admin/jobs', payload);
    }

    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      slug: (payload.title || 'engineering-role')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
      title: payload.title || 'Untitled Opportunity',
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
      openingsCount: payload.openingsCount || 1,
      applicationCount: 0,
      featured: payload.featured || false,
      isDemonstrationData: true,
      publicationDate: payload.publicationDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: payload.status === 'published' ? new Date().toISOString() : undefined,
    };

    memoryJobs = [newJob, ...memoryJobs];
    return newJob;
  }

  /**
   * Admin: Update existing job
   */
  public async updateJob(id: string, payload: Partial<JobPosting>): Promise<JobPosting> {
    if (!USE_MOCK) {
      return apiClient.put<JobPosting>(`/admin/jobs/${id}`, payload);
    }

    const index = memoryJobs.findIndex((j) => j.id === id);
    if (index === -1) {
      throw new Error(`Job posting with ID ${id} not found.`);
    }

    const updated: JobPosting = {
      ...memoryJobs[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    memoryJobs[index] = updated;
    return updated;
  }

  /**
   * Admin: Change job status
   */
  public async setJobStatus(id: string, status: JobStatus): Promise<JobPosting> {
    return this.updateJob(id, {
      status,
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
    });
  }

  /**
   * Admin: Delete job
   */
  public async deleteJob(id: string): Promise<void> {
    if (!USE_MOCK) {
      await apiClient.delete(`/admin/jobs/${id}`);
      return;
    }

    memoryJobs = memoryJobs.filter((j) => j.id !== id);
  }
}

export const jobService = new JobService();
export default jobService;
