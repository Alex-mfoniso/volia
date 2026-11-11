import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReusableCTA } from '@/components/layout/ReusableCTA';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import { ModelLoadingState } from '@/components/three/ModelLoadingState';
import {
  PROJECT_CATEGORIES,
  PROJECT_CASE_STUDIES,
  type ProjectCategory,
  type ProjectCaseStudy,
} from '@/data/projectsData';
import {
  Info,
  ArrowUpRight,
  Filter,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Layers,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Box,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Lazy import for modal 3D view
const ArchitectureScene = React.lazy(
  () => import('@/components/three/ArchitecturalHeroScene')
);

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState<ProjectCaseStudy | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [modalVisualMode, setModalVisualMode] = useState<'photos' | '3d'>('photos');
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'challenges' | 'stages' | 'technical'>('overview');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Check if a deep-link project ID was provided in query params (e.g. ?case=eng-01)
  useEffect(() => {
    const caseId = searchParams.get('case');
    if (caseId) {
      const match = PROJECT_CASE_STUDIES.find((p) => p.id === caseId || p.slug === caseId);
      if (match) {
        setActiveProject(match);
        setActiveGalleryIndex(0);
      }
    }
  }, [searchParams]);

  // Sync category filter from query params if present (e.g. ?category=Architecture)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && PROJECT_CATEGORIES.includes(cat as any)) {
      setSelectedCategory(cat as any);
    }
  }, [searchParams]);

  // Filter projects by category and search query
  const filteredProjects = PROJECT_CASE_STUDIES.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.typology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.overview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Handle ESC key and scroll locking when case study modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProject) {
        closeProjectModal();
      }
    };

    if (activeProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProject]);

  const openProjectModal = (project: ProjectCaseStudy) => {
    setActiveProject(project);
    setActiveGalleryIndex(0);
    setActiveDetailTab('overview');
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set('case', project.id);
      return updated;
    });
  };

  const closeProjectModal = () => {
    setActiveProject(null);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.delete('case');
      return updated;
    });
  };

  return (
    <AppLayout>
      <SEO
        title="Project Case Studies &amp; Engineering Typologies"
        description="Explore technical case studies spanning structural engineering, low-energy tropical architecture, and quantity surveying cost governance."
        canonicalPath="/projects"
      />

      {/* 1. Page Header */}
      <PageHeader
        kicker="Practice Case Studies &amp; Typologies"
        title="Engineering spaces. Shaping structural possibilities."
        description="An advanced portfolio interface where clients, institutions, and procurement committees can inspect the engineering methods, structural challenges, and execution stages applied across built-environment typologies."
        breadcrumb="PRACTICE // PROJECTS"
      />

      {/* 2. Interactive Project Explorer */}
      <section className="py-12 sm:py-16 lg:py-20 border-b border-border bg-canvas">
        <Container size="wide">
          <div className="space-y-8 sm:space-y-10">
            {/* Compliance Disclaimer Notice */}
            <div className="p-4 sm:p-5 border border-border bg-canvas-surface/80 flex items-start space-x-3 text-xs text-ink-muted">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-ink uppercase tracking-wider text-[11px] block">
                  Illustrative Project Concept Protocol &bull; Prototype Showcase
                </span>
                <p className="leading-relaxed">
                  Every case study presented below is an <strong>ILLUSTRATIVE PROJECT CONCEPT</strong> designed to demonstrate VOLIA NIG LTD&apos;s technical scope, statutory standards, and delivery methodology. Following executive management clearance and client privacy protocols, verified commission retrospectives will replace these demonstration archetypes.
                </p>
              </div>
            </div>

            {/* Controls Bar: Category Filters & Real-Time Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
              {/* Category Filter Tabs */}
              <div className="flex items-center space-x-2 text-xs font-mono text-ink-muted">
                <Filter className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="uppercase tracking-widest text-[10px] hidden sm:inline">DISCIPLINE:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="tablist" aria-label="Project Disciplines">
                {PROJECT_CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  const count =
                    category === 'All'
                      ? PROJECT_CASE_STUDIES.length
                      : PROJECT_CASE_STUDIES.filter((p) => p.category === category).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        'text-xs font-sans tracking-architectural uppercase px-3 py-1.5 sm:px-3.5 sm:py-2 transition-all duration-200 border focus-visible:outline-none flex items-center space-x-1.5 min-h-[38px]',
                        isActive
                          ? 'bg-ink text-canvas border-ink font-medium shadow-sm'
                          : 'bg-canvas text-ink-muted border-border hover:border-ink hover:text-ink'
                      )}
                    >
                      <span>{category}</span>
                      <span className="text-[10px] font-mono opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Interface */}
              <div className="relative w-full lg:w-72">
                <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search case studies..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-sans bg-canvas-surface border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
              <span>
                SHOWING {filteredProjects.length} OF {PROJECT_CASE_STUDIES.length} CASE STUDY SPECIMENS
              </span>
              <span className="text-accent uppercase font-semibold">
                CLICK TO INSPECT FULL TECHNICAL STUDY
              </span>
            </div>

            {/* Projects Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  onClick={() => openProjectModal(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openProjectModal(project);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Explore case study: ${project.title}`}
                  className="group flex flex-col border border-border bg-canvas hover:border-accent transition-all duration-300 cursor-pointer focus-visible:outline-none text-left"
                >
                  {/* Architectural Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-canvas-surface border-b border-border">
                    <img
                      src={project.primaryImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-architectural group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Top Figure Code */}
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-canvas/95 backdrop-blur-sm px-2 sm:px-2.5 py-1 border border-border text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-ink">
                      {project.figure}
                    </div>

                    {/* Bottom Category Tag */}
                    <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-canvas-dark/90 text-white backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-sans tracking-architectural uppercase">
                      {project.category}
                    </div>

                    {/* Prominent Illustrative Concept Stamp */}
                    <div className="absolute top-2.5 right-2.5 bg-accent/90 text-white px-2 py-0.5 text-[8px] font-mono tracking-wider uppercase font-semibold shadow-sm">
                      {project.badge}
                    </div>
                  </div>

                  {/* Editorial Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                        <span className="uppercase font-semibold tracking-widest">{project.typology}</span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-normal text-ink group-hover:text-accent transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-ink-muted leading-relaxed font-light line-clamp-3">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-border">
                      <div className="text-[10px] font-mono text-ink-muted flex flex-col space-y-1">
                        <span className="truncate"><strong>Scale:</strong> {project.scale}</span>
                        <span className="truncate"><strong>Location:</strong> {project.location}</span>
                        <div className="flex items-center gap-1.5 pt-1 text-[9px] uppercase tracking-wider text-accent font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block shrink-0" />
                          <span>Status: {project.verificationStatus.replace('_', ' ')}</span>
                          <span>&bull;</span>
                          <span>{project.projectStatus}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-ink-muted">
                        <span className="text-accent group-hover:underline flex items-center space-x-1">
                          <span>Explore Case Study</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                        <span className="flex items-center space-x-1 text-[10px] uppercase text-accent font-medium bg-canvas-surface px-1.5 py-0.5 border border-border">
                          <Box className="w-3 h-3" />
                          <span>3D Model</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16 border border-border bg-canvas-surface/40 p-8 space-y-4">
                <Compass className="w-8 h-8 text-accent mx-auto" />
                <h4 className="font-serif text-xl text-ink">No matching case study typologies found</h4>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  Try adjusting your search query or selecting &ldquo;All&rdquo; disciplines to explore the full portfolio repository.
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Reset Filter Parameters
                </Button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 3. Advanced Case Study Modal Explorer */}
      <AnimatePresence>
        {activeProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-case-title"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeProjectModal}
              className="fixed inset-0 bg-canvas-dark/80 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Body Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 14 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto bg-canvas border border-border shadow-2xl z-10 flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-canvas sticky top-0 z-20">
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold px-2 py-0.5 border border-border">
                    {activeProject.figure}
                  </span>
                  <span className="text-xs font-sans tracking-architectural uppercase text-ink-muted">
                    {activeProject.category}
                  </span>
                  <span className="hidden md:inline-block text-[9px] font-mono bg-accent/15 text-accent px-2 py-0.5 uppercase font-semibold">
                    {activeProject.badge}
                  </span>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeProjectModal}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ink hover:text-accent border border-border bg-canvas-surface hover:bg-canvas transition-colors focus-visible:outline-none"
                  aria-label="Close project modal"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Case Study Content Body */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-8">
                {/* Visual Banner & Prominent Concept Disclaimer */}
                <div className="border border-accent/40 bg-accent/5 p-3 sm:p-4 flex items-start space-x-3 text-xs">
                  <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-ink leading-relaxed">
                    <strong>ILLUSTRATIVE PROJECT CONCEPT:</strong> This comprehensive case study demonstrates the technical methodology, engineering calculations, and supervisory governance applied by VOLIA NIG LTD. It is an illustrative benchmark pending client clearance of actual completed commissions.
                  </p>
                </div>

                {/* Visual View Mode Selector (2D Photography vs 3D BIM Model) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3 text-xs font-mono">
                  <span className="text-[10px] text-ink-muted uppercase">CASE STUDY VISUALIZATION:</span>
                  <div className="flex items-center space-x-1 bg-canvas-surface p-1 border border-border self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setModalVisualMode('photos')}
                      className={cn(
                        'px-2.5 py-1 text-[10px] font-mono uppercase flex items-center space-x-1.5 transition-colors',
                        modalVisualMode === 'photos'
                          ? 'bg-ink text-canvas font-semibold shadow-sm'
                          : 'text-ink-muted hover:text-ink'
                      )}
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>2D Photography</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalVisualMode('3d')}
                      className={cn(
                        'px-2.5 py-1 text-[10px] font-mono uppercase flex items-center space-x-1.5 transition-colors',
                        modalVisualMode === '3d'
                          ? 'bg-accent text-white font-semibold shadow-sm'
                          : 'text-ink-muted hover:text-ink'
                      )}
                    >
                      <Box className="w-3 h-3" />
                      <span>Interactive 3D BIM Model</span>
                    </button>
                  </div>
                </div>

                {modalVisualMode === '3d' ? (
                  <div className="space-y-2">
                    <Suspense
                      fallback={
                        <div className="h-[380px] sm:h-[460px] lg:h-[500px]">
                          <ModelLoadingState message="Loading 3D BIM Structural Model..." />
                        </div>
                      }
                    >
                      <ArchitectureScene heightClass="h-[380px] sm:h-[460px] lg:h-[500px]" />
                    </Suspense>
                    <div className="text-[9px] font-mono text-ink-muted flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                      <span>ILLUSTRATIVE 3D BIM TYPOLOGY SPECIMEN &bull; REAL-TIME WEBGL</span>
                      <span className="text-accent uppercase font-semibold">
                        Drag to Orbit &bull; Camera Views Available
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Interactive Multi-Image Gallery */
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] overflow-hidden border border-border bg-canvas-surface">
                      <img
                        src={activeProject.galleryImages[activeGalleryIndex]?.url || activeProject.primaryImage}
                        alt={activeProject.galleryImages[activeGalleryIndex]?.alt || activeProject.title}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-canvas/95 backdrop-blur-md p-2.5 sm:p-3 border border-border text-xs text-ink flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-light text-ink">
                          {activeProject.galleryImages[activeGalleryIndex]?.caption}
                        </span>
                        <span className="text-[10px] font-mono text-ink-muted shrink-0 pl-3">
                          FIG {activeGalleryIndex + 1} / {activeProject.galleryImages.length}
                        </span>
                      </div>

                      {/* Gallery Navigation Controls */}
                      {activeProject.galleryImages.length > 1 && (
                        <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveGalleryIndex((prev) =>
                                prev === 0 ? activeProject.galleryImages.length - 1 : prev - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center bg-canvas/90 hover:bg-canvas text-ink border border-border transition-colors"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveGalleryIndex((prev) =>
                                prev === activeProject.galleryImages.length - 1 ? 0 : prev + 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center bg-canvas/90 hover:bg-canvas text-ink border border-border transition-colors"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {activeProject.galleryImages.map((img, idx) => (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={cn(
                            'relative aspect-[16/9] overflow-hidden border transition-all duration-200 text-left',
                            activeGalleryIndex === idx
                              ? 'border-accent ring-1 ring-accent'
                              : 'border-border opacity-70 hover:opacity-100'
                          )}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case Study Title & Context Metrics */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-accent font-semibold block">
                      {activeProject.typology}
                    </span>
                    <h2
                      id="modal-case-title"
                      className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink font-normal leading-tight"
                    >
                      {activeProject.title}
                    </h2>
                    <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed font-sans">
                      {activeProject.subtitle}
                    </p>
                  </div>

                  {/* Context Metrics Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-canvas-surface border border-border text-xs font-sans">
                    <div>
                      <span className="text-[10px] font-mono text-ink-muted uppercase block">Location Benchmark:</span>
                      <span className="font-medium text-ink mt-0.5 block">{activeProject.location}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-ink-muted uppercase block">Scale / Scope:</span>
                      <span className="font-medium text-ink mt-0.5 block">{activeProject.scale}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-ink-muted uppercase block">Projected Lifecycle:</span>
                      <span className="font-medium text-ink mt-0.5 block">{activeProject.timeframe}</span>
                    </div>
                  </div>
                </div>

                {/* Case Study Section Tabs */}
                <div className="border-b border-border flex flex-wrap gap-2 pt-2">
                  {[
                    { id: 'overview', label: '1. Overview & Objectives', icon: Compass },
                    { id: 'challenges', label: '2. Challenges & Approach', icon: AlertTriangle },
                    { id: 'stages', label: '3. Lifecycle Stages', icon: Layers },
                    { id: 'technical', label: '4. Technical Considerations', icon: Sliders },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeDetailTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveDetailTab(tab.id as any)}
                        className={cn(
                          'text-xs font-sans tracking-architectural uppercase px-3.5 py-2.5 border-b-2 transition-all flex items-center space-x-2 -mb-[2px] focus-visible:outline-none min-h-[44px]',
                          isActive
                            ? 'border-accent text-ink font-semibold bg-canvas-surface/50'
                            : 'border-transparent text-ink-muted hover:text-ink'
                        )}
                      >
                        <Icon className="w-3.5 h-3.5 text-accent" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab 1: Overview & Objectives */}
                {activeDetailTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-serif text-xl sm:text-2xl text-ink">Project Overview</h3>
                      <p className="text-sm text-ink-muted font-light leading-relaxed">
                        {activeProject.overview}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <h3 className="font-serif text-xl sm:text-2xl text-ink">Primary Technical Objectives</h3>
                      <div className="grid grid-cols-1 gap-2.5">
                        {activeProject.objectives.map((obj, i) => (
                          <div
                            key={i}
                            className="p-3 border border-border bg-canvas-surface/50 flex items-start space-x-3 text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span className="text-ink leading-relaxed">{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Challenges & Approach */}
                {activeDetailTab === 'challenges' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-serif text-xl sm:text-2xl text-ink">Engineering &amp; Site Challenges</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {activeProject.challenges.map((ch, i) => (
                          <div
                            key={i}
                            className="p-4 border border-border bg-canvas-surface/60 flex items-start space-x-3 text-xs"
                          >
                            <span className="text-[10px] font-mono font-bold text-accent px-1.5 py-0.5 border border-accent/40 shrink-0">
                              CHAL {i + 1}
                            </span>
                            <span className="text-ink leading-relaxed">{ch}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <h3 className="font-serif text-xl sm:text-2xl text-ink">Consultancy &amp; Strategic Approach</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {activeProject.approach.map((app, i) => (
                          <div
                            key={i}
                            className="p-4 border border-border bg-canvas flex items-start space-x-3 text-xs"
                          >
                            <span className="text-[10px] font-mono font-bold text-ink px-1.5 py-0.5 border border-border bg-canvas-surface shrink-0">
                              SOL {i + 1}
                            </span>
                            <span className="text-ink-muted leading-relaxed">{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Lifecycle Stages */}
                {activeDetailTab === 'stages' && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-xl sm:text-2xl text-ink">Phased Delivery Stages</h3>
                    <div className="space-y-4">
                      {activeProject.stages.map((stg) => (
                        <div key={stg.number} className="border border-border p-4 sm:p-5 bg-canvas-surface/40 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border pb-2">
                            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold">
                              STAGE {stg.number} // {stg.phase}
                            </span>
                            <span className="font-serif text-base text-ink font-medium">{stg.title}</span>
                          </div>
                          <p className="text-xs text-ink-muted leading-relaxed font-light">{stg.description}</p>
                          <div className="pt-2">
                            <span className="text-[10px] font-mono uppercase text-ink block mb-1 font-semibold">
                              Key Stage Deliverables:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {stg.deliverables.map((d, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono bg-canvas border border-border px-2 py-0.5 text-ink-muted"
                                >
                                  &bull; {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Technical Considerations */}
                {activeDetailTab === 'technical' && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-xl sm:text-2xl text-ink">Technical Specifications &amp; Structural Codes</h3>
                    <div className="border border-border overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-canvas-surface border-b border-border text-[10px] font-mono uppercase text-ink">
                          <tr>
                            <th className="p-3 border-r border-border">Parameter</th>
                            <th className="p-3 border-r border-border">Engineering Specification</th>
                            <th className="p-3">Advisory Rationale</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {activeProject.technicalConsiderations.map((tc, idx) => (
                            <tr key={idx} className="hover:bg-canvas-surface/40">
                              <td className="p-3 border-r border-border font-medium text-ink whitespace-nowrap">
                                {tc.parameter}
                              </td>
                              <td className="p-3 border-r border-border text-ink-muted font-mono text-[11px]">
                                {tc.specification}
                              </td>
                              <td className="p-3 text-ink-muted leading-relaxed">{tc.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Modal Footer Direct Action */}
                <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-[10px] font-mono text-ink-muted uppercase">
                    PROTOTYPE CASE STUDY ARCHETYPE &bull; VOLIA ENGINEERING REPOSITORY
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Button
                      href={`/services/consultation?projectType=${encodeURIComponent(activeProject.category)}`}
                      variant="outline"
                      size="md"
                      className="w-full sm:w-auto min-h-[44px]"
                      onClick={closeProjectModal}
                    >
                      Guided Service Discovery
                    </Button>
                    <Button
                      href={`/project-brief?projectType=${encodeURIComponent(
                        activeProject.category
                      )}&projectName=${encodeURIComponent(activeProject.title)}`}
                      variant="primary"
                      size="md"
                      withArrow
                      className="w-full sm:w-auto min-h-[44px]"
                      onClick={closeProjectModal}
                    >
                      Initiate Project Brief
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Reusable Call to Action */}
      <ReusableCTA
        title="Planning a development of similar complexity?"
        description="Our consultancy provides technical feasibility reviews, structural validation, and quantity surveying to ensure your project achieves its spatial and financial objectives."
      />
    </AppLayout>
  );
};
