import React from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { COMPANY_DATA } from '@/data/company';
import { Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReusableCTAProps {
  title?: string;
  description?: string;
  invert?: boolean;
  className?: string;
}

export const ReusableCTA: React.FC<ReusableCTAProps> = ({
  title = "Let's discuss what you're planning.",
  description = 'Engage VOLIA NIG LTD for specialized advisory in engineering consultancy, architectural planning, and quantity surveying.',
  invert = false,
  className,
}) => {
  return (
    <section
      className={cn(
        'py-14 sm:py-20 lg:py-24 border-b border-border',
        invert ? 'bg-canvas-dark text-canvas' : 'bg-canvas-surface text-ink',
        className
      )}
    >
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            <span className="text-[10px] font-sans font-semibold tracking-architectural uppercase text-accent block">
              Institutional Dialogue &bull; Client Advisory
            </span>
            <h2
              className={cn(
                'font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15] max-w-2xl',
                invert ? 'text-canvas' : 'text-ink'
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                'text-xs sm:text-sm md:text-base font-light leading-relaxed font-sans max-w-xl pt-1',
                invert ? 'text-ink-light/80' : 'text-ink-muted'
              )}
            >
              {description}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col space-y-4 sm:space-y-5">
            <Button
              href="/contact"
              variant={invert ? 'inverted' : 'primary'}
              size="lg"
              withArrow
              className="w-full sm:w-auto text-xs min-h-[46px]"
            >
              Initiate Project Consultation
            </Button>

            <div className="pt-2 border-t border-border flex flex-col space-y-1.5 text-xs font-mono">
              <a
                href={`mailto:${COMPANY_DATA.contactPlaceholder.email}`}
                className={cn(
                  'flex items-center space-x-2 transition-colors min-h-[30px]',
                  invert
                    ? 'text-ink-light/70 hover:text-white'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">{COMPANY_DATA.contactPlaceholder.email}</span>
              </a>
              <span
                className={cn(
                  'flex items-center space-x-2 min-h-[30px]',
                  invert ? 'text-ink-light/60' : 'text-ink-muted/80'
                )}
              >
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{COMPANY_DATA.contactPlaceholder.phone}</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
