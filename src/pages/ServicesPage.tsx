import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReusableCTA } from '@/components/layout/ReusableCTA';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import { SERVICES_DETAILED, type DetailedService } from '@/data/company';
import { CheckCircle2 } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  return (
    <AppLayout>
      <SEO
        title="Specialized Services &amp; Advisory Scope"
        description="Explore VOLIA NIG LTD's verified disciplines: Structural Engineering Consultancy, Architectural Spatial Strategy, and Quantity Surveying cost governance."
        canonicalPath="/services"
      />

      {/* 1. Reusable Page Header */}
      <PageHeader
        kicker="Specialized Disciplines"
        title="Integrated consultancy across the life cycle of capital works."
        description="Providing technical engineering validation, climate-adapted architectural strategy, and fiduciary quantity surveying for institutional and commercial developments across Nigeria."
        breadcrumb="PRACTICE // SERVICES"
      />

      {/* 2. Quick Navigation Bar */}
      <nav
        aria-label="Service stream navigation"
        className="sticky top-16 sm:top-20 z-30 bg-canvas/95 backdrop-blur-md border-b border-border py-3 sm:py-4 shadow-sm"
      >
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold">
              DISCIPLINE INDEX:
            </span>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 lg:gap-8">
              {SERVICES_DETAILED.map((service) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="text-xs font-sans tracking-architectural uppercase text-ink-muted hover:text-ink transition-colors focus-visible:outline-none min-h-[34px] flex items-center"
                >
                  <span className="font-mono text-accent mr-1.5">{service.number}</span>
                  <span>{service.title}</span>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </nav>

      {/* Compliance / Proposed Scope Disclosure Banner */}
      <div className="bg-canvas-surface/80 border-b border-border py-3.5">
        <Container size="wide">
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            <strong className="text-ink font-medium">Proposed Consultancy Scope:</strong> The service descriptions and typical scopes below represent proposed editable content based on the project brief, subject to client verification and corporate clearance.
          </p>
        </Container>
      </div>

      {/* 3. Detailed Service Sections */}
      <div className="divide-y divide-border bg-canvas">
        {SERVICES_DETAILED.map((service: DetailedService) => {
          return (
            <section
              key={service.id}
              id={service.id}
              className="py-14 sm:py-20 lg:py-28 scroll-mt-28"
            >
              <Container size="wide">
                <div className="space-y-12 sm:space-y-16">
                  {/* Top Service Title & Overview Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                    <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-accent font-semibold tracking-wider">
                          DISCIPLINE {service.number}
                        </span>
                        <span className="h-[1px] w-6 bg-accent/40" />
                        <span className="text-[10px] font-sans tracking-architectural uppercase text-ink-muted">
                          Publicly Indexed Scope
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-ink leading-tight">
                        {service.title}
                      </h2>
                      <p className="text-xs sm:text-sm font-sans tracking-architectural uppercase text-accent font-medium">
                        {service.subtitle}
                      </p>

                      <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed font-sans pt-1">
                        {service.detailedOverview}
                      </p>

                      {/* Methodology Principles */}
                      <div className="pt-3 border-t border-border space-y-2">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-ink block">
                          Advisory Methodology
                        </span>
                        {service.methodologyNotes.map((note, idx) => (
                          <div
                            key={idx}
                            className="flex items-start space-x-2 text-xs text-ink-muted font-light"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3">
                        <Button
                          href={`/contact?service=${encodeURIComponent(service.title)}`}
                          variant="primary"
                          size="md"
                          withArrow
                          className="w-full sm:w-auto min-h-[44px]"
                        >
                          Enquire About {service.title}
                        </Button>
                      </div>
                    </div>

                    {/* Relevant Architectural Photography Frame */}
                    <div className="lg:col-span-5 pt-2 lg:pt-0">
                      <div className="relative group overflow-hidden border border-border bg-canvas-surface aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]">
                        <img
                          src={service.imageUrl}
                          alt={service.imageAlt}
                          className="w-full h-full object-cover transition-transform duration-700 ease-architectural group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-canvas/90 backdrop-blur-sm px-2.5 py-1 border border-border text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-ink">
                          {service.figure}
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 bg-canvas-dark/90 text-white backdrop-blur-sm p-2.5 sm:p-3 text-[10px] sm:text-[11px] font-light">
                          {service.imageAlt}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typical Scope of Work Detailed Matrix */}
                  <div className="border border-border bg-canvas-surface p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border pb-3.5">
                      <span className="text-xs font-sans tracking-architectural uppercase text-ink font-semibold">
                        Typical Scope of Work &bull; Deliverables Matrix
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-ink-muted uppercase">
                        STRUCTURED ADVISORY PHASES
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                      {service.typicalScope.map((phaseGroup, idx) => (
                        <div key={idx} className="space-y-3 sm:space-y-4">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-[10px] font-mono text-accent">0{idx + 1}</span>
                            <h4 className="font-serif text-base sm:text-lg text-ink font-normal">
                              {phaseGroup.phase}
                            </h4>
                          </div>

                          <ul className="space-y-2 text-xs text-ink-muted font-light">
                            {phaseGroup.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start space-x-2 leading-relaxed">
                                <span className="text-accent mt-0.5">&bull;</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      {/* 4. Reusable Contact CTA */}
      <ReusableCTA
        title="Commission technical counsel for your development."
        description="Our partners are available for confidential consultations regarding structural engineering audits, architectural feasibility, or quantity surveying oversight."
      />
    </AppLayout>
  );
};
