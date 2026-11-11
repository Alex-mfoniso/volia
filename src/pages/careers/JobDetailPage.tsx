import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Share2,
  Info,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import type { JobPosting } from '@/types/recruitment';
import { jobService } from '@/services/jobService';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';
import { JobCard } from '@/components/careers/JobCard';
import { SEO } from '@/components/common/SEO';

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const fetchJobData = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await jobService.getJobBySlug(slug);
        if (mounted) {
          setJob(data);
          if (data) {
            const related = await jobService.getRelatedJobs(data.id, data.department);
            if (mounted) setRelatedJobs(related);
          }
        }
      } catch (err) {
        console.error('Failed to load job specification', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchJobData();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <Container size="wide" className="py-20">
        <LoadingSkeleton height={36} width="50%" className="mb-4" />
        <LoadingSkeleton height={200} count={3} className="mb-4" />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container size="wide" className="py-24 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-canvas-surface flex items-center justify-center text-accent mx-auto border border-border">
            <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-serif font-light text-ink">
            Position Not Found
          </h2>
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            The requested vacancy specification may have been archived, closed, or the URL slug may have changed.
          </p>
          <div className="pt-2">
            <Link to="/careers">
              <Button variant="primary" size="sm">
                Return to Careers Portal
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // Check expiration & closed status
  const now = new Date().getTime();
  const closingTime = job.closingDate ? new Date(job.closingDate).getTime() : null;
  const isExpired = closingTime !== null && closingTime < now;
  const isClosed = job.status === 'closed' || isExpired;

  const formatEmploymentType = () => {
    const t = job.employmentType || job.type || 'full_time';
    return t.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatWorkArrangement = () => {
    const arr = job.workArrangement || 'on_site';
    return arr.replace('_', '-').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <SEO
        title={`${job.title} | Careers | VOLIA NIG LTD`}
        description={job.description || job.overview}
      />

      {/* Demonstration Fictional Notice Banner */}
      <div className="bg-canvas-surface border-b border-border py-2 px-4 text-center">
        <Container size="wide">
          <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-ink-muted">
            <Info className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>
              <strong>Fictional Demonstration Notice:</strong> This position is an illustrative recruitment archetype created for system demonstration purposes.
            </span>
          </div>
        </Container>
      </div>

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-canvas border-b border-border py-3">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-ink-muted font-sans">
            <Link to="/careers" className="hover:text-ink transition-colors">
              Careers
            </Link>
            <span>/</span>
            <span className="text-accent uppercase font-medium">{job.department}</span>
            <span>/</span>
            <span className="text-ink truncate max-w-sm">{job.title}</span>
          </nav>
        </Container>
      </div>

      {/* Main Job Detail Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-canvas">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Content Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Header Box */}
              <div className="space-y-4 border-b border-border pb-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="accent" size="sm">
                      {job.department}
                    </Badge>

                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-border bg-canvas-surface text-ink-muted">
                      {formatEmploymentType()}
                    </span>

                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-border bg-canvas-surface text-ink-muted">
                      {formatWorkArrangement()}
                    </span>

                    {isClosed ? (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-ink/10 text-ink-muted border border-border font-medium">
                        Applications Closed
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-status-success-bg text-status-success border border-status-success-border font-medium">
                        Open Vacancy
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-ink-muted font-mono uppercase">
                    Ref: {job.id.toUpperCase()}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-ink leading-tight">
                  {job.title}
                </h1>

                {/* Key Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60 text-xs font-sans">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-muted block">Location</span>
                    <span className="font-medium text-ink flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{job.location}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-muted block">Employment Type</span>
                    <span className="font-medium text-ink flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{formatEmploymentType()}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-muted block">Published</span>
                    <span className="font-mono text-ink flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>
                        {new Date(job.publicationDate || job.publishedAt || job.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-muted block">Application Deadline</span>
                    <span className="font-mono text-ink flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>
                        {job.closingDate
                          ? new Date(job.closingDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Open Until Filled'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Overview */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                  Mandate &amp; Role Context
                </span>
                <h2 className="text-xl font-serif font-normal text-ink">
                  Role Overview
                </h2>
                <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed">
                  {job.description || job.overview}
                </p>
              </div>

              {/* 2. Responsibilities */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                  Technical Deliverables
                </span>
                <h2 className="text-xl font-serif font-normal text-ink">
                  Role Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-ink leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Required Qualifications */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                  Statutory &amp; Academic Criteria
                </span>
                <h2 className="text-xl font-serif font-normal text-ink">
                  Required Qualifications
                </h2>
                <ul className="space-y-3">
                  {(job.qualifications && job.qualifications.length > 0 ? job.qualifications : job.requirements).map(
                    (qual, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-ink leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                        <span>{qual}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* 4. Required Experience */}
              {(job.experienceRequirements || job.requirements) && (
                <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                    Practice Background
                  </span>
                  <h2 className="text-xl font-serif font-normal text-ink">
                    Required Experience
                  </h2>
                  <ul className="space-y-3">
                    {(job.experienceRequirements && job.experienceRequirements.length > 0
                      ? job.experienceRequirements
                      : job.requirements
                    ).map((exp, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-ink leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-ink shrink-0 mt-2" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 5. Skills & Competencies */}
              {job.skills && job.skills.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                    Technical Toolkit
                  </span>
                  <h2 className="text-xl font-serif font-normal text-ink">
                    Skills &amp; Competencies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white border border-border text-xs font-mono text-ink"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Additional Information: Remuneration & Terms */}
              <div className="bg-canvas-surface border border-border p-6 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                  Engagement Policy &amp; Terms
                </span>
                <h3 className="text-base font-serif font-normal text-ink">
                  Remuneration &amp; Conditions
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  {job.salaryInformation || job.remunerationNote}
                </p>
                <div className="pt-2 text-[11px] font-sans text-ink-muted/80">
                  VOLIA NIG LTD complies with statutory Nigerian employment protocols, professional council practice rules (COREN/ARCON/NIQS), and pension requirements under the Pension Reform Act.
                </div>
              </div>
            </div>

            {/* Right Action Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-border p-6 sm:p-8 space-y-6 sticky top-24 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-mono font-semibold tracking-architectural text-accent block mb-1">
                    Application Action
                  </span>
                  <h3 className="text-xl font-serif font-normal text-ink">
                    Apply for this Position
                  </h3>
                  <p className="text-xs text-ink-muted mt-1 font-sans leading-relaxed">
                    Submit your credentials and CV for review by our recruitment panel.
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="pt-1">
                  {isClosed ? (
                    <div className="p-4 bg-canvas-surface border border-border text-center space-y-2">
                      <Lock className="w-5 h-5 text-ink-muted mx-auto" />
                      <span className="text-xs font-mono uppercase text-ink font-semibold block">
                        Applications Closed
                      </span>
                      <p className="text-[11px] text-ink-muted">
                        This position is no longer accepting submissions.
                      </p>
                    </div>
                  ) : (
                    <Link to={`/careers/${job.slug}/apply`} className="block w-full">
                      <Button variant="primary" size="md" className="w-full justify-center min-h-[46px]">
                        <span>Apply for this Position</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Summary Metadata */}
                <div className="border-t border-border pt-4 space-y-2.5 text-xs font-sans">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-ink-muted">Discipline:</span>
                    <span className="font-medium text-ink">{job.department}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-ink-muted">Location:</span>
                    <span className="font-medium text-ink">{job.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-ink-muted">Arrangement:</span>
                    <span className="font-medium text-ink">{formatWorkArrangement()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-ink-muted">Deadline:</span>
                    <span className="font-mono text-ink">
                      {job.closingDate
                        ? new Date(job.closingDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Open'}
                    </span>
                  </div>
                </div>

                {/* Share action */}
                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="text-xs text-ink-muted hover:text-ink transition-colors flex items-center gap-1.5 font-sans"
                  >
                    <Share2 className="w-3.5 h-3.5 text-accent" />
                    <span>{copied ? 'Link Copied!' : 'Share Position'}</span>
                  </button>

                  <span className="text-[10px] font-mono text-ink-muted uppercase">
                    Ref: {job.id.toUpperCase()}
                  </span>
                </div>

                {/* Confidentiality Notice */}
                <div className="p-3.5 bg-canvas-surface border border-border/80 text-[11px] text-ink-muted font-sans space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-ink">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Confidential Review Protocol</span>
                  </div>
                  <p className="leading-relaxed">
                    Submitted portfolios and candidate details are handled in strict compliance with the Nigeria Data Protection Act (NDPA 2023).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Vacancies Section */}
      {relatedJobs.length > 0 && (
        <section className="py-16 sm:py-20 border-t border-border bg-canvas-surface/40">
          <Container size="wide">
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block mb-1">
                    Related Practice Opportunities
                  </span>
                  <h3 className="font-serif text-2xl text-ink font-normal">
                    Other Open Vacancies in {job.department}
                  </h3>
                </div>
                <Link
                  to="/careers"
                  className="text-xs font-mono uppercase text-accent hover:underline flex items-center gap-1"
                >
                  <span>View All Vacancies</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedJobs.map((rJob) => (
                  <JobCard key={rJob.id} job={rJob} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
};

export default JobDetailPage;
