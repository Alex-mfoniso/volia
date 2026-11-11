import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricCardProps } from '@/types/ui';

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  icon: Icon,
  kicker,
  description,
}) => {
  return (
    <div className="bg-white border border-border p-5 relative overflow-hidden transition-all duration-150 hover:border-ink/40">
      <div className="flex items-start justify-between">
        <div>
          {kicker && (
            <span className="block text-[10px] font-sans font-semibold tracking-architectural text-accent uppercase mb-1">
              {kicker}
            </span>
          )}
          <span className="block text-xs font-sans uppercase tracking-wider text-ink-muted">
            {label}
          </span>
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded-none bg-canvas-surface flex items-center justify-center text-ink-muted border border-border/60">
            <Icon className="w-4 h-4 stroke-[1.5]" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-serif font-medium text-ink tabular-nums">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-medium font-sans',
              change.trend === 'up' && 'text-status-success',
              change.trend === 'down' && 'text-status-danger',
              change.trend === 'neutral' && 'text-ink-muted'
            )}
          >
            {change.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
            {change.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {change.trend === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
            {change.value}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs text-ink-muted font-sans leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
