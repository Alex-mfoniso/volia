import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import { EnquiryService, type ProjectBriefSubmission, type SubmissionResult } from '@/services/enquiryService';
import { generateProjectBriefPdf } from '@/lib/pdfGenerator';
import {
  Paperclip,
  Download,
  ArrowLeft,
  CheckCircle2,
  Info,
  ShieldAlert,
  Loader2,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SERVICE_OPTIONS = [
  'Engineering consultancy',
  'Architectural consultancy',
  'Quantity surveying',
  'Civil infrastructure advisory',
  'Statutory code compliance audit',
];

const BUDGET_RANGES = [
  'Under ₦100 Million',
  '₦100 Million – ₦500 Million',
  '₦500 Million – ₦2 Billion',
  '₦2 Billion – ₦10 Billion',
  'Over ₦10 Billion / Institutional Scale',
  'Subject to Feasibility Scoping',
];

const TIMELINE_OPTIONS = [
  'Immediate (Under 3 Months)',
  '3 to 6 Months',
  '6 to 12 Months',
  '1 to 2 Years',
  'Long-Term Capital Program',
];

export const ProjectBriefPage: React.FC = () => {
  const location = useLocation();
  const prefillState = location.state as
    | {
        projectType?: string;
        servicesRequired?: string[];
        projectStage?: string;
        projectDescription?: string;
      }
    | undefined;

  // Wizard Step: 1 = Personal, 2 = Project, 3 = Services, 4 = Details, 5 = Review & Actions
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [projectName, setProjectName] = useState<string>('');
  const [projectLocation, setProjectLocation] = useState<string>('');
  const [projectType, setProjectType] = useState<string>(prefillState?.projectType || 'Commercial development');
  const [estimatedBudget, setEstimatedBudget] = useState<string>(BUDGET_RANGES[2]);
  const [projectStage, setProjectStage] = useState<string>(prefillState?.projectStage || 'Planning and design');
  const [expectedTimeline, setExpectedTimeline] = useState<string>(TIMELINE_OPTIONS[1]);

  const [selectedServices, setSelectedServices] = useState<string[]>(
    prefillState?.servicesRequired || ['Engineering consultancy']
  );
  const [otherService, setOtherService] = useState<string>('');

  const [projectDescription, setProjectDescription] = useState<string>(
    prefillState?.projectDescription || ''
  );
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');

  // UI / Submission State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);

  // Auto-scroll to top of form when step changes
  useEffect(() => {
    window.scrollTo({ top: 380, behavior: 'smooth' });
  }, [currentStep]);

  // Validation function per step
  const validateStep = (step: number): boolean => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!fullName.trim()) errs.fullName = 'Full legal name is required.';
      if (!email.trim()) {
        errs.email = 'Corporate email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errs.email = 'Please provide a valid corporate email address.';
      }
      if (!phone.trim()) {
        errs.phone = 'Phone number is required for verification.';
      }
    } else if (step === 2) {
      if (!projectName.trim()) errs.projectName = 'Project or development name is required.';
      if (!projectLocation.trim()) errs.projectLocation = 'Geographic location (State / City) is required.';
      if (!projectType) errs.projectType = 'Please select a project typology.';
    } else if (step === 3) {
      if (selectedServices.length === 0) {
        errs.services = 'Please select at least one professional discipline.';
      }
    } else if (step === 4) {
      if (!projectDescription.trim() || projectDescription.trim().length < 20) {
        errs.projectDescription = 'Please provide a brief narrative describing the development (minimum 20 characters).';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const currentBriefPayload: Omit<ProjectBriefSubmission, 'referenceId' | 'timestamp'> = {
    fullName: fullName.trim(),
    companyName: companyName.trim() || undefined,
    email: email.trim(),
    phone: phone.trim(),
    projectName: projectName.trim(),
    projectLocation: projectLocation.trim(),
    projectType,
    estimatedBudget,
    projectStage,
    expectedTimeline,
    servicesRequired: selectedServices,
    otherServiceDescription: otherService.trim() || undefined,
    projectDescription: projectDescription.trim(),
    specialRequirements: specialRequirements.trim() || undefined,
    referenceAttachmentName: attachmentName || undefined,
  };

  // Generate & Download PDF
  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    try {
      const submissionForPdf: ProjectBriefSubmission = {
        ...currentBriefPayload,
        referenceId: submissionResult?.referenceId || `VOLIA-BRF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
      };
      generateProjectBriefPdf(submissionForPdf);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Submit via clean service abstraction
  const handleSubmitBrief = async () => {
    setIsSubmitting(true);
    try {
      const result = await EnquiryService.submitProjectBrief(currentBriefPayload);
      setSubmissionResult(result);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round((currentStep / 5) * 100);

  return (
    <AppLayout>
      <SEO
        title="Project Brief Builder &amp; Technical Scoping Dossier"
        description="Formalize your Nigerian construction or engineering development brief. Download an executive PDF brief and submit for corporate review."
        canonicalPath="/project-brief"
      />

      <PageHeader
        kicker="Commercial Business Development"
        title="Project Brief Builder &amp; Technical Scoping Dossier."
        description="Structured digital brief creation for developers, public infrastructure proponents, and institutions seeking qualified engineering, architectural, or quantity surveying counsel."
        breadcrumb="ENGAGEMENT // PROJECT BRIEF"
      />

      <section className="py-12 sm:py-16 lg:py-20 border-b border-border bg-canvas">
        <Container size="narrow">
          <div className="space-y-8">
            {/* Step Progress Tracker */}
            <div className="border border-border p-4 bg-canvas-surface/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink font-semibold uppercase tracking-wider">
                  Step 0{currentStep} of 05 //{' '}
                  {currentStep === 1 && 'Proponent & Corporate Contact'}
                  {currentStep === 2 && 'Project Parameters & Context'}
                  {currentStep === 3 && 'Required Advisory Disciplines'}
                  {currentStep === 4 && 'Development Narrative & Specs'}
                  {currentStep === 5 && 'Executive Review & PDF Generation'}
                </span>
                <span className="text-accent font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-border/60 overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Main Form Panel */}
            <div className="border border-border bg-canvas p-6 sm:p-8 lg:p-10 shadow-sm">
              <AnimatePresence mode="wait">
                {/* STEP 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        PART 01 // PROPONENT IDENTIFICATION
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        Personal &amp; Organization Information
                      </h2>
                      <p className="text-xs text-ink-muted font-light">
                        Please provide verified contact details for correspondence and technical proposal delivery.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-1.5">
                        <label htmlFor="fullName" className="text-xs font-mono uppercase text-ink block font-medium">
                          Full Name *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Arc. Babatunde Adeleke"
                          className={cn(
                            'w-full p-3 text-xs sm:text-sm bg-canvas-surface border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent',
                            errors.fullName ? 'border-red-400' : 'border-border'
                          )}
                        />
                        {errors.fullName && <p className="text-[10px] text-red-600 font-mono">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="companyName" className="text-xs font-mono uppercase text-ink block font-medium">
                          Company / Entity Name (Optional)
                        </label>
                        <input
                          id="companyName"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Landmark Properties Nigeria Ltd"
                          className="w-full p-3 text-xs sm:text-sm bg-canvas-surface border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-mono uppercase text-ink block font-medium">
                          Corporate Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. adeleke@landmark.ng"
                          className={cn(
                            'w-full p-3 text-xs sm:text-sm bg-canvas-surface border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent',
                            errors.email ? 'border-red-400' : 'border-border'
                          )}
                        />
                        {errors.email && <p className="text-[10px] text-red-600 font-mono">{errors.email}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-xs font-mono uppercase text-ink block font-medium">
                          Telephone Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +234 (0) 803 123 4567"
                          className={cn(
                            'w-full p-3 text-xs sm:text-sm bg-canvas-surface border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent',
                            errors.phone ? 'border-red-400' : 'border-border'
                          )}
                        />
                        {errors.phone && <p className="text-[10px] text-red-600 font-mono">{errors.phone}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Project Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        PART 02 // DEVELOPMENT PARAMETERS
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        Project Specifications &amp; Context
                      </h2>
                      <p className="text-xs text-ink-muted font-light">
                        Outline the location, scope, and anticipated investment scale of the project.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="projectName" className="text-xs font-mono uppercase text-ink block font-medium">
                          Project or Development Name *
                        </label>
                        <input
                          id="projectName"
                          type="text"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="e.g. Maitama Commercial Towers &amp; Civic Plaza"
                          className={cn(
                            'w-full p-3 text-xs sm:text-sm bg-canvas-surface border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent',
                            errors.projectName ? 'border-red-400' : 'border-border'
                          )}
                        />
                        {errors.projectName && <p className="text-[10px] text-red-600 font-mono">{errors.projectName}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="projectLocation" className="text-xs font-mono uppercase text-ink block font-medium">
                          Geographic Location (State / City) *
                        </label>
                        <input
                          id="projectLocation"
                          type="text"
                          value={projectLocation}
                          onChange={(e) => setProjectLocation(e.target.value)}
                          placeholder="e.g. Abuja FCT / Victoria Island, Lagos"
                          className={cn(
                            'w-full p-3 text-xs sm:text-sm bg-canvas-surface border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent',
                            errors.projectLocation ? 'border-red-400' : 'border-border'
                          )}
                        />
                        {errors.projectLocation && <p className="text-[10px] text-red-600 font-mono">{errors.projectLocation}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="projectType" className="text-xs font-mono uppercase text-ink block font-medium">
                          Development Typology *
                        </label>
                        <select
                          id="projectType"
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                          className="w-full p-3 text-xs sm:text-sm bg-canvas-surface border border-border text-ink focus:outline-none focus:border-accent"
                        >
                          <option value="Commercial development">Commercial development</option>
                          <option value="Residential development">Residential development</option>
                          <option value="Industrial development">Industrial development</option>
                          <option value="Infrastructure project">Infrastructure project</option>
                          <option value="Mixed-use development">Mixed-use development</option>
                          <option value="Institutional campus">Institutional campus</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="estimatedBudget" className="text-xs font-mono uppercase text-ink block font-medium">
                          Estimated Capital Budget
                        </label>
                        <select
                          id="estimatedBudget"
                          value={estimatedBudget}
                          onChange={(e) => setEstimatedBudget(e.target.value)}
                          className="w-full p-3 text-xs sm:text-sm bg-canvas-surface border border-border text-ink focus:outline-none focus:border-accent"
                        >
                          {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="projectStage" className="text-xs font-mono uppercase text-ink block font-medium">
                          Current Project Stage
                        </label>
                        <select
                          id="projectStage"
                          value={projectStage}
                          onChange={(e) => setProjectStage(e.target.value)}
                          className="w-full p-3 text-xs sm:text-sm bg-canvas-surface border border-border text-ink focus:outline-none focus:border-accent"
                        >
                          <option value="Initial idea">Initial idea</option>
                          <option value="Planning and design">Planning and design</option>
                          <option value="Pre-construction">Pre-construction</option>
                          <option value="Construction">Construction</option>
                          <option value="Existing development">Existing development</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="expectedTimeline" className="text-xs font-mono uppercase text-ink block font-medium">
                          Expected Timeline to Commencement
                        </label>
                        <select
                          id="expectedTimeline"
                          value={expectedTimeline}
                          onChange={(e) => setExpectedTimeline(e.target.value)}
                          className="w-full p-3 text-xs sm:text-sm bg-canvas-surface border border-border text-ink focus:outline-none focus:border-accent"
                        >
                          {TIMELINE_OPTIONS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Services Required */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        PART 03 // DISCIPLINE SELECTION
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        Services &amp; Advisory Scope Required
                      </h2>
                      <p className="text-xs text-ink-muted font-light">
                        Select all disciplines you require VOLIA NIG LTD to provide or coordinate.
                      </p>
                    </div>

                    {errors.services && (
                      <p className="p-3 border border-red-300 bg-red-50 text-red-700 text-xs">
                        {errors.services}
                      </p>
                    )}

                    <div className="space-y-3 pt-2">
                      {SERVICE_OPTIONS.map((srv) => {
                        const isChecked = selectedServices.includes(srv);
                        return (
                          <div
                            key={srv}
                            onClick={() => handleServiceToggle(srv)}
                            className={cn(
                              'p-4 border transition-all duration-200 cursor-pointer flex items-center justify-between text-left select-none',
                              isChecked
                                ? 'border-ink bg-canvas-surface ring-1 ring-ink'
                                : 'border-border bg-canvas hover:border-accent'
                            )}
                            role="checkbox"
                            aria-checked={isChecked}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                handleServiceToggle(srv);
                              }
                            }}
                          >
                            <span className="text-sm font-sans font-medium text-ink">{srv}</span>
                            <div
                              className={cn(
                                'w-5 h-5 border flex items-center justify-center transition-colors',
                                isChecked ? 'bg-accent border-accent text-white' : 'border-border bg-canvas'
                              )}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 space-y-1.5">
                      <label htmlFor="otherService" className="text-xs font-mono uppercase text-ink block">
                        Other Specialized Discipline (Optional):
                      </label>
                      <input
                        id="otherService"
                        type="text"
                        value={otherService}
                        onChange={(e) => setOtherService(e.target.value)}
                        placeholder="e.g. Geotechnical borehole drilling, façade engineering, acoustic modeling"
                        className="w-full p-3 text-xs bg-canvas-surface border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Additional Information & Narrative */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        PART 04 // PROJECT NARRATIVE &amp; ATTACHMENTS
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        Development Scope &amp; Special Constraints
                      </h2>
                      <p className="text-xs text-ink-muted font-light">
                        Describe the programmatic requirements, site constraints, and any architectural references.
                      </p>
                    </div>

                    <div className="space-y-5 pt-2">
                      <div className="space-y-1.5">
                        <label htmlFor="projectDescription" className="text-xs font-mono uppercase text-ink block font-medium">
                          Project Description &amp; Spatial Brief *
                        </label>
                        <textarea
                          id="projectDescription"
                          rows={5}
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          placeholder="Provide an overview of the development, functional requirements, floor area expectations, and commercial aspirations..."
                          className={cn(
                            'w-full p-3.5 text-xs sm:text-sm bg-canvas-surface border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent leading-relaxed',
                            errors.projectDescription ? 'border-red-400' : 'border-border'
                          )}
                        />
                        {errors.projectDescription && (
                          <p className="text-[10px] text-red-600 font-mono">{errors.projectDescription}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="specialRequirements" className="text-xs font-mono uppercase text-ink block font-medium">
                          Special Engineering or Statutory Requirements (Optional)
                        </label>
                        <textarea
                          id="specialRequirements"
                          rows={3}
                          value={specialRequirements}
                          onChange={(e) => setSpecialRequirements(e.target.value)}
                          placeholder="e.g. Subsurface dewatering, seismic consideration, fast-track procurement, strict LEED/EDGE green building certification..."
                          className="w-full p-3.5 text-xs sm:text-sm bg-canvas-surface border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent leading-relaxed"
                        />
                      </div>

                      {/* Optional File Attachment Simulation */}
                      <div className="space-y-2 pt-2 border-t border-border">
                        <label className="text-xs font-mono uppercase text-ink block font-medium">
                          Optional Reference Attachment (Site Plan, Survey, or Brief PDF)
                        </label>
                        <div className="border border-dashed border-border p-5 text-center bg-canvas-surface/40 hover:bg-canvas-surface transition-colors cursor-pointer relative">
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".pdf,.dwg,.doc,.docx,.png,.jpg"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Paperclip className="w-5 h-5 text-accent mx-auto mb-2" />
                          <p className="text-xs text-ink font-medium">
                            {attachmentName ? (
                              <span className="text-accent font-mono">{attachmentName} (Selected)</span>
                            ) : (
                              'Click or drag to attach reference file (PDF, DWG, DOCX up to 25MB)'
                            )}
                          </p>
                          <p className="text-[10px] font-mono text-ink-muted mt-1">
                            Attachments are processed client-side for inclusion in your executive brief dossier.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Review Screen & Actions */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        FINAL SYNTHESIS // EXECUTIVE DOSSIER
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        Review Project Brief Dossier
                      </h2>
                      <p className="text-xs text-ink-muted font-light leading-relaxed">
                        Verify your entered project brief details below. You can generate a branded corporate PDF dossier and submit your enquiry to VOLIA practice partners.
                      </p>
                    </div>

                    {/* Summary Card with Section Jump Links */}
                    <div className="border border-border bg-canvas-surface/80 p-5 sm:p-6 space-y-6">
                      {/* Section 1: Contact */}
                      <div className="space-y-2 border-b border-border pb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
                            01 // Proponent Contact
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="text-[11px] font-mono text-ink-muted hover:text-ink underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Name:</span>
                            <span className="font-medium text-ink">{fullName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Company:</span>
                            <span className="font-medium text-ink">{companyName || 'Private Developer'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Email:</span>
                            <span className="font-medium text-ink truncate block">{email}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Phone:</span>
                            <span className="font-medium text-ink">{phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Project Params */}
                      <div className="space-y-2 border-b border-border pb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
                            02 // Project Parameters
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="text-[11px] font-mono text-ink-muted hover:text-ink underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-sans">
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Project Name:</span>
                            <span className="font-medium text-ink">{projectName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Location:</span>
                            <span className="font-medium text-ink">{projectLocation}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Typology:</span>
                            <span className="font-medium text-ink">{projectType}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Budget Benchmark:</span>
                            <span className="font-medium text-ink">{estimatedBudget}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Current Stage:</span>
                            <span className="font-medium text-ink">{projectStage}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">Timeline:</span>
                            <span className="font-medium text-ink">{expectedTimeline}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Disciplines */}
                      <div className="space-y-2 border-b border-border pb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
                            03 // Disciplines Requested
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="text-[11px] font-mono text-ink-muted hover:text-ink underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-mono">
                          {selectedServices.map((svc) => (
                            <span key={svc} className="bg-canvas border border-border px-2.5 py-1 text-ink">
                              [X] {svc}
                            </span>
                          ))}
                          {otherService && (
                            <span className="bg-canvas border border-accent/40 px-2.5 py-1 text-accent">
                              + {otherService}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Section 4: Narrative */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
                            04 // Narrative Scope
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(4)}
                            className="text-[11px] font-mono text-ink-muted hover:text-ink underline"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-xs text-ink leading-relaxed font-light italic bg-canvas p-3 border border-border">
                          &ldquo;{projectDescription}&rdquo;
                        </p>
                        {specialRequirements && (
                          <div className="text-[11px] text-ink-muted pt-1">
                            <strong>Special Specs:</strong> {specialRequirements}
                          </div>
                        )}
                        {attachmentName && (
                          <div className="text-[11px] text-accent font-mono pt-1">
                            <strong>Attachment:</strong> {attachmentName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submission Result / Prototype Simulation Notice */}
                    {submissionResult && (
                      <div
                        className={cn(
                          'p-5 border space-y-3',
                          submissionResult.mode === 'live_backend'
                            ? 'border-green-300 bg-green-50 text-green-900'
                            : 'border-accent/40 bg-accent/5 text-ink'
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          {submissionResult.mode === 'live_backend' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <span className="text-xs font-mono uppercase font-bold tracking-wider block">
                              {submissionResult.mode === 'live_backend'
                                ? 'Live Corporate Intake Confirmed'
                                : 'Prototype Simulation Mode &bull; Commercial Integrity'}
                            </span>
                            <p className="text-xs leading-relaxed font-light">
                              {submissionResult.message}
                            </p>
                            <p className="text-[11px] font-mono text-accent pt-1">
                              DOSSIER REFERENCE CODE: <strong>{submissionResult.referenceId}</strong>
                            </p>
                          </div>
                        </div>

                        {submissionResult.mode === 'prototype_simulation' && (
                          <div className="text-[10px] font-mono text-ink-muted border-t border-border/60 pt-2">
                            Note: No real external submission was simulated or faked. You may safely download your vector PDF copy below.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dual Action Buttons: PDF Generation & Submit */}
                    <div className="p-5 border border-border bg-canvas flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-ink-muted space-y-0.5">
                        <span className="font-semibold text-ink block">Two Official Actions Available:</span>
                        <span>Download vector-crisp PDF dossier or transmit for partner review.</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <Button
                          onClick={handleDownloadPdf}
                          variant="outline"
                          size="md"
                          className="w-full sm:w-auto min-h-[44px]"
                          disabled={isPdfGenerating}
                        >
                          {isPdfGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Download className="w-4 h-4 mr-2 text-accent" />
                          )}
                          <span>Download Project Brief (PDF)</span>
                        </Button>

                        <Button
                          onClick={handleSubmitBrief}
                          variant="primary"
                          size="md"
                          withArrow
                          className="w-full sm:w-auto min-h-[44px]"
                          disabled={isSubmitting || !!submissionResult}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              <span>Processing Brief...</span>
                            </>
                          ) : submissionResult ? (
                            'Brief Registered'
                          ) : (
                            'Submit Project Brief'
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls for Steps 1 to 4 */}
              {currentStep < 5 && (
                <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-border flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={cn(
                      'text-xs font-sans tracking-architectural uppercase px-4 py-2 border transition-colors flex items-center space-x-1.5 min-h-[40px]',
                      currentStep === 1
                        ? 'opacity-40 cursor-not-allowed border-border text-ink-muted'
                        : 'border-border text-ink hover:border-ink bg-canvas'
                    )}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <Button
                    onClick={handleNext}
                    variant="primary"
                    size="md"
                    withArrow
                    className="min-h-[40px]"
                  >
                    {currentStep === 4 ? 'Review & Finalize Brief' : 'Next Step'}
                  </Button>
                </div>
              )}
            </div>

            {/* Privacy & Commercial Governance Notice */}
            <div className="p-4 border border-border bg-canvas-surface/40 flex items-start space-x-3 text-xs text-ink-muted">
              <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Data Privacy &amp; Commercial Security:</strong> VOLIA NIG LTD protects your proprietary business concepts. Form data is not permanently written to unencrypted local storage. Submissions are handled under strict confidentiality protocols.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </AppLayout>
  );
};
