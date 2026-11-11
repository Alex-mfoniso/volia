import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export const ClosingCTASection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-canvas-dark text-canvas border-b border-border-dark relative overflow-hidden">
      <Container size="wide">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 border border-border-dark bg-[#2C2C25] text-[10px] font-mono uppercase tracking-architectural text-accent font-semibold">
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>Consultancy Intake &bull; Built Environment</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.08]">
            Have a project in mind?
          </h2>

          <p className="font-sans text-base sm:text-lg lg:text-xl text-ink-light/80 font-light leading-relaxed max-w-2xl mx-auto">
            Start a conversation with our team.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button
                variant="primary"
                size="md"
                className="min-h-[48px] px-8 bg-accent hover:bg-accent-hover text-white border-transparent"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link to="/services">
              <Button
                variant="outline"
                size="md"
                className="min-h-[48px] px-6 text-white border-border-dark hover:bg-white/5"
              >
                Explore Scope &amp; Disciplines
              </Button>
            </Link>
          </div>

          {/* Institutional note */}
          <div className="pt-8 border-t border-border-dark/60 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-light/60 font-sans">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Independent Advisory</span>
            </span>
            <span>&bull;</span>
            <span>Engineering Consultancy</span>
            <span>&bull;</span>
            <span>Architectural Planning</span>
            <span>&bull;</span>
            <span>Quantity Surveying</span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ClosingCTASection;
