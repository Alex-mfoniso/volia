import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Eye, Trash2 } from 'lucide-react';
import { JobPosting, JobStatus } from '@/types';
import { jobService } from '@/services/jobService';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/admin/DataTable';
import { StatusBadge } from '@/components/ui/admin/StatusBadge';
import { TableColumn } from '@/types/ui';
import { ConfirmModal } from '@/components/ui/overlay/ConfirmModal';

export const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<JobPosting | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobService.getAdminJobs({
        status: statusFilter,
        search: searchQuery,
      });
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await jobService.deleteJob(deleteTarget.id);
      setDeleteTarget(null);
      fetchJobs();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      await jobService.setJobStatus(jobId, newStatus);
      fetchJobs();
    } catch (err) {
      console.error('Status change failed', err);
    }
  };

  const columns: TableColumn<JobPosting>[] = [
    {
      key: 'title',
      header: 'Position Title',
      render: (job) => (
        <div>
          <Link
            to={`/admin/jobs/${job.id}`}
            className="font-medium text-ink hover:text-accent transition-colors block text-sm"
          >
            {job.title}
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-0.5">
            <span className="text-accent uppercase font-mono font-medium">
              {job.department}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (job) => <StatusBadge status={job.status} />,
    },
    {
      key: 'type',
      header: 'Engagement',
      render: (job) => (
        <span className="text-[11px] uppercase font-mono text-ink">
          {job.type.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'openingsCount',
      header: 'Vacancies',
      align: 'center',
      render: (job) => (
        <span className="font-mono text-xs tabular-nums text-ink">
          {job.openingsCount}
        </span>
      ),
    },
    {
      key: 'applicationCount',
      header: 'Applications',
      align: 'center',
      render: (job) => (
        <Link
          to={`/admin/applications?jobId=${job.id}`}
          className="font-mono font-medium text-accent hover:underline text-xs tabular-nums"
        >
          {job.applicationCount}
        </Link>
      ),
    },
    {
      key: 'actions',
      header: 'Governance',
      align: 'right',
      render: (job) => (
        <div className="flex items-center justify-end gap-2">
          {job.status === 'draft' && (
            <button
              type="button"
              onClick={() => handleStatusChange(job.id, 'published')}
              className="px-2 py-1 bg-status-success-bg text-status-success border border-status-success-border text-[10px] uppercase font-sans font-semibold hover:bg-status-success hover:text-white transition-colors"
            >
              Publish
            </button>
          )}

          {job.status === 'published' && (
            <button
              type="button"
              onClick={() => handleStatusChange(job.id, 'closed')}
              className="px-2 py-1 bg-status-warning-bg text-status-warning border border-status-warning-border text-[10px] uppercase font-sans font-semibold hover:bg-status-warning hover:text-white transition-colors"
            >
              Close
            </button>
          )}

          <Link
            to={`/admin/jobs/${job.id}`}
            className="p-1.5 text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
            title="Inspect Job"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setDeleteTarget(job)}
            className="p-1.5 text-ink-muted hover:text-status-danger hover:bg-status-danger-bg transition-colors"
            title="Delete Position"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-6">
        <div>
          <span className="text-[10px] uppercase font-sans font-semibold tracking-architectural text-accent block">
            Practice Openings
          </span>
          <h1 className="text-2xl font-serif font-light text-ink">
            Recruitment Vacancies
          </h1>
          <p className="text-xs text-ink-muted font-sans mt-0.5">
            Manage public position specifications, statutory requirements, and publication status.
          </p>
        </div>

        <Link to="/admin/jobs/create">
          <Button variant="primary" size="sm" className="text-xs py-2">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Position
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1">
          {['all', 'published', 'draft', 'closed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-colors ${
                statusFilter === status
                  ? 'bg-ink text-white font-semibold'
                  : 'bg-canvas-surface text-ink-muted hover:text-ink'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search title, discipline, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-canvas border border-border pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent font-sans"
          />
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-2.5 pointer-events-none" />
        </form>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={jobs}
        keyExtractor={(job) => job.id}
        isLoading={isLoading}
        emptyTitle="No job openings found"
        emptyDescription="There are currently no position specifications matching the selected filters."
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Recruitment Specification"
        isDestructive
        confirmLabel="Confirm Permanent Deletion"
        message={
          <>
            Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? All associated
            draft notes and application linkages will be affected.
          </>
        }
      />
    </div>
  );
};

export default AdminJobsPage;
