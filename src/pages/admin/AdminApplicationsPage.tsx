import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, Star } from 'lucide-react';
import { JobApplication } from '@/types';
import { jobApplicationService } from '@/services/jobApplicationService';
import { DataTable } from '@/components/ui/admin/DataTable';
import { StatusBadge } from '@/components/ui/admin/StatusBadge';
import { TableColumn } from '@/types/ui';

export const AdminApplicationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'all';

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await jobApplicationService.getApplications({
        stage: stageFilter,
        jobId: initialJobId,
        search: searchQuery,
      });
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [stageFilter, initialJobId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const columns: TableColumn<JobApplication>[] = [
    {
      key: 'candidate',
      header: 'Candidate Name & Contact',
      render: (app) => (
        <div>
          <Link
            to={`/admin/applications/${app.id}`}
            className="font-medium text-ink hover:text-accent transition-colors block text-sm"
          >
            {app.candidate.fullName}
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-ink-muted">
            <span>{app.candidate.email}</span>
            <span>&bull;</span>
            <span>{app.candidate.currentLocation}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Commission Position',
      render: (app) => (
        <div>
          <span className="text-ink font-medium block text-xs">{app.jobTitle}</span>
          <span className="text-[10px] text-accent uppercase font-mono tracking-wider">
            {app.jobDepartment}
          </span>
        </div>
      ),
    },
    {
      key: 'qualifications',
      header: 'Credentials & Accreditations',
      render: (app) => (
        <div className="text-xs">
          <span className="font-mono text-ink">
            {app.candidate.yearsOfExperience} yrs exp
          </span>
          {app.candidate.professionalAccreditation ? (
            <span className="block text-[10px] text-status-success font-medium truncate max-w-[160px]">
              {app.candidate.professionalAccreditation}
            </span>
          ) : (
            <span className="block text-[10px] text-ink-muted">Standard Graduate</span>
          )}
        </div>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (app) => <StatusBadge status={app.stage} />,
    },
    {
      key: 'rating',
      header: 'Peer Score',
      align: 'center',
      render: (app) => (
        <div className="flex items-center justify-center gap-0.5 text-accent">
          {app.rating ? (
            <>
              <Star className="w-3.5 h-3.5 fill-accent" />
              <span className="text-xs font-mono font-bold text-ink ml-1">
                {app.rating}/5
              </span>
            </>
          ) : (
            <span className="text-[11px] text-ink-muted">Pending</span>
          )}
        </div>
      ),
    },
    {
      key: 'appliedAt',
      header: 'Submitted',
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
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-medium bg-canvas hover:bg-ink hover:text-white border border-border transition-colors"
        >
          <span>Dossier</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  const stages = [
    'all',
    'applied',
    'screening',
    'shortlisted',
    'interview',
    'assessment',
    'offer',
    'hired',
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-6">
        <div>
          <span className="text-[10px] uppercase font-sans font-semibold tracking-architectural text-accent block">
            Applicant Repository
          </span>
          <h1 className="text-2xl font-serif font-light text-ink">
            Candidate Submissions & Dossiers
          </h1>
          <p className="text-xs text-ink-muted font-sans mt-0.5">
            Peer review of candidate CVs, portfolio drawings, and statutory credential verification.
          </p>
        </div>

        {initialJobId !== 'all' && (
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="text-xs text-accent underline self-start sm:self-auto"
          >
            Clear Job Filter &times;
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 admin-scrollbar">
          {stages.map((stg) => (
            <button
              key={stg}
              type="button"
              onClick={() => setStageFilter(stg)}
              className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider whitespace-nowrap transition-colors ${
                stageFilter === stg
                  ? 'bg-ink text-white font-semibold'
                  : 'bg-canvas-surface text-ink-muted hover:text-ink'
              }`}
            >
              {stg}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            placeholder="Search candidate name, email, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-canvas border border-border pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent font-sans"
          />
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-2.5 pointer-events-none" />
        </form>
      </div>

      {/* Applications Table */}
      <DataTable
        columns={columns}
        data={applications}
        keyExtractor={(app) => app.id}
        isLoading={isLoading}
        emptyTitle="No candidate applications match parameters"
        emptyDescription="There are no applicants recorded under this stage or filter."
      />
    </div>
  );
};

export default AdminApplicationsPage;
