import React from 'react';

interface SceneLightingProps {
  intensity?: number;
  enableShadows?: boolean;
}

export const SceneLighting: React.FC<SceneLightingProps> = ({
  intensity = 1.0,
  enableShadows = false,
}) => {
  return (
    <>
      {/* Primary Ambient Studio Illumination */}
      <ambientLight intensity={0.6 * intensity} color="#F5F3EE" />

      {/* Main Key Sunlight (Warm 45-degree angle evoking West African afternoon sun) */}
      <directionalLight
        position={[14, 20, 12]}
        intensity={1.4 * intensity}
        color="#FFFDF5"
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />

      {/* Secondary Fill / Sky Cool Bounce */}
      <directionalLight
        position={[-12, 10, -10]}
        intensity={0.45 * intensity}
        color="#E2E8F0"
      />

      {/* Ground Bounce Light simulating warm limestone reflection */}
      <hemisphereLight
        args={['#FAF8F5', '#DCD8CE', 0.5 * intensity]}
        position={[0, 10, 0]}
      />
    </>
  );
};
