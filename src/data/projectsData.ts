/**
 * VOLIA NIG LTD — Advanced Project Case Studies Repository
 * 
 * IMPORTANT COMPLIANCE NOTICE:
 * Every case study in this file represents an ILLUSTRATIVE PROJECT CONCEPT designed
 * to demonstrate technical capability, engineering scope, and consultancy rigor.
 * These are demonstration archetypes awaiting replacement by genuine VOLIA NIG LTD
 * commission records following executive clearance.
 */

export type ProjectCategory =
  | 'Engineering'
  | 'Architecture'
  | 'Construction'
  | 'Quantity Surveying'
  | 'Infrastructure';

export interface ProjectStage {
  number: string;
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface TechnicalConsideration {
  parameter: string;
  specification: string;
  notes: string;
}

export type ProjectVerificationStatus = 'verified' | 'illustrative_reference';

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  category: ProjectCategory;
  figure: string;
  title: string;
  subtitle: string;
  typology: string;
  description: string;
  location: string;
  scale: string;
  completionDate?: string;
  timeframe: string;
  primaryImage: string;
  projectImages: {
    url: string;
    caption: string;
    alt: string;
  }[];
  galleryImages: {
    url: string;
    caption: string;
    alt: string;
  }[];
  overview: string;
  objectives: string[];
  challenges: string[];
  approach: string[];
  stages: ProjectStage[];
  technicalConsiderations: TechnicalConsideration[];
  badge: 'ILLUSTRATIVE PROJECT CONCEPT';
  projectStatus: 'Reference Benchmark' | 'Under Review' | 'Active Advisory' | 'Completed';
  verificationStatus: ProjectVerificationStatus;
}

export const PROJECT_CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Engineering',
  'Architecture',
  'Construction',
  'Quantity Surveying',
  'Infrastructure',
];

