import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { StructuralComponent } from './StructuralComponent';
import type { BuildingModelProps, StructuralLayerId } from '@/types/three';

/**
 * BuildingModel:
 * Parametric architectural pavilion archetype designed for VOLIA NIG LTD.
 * Renders 6 distinct structural systems with realistic finishes, dynamic exploded views,
 * component raycast picking, and layer isolation.
 */
export const BuildingModel: React.FC<BuildingModelProps> = ({
  wireframe = false,
  highlightedComponent = null,
  isolatedComponent = null,
  explodedOffset = 0,
  opacity = 1.0,
  onSelectComponent,
  onHoverComponent,
}) => {
  // Pre-instantiate shared architectural materials matching VOLIA's design system
  const materials = useMemo(() => {
    // 01. Canvas & Neutral Limestone
    const limestone = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.85,
      metalness: 0.05,
      wireframe,
      transparent: opacity < 1.0,
      opacity,
    });

    // 02. Structural Concrete
    const concrete = new THREE.MeshStandardMaterial({
      color: 0xdcd8ce,
      roughness: 0.75,
      metalness: 0.1,
      wireframe,
      transparent: opacity < 1.0,
      opacity,
    });

    // 03. Dark Charcoal Structural Elements & Shear Cores
    const charcoalConcrete = new THREE.MeshStandardMaterial({
      color: 0x25251f,
      roughness: 0.7,
      metalness: 0.15,
      wireframe,
      transparent: opacity < 1.0,
      opacity,
    });

    // 04. Satin Bronze Trim & Mullions
    const bronze = new THREE.MeshStandardMaterial({
      color: 0xa58b67,
      roughness: 0.4,
      metalness: 0.7,
      wireframe,
      transparent: opacity < 1.0,
      opacity,
    });

    // 05. Architectural Low-E Glazing
    const glass = new THREE.MeshStandardMaterial({
      color: 0xd8e4ec,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: wireframe ? 0.3 : 0.35 * opacity,
      wireframe,
    });

    // 06. Water Surface for Reflecting Pool
    const water = new THREE.MeshStandardMaterial({
      color: 0x98aab4,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: wireframe ? 0.2 : 0.65 * opacity,
      wireframe,
    });

    // 07. Active Selection Highlight Material (Warm Restrained Bronze)
    const highlight = new THREE.MeshStandardMaterial({
      color: 0xb89569,
      emissive: 0xa58b67,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.5,
      wireframe,
    });

    // 08. Ghosted material for non-isolated layers
    const ghosted = new THREE.MeshStandardMaterial({
      color: 0xdcd8ce,
      roughness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });

    return { limestone, concrete, charcoalConcrete, bronze, glass, water, highlight, ghosted };
  }, [wireframe, opacity]);

  // Clean up materials on unmount
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  // Helper to determine material based on selection and isolation state
  const getMaterial = (defaultMat: THREE.Material, layer: StructuralLayerId) => {
    if (isolatedComponent && isolatedComponent !== layer) {
      return materials.ghosted;
    }
    if (highlightedComponent === layer) {
      return materials.highlight;
    }
    return defaultMat;
  };

  const isLayerGhosted = (layer: StructuralLayerId) => {
    return Boolean(isolatedComponent && isolatedComponent !== layer);
  };

  // Exploded displacements calculated along Y
  const foundationY = -explodedOffset * 2.2;
  const columnsY = 0;
  const beamsY = explodedOffset * 1.5;
  const slabsY = explodedOffset * 3.2;
  const envelopeY = explodedOffset * 4.6;
  const roofY = explodedOffset * 6.5;

  return (
    <group position={[0, -0.5, 0]}>
      {/* =====================================================================
          01. FOUNDATION & PLINTH
          ===================================================================== */}
      <StructuralComponent
        layerId="foundation"
        position={[0, foundationY, 0]}
        isGhosted={isLayerGhosted('foundation')}
        isHighlighted={highlightedComponent === 'foundation'}
        isIsolated={isolatedComponent === 'foundation'}
        onSelect={onSelectComponent}
        onHover={onHoverComponent}
      >
        {/* Sub-base Soil / Excavation Pad */}
        <mesh position={[0, -0.7, 0]} receiveShadow>
          <boxGeometry args={[18, 0.4, 14]} />
          <primitive object={getMaterial(materials.concrete, 'foundation')} attach="material" />
        </mesh>

        {/* Deep Piling Stems (visible in exploded mode) */}
        {[-6, 0, 6].map((x) =>
          [-4, 0, 4].map((z) => (
            <mesh key={`pile-${x}-${z}`} position={[x, -1.8, z]}>
              <cylinderGeometry args={[0.35, 0.35, 2.0, 16]} />
              <primitive object={getMaterial(materials.concrete, 'foundation')} attach="material" />
            </mesh>
          ))
        )}

        {/* Primary Plinth Platform */}
        <mesh position={[0, -0.25, 0]} receiveShadow>
          <boxGeometry args={[16, 0.5, 12]} />
          <primitive object={getMaterial(materials.limestone, 'foundation')} attach="material" />
        </mesh>

        {/* Reflecting Pool Basin */}
        <mesh position={[4.5, -0.15, 3]}>
          <boxGeometry args={[5.5, 0.2, 4]} />
          <primitive object={getMaterial(materials.charcoalConcrete, 'foundation')} attach="material" />
        </mesh>
        {/* Pool Water Surface */}
        <mesh position={[4.5, -0.04, 3]}>
          <boxGeometry args={[5.3, 0.02, 3.8]} />
          <primitive object={materials.water} attach="material" />
        </mesh>
      </StructuralComponent>

      {/* =====================================================================
          02. STRUCTURAL COLUMNS
          ===================================================================== */}
      <StructuralComponent
        layerId="columns"
        position={[0, columnsY, 0]}
        isGhosted={isLayerGhosted('columns')}
        isHighlighted={highlightedComponent === 'columns'}
        isIsolated={isolatedComponent === 'columns'}
        onSelect={onSelectComponent}
        onHover={onHoverComponent}
      >
        {/* Grid of Ground Level Structural Columns */}
        {[
          [-5.5, 1.4, -3.5],
          [-5.5, 1.4, 0.5],
          [-5.5, 1.4, 3.5],
          [-1.5, 1.4, -3.5],
          [-1.5, 1.4, 3.5],
          [2.5, 1.4, -3.5],
          [2.5, 1.4, 3.5],
          [6.5, 1.4, -3.5],
          [6.5, 1.4, 0.5],
        ].map(([x, y, z], i) => (
          <mesh key={`col-g-${i}`} position={[x, y, z]} castShadow>
            <boxGeometry args={[0.4, 2.8, 0.4]} />
            <primitive object={getMaterial(materials.charcoalConcrete, 'columns')} attach="material" />
          </mesh>
        ))}

        {/* Upper Level Slender Columns */}
        {[
          [-5.5, 4.3, -3.5],
          [-5.5, 4.3, 0.5],
          [-1.5, 4.3, -3.5],
          [-1.5, 4.3, 0.5],
          [2.5, 4.3, -3.5],
          [2.5, 4.3, 0.5],
        ].map(([x, y, z], i) => (
          <mesh key={`col-u-${i}`} position={[x, y, z]} castShadow>
            <boxGeometry args={[0.3, 2.6, 0.3]} />
            <primitive object={getMaterial(materials.bronze, 'columns')} attach="material" />
          </mesh>
        ))}
      </StructuralComponent>

      {/* =====================================================================
          03. TRANSFER BEAMS & STRUCTURAL TIES
          ===================================================================== */}
      <StructuralComponent
        layerId="beams"
        position={[0, beamsY, 0]}
        isGhosted={isLayerGhosted('beams')}
        isHighlighted={highlightedComponent === 'beams'}
        isIsolated={isolatedComponent === 'beams'}
        onSelect={onSelectComponent}
        onHover={onHoverComponent}
      >
        {/* Longitudinal Primary Transfer Beams */}
        <mesh position={[0.5, 2.7, -3.5]}>
          <boxGeometry args={[13.2, 0.45, 0.5]} />
          <primitive object={getMaterial(materials.concrete, 'beams')} attach="material" />
        </mesh>
        <mesh position={[0.5, 2.7, 3.5]}>
          <boxGeometry args={[13.2, 0.45, 0.5]} />
          <primitive object={getMaterial(materials.concrete, 'beams')} attach="material" />
        </mesh>

        {/* Transverse Tie Beams */}
        {[-5.5, -1.5, 2.5, 6.5].map((x, idx) => (
          <mesh key={`beam-t-${idx}`} position={[x, 2.7, 0]}>
            <boxGeometry args={[0.45, 0.4, 7.2]} />
            <primitive object={getMaterial(materials.concrete, 'beams')} attach="material" />
          </mesh>
        ))}
      </StructuralComponent>

      {/* =====================================================================
          04. FLOOR SLABS (MEZZANINE & CANTILEVER TERRACE)
          ===================================================================== */}
      <StructuralComponent
        layerId="slabs"
        position={[0, slabsY, 0]}
        isGhosted={isLayerGhosted('slabs')}
        isHighlighted={highlightedComponent === 'slabs'}
        isIsolated={isolatedComponent === 'slabs'}
        onSelect={onSelectComponent}
        onHover={onHoverComponent}
      >
        {/* First Floor Elevated Post-Tensioned Slab */}
        <mesh position={[0.5, 2.95, 0]} receiveShadow castShadow>
          <boxGeometry args={[13.5, 0.35, 8.5]} />
          <primitive object={getMaterial(materials.concrete, 'slabs')} attach="material" />
        </mesh>

        {/* Dramatic Projecting West Cantilever Terrace */}
        <mesh position={[6.5, 2.95, 0.5]} receiveShadow castShadow>
          <boxGeometry args={[3.0, 0.28, 6.0]} />
          <primitive object={getMaterial(materials.limestone, 'slabs')} attach="material" />
        </mesh>

        {/* Terrace Bronze Fascia Trim */}
        <mesh position={[7.95, 2.95, 0.5]}>
          <boxGeometry args={[0.08, 0.32, 6.1]} />
          <primitive object={materials.bronze} attach="material" />
        </mesh>
      </StructuralComponent>

      {/* =====================================================================
          05. WALLS, ENVELOPE & FACADE SCREENS
          ===================================================================== */}
      <StructuralComponent
        layerId="walls"
        position={[0, envelopeY, 0]}
        isGhosted={isLayerGhosted('walls')}
        isHighlighted={highlightedComponent === 'walls'}
        isIsolated={isolatedComponent === 'walls'}
        onSelect={onSelectComponent}
        onHover={onHoverComponent}
      >
        {/* Solid Monolithic Shear Core Wall (East flank) */}
        <mesh position={[-6.2, 2.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 5.6, 6.5]} />
          <primitive object={getMaterial(materials.charcoalConcrete, 'walls')} attach="material" />
        </mesh>

        {/* Ground Floor Curtain Wall (Glass Envelope) */}
        <mesh position={[0.5, 1.4, 2.8]}>
          <boxGeometry args={[11.5, 2.5, 0.08]} />
          <primitive object={getMaterial(materials.glass, 'walls')} attach="material" />
        </mesh>
        <mesh position={[0.5, 1.4, -2.8]}>
          <boxGeometry args={[11.5, 2.5, 0.08]} />
          <primitive object={getMaterial(materials.glass, 'walls')} attach="material" />
        </mesh>
        <mesh position={[6.2, 1.4, 0]}>
          <boxGeometry args={[0.08, 2.5, 5.5]} />
          <primitive object={getMaterial(materials.glass, 'walls')} attach="material" />
        </mesh>

        {/* Upper Level Glazing */}
        <mesh position={[0, 4.3, 0.5]}>
          <boxGeometry args={[9.5, 2.3, 0.08]} />
          <primitive object={getMaterial(materials.glass, 'walls')} attach="material" />
        </mesh>

        {/* Parametric Brise-Soleil (Solar Louvers on South Facade) */}
        {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((x) => (
          <mesh key={`louver-${x}`} position={[x, 4.3, 0.7]} rotation={[0, 0.45, 0]}>
            <boxGeometry args={[0.06, 2.3, 0.35]} />
            <primitive object={getMaterial(materials.bronze, 'walls')} attach="material" />
          </mesh>
        ))}

        {/* Cantilever Glass Balustrade */}
        <mesh position={[6.5, 3.55, 3.45]}>
          <boxGeometry args={[2.8, 0.9, 0.04]} />
          <primitive object={materials.glass} attach="material" />
        </mesh>
        <mesh position={[7.95, 3.55, 0.5]}>
          <boxGeometry args={[0.04, 0.9, 5.9]} />
          <primitive object={materials.glass} attach="material" />
        </mesh>
      </StructuralComponent>

      {/* =====================================================================
          06. ROOF CANOPY & CANTILEVER OVERHANG
          ===================================================================== */}
      <StructuralComponent
        layerId="roof"
        position={[0, roofY, 0]}
        isGhosted={isLayerGhosted('roof')}
        isHighlighted={highlightedComponent === 'roof'}
        isIsolated={isolatedComponent === 'roof'}
        onSelect={onSelectComponent}
        onHover={onHoverComponent}
      >
        {/* Main Monolithic Tapered Roof Canopy */}
        <mesh position={[0.5, 5.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[16.2, 0.45, 10.5]} />
          <primitive object={getMaterial(materials.limestone, 'roof')} attach="material" />
        </mesh>

        {/* Architectural Skylight Cut-Out Glass Inset */}
        <mesh position={[-2.5, 5.75, 0]}>
          <boxGeometry args={[3.2, 0.05, 3.2]} />
          <primitive object={materials.glass} attach="material" />
        </mesh>

        {/* Roof Perimeter Bronze Fascia Cap */}
        <mesh position={[0.5, 5.7, 5.23]}>
          <boxGeometry args={[16.25, 0.48, 0.05]} />
          <primitive object={materials.bronze} attach="material" />
        </mesh>
        <mesh position={[0.5, 5.7, -5.23]}>
          <boxGeometry args={[16.25, 0.48, 0.05]} />
          <primitive object={materials.bronze} attach="material" />
        </mesh>
        <mesh position={[8.58, 5.7, 0]}>
          <boxGeometry args={[0.05, 0.48, 10.55]} />
          <primitive object={materials.bronze} attach="material" />
        </mesh>
        <mesh position={[-7.58, 5.7, 0]}>
          <boxGeometry args={[0.05, 0.48, 10.55]} />
          <primitive object={materials.bronze} attach="material" />
        </mesh>
      </StructuralComponent>

      {/* Ground Shadow Receiver Plane */}
      <mesh position={[0, -1.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 28]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
    </group>
  );
};

export default BuildingModel;
