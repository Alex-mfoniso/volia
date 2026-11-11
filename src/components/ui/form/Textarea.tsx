import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full bg-white border border-border px-3.5 py-2.5 text-sm text-ink font-sans transition-all duration-150',
          'placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40',
          'disabled:bg-canvas-surface disabled:text-ink-muted disabled:cursor-not-allowed resize-y',
          error && 'border-status-danger focus:border-status-danger focus:ring-status-danger/30',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
