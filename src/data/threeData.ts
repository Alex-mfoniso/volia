/**
 * VOLIA NIG LTD — 3D Architectural Scene & Structural Data
 * Pure data models and configurations for Three.js / React Three Fiber components.
 */

import type { StructuralComponentDef, TransformationStage } from '@/types/three';
export type { StructuralComponentDef, TransformationStage };

export const STRUCTURAL_COMPONENTS: StructuralComponentDef[] = [
  {
    id: 'foundation',
    number: '01',
    name: 'Foundation & Deep Piling',
    subtitle: 'Continuous Bored Piles, Pile Caps & Raft Foundation Slab',
    functionDescription:
      'Anchors the entire pavilion into competent alluvial bedrock. Engineered to counter buoyant groundwater uplift and prevent differential settlement across variable strata in Nigerian coastal soil profiles.',
    engineeringCode: 'BS 8004 / Nigerian National Building Code Section 13',
    materialsUsed: 'Grade C35/45 Sulfate-Resisting Reinforced Concrete',
    loadPath: 'Transfers accumulated column gravity loads and overturning wind moments into subsurface schist rock.',
    educationalNotes:
      'General geotechnical design standard: Deep bored piles distribute compressive vertical reaction forces into dense substrata via skin friction and end-bearing capacity.',
  },
  {
    id: 'columns',
    number: '02',
    name: 'Primary Structural Columns',
    subtitle: 'Reinforced Concrete & Bronze-Clad Compression Members',
    functionDescription:
      'Symmetrically positioned on a 6m × 8m structural grid. Slender profiles engineered with high-yield longitudinal rebar to resist combined axial compression and lateral frame drift.',
    engineeringCode: 'BS EN 1992-1-1 (Eurocode 2) / COREN Standards',
    materialsUsed: 'Grade C40/50 Concrete with High-Yield Deformed Steel Rebar (fy = 500 N/mm²)',
    loadPath: 'Receives shear forces from transfer beams and transmits axial thrust downward into foundation pile caps.',
    educationalNotes:
      'Compression column mechanics: Slenderness ratio λ is kept within code limits to safeguard against elastic and inelastic structural buckling.',
  },
  {
    id: 'beams',
    number: '03',
    name: 'Transfer Beams & Structural Ties',
    subtitle: 'Post-Tensioned Horizontal Moment-Resisting Girders',
    functionDescription:
      'Longitudinal and transverse beams tying columns into a monolithic moment-resisting spatial frame. Provides deflection control and allows expansive column-free interior circulation.',
    engineeringCode: 'BS EN 1992-1-1 Section 5.10 / ACI 318',
    materialsUsed: 'Post-Tensioned Concrete with 15.7mm Low-Relaxation Tendons in HDPE Ducts',
    loadPath: 'Collects floor slab tributary gravity loads and transfers bending moments to column nodes.',
    educationalNotes:
      'Flexural mechanics: Prestressing tendons introduce an internal compressive stress distribution that counteracts tensile stresses induced by imposed gravity loading.',
  },
  {
    id: 'slabs',
    number: '04',
    name: 'Elevated Slabs & Cantilever Terrace',
    subtitle: 'Two-Way Post-Tensioned Floor Matrix & 3.5m Overhang',
    functionDescription:
      'Thinner, lighter floor plates engineered to accommodate commercial live loads (4.0 kN/m²). Features a dramatic 3.5m post-tensioned cantilevered viewing terrace with zero intermediate columns.',
    engineeringCode: 'BS 8110 / Concrete Society Technical Report TR43',
    materialsUsed: '280mm Post-Tensioned Monolithic Concrete with 35mm Formwork Pre-Camber',
    loadPath: 'Distributes vertical occupant and partition loads via two-way flexure to transfer beams.',
    educationalNotes:
      'Two-way plate action: Banded tendon distribution balances self-weight and minimizes long-term deflection over prolonged sustained loading.',
  },
  {
    id: 'walls',
    number: '05',
    name: 'Shear Core & Climatic Envelope',
    subtitle: 'Monolithic Concrete Shear Core & Parametric Brise-Soleil',
    functionDescription:
      'Reinforced shear wall provides primary lateral stability against seismic and wind forces. Floor-to-ceiling Low-E glass panels paired with vertical bronze louvers reduce solar heat gain by 38%.',
    engineeringCode: 'Nigerian Building Code Life-Safety & Climatic Envelope Requirements',
    materialsUsed: '300mm Fair-Faced Shear Wall // Double-Glazed Low-E Glass (SHGC ≤ 0.28) // Bronze Louvers',
    loadPath: 'Resists lateral shear forces and wind suction pressures, stabilizing the spatial framework.',
    educationalNotes:
      'Lateral stability: Continuous reinforced shear walls act as vertical cantilever canted out of the foundation, offering high in-plane rigidity.',
  },
  {
    id: 'roof',
    number: '06',
    name: 'Roof Canopy & Cantilever Overhang',
    subtitle: 'Tapered Post-Tensioned Canopy with Siphonic Drainage',
    functionDescription:
      'Monumental 5.5m tapered cantilevered canopy casting passive shade over the glazed perimeter throughout tropical daylight hours. Incorporates internal siphonic drainage for torrential monsoon storms.',
    engineeringCode: 'BS EN 1991-1-4 (Wind Actions) / Siphonic Drainage Protocol (BS EN 12056-3)',
    materialsUsed: 'Post-Tensioned High-Strength Concrete with Satin Bronze Perimeter Fascia',
    loadPath: 'Anchored into structural shear cores, balancing heavy dead-load cantilevers through back-span tension.',
    educationalNotes:
      'Cantilever geometry: Tapering reduces deadweight at the free tip while maximizing section modulus at the fixed root where negative bending moment peaks.',
  },
];