const RAW_PROJECT_CASE_STUDIES: Omit<ProjectCaseStudy, 'description' | 'completionDate' | 'projectImages' | 'projectStatus' | 'verificationStatus'>[] = [
  {
    id: 'eng-01',
    slug: 'post-tensioned-structural-grid',
    category: 'Engineering',
    figure: 'CASE ENG-01',
    title: 'Long-Span Post-Tensioned Commercial Atrium',
    subtitle: 'Vibration-damped structural floor systems and column-free public gathering space',
    typology: 'Commercial Structural Engineering',
    location: 'Abuja Federal Capital Territory, Nigeria (Illustrative Region)',
    scale: '18,500 m² Gross Floor Area // 24m Column-Free Clear Span',
    timeframe: '28-Month Projected Construction Cycle',
    primaryImage:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
        caption: 'Central atrium volumetric framing with structural steel triangulated roof truss.',
        alt: 'Long-span roof truss over architectural atrium',
      },
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
        caption: 'Secondary load distribution grid and post-tensioned tendon profiling.',
        alt: 'Steel scaffolding and structural concrete framing',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
        caption: 'Cantilever perimeter edge slab showing cast-in-place expansion joint detailing.',
        alt: 'Exterior concrete overhang and edge detailing',
      },
    ],
    overview:
      'This illustrative engineering concept explores the structural design and analysis of an expansive civic atrium requiring 24-meter column-free spans. The design integrates high-performance bonded post-tensioned concrete beams with a lightweight composite structural steel space frame. The engineering advisory team model dynamic deflection, cyclic wind drift, and footfall vibration induced by peak pedestrian loads.',
    objectives: [
      'Eliminate intermediate structural columns within the central public forum while restricting total slab depth to under 850mm.',
      'Achieve rigorous compliance with Nigerian National Building Code standards and BS EN 1992-1-1 (Eurocode 2).',
      'Optimize dead weight through hollow-core voids and high-strength concrete (Grade C40/50), reducing foundation loading by 19%.',
      'Provide comprehensive third-party peer review documentation for regulatory statutory approval.',
    ],
    challenges: [
      'Differential settlement risk due to varying subsurface alluvial strata across the 90m footprint.',
      'Severe thermal expansion differential between the conditioned glass-enclosed atrium and external ambient tropical temperatures reaching 38°C.',
      'Strict deflection limits (L/500) demanded by the continuous perimeter frameless curtain wall system.',
    ],
    approach: [
      'Finite Element Analysis (FEA) performed using full 3D spatial models incorporating nonlinear creep and shrinkage parameters.',
      'Staged tensioning sequence protocol ensuring tendons are stressed in two distinct increments to control early-age tensile cracking.',
      'Continuous bored pile foundation matrix tying into competent schist bedrock at depths between 14m and 18m.',
    ],
    stages: [
      {
        number: '01',
        phase: 'Preliminary Feasibility',
        title: 'Geotechnical Integration & Load Modeling',
        description: 'Comprehensive evaluation of borehole logs, dynamic live load calculations, and baseline column-free span feasibility.',
        deliverables: ['Geotechnical parameter review', 'Preliminary structural sizing calculation', 'Comparative frame weight matrix'],
      },
      {
        number: '02',
        phase: 'Detailed Engineering',
        title: 'Finite Element Modeling & Tendon Profiling',
        description: 'Stress distribution analysis, post-tensioned tendon trajectory optimization, and crack width limit state calculations.',
        deliverables: ['Full 3D FEA deflection model', 'Tendon elongation schedules', 'Reinforcement bending schedules'],
      },
      {
        number: '03',
        phase: 'Statutory Approval',
        title: 'Peer Review & Statutory Defense',
        description: 'Independent structural validation documentation prepared for development control authority submission.',
        deliverables: ['Structural safety compliance dossier', 'Statutory calculations report', 'Certified engineering drawings'],
      },
      {
        number: '04',
        phase: 'Construction Supervision',
        title: 'Tensioning Verification & Quality Assurance',
        description: 'On-site monitoring of hydraulic jack calibration, tendon elongation measurement, and concrete cube compressive testing.',
        deliverables: ['Stressing records log', 'Concrete cube crushing certs', 'Final structural as-built audit'],
      },
    ],
    technicalConsiderations: [
      {
        parameter: 'Concrete Compressive Strength',
        specification: 'Grade C40/50 with silica fume replacement (7% cement weight)',
        notes: 'Accelerates early strength gain to permit Stage 1 stressing at 72 hours.',
      },
      {
        parameter: 'Post-Tensioning System',
        specification: '15.7mm low-relaxation 7-wire strands (ASTM A416 Grade 270)',
        notes: 'Bonded system utilizing high-density polyethylene corrugated ducts and thixotropic grout.',
      },
      {
        parameter: 'Deflection Criterion',
        specification: 'Immediate live load deflection ≤ Span / 500; Long-term deflection ≤ Span / 350',
        notes: 'Pre-camber of 35mm engineered into formwork to offset quasi-permanent gravity loads.',
      },
      {
        parameter: 'Seismic & Wind Drift',
        specification: 'Lateral inter-storey drift ratio ≤ 0.004 h',
        notes: 'Resisted through dual reinforced shear cores located symmetrically at building flanks.',
      },
    ],
    badge: 'ILLUSTRATIVE PROJECT CONCEPT',
  },
  {
    id: 'arch-01',
    slug: 'climatic-monolithic-cantilever',
    category: 'Architecture',
    figure: 'CASE ARCH-01',
    title: 'Climatic Monolithic Pavilion & Low-Energy Envelope',
    subtitle: 'Passive solar orientation, deep protective cantilevers, and natural cross-ventilation',
    typology: 'Institutional & Cultural Architecture',
    location: 'Lagos State Coastal Zone, Nigeria (Illustrative Region)',
    scale: '4,200 m² Enclosed Pavilion // 1,800 m² Shaded Covered Terraces',
    timeframe: '20-Month Projected Lifecycle',
    primaryImage:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
        caption: 'Monolithic cantilevered roof canopy casting deep ambient shade over glazed pavilion.',
        alt: 'Minimalist contemporary architectural pavilion with clean geometric lines',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
        caption: 'Board-formed exposed concrete textured wall reflecting diffused tropical sunlight.',
        alt: 'Concrete textured facade with shadow play',
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
        caption: 'Interlocking volumes balancing public social gathering courtyards and administrative wings.',
        alt: 'Geometric multi-story volume composition',
      },
    ],
    overview:
      'This architectural concept illustrates VOLIA’s passive climatic design philosophy for tropical West African environments. Rather than relying entirely on mechanical HVAC systems, the building’s spatial orientation, massing, and monumental 6.5m concrete cantilevers create a self-shading microclimate. The design embraces local materials, natural ventilation shafts, and high-performance solar control glass.',
    objectives: [
      'Reduce annual mechanical cooling energy demand by 34% through solar geometry alignment and passive airflow modeling.',
      'Establish an enduring, institutional civic identity rooted in minimalist architectural geometry.',
      'Ensure resilient envelope performance against coastal saline humidity and heavy seasonal rainfall.',
      'Create fluid transitions between interior conditioned conference halls and exterior shaded perimeter verandas.',
    ],
    challenges: [
      'High coastal ambient humidity coupled with solar thermal radiation peak of 950 W/m².',
      'Minimizing glare on interior digital exhibition displays while retaining expansive vistas.',
      'Protecting exposed architectural concrete surfaces from biological growth and monsoon water staining.',
    ],
    approach: [
      'Solar sun-path computer simulation conducted across solstices to calculate exact overhang depths and louvre cut-off angles.',
      'Integration of vertical solar chimneys inducing thermal stack effect to naturally exhaust warm air from ceiling plenums.',
      'Hydrophobic silane-siloxane impregnating sealers specified for all exposed fair-faced concrete envelopes.',
    ],
    stages: [
      {
        number: '01',
        phase: 'Spatial Briefing & Program',
        title: 'Site Microclimate Analysis',
        description: 'Microclimatic wind rose study, solar trajectory analysis, and user circulation flow mapping.',
        deliverables: ['Climatic site strategy report', 'Spatial zoning matrix', 'Volumetric massing studies'],
      },
      {
        number: '02',
        phase: 'Concept & Envelope',
        title: 'Passive Solar Simulation',
        description: 'Computational solar gain analysis and daylight factor validation across all interior galleries.',
        deliverables: ['Daylight simulation renderings', 'Canopy overhang geometry', 'Exterior material palette'],
      },
      {
        number: '03',
        phase: 'Technical Detailing',
        title: 'Envelope Joint & Rainwater Detailing',
        description: 'Hidden internal gutter siphon systems, expansion joints, and acoustic barrier specifications.',
        deliverables: ['1:20 envelope construction details', 'Glazing thermal performance specs', 'Acoustic schedules'],
      },
      {
        number: '04',
        phase: 'Site Realization',
        title: 'Architectural Mock-Up Review',
        description: 'Inspection of 1:1 on-site fair-faced concrete sample panels, formwork tie-hole plugs, and joint alignments.',
        deliverables: ['Sample approval documentation', 'Architectural defect inspection logs', 'As-built spatial audit'],
      },
    ],
    technicalConsiderations: [
      {
        parameter: 'Glazing Solar Heat Gain (SHGC)',
        specification: 'Double-glazed Low-E unit with SHGC ≤ 0.28 and Light Transmission ≥ 62%',
        notes: 'Limits solar heat radiation while maintaining natural daylighting without artificial illumination during daytime.',
      },
      {
        parameter: 'Cantilever Structural Overhang',
        specification: '6.50m tapered post-tensioned reinforced canopy',
        notes: 'Provides 100% direct solar shading to floor-to-ceiling glass between 10:30 and 15:30 throughout the year.',
      },
      {
        parameter: 'Rainwater Evacuation',
        specification: 'Siphonic roof drainage sized for 150mm/hr intense tropical storms',
        notes: 'Pipes concealed within structural service ducts, eliminating external visible downspouts.',
      },
      {
        parameter: 'Thermal Mass Integration',
        specification: '300mm fair-faced high-density concrete mass wall',
        notes: 'Damps diurnal temperature swings by absorbing day heat and releasing it during cool ocean breezes at night.',
      },
    ],
    badge: 'ILLUSTRATIVE PROJECT CONCEPT',
  },
  {
    id: 'qs-01',
    slug: 'cost-governance-elemental-model',
    category: 'Quantity Surveying',
    figure: 'CASE QS-01',
    title: 'Commercial Cost Control & Elemental Value Engineering',
    subtitle: 'Comprehensive BoQ preparation, procurement risk modeling, and post-contract financial administration',
    typology: 'Quantity Surveying & Cost Advisory',
    location: 'Port Harcourt Commercial Corridor, Nigeria (Illustrative Region)',
    scale: 'Multi-Phase Mixed-Use // Benchmark Budget: ₦14.2B Capital Expenditure',
    timeframe: '36-Month Full Cost Lifecycle',
    primaryImage:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85',
        caption: 'Measurement schedules, structural rebar reconciliation, and elemental financial models.',
        alt: 'Bills of quantities, calculators, and architectural plans on drafting table',
      },
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1600&q=85',
        caption: 'Independent on-site interim valuation measurement verifying contractor progress claims.',
        alt: 'Quantity surveyor checking physical site work measurements',
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
        caption: 'Corporate commercial development delivered strictly within the baseline cost ceiling.',
        alt: 'Commercial glass and steel tower',
      },
    ],
    overview:
      'This case study illustrates VOLIA’s fiduciary commercial governance framework applied to large capital expenditure projects. In an economic climate characterized by material price fluctuations and foreign exchange shifts, disciplined quantity surveying protects the client’s capital. The scope encompasses elemental cost planning, exhaustive Bills of Quantities (BoQ) per the Standard Method of Measurement (BESMM/POMI), tender analysis, and monthly valuation certification.',
    objectives: [
      'Maintain final project completion cost within a strict ±2.5% tolerance of the baseline approved capital budget.',
      'Produce an unassailable, itemized Bill of Quantities eliminating ambiguity in contractor bidding.',
      'Implement a dynamic fluctuation formula tracking local price shifts in rebar, cement, and imported MEP plant.',
      'Establish fair, certified interim valuation certificates protecting against premature contractor overpayment.',
    ],
    challenges: [
      'Rapid volatility in foreign exchange rates impacting imported specialized chillers and elevator packages.',
      'Contractor variation claims exceeding 12% of contract sum submitted during foundation excavation works.',
      'Complex phasing requirements requiring early commissioning of retail wings prior to office tower completion.',
    ],
    approach: [
      'Value Engineering Workshops: Identified alternative domestic steel mills meeting COREN standards, saving 8.4% on structural rebar.',
      'Forensic Variation Auditing: Rejected unverified site claims through strict adherence to contract notice clauses and daily clerk-of-works logs.',
      'Escrow Milestone Disbursement: Aligned progress certificates directly with physically measured quantities rather than elapsed calendar time.',
    ],
    stages: [
      {
        number: '01',
        phase: 'Budget Benchmarking',
        title: 'Elemental Cost Plan Formulation',
        description: 'Historical cost benchmarking, parameter estimates per square meter, and initial commercial feasibility modeling.',
        deliverables: ['Order of Magnitude Cost Estimate', 'Elemental Cost Plan Level 2', 'Financial risk contingency model'],
      },
      {
        number: '02',
        phase: 'Pre-Contract Tender',
        title: 'BoQ Preparation & Contractor Tender Audit',
        description: 'Exhaustive quantity takeoff, comprehensive tender dossier preparation, and normalized contractor bid evaluation.',
        deliverables: ['Detailed Priced Bills of Quantities', 'Tender Evaluation & Scoring Matrix', 'Contractor Award Recommendation Report'],
      },
      {
        number: '03',
        phase: 'Construction Administration',
        title: 'Monthly Interim Valuations & Change Governance',
        description: 'Physical on-site measurements, variation claim evaluation, and monthly cash flow forecasting.',
        deliverables: ['Interim Payment Certificates (IPC)', 'Monthly Cost Variance Reports', 'Contingency Drawdown Tracker'],
      },
      {
        number: '04',
        phase: 'Project Closeout',
        title: 'Final Account Settlement & Audit',
        description: 'Exhaustive measurement reconciliation, liquidation of claims, and final account sign-off.',
        deliverables: ['Signed Final Account Agreement', 'Retention Release Certificate', 'Post-Project Cost Benchmarking Ledger'],
      },
    ],
    technicalConsiderations: [
      {
        parameter: 'Measurement Standard',
        specification: 'Building and Engineering Standard Method of Measurement (BESMM4) / POMI',
        notes: 'Ensures absolute uniformity and eliminates disputed ambiguous item descriptions in tenders.',
      },
      {
        parameter: 'Price Fluctuation Mechanism',
        specification: 'FIDIC Clause 13.8 Price Adjustment Formula with verified NBS indices',
        notes: 'Fairly distributes inflationary exposure between client and contractor with defined index weightings.',
      },
      {
        parameter: 'Valuation Frequency',
        specification: 'Strict 28-day measurement cycle with physical joint re-measurement',
        notes: 'Pre-condition to certificate issuance: contractor must provide delivery waybills and test certs.',
      },
      {
        parameter: 'Contingency Management',
        specification: 'Dual-tiered contingency: 5% General Design Reserve + 3% Employer Change Reserve',
        notes: 'Drawdown requires formal written authorization from both Lead Consultant and Client Representative.',
      },
    ],
    badge: 'ILLUSTRATIVE PROJECT CONCEPT',
  },
  {
    id: 'const-01',
    slug: 'quality-supervision-civic-superstructure',
    category: 'Construction',
    figure: 'CASE CONST-01',
    title: 'Site Quality Oversight & Structural Execution Governance',
    subtitle: 'Zero-defect reinforcement inspection, slump testing, and statutory staging compliance',
    typology: 'Construction Supervision & Quality Control',
    location: 'Ibadan Urban Regeneration Corridor, Nigeria (Illustrative Region)',
    scale: '7-Storey Reinforced Concrete Skeletal Frame // 12,000 m²',
    timeframe: '22-Month Site Supervision Engagement',
    primaryImage:
      'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1600&q=85',
        caption: 'Independent resident engineers conducting pre-pour rebar spacing and cover block inspection.',
        alt: 'Engineers on construction site verifying reinforcement measurements',
      },
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
        caption: 'Tower crane operation, concrete placement, and formwork verticality laser checks.',
        alt: 'Construction framework and crane towering overhead',
      },
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
        caption: 'Completed structural concrete skeletal frame ready for MEP and curtain wall rough-in.',
        alt: 'Structural concrete interior framing',
      },
    ],
    overview:
      'Construction supervision by VOLIA NIG LTD bridges the critical divide between approved engineering drawings and physical site execution. This case concept demonstrates resident technical supervision on a multi-storey framed superstructure. Our team enforces rigorous quality assurance: from verifying mill test certificates on high-yield steel to on-site slump cone testing, cube compression crushing, and laser-guided formwork alignment checks.',
    objectives: [
      'Enforce 100% compliance with approved structural drawings, eliminating unauthorized rebar substitutions.',
      'Achieve zero structural non-conformances across 48 critical concrete slab and column placement milestones.',
      'Guarantee rigorous adherence to statutory site safety, PPE standards, and environmental protection protocols.',
      'Maintain an unbroken photographic, material test, and daily clerk-of-works audit trail for statutory handover.',
    ],
    challenges: [
      'Inconsistent consistency of ready-mix concrete batches transported through dense urban traffic congestion.',
      'Challenging sub-base groundwater table requiring continuous dewatering pumps during raft foundation placement.',
      'Subcontractor resistance to dismantling misaligned formwork shuttering prior to casting authorization.',
    ],
    approach: [
      'Strict "Permit-to-Pour" System: No concrete dispatch allowed until resident engineer signs off on rebar laps, cover spacers, and cleanliness.',
      'Mobile Laboratory Testing: Slump tests conducted directly at batch arrival; failing batches immediately rejected and turned away.',
      'Laser-Level Verification: Formwork tolerances verified to within ±3mm before steel fixing commences.',
    ],
    stages: [
      {
        number: '01',
        phase: 'Pre-Construction Prep',
        title: 'Method Statement & QA Plan Audit',
        description: 'Review of contractor execution method statements, batching plant credentials, and equipment calibration records.',
        deliverables: ['Quality Assurance / Quality Control Plan', 'Material source approval list', 'Risk assessment register'],
      },
      {
        number: '02',
        phase: 'Substructure Execution',
        title: 'Foundation Raft & Earthwork Supervision',
        description: 'Continuous monitoring of excavation levels, blindings, waterproofing membranes, and dense rebar mats.',
        deliverables: ['Excavation inspection certificates', 'Waterproofing integrity reports', 'Foundation pour logs'],
      },
      {
        number: '03',
        phase: 'Superstructure Frames',
        title: 'Column & Floor Slab Staged Approvals',
        description: 'Systematic sign-off of each structural level: reinforcement, conduits, formwork shoring, and cube sampling.',
        deliverables: ['Pour approval tickets', '7-day & 28-day concrete cube crush registers', 'Non-Conformance Reports (NCR)'],
      },
      {
        number: '04',
        phase: 'Structure Handover',
        title: 'As-Built Verification & De-Shoring Sign-Off',
        description: 'Comprehensive laser survey of completed superstructure frame and formal authorization for prop removal.',
        deliverables: ['As-built structural survey report', 'De-propping certificates', 'Statutory completion engineering sign-off'],
      },
    ],
    technicalConsiderations: [
      {
        parameter: 'Concrete Cover Spacing',
        specification: 'Concrete cover blocks: 40mm for external elements; 25mm for internal slabs',
        notes: 'Manufactured with high-strength mortar matched to parent concrete strength to prevent carbonation ingress.',
      },
      {
        parameter: 'Slump Retention Limit',
        specification: 'Target slump: 150mm ± 25mm at point of placement',
        notes: 'Water addition on site strictly prohibited; approved superplasticizers used under engineer supervision.',
      },
      {
        parameter: 'Cube Crushing Protocol',
        specification: '6 cubes per 50m³ pour: 2 tested at 7 days; 3 tested at 28 days; 1 reserve',
        notes: 'Tested in independent accredited materials testing laboratory with verified calibration certs.',
      },
      {
        parameter: 'Formwork Strike Times',
        specification: 'Soffit boards to slabs: 14 days; props to beams: 21 days (subject to cube tests)',
        notes: 'Premature striking forbidden until compressive test results demonstrate ≥ 75% characteristic strength.',
      },
    ],
    badge: 'ILLUSTRATIVE PROJECT CONCEPT',
  },
  {
    id: 'inf-01',
    slug: 'resilient-stormwater-civil-infrastructure',
    category: 'Infrastructure',
    figure: 'CASE INF-01',
    title: 'Civic Stormwater Drainage & Regional Flood Alleviation Network',
    subtitle: 'Catchment hydrological modeling, reinforced box culvert systems, and sustainable surface runoff detention',
    typology: 'Civil Infrastructure & Water Resources',
    location: 'Niger Delta Regional Basin, Nigeria (Illustrative Region)',
    scale: '14.8 km Drainage Arterials // 450-Hectare Upstream Urban Catchment',
    timeframe: '30-Month Infrastructure Program',
    primaryImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
        caption: 'Engineered trapezoidal open drainage canal lined with erosion-resistant textured rip-rap.',
        alt: 'Civil drainage channel and modern environmental earthworks',
      },
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
        caption: 'Pre-cast reinforced concrete box culvert installation underneath arterial municipal roadway.',
        alt: 'Heavy civil infrastructure culvert installation',
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
        caption: 'Downstream urban district protected from seasonal flash flooding events.',
        alt: 'Urban city skyline protected by civil engineering infrastructure',
      },
    ],
    overview:
      'This infrastructure case study exemplifies civil engineering solutions designed for high-rainfall tropical basins. Facing recurrent flooding and severe road pavement erosion during the wet season, the project requires advanced hydrologic catchment modeling (HEC-RAS). The engineering design encompasses a connected network of lined canals, twin reinforced concrete box culverts, retention swales, and energy dissipators discharging into natural regional watercourses.',
    objectives: [
      'Alleviate chronic seasonal flash flooding across an urban zone accommodating 85,000 residents and key commercial transit routes.',
      'Engineered hydraulic capacity sized for a 1-in-50-year storm event plus 20% climate change resilience factor.',
      'Prevent severe gullies and road embankment washout through hydraulic energy dissipation basins.',
      'Integrate natural sediment traps minimizing siltation in downstream agricultural and mangrove waterways.',
    ],
    challenges: [
      'Extremely flat terrain gradients (average slope < 0.15%), requiring precise hydraulic optimization to prevent standing stagnation.',
      'High seasonal water table causing buoyancy uplift pressures on empty culverts during dry excavation.',
      'Complex coordination with existing subterranean utility conduits (telecom fibers, high-pressure gas, water mains).',
    ],
    approach: [
      '2D Hydraulic Modeling: Simulated watershed rainfall-runoff hydrographs using continuous high-resolution satellite topography data.',
      'Pre-Cast Culvert Standardization: Specified factory-controlled precast culvert sections with interlocking rubber gaskets, accelerating road crossing execution.',
      'Geotextile Silt Filtration: Implemented permeable woven geotextile underlay beneath stone pitching to stop fine soil washout.',
    ],
    stages: [
      {
        number: '01',
        phase: 'Hydrological Assessment',
        title: 'Catchment Topography & Rainfall Modeling',
        description: 'Analysis of 30-year meteorological rainfall records, watershed boundaries, and soil permeability parameters.',
        deliverables: ['Hydrologic catchment calculation report', 'Peak flood discharge model', 'Channel sizing matrix'],
      },
      {
        number: '02',
        phase: 'Civil Engineering Design',
        title: 'Hydraulic Profiles & Structural Detailing',
        description: 'Longitudinal gradient modeling, box culvert structural reinforcement, and outfall velocity dissipation design.',
        deliverables: ['Plan and profile civil drawings', 'Structural culvert reinforcement details', 'Utility relocation plan'],
      },
      {
        number: '03',
        phase: 'Contractor Procurement',
        title: 'Heavy Civil Tender & Specifications',
        description: 'Preparation of civil engineering BoQ per POMI Civil, technical earthwork specifications, and prequalification.',
        deliverables: ['Civil engineering tender dossier', 'Bidders assessment report', 'Material compliance specs'],
      },
      {
        number: '04',
        phase: 'Site Commissioning',
        title: 'Culvert Proof Testing & Flow Validation',
        description: 'Post-construction water flow rate testing, joint watertightness checks, and maintenance manual handover.',
        deliverables: ['As-built hydraulic survey', 'Drainage maintenance operational manual', 'Municipal handover cert'],
      },
    ],
    technicalConsiderations: [
      {
        parameter: 'Design Storm Frequency',
        specification: '50-Year Return Period with 15-minute time of concentration (Rational Method)',
        notes: 'Additional 300mm freeboard incorporated on open channel bank heights as safety margin.',
      },
      {
        parameter: 'Manning Roughness Coefficient (n)',
        specification: 'n = 0.014 for smooth troweled in-situ concrete; n = 0.025 for rip-rap swales',
        notes: 'Velocity maintained between 0.9 m/s (self-cleansing) and 2.8 m/s (scour avoidance).',
      },
      {
        parameter: 'Culvert Flotation Factor of Safety',
        specification: 'Buoyancy safety factor ≥ 1.25 against 100-year groundwater level',
        notes: 'Counterbalanced using extended base slab toe anchors and compacted granular backfill.',
      },
      {
        parameter: 'Erosion Dissipation',
        specification: 'USBR Type III Stilling Basin with baffle piers at channel outfall',
        notes: 'Reduces exit water kinetic energy by 68% prior to discharge into natural riverbed.',
      },
    ],
    badge: 'ILLUSTRATIVE PROJECT CONCEPT',
  },
];

export const PROJECT_CASE_STUDIES: ProjectCaseStudy[] = RAW_PROJECT_CASE_STUDIES.map((p) => ({
  ...p,
  description: p.overview,
  completionDate: 'Illustrative Reference Benchmark',
  projectImages: p.galleryImages,
  projectStatus: 'Reference Benchmark',
  verificationStatus: 'illustrative_reference',
}));
