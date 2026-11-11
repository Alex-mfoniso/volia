import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReusableCTA } from '@/components/layout/ReusableCTA';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import { CAPABILITY_STATEMENT_DATA } from '@/data/capabilityData';
import { generateCapabilityStatementPdf } from '@/lib/pdfGenerator';
import {
  Download,
  FileCheck,
  ShieldAlert,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const data = CAPABILITY_STATEMENT_DATA;

  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    try {
      generateCapabilityStatementPdf();
    } catch (err) {
      console.error('Error generating capability statement PDF:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <AppLayout>
      <SEO
        title="Corporate Capability Statement &amp; Practice Profile"
        description="Official capability statement for VOLIA NIG LTD. Multidisciplinary engineering consultancy, architectural strategy, and quantity surveying in Nigeria."
        canonicalPath="/company-profile"
      />

      <PageHeader
        kicker="Institutional Profile"
        title="Corporate Capability Statement &amp; Advisory Mandate."
        description="A comprehensive presentation of VOLIA NIG LTD's built-environment advisory capabilities, structural engineering disciplines, and commercial governance framework for corporate procurement committees."
        breadcrumb="PRACTICE // CAPABILITY STATEMENT"
      />

      <section className="py-12 sm:py-16 lg:py-20 border-b border-border bg-canvas">
        <Container size="narrow">
          <div className="space-y-12">
            {/* Download Capability Statement Banner */}
            <div className="border border-border bg-canvas-surface/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-accent uppercase font-bold">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Official Corporate Dossier &bull; Reference {data.documentMeta.code}</span>
                </div>
                <h2 className="font-serif text-2xl text-ink font-normal">
                  Download Official Capability Statement (PDF)
                </h2>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  A high-resolution, vector-crisp multi-page publication formatted for executive boards, tender prequalification committees, and institutional investors.
                </p>
              </div>

              <Button
                onClick={handleDownloadPdf}
                variant="primary"
                size="md"
                className="shrink-0 min-h-[48px]"
                disabled={isPdfGenerating}
              >
                {isPdfGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                <span>Download Capability PDF</span>
              </Button>
            </div>

            {/* Document Cover / Header Section */}
            <div className="border border-border bg-canvas p-6 sm:p-10 space-y-8">
              <div className="border-b border-border pb-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-ink-muted">
                  <span>DOCUMENT REF: <strong>{data.documentMeta.code}</strong></span>
                  <span className="text-accent uppercase font-semibold">{data.documentMeta.status}</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight">
                  {data.documentMeta.title}
                </h1>
                <p className="text-xs sm:text-sm font-sans tracking-architectural uppercase text-accent font-semibold">
                  {data.documentMeta.subtitle}
                </p>
              </div>

              {/* 1. Executive Overview */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                  SECTION 01 // EXECUTIVE OVERVIEW
                </span>
                <p className="text-sm sm:text-base text-ink font-light leading-relaxed">
                  {data.overview.statement}
                </p>
                <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed">
                  {data.overview.mandate}
                </p>

                {/* 4 Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {data.overview.corePillars.map((pillar) => (
                    <div key={pillar.title} className="p-4 border border-border bg-canvas-surface/40 space-y-1.5">
                      <h4 className="text-xs font-mono uppercase font-bold text-accent">{pillar.title}</h4>
                      <p className="text-xs text-ink-muted leading-relaxed font-light">{pillar.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Company Background & 1993 Incorporation Note */}
              <div className="space-y-4 pt-6 border-t border-border">
                <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                  SECTION 02 // CORPORATE HERITAGE &amp; INDEPENDENCE
                </span>
                <div className="p-4 sm:p-5 border border-border bg-canvas-surface/60 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-ink">
                    <ShieldAlert className="w-4 h-4 text-accent shrink-0" />
                    <span>Reported 1993 Incorporation Status</span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed font-light">
                    {data.background.historyNote}
                  </p>
                  <p className="text-xs text-ink leading-relaxed font-light pt-1">
                    {data.background.governanceModel}
                  </p>
                </div>
              </div>

              {/* 3. Core Disciplines & Scope Matrices */}
              <div className="space-y-6 pt-6 border-t border-border">
                <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                  SECTION 03 // CORE CONSULTANCY DISCIPLINES
                </span>

                <div className="space-y-6">
                  {data.services.map((svc) => (
                    <div key={svc.code} className="border border-border p-5 sm:p-6 bg-canvas space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border pb-2">
                        <span className="font-serif text-xl sm:text-2xl text-ink font-normal">{svc.name}</span>
                        <span className="text-[10px] font-mono text-accent uppercase font-bold">{svc.code}</span>
                      </div>
                      <p className="text-xs font-sans tracking-architectural uppercase text-ink-muted font-medium">
                        {svc.focus}
                      </p>
                      <ul className="space-y-2 pt-2">
                        {svc.scopeItems.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs text-ink">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-light">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Professional Delivery Approach */}
              <div className="space-y-6 pt-6 border-t border-border">
                <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                  SECTION 04 // FOUR-PHASE DELIVERY FRAMEWORK
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.methodology.map((m) => (
                    <div key={m.phase} className="p-4 sm:p-5 border border-border bg-canvas-surface/50 space-y-2">
                      <span className="text-[10px] font-mono text-accent uppercase font-bold">{m.phase}</span>
                      <h4 className="font-serif text-lg text-ink font-medium">{m.title}</h4>
                      <p className="text-xs text-ink-muted leading-relaxed font-light">
                        <strong>Key Outputs:</strong> {m.deliverables}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Project Portfolio Benchmarks Notice */}
              <div className="space-y-4 pt-6 border-t border-border">
                <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                  SECTION 05 // PROJECT PORTFOLIO PROTOCOL
                </span>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  {data.portfolioNotice}
                </p>
                <div className="pt-1">
                  <Button
                    href="/projects"
                    variant="outline"
                    size="sm"
                    withArrow
                  >
                    Explore Portfolio Case Studies
                  </Button>
                </div>
              </div>

              {/* 6. Corporate Contact Coordinates & Disclaimer */}
              <div className="space-y-4 pt-6 border-t border-border">
                <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                  SECTION 06 // CORPORATE COMMUNICATIONS &amp; DISCLOSURE
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans p-4 bg-canvas-surface border border-border">
                  <div>
                    <span className="text-[10px] font-mono text-ink-muted uppercase block">Headquarters (Provisional):</span>
                    <span className="font-medium text-ink mt-0.5 block">{data.documentMeta.headquarters}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-ink-muted uppercase block">Liaison Office (Provisional):</span>
                    <span className="font-medium text-ink mt-0.5 block">{data.documentMeta.regionalLiaison}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-ink-muted uppercase block">Corporate Email:</span>
                    <span className="font-medium text-ink mt-0.5 block">{data.documentMeta.contactEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-ink-muted uppercase block">Switchboard Phone:</span>
                    <span className="font-medium text-ink mt-0.5 block">{data.documentMeta.contactPhone}</span>
                  </div>
                </div>

                <div className="p-4 border border-border bg-canvas-surface/30 text-[10px] font-mono text-ink-muted leading-relaxed">
                  {data.complianceDisclaimer}
                </div>
              </div>
            </div>

            {/* Bottom Download CTA */}
            <div className="p-6 border border-border bg-canvas flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-sans text-ink font-medium">
                Need this statement for an executive procurement package?
              </span>
              <Button
                onClick={handleDownloadPdf}
                variant="primary"
                size="md"
                withArrow
                disabled={isPdfGenerating}
              >
                Download Capability Statement (PDF)
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <ReusableCTA
        title="Ready to discuss an institutional engagement?"
        description="Our practice directors are available for confidential consultations, site feasibility appraisals, and commercial fee scheduling."
      />
    </AppLayout>
  );
};
