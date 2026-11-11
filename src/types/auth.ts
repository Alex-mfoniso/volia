/**
 * VOLIA NIG LTD — Authentication & Access Control Types
 * Designed for Laravel Sanctum / Fortify token or session integration
 */

export type UserRole =
  | 'super_admin'
  | 'hr_admin'
  | 'recruiter'
  | 'interviewer'
  | 'admin'
  | 'hr_manager'
  | 'hiring_manager';

export type Permission =
  | 'jobs:view'
  | 'jobs:create'
  | 'jobs:edit'
  | 'jobs:publish'
  | 'jobs:delete'
  | 'applications:view'
  | 'applications:review'
  | 'applications:change_stage'
  | 'applications:delete'
  | 'interviews:view'
  | 'interviews:schedule'
  | 'interviews:evaluate'
  | 'settings:manage'
  | 'audit:view';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatarUrl?: string;
  permissions: Permission[];
  lastLoginAt?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthSession {
  user: User;
  token?: string; // Bearer token for API authentication
  expiresAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
