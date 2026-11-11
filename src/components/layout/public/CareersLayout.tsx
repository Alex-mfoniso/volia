import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft, Briefcase, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export const CareersLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-border bg-canvas/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-serif text-xl tracking-wider font-semibold text-ink">
                VOLIA
              </span>
              <span className="text-[10px] uppercase font-sans tracking-architectural text-accent font-semibold px-1.5 py-0.5 border border-accent/40 bg-accent/10">
                Careers
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <Link
              to="/careers"
              className="font-medium text-ink hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-accent" />
              <span>Open Commissions</span>
            </Link>

            <Link
              to="/"
              className="text-ink-muted hover:text-ink transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Back to Corporate Site</span>
              <span className="sm:hidden">Corporate</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Recruitment Institutional Note */}
      <section className="bg-canvas-surface border-t border-border py-8 text-center text-xs text-ink-muted font-sans">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-ink font-medium">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Equal Opportunity & Professional Integrity</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            VOLIA NIG LTD assesses all candidates strictly on technical competence, verified
            statutory accreditations (e.g. COREN, ARCON, QSRBN, NIQS), and professional alignment.
            Candidate data is protected under Nigerian data privacy laws and never shared externally.
          </p>
        </div>
      </section>

      {/* Standard Institutional Footer */}
      <Footer />
    </div>
  );
};

export default CareersLayout;
