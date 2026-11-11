import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/form/FormField';
import { Input } from '@/components/ui/form/Input';
import { Alert } from '@/components/ui/feedback/Alert';
import { SEO } from '@/components/common/SEO';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('a.bello@volia.ng');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <>
      <SEO
        title="Administrative Sign In | VOLIA NIG LTD"
        description="Privileged access portal for VOLIA recruitment, engineering governance, and candidate evaluation."
      />

      <div className="min-h-screen bg-admin-sidebar flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
        {/* Back Link */}
        <div className="w-full max-w-md mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Corporate Website</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white border border-border shadow-2xl p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl tracking-wider font-semibold text-ink">
                  VOLIA
                </span>
                <span className="text-[10px] uppercase font-sans tracking-architectural text-accent font-semibold px-1.5 py-0.5 border border-accent/40 bg-accent/10">
                  Internal
                </span>
              </div>
              <div className="w-8 h-8 bg-canvas-surface flex items-center justify-center text-ink border border-border">
                <Shield className="w-4 h-4 stroke-[1.5]" />
              </div>
            </div>

            <h1 className="text-xl font-serif font-light text-ink">
              Talent Management Platform
            </h1>
            <p className="text-xs text-ink-muted leading-relaxed font-sans">
              Enter credentials to access candidate dossiers, recruitment pipelines, and interview governance.
            </p>
          </div>

          {errorMessage && (
            <Alert type="danger" title="Authentication Error">
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Practice Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@volia.ng"
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
            </FormField>

            <FormField label="Security Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full justify-center bg-ink hover:bg-ink/90 text-white"
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Development Quick Role Switcher */}
          <div className="pt-4 border-t border-border space-y-2">
            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-ink-muted block text-center">
              Demonstration Sign-In Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('a.bello@volia.ng')}
                className="p-2 border border-border text-left hover:border-ink hover:bg-canvas transition-colors"
              >
                <span className="block text-[11px] font-medium text-ink truncate">
                  Amina Bello
                </span>
                <span className="block text-[10px] text-accent truncate">
                  HR Manager
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('b.alabi@volia.ng')}
                className="p-2 border border-border text-left hover:border-ink hover:bg-canvas transition-colors"
              >
                <span className="block text-[11px] font-medium text-ink truncate">
                  Engr. B. Alabi
                </span>
                <span className="block text-[10px] text-status-danger truncate">
                  Head of Practice
                </span>
              </button>
            </div>
          </div>

          {/* Compliance note */}
          <p className="text-[10px] text-ink-muted text-center leading-relaxed">
            All administrative actions are cryptographically logged for audit compliance.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
