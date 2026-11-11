import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  className,
  children,
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className="block text-xs uppercase tracking-wider font-semibold text-ink font-sans"
          >
            {label}
            {required && <span className="text-status-danger ml-1">*</span>}
          </label>
          {!required && (
            <span className="text-[11px] text-ink-muted uppercase tracking-wider">
              Optional
            </span>
          )}
        </div>
      )}

      {children}

      {hint && !error && (
        <p className="text-xs text-ink-muted leading-relaxed font-sans">{hint}</p>
      )}

      {error && (
        <p className="text-xs text-status-danger font-medium leading-relaxed font-sans">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
