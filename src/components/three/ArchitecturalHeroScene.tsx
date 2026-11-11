import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BuildingModel } from './BuildingModel';
import { SceneLighting } from './SceneLighting';
import { CameraControls } from './CameraControls';
import { ModelControls } from './ModelControls';
import { ModelLoadingState } from './ModelLoadingState';
import { ModelFallback } from './ModelFallback';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import type { CameraPreset, PresetConfig } from '@/types/three';

export const HERO_CAMERA_PRESETS: Record<CameraPreset, PresetConfig> = {
  perspective: {
    name: 'Perspective Hero',
    code: 'VIEW 01',
    position: [13, 8.5, 13],
    target: [0, 2.2, 0],
  },
  elevation: {
    name: 'Front Elevation',
    code: 'VIEW 02',
    position: [0.5, 3.2, 16],
    target: [0.5, 2.5, 0],
  },
  cantilever: {
    name: 'Cantilever Overhang',
    code: 'VIEW 03',
    position: [11, 3.8, 5],
    target: [5.5, 3.2, 0],
  },
  aerial: {
    name: 'Aerial Plan',
    code: 'VIEW 04',
    position: [8, 17, 8],
    target: [0, 1.5, 0],
  },
};

/**
 * Subtle pointer tilt effect: gently leans the model towards pointer coordinates
 * when the user is hovering and not actively dragging OrbitControls.
 */
const PointerResponsiveRig: React.FC<{
  children: React.ReactNode;
  active: boolean;
}> = ({ children, active }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (active) {
      const targetRotY = state.pointer.x * 0.08;
      const targetRotX = -state.pointer.y * 0.05;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.05
      );
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export interface ArchitecturalHeroSceneProps {
  className?: string;
  wireframe?: boolean;
  allowPresets?: boolean;
  heightClass?: string;
}

/**
 * ArchitecturalHeroScene:
 * Premium interactive 3D centerpiece for VOLIA NIG LTD homepage hero.
 * Features realistic finishes, restrained lighting, subtle pointer reactivity,
 * orbit controls, viewpoint presets, and accessible fallbacks.
 */
export const ArchitecturalHeroScene: React.FC<ArchitecturalHeroSceneProps> = ({
  className,
  wireframe: defaultWireframe = false,
  allowPresets = true,
  heightClass = 'h-[460px] sm:h-[520px] lg:h-[600px]',
}) => {
  const { isSupported } = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();

  const [activePreset, setActivePreset] = useState<CameraPreset>('perspective');
  const [isWireframe, setIsWireframe] = useState<boolean>(defaultWireframe);
  const [autoRotate, setAutoRotate] = useState<boolean>(!prefersReducedMotion);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Switch camera to preset coordinate smoothly
  const applyPreset = (presetKey: CameraPreset) => {
    setActivePreset(presetKey);
    setAutoRotate(false);
    const config = HERO_CAMERA_PRESETS[presetKey];
    if (controlsRef.current) {
      controlsRef.current.object.position.set(...config.position);
      controlsRef.current.target.set(...config.target);
      controlsRef.current.update();
    }
  };

  // Reset to default perspective
  const handleReset = () => {
    applyPreset('perspective');
    setAutoRotate(!prefersReducedMotion);
  };

  // Keyboard / Touch zoom handlers
  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(0.9);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(1.1);
      controlsRef.current.update();
    }
  };

  if (!isSupported) {
    return (
      <div className={cn('relative w-full overflow-hidden', heightClass, className)}>
        <ModelFallback
          message="WebGL hardware acceleration is disabled or unsupported on this device. Presenting static architectural projection."
        />
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="3D Interactive Architectural Pavilion Visualization"
      className={cn(
        'relative w-full border border-border bg-canvas-surface/50 overflow-hidden select-none group',
        heightClass,
        className
      )}
    >
      {/* 3D Canvas */}
      <Suspense fallback={<ModelLoadingState message="Initializing 3D Architectural Pavilion..." />}>
        <Canvas
          shadows
          camera={{ position: HERO_CAMERA_PRESETS.perspective.position, fov: 42, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={() => setIsInteracting(false)}
        >
          <SceneLighting enableShadows />

          <PointerResponsiveRig active={!isInteracting && !prefersReducedMotion}>
            <BuildingModel wireframe={isWireframe} />
          </PointerResponsiveRig>

          <CameraControls
            controlsRef={controlsRef}
            autoRotate={autoRotate && !isInteracting}
            autoRotateSpeed={0.4}
            target={HERO_CAMERA_PRESETS.perspective.target}
          />
        </Canvas>
      </Suspense>

      {/* Reusable Viewport Controls Overlay */}
      <ModelControls
        activePreset={activePreset}
        presets={allowPresets ? HERO_CAMERA_PRESETS : undefined}
        onSelectPreset={applyPreset}
        isWireframe={isWireframe}
        onToggleWireframe={() => setIsWireframe(!isWireframe)}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onResetCamera={handleReset}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        showPresets={allowPresets}
        instructionText="DRAG TO ROTATE &bull; SCROLL TO ZOOM &bull; RESET CAMERA AVAILABLE"
        badgeLabel="PAVILION ARCHETYPE &bull; REAL-TIME 3D"
      />
    </div>
  );
};

export default ArchitecturalHeroScene;
