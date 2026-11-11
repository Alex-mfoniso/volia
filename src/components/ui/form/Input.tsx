import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, type = 'text', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 text-ink-muted pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-white border border-border px-3.5 py-2.5 text-sm text-ink font-sans transition-all duration-150',
            'placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40',
            'disabled:bg-canvas-surface disabled:text-ink-muted disabled:cursor-not-allowed',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-status-danger focus:border-status-danger focus:ring-status-danger/30',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-ink-muted flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
