import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { JobPosting } from '@/types/recruitment';

export interface JobCardProps {
  job: JobPosting;
  featured?: boolean;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ job, featured = false, className }) => {
  const isFeatured = featured || job.featured;

  // Status and expiration verification
  const now = new Date().getTime();
  const closingTime = job.closingDate ? new Date(job.closingDate).getTime() : null;
  const isExpired = closingTime !== null && closingTime < now;
  const isClosed = job.status === 'closed' || isExpired;
  const isClosingSoon = !isClosed && closingTime !== null && closingTime - now < 7 * 24 * 60 * 60 * 1000;

  // Format dates
  const formatPubDate = () => {
    const raw = job.publicationDate || job.publishedAt || job.createdAt;
    if (!raw) return 'Recent';
    try {
      return new Date(raw).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const formatClosingDate = () => {
    if (!job.closingDate) return 'Open Until Filled';
    try {
      return new Date(job.closingDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Scheduled';
    }
  };

  const formatEmploymentType = () => {
    const t = job.employmentType || job.type || 'full_time';
    return t.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatWorkArrangement = () => {
    const arr = job.workArrangement || 'on_site';
    return arr.replace('_', '-').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <article
      className={cn(
        'border transition-all duration-200 group relative flex flex-col justify-between p-6 sm:p-8 bg-white',
        isFeatured
          ? 'border-accent/70 bg-gradient-to-b from-white to-[#FAF8F5] shadow-sm'
          : 'border-border hover:border-ink',
        isClosed && 'opacity-70 bg-canvas-surface/60 border-dashed',
        className
      )}
    >
      {/* Top Metadata Row */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" size="sm">
              {job.department}
            </Badge>

            <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-border bg-canvas text-ink-muted">
              {formatEmploymentType()}
            </span>

            <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-border bg-canvas text-ink-muted">
              {formatWorkArrangement()}
            </span>

            {isFeatured && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase px-2 py-0.5 bg-accent/15 text-accent font-semibold border border-accent/40">
                <Sparkles className="w-3 h-3" />
                <span>Featured Mandate</span>
              </span>
            )}
          </div>

          {/* Status Label */}
          <div>
            {isClosed ? (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-ink/10 text-ink-muted border border-border font-medium">
                Applications Closed
              </span>
            ) : isClosingSoon ? (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 font-semibold animate-pulse">
                Closing Soon
              </span>
            ) : (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-status-success-bg text-status-success border border-status-success-border font-medium">
                Open Vacancy
              </span>
            )}
          </div>
        </div>

        {/* Job Title and Description */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal leading-snug group-hover:text-accent transition-colors">
              <Link to={`/careers/${job.slug}`}>{job.title}</Link>
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted mt-2 font-sans line-clamp-2 leading-relaxed">
            {job.description || job.overview}
          </p>
        </div>

        {/* Key Specification Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] font-sans border-t border-border/40">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-ink-muted block">Location</span>
            <span className="text-ink font-medium flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-accent shrink-0" />
              <span className="truncate">{job.location}</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-ink-muted block">Published</span>
            <span className="text-ink font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-accent shrink-0" />
              <span>{formatPubDate()}</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-ink-muted block">Closing Date</span>
            <span className={cn('font-mono flex items-center gap-1', isClosingSoon ? 'text-amber-800 font-semibold' : 'text-ink')}>
              <Clock className="w-3 h-3 text-accent shrink-0" />
              <span>{formatClosingDate()}</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-ink-muted block">Discipline</span>
            <span className="text-ink font-medium flex items-center gap-1 truncate">
              <Briefcase className="w-3 h-3 text-accent shrink-0" />
              <span className="truncate">{job.department}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer Strip & Action */}
      <div className="pt-6 mt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-[10px] font-mono text-ink-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>REF: {job.id.toUpperCase()}</span>
          <span>&bull;</span>
          <span className="text-accent/90">DEMO VACANCY ARCHETYPE</span>
        </div>

        <div className="flex items-center space-x-2">
          {isClosed ? (
            <span className="text-xs font-mono uppercase text-ink-muted/80 bg-canvas px-3 py-1.5 border border-border">
              Archived Listing
            </span>
          ) : (
            <Link
              to={`/careers/${job.slug}`}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-ink hover:bg-accent text-white text-xs font-sans tracking-wide uppercase transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default JobCard;
