import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { COMPANY_DATA } from '@/data/company';
import { Clock, ShieldAlert, FileText } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas-surface">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Big Historical Display & Editorial Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="flex items-center space-x-2.5">
              <span className="font-mono text-xs text-accent tracking-widest uppercase font-semibold">
                // INSTITUTIONAL HORIZON
              </span>
              <span className="h-[1px] w-6 bg-accent/40" />
              <span className="text-[10px] font-sans tracking-architectural uppercase text-ink-muted">
                Corporate Legacy
              </span>
            </div>

            <SectionHeading
              title="A heritage of engineering discipline dating back to 1993."
              description="According to publicly available regulatory indexing, VOLIA NIG LTD's corporate foundation traces back to 1993 in Nigeria."
            />

            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base text-ink-muted font-light leading-relaxed font-sans">
              <p>
                In an industry where fly-by-night operations are common, an institutional record spanning three decades signals resilience, statutory standing, and an enduring commitment to Nigeria&apos;s physical infrastructure.
              </p>
              <p>
                Throughout this trajectory, our consultancy focus has remained steadfast: providing clients with uncompromised engineering verification, precise architectural planning, and transparent quantity surveying that shields investments from volatile construction risks.
              </p>
            </div>

            {/* Management Verification Notice */}
            <div className="p-4 sm:p-5 border border-border bg-canvas flex items-start space-x-3 text-xs text-ink-muted">
              <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-ink font-semibold uppercase tracking-wider text-[11px] block">
                  Management Audit Note:
                </span>
                <p className="leading-relaxed">
                  The reported incorporation date of 1993 is recorded from indexed corporate filings. Final historic milestones, archival records, and representative retrospective summaries are undergoing formal management review prior to public print release.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Verification Matrix (5 cols) */}
          <div className="lg:col-span-5 border border-border bg-canvas p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
            <div className="space-y-1.5 border-b border-border pb-5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-accent">
                HISTORICAL RECORD
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-normal leading-none">
                  1993
                </span>
                <span className="text-[11px] sm:text-xs text-ink-muted uppercase tracking-widest font-mono">
                  Reported Founding Year
                </span>
              </div>
            </div>

            {/* Verifiable Credentials Checklist */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-sans font-semibold tracking-architectural uppercase text-ink block">
                Institutional Status
              </span>

              <div className="space-y-2.5">
                {[
                  {
                    label: 'Legal Entity',
                    value: COMPANY_DATA.legalName,
                    status: 'Registered',
                  },
                  {
                    label: 'Jurisdiction',
                    value: 'Federal Republic of Nigeria',
                    status: 'Statutory',
                  },
                  {
                    label: 'Service Scope',
                    value: 'Engineering, Architecture, Quantity Surveying',
                    status: 'Documented',
                  },
                  {
                    label: 'Historical Data',
                    value: 'Incorporation 1993',
                    status: 'Pending Management Audit',
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-border/70 bg-canvas-surface/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="text-ink-muted text-[9px] sm:text-[10px] uppercase font-mono block">
                        {row.label}
                      </span>
                      <span className="text-ink font-medium text-xs">{row.value}</span>
                    </div>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border self-start sm:self-auto ${
                        row.status === 'Pending Management Audit'
                          ? 'border-accent text-accent'
                          : 'border-border text-ink-muted'
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-ink-muted border-t border-border">
              <span className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span>CORPORATE AUDIT: IN PROGRESS</span>
              </span>
              <Clock className="w-3.5 h-3.5 text-ink-muted" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
