import React from 'react';
import { cn } from '@/lib/utils';
import type { SectionHeaderProps } from '@/types';

export interface SectionHeadingComponentProps extends SectionHeaderProps {
  as?: 'h1' | 'h2' | 'h3';
  badge?: string;
}

export const SectionHeading: React.FC<SectionHeadingComponentProps> = ({
  kicker,
  title,
  description,
  align = 'left',
  className,
  invert = false,
  as: HeadingTag = 'h2',
  badge,
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <header className={cn('flex flex-col space-y-3 sm:space-y-3.5', alignClasses[align], className)}>
      {/* Editorial Kicker / Subtitle */}
      {(kicker || badge) && (
        <div className="flex items-center space-x-2.5">
          {kicker && (
            <span
              className={cn(
                'text-[10px] sm:text-[11px] font-sans font-semibold tracking-architectural uppercase',
                invert ? 'text-accent' : 'text-accent'
              )}
            >
              {kicker}
            </span>
          )}
          {badge && (
            <span
              className={cn(
                'text-[9px] sm:text-[10px] tracking-widest uppercase px-2 py-0.5 border',
                invert
                  ? 'border-border-dark text-ink-light/70'
                  : 'border-border text-ink-muted'
              )}
            >
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Primary Editorial Title */}
      <HeadingTag
        className={cn(
          'font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.15] tracking-tight',
          invert ? 'text-canvas' : 'text-ink'
        )}
      >
        {title}
      </HeadingTag>

      {/* Architectural Lead Description */}
      {description && (
        <p
          className={cn(
            'text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-light font-sans',
            invert ? 'text-ink-light/80' : 'text-ink-muted'
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
};
