import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Briefcase, Award, ShieldCheck, Users } from 'lucide-react';

export const CareersSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 border-b border-border bg-canvas-surface relative overflow-hidden">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 border border-border bg-white text-[10px] font-mono uppercase text-accent font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-accent" />
              <span>Practice Recruitment &bull; Talent Opportunities</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ink leading-[1.12]">
              Build your career with VOLIA.
            </h2>

            <p className="font-sans text-sm sm:text-base text-ink-muted font-light leading-relaxed max-w-xl">
              Explore opportunities to contribute your skills and grow within an engineering and consultancy environment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white border border-border space-y-1">
                <span className="text-[10px] font-mono text-accent uppercase block">Discipline</span>
                <span className="text-xs font-semibold text-ink block">Engineering</span>
                <p className="text-[11px] text-ink-muted">Structural, Civil, Infrastructure</p>
              </div>

              <div className="p-4 bg-white border border-border space-y-1">
                <span className="text-[10px] font-mono text-accent uppercase block">Discipline</span>
                <span className="text-xs font-semibold text-ink block">Architecture</span>
                <p className="text-[11px] text-ink-muted">Spatial Planning, BIM, Envelopes</p>
              </div>

              <div className="p-4 bg-white border border-border space-y-1">
                <span className="text-[10px] font-mono text-accent uppercase block">Discipline</span>
                <span className="text-xs font-semibold text-ink block">Quantity Surveying</span>
                <p className="text-[11px] text-ink-muted">Cost Engineering, BoQ, Contracts</p>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/careers">
                <Button variant="primary" size="md" className="min-h-[44px]">
                  <span>Explore Opportunities</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Editorial Visual Card */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-2 border-b border-border/80 pb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
                  PRACTICE ENVIRONMENT
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
                  Multidisciplinary Collaboration
                </h3>
              </div>

              <div className="space-y-4 text-xs font-sans text-ink-muted leading-relaxed">
                <div className="flex items-start space-x-3">
                  <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ink font-medium block">Professional Development</strong>
                    <span>Support for statutory accreditation renewals (COREN, ARCON, NIQS, QSRBN).</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ink font-medium block">Statutory Integrity</strong>
                    <span>Rigorous adherence to Nigerian Building Codes, Eurocodes, and ethics.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ink font-medium block">Multidisciplinary Teams</strong>
                    <span>Close daily interaction between engineers, architects, and cost managers.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-ink-muted">OPEN COMMISSIONS: ACTIVE</span>
                <Link to="/careers" className="text-accent hover:underline font-semibold">
                  View Listings &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CareersSection;
