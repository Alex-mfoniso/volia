import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  GitPullRequest,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const canManageSettings = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'hr_admin';

  const navGroups = [
    {
      title: 'Recruitment Operations',
      items: [
        { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Job Openings', href: '/admin/jobs', icon: Briefcase },
        { label: 'Applications', href: '/admin/applications', icon: Users },
        { label: 'Candidates', href: '/admin/candidates', icon: UserCheck },
        { label: 'Hiring Pipeline', href: '/admin/pipeline', icon: GitPullRequest },
        { label: 'Interviews', href: '/admin/interviews', icon: Calendar },
      ],
    },
    ...(canManageSettings
      ? [
          {
            title: 'Platform Administration',
            items: [
              { label: 'Settings & Roles', href: '/admin/settings', icon: Settings },
            ],
          },
        ]
      : []),
  ];

  const getRoleVariant = (role?: string) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return 'danger';
      case 'hr_admin':
      case 'hr_manager':
        return 'accent';
      case 'recruiter':
        return 'neutral';
      case 'interviewer':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Surface */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-admin-sidebar text-white border-r border-admin-sidebarActive flex flex-col transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top Masthead */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-admin-sidebarActive">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-wider font-semibold text-white">
                VOLIA
              </span>
              <span className="text-[10px] uppercase font-sans tracking-architectural text-accent font-semibold px-1.5 py-0.5 border border-accent/40 bg-accent/10">
                Talent OS
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-0.5">
              Recruitment Platform
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 admin-scrollbar font-sans">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <span className="px-3 text-[10px] font-semibold uppercase tracking-architectural text-gray-400 block mb-2">
                {group.title}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 text-xs font-medium transition-colors rounded-none',
                        isActive
                          ? 'bg-admin-sidebarActive text-white border-l-2 border-accent font-semibold'
                          : 'text-gray-300 hover:text-white hover:bg-admin-sidebarActive/50'
                      )
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Quick link to public careers portal */}
          <div className="pt-4 border-t border-admin-sidebarActive">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-architectural text-gray-400 block mb-2">
              Public Portal
            </span>
            <a
              href="/careers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-admin-sidebarActive/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
                Live Careers Site
              </span>
              <span className="text-[10px] text-gray-400 font-mono">↗</span>
            </a>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-admin-sidebarActive bg-black/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-none bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xs font-serif font-bold shrink-0">
                {user?.name.charAt(0) || 'V'}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-medium text-white truncate font-sans">
                  {user?.name || 'Administrator'}
                </span>
                <span className="block text-[11px] text-gray-400 truncate font-sans">
                  {user?.email || 'admin@volia.ng'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-admin-sidebarActive/60">
            <Badge variant={getRoleVariant(user?.role)} size="sm">
              <Shield className="w-2.5 h-2.5 mr-1" />
              {user?.role?.replace('_', ' ') || 'Admin'}
            </Badge>

            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-status-danger transition-colors font-sans"
              title="End session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
