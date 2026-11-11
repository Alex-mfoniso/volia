import React from 'react';
import { RotateCcw, Compass, Plus, Minus, Eye, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CameraPreset, PresetConfig } from '@/types/three';

export interface ModelControlsProps {
  activePreset?: CameraPreset;
  presets?: Record<CameraPreset, PresetConfig>;
  onSelectPreset?: (preset: CameraPreset) => void;
  isWireframe?: boolean;
  onToggleWireframe?: () => void;
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
  onResetCamera?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  showPresets?: boolean;
  showZoomButtons?: boolean;
  instructionText?: string;
  badgeLabel?: string;
  className?: string;
}

/**
 * ModelControls:
 * Reusable architectural viewport controls overlay.
 * Provides accessible camera buttons, wireframe toggles, viewpoint presets,
 * and interaction status indicators.
 */
export const ModelControls: React.FC<ModelControlsProps> = ({
  activePreset = 'perspective',
  presets,
  onSelectPreset,
  isWireframe = false,
  onToggleWireframe,
  autoRotate = false,
  onToggleAutoRotate,
  onResetCamera,
  onZoomIn,
  onZoomOut,
  showPresets = true,
  showZoomButtons = true,
  instructionText = 'DRAG TO ROTATE &bull; SCROLL TO ZOOM',
  badgeLabel = 'PAVILION ARCHETYPE &bull; REAL-TIME 3D',
}) => {
  return (
    <>
      {/* Top Left Badge & Status */}
      <div className="absolute top-3 left-3 flex flex-col space-y-1 pointer-events-none z-10">
        <div className="bg-canvas/95 backdrop-blur-md px-2.5 py-1 border border-border text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-ink flex items-center space-x-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>{badgeLabel}</span>
        </div>
        <span className="text-[8px] font-mono text-ink-muted bg-canvas/80 px-2 py-0.5 border border-border/60 self-start">
          CANTILEVER CANOPY // REINFORCED CONCRETE
        </span>
      </div>

      {/* Top Right Quick Toggles */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
        {onToggleWireframe && (
          <button
            type="button"
            onClick={onToggleWireframe}
            aria-label={isWireframe ? 'Switch to Shaded Material' : 'Switch to Blueprint Wireframe'}
            className={cn(
              'px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors shadow-sm flex items-center space-x-1',
              isWireframe
                ? 'bg-ink text-canvas border-ink'
                : 'bg-canvas/90 backdrop-blur-md text-ink hover:text-accent border-border hover:bg-canvas'
            )}
            title="Toggle blueprint wireframe mode"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">{isWireframe ? 'Shaded View' : 'Wireframe'}</span>
          </button>
        )}

        {onToggleAutoRotate && (
          <button
            type="button"
            onClick={onToggleAutoRotate}
            aria-label={autoRotate ? 'Pause rotation' : 'Start rotation'}
            className={cn(
              'px-2 py-1 text-[10px] font-mono uppercase border transition-colors shadow-sm flex items-center space-x-1',
              autoRotate
                ? 'bg-accent/15 text-accent border-accent'
                : 'bg-canvas/90 backdrop-blur-md text-ink-muted border-border hover:bg-canvas'
            )}
            title="Toggle continuous rotation"
          >
            <Eye className="w-3 h-3" />
            <span>{autoRotate ? 'Orbiting' : 'Paused'}</span>
          </button>
        )}

        {showZoomButtons && onZoomIn && onZoomOut && (
          <div className="hidden sm:flex items-center bg-canvas/90 backdrop-blur-md border border-border shadow-sm">
            <button
              type="button"
              onClick={onZoomIn}
              aria-label="Zoom in camera"
              className="p-1 hover:text-accent text-ink transition-colors border-r border-border"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onZoomOut}
              aria-label="Zoom out camera"
              className="p-1 hover:text-accent text-ink transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {onResetCamera && (
          <button
            type="button"
            onClick={onResetCamera}
            className="p-1.5 bg-canvas/90 backdrop-blur-md text-ink hover:text-accent border border-border hover:bg-canvas transition-colors shadow-sm"
            title="Reset camera viewpoint"
            aria-label="Reset camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bottom Floating Viewpoint Presets Bar */}
      {showPresets && presets && onSelectPreset && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 flex flex-wrap items-center justify-end gap-1.5 z-10">
          <div className="hidden md:flex items-center text-[9px] font-mono uppercase text-ink-muted bg-canvas/80 px-2 py-1 border border-border/60 mr-1">
            <Compass className="w-3 h-3 text-accent mr-1" />
            <span>CAMERA VIEWS:</span>
          </div>

          {(Object.keys(presets) as CameraPreset[]).map((key) => {
            const config = presets[key];
            const isActive = activePreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectPreset(key)}
                className={cn(
                  'text-[10px] font-mono uppercase px-2.5 py-1 sm:py-1.5 border transition-all duration-200 shadow-sm flex items-center space-x-1 min-h-[30px]',
                  isActive
                    ? 'bg-ink text-canvas border-ink font-semibold'
                    : 'bg-canvas/90 backdrop-blur-md text-ink-muted hover:text-ink border-border hover:bg-canvas'
                )}
                aria-pressed={isActive}
              >
                <span className="opacity-60">{config.code}</span>
                <span className="hidden sm:inline">&bull;</span>
                <span>{config.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Left Gesture Guidance */}
      {instructionText && (
        <div className="absolute bottom-3 left-3 hidden lg:flex items-center space-x-2 text-[9px] font-mono text-ink-muted/80 bg-canvas/80 backdrop-blur-sm px-2 py-1 border border-border/50 pointer-events-none z-10">
          <span dangerouslySetInnerHTML={{ __html: instructionText }} />
        </div>
      )}
    </>
  );
};

export default ModelControls;
