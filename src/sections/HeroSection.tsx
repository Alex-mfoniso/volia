import React, { useState, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ArrowUpRight, Compass, Box, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModelLoadingState } from '@/components/three/ModelLoadingState';
import { cn } from '@/lib/utils';

// Dynamic lazy import to preserve initial page performance
const ArchitecturalHeroScene = React.lazy(
  () => import('@/components/three/ArchitecturalHeroScene')
);

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Subtle image parallax; disabled if user prefers reduced motion
  const imageScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 40]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative pt-24 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 lg:pb-24 border-b border-border bg-canvas overflow-hidden"
    >
      <Container size="wide">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col space-y-8 sm:space-y-12 lg:space-y-14"
        >
          {/* Top Architectural Masthead & Geographic Coordinates */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 bg-accent inline-block shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-sans tracking-architectural uppercase text-ink font-semibold truncate">
                VOLIA NIG LTD &bull; Built-Environment &amp; Engineering Advisory
              </span>
            </div>

            <div className="flex items-center space-x-4 text-[10px] sm:text-[11px] font-mono text-ink-muted">
              <span>ABUJA // LAGOS</span>
              <span>&bull;</span>
              <span>DISCIPLINES: 03</span>
              <span>&bull;</span>
              <span>INCORP. REPORTED 1993</span>
            </div>
          </motion.div>

          {/* Editorial Wordmark, Monumental Headline & Supporting Copy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-end">
            <motion.div variants={fadeUp} className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 border border-border bg-canvas-surface text-[10px] font-mono uppercase text-accent font-semibold">
                <Compass className="w-3 h-3 text-accent" />
                <span>Modern Architectural Consultancy Platform</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-normal tracking-tight text-ink leading-[1.08]">
                Engineering spaces.<br />
                <span className="italic font-light text-ink/90">Shaping possibilities.</span>
              </h1>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="lg:col-span-4 flex flex-col justify-end space-y-5 lg:space-y-6 pt-2 lg:pt-0"
            >
              <p className="font-sans text-sm sm:text-base lg:text-lg text-ink-muted font-light leading-relaxed">
                Engineering and consultancy solutions shaped by thoughtful design, technical understanding and a commitment to quality.
              </p>

              {/* Two Carefully Designed Primary CTAs */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <Button
                  href="/services"
                  variant="primary"
                  size="md"
                  withArrow
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  Explore Our Services
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  Contact Us
                </Button>
              </div>

              {/* Business Development Quick Link */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                <Link
                  to="/project-brief"
                  className="text-ink-muted hover:text-accent transition-colors flex items-center space-x-1"
                >
                  <span>Build Client Project Brief</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/company-profile"
                  className="text-accent hover:underline text-[10px] uppercase font-semibold"
                >
                  Capability PDF &rarr;
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Centerpiece Visual: Interactive 3D Architectural Pavilion vs Photo Mode */}
          <motion.div variants={fadeUp} className="relative pt-2">
            {/* View Mode Switcher Pill */}
            <div className="flex items-center justify-between pb-3 text-xs font-mono">
              <span className="text-ink-muted uppercase tracking-widest text-[10px] hidden sm:inline">
                CENTERPIECE VISUALIZATION:
              </span>

              <div className="bg-canvas-surface border border-border p-1 flex items-center space-x-1 ml-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={cn(
                    'px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-colors',
                    viewMode === '3d'
                      ? 'bg-ink text-canvas font-semibold shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  )}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Interactive 3D Pavilion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={cn(
                    'px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-colors',
                    viewMode === 'photo'
                      ? 'bg-ink text-canvas font-semibold shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  )}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Archival Photography</span>
                </button>
              </div>
            </div>

            {/* Viewport Container */}
            {viewMode === '3d' ? (
              <Suspense
                fallback={
                  <div className="h-[460px] sm:h-[520px] lg:h-[600px] border border-border">
                    <ModelLoadingState message="Initializing 3D Architectural Pavilion..." />
                  </div>
                }
              >
                <ArchitecturalHeroScene heightClass="h-[460px] sm:h-[520px] lg:h-[600px]" />
              </Suspense>
            ) : (
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden border border-border bg-canvas-surface group">
                <motion.img
                  style={{ scale: imageScale, y: imageY }}
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
                  alt="Contemporary architectural cantilever and structural concrete formwork"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-architectural"
                  loading="eager"
                />

                {/* Technical Corner Registration Marks */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/80 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/80 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/80 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/80 pointer-events-none" />

                <div className="absolute bottom-2.5 left-2.5 sm:left-4 sm:bottom-4 bg-canvas/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-ink">
                  ARCHITECTURAL SCALE &bull; SPATIAL PRECISION
                </div>
              </div>
            )}

            {/* Sub-scene Metadata Strip */}
            <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] font-sans text-ink-muted tracking-editorial gap-1.5">
              <span className="font-light">
                <strong className="font-medium text-ink">Fig. 00 // Archetype Specimen</strong> &mdash; Contemporary architectural pavilion featuring post-tensioned cantilever roof and passive envelope <span className="font-mono text-[9px] text-accent/90">(Conceptual Demonstration &bull; Architectural Visualization Study)</span>
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-ink-muted/80 uppercase">
                VOLIA 3D VISUALIZATION ENGINE &bull; REAL-TIME WEBGL
              </span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
