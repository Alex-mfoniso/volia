import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Briefcase,
  ArrowRight,
  Sparkles,
  Info,
  RotateCcw,
  Compass,
} from 'lucide-react';
import type { JobPosting } from '@/types/recruitment';
import { jobService } from '@/services/jobService';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/feedback/LoadingSkeleton';
import { JobCard } from '@/components/careers/JobCard';
import { SEO } from '@/components/common/SEO';

export const CareersPage: React.FC = () => {
  const [allJobs, setAllJobs] = useState<JobPosting[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedArrangement, setSelectedArrangement] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'closing_soon' | 'title'>('newest');

  // Load jobs on mount
  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const [jobsData, featuredData] = await Promise.all([
          jobService.getPublicJobs(),
          jobService.getFeaturedJobs(),
        ]);
        if (mounted) {
          setAllJobs(jobsData);
          setFeaturedJobs(featuredData);
        }
      } catch (err) {
        console.error('Failed to load career listings', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchJobs();
    return () => {
      mounted = false;
    };
  }, []);

  const departmentOptions = ['All', 'Engineering', 'Architecture', 'Quantity Surveying'];
  const employmentTypeOptions = [
    { label: 'All Types', value: 'All' },
    { label: 'Full-Time', value: 'full_time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Consultancy', value: 'consultancy' },
  ];
  const workArrangementOptions = [
    { label: 'All Arrangements', value: 'All' },
    { label: 'On-Site', value: 'on_site' },
    { label: 'Hybrid', value: 'hybrid' },
    { label: 'Remote', value: 'remote' },
  ];
  const locationOptions = ['All', 'Abuja', 'Lagos', 'Port Harcourt'];

  // Client-side filtering and sorting
  const filteredJobs = useMemo(() => {
    let list = [...allJobs];

    if (selectedDept !== 'All') {
      list = list.filter((j) => j.department === selectedDept);
    }

    if (selectedType !== 'All') {
      list = list.filter((j) => (j.employmentType || j.type) === selectedType);
    }

    if (selectedArrangement !== 'All') {
      list = list.filter((j) => j.workArrangement === selectedArrangement);
    }

    if (selectedLocation !== 'All') {
      list = list.filter((j) => j.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((j) => {
        const matchTitle = j.title.toLowerCase().includes(q);
        const matchLoc = j.location.toLowerCase().includes(q);
        const matchDesc = (j.description || j.overview || '').toLowerCase().includes(q);
        const matchSkills = (j.skills || []).some((s) => s.toLowerCase().includes(q));
        return matchTitle || matchLoc || matchDesc || matchSkills;
      });
    }

    if (sortBy === 'closing_soon') {
      list.sort((a, b) => {
        if (!a.closingDate) return 1;
        if (!b.closingDate) return -1;
        return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
      });
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => {
        const dateA = a.publicationDate || a.publishedAt || a.createdAt;
        const dateB = b.publicationDate || b.publishedAt || b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    }

    return list;
  }, [allJobs, selectedDept, selectedType, selectedArrangement, selectedLocation, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedDept !== 'All' ||
    selectedType !== 'All' ||
    selectedArrangement !== 'All' ||
    selectedLocation !== 'All' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'newest';

  const resetFilters = () => {
    setSelectedDept('All');
    setSelectedType('All');
    setSelectedArrangement('All');
    setSelectedLocation('All');
    setSearchQuery('');
    setSortBy('newest');
  };

  const scrollToOpenings = () => {
    const el = document.getElementById('openings');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO
        title="Careers &amp; Practice Opportunities | VOLIA NIG LTD"
        description="Discover opportunities to contribute your expertise, develop your skills and grow within an engineering and consultancy environment at VOLIA NIG LTD."
      />

      {/* Demonstration Data Transparency Notice */}
      <div className="bg-canvas-surface border-b border-border py-2 px-4 text-center">
        <Container size="wide">
          <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-ink-muted">
            <Info className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>
              <strong>Fictional Demonstration Notice:</strong> Vacancies published below represent structural archetypes designed for recruitment portal testing. They do not constitute active commercial job offers from VOLIA NIG LTD.
            </span>
          </div>
        </Container>
      </div>

      {/* =====================================================================
          SECTION A: HERO
          ===================================================================== */}
      <section className="relative pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 border-b border-border bg-canvas overflow-hidden">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 border border-border bg-canvas-surface text-[10px] font-mono uppercase tracking-architectural text-accent font-semibold">
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span>Careers Portal &bull; Practice Recruitment</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-ink leading-[1.1] tracking-tight">
                Build your career with VOLIA.
              </h1>

              <p className="font-sans text-base sm:text-lg text-ink-muted font-light leading-relaxed max-w-xl">
                Discover opportunities to contribute your expertise, develop your skills and grow within an engineering and consultancy environment.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={scrollToOpenings}
                  className="min-h-[46px] px-7"
                >
                  <span>Explore Opportunities</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Link to="/about">
                  <Button
                    variant="outline"
                    size="md"
                    className="min-h-[46px] px-6 w-full sm:w-auto"
                  >
                    Learn About VOLIA
                  </Button>
                </Link>
              </div>

              {/* Geographic & Discipline Tags */}
              <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-4 text-xs font-mono text-ink-muted">
                <span>PRACTICE DISCIPLINES: 03</span>
                <span>&bull;</span>
                <span>ABUJA // LAGOS</span>
                <span>&bull;</span>
                <span>STANDARDS: COREN &bull; ARCON &bull; QSRBN</span>
              </div>
            </div>

            {/* Right Column: High Quality Architectural Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden border border-border bg-canvas-surface shadow-sm group">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85"
                  alt="Architectural drafting and engineering consultation workstation"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-architectural"
                />

                {/* Technical Corner Registration Marks */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/80 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/80 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/80 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/80 pointer-events-none" />

                <div className="absolute bottom-3 left-3 bg-canvas/95 backdrop-blur-md px-3 py-1 border border-border text-[9px] font-mono uppercase tracking-widest text-ink">
                  DISCIPLINED INQUIRY &bull; TECHNICAL RIGOR
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION B: INTRODUCTION
          ===================================================================== */}
      <section className="py-14 sm:py-20 border-b border-border bg-canvas-surface/50">
        <Container size="wide">
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
              01 // Recruitment Overview
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink font-normal leading-snug">
              Your next opportunity starts here.
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-muted font-light leading-relaxed">
              Explore available positions and submit applications directly through our online careers portal. We welcome inquiries from qualified engineering consultants, architectural designers, and quantity surveyors seeking to engage on rigorous built-environment commissions.
            </p>
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION C: FEATURED OPPORTUNITIES
          ===================================================================== */}
      {featuredJobs.length > 0 && (
        <section className="py-14 sm:py-20 border-b border-border bg-canvas">
          <Container size="wide">
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-accent uppercase tracking-widest font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>02 // Key Mandates</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                    Featured Opportunities
                  </h2>
                </div>
                <p className="text-xs text-ink-muted font-mono uppercase">
                  {featuredJobs.length} Priority Opening{featuredJobs.length > 1 ? 's' : ''} Listed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredJobs.map((job) => (
                  <JobCard key={job.id} job={job} featured={true} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* =====================================================================
          SECTION D: ALL OPPORTUNITIES & FILTER INTERFACE
          ===================================================================== */}
      <section id="openings" className="py-16 sm:py-24 border-b border-border bg-canvas scroll-mt-12">
        <Container size="wide">
          <div className="space-y-8">
            {/* Header & Result Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block mb-1">
                  03 // Vacancy Catalog
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink font-normal">
                  All Opportunities
                </h2>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono text-ink-muted">
                <span className="px-2.5 py-1 bg-canvas-surface border border-border text-ink font-semibold">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Vacancy' : 'Vacancies'} Found
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-canvas-surface border border-border p-4 sm:p-6 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
                {/* Search Bar */}
                <div className="md:col-span-5 relative">
                  <input
                    type="text"
                    placeholder="Search by job title, location, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-border pl-9 pr-3 py-2 text-xs sm:text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-accent font-sans transition-colors"
                    aria-label="Search job listings"
                  />
                  <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3 pointer-events-none" />
                </div>

                {/* Department Filter */}
                <div className="md:col-span-3">
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-white border border-border px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-accent font-sans transition-colors cursor-pointer"
                    aria-label="Filter by department"
                  >
                    {departmentOptions.map((d) => (
                      <option key={d} value={d}>
                        {d === 'All' ? 'All Departments' : d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="md:col-span-2">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-white border border-border px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-accent font-sans transition-colors cursor-pointer"
                    aria-label="Filter by location"
                  >
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc === 'All' ? 'All Locations' : loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Option */}
                <div className="md:col-span-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-white border border-border px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-accent font-sans transition-colors cursor-pointer"
                    aria-label="Sort job listings"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="closing_soon">Sort: Closing Soon</option>
                    <option value="title">Sort: Title (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Secondary Filter Row: Employment Type & Work Arrangement */}
              <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-mono uppercase text-ink-muted mr-1">Type:</span>
                    {employmentTypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedType(opt.value)}
                        className={`px-2.5 py-1 text-[11px] font-mono uppercase transition-colors border ${
                          selectedType === opt.value
                            ? 'bg-ink text-canvas border-ink font-semibold'
                            : 'bg-white text-ink-muted hover:text-ink border-border'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1 pl-2 border-l border-border/80">
                    <span className="text-[10px] font-mono uppercase text-ink-muted mr-1">Arrangement:</span>
                    {workArrangementOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedArrangement(opt.value)}
                        className={`px-2.5 py-1 text-[11px] font-mono uppercase transition-colors border ${
                          selectedArrangement === opt.value
                            ? 'bg-ink text-canvas border-ink font-semibold'
                            : 'bg-white text-ink-muted hover:text-ink border-border'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center space-x-1 text-accent hover:underline text-[11px] font-mono uppercase font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear All Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Job Listings Grid */}
            {isLoading ? (
              <div className="space-y-4">
                <LoadingSkeleton height={180} count={3} />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="border border-border p-12 sm:p-16 text-center bg-white space-y-4">
                <div className="w-12 h-12 bg-canvas-surface flex items-center justify-center text-accent mx-auto border border-border">
                  <Briefcase className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-lg font-serif font-medium text-ink">
                    No active positions match your criteria
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed font-sans">
                    Try adjusting your department, location, or keyword search parameters, or reset your filters to view all currently published opportunities.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-2"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION E: RECRUITMENT PROCESS (5 STAGES)
          ===================================================================== */}
      <section className="py-16 sm:py-24 border-b border-border bg-canvas-surface/60">
        <Container size="wide">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                04 // Candidate Journey
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink font-normal">
                Recruitment Process
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed">
                A structured, transparent review pipeline designed to evaluate technical precision and professional alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  step: '01',
                  title: 'Explore Opportunities',
                  description:
                    'Browse active vacancies across engineering, architecture, and quantity surveying to identify roles aligned with your experience.',
                },
                {
                  step: '02',
                  title: 'Submit Application',
                  description:
                    'Complete the online application form and upload your resume, cover letter, and statutory credentials.',
                },
                {
                  step: '03',
                  title: 'Application Review',
                  description:
                    'Our discipline leads conduct a comprehensive review of your technical background, credentials, and portfolio.',
                },
                {
                  step: '04',
                  title: 'Interview, Where Applicable',
                  description:
                    'Shortlisted candidates are invited for technical panel discussions and portfolio presentations. (Not all applicants are guaranteed an interview.)',
                },
                {
                  step: '05',
                  title: 'Recruitment Decision',
                  description:
                    'Formal appointment decisions are finalized and communicated alongside engagement terms.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-white border border-border p-6 space-y-3 relative group hover:border-ink transition-colors"
                >
                  <span className="font-mono text-xl text-accent font-light block">
                    {item.step}.
                  </span>
                  <h3 className="font-serif text-base font-normal text-ink">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed font-sans font-light">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Statutory Disclaimer on Interviews */}
            <div className="p-4 border border-border bg-white text-xs text-ink-muted flex items-start space-x-3">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Fair Recruitment Protocol:</strong> Submission of an application initiates preliminary administrative screening. Due to volume and project timelines, interviews are scheduled on a selective basis for candidates meeting statutory qualifications and active project requirements.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION F: CLOSING CTA
          ===================================================================== */}
      <section className="py-20 sm:py-28 bg-canvas-dark text-canvas border-b border-border-dark relative overflow-hidden">
        <Container size="wide">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-architectural text-accent font-semibold block">
              Join Our Engineering &amp; Consultancy Environment
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
              Ready for your next challenge?
            </h2>

            <p className="font-sans text-sm sm:text-base text-ink-light/80 font-light leading-relaxed max-w-xl mx-auto">
              Contribute your engineering, architectural, or quantity surveying capabilities to defining commissions across Nigeria.
            </p>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={scrollToOpenings}
                className="min-h-[46px] px-8 bg-accent hover:bg-accent-hover text-white border-transparent"
              >
                <span>View Open Positions</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default CareersPage;
