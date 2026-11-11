import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Step 1 Options
const PROJECT_TYPES = [
  {
    id: 'residential',
    title: 'Residential development',
    description: 'Private estates, multi-family housing, residential towers, or custom residential compounds.',
  },
  {
    id: 'commercial',
    title: 'Commercial development',
    description: 'Corporate headquarters, office parks, retail centers, or hospitality facilities.',
  },
  {
    id: 'industrial',
    title: 'Industrial development',
    description: 'Warehousing, manufacturing plants, logistics hubs, or processing infrastructure.',
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure project',
    description: 'Civil drainage networks, roads, bridges, stormwater systems, or public works.',
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Mixed-use developments, institutional campuses, or bespoke architectural interventions.',
  },
];

// Step 2 Options
const SUPPORT_TYPES = [
  {
    id: 'engineering',
    title: 'Engineering consultancy',
    description: 'Structural engineering design, civil systems, geotechnical integration, and code compliance.',
  },
  {
    id: 'architecture',
    title: 'Architectural consultancy',
    description: 'Spatial planning, concept architecture, passive tropical envelope design, and master planning.',
  },
  {
    id: 'quantity-surveying',
    title: 'Quantity surveying',
    description: 'Cost planning, Bills of Quantities (BoQ), tender evaluation, and post-contract cost administration.',
  },
  {
    id: 'multiple-services',
    title: 'Multiple services',
    description: 'Coordinated multidisciplinary advisory combining engineering, architecture, and commercial controls.',
  },
  {
    id: 'not-sure',
    title: 'Not sure yet',
    description: 'Request scoping counsel from VOLIA advisory partners to define the appropriate consultancy package.',
  },
];

// Step 3 Options
const PROJECT_STAGES = [
  {
    id: 'initial-idea',
    title: 'Initial idea',
    description: 'Early conceptualization, site acquisition, or preliminary feasibility assessment.',
  },
  {
    id: 'planning-design',
    title: 'Planning and design',
    description: 'Active scheme formulation, architectural sketches, or statutory approval preparation.',
  },
  {
    id: 'pre-construction',
    title: 'Pre-construction',
    description: 'Final technical documentation, contractor tendering, and Bills of Quantities review.',
  },
  {
    id: 'construction',
    title: 'Construction',
    description: 'Physical site operations underway requiring resident supervision or commercial valuation audits.',
  },
  {
    id: 'existing-development',
    title: 'Existing development',
    description: 'Structural integrity audit, building expansion, remedial engineering, or refurbishment.',
  },
];

