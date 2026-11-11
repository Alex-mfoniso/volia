import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SERVICES_DETAILED } from '@/data/company';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas">
      <Container size="wide">
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {/* Section Header with Editorial Framing */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6 sm:pb-8">
            <SectionHeading
              kicker="Specialized Disciplines"
              title="Practice & Services"
              description="Integrated advisory spanning conceptual form, structural integrity, and commercial governance."
            />
            <div className="shrink-0 pt-2 sm:pt-0">
              <Link
                to="/services"
                className="text-xs font-sans tracking-architectural uppercase text-accent hover:text-ink transition-colors pb-1 border-b border-accent inline-flex items-center space-x-1 min-h-[38px]"
              >
                <span>View Full Scope &amp; Methodology</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Alternating Asymmetric Editorial Service Presentations */}
          <div className="space-y-16 sm:space-y-24 lg:space-y-28">
            {SERVICES_DETAILED.map((service, index: number) => {
              const isEven = index % 2 === 1;

              return (
                <article
                  key={service.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                >
                  {/* Text & Scope Column */}
                  <div
                    className={cn(
                      'lg:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-6',
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm sm:text-base text-accent font-semibold tracking-wider">
                        {service.number}
                      </span>
                      <span className="h-[1px] w-6 sm:w-8 bg-accent/40" />
                      <span className="text-[10px] font-sans tracking-architectural uppercase text-ink-muted">
                        Consultancy Stream
                      </span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-ink leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-sans tracking-architectural uppercase text-accent font-medium">
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed font-sans max-w-xl">
                      {service.summary}
                    </p>

                    {/* Scope Deliverables List */}
                    <div className="pt-2 border-t border-border/80">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-ink-muted/80 block mb-2.5">
                        Key Advisory Scope
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {service.typicalScope[0].items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-2 text-xs text-ink/80 font-light leading-relaxed"
                          >
                            <span className="text-accent mt-0.5">&bull;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exploration Link */}
                    <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                      <Link
                        to={`/services#${service.id}`}
                        className="inline-flex items-center space-x-2 text-xs font-sans tracking-architectural uppercase text-ink hover:text-accent font-medium transition-colors duration-200 group border-b border-border hover:border-accent pb-1 min-h-[38px]"
                      >
                        <span>Detailed Deliverables</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>

                      <Link
                        to={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="text-xs font-sans tracking-architectural uppercase text-accent hover:text-ink transition-colors pb-1 min-h-[38px] flex items-center"
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>

                  {/* Photography Presentation Column */}
                  <div
                    className={cn(
                      'lg:col-span-6',
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    )}
                  >
                    <div className="relative group overflow-hidden border border-border bg-canvas-surface aspect-[4/3] sm:aspect-[16/10]">
                      <img
                        src={service.imageUrl}
                        alt={service.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-700 ease-architectural group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Hairline Frame Details */}
                      <div className="absolute inset-0 border border-white/20 pointer-events-none" />
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-canvas/90 backdrop-blur-sm px-2.5 py-1 border border-border text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-ink">
                        {service.figure} // {service.title.toUpperCase()}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-sans text-ink-muted">
                      <span className="truncate pr-2">{service.imageAlt}</span>
                      <span className="font-mono text-[9px] sm:text-[10px] uppercase text-ink-muted/70 shrink-0">
                        VOLIA ARCHIVE
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
