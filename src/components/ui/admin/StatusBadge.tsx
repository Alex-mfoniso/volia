import React from 'react';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { ApplicationStage, JobStatus, InterviewStatus } from '@/types';

export interface StatusBadgeProps {
  status: ApplicationStage | JobStatus | InterviewStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className }) => {
  const getBadgeConfig = (): { label: string; variant: BadgeVariant } => {
    switch (status) {
      // Job Statuses
      case 'published':
        return { label: 'Published', variant: 'success' };
      case 'draft':
        return { label: 'Draft', variant: 'neutral' };
      case 'closed':
        return { label: 'Closed', variant: 'warning' };
      case 'archived':
        return { label: 'Archived', variant: 'outline' };

      // Application Stages
      case 'applied':
        return { label: 'Applied', variant: 'neutral' };
      case 'screening':
        return { label: 'Screening', variant: 'info' };
      case 'shortlisted':
        return { label: 'Shortlisted', variant: 'accent' };
      case 'interview':
        return { label: 'Interviewing', variant: 'warning' };
      case 'assessment':
        return { label: 'Assessment', variant: 'info' };
      case 'offer':
        return { label: 'Offer Extended', variant: 'accent' };
      case 'hired':
        return { label: 'Hired', variant: 'success' };
      case 'rejected':
        return { label: 'Not Retained', variant: 'danger' };

      // Interview Statuses
      case 'scheduled':
        return { label: 'Scheduled', variant: 'info' };
      case 'completed':
        return { label: 'Completed', variant: 'success' };
      case 'cancelled':
        return { label: 'Cancelled', variant: 'danger' };

      default:
        return { label: String(status), variant: 'neutral' };
    }
  };

  const { label, variant } = getBadgeConfig();

  return (
    <Badge variant={variant} size={size} dot className={className}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
