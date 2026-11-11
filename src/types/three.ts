/**
 * VOLIA NIG LTD — 3D Architectural Scene & Structural Typing System
 */

export type StructuralLayerId =
  | 'foundation'
  | 'columns'
  | 'beams'
  | 'slabs'
  | 'walls'
  | 'roof';

export interface StructuralComponentDef {
  id: StructuralLayerId;
  number: string;
  name: string;
  subtitle: string;
  functionDescription: string;
  engineeringCode: string;
  materialsUsed: string;
  loadPath: string;
  educationalNotes?: string;
}

export type CameraPreset = 'perspective' | 'elevation' | 'cantilever' | 'aerial';

export interface PresetConfig {
  name: string;
  code: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface BuildingModelProps {
  wireframe?: boolean;
  highlightedComponent?: string | null;
  isolatedComponent?: string | null;
  explodedOffset?: number;
  opacity?: number;
  onSelectComponent?: (id: StructuralLayerId) => void;
  hoveredComponent?: string | null;
  onHoverComponent?: (id: StructuralLayerId | null) => void;
}

export interface TransformationStage {
  step: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  technicalMilestone: string;
  wireframeOnly: boolean;
  opacity: number;
}
