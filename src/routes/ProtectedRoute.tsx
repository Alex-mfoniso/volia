import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole, Permission } from '@/types';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
}) => {
  const { user, isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-admin-canvas flex flex-col items-center justify-center p-6">
        <div className="max-w-xs w-full bg-white border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-wider font-semibold text-ink">
              VOLIA
            </span>
            <span className="text-[10px] text-accent uppercase tracking-architectural">
              Security Verification
            </span>
          </div>
          <LoadingSkeleton height={16} count={2} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Role validation
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!hasRole(roles)) {
      return (
        <div className="min-h-screen bg-admin-canvas flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-border p-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-architectural text-status-danger block mb-2">
              403 • Authorization Restricted
            </span>
            <h2 className="text-xl font-serif font-medium text-ink mb-2">
              Privileged Access Required
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed font-sans mb-6">
              Your account ({user?.role}) does not have administrative clearance to access
              this recruitment module. Contact the Head of Practice for role elevation.
            </p>
            <a
              href="/admin/dashboard"
              className="inline-block px-4 py-2 bg-ink text-white text-xs uppercase tracking-wider font-sans"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  // Permission validation
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-admin-canvas flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-border p-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-architectural text-status-danger block mb-2">
            Permission Denied
          </span>
          <h2 className="text-xl font-serif font-medium text-ink mb-2">
            Missing Operation Clearance
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed font-sans mb-6">
            You require the permission <code>{requiredPermission}</code> to perform this action.
          </p>
          <a
            href="/admin/dashboard"
            className="inline-block px-4 py-2 bg-ink text-white text-xs uppercase tracking-wider font-sans"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