export const TRANSFORMATION_STAGES: TransformationStage[] = [
  {
    step: 1,
    code: 'STAGE 01',
    title: 'Schematic Wireframe & Coordinate Drafting',
    subtitle: 'Geometric Axis Lines & Mathematical Grid Modeling',
    description:
      'Every project commences with pure vector geometry. We establish site boundary axes, structural column grids, and statutory setback limits on the Cartesian plane before physical volumes are assigned.',
    technicalMilestone: 'CAD / BIM Coordinate Origin Established // Preliminary Boundary Survey',
    wireframeOnly: true,
    opacity: 0.4,
  },
  {
    step: 2,
    code: 'STAGE 02',
    title: 'Structural Outlines & Primary Compression Grid',
    subtitle: 'Deep Foundation Piling & Column Sizing',
    description:
      'Subsurface soil mechanics and axial gravity vectors dictate structural members. Bored pile locations are calculated and primary load-bearing column matrices are locked into the 3D model.',
    technicalMilestone: 'Geotechnical Integration // FEA 3D Bending Moment Modeling',
    wireframeOnly: true,
    opacity: 0.7,
  },
  {
    step: 3,
    code: 'STAGE 03',
    title: 'Post-Tensioned Slabs & Volumetric Massing',
    subtitle: 'Transfer Beams, Slabs & Cantilever Overhangs',
    description:
      'Volumetric building masses emerge. Post-tensioned concrete floor slabs and monumental cantilevered canopies are detailed with formwork pre-cambers to control long-term creep deflection.',
    technicalMilestone: 'Tendon Trajectory Optimization // 2-Hour Fire Rating Enclosure',
    wireframeOnly: false,
    opacity: 0.65,
  },
  {
    step: 4,
    code: 'STAGE 04',
    title: 'Climatic Envelope & Solar Fenestration',
    subtitle: 'Double Glazing, Thermal Breaks & Passive Brise-Soleil',
    description:
      'The building skin is engineered to resist West African solar irradiance. High-performance Low-E glazing units and bronze sunshade louvers are assembled to curb mechanical cooling loads.',
    technicalMilestone: 'Solar Sun-Path Simulation (SHGC ≤ 0.28) // Air-Tightness Verification',
    wireframeOnly: false,
    opacity: 0.85,
  },
  {
    step: 5,
    code: 'STAGE 05',
    title: 'Realized Architectural Commission',
    subtitle: 'Finished Fair-Faced Concrete, Warm Limestone & Water Features',
    description:
      'The completed architectural asset harmonizes structural precision with serene human habitation. Textured concrete, satin bronze trims, and reflecting pools create an enduring built presence.',
    technicalMilestone: 'As-Built Structural Certification // Statutory Occupancy Clearance',
    wireframeOnly: false,
    opacity: 1.0,
  },
];
