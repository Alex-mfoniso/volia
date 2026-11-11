import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Edit } from 'lucide-react';
import { JobPosting, JobApplication, JobStatus } from '@/types';
import { jobService } from '@/services/jobService';
import { jobApplicationService } from '@/services/jobApplicationService';
import { StatusBadge } from '@/components/ui/admin/StatusBadge';
import { DataTable } from '@/components/ui/admin/DataTable';
import { TableColumn } from '@/types/ui';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';

export const AdminJobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const jobData = await jobService.getJobById(id);
      if (jobData) {
        setJob(jobData);
        const apps = await jobApplicationService.getApplications({ jobId: jobData.id });
        setApplications(apps);
      }
    } catch (err) {
      console.error('Failed to load job details', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!job) return;
    try {
      await jobService.setJobStatus(job.id, newStatus);
      loadData();
    } catch (err) {
      console.error('Failed to change status', err);
    }
  };

  const appColumns: TableColumn<JobApplication>[] = [
    {
      key: 'name',
      header: 'Candidate',
      render: (app) => (
        <div>
          <Link
            to={`/admin/applications/${app.id}`}
            className="font-medium text-ink hover:text-accent"
          >
            {app.candidate.fullName}
          </Link>
          <span className="text-[11px] text-ink-muted block">{app.candidate.email}</span>
        </div>
      ),
    },
    {
      key: 'experience',
      header: 'Experience',
      render: (app) => (
        <span className="font-mono text-xs">{app.candidate.yearsOfExperience} yrs</span>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (app) => <StatusBadge status={app.stage} />,
    },
    {
      key: 'appliedAt',
      header: 'Applied Date',
      render: (app) => (
        <span className="text-[11px] text-ink-muted font-mono">
          {new Date(app.appliedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (app) => (
        <Link
          to={`/admin/applications/${app.id}`}
          className="text-xs font-semibold uppercase tracking-wider text-accent hover:text-ink"
        >
          Review Dossier &rarr;
        </Link>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton height={32} width="40%" />
        <LoadingSkeleton height={180} count={2} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center bg-white border border-border">
        <h2 className="text-lg font-serif text-ink mb-2">Job Specification Not Found</h2>
        <Link to="/admin/jobs" className="text-xs text-accent underline">
          Return to Positions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-admin-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink font-sans mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Positions</span>
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-light text-ink">{job.title}</h1>
            <StatusBadge status={job.status} />
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-muted font-sans mt-1">
            <span className="text-accent uppercase font-mono font-medium">
              {job.department}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-accent" />
              {job.location}
            </span>
            <span>&bull;</span>
            <span className="font-mono">Ref: {job.id.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/jobs/${job.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border bg-white text-ink hover:bg-canvas hover:text-accent transition-colors font-sans"
          >
            <Edit className="w-3.5 h-3.5 text-accent" />
            <span>Edit Position</span>
          </Link>

          {job.status === 'published' ? (
            <button
              type="button"
              onClick={() => handleStatusChange('closed')}
              className="px-3 py-1.5 text-xs font-sans uppercase tracking-wider bg-status-warning-bg text-status-warning border border-status-warning-border hover:bg-status-warning hover:text-white transition-colors"
            >
              Close Position
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleStatusChange('published')}
              className="px-3 py-1.5 text-xs font-sans uppercase tracking-wider bg-status-success-bg text-status-success border border-status-success-border hover:bg-status-success hover:text-white transition-colors"
            >
              Publish Live
            </button>
          )}

          <a
            href={`/careers/${job.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border bg-white text-ink hover:bg-canvas transition-colors"
          >
            <span>Public View</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </a>
        </div>
      </div>

      {/* Grid: Job Overview Card + Associated Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Specification Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-border p-6 space-y-4">
            <h3 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
              Specification Parameters
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-ink-muted">Discipline</span>
                <span className="font-medium text-ink">{job.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-ink-muted">Seniority</span>
                <span className="font-medium text-ink capitalize">{job.experienceLevel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-ink-muted">Type</span>
                <span className="font-mono text-ink uppercase">{job.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-ink-muted">Target Headcount</span>
                <span className="font-mono font-bold text-ink">{job.openingsCount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink-muted">Created</span>
                <span className="font-mono text-ink">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold uppercase text-ink block mb-1">
                Role Mandate
              </span>
              <p className="text-xs text-ink-muted leading-relaxed font-sans">
                {job.overview}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Candidate Applications for this specific Job (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-medium text-ink uppercase tracking-wider">
              Applications for this Position ({applications.length})
            </h3>
            <Link
              to={`/admin/pipeline`}
              className="text-xs text-accent hover:text-ink font-sans"
            >
              Open in Pipeline &rarr;
            </Link>
          </div>

          <DataTable
            columns={appColumns}
            data={applications}
            keyExtractor={(a) => a.id}
            emptyTitle="No applications recorded yet"
            emptyDescription="No candidates have applied to this specific commission vacancy."
          />
        </div>
      </div>
    </div>
  );
};

export default AdminJobDetailPage;
