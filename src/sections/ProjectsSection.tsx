import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PROJECT_PORTFOLIO_REFERENCES } from '@/data/company';
import { Info, ArrowUpRight } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  // Preview first 3 representative archetypes on the homepage
  const previewProjects = PROJECT_PORTFOLIO_REFERENCES.slice(0, 3);

  return (
    <section id="projects" className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas">
      <Container size="wide">
        <div className="space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6 sm:pb-8">
            <SectionHeading
              kicker="Project Typology Preview"
              title="Built Environment Benchmarks"
              description="Visual references demonstrating the spatial scale, structural typologies, and execution rigor relevant to VOLIA NIG LTD's consultancy practice."
            />
            <div className="shrink-0 pt-2 sm:pt-0">
              <Link
                to="/projects"
                className="text-xs font-sans tracking-architectural uppercase text-accent hover:text-ink transition-colors pb-1 border-b border-accent inline-flex items-center space-x-1 min-h-[38px]"
              >
                <span>Explore All Reference Typologies</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Compliance & Provisional Disclosure Callout */}
          <div className="p-4 sm:p-5 border border-border bg-canvas-surface/70 flex items-start space-x-3 text-xs text-ink-muted">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-ink font-medium">Visual Reference Protocol:</strong> The imagery and structural archetypes displayed below serve as design and engineering typology references for prospective client evaluation. Official completed project case studies will be populated upon management sign-off and client confidentiality clearance.
            </p>
          </div>

          {/* Asymmetric Reference Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {previewProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col space-y-3.5 border border-border bg-canvas p-4 sm:p-5 hover:border-accent transition-colors duration-300"
              >
                {/* Visual Reference Frame */}
                <div className="relative aspect-[4/3] overflow-hidden bg-canvas-surface border border-border">
                  <img
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-architectural group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-canvas/95 backdrop-blur-sm px-2.5 py-1 border border-border text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-ink">
                    {project.figure}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-canvas-dark/90 text-white backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-sans tracking-architectural uppercase">
                    {project.category}
                  </div>
                </div>

                {/* Editorial Metadata */}
                <div className="space-y-2 pt-1 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-sans tracking-architectural uppercase text-accent font-semibold block">
                      {project.typology}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-normal text-ink mt-1 group-hover:text-accent transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-xs text-ink-muted font-light leading-relaxed mt-2">
                      {project.focus}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span className="truncate pr-2">{project.subtitle}</span>
                    <Link
                      to="/projects"
                      className="text-accent hover:underline flex items-center space-x-1 shrink-0 font-medium"
                    >
                      <span>3D Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
