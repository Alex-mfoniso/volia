import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'border border-border p-8 sm:p-12 text-center bg-white flex flex-col items-center justify-center',
        className
      )}
    >
      <div className="w-12 h-12 bg-canvas-surface flex items-center justify-center text-ink-muted mb-4 border border-border/50">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-serif font-medium text-ink mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-ink-muted max-w-sm font-sans mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
