import React from 'react';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraControlsProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  target?: [number, number, number];
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  controlsRef?: React.RefObject<OrbitControlsImpl>;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  autoRotate = true,
  autoRotateSpeed = 0.5,
  target = [0, 1.8, 0],
  minDistance = 6,
  maxDistance = 26,
  minPolarAngle = Math.PI / 6, // 30 degrees (prevent looking directly from top)
  maxPolarAngle = Math.PI / 2.05, // Just above ground plane (prevent underground clipping)
  enableZoom = true,
  enablePan = false,
  controlsRef,
}) => {
  return (
    <OrbitControls
      ref={controlsRef}
      target={target}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      enableZoom={enableZoom}
      enablePan={enablePan}
      makeDefault
    />
  );
};
