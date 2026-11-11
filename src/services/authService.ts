/**
 * VOLIA NIG LTD — Authentication Service
 * Seamlessly interfaces with Laravel Sanctum or local development fixtures
 */

import { User, LoginCredentials, AuthSession, UserRole, Permission } from '@/types';
import { MOCK_ADMIN_USERS } from '@/data/mockRecruitmentData';
import { apiClient } from './api/apiClient';

const AUTH_USER_KEY = 'volia_auth_user';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

class AuthService {
  /**
   * Authenticate admin / HR user
   */
  public async login(credentials: LoginCredentials): Promise<AuthSession> {
    if (!USE_MOCK) {
      try {
        // First fetch CSRF cookie for Laravel Sanctum SPA authentication
        await apiClient.get('/sanctum/csrf-cookie');
        const response = await apiClient.post<{ user: User; token?: string }>('/admin/login', credentials);
        
        if (response.token) {
          apiClient.setToken(response.token);
        }
        this.persistUser(response.user);
        return { user: response.user, token: response.token };
      } catch (err) {
        throw err;
      }
    }

    // Mock Authentication for Development with convenient aliases
    const normalizedEmail = credentials.email.trim().toLowerCase();
    let user = MOCK_ADMIN_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      if (normalizedEmail === 'admin@volia.ng' || normalizedEmail === 'superadmin@volia.ng') {
        user = MOCK_ADMIN_USERS.find((u) => u.role === 'super_admin');
      } else if (normalizedEmail === 'hr@volia.ng') {
        user = MOCK_ADMIN_USERS.find((u) => u.role === 'hr_admin');
      } else if (normalizedEmail === 'recruiter@volia.ng') {
        user = MOCK_ADMIN_USERS.find((u) => u.role === 'recruiter');
      } else if (normalizedEmail === 'interviewer@volia.ng') {
        user = MOCK_ADMIN_USERS.find((u) => u.role === 'interviewer');
      }
    }

    if (!user) {
      throw new Error('Invalid email or credentials for the VOLIA administration portal.');
    }

    // In mock mode, any password >= 6 chars is accepted for defined mock users
    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const mockToken = `mock-sanctum-token-${user.id}-${Date.now()}`;
    apiClient.setToken(mockToken);
    this.persistUser(user);

    return {
      user,
      token: mockToken,
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    };
  }

  /**
   * End session and revoke tokens
   */
  public async logout(): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.post('/admin/logout');
      } catch {
        // Continue clearing local state regardless of network response
      }
    }

    apiClient.clearToken();
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Get currently active session user
   */
  public async getCurrentUser(): Promise<User | null> {
    // Check locally persisted user first
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        return user;
      }
    } catch {
      // Fallback
    }

    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<User>('/admin/me');
        this.persistUser(response);
        return response;
      } catch {
        return null;
      }
    }

    // If mock mode and no stored user, default to initial demo HR lead for development ease
    const defaultUser = MOCK_ADMIN_USERS[1]; // Amina Bello (HR Manager)
    this.persistUser(defaultUser);
    return defaultUser;
  }

  private persistUser(user: User): void {
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch {
      // Fallback
    }
  }

  /**
   * Role and Permission Checks
   */
  public hasRole(user: User | null, roles: UserRole[]): boolean {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'super_admin') return true; // Super Admins have full access
    return roles.includes(user.role);
  }

  public hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'super_admin') return true;
    return user.permissions.includes(permission);
  }
}

export const authService = new AuthService();
export default authService;
