import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const config = {
    info: {
      bg: 'bg-status-info-bg',
      border: 'border-status-info-border',
      text: 'text-status-info',
      icon: Info,
    },
    success: {
      bg: 'bg-status-success-bg',
      border: 'border-status-success-border',
      text: 'text-status-success',
      icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-status-warning-bg',
      border: 'border-status-warning-border',
      text: 'text-status-warning',
      icon: AlertTriangle,
    },
    danger: {
      bg: 'bg-status-danger-bg',
      border: 'border-status-danger-border',
      text: 'text-status-danger',
      icon: AlertCircle,
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'border p-4 flex items-start gap-3 transition-colors',
        config.bg,
        config.border,
        className
      )}
      role="alert"
    >
      <IconComponent className={cn('w-4 h-4 shrink-0 mt-0.5', config.text)} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn('text-xs font-semibold uppercase tracking-wider mb-1 font-sans', config.text)}>
            {title}
          </h4>
        )}
        <div className="text-xs text-ink/90 font-sans leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-ink-muted hover:text-ink transition-colors p-1 -mr-1 -mt-1"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
