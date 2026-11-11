import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  ExternalLink,
  ShieldCheck,
  Send,
  UserCheck,
  Gavel,
} from 'lucide-react';
import { JobApplication, ApplicationStage, InterviewSchedule, InterviewFeedback } from '@/types';
import { jobApplicationService } from '@/services/jobApplicationService';
import { interviewService } from '@/services/interviewService';
import { StatusBadge } from '@/components/ui/admin/StatusBadge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';
import { FormField } from '@/components/ui/form/FormField';
import { Textarea } from '@/components/ui/form/Textarea';
import { Input } from '@/components/ui/form/Input';
import { Select } from '@/components/ui/form/Select';
import { Alert } from '@/components/ui/feedback/Alert';
import { Modal } from '@/components/ui/overlay/Modal';

export const AdminApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);
  const [feedbacks, setFeedbacks] = useState<InterviewFeedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New Note State
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Stage Change State
  const [selectedStage, setSelectedStage] = useState<ApplicationStage>('applied');
  const [stageNote, setStageNote] = useState('');
  const [isOverride, setIsOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Formal Decision Modal State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'offer' | 'hired' | 'rejected'>('offer');
  const [decisionReason, setDecisionReason] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [dispatchDecisionEmail, setDispatchDecisionEmail] = useState(true);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  // Recruiter Assignment State
  const [assignedRecruiterId, setAssignedRecruiterId] = useState('');

  const loadApplication = async () => {
    if (!id) return;
    setIsLoading(true);
    setUpdateError(null);
    try {
      const data = await jobApplicationService.getApplicationById(id);
      if (data) {
        setApplication(data);
        setSelectedStage(data.stage);
        if (data.assignedRecruiter) {
          setAssignedRecruiterId(data.assignedRecruiter.id);
        }

        // Load associated interviews and feedback
        const intList = await interviewService.getInterviews();
        const relatedInts = intList.filter((i) => i.applicationId === data.id);
        setInterviews(relatedInts);

        const allFbs: InterviewFeedback[] = [];
        for (const intItem of relatedInts) {
          const fbs = await interviewService.getFeedback(intItem.id);
          allFbs.push(...fbs);
        }
        setFeedbacks(allFbs);
      }
    } catch (err) {
      console.error('Failed to load candidate application', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [id]);

  const handleStageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setIsUpdatingStage(true);
    setUpdateSuccess(null);
    setUpdateError(null);
    try {
      const updated = await jobApplicationService.updateApplicationStage(
        application.id,
        selectedStage,
        'HR Reviewer',
        stageNote || undefined,
        isOverride,
        overrideReason || undefined
      );
      setApplication(updated);
      setStageNote('');
      setIsOverride(false);
      setOverrideReason('');
      setUpdateSuccess(`Candidate successfully transitioned to ${selectedStage.toUpperCase()}`);
      setTimeout(() => setUpdateSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Stage transition was rejected by server.';
      setUpdateError(msg);
    } finally {
      setIsUpdatingStage(false);
    }
  };

  const handleRecruiterAssign = async (recruiterId: string) => {
    if (!application) return;
    setAssignedRecruiterId(recruiterId);
    const recruiterMap: Record<string, string> = {
      'usr-1': 'Engr. Babatunde Alabi',
      'usr-2': 'Amina Bello, MNIA',
      'usr-3': 'Tariq Ibrahim',
    };
    const recruiterName = recruiterMap[recruiterId] || 'Recruiter Lead';

    try {
      const updated = await jobApplicationService.assignRecruiter(
        application.id,
        recruiterId,
        recruiterName
      );
      setApplication(updated);
      setUpdateSuccess(`Assigned recruiter: ${recruiterName}`);
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to assign recruiter', err);
    }
  };

  const handleFormalDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setIsSubmittingDecision(true);
    try {
      const updated = await jobApplicationService.recordDecision(application.id, {
        decision: decisionType,
        reason: decisionReason,
        notes: decisionNotes,
        sendEmailNotification: dispatchDecisionEmail,
      });

      setApplication(updated);
      setSelectedStage(updated.stage);
      setDecisionModalOpen(false);
      setUpdateSuccess(
        `Formal recruitment decision '${decisionType.toUpperCase()}' recorded.${
          dispatchDecisionEmail ? ' Communication dispatched to candidate.' : ''
        }`
      );
      setTimeout(() => setUpdateSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record decision.';
      setUpdateError(msg);
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application || !newNoteContent.trim()) return;

    setIsAddingNote(true);
    try {
      const note = await jobApplicationService.addNote(
        application.id,
        newNoteContent.trim(),
        'Practice Directorate Lead',
        false
      );
      setApplication({
        ...application,
        notes: [...application.notes, note],
      });
      setNewNoteContent('');
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setIsAddingNote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton height={32} width="40%" />
        <LoadingSkeleton height={200} count={2} />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-8 text-center bg-white border border-border">
        <h2 className="text-lg font-serif text-ink mb-2">Candidate Record Not Found</h2>
        <Link to="/admin/applications" className="text-xs text-accent underline">
          &larr; Return to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-admin-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
        <div>
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink font-sans mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Candidate Submissions</span>
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-light text-ink">
              {application.candidate.fullName}
            </h1>
            <StatusBadge status={application.stage} />
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-muted mt-1">
            <span>
              Target Position:{' '}
              <strong className="text-ink font-medium">{application.jobTitle}</strong>
            </span>
            <span>&bull;</span>
            <span className="font-mono">Ref: {application.id.toUpperCase()}</span>
            <span>&bull;</span>
            <span className="font-mono">Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <Link to={`/admin/interviews`}>
            <Button variant="outline" size="sm" className="text-xs">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-accent" />
              Schedule Interview
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setDecisionModalOpen(true)}
            className="text-xs bg-ink hover:bg-accent"
          >
            <Gavel className="w-3.5 h-3.5 mr-1.5" />
            Record Decision
          </Button>
        </div>
      </div>

      {updateSuccess && (
        <Alert type="success" title="Pipeline Status Verified" onClose={() => setUpdateSuccess(null)}>
          {updateSuccess}
        </Alert>
      )}

      {updateError && (
        <Alert type="danger" title="Validation Rejection" onClose={() => setUpdateError(null)}>
          {updateError}
        </Alert>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        {/* Left Col: Candidate Dossier, Reviews, Documents & Cover Narrative (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Candidate Profile Details */}
          <div className="bg-white border border-border p-6 space-y-6">
            <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
              Candidate Dossier & Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-canvas/30 border border-border/60">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase text-ink-muted block">Email</span>
                  <a href={`mailto:${application.candidate.email}`} className="font-mono text-ink truncate block hover:underline">
                    {application.candidate.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-canvas/30 border border-border/60">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase text-ink-muted block">Phone</span>
                  <span className="font-mono text-ink block">{application.candidate.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-canvas/30 border border-border/60">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase text-ink-muted block">Location</span>
                  <span className="text-ink font-medium block">{application.candidate.currentLocation}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-canvas/30 border border-border/60">
                <Award className="w-4 h-4 text-accent shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase text-ink-muted block">Experience</span>
                  <span className="font-mono text-ink font-bold block">
                    {application.candidate.yearsOfExperience} Years Practice
                  </span>
                </div>
              </div>
            </div>

            {/* Statutory Registration Box */}
            <div className="p-4 bg-canvas border border-border flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-semibold uppercase tracking-wider text-ink block">
                  Statutory Practice Accreditation
                </span>
                <p className="text-ink font-mono font-medium">
                  {application.candidate.professionalAccreditation || 'No statutory registration on file.'}
                </p>
                {application.candidate.highestDegree && (
                  <p className="text-ink-muted text-[11px]">Degree: {application.candidate.highestDegree}</p>
                )}
              </div>
            </div>

            {/* Links */}
            {(application.candidate.linkedInUrl || application.candidate.portfolioUrl) && (
              <div className="flex flex-wrap gap-4 text-xs pt-2">
                {application.candidate.linkedInUrl && (
                  <a
                    href={application.candidate.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent hover:text-ink font-medium underline underline-offset-4"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {application.candidate.portfolioUrl && (
                  <a
                    href={application.candidate.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent hover:text-ink font-medium underline underline-offset-4"
                  >
                    <span>External Digital Folio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Secure Document Downloads */}
          <div className="bg-white border border-border p-6 space-y-4">
            <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
              Verified Candidate Documents
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Resume */}
              <div className="border border-border p-4 bg-canvas/20 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-ink text-white flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-ink truncate block">
                      {application.resume.name}
                    </span>
                    <span className="text-[10px] text-ink-muted font-mono block">
                      {(application.resume.sizeBytes / (1024 * 1024)).toFixed(2)} MB &bull; PDF
                    </span>
                  </div>
                </div>

                <a
                  href={application.resume.downloadEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-ink-muted hover:text-accent hover:bg-canvas transition-colors"
                  title="Download Secure Document"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>

              {/* Optional Portfolio */}
              {application.portfolioDocument && (
                <div className="border border-border p-4 bg-canvas/20 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-accent text-white flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-ink truncate block">
                        {application.portfolioDocument.name}
                      </span>
                      <span className="text-[10px] text-ink-muted font-mono block">
                        {(application.portfolioDocument.sizeBytes / (1024 * 1024)).toFixed(2)} MB &bull; Portfolio
                      </span>
                    </div>
                  </div>

                  <a
                    href={application.portfolioDocument.downloadEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-ink-muted hover:text-accent hover:bg-canvas transition-colors"
                    title="Download Secure Document"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Associated Interview Sessions & Feedbacks */}
          <div className="bg-white border border-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider">
                Interview Sessions & Peer Evaluator Reviews ({interviews.length})
              </h2>
              <Link to="/admin/interviews" className="text-xs text-accent hover:underline">
                Open Schedule &rarr;
              </Link>
            </div>

            {interviews.length === 0 ? (
              <p className="text-xs text-ink-muted italic">No interview sessions scheduled yet for this applicant.</p>
            ) : (
              <div className="space-y-4">
                {interviews.map((intItem) => (
                  <div key={intItem.id} className="p-4 bg-canvas border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xs font-semibold text-ink">
                          {intItem.interviewRound || intItem.interviewType.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <StatusBadge status={intItem.status} />
                      </div>
                      <span className="font-mono text-[11px] text-ink-muted">
                        {new Date(intItem.scheduledAt).toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })}
                      </span>
                    </div>

                    <div className="text-xs text-ink-muted space-y-0.5">
                      <p>
                        <strong>Panel:</strong> {intItem.interviewerNames.join(', ')}
                      </p>
                      <p>
                        <strong>Venue / Bridge:</strong> {intItem.meetingDetails}
                      </p>
                    </div>

                    {/* Feedbacks for this session */}
                    {feedbacks.filter((fb) => fb.interviewId === intItem.id).map((fb) => (
                      <div key={fb.id} className="mt-2 p-3 bg-white border border-border/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-ink">{fb.interviewerName}</span>
                          <span className="font-mono text-[10px] font-bold text-accent uppercase">
                            {fb.recommendation.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1 text-[9px] font-mono text-center py-1 bg-canvas border border-border/40">
                          <div>TECH: {fb.technicalCompetency}/5</div>
                          <div>COMM: {fb.communication}/5</div>
                          <div>EXP: {fb.relevantExperience}/5</div>
                          <div>PROB: {fb.problemSolving}/5</div>
                          <div>SUIT: {fb.roleSuitability}/5</div>
                        </div>
                        {fb.strengths && (
                          <p className="text-[11px] text-ink">
                            <strong className="text-ink-muted">Strengths:</strong> {fb.strengths}
                          </p>
                        )}
                        {fb.comments && (
                          <p className="text-[11px] text-ink-muted italic font-serif">&ldquo;{fb.comments}&rdquo;</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internal Reviewer Notes */}
          <div className="bg-white border border-border p-6 space-y-6">
            <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
              Internal Evaluation Notes ({application.notes.length})
            </h2>

            <div className="space-y-3">
              {application.notes.length === 0 ? (
                <p className="text-xs text-ink-muted italic">No internal evaluation notes recorded yet.</p>
              ) : (
                application.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-canvas/30 border border-border/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <strong className="text-ink">{note.authorName}</strong>
                      <span className="text-ink-muted font-mono">{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-ink leading-relaxed">{note.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddNote} className="space-y-3 pt-2 border-t border-border/60">
              <FormField label="Append Internal Review Note">
                <Textarea
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Record observations regarding structural software competence, code compliance familiarity, communication style..."
                />
              </FormField>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm" disabled={isAddingNote || !newNoteContent.trim()}>
                  <Send className="w-3 h-3 mr-1.5" />
                  <span>Save Note</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Recruiter Assignment & Stage Governance & Stage History Audit (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assigned Recruiter Card */}
          <div className="bg-white border border-border p-5 space-y-3">
            <h3 className="text-xs font-serif font-semibold uppercase tracking-wider text-ink border-b border-border/80 pb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-accent" />
              Recruitment Lead Assignment
            </h3>

            <FormField label="Assigned Practice Lead / Recruiter" hint="Designates primary point of contact for candidate coordination.">
              <Select
                value={assignedRecruiterId}
                onChange={(e) => handleRecruiterAssign(e.target.value)}
                options={[
                  { value: '', label: '-- Unassigned --' },
                  { value: 'usr-1', label: 'Engr. Babatunde Alabi (Super Admin)' },
                  { value: 'usr-2', label: 'Amina Bello, MNIA (HR Admin)' },
                  { value: 'usr-3', label: 'Tariq Ibrahim (Senior Recruiter)' },
                ]}
              />
            </FormField>

            {application.assignedRecruiter && (
              <span className="text-[11px] text-ink-muted block font-mono">
                Assigned: <strong className="text-ink">{application.assignedRecruiter.name}</strong>
              </span>
            )}
          </div>

          {/* Stage Progression Card */}
          <div className="bg-white border border-border p-6 space-y-4 sticky top-24">
            <h3 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
              Pipeline Stage Governance
            </h3>

            <form onSubmit={handleStageUpdate} className="space-y-4 text-xs">
              <FormField label="Target Recruitment Stage">
                <Select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as ApplicationStage)}
                  options={[
                    { value: 'applied', label: '1. New Applied' },
                    { value: 'screening', label: '2. Under Review' },
                    { value: 'shortlisted', label: '3. Shortlisted' },
                    { value: 'interview', label: '4. Interview Scheduled' },
                    { value: 'assessment', label: '5. Practical Assessment' },
                    { value: 'offer', label: '6. Commercial Offer' },
                    { value: 'hired', label: '7. Commission Hired' },
                    { value: 'rejected', label: '8. Unsuccessful / Rejected' },
                  ]}
                />
              </FormField>

              <FormField label="Transition Commentary / Note">
                <Textarea
                  rows={2}
                  value={stageNote}
                  onChange={(e) => setStageNote(e.target.value)}
                  placeholder="Audit reason for status change..."
                />
              </FormField>

              {/* Administrative Override Toggle */}
              <div className="p-3 bg-canvas border border-border space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOverride}
                    onChange={(e) => setIsOverride(e.target.checked)}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="font-medium text-[11px] text-ink">Administrative Override Mode</span>
                </label>

                {isOverride && (
                  <FormField label="Override Justification (Required)" required>
                    <Input
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g. Partner discretion / Prior accredited standing"
                    />
                  </FormField>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isUpdatingStage || selectedStage === application.stage || (isOverride && !overrideReason.trim())}
                className="w-full justify-center"
              >
                {isUpdatingStage ? 'Validating Transition...' : 'Update Stage'}
              </Button>
            </form>

            {/* Audit Trail Timeline */}
            <div className="pt-4 border-t border-border/80 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
                Audited Transition History
              </h4>

              <div className="space-y-3 text-xs">
                {application.stageHistory.map((item, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-accent space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold uppercase text-ink">{item.stage}</span>
                      <span className="text-ink-muted font-mono">{new Date(item.changedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[10px] text-ink-muted block">By {item.changedByName}</span>
                    {item.note && <p className="text-[11px] text-ink/80 italic mt-0.5">&ldquo;{item.note}&rdquo;</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formal Recruitment Decision Modal */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title="Record Formal Recruitment Decision"
        description="Formal recruitment decisions are permanent, auditable milestones in the candidate lifecycle."
      >
        <form onSubmit={handleFormalDecisionSubmit} className="space-y-4 font-sans text-xs">
          <div className="p-3 bg-canvas border border-border">
            <span className="text-[10px] text-ink-muted uppercase">Candidate Dossier</span>
            <p className="font-serif text-sm font-semibold text-ink">{application.candidate.fullName}</p>
            <p className="text-ink-muted">Commission: {application.jobTitle}</p>
          </div>

          <FormField label="Decision Determination" required>
            <Select
              value={decisionType}
              onChange={(e) => setDecisionType(e.target.value as 'offer' | 'hired' | 'rejected')}
              options={[
                { value: 'offer', label: 'Extend Commercial Offer (Engagement Approved)' },
                { value: 'hired', label: 'Mark as Formally Hired (Contract Executed)' },
                { value: 'rejected', label: 'Reject Application (Candidate Unsuccessful)' },
              ]}
            />
          </FormField>

          <FormField label="Formal Decision Rationale" required>
            <Input
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="e.g. Unanimous panel recommendation / COREN verification confirmed"
              required
            />
          </FormField>

          <FormField label="Confidential Remuneration & Terms Commentary">
            <Textarea
              rows={3}
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="Contractual salary parameters, sign-on terms, or onboarding timetable..."
            />
          </FormField>

          <label className="flex items-start gap-2 pt-2 border-t border-border cursor-pointer">
            <input
              type="checkbox"
              checked={dispatchDecisionEmail}
              onChange={(e) => setDispatchDecisionEmail(e.target.checked)}
              className="mt-0.5 rounded border-border text-accent focus:ring-accent"
            />
            <div>
              <span className="font-medium text-ink block">
                Dispatch formal decision notification email immediately to candidate
              </span>
              <span className="text-[11px] text-ink-muted block">
                When confirmed, a professional VOLIA-branded outcome correspondence will be dispatched to{' '}
                <strong className="text-ink">{application.candidate.email}</strong>.
              </span>
            </div>
          </label>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setDecisionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isSubmittingDecision || !decisionReason.trim()}>
              Confirm & Record Decision
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminApplicationDetailPage;
