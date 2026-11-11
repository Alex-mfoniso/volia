import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Search, Compass, PenTool, CheckCircle } from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    name: 'Understand',
    icon: Search,
    summary:
      'Rigorous scoping of project requirements, geotechnical site conditions, and statutory planning frameworks.',
    details:
      'Every engagement begins with systematic appraisal. We examine physical constraints, regulatory parameters under Nigerian building codes, and stakeholder objectives before conceptual lines are drawn.',
  },
  {
    step: '02',
    name: 'Plan',
    icon: Compass,
    summary:
      'Synchronizing structural logic, architectural massing, and commercial cost planning into a unified strategy.',
    details:
      'Multidisciplinary coordination prevents downstream clashes. Architectural intent is reconciled with structural feasibility and elemental budget models to establish an achievable roadmap.',
  },
  {
    step: '03',
    name: 'Develop',
    icon: PenTool,
    summary:
      'Detailed finite element engineering calculations, technical specifications, and comprehensive Bills of Quantities.',
    details:
      'Precision documentation transforms strategy into buildable reality. Rigorous peer reviews ensure structural safety factors, material specifications, and tender documents withstand rigorous audit.',
  },
  {
    step: '04',
    name: 'Deliver',
    icon: CheckCircle,
    summary:
      'Vigilant construction stage quality governance, statutory compliance verification, and successful commissioning.',
    details:
      'Structured technical supervision bridges drawings and physical construction. We verify material quality, inspect critical structural placement, and safeguard client investment to project completion.',
  },
];

export const PhilosophySection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-canvas-dark text-canvas border-b border-border-dark relative overflow-hidden">
      <Container size="wide">
        <div className="space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end border-b border-border-dark/60 pb-8 sm:pb-10">
            <div className="lg:col-span-8">
              <SectionHeading
                invert
                kicker="Approach &amp; Philosophy"
                title="Thoughtful planning. Precise execution."
                description="The value of structured thinking, multidisciplinary coordination, and meticulous attention to detail across the built-environment life cycle."
              />
            </div>
            <div className="lg:col-span-4 lg:text-right pt-2 lg:pt-0">
              <span className="text-[10px] font-mono tracking-widest uppercase text-accent border border-border-dark px-3 py-1.5 bg-[#2C2C25] inline-block">
                Structured Advisory Process &bull; 4 Steps
              </span>
            </div>
          </div>

          {/* 4 Process Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border-dark">
            {PROCESS_STEPS.map((step) => {
              const IconComponent = step.icon;

              return (
                <div
                  key={step.step}
                  className="p-6 sm:p-8 lg:p-10 border-b sm:border-r border-border-dark bg-[#282822] hover:bg-[#2F2F27] transition-colors duration-300 flex flex-col justify-between group space-y-6 sm:space-y-8"
                >
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-accent tracking-widest uppercase font-semibold">
                        {step.step}
                      </span>
                      <IconComponent className="w-5 h-5 text-accent stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white group-hover:text-accent transition-colors duration-300">
                      {step.name}
                    </h3>
                    <p className="text-xs text-accent/90 font-sans uppercase tracking-wider font-medium">
                      {step.summary}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-light/75 leading-relaxed font-light font-sans">
                    {step.details}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Editorial Compliance & Disclaimer Notice */}
          <div className="p-4 sm:p-5 border border-border-dark bg-[#24241E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink-light/60 font-sans">
            <div className="flex items-start sm:items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1 sm:mt-0 shrink-0" />
              <p className="font-light leading-relaxed">
                <strong className="font-medium text-ink-light/80 mr-1.5">Proposed Framework Notice:</strong>
                The delivery framework presented above illustrates VOLIA NIG LTD&apos;s proposed structured methodology and coordination philosophy, subject to management review.
              </p>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-accent shrink-0 pt-1 sm:pt-0">
              PHILOSOPHY // PROCESS
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PhilosophySection;
