import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import type { JobPosting } from '@/types/recruitment';
import { jobService } from '@/services/jobService';
import { jobApplicationService } from '@/services/jobApplicationService';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/form/FormField';
import { Input } from '@/components/ui/form/Input';
import { Textarea } from '@/components/ui/form/Textarea';
import { Select } from '@/components/ui/form/Select';
import { Checkbox } from '@/components/ui/form/Checkbox';
import { FileUpload } from '@/components/ui/form/FileUpload';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';
import { SEO } from '@/components/common/SEO';

export const JobApplyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields: 1. Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Form Fields: 2. Professional Information
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(5);
  const [highestQualification, setHighestQualification] = useState('B.Sc. / B.Eng.');
  const [professionalAccreditation, setProfessionalAccreditation] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Form Fields: 3. Supporting Documents
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [additionalFile, setAdditionalFile] = useState<File | null>(null);

  // Form Fields: 4. Additional Questions & Notice
  const [noticePeriodWeeks, setNoticePeriodWeeks] = useState<number>(4);
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  // Form Fields: 5. Declaration & Consent
  const [consentDataProcessing, setConsentDataProcessing] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    const fetchJob = async () => {
      if (!slug) return;
      setIsLoadingJob(true);
      try {
        const data = await jobService.getJobBySlug(slug);
        if (mounted) setJob(data);
      } catch (err) {
        console.error('Failed to load job', err);
      } finally {
        if (mounted) setIsLoadingJob(false);
      }
    };
    fetchJob();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please provide a valid corporate or professional email address.';
    }

    if (!phone.trim()) newErrors.phone = 'Contact phone number is required.';
    if (!location.trim()) newErrors.location = 'Current location (city / state) is required.';

    if (!currentJobTitle.trim()) {
      newErrors.currentJobTitle = 'Current professional title or practice role is required.';
    }

    if (isNaN(yearsOfExperience) || yearsOfExperience < 0) {
      newErrors.yearsOfExperience = 'Please enter a valid non-negative number of years.';
    }

    if (!resumeFile) {
      newErrors.resumeFile = 'Curriculum vitae (CV / Resume) is mandatory (PDF or DOCX, max 5MB).';
    }

    if (linkedInUrl.trim() && !/^https?:\/\//i.test(linkedInUrl.trim())) {
      newErrors.linkedInUrl = 'LinkedIn URL must start with http:// or https://';
    }

    if (portfolioUrl.trim() && !/^https?:\/\//i.test(portfolioUrl.trim())) {
      newErrors.portfolioUrl = 'Portfolio URL must start with http:// or https://';
    }

    // Custom required questions validation
    if (job?.customQuestions) {
      job.customQuestions.forEach((q) => {
        if (q.required && (!customAnswers[q.id] || !customAnswers[q.id].trim())) {
          newErrors[`custom_${q.id}`] = 'This question requires an answer.';
        }
      });
    }

    if (!consentDataProcessing) {
      newErrors.consentDataProcessing =
        'You must acknowledge and consent to the confidential data processing terms.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomAnswerChange = (questionId: string, val: string) => {
    setCustomAnswers((prev) => ({ ...prev, [questionId]: val }));
    if (errors[`custom_${questionId}`]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[`custom_${questionId}`];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !job) {
      // Scroll to the first error
      window.scrollTo({ top: 320, behavior: 'smooth' });
      return;
    }

    if (!resumeFile) {
      setErrors((prev) => ({ ...prev, resume: 'Curriculum Vitae file is required.' }));
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.submission;
      return updated;
    });

    try {
      const result = await jobApplicationService.submitApplication({
        jobId: job.id,
        fullName: `${firstName} ${lastName}`.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        location: location.trim() || 'Nigeria',
        currentJobTitle: currentJobTitle.trim() || 'Consulting Specialist',
        yearsOfExperience,
        highestDegree: highestQualification,
        professionalAccreditation: professionalAccreditation.trim() || undefined,
        linkedInUrl: linkedInUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        resumeFile: resumeFile,
        portfolioFile: additionalFile || undefined,
        coverLetter: coverLetterText.trim() || undefined,
        noticePeriodWeeks,
        consentDataProcessing: true,
      });

      // Navigate directly to confirmation with server verification
      navigate('/application/confirmation', {
        state: {
          candidateName: `${firstName} ${lastName}`.trim(),
          jobTitle: job.title,
          jobDepartment: job.department,
          confirmationCode: result.confirmationCode || result.applicationId,
          email: email.trim(),
          submissionDate: new Date().toISOString(),
          isDevelopmentPreview: false,
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Application submission failed. Please try again.';
      setErrors((prev) => ({ ...prev, submission: message }));
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob) {
    return (
      <Container size="narrow" className="py-20">
        <LoadingSkeleton height={32} width="60%" className="mb-4" />
        <LoadingSkeleton height={300} count={2} />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container size="narrow" className="py-24 text-center">
        <div className="space-y-4 max-w-md mx-auto">
          <AlertTriangle className="w-8 h-8 text-accent mx-auto" />
          <h2 className="text-2xl font-serif font-light text-ink">Vacancy Not Found</h2>
          <p className="text-xs text-ink-muted">
            The requested vacancy may have been unlisted or closed.
          </p>
          <Link to="/careers">
            <Button variant="primary" size="sm">
              Return to Careers Portal
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  // Check if closed
  const now = new Date().getTime();
  const closingTime = job.closingDate ? new Date(job.closingDate).getTime() : null;
  const isExpired = closingTime !== null && closingTime < now;
  const isClosed = job.status === 'closed' || isExpired;

  if (isClosed) {
    return (
      <Container size="narrow" className="py-24 text-center">
        <div className="bg-white border border-border p-8 sm:p-12 space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 bg-canvas-surface flex items-center justify-center text-ink-muted mx-auto border border-border">
            <Lock className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block">
            Applications Locked
          </span>
          <h2 className="text-2xl font-serif font-normal text-ink">
            {job.title}
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed font-sans">
            Formal applications for this position have concluded. We invite you to explore active opportunities in our other engineering, architectural, or quantity surveying disciplines.
          </p>
          <div className="pt-2">
            <Link to="/careers">
              <Button variant="primary" size="sm">
                Browse Active Vacancies
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title={`Apply: ${job.title} | VOLIA NIG LTD`}
        description={`Submit candidate application for ${job.title} at VOLIA NIG LTD.`}
      />

      {/* Top Breadcrumb */}
      <div className="bg-canvas border-b border-border py-3">
        <Container size="narrow">
          <div className="flex items-center justify-between text-xs text-ink-muted font-sans">
            <Link
              to={`/careers/${job.slug}`}
              className="inline-flex items-center space-x-1.5 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Job Specification</span>
            </Link>
            <span className="font-mono text-[10px] uppercase">
              Ref: {job.id.toUpperCase()}
            </span>
          </div>
        </Container>
      </div>

      <section className="py-12 sm:py-16 lg:py-20 bg-canvas">
        <Container size="narrow">
          <div className="space-y-8">
            {/* =====================================================================
                SECTION A: APPLICATION INTRODUCTION & INSTRUCTIONS
                ===================================================================== */}
            <div className="bg-white border border-border p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-border pb-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-architectural text-accent font-semibold">
                    CANDIDATE APPLICATION PROTOCOL
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted bg-canvas-surface px-2 py-0.5 border border-border">
                    {job.department}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted font-sans pt-1">
                  <span>Location: <strong className="text-ink font-medium">{job.location}</strong></span>
                  <span>&bull;</span>
                  <span>
                    Deadline:{' '}
                    <strong className="text-ink font-mono font-normal">
                      {job.closingDate
                        ? new Date(job.closingDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Open Until Filled'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Instructions and Criteria Checklist */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-ink font-semibold">
                  Application Instructions &amp; Requirements
                </h2>
                <p className="text-xs text-ink-muted leading-relaxed font-sans font-light">
                  Please complete all fields accurately. Candidates are assessed on statutory qualifications, project experience, and technical precision.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-sans">
                  <div className="p-3 bg-canvas-surface border border-border/80 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-accent font-semibold block">
                      Required Documents
                    </span>
                    <p className="text-ink-muted text-[11px] leading-relaxed">
                      Curriculum Vitae (PDF or DOCX, max 5MB). Cover letters and project folios are optional but recommended.
                    </p>
                  </div>

                  <div className="p-3 bg-canvas-surface border border-border/80 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-accent font-semibold block">
                      Statutory Accreditations
                    </span>
                    <p className="text-ink-muted text-[11px] leading-relaxed">
                      State your registration with COREN, ARCON, NIQS, or QSRBN where applicable for engineering clearance.
                    </p>
                  </div>
                </div>

                {/* Privacy Notice Notice */}
                <div className="p-3.5 bg-canvas border border-border text-[11px] text-ink-muted flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Privacy &amp; Data Protection Notice:</strong> In accordance with the Nigeria Data Protection Act (NDPA 2023), information provided herein will be processed solely for recruitment evaluation and will not be transferred to unverified third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* =====================================================================
                SECTION B: APPLICATION FORM
                ===================================================================== */}
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {errors.submission && (
                <div
                  role="alert"
                  className="p-4 bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-3 shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-semibold block">Submission Error</strong>
                    <p className="leading-relaxed">{errors.submission}</p>
                  </div>
                </div>
              )}

              {/* 1. PERSONAL INFORMATION */}
              <div className="bg-white border border-border p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="border-b border-border pb-3">
                  <h3 className="font-serif text-lg text-ink font-normal">
                    01. Personal Information
                  </h3>
                  <p className="text-xs text-ink-muted font-sans">
                    Legal identification and primary contact details for recruitment correspondence.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="First Name" required error={errors.firstName}>
                    <Input
                      type="text"
                      placeholder="e.g. Babatunde"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors({ ...errors, firstName: '' });
                      }}
                      error={!!errors.firstName}
                    />
                  </FormField>

                  <FormField label="Last Name" required error={errors.lastName}>
                    <Input
                      type="text"
                      placeholder="e.g. Adeleke"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors({ ...errors, lastName: '' });
                      }}
                      error={!!errors.lastName}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Email Address" required error={errors.email}>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      error={!!errors.email}
                    />
                  </FormField>

                  <FormField label="Phone Number" required error={errors.phone}>
                    <Input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      error={!!errors.phone}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Current Residential Location"
                  required
                  error={errors.location}
                  hint="Specify your city and state (e.g. Abuja, FCT or Victoria Island, Lagos)."
                >
                  <Input
                    type="text"
                    placeholder="e.g. Maitama, Abuja, FCT"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) setErrors({ ...errors, location: '' });
                    }}
                    error={!!errors.location}
                  />
                </FormField>
              </div>

              {/* 2. PROFESSIONAL INFORMATION */}
              <div className="bg-white border border-border p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="border-b border-border pb-3">
                  <h3 className="font-serif text-lg text-ink font-normal">
                    02. Professional Background
                  </h3>
                  <p className="text-xs text-ink-muted font-sans">
                    Current role, practice tenure, academic degree, and professional registrations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Current Job Title" required error={errors.currentJobTitle}>
                    <Input
                      type="text"
                      placeholder="e.g. Structural Design Engineer"
                      value={currentJobTitle}
                      onChange={(e) => {
                        setCurrentJobTitle(e.target.value);
                        if (errors.currentJobTitle) setErrors({ ...errors, currentJobTitle: '' });
                      }}
                      error={!!errors.currentJobTitle}
                    />
                  </FormField>

                  <FormField
                    label="Years of Relevant Experience"
                    required
                    error={errors.yearsOfExperience}
                  >
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      value={yearsOfExperience}
                      onChange={(e) => {
                        setYearsOfExperience(parseInt(e.target.value, 10) || 0);
                        if (errors.yearsOfExperience) setErrors({ ...errors, yearsOfExperience: '' });
                      }}
                      error={!!errors.yearsOfExperience}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Highest Academic Qualification" required>
                    <Select
                      value={highestQualification}
                      onChange={(e) => setHighestQualification(e.target.value)}
                      options={[
                        { label: 'B.Sc. / B.Eng. / B.Tech.', value: 'B.Sc. / B.Eng.' },
                        { label: 'M.Sc. / M.Eng. / M.Arch.', value: 'M.Sc. / M.Eng.' },
                        { label: 'Ph.D. / Doctorate', value: 'Ph.D.' },
                        { label: 'HND (Higher National Diploma)', value: 'HND' },
                        { label: 'Other Statutory Degree', value: 'Other' },
                      ]}
                    />
                  </FormField>

                  <FormField
                    label="Professional Council Registration"
                    hint="Optional. e.g. COREN (R.XXXXX), ARCON (F/XXXX), NIQS, or QSRBN."
                  >
                    <Input
                      type="text"
                      placeholder="e.g. COREN Registered Engineer (Structural)"
                      value={professionalAccreditation}
                      onChange={(e) => setProfessionalAccreditation(e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="LinkedIn Profile URL" error={errors.linkedInUrl} hint="Optional.">
                    <Input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedInUrl}
                      onChange={(e) => {
                        setLinkedInUrl(e.target.value);
                        if (errors.linkedInUrl) setErrors({ ...errors, linkedInUrl: '' });
                      }}
                      error={!!errors.linkedInUrl}
                    />
                  </FormField>

                  <FormField label="Portfolio / Project Website URL" error={errors.portfolioUrl} hint="Optional.">
                    <Input
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={portfolioUrl}
                      onChange={(e) => {
                        setPortfolioUrl(e.target.value);
                        if (errors.portfolioUrl) setErrors({ ...errors, portfolioUrl: '' });
                      }}
                      error={!!errors.portfolioUrl}
                    />
                  </FormField>
                </div>
              </div>

              {/* 3. SUPPORTING DOCUMENTS */}
              <div className="bg-white border border-border p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="border-b border-border pb-3">
                  <h3 className="font-serif text-lg text-ink font-normal">
                    03. Supporting Documents
                  </h3>
                  <p className="text-xs text-ink-muted font-sans">
                    Upload your verified documents. Permitted formats: PDF, DOC, DOCX up to 5MB.
                  </p>
                </div>

                <div className="space-y-4">
                  <FileUpload
                    label="Curriculum Vitae / Resume"
                    required
                    accept=".pdf,.doc,.docx"
                    maxSizeMB={5}
                    value={resumeFile}
                    onChange={(file) => {
                      setResumeFile(file);
                      if (errors.resumeFile) setErrors({ ...errors, resumeFile: '' });
                    }}
                    error={errors.resumeFile}
                    hint="Required. PDF preferred for preserved formatting (max 5MB)."
                  />

                  <FileUpload
                    label="Cover Letter Document"
                    accept=".pdf,.doc,.docx"
                    maxSizeMB={5}
                    value={coverLetterFile}
                    onChange={(file) => setCoverLetterFile(file)}
                    hint="Optional. You may upload a document or enter text below."
                  />

                  <FormField
                    label="Cover Letter Statement (Text Option)"
                    hint="Optional summary outlining your suitability for this specific commission."
                  >
                    <Textarea
                      rows={4}
                      placeholder="Summarize your engineering philosophy or key project milestones..."
                      value={coverLetterText}
                      onChange={(e) => setCoverLetterText(e.target.value)}
                    />
                  </FormField>

                  <FileUpload
                    label="Additional Supporting Document"
                    accept=".pdf,.doc,.docx"
                    maxSizeMB={5}
                    value={additionalFile}
                    onChange={(file) => setAdditionalFile(file)}
                    hint="Optional. Professional registration certificate, reference letter, or project sheet (max 5MB)."
                  />
                </div>
              </div>

              {/* 4. ADDITIONAL QUESTIONS */}
              <div className="bg-white border border-border p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="border-b border-border pb-3">
                  <h3 className="font-serif text-lg text-ink font-normal">
                    04. Role Specific Questions
                  </h3>
                  <p className="text-xs text-ink-muted font-sans">
                    Additional operational and technical clarifications.
                  </p>
                </div>

                <FormField
                  label="Notice Period / Earliest Availability"
                  required
                >
                  <Select
                    value={noticePeriodWeeks.toString()}
                    onChange={(e) => setNoticePeriodWeeks(parseInt(e.target.value, 10))}
                    options={[
                      { label: 'Immediate Availability (Within 1 week)', value: '1' },
                      { label: '2 Weeks Notice Period', value: '2' },
                      { label: '4 Weeks Notice Period (1 Month)', value: '4' },
                      { label: '8 Weeks Notice Period (2 Months)', value: '8' },
                      { label: '12 Weeks Notice Period (3 Months)', value: '12' },
                    ]}
                  />
                </FormField>

                {job.customQuestions && job.customQuestions.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {job.customQuestions.map((q) => (
                      <FormField
                        key={q.id}
                        label={q.question}
                        required={q.required}
                        error={errors[`custom_${q.id}`]}
                      >
                        {q.type === 'textarea' ? (
                          <Textarea
                            rows={3}
                            placeholder={q.placeholder || 'Your response...'}
                            value={customAnswers[q.id] || ''}
                            onChange={(e) => handleCustomAnswerChange(q.id, e.target.value)}
                            error={!!errors[`custom_${q.id}`]}
                          />
                        ) : (
                          <Input
                            type="text"
                            placeholder={q.placeholder || 'Your response...'}
                            value={customAnswers[q.id] || ''}
                            onChange={(e) => handleCustomAnswerChange(q.id, e.target.value)}
                            error={!!errors[`custom_${q.id}`]}
                          />
                        )}
                      </FormField>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. DECLARATION & CONSENT */}
              <div className="bg-white border border-border p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="border-b border-border pb-3">
                  <h3 className="font-serif text-lg text-ink font-normal">
                    05. Declaration &amp; Submission
                  </h3>
                </div>

                <div className="space-y-1">
                  <Checkbox
                    checked={consentDataProcessing}
                    onChange={(e) => {
                      setConsentDataProcessing(e.target.checked);
                      if (errors.consentDataProcessing) {
                        setErrors({ ...errors, consentDataProcessing: '' });
                      }
                    }}
                    error={Boolean(errors.consentDataProcessing)}
                    label="I certify that all statements and credentials supplied in this application are accurate and verifiable. I authorize VOLIA NIG LTD to conduct confidential recruitment evaluations in compliance with the Nigeria Data Protection Act (NDPA 2023)."
                  />
                  {errors.consentDataProcessing && (
                    <p className="text-xs text-status-danger pl-7 font-sans">
                      {errors.consentDataProcessing}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/80">
                  <span className="text-[11px] font-mono text-ink-muted">
                    STATUS: READY FOR SUBMISSION REVIEW
                  </span>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="min-h-[48px] px-8"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'Transmitting Dossier...' : 'Submit Application'}</span>
                    {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
};

export default JobApplyPage;
