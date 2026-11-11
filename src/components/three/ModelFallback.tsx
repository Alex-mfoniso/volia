import React from 'react';
import { Compass, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelFallbackProps {
  message?: string;
  isUnsupported?: boolean;
  isLoading?: boolean;
  onRetry?: () => void;
  className?: string;
}

/**
 * ModelFallback:
 * Accessible 2D architectural static fallback rendered when WebGL is disabled,
 * unsupported on the user's device, or when mobile performance requires a lightweight view.
 */
export const ModelFallback: React.FC<ModelFallbackProps> = ({
  message = 'WebGL acceleration is unavailable or disabled on this device.',
  isUnsupported = true,
  isLoading = false,
  onRetry,
  className,
}) => {
  return (
    <div
      role="region"
      aria-label="Architectural Model Static Presentation"
      className={cn(
        'relative w-full h-full min-h-[380px] flex flex-col justify-between p-6 sm:p-8 bg-canvas-surface/90 border border-border overflow-hidden select-none',
        className
      )}
    >
      {/* Background Architectural Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #25251F 1px, transparent 1px), linear-gradient(to bottom, #25251F 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Static Architectural Reference Photograph Behind Translucent Overlay */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-multiply">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Architectural structure reference"
          className="w-full h-full object-cover grayscale"
        />
      </div>

      {/* Technical Corner Registration Marks */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-ink/40 pointer-events-none z-10" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-ink/40 pointer-events-none z-10" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-ink/40 pointer-events-none z-10" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-ink/40 pointer-events-none z-10" />

      {/* Top Banner */}
      <div className="relative z-10 flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink font-semibold">
            STATIC ARCHITECTURAL SCHEMATIC &bull; 2D PROJECTION
          </span>
        </div>
        <span className="text-[9px] font-mono text-ink-muted bg-canvas/90 px-2 py-0.5 border border-border">
          FIG. ARCH-01
        </span>
      </div>

      {/* Central Content */}
      <div className="relative z-10 my-auto py-6 max-w-md mx-auto text-center space-y-3">
        <div className="w-10 h-10 mx-auto flex items-center justify-center border border-border bg-canvas text-accent shadow-sm">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          ) : isUnsupported ? (
            <AlertCircle className="w-5 h-5 text-accent" />
          ) : (
            <Compass className="w-5 h-5 text-accent" />
          )}
        </div>

        <div className="space-y-1.5">
          <h4 className="font-serif text-lg sm:text-xl text-ink font-normal">
            Contemporary Pavilion Archetype
          </h4>
          <p className="text-xs text-ink-muted font-light leading-relaxed">
            {message} All structural data, specifications, and spatial layers remain accessible via the technical breakdown below.
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-canvas hover:bg-canvas-surface border border-border text-[10px] font-mono uppercase text-ink transition-colors shadow-sm"
          >
            <RefreshCw className="w-3 h-3 text-accent" />
            <span>Re-initialize 3D Viewport</span>
          </button>
        )}
      </div>

      {/* Bottom Technical Spec Footer */}
      <div className="relative z-10 pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-ink-muted">
        <span>SPEC: REINFORCED CONCRETE // POST-TENSIONED CANTILEVER</span>
        <span>ACCESSIBLE 2D MODE &bull; LOW-POWER COMPLIANT</span>
      </div>
    </div>
  );
};

export default ModelFallback;
