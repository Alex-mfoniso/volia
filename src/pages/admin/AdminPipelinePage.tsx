import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  User,
  Calendar,
  Building,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { JobApplication, ApplicationStage } from '@/types';
import { jobApplicationService, PipelineData } from '@/services/jobApplicationService';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types';
import { Modal } from '@/components/ui/overlay/Modal';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/form/FormField';
import { Input } from '@/components/ui/form/Input';
import { Textarea } from '@/components/ui/form/Textarea';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';
import { Alert } from '@/components/ui/feedback/Alert';

interface StageConfig {
  stage: ApplicationStage;
  label: string;
  headerBorder: string;
  badgeBg: string;
}

const PIPELINE_STAGES: StageConfig[] = [
  { stage: 'applied', label: '1. New Applied', headerBorder: 'border-t-gray-500', badgeBg: 'bg-gray-100 text-gray-800' },
  { stage: 'screening', label: '2. Under Review', headerBorder: 'border-t-blue-500', badgeBg: 'bg-blue-50 text-blue-800' },
  { stage: 'shortlisted', label: '3. Shortlisted', headerBorder: 'border-t-amber-500', badgeBg: 'bg-amber-50 text-amber-800' },
  { stage: 'interview', label: '4. Interview', headerBorder: 'border-t-purple-600', badgeBg: 'bg-purple-50 text-purple-800' },
  { stage: 'offer', label: '5. Offered', headerBorder: 'border-t-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-800' },
  { stage: 'hired', label: '6. Hired', headerBorder: 'border-t-green-600', badgeBg: 'bg-green-50 text-green-900 font-bold' },
  { stage: 'rejected', label: '7. Rejected', headerBorder: 'border-t-rose-600', badgeBg: 'bg-rose-50 text-rose-800' },
];

