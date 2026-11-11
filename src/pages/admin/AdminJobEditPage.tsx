import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, CheckCircle2 } from 'lucide-react';
import { JobDepartment, EmploymentType, ExperienceLevel, JobStatus, JobPosting } from '@/types';
import { jobService } from '@/services/jobService';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/form/FormField';
import { Input } from '@/components/ui/form/Input';
import { Textarea } from '@/components/ui/form/Textarea';
import { Select } from '@/components/ui/form/Select';
import { Alert } from '@/components/ui/feedback/Alert';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';

export const AdminJobEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [initialJob, setInitialJob] = useState<JobPosting | null>(null);

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<JobDepartment>('Engineering');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<EmploymentType>('full_time');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('senior');
  const [openingsCount, setOpeningsCount] = useState<number>(1);
  const [overview, setOverview] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [desirableText, setDesirableText] = useState('');
  const [remunerationNote, setRemunerationNote] = useState('');
  const [status, setStatus] = useState<JobStatus>('published');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const job = await jobService.getJobById(id);
        if (job) {
          setInitialJob(job);
          setTitle(job.title);
          setDepartment(job.department);
          setLocation(job.location);
          setType(job.type || job.employmentType || 'full_time');
          setExperienceLevel(job.experienceLevel);
          setOpeningsCount(job.openingsCount);
          setOverview(job.overview || job.description || '');
          setResponsibilitiesText(job.responsibilities?.join('\n') || '');
          setRequirementsText(job.requirements?.join('\n') || '');
          setDesirableText(job.desirableQualifications?.join('\n') || '');
          setRemunerationNote(job.remunerationNote || '');
          setStatus(job.status);
        }
      } catch (err) {
        console.error('Failed to load job for editing', err);
        setErrorMessage('Failed to load position data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleSubmit = async (targetStatus?: JobStatus) => {
    if (!id) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage('Position title is required.');
      return;
    }
    if (!overview.trim()) {
      setErrorMessage('Role overview and mandate description is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const responsibilities = responsibilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const requirements = requirementsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const desirableQualifications = desirableText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const finalStatus = targetStatus || status;

      await jobService.updateJob(id, {
        title,
        department,
        location,
        type,
        employmentType: type,
        experienceLevel,
        openingsCount,
        overview,
        description: overview,
        responsibilities,
        requirements,
        desirableQualifications,
        remunerationNote,
        status: finalStatus,
        publishedAt: finalStatus === 'published' ? (initialJob?.publishedAt || new Date().toISOString()) : undefined,
      });

      setStatus(finalStatus);
      setSuccessMessage('Position specification successfully updated.');

      setTimeout(() => {
        navigate(`/admin/jobs/${id}`);
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update job posting.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <LoadingSkeleton height={32} width="40%" />
        <LoadingSkeleton height={200} count={3} />
      </div>
    );
  }

  if (!initialJob) {
    return (
      <div className="p-8 text-center bg-white border border-border max-w-xl mx-auto">
        <h2 className="text-lg font-serif text-ink mb-2">Position Not Found</h2>
        <Link to="/admin/jobs" className="text-xs text-accent underline font-sans">
          &larr; Return to Position Specifications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Nav */}
      <div className="border-b border-admin-border pb-4 flex items-center justify-between">
        <div>
          <Link
            to={`/admin/jobs/${id}`}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink font-sans mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Position Detail</span>
          </Link>
          <h1 className="text-2xl font-serif font-light text-ink">
            Edit Recruitment Specification
          </h1>
          <p className="text-xs text-ink-muted font-sans mt-0.5">
            Ref: {initialJob.id.toUpperCase()} &bull; Current status: <span className="font-mono uppercase text-ink">{status}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/jobs/${id}`}
            className="px-3 py-2 text-xs border border-border bg-white text-ink hover:bg-canvas transition-colors font-sans"
          >
            Cancel
          </Link>

          {status === 'published' ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('closed')}
              className="px-3 py-2 text-xs border border-status-warning-border bg-status-warning-bg text-status-warning hover:bg-status-warning hover:text-white transition-colors font-sans uppercase tracking-wider"
            >
              Unpublish & Close
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('published')}
              className="px-3 py-2 text-xs border border-status-success-border bg-status-success-bg text-status-success hover:bg-status-success hover:text-white transition-colors font-sans uppercase tracking-wider"
            >
              Publish Live
            </button>
          )}

          <Button
            type="button"
            variant="primary"
            disabled={isSubmitting}
            onClick={() => handleSubmit()}
            className="flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Alert type="danger" title="Validation Failed">
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert type="success" title="Changes Saved">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>{successMessage} Redirecting...</span>
          </div>
        </Alert>
      )}

      {/* Specification Form Surface */}
      <div className="bg-white border border-border p-8 space-y-8 font-sans">
        {/* Section 1: Core Parameters */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
            1. Role Title & Classification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField label="Position Title" required>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Principal Structural Engineer (Tall Buildings)"
                />
              </FormField>
            </div>

            <FormField label="Discipline / Department" required>
              <Select
                value={department}
                onChange={(e) => setDepartment(e.target.value as JobDepartment)}
                options={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Architecture', label: 'Architecture' },
                  { value: 'Quantity Surveying', label: 'Quantity Surveying' },
                  { value: 'Project Management', label: 'Project Management' },
                  { value: 'Executive & Operations', label: 'Executive & Operations' },
                ]}
              />
            </FormField>

            <FormField label="Practice Location" required>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Abuja, FCT (Central Business District)"
              />
            </FormField>

            <FormField label="Contract Basis" required>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as EmploymentType)}
                options={[
                  { value: 'full_time', label: 'Full Time' },
                  { value: 'contract', label: 'Fixed Commission / Contract' },
                  { value: 'consultancy', label: 'Retainer Consultancy' },
                  { value: 'hybrid', label: 'Hybrid Commission' },
                ]}
              />
            </FormField>

            <FormField label="Experience Seniority" required>
              <Select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                options={[
                  { value: 'entry', label: 'Entry Level (0-2 Years)' },
                  { value: 'intermediate', label: 'Intermediate (3-5 Years)' },
                  { value: 'senior', label: 'Senior (6-9 Years)' },
                  { value: 'lead', label: 'Lead Specialist (10+ Years)' },
                  { value: 'principal', label: 'Principal / Partner Track' },
                ]}
              />
            </FormField>

            <FormField label="Approved Headcount Openings" required>
              <Input
                type="number"
                min={1}
                max={20}
                value={openingsCount}
                onChange={(e) => setOpeningsCount(parseInt(e.target.value, 10) || 1)}
              />
            </FormField>
          </div>
        </div>

        {/* Section 2: Role Mandate & Overview */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
            2. Commission Mandate & Role Overview
          </h2>

          <FormField
            label="Practice Overview"
            required
            hint="Clear executive statement outlining the technical mandate, responsibilities, and standards required for this position."
          >
            <Textarea
              rows={4}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="e.g. Lead structural design calculations, seismic and wind load simulation, and Eurocode compliance for major institutional commissions."
            />
          </FormField>
        </div>

        {/* Section 3: Detailed Bullet Points */}
        <div className="space-y-6">
          <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
            3. Detailed Responsibilities & Requirements
          </h2>

          <FormField
            label="Key Responsibilities (One requirement per line)"
            hint="Enter each technical duty or project mandate on a separate line."
          >
            <Textarea
              rows={5}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              placeholder="Conduct finite element modeling in ETABS / STAAD.Pro&#10;Lead coordination workshops with MEP and architectural consultants&#10;Inspect site reinforcement concrete pours and certify compliance"
            />
          </FormField>

          <FormField
            label="Mandatory Accreditations & Requirements (One per line)"
            hint="Include statutory licensing (e.g. COREN, ARCON, NIQS), degrees, and core qualifications."
          >
            <Textarea
              rows={5}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder="B.Eng. in Structural or Civil Engineering&#10;Active COREN registration and seal&#10;Minimum 8 years structural consultancy experience"
            />
          </FormField>

          <FormField
            label="Desirable Specializations (Optional, one per line)"
            hint="Non-mandatory competencies or advanced credentials."
          >
            <Textarea
              rows={3}
              value={desirableText}
              onChange={(e) => setDesirableText(e.target.value)}
              placeholder="Experience with post-tensioned slab analysis&#10;Mastery of Tekla Structural Designer"
            />
          </FormField>
        </div>

        {/* Section 4: Remuneration & Terms */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-medium text-ink uppercase tracking-wider border-b border-border/80 pb-2">
            4. Remuneration Note & Executive Terms
          </h2>

          <FormField
            label="Remuneration Guideline"
            hint="Public guideline communicated to candidates during application."
          >
            <Input
              value={remunerationNote}
              onChange={(e) => setRemunerationNote(e.target.value)}
              placeholder="e.g. Competitive executive consultancy package commensurate with professional accreditation."
            />
          </FormField>
        </div>

        {/* Form Footer Action */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <a
            href={`/careers/${initialJob.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink font-sans"
          >
            <Eye className="w-3.5 h-3.5 text-accent" />
            <span>Preview Public View</span>
          </a>

          <div className="flex items-center gap-3">
            <Link
              to={`/admin/jobs/${id}`}
              className="px-4 py-2 text-xs border border-border bg-white text-ink hover:bg-canvas transition-colors font-sans"
            >
              Cancel
            </Link>

            <Button
              type="button"
              variant="primary"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              className="flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobEditPage;
