import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  ArrowRight,
  Clock,
  Plus,
} from 'lucide-react';
import {
  JobApplication,
  JobPosting,
  InterviewSchedule,
  RecruitmentMetrics,
} from '@/types';
import { jobService } from '@/services/jobService';
import { jobApplicationService } from '@/services/jobApplicationService';
import { interviewService } from '@/services/interviewService';
import { MetricCard } from '@/components/ui/admin/MetricCard';
import { DataTable } from '@/components/ui/admin/DataTable';
import { StatusBadge } from '@/components/ui/admin/StatusBadge';
import { Button } from '@/components/ui/Button';
import { TableColumn } from '@/types/ui';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<RecruitmentMetrics | null>(null);
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewSchedule[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [metricData, apps, interviews, jobs] = await Promise.all([
          interviewService.getRecruitmentMetrics(),
          jobApplicationService.getApplications(),
          interviewService.getInterviews(),
          jobService.getAdminJobs(),
        ]);

        if (mounted) {
          setMetrics(metricData);
          setRecentApplications(apps.slice(0, 5));
          setUpcomingInterviews(interviews.slice(0, 3));
          setRecentJobs(jobs.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load recruitment dashboard data', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  const applicationColumns: TableColumn<JobApplication>[] = [
    {
      key: 'candidate',
      header: 'Candidate',
      render: (app) => (
        <div>
          <span className="font-medium text-ink block">{app.candidate.fullName}</span>
          <span className="text-[11px] text-ink-muted">{app.candidate.email}</span>
        </div>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Applied Position',
      render: (app) => (
        <div>
          <span className="text-ink font-medium block">{app.jobTitle}</span>
          <span className="text-[10px] text-accent uppercase font-mono tracking-wider">
            {app.jobDepartment}
          </span>
        </div>
      ),
    },
    {
      key: 'experience',
      header: 'Experience',
      render: (app) => (
        <span className="font-mono text-ink">
          {app.candidate.yearsOfExperience} yrs
        </span>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (app) => <StatusBadge status={app.stage} />,
    },
    {
      key: 'appliedAt',
      header: 'Applied',
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
          className="text-accent hover:text-ink font-medium text-xs inline-flex items-center gap-1"
        >
          <span>Review</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-6">
        <div>
          <span className="text-[10px] uppercase font-sans font-semibold tracking-architectural text-accent block">
            Practice Operations Overview
          </span>
          <h1 className="text-2xl font-serif font-light text-ink">
            Recruitment Command & Governance
          </h1>
          <p className="text-xs text-ink-muted font-sans mt-0.5">
            Active candidate pipeline, multidisciplinary vacancies, and statutory accreditation reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/jobs/create">
            <Button variant="primary" size="sm" className="text-xs py-2">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Publish Position
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          kicker="Active Positions"
          label="Published Vacancies"
          value={metrics?.totalActiveJobs || 4}
          change={{ value: '+1 this month', trend: 'up' }}
          icon={Briefcase}
        />
        <MetricCard
          kicker="Talent Pipeline"
          label="Total Applications"
          value={metrics?.totalApplications || 52}
          change={{ value: '+14% YoY', trend: 'up' }}
          icon={Users}
        />
        <MetricCard
          kicker="Under Review"
          label="Screening & Panel"
          value={metrics?.inReviewCount || 16}
          change={{ value: 'Active scrutiny', trend: 'neutral' }}
          icon={Clock}
        />
        <MetricCard
          kicker="Evaluation Phase"
          label="Interviews Scheduled"
          value={metrics?.interviewsScheduled || 4}
          change={{ value: 'This fortnight', trend: 'up' }}
          icon={Calendar}
        />
      </div>

      {/* Pipeline Funnel Mini-Visualizer */}
      <div className="bg-white border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider">
            Recruitment Pipeline Stage Distribution
          </h2>
          <Link
            to="/admin/pipeline"
            className="text-xs text-accent hover:text-ink font-sans flex items-center gap-1"
          >
            <span>Open Interactive Kanban Pipeline</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {[
            { label: 'Applied', count: 19, color: 'bg-status-neutral-bg border-status-neutral-border text-status-neutral' },
            { label: 'Screening', count: 12, color: 'bg-status-info-bg border-status-info-border text-status-info' },
            { label: 'Shortlisted', count: 9, color: 'bg-accent/15 border-accent/30 text-accent' },
            { label: 'Interview', count: 5, color: 'bg-status-warning-bg border-status-warning-border text-status-warning' },
            { label: 'Assessment', count: 4, color: 'bg-status-info-bg border-status-info-border text-status-info' },
            { label: 'Offer', count: 1, color: 'bg-accent/20 border-accent/40 text-accent font-semibold' },
            { label: 'Hired', count: 2, color: 'bg-status-success-bg border-status-success-border text-status-success font-semibold' },
          ].map((stage) => (
            <div
              key={stage.label}
              className={`p-3 border text-center transition-all hover:border-ink ${stage.color}`}
            >
              <span className="block text-[10px] uppercase font-sans tracking-wider text-ink-muted">
                {stage.label}
              </span>
              <span className="block text-xl font-serif font-medium tabular-nums mt-1 text-ink">
                {stage.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Applications + Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Submissions (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider">
              Recent Candidate Submissions
            </h2>
            <Link
              to="/admin/applications"
              className="text-xs text-accent hover:text-ink font-sans flex items-center gap-1"
            >
              <span>View All Submissions</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <DataTable
            columns={applicationColumns}
            data={recentApplications}
            keyExtractor={(app) => app.id}
            isLoading={isLoading}
          />
        </div>

        {/* Right: Upcoming Interviews & Quick Vacancies (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Interviews Box */}
          <div className="bg-white border border-border p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <h3 className="text-xs font-serif font-medium text-ink uppercase tracking-wider">
                Upcoming Panel Reviews
              </h3>
              <Link
                to="/admin/interviews"
                className="text-[11px] text-accent hover:text-ink"
              >
                Schedule
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingInterviews.map((int) => (
                <div
                  key={int.id}
                  className="p-3 border border-border/80 hover:border-ink transition-colors bg-canvas/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink font-sans">
                      {int.candidateName}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-status-info-bg text-status-info border border-status-info-border">
                      {int.interviewType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted truncate font-sans">
                    {int.jobTitle}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-ink-muted font-mono pt-1">
                    <Calendar className="w-3 h-3 text-accent" />
                    <span>
                      {new Date(int.scheduledAt).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Active Vacancies */}
          <div className="bg-white border border-border p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <h3 className="text-xs font-serif font-medium text-ink uppercase tracking-wider">
                Active Openings
              </h3>
              <Link to="/admin/jobs" className="text-[11px] text-accent hover:text-ink">
                All ({recentJobs.length})
              </Link>
            </div>

            <div className="space-y-2">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/admin/jobs/${job.id}`}
                  className="block p-2.5 hover:bg-canvas/40 border border-transparent hover:border-border transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink truncate max-w-[180px]">
                      {job.title}
                    </span>
                    <span className="text-[10px] font-mono text-accent">
                      {job.applicationCount} apps
                    </span>
                  </div>
                  <span className="text-[10px] text-ink-muted uppercase">
                    {job.department} &bull; {job.location}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
