import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ArchitectureModel } from './ArchitectureModel';
import { SceneLighting } from './SceneLighting';
import { CameraControls } from './CameraControls';
import { ModelFallback } from './ModelFallback';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { Container } from '@/components/ui/Container';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TRANSFORMATION_STAGES } from '@/data/threeData';

export const BlueprintScene: React.FC = () => {
  const { isSupported } = useWebGLSupport();
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const currentStage = TRANSFORMATION_STAGES[activeStageIndex];

  // Auto-play progression timer
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStageIndex((prev) => (prev + 1) % TRANSFORMATION_STAGES.length);
      }, 3200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStepClick = (index: number) => {
    setActiveStageIndex(index);
    setIsPlaying(false);
  };

  return (
    <section className="py-14 sm:py-20 lg:py-24 border-b border-border bg-canvas-surface/40 overflow-hidden">
      <Container size="wide">
        <div className="space-y-8 sm:space-y-12">
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-border pb-6 sm:pb-8">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-accent font-bold px-2.5 py-1 border border-border bg-canvas">
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span>ARCHITECTURAL METAMORPHOSIS // DESIGN TO EXECUTION</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink font-normal leading-[1.12] tracking-tight">
                From schematic wireframe<br />
                <span className="italic font-light text-ink/90">to enduring physical reality.</span>
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end space-y-3">
              <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed">
                Observe the technical progression from early geometric vector drawings through structural column allocation, slab modeling, and climatic envelope realization.
              </p>
              <div className="text-[10px] font-mono text-ink-muted">
                METHODOLOGY VISUALIZATION &bull; 5-STAGE PROGRESSION
              </div>
            </div>
          </div>

          {/* Interactive Progression Bar (Step Selector) */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3">
            {TRANSFORMATION_STAGES.map((stg, idx) => {
              const isActive = activeStageIndex === idx;
              const isPast = activeStageIndex > idx;
              return (
                <button
                  key={stg.step}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={cn(
                    'p-3 sm:p-3.5 border text-left transition-all duration-200 flex flex-col justify-between space-y-2 select-none min-h-[72px]',
                    isActive
                      ? 'border-ink bg-canvas ring-1 ring-ink shadow-sm'
                      : isPast
                      ? 'border-border bg-canvas/70 text-ink'
                      : 'border-border/60 bg-canvas-surface/30 text-ink-muted hover:border-border'
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={cn(
                        'text-[10px] font-mono uppercase font-bold',
                        isActive ? 'text-accent' : 'text-ink-muted'
                      )}
                    >
                      {stg.code}
                    </span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    ) : isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-ink-muted" />
                    ) : null}
                  </div>
                  <span className="text-xs font-sans font-semibold text-ink line-clamp-1">
                    {stg.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 3D Scene + Stage Narrative Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* 3D Viewport (8 Columns) */}
            <div className="lg:col-span-8 relative border border-border bg-canvas h-[440px] sm:h-[500px] lg:h-[560px] overflow-hidden select-none group">
              {!isSupported ? (
                <ModelFallback message="WebGL acceleration unavailable. Showing schematic progression." isLoading={false} />
              ) : (
                <Suspense fallback={<ModelFallback message="Configuring Transformation Shaders..." />}>
                  <Canvas
                    shadows
                    camera={{ position: [13, 8.5, 13], fov: 42, near: 0.1, far: 100 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, alpha: true }}
                  >
                    <SceneLighting intensity={currentStage.wireframeOnly ? 0.8 : 1.2} enableShadows={!currentStage.wireframeOnly} />

                    <ArchitectureModel
                      wireframe={currentStage.wireframeOnly}
                      opacity={currentStage.opacity}
                    />

                    <CameraControls
                      controlsRef={controlsRef}
                      autoRotate={false}
                      target={[0, 2.0, 0]}
                    />
                  </Canvas>
                </Suspense>
              )}

              {/* Blueprint Grid Overlay (when wireframe mode is active) */}
              {currentStage.wireframeOnly && (
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #25251F 1px, transparent 1px), linear-gradient(to bottom, #25251F 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              )}

              {/* Top Left Stage Badge */}
              <div className="absolute top-3 left-3 bg-canvas/95 backdrop-blur-md px-3 py-1.5 border border-border text-[10px] font-mono uppercase text-ink flex items-center space-x-2 shadow-sm z-10">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>
                  {currentStage.code} // {currentStage.wireframeOnly ? 'SCHEMATIC WIREFRAME' : 'PHYSICAL MATERIALIZATION'}
                </span>
              </div>

              {/* Bottom Right Auto-Play Control Pill */}
              <div className="absolute bottom-3 right-3 bg-canvas/95 backdrop-blur-md p-1.5 border border-border shadow-sm flex items-center space-x-1.5 z-10">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase text-ink hover:text-accent border border-border bg-canvas flex items-center space-x-1"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-accent" />
                      <span>Pause Cycle</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-accent" />
                      <span>Auto Play</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStageIndex(0);
                    setIsPlaying(false);
                  }}
                  className="p-1.5 text-ink hover:text-accent border border-border bg-canvas"
                  title="Restart to Stage 01"
                  aria-label="Restart"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Bottom Left Camera Hint */}
              <div className="absolute bottom-3 left-3 hidden sm:flex text-[9px] font-mono text-ink-muted bg-canvas/80 px-2 py-1 border border-border/50 pointer-events-none">
                <span>INTERACTIVE 3D &bull; DRAG TO ORBIT</span>
              </div>
            </div>

            {/* Stage Narrative Card (4 Columns) */}
            <div className="lg:col-span-4 border border-border bg-canvas p-6 sm:p-7 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-1 border-b border-border pb-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block">
                      {currentStage.code} OF 05
                    </span>
                    <h3 className="font-serif text-2xl text-ink font-normal leading-snug">
                      {currentStage.title}
                    </h3>
                    <p className="text-xs font-mono text-accent">{currentStage.subtitle}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed">
                    {currentStage.description}
                  </p>

                  <div className="p-3.5 border border-border bg-canvas-surface/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-ink font-semibold block">
                      Technical Milestone Output:
                    </span>
                    <p className="text-xs font-mono text-ink-muted">
                      {currentStage.technicalMilestone}
                    </p>
                  </div>

                  {/* Stage Progress Controls */}
                  <div className="pt-2 flex items-center justify-between border-t border-border">
                    <button
                      type="button"
                      disabled={activeStageIndex === 0}
                      onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
                      className="text-xs font-mono uppercase text-ink hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      &larr; Previous Stage
                    </button>

                    <button
                      type="button"
                      disabled={activeStageIndex === TRANSFORMATION_STAGES.length - 1}
                      onClick={() =>
                        setActiveStageIndex((prev) =>
                          Math.min(TRANSFORMATION_STAGES.length - 1, prev + 1)
                        )
                      }
                      className="text-xs font-mono uppercase text-accent font-semibold hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next Stage &rarr;
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BlueprintScene;
