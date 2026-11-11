import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isExternal?: boolean;
  withArrow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      href,
      isExternal = false,
      withArrow = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans tracking-architectural uppercase transition-all duration-300 ease-architectural focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none select-none text-center';

    const variantStyles = {
      primary:
        'bg-ink text-canvas hover:bg-ink/90 active:bg-ink/95 border border-ink shadow-sm',
      secondary:
        'bg-transparent text-ink border border-border hover:border-ink hover:bg-canvas-surface active:bg-canvas-surface/80',
      accent:
        'bg-accent text-white hover:bg-accent-hover active:bg-accent-hover/95 border border-accent',
      outline:
        'bg-transparent text-ink border border-ink/30 hover:border-ink hover:bg-ink/5',
      ghost:
        'bg-transparent text-ink hover:text-accent border border-transparent hover:bg-canvas-surface/60',
      inverted:
        'bg-canvas text-ink border border-canvas hover:bg-canvas-surface active:bg-white',
    };

    const sizeStyles = {
      sm: 'text-[11px] px-3.5 py-2 space-x-2 min-h-[38px]',
      md: 'text-xs px-5 py-2.5 sm:py-3 space-x-2.5 min-h-[44px]',
      lg: 'text-xs px-6 sm:px-7 py-3 sm:py-3.5 space-x-3 min-h-[48px]',
    };

    const content = (
      <>
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span className="font-medium tracking-architectural">{children}</span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        {withArrow && (
          <ArrowUpRight
            className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        )}
      </>
    );

    const combinedClasses = cn(
      'group relative',
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      const isInternal = href.startsWith('/') && !isExternal;

      if (isInternal) {
        return (
          <Link to={href} className={combinedClasses}>
            {content}
          </Link>
        );
      }

      return (
        <a
          href={href}
          className={combinedClasses}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <button ref={ref} className={combinedClasses} disabled={disabled} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
