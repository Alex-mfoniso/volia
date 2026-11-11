import React from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  kicker: string;
  title: string;
  description: string;
  breadcrumb?: string;
  invert?: boolean;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  kicker,
  title,
  description,
  breadcrumb,
  invert = false,
  className,
}) => {
  return (
    <section
      className={cn(
        'relative pt-24 sm:pt-32 lg:pt-38 pb-12 sm:pb-16 lg:pb-20 border-b border-border',
        invert ? 'bg-canvas-dark text-canvas' : 'bg-canvas text-ink',
        className
      )}
    >
      <Container size="wide">
        <div className="flex flex-col space-y-5 sm:space-y-6 max-w-4xl">
          {/* Metadata & Breadcrumb Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border/80 pb-3 sm:pb-4">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 bg-accent inline-block shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-sans tracking-architectural uppercase text-accent font-semibold">
                {kicker}
              </span>
            </div>
            {breadcrumb && (
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-ink-muted">
                {breadcrumb}
              </span>
            )}
          </div>

          {/* Editorial Title */}
          <h1
            className={cn(
              'font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.12]',
              invert ? 'text-canvas' : 'text-ink'
            )}
          >
            {title}
          </h1>

          {/* Descriptive Narrative */}
          <p
            className={cn(
              'text-sm sm:text-base lg:text-lg font-light leading-relaxed font-sans max-w-3xl pt-1',
              invert ? 'text-ink-light/80' : 'text-ink-muted'
            )}
          >
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
};
