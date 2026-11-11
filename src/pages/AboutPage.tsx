import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArchitecturalImage } from '@/components/ui/ArchitecturalImage';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/ui/Button';
import { COMPANY_DATA } from '@/data/company';
import {
  Target,
  Compass,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Scale,
  GitCommit,
  CheckCircle2,
  Search,
  PenTool,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <AppLayout>
      <SEO
        title="About The Practice &amp; Corporate Heritage | VOLIA NIG LTD"
        description="Learn about VOLIA NIG LTD's institutional foundation, engineering and consultancy purpose, structured approach, and core values."
        canonicalPath="/about"
      />

      {/* SECTION 1: ABOUT HERO */}
      <PageHeader
        kicker="About The Practice"
        title="An institutional commitment to structural longevity and spatial precision."
        description="VOLIA NIG LTD is an integrated Nigerian engineering and consultancy practice combining structural engineering advisory, architectural planning, and fiduciary quantity surveying."
        breadcrumb="PRACTICE // ABOUT"
      />

      {/* SECTION 2: COMPANY OVERVIEW */}
      <section className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-sans font-semibold tracking-architectural uppercase text-accent block">
                02 &bull; Company Overview
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-ink leading-[1.15]">
                Engineering rigor integrated with spatial foresight.
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-ink-muted font-light leading-relaxed font-sans">
                <p>
                  <strong className="text-ink font-semibold">{COMPANY_DATA.legalName}</strong> is an established consultancy practice delivering integrated technical counsel across the life cycle of physical developments. We believe that sustainable built environments require a synthesis of spatial logic, structural safety, and rigorous fiscal oversight.
                </p>
                <p>
                  Our consultancy operates free from contractor bias. By maintaining strict separation between consultancy advisory and construction contracting, our recommendations protect client capital, ensure contractor compliance, and uphold statutory life-safety requirements without compromise.
                </p>
              </div>

              {/* Factual Governance Badges */}
              <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 border border-border bg-canvas-surface/60 space-y-1">
                  <span className="text-[10px] font-mono text-accent uppercase">GOVERNANCE STANCE</span>
                  <p className="font-medium text-ink">Independent Consultancy</p>
                  <p className="text-ink-muted text-[11px] font-light">Zero construction contracting bias</p>
                </div>
                <div className="p-4 border border-border bg-canvas-surface/60 space-y-1">
                  <span className="text-[10px] font-mono text-accent uppercase">STATUTORY JURISDICTION</span>
                  <p className="font-medium text-ink">Federal Republic of Nigeria</p>
                  <p className="text-ink-muted text-[11px] font-light">Corporate Affairs Commission Indexed</p>
                </div>
              </div>

              {/* Management Registry Note Box */}
              <div className="p-4 sm:p-5 border border-border bg-canvas-surface flex items-start space-x-3 text-xs text-ink-muted">
                <FileCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-ink font-semibold uppercase tracking-wider text-[11px] block">
                    Corporate History Notice (Reported 1993 Incorporation):
                  </span>
                  <p className="leading-relaxed">
                    Public regulatory registries reflect an incorporation timeline dating back to 1993. Archival milestones and corporate filings remain subject to executive management confirmation prior to final publication.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 pt-2 lg:pt-0">
              <ArchitecturalImage
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"
                alt="Contemporary architectural cantilever pavilion and geometric concrete structure"
                aspectRatio="4/5"
                figureNumber="FIG. 01"
                caption="Structural cantilever and precision spatial envelope."
              />
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 3: PURPOSE AND PHILOSOPHY */}
      <section className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas-surface">
        <Container size="wide">
          <div className="space-y-12">
            <SectionHeading
              kicker="03 &bull; Purpose &amp; Philosophy"
              title="Built on expertise. Driven by purpose."
              description="Our guiding purpose ensures that every calculation, drawing, and cost model serves structural safety, environmental resilience, and client fiscal security."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Purpose Card */}
              <div className="p-8 sm:p-10 border border-border bg-canvas flex flex-col justify-between space-y-6 group hover:border-accent transition-colors duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold">
                      // CORE PURPOSE
                    </span>
                    <Target className="w-5 h-5 text-accent stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink">
                    Technical Excellence in the Built Environment
                  </h3>
                  <p className="text-sm text-ink-muted font-light leading-relaxed font-sans">
                    To deliver uncompromised engineering verification, climate-adapted architectural planning, and fiduciary cost control across Nigeria. We operate as an objective technical partner safeguarding investments against structural vulnerabilities and costly downstream redesigns.
                  </p>
                </div>
                <div className="pt-4 border-t border-border flex items-center space-x-2 text-xs font-mono text-ink-muted">
                  <span className="w-1.5 h-1.5 bg-accent" />
                  <span>INDEPENDENT TECHNICAL GOVERNANCE</span>
                </div>
              </div>

              {/* Philosophy Card */}
              <div className="p-8 sm:p-10 border border-border bg-canvas flex flex-col justify-between space-y-6 group hover:border-accent transition-colors duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold">
                      // PRACTICE PHILOSOPHY
                    </span>
                    <Compass className="w-5 h-5 text-accent stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink">
                    Longevity Through Disciplined Coordination
                  </h3>
                  <p className="text-sm text-ink-muted font-light leading-relaxed font-sans">
                    True sustainability is built on permanence. We design and evaluate structures to withstand environmental loads and tropical weathering over generations, integrating geotechnical realities with statutory Nigerian building regulations.
                  </p>
                </div>
                <div className="pt-4 border-t border-border flex items-center space-x-2 text-xs font-mono text-ink-muted">
                  <span className="w-1.5 h-1.5 bg-accent" />
                  <span>STRUCTURAL RESILIENCE &bull; GENERATIONAL STABILITY</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 4: APPROACH TO ENGINEERING AND CONSULTANCY (4-STEP PROCESS) */}
      <section className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas">
        <Container size="wide">
          <div className="space-y-12 sm:space-y-16">
            <SectionHeading
              kicker="04 &bull; Professional Approach"
              title="Thoughtful planning. Precise execution."
              description="Our 4-step delivery framework ensures coordination, quality control, and accountability at every stage of the project life cycle."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border">
              {[
                {
                  step: '01',
                  name: 'Understand',
                  icon: Search,
                  summary: 'Scoping & Constraints',
                  desc: 'Comprehensive appraisal of site conditions, geotechnical parameters, regulatory statutory requirements, and client brief.',
                },
                {
                  step: '02',
                  name: 'Plan',
                  icon: Compass,
                  summary: 'Strategy & Synchronization',
                  desc: 'Aligning structural load paths, architectural volume, and elemental cost baselines to prevent design conflicts.',
                },
                {
                  step: '03',
                  name: 'Develop',
                  icon: PenTool,
                  summary: 'Calculations & Documentation',
                  desc: 'Producing finite element models, structural drawings, and Bills of Quantities adhering strictly to Nigerian Building Codes and Eurocodes.',
                },
                {
                  step: '04',
                  name: 'Deliver',
                  icon: CheckCircle2,
                  summary: 'Supervision & Commissioning',
                  desc: 'Conducting site technical inspections, verifying structural placements, and ensuring compliant handover.',
                },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.step}
                    className="p-6 sm:p-8 border-b sm:border-r border-border bg-white hover:bg-canvas-surface transition-colors duration-200 flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-accent font-semibold tracking-wider">
                          {item.step}
                        </span>
                        <IconComponent className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
                        {item.name}
                      </h3>
                      <span className="text-[11px] font-mono uppercase text-ink-muted block">
                        {item.summary}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 5: VALUES */}
      <section className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas-dark text-canvas">
        <Container size="wide">
          <div className="space-y-12">
            <SectionHeading
              invert
              kicker="05 &bull; Institutional Values"
              title="The Principles That Guide Every Decision"
              description="A serious corporate identity rooted in technical competence, professional ethics, and commercial discipline."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border-dark">
              {[
                {
                  title: 'Technical Precision',
                  icon: Target,
                  desc: 'Applying exact mathematical models, load testing, and statutory codes to ensure structural safety is verified empirically.',
                },
                {
                  title: 'Professional Integrity',
                  icon: ShieldCheck,
                  desc: 'Maintaining strict independence from construction contractors to provide unbiased advice that protects client capital.',
                },
                {
                  title: 'Multidisciplinary Coordination',
                  icon: GitCommit,
                  desc: 'Fostering close daily collaboration between structural engineers, architectural designers, and quantity surveyors.',
                },
                {
                  title: 'Responsible Stewardship',
                  icon: Scale,
                  desc: 'Upholding fiduciary diligence, environmental awareness, and structural longevity for investors and communities.',
                },
              ].map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={val.title}
                    className="p-6 sm:p-8 border-b sm:border-r border-border-dark bg-[#282822] hover:bg-[#2F2F27] transition-colors duration-200 flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-accent">0{idx + 1}</span>
                        <IconComponent className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                        {val.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-light/75 leading-relaxed font-sans">
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 6: CLOSING CONTACT CTA */}
      <section className="py-16 sm:py-24 bg-canvas border-b border-border">
        <Container size="narrow">
          <div className="border border-border bg-white p-8 sm:p-12 text-center space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-architectural text-accent font-semibold block">
              06 &bull; Technical Consultation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ink">
              Have a project in mind?
            </h2>
            <p className="text-sm sm:text-base text-ink-muted font-sans max-w-lg mx-auto leading-relaxed">
              Start a conversation with our engineering, architectural, and cost consultancy team.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/contact">
                <Button variant="primary" size="md">
                  <span>Get in Touch</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="md">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </AppLayout>
  );
};

export default AboutPage;
