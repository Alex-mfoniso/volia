/**
 * VOLIA NIG LTD — Recruitment Domain Types & Interfaces
 * Prepared for Laravel API backend integration
 */

export type JobStatus = 'draft' | 'published' | 'closed' | 'archived';

export type JobDepartment =
  | 'Engineering'
  | 'Architecture'
  | 'Quantity Surveying'
  | 'Project Management'
  | 'Executive & Operations';

export type EmploymentType = 'full_time' | 'contract' | 'hybrid' | 'consultancy';

export type WorkArrangement = 'on_site' | 'hybrid' | 'remote';

export type ExperienceLevel = 'entry' | 'intermediate' | 'senior' | 'lead' | 'principal';

export interface CustomJobQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'boolean';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  department: JobDepartment;
  location: string;
  type: EmploymentType;
  employmentType?: EmploymentType;
  workArrangement: WorkArrangement;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  overview: string;
  description?: string;
  responsibilities: string[];
  requirements: string[];
  qualifications?: string[];
  experienceRequirements?: string[];
  skills?: string[];
  desirableQualifications?: string[];
  salaryInformation?: string;
  remunerationNote: string;
  closingDate?: string;
  publishedAt?: string;
  publicationDate?: string;
  createdAt: string;
  updatedAt: string;
  applicationCount: number;
  openingsCount: number;
  featured?: boolean;
  customQuestions?: CustomJobQuestion[];
  isDemonstrationData?: boolean;
  hiringLead?: {
    id: string;
    name: string;
    role: string;
  };
}

export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'shortlisted'
  | 'interview'
  | 'assessment'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface ApplicationDocument {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  // Documents are NEVER exposed through raw public URLs.
  // Access requires a signed temporary route: /api/admin/applications/{id}/document/{docId}
  downloadEndpoint: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  currentTitle?: string;
  yearsOfExperience: number;
  highestDegree?: string;
  professionalAccreditation?: string; // e.g. COREN, ARCON, NIQS
  noticePeriodWeeks: number;
}

export interface ApplicationNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface StageHistoryItem {
  stage: ApplicationStage;
  changedById: string;
  changedByName: string;
  changedAt: string;
  note?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  jobDepartment: JobDepartment;
  candidate: CandidateProfile;
  coverLetter?: string;
  resume: ApplicationDocument;
  portfolioDocument?: ApplicationDocument;
  stage: ApplicationStage;
  rating?: 1 | 2 | 3 | 4 | 5;
  stageHistory: StageHistoryItem[];
  notes: ApplicationNote[];
  interviews: string[]; // Interview IDs
  appliedAt: string;
  updatedAt: string;
  assignedRecruiter?: {
    id: string;
    name: string;
  };
}

export type InterviewType =
  | 'preliminary_screening'
  | 'technical_assessment'
  | 'portfolio_presentation'
  | 'partner_interview';

export type InterviewStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export interface InterviewSchedule {
  id: string;
  applicationId: string;
  candidateName: string;
  candidateEmail?: string;
  jobTitle: string;
  interviewType: InterviewType;
  interviewRound?: string;
  interviewerNames: string[];
  interviewerIds?: string[];
  scheduledAt: string;
  endsAt?: string;
  timezone?: string;
  durationMinutes: number;
  mode: 'in_person_abuja' | 'in_person_lagos' | 'virtual_secure_meeting' | 'telephone';
  meetingDetails: string;
  status: InterviewStatus;
  feedbackSummary?: string;
  recommendation?: 'advance' | 'hold' | 'reject';
  feedbacks?: InterviewFeedback[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RecruitmentMetrics {
  totalActiveJobs: number;
  totalApplications: number;
  inReviewCount: number;
  interviewsScheduled: number;
  offersPending: number;
  hiresThisQuarter: number;
  stageBreakdown: Record<ApplicationStage, number>;
  departmentBreakdown: Record<JobDepartment, number>;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: 'job' | 'application' | 'candidate' | 'interview' | 'auth';
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface JobApplicationSubmission {
  jobId: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentJobTitle?: string;
  yearsOfExperience: number;
  highestQualification?: string;
  highestDegree?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  professionalAccreditation?: string;
  noticePeriodWeeks: number;
  coverLetter?: string;
  resumeFile: File;
  coverLetterFile?: File;
  portfolioFile?: File;
  additionalFiles?: File[];
  customAnswers?: Record<string, string>;
  consentDataProcessing: boolean;
}

export type InterviewRecommendation =
  | 'strongly_recommend'
  | 'recommend'
  | 'further_assessment'
  | 'do_not_recommend';

export interface InterviewFeedback {
  id: string;
  interviewId: string;
  applicationId: string;
  interviewerId: string;
  interviewerName: string;
  technicalCompetency: number; // 1-5
  communication: number; // 1-5
  relevantExperience: number; // 1-5
  problemSolving: number; // 1-5
  roleSuitability: number; // 1-5
  strengths: string;
  concerns: string;
  comments: string;
  recommendation: InterviewRecommendation;
  submittedAt: string;
  updatedAt?: string;
}

export type NotificationType =
  | 'application_received'
  | 'application_status_updated'
  | 'interview_invitation'
  | 'interview_rescheduled'
  | 'interview_cancelled'
  | 'feedback_submitted'
  | 'recruitment_outcome'
  | 'assignment_created';

export interface NotificationItem {
  id: string;
  userId: string;
  recipientEmail?: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: 'application' | 'interview' | 'job';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  notifyOnStatusChange: boolean;
  notifyOnInterviewScheduled: boolean;
  notifyOnFeedbackSubmitted: boolean;
}

export interface RecruitmentDecisionPayload {
  decision: 'offer' | 'hired' | 'rejected';
  reason?: string;
  notes?: string;
  sendEmailNotification: boolean;
}
