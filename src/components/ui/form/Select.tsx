import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  error?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, children, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          className={cn(
            'w-full bg-white border border-border px-3.5 py-2.5 text-sm text-ink font-sans appearance-none transition-all duration-150',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40',
            'disabled:bg-canvas-surface disabled:text-ink-muted disabled:cursor-not-allowed pr-10',
            error && 'border-status-danger focus:border-status-danger focus:ring-status-danger/30',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="absolute right-3.5 w-4 h-4 text-ink-muted pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
