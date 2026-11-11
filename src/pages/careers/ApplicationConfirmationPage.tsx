import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  FileCheck,
  Calendar,
  Info,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';

interface ConfirmationState {
  candidateName?: string;
  jobTitle?: string;
  jobDepartment?: string;
  confirmationCode?: string;
  email?: string;
  submissionDate?: string;
  isDevelopmentPreview?: boolean;
}

export const ApplicationConfirmationPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state as ConfirmationState) || {
    candidateName: 'Candidate (Preview Mode)',
    jobTitle: 'Senior Structural Engineer (Bridges & Tall Buildings)',
    jobDepartment: 'Engineering',
    confirmationCode: 'VOLIA-APP-2026-DEMO',
    email: 'applicant.preview@example.com',
    submissionDate: new Date().toISOString(),
    isDevelopmentPreview: true,
  };

  return (
    <>
      <SEO
        title="Application Confirmation | VOLIA NIG LTD"
        description="Candidate application confirmation and recruitment review protocol."
      />

      {/* Explicit Development Environment Notice Banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center">
        <Container size="narrow">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-amber-900">
            <Info className="w-4 h-4 text-accent shrink-0" />
            <span>
              <strong>Development Environment Preview:</strong> This page presents the production confirmation receipt UI. In compliance with Phase 04 specifications, persistent backend database storage and email delivery will be connected in Phase 05.
            </span>
          </div>
        </Container>
      </div>

      <section className="py-16 sm:py-24 bg-canvas min-h-[75vh] flex items-center">
        <Container size="narrow">
          <div className="bg-white border border-border p-8 sm:p-12 shadow-sm space-y-8">
            {/* Top Success Badge */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-status-success-bg text-status-success flex items-center justify-center mx-auto border border-status-success-border">
                <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-architectural text-accent font-semibold block">
                APPLICATION RECEIPT // CLIENT-SIDE VALIDATED
              </span>

              <h1 className="text-2xl sm:text-3xl font-serif font-light text-ink">
                Application Received for Review
              </h1>

              <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto font-sans leading-relaxed">
                Thank you, <strong className="text-ink">{state.candidateName}</strong>. Your application details for the position of <strong className="text-ink">{state.jobTitle}</strong> ({state.jobDepartment}) have been recorded for recruitment processing.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-canvas-surface border border-border p-6 space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-ink-muted uppercase tracking-wider text-[11px] font-mono">
                  Application Reference Number
                </span>
                <span className="font-mono font-bold text-accent text-sm">
                  {state.confirmationCode}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-ink-muted uppercase tracking-wider text-[11px]">
                  Position Applied For
                </span>
                <span className="font-medium text-ink">{state.jobTitle}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-ink-muted uppercase tracking-wider text-[11px]">
                  Discipline
                </span>
                <span className="font-mono text-ink">{state.jobDepartment}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-ink-muted uppercase tracking-wider text-[11px]">
                  Correspondence Email
                </span>
                <span className="font-mono text-ink">{state.email}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-ink-muted uppercase tracking-wider text-[11px]">
                  Submission Date
                </span>
                <span className="font-mono text-ink">
                  {new Date(state.submissionDate || Date.now()).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Next Steps in the Review Protocol */}
            <div className="space-y-4">
              <div className="border-b border-border pb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                  Next Steps
                </span>
                <h3 className="text-base font-serif font-normal text-ink">
                  Candidate Selection &amp; Review Journey
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <div className="border border-border p-4 space-y-2 bg-canvas-surface/40">
                  <div className="flex items-center gap-2 text-accent font-semibold font-mono text-[11px]">
                    <FileCheck className="w-4 h-4" />
                    <span>01. Screening</span>
                  </div>
                  <p className="text-[11px] text-ink-muted leading-relaxed font-light">
                    Administrative verification of statutory council registration (COREN/ARCON/NIQS) and academic degrees.
                  </p>
                </div>

                <div className="border border-border p-4 space-y-2 bg-canvas-surface/40">
                  <div className="flex items-center gap-2 text-accent font-semibold font-mono text-[11px]">
                    <Calendar className="w-4 h-4" />
                    <span>02. Technical Review</span>
                  </div>
                  <p className="text-[11px] text-ink-muted leading-relaxed font-light">
                    Evaluation of project calculation samples and BIM portfolios by senior discipline partners.
                  </p>
                </div>

                <div className="border border-border p-4 space-y-2 bg-canvas-surface/40">
                  <div className="flex items-center gap-2 text-accent font-semibold font-mono text-[11px]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>03. Panel Interview</span>
                  </div>
                  <p className="text-[11px] text-ink-muted leading-relaxed font-light">
                    Shortlisted applicants are contacted directly via official corporate email for interview scheduling.
                  </p>
                </div>
              </div>
            </div>

            {/* Return and Navigation Actions */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/careers" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  <span>Return to Careers Portal</span>
                </Button>
              </Link>

              <Link to="/services" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  <span>Explore VOLIA Services</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ApplicationConfirmationPage;
