import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import { COMPANY_DATA } from '@/data/company';
import {
  EnquiryService,
  GeneralEnquirySubmission,
  GeneralEnquiryResult,
} from '@/services/enquiryService';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  phone: string;
  organization: string;
  inquiryCategory: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  inquiryCategory?: string;
  message?: string;
}

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'Engineering Consultancy';

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryCategory: initialService,
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<GeneralEnquiryResult | null>(null);

  // Sync category from URL if provided
  useEffect(() => {
    const serviceFromUrl = searchParams.get('service');
    if (serviceFromUrl) {
      setFormData((prev) => ({ ...prev, inquiryCategory: serviceFromUrl }));
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide a valid contact name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid corporate or professional email address.';
    }

    const phoneRegex = /^[+0-9\s\-()]{7,20}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid telephone number (min 7 digits).';
    }

    if (!formData.inquiryCategory) {
      newErrors.inquiryCategory = 'Please select a primary consultancy category.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 15) {
      newErrors.message = 'Please provide a brief description of your project parameters (min 15 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: GeneralEnquirySubmission = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim() || undefined,
        inquiryCategory: formData.inquiryCategory,
        message: formData.message.trim(),
      };

      const result = await EnquiryService.submitGeneralEnquiry(payload);
      setSubmissionResult(result);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      inquiryCategory: 'Engineering Consultancy',
      message: '',
    });
    setErrors({});
  };

  return (
    <AppLayout>
      <SEO
        title="Contact &amp; Project Inquiries | VOLIA NIG LTD"
        description="Engage with VOLIA NIG LTD consultants to discuss capital project briefs, structural engineering peer review, or independent quantity surveying."
        canonicalPath="/contact"
      />

      {/* 1. Page Header */}
      <PageHeader
        kicker="Institutional Inquiries"
        title="Initiate a preliminary project dialogue."
        description="Our partners and senior consultancy specialists are accessible to discuss developmental briefs, structural engineering feasibility, or independent quantity surveying oversight."
        breadcrumb="PRACTICE // CONTACT"
      />

      {/* 2. Main Contact Interface */}
      <section className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Direct Placeholders & Practice Context (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-semibold tracking-architectural uppercase text-accent block">
                  Official Channels &bull; Provisional
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink">
                  Direct Inquiries
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light">
                  For formal procurement inquiries, statutory technical reviews, or joint-venture engineering consultations across Nigeria.
                </p>
              </div>

              {/* Communication Placeholders Grid */}
              <div className="space-y-3.5 pt-2 border-t border-border">
                {/* Email Placeholder */}
                <div className="p-4 sm:p-5 border border-border bg-canvas-surface/60 space-y-1.5">
                  <div className="flex items-center space-x-2 text-accent">
                    <Mail className="w-4 h-4 stroke-[1.5]" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest">
                      Electronic Mail (Provisional)
                    </span>
                  </div>
                  <a
                    href={`mailto:${COMPANY_DATA.contactPlaceholder.email}`}
                    className="text-xs sm:text-sm font-medium text-ink hover:text-accent transition-colors block truncate"
                  >
                    {COMPANY_DATA.contactPlaceholder.email}
                  </a>
                  <span className="text-[9px] sm:text-[10px] font-mono text-ink-muted block uppercase">
                    Subject to corporate confirmation
                  </span>
                </div>

                {/* Telephone Placeholder */}
                <div className="p-4 sm:p-5 border border-border bg-canvas-surface/60 space-y-1.5">
                  <div className="flex items-center space-x-2 text-accent">
                    <Phone className="w-4 h-4 stroke-[1.5]" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest">
                      Telephone (Provisional)
                    </span>
                  </div>
                  <a
                    href={`tel:${COMPANY_DATA.contactPlaceholder.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-xs sm:text-sm font-medium text-ink hover:text-accent transition-colors block"
                  >
                    {COMPANY_DATA.contactPlaceholder.phone}
                  </a>
                  <span className="text-[9px] sm:text-[10px] font-mono text-ink-muted block uppercase">
                    Technical Switchboard Placeholder
                  </span>
                </div>

                {/* Verified Location / Regulatory Jurisdiction */}
                <div className="p-4 sm:p-5 border border-border bg-canvas-surface/60 space-y-1.5">
                  <div className="flex items-center space-x-2 text-accent">
                    <MapPin className="w-4 h-4 stroke-[1.5]" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest">
                      Jurisdiction &amp; Registry
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-ink">
                    Federal Republic of Nigeria
                  </p>
                  <p className="text-[11px] sm:text-xs text-ink-muted font-light leading-relaxed">
                    Corporate filings and physical office address are undergoing statutory administrative updates with the Corporate Affairs Commission (CAC).
                  </p>
                </div>

                {/* Advisory Hours */}
                <div className="p-4 sm:p-5 border border-border bg-canvas-surface/60 space-y-1.5">
                  <div className="flex items-center space-x-2 text-accent">
                    <Clock className="w-4 h-4 stroke-[1.5]" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest">
                      Advisory Operating Hours
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink font-medium">
                    Monday &mdash; Friday &bull; 08:30 &mdash; 17:30 WAT
                  </p>
                  <p className="text-[11px] text-ink-muted font-light">
                    Consultations conducted by scheduled appointment.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Enquiry Form with Validation (7 cols) */}
            <div className="lg:col-span-7 border border-border bg-canvas-surface p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
              <div className="border-b border-border pb-4 sm:pb-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold block">
                  ADVISORY INTAKE FORM
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-1">
                  Submit Project Parameters
                </h3>
                <p className="text-xs text-ink-muted font-light mt-1.5 leading-relaxed">
                  Provide development parameters for preliminary technical review. All information is handled with fiduciary discretion.
                </p>
              </div>

              {/* Global Validation Error Banner */}
              {Object.keys(errors).length > 0 && !submissionResult && (
                <div className="p-3.5 border border-accent/40 bg-canvas flex items-start space-x-2.5 text-xs text-ink">
                  <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[11px] uppercase tracking-wider text-accent">
                      Incomplete Parameters
                    </span>
                    <span className="text-ink-muted font-light">
                      Please resolve the highlighted fields below before submitting the inquiry.
                    </span>
                  </div>
                </div>
              )}

              {submissionResult ? (
                /* Submission Feedback / Receipt State */
                <div className="space-y-6">
                  <div className="p-6 border border-accent/40 bg-canvas space-y-4">
                    <div className="flex items-center space-x-3 text-accent">
                      <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
                      <h4 className="font-serif text-xl sm:text-2xl text-ink font-normal">
                        Inquiry Parameters Logged
                      </h4>
                    </div>

                    <div className="p-4 border border-border bg-canvas-surface/70 space-y-2 text-xs">
                      <div className="flex items-center space-x-2 text-accent font-semibold uppercase text-[10px] font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Prototype Simulation Receipt</span>
                      </div>
                      <p className="text-ink-muted leading-relaxed font-light">
                        {submissionResult.message}
                      </p>
                    </div>

                    {/* Summary of what was validated and submitted */}
                    <div className="space-y-2 pt-2 border-t border-border text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-border/40">
                        <span className="text-[10px] uppercase font-mono text-ink-muted">Tracking Code:</span>
                        <span className="font-mono font-bold text-accent">{submissionResult.referenceId}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ink-muted pt-1">
                        <div>
                          <span className="text-[10px] uppercase font-mono block">Name:</span>
                          <span className="text-ink font-medium">{submissionResult.data.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono block">Email:</span>
                          <span className="text-ink font-medium">{submissionResult.data.email}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono block">Phone:</span>
                          <span className="text-ink font-medium">{submissionResult.data.phone}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono block">Organization:</span>
                          <span className="text-ink font-medium">{submissionResult.data.organization || 'Not Stated'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono block">Category:</span>
                          <span className="text-ink font-medium">{submissionResult.data.inquiryCategory}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-mono block text-ink-muted">Parameters Message:</span>
                        <p className="text-ink bg-canvas-surface/50 p-2.5 border border-border text-xs leading-relaxed font-light mt-1">
                          {submissionResult.data.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="secondary" size="md" onClick={handleReset} className="min-h-[44px]">
                      Submit Another Consultation Inquiry
                    </Button>
                  </div>
                </div>
              ) : (
                /* Enquiry Form with Interactive Validation */
                <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                  {/* Name & Organization Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block"
                      >
                        Contact Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="e.g. Babatunde Adeleke"
                        className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-canvas border text-base sm:text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline-none focus:border-accent min-h-[44px] ${
                          errors.name ? 'border-accent' : 'border-border'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-accent font-medium pt-0.5">{errors.name}</p>
                      )}
                    </div>

                    {/* Organization Field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="organization"
                        className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block"
                      >
                        Organization / Firm
                      </label>
                      <input
                        id="organization"
                        type="text"
                        disabled={isSubmitting}
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. Apex Capital Holdings Ltd"
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-canvas border border-border text-base sm:text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline-none focus:border-accent min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block"
                      >
                        Corporate Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="e.g. b.adeleke@organization.ng"
                        className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-canvas border text-base sm:text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline-none focus:border-accent min-h-[44px] ${
                          errors.email ? 'border-accent' : 'border-border'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-accent font-medium pt-0.5">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block"
                      >
                        Telephone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        disabled={isSubmitting}
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder="+234 (0) 800 000 0000"
                        className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-canvas border text-base sm:text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline-none focus:border-accent min-h-[44px] ${
                          errors.phone ? 'border-accent' : 'border-border'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-accent font-medium pt-0.5">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Inquiry Category */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="inquiryCategory"
                      className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block"
                    >
                      Inquiry Category *
                    </label>
                    <select
                      id="inquiryCategory"
                      disabled={isSubmitting}
                      value={formData.inquiryCategory}
                      onChange={(e) => {
                        setFormData({ ...formData, inquiryCategory: e.target.value });
                        if (errors.inquiryCategory) setErrors({ ...errors, inquiryCategory: undefined });
                      }}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-canvas border border-border text-base sm:text-xs text-ink focus-visible:outline-none focus:border-accent min-h-[44px]"
                    >
                      <option value="Engineering Consultancy">Engineering Consultancy</option>
                      <option value="Architectural Consultancy">Architectural Consultancy</option>
                      <option value="Quantity Surveying">Quantity Surveying</option>
                      <option value="Multidisciplinary Advisory">Multidisciplinary Advisory (All Disciplines)</option>
                      <option value="General Corporate Inquiry">General Corporate Inquiry</option>
                    </select>
                    {errors.inquiryCategory && (
                      <p className="text-[11px] text-accent font-medium pt-0.5">
                        {errors.inquiryCategory}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block"
                    >
                      Project Parameters &amp; Development Scope *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Outline project location, anticipated scale, structural engineering challenges, architectural requirements, or quantity surveying timeline..."
                      className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-canvas border text-base sm:text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline-none focus:border-accent resize-none min-h-[120px] ${
                        errors.message ? 'border-accent' : 'border-border'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-accent font-medium pt-0.5">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Notice & Submit Action */}
                  <div className="pt-2 sm:pt-3 space-y-3.5">
                    <div className="flex items-center space-x-2 text-[10px] text-ink-muted font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>PROVISIONAL SUBMISSION PROTOCOL &bull; LOCAL CLIENT-SIDE VERIFICATION</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="primary"
                      size="lg"
                      withArrow={!isSubmitting}
                      leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : undefined}
                      rightIcon={!isSubmitting ? <Send className="w-3.5 h-3.5" /> : undefined}
                      className="w-full min-h-[48px]"
                    >
                      {isSubmitting
                        ? 'Verifying Brief Parameters...'
                        : 'Submit Preliminary Consultation Parameters'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </AppLayout>
  );
};

export default ContactPage;
