import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ArchitecturalImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '3/2' | '1/1' | '3/4' | '4/5' | 'auto';
  caption?: string;
  figureNumber?: string;
  priority?: boolean;
  border?: boolean;
}

export const ArchitecturalImage: React.FC<ArchitecturalImageProps> = ({
  src,
  alt,
  aspectRatio = '4/3',
  caption,
  figureNumber,
  priority = false,
  border = true,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectMap = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '1/1': 'aspect-square',
    '3/4': 'aspect-[3/4]',
    '4/5': 'aspect-[4/5]',
    'auto': 'aspect-auto',
  };

  return (
    <figure className={cn('group flex flex-col space-y-2', className)} {...props}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-canvas-surface',
          aspectMap[aspectRatio],
          border && 'border border-border'
        )}
      >
        {/* Subtle loading placeholder shimmer */}
        {!isLoaded && (
          <div
            className="absolute inset-0 bg-canvas-surface animate-pulse"
            aria-hidden="true"
          />
        )}

        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-all duration-700 ease-architectural',
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]',
            'group-hover:scale-[1.03]'
          )}
        />

        {/* Minimal architectural corner registration marks */}
        <div
          className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/60 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/60 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Editorial Figure Caption */}
      {(caption || figureNumber) && (
        <figcaption className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[11px] font-sans text-ink-muted/80 tracking-editorial pt-0.5 gap-1">
          <span className="font-medium text-ink">
            {figureNumber && (
              <span className="text-accent uppercase tracking-architectural mr-2 font-mono text-[10px]">
                {figureNumber}
              </span>
            )}
            {caption}
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-muted/60 shrink-0">
            VOLIA ARCHIVE
          </span>
        </figcaption>
      )}
    </figure>
  );
};