export const ServiceConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Wizard state (Steps 1 to 4, then Step 5 is the Review & Recommendation screen)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedProjectType, setSelectedProjectType] = useState<string>('');
  const [selectedSupport, setSelectedSupport] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [stepError, setStepError] = useState<string>('');

  // Pre-populate if query parameter passed
  useEffect(() => {
    const typeParam = searchParams.get('projectType');
    if (typeParam) {
      const match = PROJECT_TYPES.find(
        (t) => t.title.toLowerCase().includes(typeParam.toLowerCase()) || t.id === typeParam.toLowerCase()
      );
      if (match) {
        setSelectedProjectType(match.title);
      }
    }
  }, [searchParams]);

  // Validation before advancing
  const handleNextStep = () => {
    setStepError('');
    if (currentStep === 1 && !selectedProjectType) {
      setStepError('Please select a project development type to proceed.');
      return;
    }
    if (currentStep === 2 && !selectedSupport) {
      setStepError('Please select the primary consultancy support required.');
      return;
    }
    if (currentStep === 3 && !selectedStage) {
      setStepError('Please select the current stage of your development.');
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const jumpToStep = (stepNumber: number) => {
    setStepError('');
    setCurrentStep(stepNumber);
  };

  const handleReset = () => {
    setSelectedProjectType('');
    setSelectedSupport('');
    setSelectedStage('');
    setAdditionalDetails('');
    setCurrentStep(1);
    setStepError('');
  };

  // Generate customized advisory recommendation based on user selections
  const getAdvisoryRecommendation = () => {
    let focus = 'Multidisciplinary Built-Environment Advisory';
    let summary =
      'Based on your development parameters, VOLIA recommends an integrated consultancy approach prioritizing early-stage statutory compliance and cost governance.';
    const recommendations: string[] = [];

    if (selectedSupport.includes('Engineering') || selectedSupport.includes('Multiple')) {
      recommendations.push(
        'Structural & Geotechnical Feasibility: Complete borehole soil analysis and preliminary load modeling before detailed designs are finalized.'
      );
    }
    if (selectedSupport.includes('Architectural') || selectedSupport.includes('Multiple')) {
      recommendations.push(
        'Passive Tropical Envelope Strategy: Align massing and fenestration with solar sun-paths to dramatically reduce long-term generator cooling expenses.'
      );
    }
    if (selectedSupport.includes('Quantity') || selectedSupport.includes('Multiple')) {
      recommendations.push(
        'Elemental Cost Planning & Fluctuation Shield: Establish detailed Bills of Quantities (BoQ) with dynamic price adjustment formulas to protect against materials inflation.'
      );
    }
    if (selectedStage.includes('Initial idea') || selectedStage.includes('Planning')) {
      recommendations.push(
        'Statutory Planning Pre-Clearance: Engage municipal planning authorities early to ensure zoning alignment and streamline statutory approval.'
      );
    } else if (selectedStage.includes('Construction')) {
      recommendations.push(
        'Resident Site Quality Oversight: Institute a mandatory "Permit-to-Pour" inspection regime to verify structural steel reinforcement and concrete cube strengths.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Preliminary Scoping Consultation: VOLIA senior partners review project parameters to structure a bespoke consultancy engagement.'
      );
    }

    return { focus, summary, recommendations };
  };

  const advisory = getAdvisoryRecommendation();

  // Navigate to Project Brief Builder pre-filling the selections
  const handleProceedToBrief = () => {
    navigate('/project-brief', {
      state: {
        projectType: selectedProjectType,
        servicesRequired:
          selectedSupport === 'Multiple services'
            ? ['Engineering consultancy', 'Architectural consultancy', 'Quantity surveying']
            : selectedSupport === 'Not sure yet'
            ? ['Engineering consultancy']
            : [selectedSupport],
        projectStage: selectedStage,
        projectDescription: additionalDetails,
      },
    });
  };

  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / 4) * 100));

  return (
    <AppLayout>
      <SEO
        title="Interactive Service Discovery &amp; Consultation Scope"
        description="Identify the exact engineering, architectural, and quantity surveying advisory services needed for your Nigerian development project."
        canonicalPath="/services/consultation"
      />

      <PageHeader
        kicker="Guided Practice Discovery"
        title="Identify the exact consultancy counsel your project requires."
        description="A structured 4-step diagnostic tool developed by VOLIA NIG LTD to help property developers, corporate organizations, and public authorities define their engineering scope and statutory requirements."
        breadcrumb="SERVICES // CONSULTATION DISCOVERY"
      />

      <section className="py-12 sm:py-16 lg:py-20 border-b border-border bg-canvas">
        <Container size="narrow">
          <div className="space-y-8">
            {/* Top Progress Indicator */}
            <div className="space-y-2 border border-border p-4 bg-canvas-surface/60">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink font-semibold uppercase tracking-wider">
                  {currentStep <= 4 ? `Diagnostic Step 0${currentStep} of 04` : 'Consultation Scope Generated'}
                </span>
                <span className="text-accent font-bold">{currentStep <= 4 ? `${progressPercent}% Complete` : '100% Complete'}</span>
              </div>
              <div className="w-full h-1.5 bg-border/60 overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={false}
                  animate={{ width: `${currentStep <= 4 ? progressPercent : 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Error Banner */}
            {stepError && (
              <div className="p-3.5 border border-red-300 bg-red-50/70 text-red-800 text-xs flex items-center space-x-2">
                <Info className="w-4 h-4 text-red-600 shrink-0" />
                <span>{stepError}</span>
              </div>
            )}

            {/* Step Wizard Container */}
            <div className="border border-border bg-canvas p-6 sm:p-8 lg:p-10 shadow-sm">
              <AnimatePresence mode="wait">
                {/* STEP 1: Project Type */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        STEP 01 // TYPOLOGY CLASSIFICATION
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        What type of project are you planning?
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted font-light">
                        Select the primary sector category that best aligns with your proposed capital development.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {PROJECT_TYPES.map((type) => {
                        const isSelected = selectedProjectType === type.title;
                        return (
                          <div
                            key={type.id}
                            onClick={() => {
                              setSelectedProjectType(type.title);
                              setStepError('');
                            }}
                            className={cn(
                              'p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex items-start space-x-4 text-left select-none',
                              isSelected
                                ? 'border-ink bg-canvas-surface ring-1 ring-ink'
                                : 'border-border bg-canvas hover:border-accent hover:bg-canvas-surface/40'
                            )}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                setSelectedProjectType(type.title);
                              }
                            }}
                          >
                            <div
                              className={cn(
                                'w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-colors',
                                isSelected ? 'border-accent bg-accent' : 'border-border bg-canvas'
                              )}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-sm font-sans font-semibold text-ink">{type.title}</h3>
                              <p className="text-xs text-ink-muted font-light leading-relaxed">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Support Type */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        STEP 02 // PROFESSIONAL DISCIPLINE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        What support do you require?
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted font-light">
                        Indicate the primary technical counsel or multidisciplinary coordination needed.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {SUPPORT_TYPES.map((sup) => {
                        const isSelected = selectedSupport === sup.title;
                        return (
                          <div
                            key={sup.id}
                            onClick={() => {
                              setSelectedSupport(sup.title);
                              setStepError('');
                            }}
                            className={cn(
                              'p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex items-start space-x-4 text-left select-none',
                              isSelected
                                ? 'border-ink bg-canvas-surface ring-1 ring-ink'
                                : 'border-border bg-canvas hover:border-accent hover:bg-canvas-surface/40'
                            )}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                setSelectedSupport(sup.title);
                              }
                            }}
                          >
                            <div
                              className={cn(
                                'w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-colors',
                                isSelected ? 'border-accent bg-accent' : 'border-border bg-canvas'
                              )}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-sm font-sans font-semibold text-ink">{sup.title}</h3>
                              <p className="text-xs text-ink-muted font-light leading-relaxed">
                                {sup.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Project Stage */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        STEP 03 // LIFECYCLE MATURITY
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        What stage is your project currently at?
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted font-light">
                        Understanding your timeline allows our engineering directors to allocate the right resources.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {PROJECT_STAGES.map((stg) => {
                        const isSelected = selectedStage === stg.title;
                        return (
                          <div
                            key={stg.id}
                            onClick={() => {
                              setSelectedStage(stg.title);
                              setStepError('');
                            }}
                            className={cn(
                              'p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex items-start space-x-4 text-left select-none',
                              isSelected
                                ? 'border-ink bg-canvas-surface ring-1 ring-ink'
                                : 'border-border bg-canvas hover:border-accent hover:bg-canvas-surface/40'
                            )}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                setSelectedStage(stg.title);
                              }
                            }}
                          >
                            <div
                              className={cn(
                                'w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-colors',
                                isSelected ? 'border-accent bg-accent' : 'border-border bg-canvas'
                              )}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-sm font-sans font-semibold text-ink">{stg.title}</h3>
                              <p className="text-xs text-ink-muted font-light leading-relaxed">
                                {stg.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Optional Narrative Details */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        STEP 04 // DEVELOPMENT CONTEXT (OPTIONAL)
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        Tell us more about your project.
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed">
                        Provide any initial site dimensions, geographic location in Nigeria, budget constraints, or specific engineering challenges (e.g. high water table, long spans, complex zoning).
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label htmlFor="additional-details" className="text-xs font-mono uppercase text-ink block">
                        Project Narrative (Optional):
                      </label>
                      <textarea
                        id="additional-details"
                        rows={6}
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value)}
                        placeholder="e.g. Proposed 6-storey mixed-use development in Abuja Central Area requiring structural engineering verification, passive solar envelope advice, and comprehensive Bills of Quantities..."
                        className="w-full p-4 text-xs sm:text-sm font-sans bg-canvas-surface border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent leading-relaxed resize-y"
                        maxLength={1000}
                      />
                      <div className="flex justify-between text-[10px] font-mono text-ink-muted">
                        <span>Provides preliminary context for senior partners</span>
                        <span>{additionalDetails.length} / 1000 characters</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Structured Summary & Tailored Recommendation */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                        DIAGNOSTIC SYNTHESIS // ADVISORY SCOPE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                        Structured Project Enquiry Summary
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed">
                        Review your selections below. We have generated tailored engineering recommendations for your project before you proceed to the full Project Brief Builder.
                      </p>
                    </div>

                    {/* Selected Parameters Review Card with Edit Buttons */}
                    <div className="border border-border bg-canvas-surface/70 p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-ink font-semibold">
                          Client Diagnostic Inputs
                        </span>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="text-[11px] font-mono text-accent hover:underline flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restart Diagnostic</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                        <div className="p-3 bg-canvas border border-border flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">01. Project Typology:</span>
                            <span className="font-semibold text-ink mt-0.5 block">{selectedProjectType}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => jumpToStep(1)}
                            className="text-[10px] font-mono text-accent hover:underline text-left"
                          >
                            Edit Typology &rarr;
                          </button>
                        </div>

                        <div className="p-3 bg-canvas border border-border flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">02. Required Support:</span>
                            <span className="font-semibold text-ink mt-0.5 block">{selectedSupport}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => jumpToStep(2)}
                            className="text-[10px] font-mono text-accent hover:underline text-left"
                          >
                            Edit Support &rarr;
                          </button>
                        </div>

                        <div className="p-3 bg-canvas border border-border flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-mono text-ink-muted uppercase block">03. Project Stage:</span>
                            <span className="font-semibold text-ink mt-0.5 block">{selectedStage}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => jumpToStep(3)}
                            className="text-[10px] font-mono text-accent hover:underline text-left"
                          >
                            Edit Stage &rarr;
                          </button>
                        </div>
                      </div>

                      {additionalDetails && (
                        <div className="pt-2 border-t border-border">
                          <span className="text-[10px] font-mono text-ink-muted uppercase block mb-1">
                            04. Client Brief Narrative:
                          </span>
                          <p className="text-xs text-ink font-light italic leading-relaxed bg-canvas p-3 border border-border">
                            &ldquo;{additionalDetails}&rdquo;
                          </p>
                          <button
                            type="button"
                            onClick={() => jumpToStep(4)}
                            className="text-[10px] font-mono text-accent hover:underline mt-1 inline-block"
                          >
                            Edit Narrative &rarr;
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Tailored Technical Recommendations Box */}
                    <div className="border border-accent/40 bg-accent/5 p-5 sm:p-6 space-y-4">
                      <div className="flex items-center space-x-2.5">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
                          VOLIA Technical Scoping Recommendation
                        </span>
                      </div>
                      <p className="text-xs text-ink leading-relaxed font-medium">
                        {advisory.summary}
                      </p>
                      <div className="space-y-2 pt-1">
                        {advisory.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start space-x-2.5 text-xs text-ink/90">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Panel: Proceed to Brief Builder */}
                    <div className="p-5 border border-border bg-canvas flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-ink-muted space-y-1">
                        <span className="font-semibold text-ink block">Ready to formalize your project brief?</span>
                        <span>Your selections will automatically pre-populate the formal Project Brief Builder.</span>
                      </div>

                      <Button
                        onClick={handleProceedToBrief}
                        variant="primary"
                        size="md"
                        withArrow
                        className="w-full sm:w-auto min-h-[44px]"
                      >
                        Proceed to Project Brief Builder
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wizard Bottom Controls (Steps 1 to 4) */}
              {currentStep <= 4 && (
                <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-border flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
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
                    onClick={handleNextStep}
                    variant="primary"
                    size="md"
                    withArrow
                    className="min-h-[40px]"
                  >
                    {currentStep === 4 ? 'Generate Consultation Summary' : 'Next Step'}
                  </Button>
                </div>
              )}
            </div>

            {/* Reassurance Banner */}
            <div className="flex items-center justify-center space-x-4 text-[11px] font-mono text-ink-muted">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Zero Obligation Scoping</span>
              </span>
              <span>&bull;</span>
              <span>No Automatic Submissions</span>
              <span>&bull;</span>
              <span>Confidential Review</span>
            </div>
          </div>
        </Container>
      </section>
    </AppLayout>
  );
};
