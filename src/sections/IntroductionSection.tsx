import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArchitecturalImage } from '@/components/ui/ArchitecturalImage';
import { COMPANY_DATA } from '@/data/company';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const IntroductionSection: React.FC = () => {
  return (
    <section id="about" className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas-surface">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Asymmetric Editorial Narrative (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-8 sm:space-y-10">
            <SectionHeading
              kicker="Introduction &bull; Practice Profile"
              title="Built on expertise. Driven by purpose."
              description="A multidisciplinary Nigerian consultancy delivering engineering consultancy, architectural consultancy, and quantity surveying with technical precision and fiduciary integrity."
            />

            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base text-ink-muted font-light leading-relaxed font-sans">
              <p>
                <strong className="text-ink font-semibold">{COMPANY_DATA.legalName}</strong> is an established consultancy practice delivering integrated technical counsel across the life cycle of physical developments. We believe that sustainable built environments require a synthesis of spatial logic, structural safety, and rigorous fiscal oversight.
              </p>
              <p>
                Rather than treating architectural design, structural engineering, and cost accounting as isolated tasks, our practice harmonizes these core disciplines. Every advisory engagement is grounded in statutory Nigerian building standards, geotechnical reality, and client commercial objectives.
              </p>
            </div>

            {/* Publicly Documented Expertise Breakdown */}
            <div className="pt-2 border-t border-border">
              <span className="text-[10px] font-sans font-semibold tracking-architectural uppercase text-accent block mb-3">
                Publicly Documented Focus Areas
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    title: 'Engineering Consultancy',
                    desc: 'Structural appraisal, civil systems, load verification, and site technical supervision.',
                  },
                  {
                    title: 'Architectural Consultancy',
                    desc: 'Programmatic spatial design, climatic envelope planning, and master planning.',
                  },
                  {
                    title: 'Quantity Surveying',
                    desc: 'Bills of quantities, commercial forecasting, procurement control, and cost audits.',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-5 border border-border bg-canvas flex flex-col justify-between space-y-2.5"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-accent">0{index + 1}</span>
                      <h4 className="font-serif text-base sm:text-lg text-ink font-normal">{item.title}</h4>
                      <p className="text-xs text-ink-muted leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2.5 text-xs text-ink-muted font-sans pt-1">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span className="text-[11px] sm:text-xs">Public business scope documented under statutory corporate registry standards.</span>
            </div>
          </div>

          {/* Right Column: Architectural Photography & Editorial Callout (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-5 lg:pt-4">
            <ArchitecturalImage
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85"
              alt="Concrete architectural facade texture and precision window mullion geometry"
              aspectRatio="4/5"
              figureNumber="FIG. 01"
              caption="Textured concrete facade and solar-responsive architectural geometry."
              priority={false}
            />

            {/* Editorial Institutional Note */}
            <div className="border border-border bg-canvas p-5 sm:p-7 space-y-3.5">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-[10px] font-sans font-semibold tracking-architectural uppercase text-ink">
                  Institutional Counsel
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-accent">NG / STATUTORY</span>
              </div>
              <p className="text-xs text-ink-muted font-light leading-relaxed">
                By maintaining a pure consultancy stance free from commercial construction bias, VOLIA NIG LTD delivers objective technical valuations and rigorous fiduciary supervision for public and private client entities.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 text-xs font-sans tracking-architectural uppercase text-accent hover:text-ink transition-colors duration-200 group pt-1 min-h-[38px]"
              >
                <span>Review Core Disciplines</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
