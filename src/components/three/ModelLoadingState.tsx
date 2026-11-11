import React from 'react';
import { Loader2 } from 'lucide-react';

interface ModelLoadingStateProps {
  message?: string;
  subtext?: string;
}

/**
 * ModelLoadingState:
 * Architectural drafting loading placeholder rendered inside Suspense boundaries.
 */
export const ModelLoadingState: React.FC<ModelLoadingStateProps> = ({
  message = 'Initializing 3D Architectural Pavilion...',
  subtext = 'Compiling procedural geometry & materials',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 bg-canvas-surface/80 border border-border overflow-hidden select-none"
    >
      {/* Precision Drafting Background Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #25251F 1px, transparent 1px), linear-gradient(to bottom, #25251F 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Technical Corner Registration Marks */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-ink/40 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-ink/40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-ink/40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-ink/40 pointer-events-none" />

      {/* Central Content Box */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-3.5 max-w-sm">
        <div className="w-12 h-12 flex items-center justify-center border border-border bg-canvas text-accent shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold block">
            VOLIA 3D VISUALIZATION ENGINE
          </span>
          <p className="text-xs sm:text-sm font-serif text-ink font-normal leading-snug">
            {message}
          </p>
          <p className="text-[10px] font-mono text-ink-muted">
            {subtext}
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-36 h-0.5 bg-border overflow-hidden rounded-full">
          <div className="w-1/2 h-full bg-accent animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ModelLoadingState;
