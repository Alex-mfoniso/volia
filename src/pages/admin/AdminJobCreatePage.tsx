import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { JobDepartment, EmploymentType, ExperienceLevel, JobStatus } from '@/types';
import { jobService } from '@/services/jobService';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/form/FormField';
import { Input } from '@/components/ui/form/Input';
import { Textarea } from '@/components/ui/form/Textarea';
import { Select } from '@/components/ui/form/Select';
import { Alert } from '@/components/ui/feedback/Alert';

export const AdminJobCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<JobDepartment>('Engineering');
  const [location, setLocation] = useState('Abuja, FCT (Central Business District)');
  const [type, setType] = useState<EmploymentType>('full_time');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('senior');
  const [openingsCount, setOpeningsCount] = useState<number>(1);
  const [overview, setOverview] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [desirableText, setDesirableText] = useState('');
  const [remunerationNote, setRemunerationNote] = useState(
    'Competitive executive consultancy package commensurate with professional accreditation and project track record.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (targetStatus: JobStatus) => {
    setErrorMessage(null);

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

      await jobService.createJob({
        title,
        department,
        location,
        type,
        experienceLevel,
        openingsCount,
        overview,
        responsibilities: responsibilities.length > 0 ? responsibilities : ['Consultancy scope as assigned by practice lead.'],
        requirements: requirements.length > 0 ? requirements : ['Accreditation with relevant regulatory body.'],
        desirableQualifications,
        remunerationNote,
        status: targetStatus,
      });

      navigate('/admin/jobs');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create job posting.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Nav */}
      <div className="border-b border-admin-border pb-4 flex items-center justify-between">
        <div>
          <Link
            to="/admin/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink font-sans mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Positions</span>
          </Link>
          <h1 className="text-2xl font-serif font-light text-ink">
            Create Recruitment Specification
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
          >
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            Publish Live
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Alert type="danger" title="Validation Alert">
          {errorMessage}
        </Alert>
      )}

      {/* Primary Details Card */}
      <div className="bg-white border border-border p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-serif font-medium text-ink border-b border-border/80 pb-2">
          Position Mandate & Parameters
        </h2>

        <FormField label="Official Position Title" required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Structural Engineer (Bridges & Tall Buildings)"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Consultancy Discipline" required>
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

          <FormField label="Engagement Typology" required>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as EmploymentType)}
              options={[
                { value: 'full_time', label: 'Full Time' },
                { value: 'contract', label: 'Fixed Term Contract' },
                { value: 'hybrid', label: 'Hybrid Consultancy' },
                { value: 'consultancy', label: 'Senior Advisor / Retainer' },
              ]}
            />
          </FormField>

          <FormField label="Seniority Level" required>
            <Select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              options={[
                { value: 'entry', label: 'Entry Level (Graduate)' },
                { value: 'intermediate', label: 'Intermediate (3-5 yrs)' },
                { value: 'senior', label: 'Senior (6-10 yrs)' },
                { value: 'lead', label: 'Lead / Principal (10+ yrs)' },
                { value: 'principal', label: 'Partner Track' },
              ]}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Physical / Operational Location" required>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Abuja CBD, FCT or Lagos Office"
            />
          </FormField>

          <FormField label="Target Vacancy Headcount" required>
            <Input
              type="number"
              min={1}
              max={15}
              value={openingsCount}
              onChange={(e) => setOpeningsCount(Number(e.target.value))}
            />
          </FormField>
        </div>

        <FormField
          label="Executive Role Overview"
          required
          hint="Succinct summary of the technical mandate, client projects, and practice contribution."
        >
          <Textarea
            rows={3}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Describe the structural, architectural, or cost engineering scope..."
          />
        </FormField>
      </div>

      {/* Scope and Requirements */}
      <div className="bg-white border border-border p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-serif font-medium text-ink border-b border-border/80 pb-2">
          Scope & Accreditations (One Item Per Line)
        </h2>

        <FormField
          label="Key Responsibilities"
          hint="Enter each deliverable or duty on a new line."
        >
          <Textarea
            rows={5}
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
            placeholder="Lead finite element modeling in ETABS / SAP2000...&#10;Supervise structural calculation submissions under Eurocode 2...&#10;Conduct peer engineering reviews with project architects..."
          />
        </FormField>

        <FormField
          label="Accreditation & Experience Requirements"
          hint="Enter each prerequisite (degree, COREN / ARCON / NIQS registration, software proficiency) on a new line."
        >
          <Textarea
            rows={5}
            value={requirementsText}
            onChange={(e) => setRequirementsText(e.target.value)}
            placeholder="COREN Registered Engineer (Civil/Structural)...&#10;Minimum 8 years of structural consultancy experience...&#10;Demonstrated mastery of Revit Structure and Prokon..."
          />
        </FormField>

        <FormField
          label="Desirable / Advantageous Qualifications"
          hint="Optional secondary qualifications (e.g. FIDIC contract knowledge, M.Sc.)."
        >
          <Textarea
            rows={3}
            value={desirableText}
            onChange={(e) => setDesirableText(e.target.value)}
            placeholder="Familiarity with deep foundation pile load testing...&#10;Experience in BIM clash detection workflows..."
          />
        </FormField>

        <FormField label="Remuneration & Engagement Terms Note">
          <Input
            value={remunerationNote}
            onChange={(e) => setRemunerationNote(e.target.value)}
          />
        </FormField>
      </div>
    </div>
  );
};

export default AdminJobCreatePage;
