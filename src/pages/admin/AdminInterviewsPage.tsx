import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  MapPin,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  Award,
  Filter,
  Search,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import {
  InterviewSchedule,
  InterviewType,
  InterviewFeedback,
  InterviewRecommendation,
  JobApplication,
} from '@/types';
import { interviewService } from '@/services/interviewService';
import { jobApplicationService } from '@/services/jobApplicationService';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/admin/DataTable';
import { StatusBadge } from '@/components/ui/admin/StatusBadge';
import { TableColumn } from '@/types/ui';
import { Modal } from '@/components/ui/overlay/Modal';
import { FormField } from '@/components/ui/form/FormField';
import { Input } from '@/components/ui/form/Input';
import { Textarea } from '@/components/ui/form/Textarea';
import { Select } from '@/components/ui/form/Select';
import { Alert } from '@/components/ui/feedback/Alert';

export const AdminInterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Selected Interview for Actions
  const [selectedInterview, setSelectedInterview] = useState<InterviewSchedule | null>(null);

  // Schedule Form State
  const [selectedAppId, setSelectedAppId] = useState('');
  const [interviewRound, setInterviewRound] = useState('Round 1: Technical Assessment');
  const [interviewType, setInterviewType] = useState<InterviewType>('technical_assessment');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [mode, setMode] = useState<InterviewSchedule['mode']>('in_person_abuja');
  const [meetingDetails, setMeetingDetails] = useState('Conference Room 3B, VOLIA Head Office, CBD, Abuja');
  const [interviewerNames, setInterviewerNames] = useState('Engr. Chukwuemeka Okonkwo, FNSE, Amina Bello, MNIA');
  const [scheduleNotes, setScheduleNotes] = useState('');

  // Reschedule Form State
  const [newScheduledAt, setNewScheduledAt] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [newMeetingDetails, setNewMeetingDetails] = useState('');

  // Cancel Form State
  const [cancelReason, setCancelReason] = useState('');

  // Feedback Form State
  const [technicalCompetency, setTechnicalCompetency] = useState(4);
  const [communication, setCommunication] = useState(4);
  const [relevantExperience, setRelevantExperience] = useState(4);
  const [problemSolving, setProblemSolving] = useState(4);
  const [roleSuitability, setRoleSuitability] = useState(4);
  const [strengths, setStrengths] = useState('');
  const [concerns, setConcerns] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [recommendation, setRecommendation] = useState<InterviewRecommendation>('recommend');

  // Feedback display records
  const [currentFeedbacks, setCurrentFeedbacks] = useState<InterviewFeedback[]>([]);

  // Banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [intList, appList, jobList] = await Promise.all([
        interviewService.getInterviews({
          status: statusFilter,
          type: typeFilter,
          department: departmentFilter,
          date: dateFilter,
        }),
        jobApplicationService.getApplications(),
        jobService.getJobs(),
      ]);

      setInterviews(intList);
      setApplications(appList);
      setJobs(jobList);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to synchronize interview schedules.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter, departmentFilter, dateFilter]);

  // Open Details Modal and fetch feedback
  const handleOpenDetails = async (interview: InterviewSchedule) => {
    setSelectedInterview(interview);
    setDetailsModalOpen(true);
    try {
      const fbs = await interviewService.getFeedback(interview.id);
      setCurrentFeedbacks(fbs);
    } catch (err) {
      console.error('Failed to load feedback', err);
    }
  };

  // Schedule Form Submission
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const app = applications.find((a) => a.id === selectedAppId);
    if (!app) {
      setErrorMessage('Please select an eligible candidate application.');
      return;
    }

    try {
      await interviewService.scheduleInterview({
        applicationId: app.id,
        candidateName: app.candidate.fullName,
        candidateEmail: app.candidate.email,
        jobTitle: app.jobTitle,
        interviewRound,
        interviewType,
        scheduledAt,
        durationMinutes,
        mode,
        meetingDetails,
        interviewerNames: interviewerNames.split(',').map((s) => s.trim()).filter(Boolean),
        notes: scheduleNotes,
      });

      setScheduleModalOpen(false);
      setSuccessMessage('Interview session successfully scheduled and calendar invitation dispatched.');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scheduling failed due to a panel conflict or invalid date.';
      setErrorMessage(msg);
    }
  };

  // Reschedule Form Submission
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    try {
      await interviewService.rescheduleInterview(
        selectedInterview.id,
        newScheduledAt,
        rescheduleReason,
        newMeetingDetails || undefined
      );

      setRescheduleModalOpen(false);
      setSuccessMessage('Interview session successfully rescheduled and candidate notified.');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reschedule failed.';
      setErrorMessage(msg);
    }
  };

  // Cancel Form Submission
  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    try {
      await interviewService.cancelInterview(selectedInterview.id, cancelReason);
      setCancelModalOpen(false);
      setSuccessMessage('Interview session cancelled and cancellation notices dispatched.');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cancellation failed.';
      setErrorMessage(msg);
    }
  };

  // Mark Completed
  const handleCompleteInterview = async (id: string) => {
    try {
      await interviewService.completeInterview(id);
      setSuccessMessage('Interview marked as completed. Panel feedback requests dispatched.');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete interview.';
      setErrorMessage(msg);
    }
  };

  // Submit Feedback
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    try {
      await interviewService.submitFeedback(selectedInterview.id, {
        applicationId: selectedInterview.applicationId,
        technicalCompetency,
        communication,
        relevantExperience,
        problemSolving,
        roleSuitability,
        strengths,
        concerns,
        comments: feedbackComments,
        recommendation,
      });

      setFeedbackModalOpen(false);
      setSuccessMessage('Structured panel evaluation registered and submitted to HR directorate.');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit feedback.';
      setErrorMessage(msg);
    }
  };

  // Filtered List for Table
  const filteredInterviews = interviews.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchName = item.candidateName.toLowerCase().includes(q);
    const matchJob = item.jobTitle.toLowerCase().includes(q);
    const matchPanel = item.interviewerNames.some((n) => n.toLowerCase().includes(q));
    return matchName || matchJob || matchPanel;
  });

  const columns: TableColumn<InterviewSchedule>[] = [
    {
      key: 'candidate',
      header: 'Candidate & Position',
      render: (item) => (
        <div>
          <button
            type="button"
            onClick={() => handleOpenDetails(item)}
            className="font-serif text-sm font-medium text-ink hover:text-accent text-left block"
          >
            {item.candidateName}
          </button>
          <span className="text-xs text-ink-muted block truncate max-w-xs">{item.jobTitle}</span>
          <span className="text-[10px] font-mono text-accent uppercase">
            {item.interviewRound || 'Panel Round'}
          </span>
        </div>
      ),
    },
    {
      key: 'schedule',
      header: 'Date & Time (Africa/Lagos)',
      render: (item) => (
        <div className="text-xs font-sans">
          <span className="font-mono text-ink block font-semibold">
            {new Date(item.scheduledAt).toLocaleDateString('en-GB', {
              timeZone: 'Africa/Lagos',
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className="text-[11px] font-mono text-ink-muted flex items-center gap-1">
            <Clock className="w-3 h-3 text-accent" />
            {new Date(item.scheduledAt).toLocaleTimeString('en-GB', {
              timeZone: 'Africa/Lagos',
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            ({item.durationMinutes} min)
          </span>
        </div>
      ),
    },
    {
      key: 'format',
      header: 'Format & Venue',
      render: (item) => (
        <div className="text-xs font-sans max-w-[200px]">
          <span className="inline-flex items-center gap-1 font-medium text-ink">
            {item.mode === 'virtual_secure_meeting' ? (
              <Video className="w-3.5 h-3.5 text-accent" />
            ) : item.mode === 'telephone' ? (
              <Phone className="w-3.5 h-3.5 text-accent" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-accent" />
            )}
            <span className="capitalize">{item.interviewType?.replace(/_/g, ' ')}</span>
          </span>
          <span className="text-[10px] text-ink-muted truncate block">{item.meetingDetails}</span>
        </div>
      ),
    },
    {
      key: 'panel',
      header: 'Assigned Panel',
      render: (item) => (
        <div className="text-xs font-sans max-w-[180px]">
          <span className="text-ink truncate block">
            {item.interviewerNames?.join(', ') || 'Practice Directorate'}
          </span>
          {item.feedbackSummary && (
            <span className="text-[10px] text-accent font-mono block truncate">
              {item.feedbackSummary}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5 font-sans">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenDetails(item)}
            className="text-[10px] py-1 px-2.5 h-7"
          >
            Review Session
          </Button>

          {item.status === 'scheduled' && (
            <>
              <button
                type="button"
                onClick={() => handleCompleteInterview(item.id)}
                className="p-1.5 text-ink-muted hover:text-status-success transition-colors"
                title="Mark Completed"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedInterview(item);
                  setNewScheduledAt(item.scheduledAt);
                  setRescheduleModalOpen(true);
                }}
                className="p-1.5 text-ink-muted hover:text-amber-600 transition-colors"
                title="Reschedule Session"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedInterview(item);
                  setCancelModalOpen(true);
                }}
                className="p-1.5 text-ink-muted hover:text-status-danger transition-colors"
                title="Cancel Session"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {item.status === 'completed' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedInterview(item);
                setFeedbackModalOpen(true);
              }}
              className="text-[10px] py-1 px-2 h-7 bg-purple-700 hover:bg-purple-800"
            >
              <Award className="w-3 h-3 mr-1" />
              Feedback
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-admin-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-architectural text-accent block">
            Technical Governance
          </span>
          <h1 className="text-2xl font-serif font-light text-ink mt-0.5">
            Interview Management & Evaluation Panels
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Coordinate board presentations, structural code defenses, conflict-validated calendars, and panel feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-accent" />
            <span>Synchronize</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setScheduleModalOpen(true)}
            className="text-xs py-2"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <Alert type="danger" title="Interview Operation Notice" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert type="success" title="Success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white border border-border p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between font-sans">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, position, or panel lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-ink-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-canvas border border-border px-2.5 py-2 text-ink focus:outline-none focus:border-accent"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs bg-canvas border border-border px-2.5 py-2 text-ink focus:outline-none focus:border-accent"
            >
              <option value="all">All Departments</option>
              {Array.from(new Set(jobs.map((j) => j.department))).filter(Boolean).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-canvas border border-border px-2.5 py-2 text-ink focus:outline-none focus:border-accent"
            >
              <option value="all">All Formats</option>
              <option value="technical_assessment">Technical Assessment</option>
              <option value="preliminary_screening">Preliminary Screening</option>
              <option value="portfolio_presentation">Portfolio Defense</option>
              <option value="partner_interview">Partner Interview</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs bg-canvas border border-border px-2.5 py-2 text-ink focus:outline-none focus:border-accent font-mono"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="text-[11px] text-ink-muted hover:text-accent"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interviews Table */}
      <DataTable
        columns={columns}
        data={filteredInterviews}
        keyExtractor={(i) => i.id}
        isLoading={isLoading}
        emptyTitle="No scheduled interview sessions"
        emptyDescription="There are currently no sessions matching your parameters."
      />

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Technical Panel Session"
        description="Verify candidate eligibility, prevent panel schedule conflicts, and dispatch calendar invitations."
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4 font-sans text-xs">
          <FormField label="Candidate Application" required hint="Only active candidates in eligible review stages are selectable.">
            <Select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              options={[
                { value: '', label: '-- Select Eligible Applicant --' },
                ...applications
                  .filter((a) => ['applied', 'screening', 'shortlisted', 'interview'].includes(a.stage))
                  .map((a) => ({
                    value: a.id,
                    label: `${a.candidate.fullName} — ${a.jobTitle} (${a.stage.toUpperCase()})`,
                  })),
              ]}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Panel Typology" required>
              <Select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                options={[
                  { value: 'technical_assessment', label: 'Technical Assessment & Code Modeling' },
                  { value: 'portfolio_presentation', label: 'Portfolio & Structural Defense' },
                  { value: 'partner_interview', label: 'Managing Partner Interview' },
                  { value: 'preliminary_screening', label: 'Preliminary Competency Screening' },
                ]}
              />
            </FormField>

            <FormField label="Interview Round" required>
              <Input
                value={interviewRound}
                onChange={(e) => setInterviewRound(e.target.value)}
                placeholder="e.g. Round 1: Technical Assessment"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date & Time (Africa/Lagos)" required hint="Times stored UTC; displayed Africa/Lagos (UTC+1)">
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Session Duration" required>
              <Select
                value={String(durationMinutes)}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                options={[
                  { value: '30', label: '30 Minutes' },
                  { value: '45', label: '45 Minutes' },
                  { value: '60', label: '60 Minutes (1 Hour)' },
                  { value: '90', label: '90 Minutes' },
                ]}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Meeting Typology / Venue" required>
              <Select
                value={mode}
                onChange={(e) => setMode(e.target.value as InterviewSchedule['mode'])}
                options={[
                  { value: 'in_person_abuja', label: 'Abuja Head Office (CBD)' },
                  { value: 'in_person_lagos', label: 'Lagos Practice Studio' },
                  { value: 'virtual_secure_meeting', label: 'Encrypted Executive Video Bridge' },
                  { value: 'telephone', label: 'Executive Telephone Call' },
                ]}
              />
            </FormField>

            <FormField label="Venue / Connection Instructions" required>
              <Input
                value={meetingDetails}
                onChange={(e) => setMeetingDetails(e.target.value)}
                placeholder="Conference room or secure meeting URL"
                required
              />
            </FormField>
          </div>

          <FormField
            label="Assigned Evaluation Panel (Comma Separated)"
            required
            hint="Names of verified practice leads. Scheduling engine validates against existing conflicts."
          >
            <Input
              value={interviewerNames}
              onChange={(e) => setInterviewerNames(e.target.value)}
              placeholder="e.g. Engr. Chukwuemeka Okonkwo, FNSE, Amina Bello, MNIA"
            />
          </FormField>

          <FormField label="Internal Panel Briefing Notes">
            <Textarea
              rows={2}
              value={scheduleNotes}
              onChange={(e) => setScheduleNotes(e.target.value)}
              placeholder="Key focus areas, finite element test criteria, Eurocode checks..."
            />
          </FormField>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!selectedAppId || !scheduledAt}>
              Confirm & Dispatch Invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Interview Details & Feedback History Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedInterview(null);
        }}
        title="Technical Interview Session Dossier"
        description="Comprehensive schedule parameters, assigned evaluators, and peer reviews."
      >
        {selectedInterview && (
          <div className="space-y-5 font-sans text-xs">
            {/* Header Card */}
            <div className="p-4 bg-canvas border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-semibold text-ink">
                  {selectedInterview.candidateName}
                </span>
                <StatusBadge status={selectedInterview.status} />
              </div>

              <p className="text-ink-muted">
                {selectedInterview.jobTitle} &bull;{' '}
                <strong className="text-ink">{selectedInterview.interviewRound || 'Panel Round'}</strong>
              </p>

              <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-ink-muted block uppercase text-[9px]">Date & Time (Africa/Lagos)</span>
                  <span className="font-mono text-ink">
                    {new Date(selectedInterview.scheduledAt).toLocaleString('en-GB', {
                      timeZone: 'Africa/Lagos',
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block uppercase text-[9px]">Venue / Coordinates</span>
                  <span className="text-ink">{selectedInterview.meetingDetails}</span>
                </div>
              </div>
            </div>

            {/* Panel Members */}
            <div>
              <span className="text-[10px] uppercase font-semibold text-ink-muted tracking-wider block mb-1.5">
                Evaluation Panel Leads
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedInterview.interviewerNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-border text-xs text-ink"
                  >
                    <User className="w-3 h-3 text-accent" />
                    <span>{name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Submitted Feedback Reviews */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-semibold uppercase text-ink">
                  Panel Evaluation Reviews ({currentFeedbacks.length})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDetailsModalOpen(false);
                    setFeedbackModalOpen(true);
                  }}
                  className="text-xs py-1"
                >
                  <Award className="w-3.5 h-3.5 mr-1 text-accent" />
                  Submit Feedback
                </Button>
              </div>

              {currentFeedbacks.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-border text-ink-muted italic">
                  No evaluations submitted yet. Panel leads submit feedback upon session conclusion.
                </div>
              ) : (
                currentFeedbacks.map((fb) => (
                  <div key={fb.id} className="p-3.5 bg-canvas border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">{fb.interviewerName}</span>
                      <span className="px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-accent/15 text-accent border border-accent/30">
                        {fb.recommendation.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Ratings Grid */}
                    <div className="grid grid-cols-5 gap-2 text-[10px] font-mono py-1.5 border-y border-border/40 text-center">
                      <div>
                        <span className="text-ink-muted block text-[8px]">TECHNICAL</span>
                        <strong className="text-ink">{fb.technicalCompetency}/5</strong>
                      </div>
                      <div>
                        <span className="text-ink-muted block text-[8px]">COMMUNICATION</span>
                        <strong className="text-ink">{fb.communication}/5</strong>
                      </div>
                      <div>
                        <span className="text-ink-muted block text-[8px]">EXPERIENCE</span>
                        <strong className="text-ink">{fb.relevantExperience}/5</strong>
                      </div>
                      <div>
                        <span className="text-ink-muted block text-[8px]">PROBLEM SOLVING</span>
                        <strong className="text-ink">{fb.problemSolving}/5</strong>
                      </div>
                      <div>
                        <span className="text-ink-muted block text-[8px]">SUITABILITY</span>
                        <strong className="text-ink">{fb.roleSuitability}/5</strong>
                      </div>
                    </div>

                    {fb.strengths && (
                      <p className="text-[11px] text-ink">
                        <strong className="text-ink-muted">Key Strengths:</strong> {fb.strengths}
                      </p>
                    )}
                    {fb.concerns && (
                      <p className="text-[11px] text-ink">
                        <strong className="text-ink-muted">Areas of Concern:</strong> {fb.concerns}
                      </p>
                    )}
                    {fb.comments && (
                      <p className="text-[11px] text-ink-muted italic border-l-2 border-accent pl-2 font-serif">
                        &ldquo;{fb.comments}&rdquo;
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link
                to={`/admin/applications/${selectedInterview.applicationId}`}
                className="text-xs text-accent hover:text-ink font-semibold uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>Full Candidate Dossier</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDetailsModalOpen(false);
                    setSelectedInterview(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Structured Evaluation & Feedback Modal */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Submit Structured Panel Evaluation"
        description="Record rigorous technical scoring, strengths, concerns, and final hiring recommendation."
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4 font-sans text-xs">
          <div className="p-3 bg-canvas border border-border">
            <span className="text-[10px] text-ink-muted uppercase">Candidate</span>
            <p className="font-serif text-sm font-semibold text-ink">{selectedInterview?.candidateName}</p>
            <p className="text-ink-muted">{selectedInterview?.jobTitle}</p>
          </div>

          {/* Ratings Scales */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-semibold text-ink-muted tracking-wider block">
              Core Competency Dimensions (Scale 1 - 5)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Technical Engineering Competency" required>
                <Select
                  value={String(technicalCompetency)}
                  onChange={(e) => setTechnicalCompetency(Number(e.target.value))}
                  options={[
                    { value: '5', label: '5 - Exceptional / Mastery' },
                    { value: '4', label: '4 - Strong / Exceeds Requirement' },
                    { value: '3', label: '3 - Competent / Meets Standard' },
                    { value: '2', label: '2 - Developing / Minor Gaps' },
                    { value: '1', label: '1 - Unsatisfactory' },
                  ]}
                />
              </FormField>

              <FormField label="Communication & Client Defense" required>
                <Select
                  value={String(communication)}
                  onChange={(e) => setCommunication(Number(e.target.value))}
                  options={[
                    { value: '5', label: '5 - Highly Articulate & Authoritative' },
                    { value: '4', label: '4 - Clear & Professional' },
                    { value: '3', label: '3 - Acceptable' },
                    { value: '2', label: '2 - Needs Development' },
                    { value: '1', label: '1 - Ineffective' },
                  ]}
                />
              </FormField>

              <FormField label="Relevant Infrastructure Experience" required>
                <Select
                  value={String(relevantExperience)}
                  onChange={(e) => setRelevantExperience(Number(e.target.value))}
                  options={[
                    { value: '5', label: '5 - Proven Major Built Projects' },
                    { value: '4', label: '4 - Strong Consulting Track Record' },
                    { value: '3', label: '3 - Adequate Relevant Exposure' },
                    { value: '2', label: '2 - Limited Relevant Scheme Scale' },
                    { value: '1', label: '1 - Insufficient' },
                  ]}
                />
              </FormField>

              <FormField label="Problem Solving & Design Analysis" required>
                <Select
                  value={String(problemSolving)}
                  onChange={(e) => setProblemSolving(Number(e.target.value))}
                  options={[
                    { value: '5', label: '5 - Innovative & Structurally Rigorous' },
                    { value: '4', label: '4 - Solid Analytical Logic' },
                    { value: '3', label: '3 - Standard Methodological Approach' },
                    { value: '2', label: '2 - Struggles with Unfamiliar Scenarios' },
                    { value: '1', label: '1 - Poor' },
                  ]}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Role & Practice Suitability" required>
                  <Select
                    value={String(roleSuitability)}
                    onChange={(e) => setRoleSuitability(Number(e.target.value))}
                    options={[
                      { value: '5', label: '5 - Perfect Alignment with VOLIA Culture' },
                      { value: '4', label: '4 - Strong Fit' },
                      { value: '3', label: '3 - Acceptable' },
                      { value: '2', label: '2 - Questionable Alignment' },
                      { value: '1', label: '1 - Incompatible' },
                    ]}
                  />
                </FormField>
              </div>
            </div>
          </div>

          <FormField label="Key Technical Strengths" required>
            <Textarea
              rows={2}
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="e.g. Masterful understanding of post-tensioned floor systems, Eurocode wind loadings..."
              required
            />
          </FormField>

          <FormField label="Areas of Concern or Verification">
            <Textarea
              rows={2}
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder="e.g. Needs commercial contract administration mentoring under FIDIC..."
            />
          </FormField>

          <FormField label="Additional Panel Comments">
            <Textarea
              rows={2}
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
              placeholder="General remarks for the Managing Partner..."
            />
          </FormField>

          <FormField label="Overall Recommendation" required>
            <Select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value as InterviewRecommendation)}
              options={[
                { value: 'strongly_recommend', label: 'Strongly Recommend (High Priority Engagement)' },
                { value: 'recommend', label: 'Recommend for Offer' },
                { value: 'further_assessment', label: 'Further Assessment / Second Round Required' },
                { value: 'do_not_recommend', label: 'Do Not Recommend' },
              ]}
            />
          </FormField>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setFeedbackModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Formal Evaluation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Interview Session"
        description="Select a revised future date and time. Candidate and panel leads will receive updated coordinates."
      >
        <form onSubmit={handleRescheduleSubmit} className="space-y-4 font-sans text-xs">
          <FormField label="New Date & Time (Africa/Lagos)" required>
            <Input
              type="datetime-local"
              value={newScheduledAt}
              onChange={(e) => setNewScheduledAt(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Reason for Reschedule" required>
            <Input
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              placeholder="e.g. Practice Panel hearing clash / Project site inspection"
              required
            />
          </FormField>

          <FormField label="Updated Venue / Bridge URL (Optional)">
            <Input
              value={newMeetingDetails}
              onChange={(e) => setNewMeetingDetails(e.target.value)}
              placeholder="Leave empty to maintain existing venue"
            />
          </FormField>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!newScheduledAt || !rescheduleReason.trim()}>
              Confirm Reschedule
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Interview Session"
        description="Cancelling a session dispatches cancellation notices to candidate and assigned interviewers."
      >
        <form onSubmit={handleCancelSubmit} className="space-y-4 font-sans text-xs">
          <FormField label="Cancellation Reason" required>
            <Textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Candidate withdrew application / Commission requirements restructured..."
              required
            />
          </FormField>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setCancelModalOpen(false)}>
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="submit"
              disabled={!cancelReason.trim()}
              className="text-status-danger border-status-danger hover:bg-status-danger-bg"
            >
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminInterviewsPage;
