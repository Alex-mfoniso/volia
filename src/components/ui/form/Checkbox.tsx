import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, checked, ...props }, ref) => {
    const generatedId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            type="checkbox"
            id={generatedId}
            ref={ref}
            checked={checked}
            className={cn(
              'peer w-4 h-4 border border-border appearance-none bg-white cursor-pointer transition-colors',
              'checked:bg-ink checked:border-ink focus:outline-none focus:ring-1 focus:ring-accent/40',
              error && 'border-status-danger'
            )}
            {...props}
          />
          <Check className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {(label || description) && (
          <label htmlFor={generatedId} className="cursor-pointer select-none">
            {label && (
              <span className="block text-xs font-medium text-ink leading-relaxed font-sans">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-xs text-ink-muted leading-relaxed font-sans mt-0.5">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
