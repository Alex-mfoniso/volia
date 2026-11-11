import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BuildingModel } from './BuildingModel';
import { SceneLighting } from './SceneLighting';
import { CameraControls } from './CameraControls';
import { ModelLoadingState } from './ModelLoadingState';
import { ModelFallback } from './ModelFallback';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { Container } from '@/components/ui/Container';
import {
  Layers,
  Info,
  RotateCcw,
  Eye,
  EyeOff,
  Table,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { STRUCTURAL_COMPONENTS } from '@/data/threeData';
import type { StructuralLayerId } from '@/types/three';

export interface ExplodedStructureProps {
  className?: string;
}

/**
 * ExplodedStructure:
 * Advanced interactive structural assembly dissection for VOLIA NIG LTD.
 * Demonstrates the 6 fundamental layers of architectural engineering:
 * Foundation, Columns, Beams, Slabs, Walls/Envelope, and Roof.
 * Supports dynamic explosion displacement, layer raycasting, isolated inspection,
 * and an accessible non-3D specification matrix.
 */
export const ExplodedStructure: React.FC<ExplodedStructureProps> = ({ className }) => {
  const { isSupported } = useWebGLSupport();

  // 3D Model States
  const [explodedFactor, setExplodedFactor] = useState<number>(0.0);
  const [selectedLayerId, setSelectedLayerId] = useState<StructuralLayerId | null>(null);
  const [isolatedLayerId, setIsolatedLayerId] = useState<StructuralLayerId | null>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<StructuralLayerId | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'table'>('3d');

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const selectedComponent =
    STRUCTURAL_COMPONENTS.find((c) => c.id === selectedLayerId) || null;

  // Toggle between fully assembled and exploded view
  const setExplodedState = (explode: boolean) => {
    setExplodedFactor(explode ? 0.75 : 0.0);
  };

  // Reset entire model: camera, selection, isolation, and explosion factor
  const handleResetAll = () => {
    setExplodedFactor(0.0);
    setSelectedLayerId(null);
    setIsolatedLayerId(null);
    if (controlsRef.current) {
      controlsRef.current.object.position.set(14, 9, 14);
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  };

  // Select or toggle a component layer
  const handleSelectLayer = (id: StructuralLayerId) => {
    if (selectedLayerId === id) {
      // Deselect if already active
      setSelectedLayerId(null);
      if (isolatedLayerId === id) {
        setIsolatedLayerId(null);
      }
    } else {
      setSelectedLayerId(id);
      // If currently fully assembled, gently separate components so the chosen layer stands out
      if (explodedFactor === 0) {
        setExplodedFactor(0.5);
      }
    }
  };

  // Isolate or restore component view
  const handleToggleIsolation = (id: StructuralLayerId) => {
    if (isolatedLayerId === id) {
      setIsolatedLayerId(null);
    } else {
      setIsolatedLayerId(id);
      setSelectedLayerId(id);
    }
  };

  return (
    <section
      id="structural-model"
      className={cn('py-14 sm:py-20 lg:py-24 border-b border-border bg-canvas overflow-hidden', className)}
    >
      <Container size="wide">
        <div className="space-y-8 sm:space-y-12">
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-border pb-6 sm:pb-8">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-accent font-bold px-2.5 py-1 border border-border bg-canvas-surface">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <span>STRUCTURAL ENGINEERING DISSECTION // 3D EXPLODED MODEL</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink font-normal leading-[1.12] tracking-tight">
                Understanding what<br />
                <span className="italic font-light text-ink/90">holds everything together.</span>
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end space-y-3">
              <p className="text-xs sm:text-sm text-ink-muted font-light leading-relaxed">
                Interact with our 3D structural model to examine how foundation piling, post-tensioned slabs, shear cores, and cantilevered canopies unite to create durable built environments.
              </p>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-ink-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>GENERAL PEDAGOGICAL MODEL &bull; 6 IDENTIFIABLE LAYERS</span>
              </div>
            </div>
          </div>

          {/* Mode Switcher: 3D Interactive Model vs. Non-3D Accessible Specification Matrix */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2 text-ink-muted">
              <span className="text-[10px] uppercase tracking-wider hidden sm:inline">VIEWPORT MODE:</span>
              <span className="text-[10px] text-accent font-semibold">
                {viewMode === '3d' ? '3D Spatial Exploration' : 'Non-3D Accessible Specification'}
              </span>
            </div>

            <div className="bg-canvas-surface border border-border p-1 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                aria-pressed={viewMode === '3d'}
                className={cn(
                  'px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-colors',
                  viewMode === '3d'
                    ? 'bg-ink text-canvas font-semibold shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Interactive 3D View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                className={cn(
                  'px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-colors',
                  viewMode === 'table'
                    ? 'bg-ink text-canvas font-semibold shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Specification Matrix (Accessible)</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: INTERACTIVE 3D EXPLODED MODEL */}
          {viewMode === '3d' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left 8 Cols: Interactive 3D Exploded Canvas */}
              <div
                role="region"
                aria-label="Interactive 3D Exploded Structural Model"
                className="lg:col-span-8 relative border border-border bg-canvas-surface/40 h-[480px] sm:h-[540px] lg:h-[620px] overflow-hidden select-none group"
              >
                {!isSupported ? (
                  <ModelFallback
                    message="WebGL hardware acceleration is unavailable on this browser or device. You can explore the complete non-3D Specification Matrix below."
                  />
                ) : (
                  <Suspense fallback={<ModelLoadingState message="Loading Exploded Structural Rig..." subtext="Mounting 6-layer procedural architecture" />}>
                    <Canvas
                      shadows
                      camera={{ position: [14, 9, 14], fov: 42, near: 0.1, far: 100 }}
                      dpr={[1, 1.5]}
                      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    >
                      <SceneLighting enableShadows />

                      <BuildingModel
                        explodedOffset={explodedFactor}
                        highlightedComponent={selectedLayerId}
                        isolatedComponent={isolatedLayerId}
                        onSelectComponent={handleSelectLayer}
                        hoveredComponent={hoveredLayerId}
                        onHoverComponent={setHoveredLayerId}
                      />

                      <CameraControls
                        controlsRef={controlsRef}
                        autoRotate={false}
                        target={[0, 2.0, 0]}
                      />
                    </Canvas>
                  </Suspense>
                )}

                {/* Floating Explode Mode Switcher & Reset Button */}
                <div className="absolute top-3 left-3 right-3 sm:right-auto flex flex-wrap items-center gap-2 z-10">
                  <div className="bg-canvas/95 backdrop-blur-md p-1.5 border border-border flex items-center space-x-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setExplodedState(false)}
                      className={cn(
                        'text-[10px] font-mono uppercase px-3 py-1.5 transition-colors border',
                        explodedFactor === 0
                          ? 'bg-ink text-canvas border-ink font-semibold'
                          : 'bg-canvas text-ink-muted hover:text-ink border-transparent hover:border-border'
                      )}
                    >
                      Assembled
                    </button>
                    <button
                      type="button"
                      onClick={() => setExplodedState(true)}
                      className={cn(
                        'text-[10px] font-mono uppercase px-3 py-1.5 transition-colors border',
                        explodedFactor > 0
                          ? 'bg-ink text-canvas border-ink font-semibold'
                          : 'bg-canvas text-ink-muted hover:text-ink border-transparent hover:border-border'
                      )}
                    >
                      Exploded View
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-3 py-2 bg-canvas/95 backdrop-blur-md text-[10px] font-mono uppercase text-ink hover:text-accent border border-border shadow-sm flex items-center space-x-1.5"
                    title="Reset 3D structure, camera, and isolation"
                    aria-label="Reset Model to default view"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Model</span>
                  </button>
                </div>

                {/* Bottom Explode Slider Bar */}
                <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 bg-canvas/95 backdrop-blur-md p-3 border border-border shadow-sm flex items-center space-x-3 z-10">
                  <span className="text-[10px] font-mono uppercase text-ink-muted tracking-widest shrink-0">
                    Displacement: {Math.round(explodedFactor * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={explodedFactor}
                    onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                    className="w-28 sm:w-40 accent-accent cursor-pointer"
                    aria-label="Explosion displacement slider"
                  />
                </div>

                {/* Top Right Status Indicator: Selected or Isolated */}
                {selectedComponent && (
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
                    {isolatedLayerId === selectedComponent.id && (
                      <span className="bg-ink text-canvas px-2 py-1 text-[9px] font-mono uppercase tracking-widest font-semibold border border-ink">
                        ISOLATED
                      </span>
                    )}
                    <div className="bg-accent text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest font-semibold shadow-sm">
                      {selectedComponent.number} // {selectedComponent.name}
                    </div>
                  </div>
                )}

                {/* Bottom Left Gesture Hint */}
                <div className="absolute bottom-3 left-3 hidden md:flex items-center space-x-2 text-[9px] font-mono text-ink-muted/80 bg-canvas/80 backdrop-blur-sm px-2 py-1 border border-border/50 pointer-events-none">
                  <span>CLICK 3D ELEMENT TO SELECT &bull; DRAG TO ROTATE &bull; SCROLL TO ZOOM</span>
                </div>
              </div>

              {/* Right 4 Cols: Component Matrix & Interactive Deep Inspector */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                <div className="border border-border bg-canvas p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-ink font-semibold block">
                      Select Structural Subsystem
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted">6 LAYERS</span>
                  </div>

                  <div className="space-y-2">
                    {STRUCTURAL_COMPONENTS.map((comp) => {
                      const isSelected = selectedLayerId === comp.id;
                      const isIsolated = isolatedLayerId === comp.id;
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => handleSelectLayer(comp.id)}
                          onMouseEnter={() => setHoveredLayerId(comp.id)}
                          onMouseLeave={() => setHoveredLayerId(null)}
                          className={cn(
                            'w-full p-3 border text-left transition-all duration-200 flex items-start justify-between group',
                            isSelected
                              ? 'border-accent bg-accent/10 ring-1 ring-accent'
                              : 'border-border bg-canvas-surface/40 hover:border-ink hover:bg-canvas'
                          )}
                          aria-pressed={isSelected}
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-accent font-bold block">
                              SUBSYSTEM {comp.number}
                            </span>
                            <span className="text-xs font-sans font-semibold text-ink block">
                              {comp.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0 mt-1">
                            {isIsolated && (
                              <span className="text-[9px] font-mono text-white bg-ink px-1.5 py-0.5 uppercase">
                                Solo
                              </span>
                            )}
                            <span
                              className={cn(
                                'text-[10px] font-mono uppercase px-2 py-0.5 border transition-colors',
                                isSelected
                                  ? 'bg-accent text-white border-accent'
                                  : 'bg-canvas border-border text-ink-muted group-hover:text-ink'
                              )}
                            >
                              {isSelected ? 'Inspecting' : 'Inspect'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Component Technical Dossier Card */}
                <AnimatePresence mode="wait">
                  {selectedComponent ? (
                    <motion.div
                      key={selectedComponent.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="border border-accent/40 bg-canvas p-5 space-y-3.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="text-[10px] font-mono uppercase text-accent font-bold">
                          SPECIFICATION DOSSIER // {selectedComponent.number}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLayerId(null);
                            setIsolatedLayerId(null);
                          }}
                          className="text-[10px] font-mono text-ink-muted hover:text-ink underline"
                        >
                          Clear Selection
                        </button>
                      </div>

                      <div>
                        <h4 className="font-serif text-lg text-ink font-normal">{selectedComponent.name}</h4>
                        <p className="text-[11px] font-mono text-accent">{selectedComponent.subtitle}</p>
                      </div>

                      <p className="text-xs text-ink-muted font-light leading-relaxed">
                        {selectedComponent.functionDescription}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-border text-[11px] font-sans">
                        <div>
                          <span className="text-[10px] font-mono text-ink-muted uppercase block">
                            Governing Standard / Code:
                          </span>
                          <span className="font-medium text-ink">{selectedComponent.engineeringCode}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-ink-muted uppercase block">
                            Primary Materials:
                          </span>
                          <span className="font-medium text-ink">{selectedComponent.materialsUsed}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-ink-muted uppercase block">
                            Load Path Mechanism:
                          </span>
                          <span className="font-medium text-ink">{selectedComponent.loadPath}</span>
                        </div>
                        {selectedComponent.educationalNotes && (
                          <div className="p-2.5 bg-canvas-surface border border-border/70 text-[10px] text-ink-muted leading-relaxed">
                            <strong className="text-ink font-mono uppercase block text-[9px] mb-0.5">
                              Educational Note:
                            </strong>
                            {selectedComponent.educationalNotes}
                          </div>
                        )}
                      </div>

                      {/* Component Isolation Action Button */}
                      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleIsolation(selectedComponent.id)}
                          className={cn(
                            'w-full py-2 px-3 text-[10px] font-mono uppercase tracking-wider border flex items-center justify-center space-x-1.5 transition-colors',
                            isolatedLayerId === selectedComponent.id
                              ? 'bg-ink text-canvas border-ink font-semibold'
                              : 'bg-canvas-surface hover:bg-canvas border-border text-ink'
                          )}
                        >
                          {isolatedLayerId === selectedComponent.id ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Restore All Components</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-accent" />
                              <span>Isolate This Component</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="p-5 border border-dashed border-border text-center bg-canvas-surface/30 space-y-2">
                      <Info className="w-4 h-4 text-accent mx-auto" />
                      <p className="text-xs text-ink font-medium">Click any 3D element or list item to inspect</p>
                      <p className="text-[10px] text-ink-muted font-light leading-relaxed">
                        Examine individual load-bearing members in isolation or displace the structure using the slider.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: NON-3D ACCESSIBLE SPECIFICATION MATRIX */}
          {viewMode === 'table' && (
            <div className="border border-border bg-canvas overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-border bg-canvas-surface/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-lg text-ink font-normal">
                    Complete Structural Subsystem Directory
                  </h3>
                  <p className="text-xs text-ink-muted font-light">
                    Full accessible specification for all 6 conceptual architectural layers.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-semibold">
                  NON-3D ACCESSIBILITY VIEW
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-canvas-surface text-ink-muted text-[10px] font-mono uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="py-3 px-4">Layer</th>
                      <th className="py-3 px-4">Subsystem</th>
                      <th className="py-3 px-4">Description &amp; Role</th>
                      <th className="py-3 px-4">Materials</th>
                      <th className="py-3 px-4">Governing Code</th>
                      <th className="py-3 px-4">Load Path</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {STRUCTURAL_COMPONENTS.map((comp) => (
                      <tr key={comp.id} className="hover:bg-canvas-surface/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-accent font-bold text-[11px] whitespace-nowrap">
                          {comp.number}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-ink whitespace-nowrap">
                          {comp.name}
                          <span className="block text-[10px] text-ink-muted font-mono font-normal">
                            {comp.subtitle}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-ink-muted max-w-xs leading-relaxed">
                          {comp.functionDescription}
                        </td>
                        <td className="py-3.5 px-4 text-ink font-mono text-[11px] whitespace-nowrap">
                          {comp.materialsUsed}
                        </td>
                        <td className="py-3.5 px-4 text-ink-muted font-mono text-[11px] whitespace-nowrap">
                          {comp.engineeringCode}
                        </td>
                        <td className="py-3.5 px-4 text-ink-muted text-[11px] max-w-xs leading-relaxed">
                          {comp.loadPath}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Compliance & Educational Protocol Footnote */}
          <div className="p-4 border border-border bg-canvas-surface/60 flex items-start space-x-3 text-xs text-ink-muted">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Educational Explanations Notice:</strong> The 3D exploded structure and accompanying specifications presented above serve solely as general educational explanations of spatial engineering principles, load transmission mechanics, and statutory building code integration. They are conceptual archetypes and do not represent claims about VOLIA NIG LTD&apos;s specific proprietary project methods.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExplodedStructure;
