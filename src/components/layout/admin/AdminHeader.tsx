import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NotificationCenter } from '@/components/ui/admin/NotificationCenter';

export interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const isMock = import.meta.env.VITE_USE_MOCK_API !== 'false';

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/admin/dashboard')) return 'Executive Dashboard';
    if (path.startsWith('/admin/jobs/create')) return 'Publish New Position';
    if (path.startsWith('/admin/jobs/')) return 'Job Specification Details';
    if (path.startsWith('/admin/jobs')) return 'Recruitment Openings';
    if (path.startsWith('/admin/applications/')) return 'Candidate Dossier & Review';
    if (path.startsWith('/admin/applications')) return 'Candidate Submissions';
    if (path.startsWith('/admin/pipeline')) return 'Talent Pipeline Stages';
    if (path.startsWith('/admin/interviews')) return 'Interview Schedules';
    if (path.startsWith('/admin/settings')) return 'Platform Roles & Security';
    return 'Recruitment Administration';
  };

  return (
    <header className="h-16 bg-white border-b border-admin-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-ink-muted hover:text-ink hover:bg-canvas-surface transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted uppercase tracking-wider hidden sm:inline">
            Admin
          </span>
          <span className="text-xs text-ink-muted hidden sm:inline">/</span>
          <h1 className="text-sm font-semibold text-ink tracking-tight font-sans">
            {getBreadcrumbTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend status indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-canvas-surface border border-border text-[11px] text-ink-muted">
          <Database className="w-3 h-3 text-accent" />
          <span>
            Mode:{' '}
            <strong className="text-ink font-mono font-medium">
              {isMock ? 'Local Fixtures' : 'Express API'}
            </strong>
          </span>
        </div>

        {/* Live Notification Center */}
        <NotificationCenter />

        {/* Create Job CTA */}
        <Link to="/admin/jobs/create">
          <Button variant="primary" size="sm" className="hidden sm:inline-flex text-xs py-2">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Position
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