export const AdminPipelinePage: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRecruiter, setSelectedRecruiter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drag and Drop state
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<ApplicationStage | null>(null);

  // Sensitive Transition & Override Modal State
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<{
    application: JobApplication;
    targetStage: ApplicationStage;
    isSensitive: boolean;
    isOverride: boolean;
  } | null>(null);
  const [transitionReason, setTransitionReason] = useState('');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [dispatchEmail, setDispatchEmail] = useState(true);

  // Error Feedback & Rollback notification
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadPipeline = async () => {
    try {
      const [pData, jList] = await Promise.all([
        jobApplicationService.getPipeline({
          jobId: selectedJobId,
          department: selectedDepartment,
          recruiterId: selectedRecruiter,
          search: searchQuery,
        }),
        jobService.getJobs(),
      ]);
      setPipelineData(pData);
      setJobs(jList);
    } catch (err) {
      console.error('Failed to load recruitment pipeline', err);
      setErrorBanner('Failed to synchronize recruitment pipeline with backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, [selectedJobId, selectedDepartment, selectedRecruiter, searchQuery]);

  // Sensitive or Terminal transitions requiring explicit modal confirmation
  const SENSITIVE_STAGES: ApplicationStage[] = ['offer', 'hired', 'rejected'];

  const executeStageTransition = async (
    application: JobApplication,
    targetStage: ApplicationStage,
    reason?: string,
    notes?: string,
    isOverride = false
  ) => {
    setErrorBanner(null);
    setSuccessBanner(null);

    // Save snapshot of previous state for rollback
    const previousSnapshot = pipelineData;

    // Optimistic UI update
    if (pipelineData) {
      const fromStage = application.stage;
      const updatedFromList = pipelineData.columns[fromStage].filter((a) => a.id !== application.id);
      const updatedApp = { ...application, stage: targetStage };
      const updatedToList = [updatedApp, ...(pipelineData.columns[targetStage] || [])];

      setPipelineData({
        ...pipelineData,
        columns: {
          ...pipelineData.columns,
          [fromStage]: updatedFromList,
          [targetStage]: updatedToList,
        },
        counts: {
          ...pipelineData.counts,
          [fromStage]: Math.max(0, pipelineData.counts[fromStage] - 1),
          [targetStage]: (pipelineData.counts[targetStage] || 0) + 1,
        },
      });
    }

    try {
      if (SENSITIVE_STAGES.includes(targetStage) && (targetStage === 'offer' || targetStage === 'hired' || targetStage === 'rejected')) {
        await jobApplicationService.recordDecision(application.id, {
          decision: targetStage,
          reason,
          notes,
          sendEmailNotification: dispatchEmail,
        });
      } else {
        await jobApplicationService.updateApplicationStage(
          application.id,
          targetStage,
          'Pipeline Coordinator',
          notes || `Moved to ${targetStage}`,
          isOverride,
          reason
        );
      }

      setSuccessBanner(
        `Candidate ${application.candidate.fullName} successfully transitioned to ${targetStage.toUpperCase()}.`
      );
      setTimeout(() => setSuccessBanner(null), 4000);
      loadPipeline(); // sync with server
    } catch (err: unknown) {
      // Rollback optimistic update
      setPipelineData(previousSnapshot);
      const msg = err instanceof Error ? err.message : 'Server rejected the stage transition.';
      setErrorBanner(`Transition Failed: ${msg} Visual state has been rolled back.`);
    }
  };

  const handleStageDrop = (targetStage: ApplicationStage) => {
    setDragOverStage(null);
    if (!draggedAppId || !pipelineData) return;

    // Find the application being dragged
    let draggedApp: JobApplication | null = null;
    for (const stage of Object.keys(pipelineData.columns) as ApplicationStage[]) {
      const found = pipelineData.columns[stage].find((a) => a.id === draggedAppId);
      if (found) {
        draggedApp = found;
        break;
      }
    }

    if (!draggedApp || draggedApp.stage === targetStage) return;

    // If target stage is sensitive (offer, hired, rejected) or skipping steps, trigger confirmation modal
    const isSensitive = SENSITIVE_STAGES.includes(targetStage);
    const standardValidTransitions: Record<string, string[]> = {
      applied: ['screening', 'rejected'],
      screening: ['shortlisted', 'rejected'],
      shortlisted: ['interview', 'rejected'],
      interview: ['offer', 'assessment', 'rejected'],
      assessment: ['interview', 'offer', 'rejected'],
      offer: ['hired', 'rejected'],
      hired: [],
      rejected: ['screening', 'shortlisted'],
    };

    const isDirectlyAllowed = (standardValidTransitions[draggedApp.stage] || []).includes(targetStage);

    if (isSensitive || !isDirectlyAllowed) {
      setPendingTransition({
        application: draggedApp,
        targetStage,
        isSensitive,
        isOverride: !isDirectlyAllowed,
      });
      setTransitionReason('');
      setTransitionNotes('');
      setTransitionModalOpen(true);
    } else {
      executeStageTransition(draggedApp, targetStage);
    }

    setDraggedAppId(null);
  };

  const handleModalConfirm = () => {
    if (!pendingTransition) return;
    executeStageTransition(
      pendingTransition.application,
      pendingTransition.targetStage,
      transitionReason,
      transitionNotes,
      pendingTransition.isOverride
    );
    setTransitionModalOpen(false);
    setPendingTransition(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Masthead */}
      <div className="border-b border-admin-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-sans font-semibold tracking-architectural text-accent">
              Operational Workflow
            </span>
            <span className="text-border">&bull;</span>
            <span className="text-[10px] uppercase font-mono text-ink-muted">Kanban Governance</span>
          </div>
          <h1 className="text-2xl font-serif font-light text-ink mt-0.5">
            Recruitment Pipeline & Stage Transitions
          </h1>
          <p className="text-xs text-ink-muted font-sans mt-0.5">
            Drag candidates across milestones or execute audited status decisions. Server-side validation enforces transition compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPipeline}
            className="text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-accent" />
            <span>Synchronize</span>
          </Button>

          <Link to="/admin/interviews">
            <Button variant="primary" size="sm" className="text-xs">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Interview Schedules
            </Button>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {errorBanner && (
        <Alert type="danger" title="Validation & Transition Rollback" onClose={() => setErrorBanner(null)}>
          {errorBanner}
        </Alert>
      )}

      {successBanner && (
        <Alert type="success" title="Status Verified" onClose={() => setSuccessBanner(null)}>
          {successBanner}
        </Alert>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-border p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between font-sans">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, reference ID, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-ink-muted" />
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="text-xs bg-canvas border border-border px-2.5 py-2 text-ink focus:outline-none focus:border-accent"
            >
              <option value="all">All Positions ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-ink-muted" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs bg-canvas border border-border px-2.5 py-2 text-ink focus:outline-none focus:border-accent"
            >
              <option value="all">All Disciplines</option>
              <option value="Engineering">Engineering</option>
              <option value="Architecture">Architecture</option>
              <option value="Quantity Surveying">Quantity Surveying</option>
              <option value="Project Management">Project Management</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-ink-muted" />
            <select
              value={selectedRecruiter}
              onChange={(e) => setSelectedRecruiter(e.target.value)}
              className="text-xs bg-canvas border border-border px-2.5 py-2 text-ink focus:outline-none focus:border-accent"
            >
              <option value="all">All Assigned Leads</option>
              <option value="usr-1">Engr. Babatunde Alabi</option>
              <option value="usr-2">Amina Bello, MNIA</option>
              <option value="usr-3">Tariq Ibrahim</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <LoadingSkeleton height={420} count={7} />
        </div>
      ) : (
        <div className="overflow-x-auto pb-6 admin-scrollbar">
          <div className="flex gap-4 min-w-[1600px] items-start">
            {PIPELINE_STAGES.map(({ stage, label, headerBorder, badgeBg }) => {
              const cards = pipelineData?.columns[stage] || [];
              const isOver = dragOverStage === stage;

              return (
                <div
                  key={stage}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverStage !== stage) setDragOverStage(stage);
                  }}
                  onDragLeave={() => {
                    if (dragOverStage === stage) setDragOverStage(null);
                  }}
                  onDrop={() => handleStageDrop(stage)}
                  className={`flex-1 min-w-[220px] max-w-[260px] bg-canvas/40 border border-border border-t-4 ${headerBorder} transition-colors ${
                    isOver ? 'bg-accent/10 border-accent' : ''
                  }`}
                >
                  {/* Column Header */}
                  <div className="p-3 bg-white border-b border-border flex items-center justify-between font-sans">
                    <span className="text-xs font-serif font-semibold uppercase tracking-wider text-ink">
                      {label}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 border border-border ${badgeBg}`}>
                      {cards.length}
                    </span>
                  </div>

                  {/* Cards Area */}
                  <div className="p-2.5 space-y-2.5 max-h-[75vh] overflow-y-auto admin-scrollbar">
                    {cards.length === 0 ? (
                      <div className="py-10 text-center border border-dashed border-border/60">
                        <span className="text-[11px] text-ink-muted italic font-sans">
                          No candidates
                        </span>
                      </div>
                    ) : (
                      cards.map((app) => (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={() => setDraggedAppId(app.id)}
                          onDragEnd={() => {
                            setDraggedAppId(null);
                            setDragOverStage(null);
                          }}
                          className="bg-white border border-border p-3.5 space-y-2.5 shadow-sm hover:border-accent cursor-grab active:cursor-grabbing transition-all font-sans group"
                        >
                          {/* Title & Rating */}
                          <div className="flex items-start justify-between gap-1">
                            <Link
                              to={`/admin/applications/${app.id}`}
                              className="text-xs font-serif font-medium text-ink group-hover:text-accent truncate block"
                            >
                              {app.candidate.fullName}
                            </Link>

                            {app.rating && (
                              <div className="flex items-center text-accent text-[10px] font-mono shrink-0">
                                <Star className="w-3 h-3 fill-accent mr-0.5" />
                                {app.rating}
                              </div>
                            )}
                          </div>

                          {/* Role & Ref */}
                          <div>
                            <p className="text-[11px] text-ink font-medium truncate" title={app.jobTitle}>
                              {app.jobTitle}
                            </p>
                            <span className="text-[10px] font-mono text-ink-muted block uppercase">
                              Ref: {app.id.toUpperCase()}
                            </span>
                          </div>

                          {/* Candidate Accreditation Tag */}
                          {app.candidate.professionalAccreditation && (
                            <span className="inline-block text-[9px] font-mono bg-accent/10 text-accent px-1.5 py-0.5 border border-accent/20 truncate max-w-full">
                              {app.candidate.professionalAccreditation}
                            </span>
                          )}

                          {/* Meta Details */}
                          <div className="pt-2 border-t border-border/40 text-[10px] text-ink-muted space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono">{app.candidate.yearsOfExperience} yrs exp</span>
                              <span className="font-mono">
                                {new Date(app.appliedAt).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>

                            {app.assignedRecruiter && (
                              <div className="flex items-center gap-1 text-[10px] text-ink-muted truncate">
                                <User className="w-2.5 h-2.5 text-accent" />
                                <span className="truncate">{app.assignedRecruiter.name}</span>
                              </div>
                            )}
                          </div>

                          {/* Quick Stage Controls (Accessible Alternative to Drag & Drop) */}
                          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px]">
                            <select
                              value={app.stage}
                              onChange={(e) => {
                                const newStage = e.target.value as ApplicationStage;
                                if (newStage === app.stage) return;
                                setDraggedAppId(app.id);
                                handleStageDrop(newStage);
                              }}
                              className="text-[10px] bg-canvas border border-border px-1.5 py-1 text-ink focus:outline-none focus:border-accent"
                              aria-label="Change candidate status"
                            >
                              <option value="applied">1. Applied</option>
                              <option value="screening">2. Screening</option>
                              <option value="shortlisted">3. Shortlisted</option>
                              <option value="interview">4. Interview</option>
                              <option value="offer">5. Offered</option>
                              <option value="hired">6. Hired</option>
                              <option value="rejected">7. Rejected</option>
                            </select>

                            <Link
                              to={`/admin/applications/${app.id}`}
                              className="text-accent hover:text-ink font-semibold uppercase tracking-wider inline-flex items-center gap-0.5 text-[10px]"
                            >
                              <span>Dossier</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sensitive Transition & Decision Confirmation Modal */}
      <Modal
        isOpen={transitionModalOpen}
        onClose={() => {
          setTransitionModalOpen(false);
          setPendingTransition(null);
        }}
        title={
          pendingTransition?.isOverride
            ? 'Administrative Stage Override'
            : `Confirm Transition to ${pendingTransition?.targetStage.toUpperCase()}`
        }
        description={
          pendingTransition?.isOverride
            ? 'This transition bypasses standard milestone progression and requires an auditable justification.'
            : 'Review the transition parameters before recording this recruitment decision.'
        }
      >
        {pendingTransition && (
          <div className="space-y-4 font-sans text-xs">
            <div className="p-3 bg-canvas border border-border space-y-1">
              <span className="text-[10px] text-ink-muted uppercase tracking-wider block">
                Candidate Under Review
              </span>
              <p className="font-serif text-sm font-medium text-ink">
                {pendingTransition.application.candidate.fullName}
              </p>
              <p className="text-ink-muted">
                {pendingTransition.application.jobTitle} &bull; Currently in:{' '}
                <strong className="text-ink uppercase font-mono">
                  {pendingTransition.application.stage}
                </strong>
              </p>
            </div>

            {pendingTransition.isOverride && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Out-of-Sequence Milestone Progression</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Moving directly from <strong>{pendingTransition.application.stage}</strong> to{' '}
                  <strong>{pendingTransition.targetStage}</strong> bypasses intermediate review stages.
                  Please provide a documented engineering or business justification.
                </p>
              </div>
            )}

            <FormField
              label={pendingTransition.isOverride ? 'Mandatory Override Reason' : 'Decision Rationale'}
              required={pendingTransition.isOverride || pendingTransition.targetStage === 'rejected'}
            >
              <Input
                value={transitionReason}
                onChange={(e) => setTransitionReason(e.target.value)}
                placeholder={
                  pendingTransition.targetStage === 'rejected'
                    ? 'e.g. Accreditation requirements unverified; does not meet senior years criteria'
                    : 'e.g. Partner discretion following exceptional technical evaluation'
                }
              />
            </FormField>

            <FormField label="Internal Notes & Remuneration Guidelines">
              <Textarea
                rows={3}
                value={transitionNotes}
                onChange={(e) => setTransitionNotes(e.target.value)}
                placeholder="Internal commentary recorded in candidate audit file..."
              />
            </FormField>

            {/* Candidate Notification Confirmation Checkbox */}
            {SENSITIVE_STAGES.includes(pendingTransition.targetStage) && (
              <label className="flex items-start gap-2 pt-2 border-t border-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={dispatchEmail}
                  onChange={(e) => setDispatchEmail(e.target.checked)}
                  className="mt-0.5 rounded border-border text-accent focus:ring-accent"
                />
                <div>
                  <span className="font-medium text-ink block">
                    Dispatch formal notification email to candidate
                  </span>
                  <span className="text-[11px] text-ink-muted block">
                    When enabled, a VOLIA-branded correspondence email is queued immediately to{' '}
                    <strong className="text-ink">{pendingTransition.application.candidate.email}</strong>.
                  </span>
                </div>
              </label>
            )}

            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  setTransitionModalOpen(false);
                  setPendingTransition(null);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleModalConfirm}
                disabled={
                  (pendingTransition.isOverride || pendingTransition.targetStage === 'rejected') &&
                  !transitionReason.trim()
                }
              >
                Confirm Transition
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPipelinePage;
