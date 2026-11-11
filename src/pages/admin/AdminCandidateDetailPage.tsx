import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
  GraduationCap,
  Clock,
  ExternalLink,
  Calendar,
  FileText,
  Briefcase,
  Download,
  CheckCircle,
} from 'lucide-react';
import { candidateService, CandidateDossier } from '@/services/candidateService';
import { StatusBadge } from '@/components/ui/admin/StatusBadge';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';

export const AdminCandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dossier, setDossier] = useState<CandidateDossier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDossier = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await candidateService.getCandidateById(id);
        setDossier(data);
      } catch (err) {
        console.error('Failed to load candidate dossier', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDossier();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-6xl mx-auto">
        <LoadingSkeleton height={32} width="40%" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <LoadingSkeleton height={300} />
          </div>
          <div className="lg:col-span-8">
            <LoadingSkeleton height={300} />
          </div>
        </div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="p-8 text-center bg-white border border-border max-w-xl mx-auto">
        <h2 className="text-lg font-serif text-ink mb-2">Candidate Record Not Found</h2>
        <p className="text-xs text-ink-muted mb-4 font-sans">
          The requested candidate identifier could not be retrieved from the central talent registry.
        </p>
        <Link to="/admin/candidates" className="text-xs text-accent underline font-sans">
          &larr; Return to Candidate Directory
        </Link>
      </div>
    );
  }

  const { candidate, applications, interviews } = dossier;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header / Breadcrumb */}
      <div className="border-b border-admin-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/candidates"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink font-sans mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Candidate Directory</span>
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-light text-ink">{candidate.fullName}</h1>
            {candidate.professionalAccreditation && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-mono bg-accent/10 text-accent border border-accent/20">
                <Award className="w-3 h-3" />
                {candidate.professionalAccreditation}
              </span>
            )}
          </div>

          <p className="text-xs text-ink-muted font-sans mt-1">
            {candidate.currentTitle || 'Professional Candidate'} &bull;{' '}
            <span className="font-mono text-ink">{candidate.yearsOfExperience} Years Experience</span> &bull;{' '}
            <span>{candidate.currentLocation}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${candidate.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border bg-white text-ink hover:bg-canvas transition-colors font-sans"
          >
            <Mail className="w-3.5 h-3.5 text-accent" />
            <span>Email</span>
          </a>
          <a
            href={`tel:${candidate.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border bg-white text-ink hover:bg-canvas transition-colors font-sans"
          >
            <Phone className="w-3.5 h-3.5 text-accent" />
            <span>Call</span>
          </a>
          <Link
            to="/admin/interviews"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-ink text-white hover:bg-accent transition-colors font-sans uppercase tracking-wider"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Interview</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Column Dossier Info + Right Column Commission History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Candidate Credentials & Contact (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Identity & Contact Card */}
          <div className="bg-white border border-border p-5 space-y-4">
            <h3 className="text-xs font-serif font-semibold uppercase tracking-wider text-ink border-b border-border/80 pb-2">
              Candidate Dossier
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Email Address</span>
                <span className="font-medium text-ink font-mono">{candidate.email}</span>
              </div>

              <div>
                <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Direct Telephone</span>
                <span className="font-medium text-ink font-mono">{candidate.phone}</span>
              </div>

              <div>
                <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Current Residence</span>
                <span className="font-medium text-ink flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" />
                  {candidate.currentLocation}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Notice Period</span>
                <span className="font-medium text-ink flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-accent" />
                  {candidate.noticePeriodWeeks} {candidate.noticePeriodWeeks === 1 ? 'week' : 'weeks'}
                </span>
              </div>
            </div>

            {/* External Links */}
            {(candidate.linkedInUrl || candidate.portfolioUrl) && (
              <div className="pt-3 border-t border-border/60 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-architectural text-ink-muted block">
                  Professional Links
                </span>
                {candidate.linkedInUrl && (
                  <a
                    href={candidate.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs text-accent hover:text-ink font-sans"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {candidate.portfolioUrl && (
                  <a
                    href={candidate.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs text-accent hover:text-ink font-sans"
                  >
                    <span>Portfolio Archive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Academic & Accreditation Verification */}
          <div className="bg-white border border-border p-5 space-y-4">
            <h3 className="text-xs font-serif font-semibold uppercase tracking-wider text-ink border-b border-border/80 pb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-accent" />
              Credentials & Accreditation
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Highest Degree</span>
                <span className="font-medium text-ink leading-relaxed">
                  {candidate.highestDegree || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Statutory Registration</span>
                <span className="font-medium text-ink font-mono">
                  {candidate.professionalAccreditation || 'In Progress / Unverified'}
                </span>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-status-success font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Identity & NDPA Verification Passed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Applications, Documents & Interviews (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Applications Submitted Across Commission Cycles */}
          <div className="bg-white border border-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <h3 className="text-sm font-serif font-medium text-ink uppercase tracking-wider">
                  Commission Applications ({applications.length})
                </h3>
                <p className="text-xs text-ink-muted font-sans mt-0.5">
                  Record of all positions applied to by this candidate.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-canvas border border-border hover:border-accent/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="font-serif text-sm font-medium text-ink hover:text-accent"
                      >
                        {app.jobTitle}
                      </Link>
                      <StatusBadge status={app.stage} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-ink-muted font-sans">
                      <span className="text-accent uppercase font-mono font-medium">
                        {app.jobDepartment}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono text-[11px]">Ref: {app.id.toUpperCase()}</span>
                    </div>

                    {app.coverLetter && (
                      <p className="text-xs text-ink-muted italic line-clamp-2 mt-2 font-serif border-l-2 border-border pl-2">
                        &ldquo;{app.coverLetter}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      to={`/admin/applications/${app.id}`}
                      className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink bg-white border border-border hover:border-accent hover:text-accent transition-colors"
                    >
                      Review Dossier &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white border border-border p-6 space-y-4">
            <h3 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Verified Attachments & Curriculum Vitae
            </h3>

            <div className="space-y-3">
              {applications.map((app) => (
                <div key={`${app.id}-docs`} className="space-y-2">
                  <div className="p-3 bg-canvas border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-ink block font-mono">
                          {app.resume.name}
                        </span>
                        <span className="text-[11px] text-ink-muted font-mono">
                          {(app.resume.sizeBytes / 1024 / 1024).toFixed(2)} MB &bull; Uploaded{' '}
                          {new Date(app.resume.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <a
                      href={app.resume.downloadEndpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border bg-white text-ink hover:bg-canvas hover:text-accent transition-colors font-mono"
                    >
                      <Download className="w-3 h-3 text-accent" />
                      <span>Download</span>
                    </a>
                  </div>

                  {app.portfolioDocument && (
                    <div className="p-3 bg-canvas border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-accent shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-ink block font-mono">
                            {app.portfolioDocument.name}
                          </span>
                          <span className="text-[11px] text-ink-muted font-mono">
                            {(app.portfolioDocument.sizeBytes / 1024 / 1024).toFixed(2)} MB &bull; Portfolio
                          </span>
                        </div>
                      </div>

                      <a
                        href={app.portfolioDocument.downloadEndpoint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border bg-white text-ink hover:bg-canvas hover:text-accent transition-colors font-mono"
                      >
                        <Download className="w-3 h-3 text-accent" />
                        <span>Download</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Associated Interview History */}
          <div className="bg-white border border-border p-6 space-y-4">
            <h3 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Interview Evaluation Panels ({interviews.length})
            </h3>

            {interviews.length === 0 ? (
              <p className="text-xs text-ink-muted font-sans">
                No formal evaluation panels have been conducted yet for this candidate.
              </p>
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-canvas border border-border flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xs font-medium text-ink capitalize">
                          {item.interviewType.replace('_', ' ')}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <span className="text-[11px] text-ink-muted block font-mono mt-0.5">
                        {new Date(item.scheduledAt).toLocaleString()} &bull; Panel: {item.interviewerNames.join(', ')}
                      </span>
                      {item.feedbackSummary && (
                        <p className="text-xs text-ink-muted mt-1 italic font-serif">
                          &ldquo;{item.feedbackSummary}&rdquo;
                        </p>
                      )}
                    </div>

                    <Link
                      to="/admin/interviews"
                      className="text-xs font-semibold text-accent hover:text-ink font-sans uppercase tracking-wider shrink-0"
                    >
                      View Schedule &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCandidateDetailPage;
