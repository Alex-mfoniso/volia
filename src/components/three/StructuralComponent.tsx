import React, { useState } from 'react';
import type { StructuralLayerId } from '@/types/three';

interface StructuralComponentProps {
  layerId: StructuralLayerId;
  position?: [number, number, number];
  isHighlighted?: boolean;
  isIsolated?: boolean;
  isGhosted?: boolean;
  onSelect?: (layerId: StructuralLayerId) => void;
  onHover?: (layerId: StructuralLayerId | null) => void;
  children: React.ReactNode;
}

/**
 * StructuralComponent:
 * Wraps individual architectural 3D sub-assemblies (foundation, columns, beams, slabs, walls, roof).
 * Handles pointer raycasting, hover cursor states, selection dispatch, and ghosting when another layer is isolated.
 */
export const StructuralComponent: React.FC<StructuralComponentProps> = ({
  layerId,
  position = [0, 0, 0],
  isGhosted = false,
  onSelect,
  onHover,
  children,
}) => {
  const [, setHovered] = useState<boolean>(false);

  return (
    <group
      position={position}
      visible={!isGhosted}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(layerId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover?.(layerId);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover?.(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {children}
    </group>
  );
};
