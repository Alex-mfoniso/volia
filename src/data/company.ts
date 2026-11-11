import type { CompanyMeta, NavItem } from '@/types';

/**
 * Verified & Provisional Business Metadata for VOLIA NIG LTD.
 * Publicly indexed scope: Engineering consultancy, architectural consultancy, and quantity surveying.
 * Note: Historical incorporation in 1993 remains subject to formal management confirmation.
 */
export const COMPANY_DATA: CompanyMeta = {
  name: 'VOLIA',
  legalName: 'VOLIA NIG LTD',
  tagline: 'Engineering & Built-Environment Consultancy',
  descriptor: 'ENGINEERING & CONSULTANCY',
  summary:
    'Multidisciplinary Nigerian consultancy providing integrated engineering consultancy, architectural consultancy, and quantity surveying with precision, structural integrity, and commercial discipline.',
  publicScope: [
    'Engineering Consultancy',
    'Architectural Consultancy',
    'Quantity Surveying',
  ],
  incorporationNote:
    'Reported incorporation: 1993 [Subject to formal verification by management prior to public release]',
  contactPlaceholder: {
    email: 'inquiries@volia.ng', // Provisional contact channel
    phone: '+234 (0) 1 000 0000', // Provisional contact channel
    locationNote: 'Nigeria [Corporate physical address to be confirmed via CAC / corporate filings]',
  },
};

export const NAVIGATION_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Careers', href: '/careers' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

export interface DetailedService {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  detailedOverview: string;
  typicalScope: {
    phase: string;
    items: string[];
  }[];
  methodologyNotes: string[];
  imageUrl: string;
  imageAlt: string;
  figure: string;
}

export const SERVICES_DETAILED: DetailedService[] = [
  {
    id: 'engineering-consultancy',
    number: '01',
    title: 'Engineering Consultancy',
    subtitle: 'Structural Analysis, Civil Systems & Technical Governance',
    summary:
      'Rigorous structural engineering appraisal, civil infrastructure evaluation, and technical advisory services. We analyze structural loads, geotechnical parameters, and mechanical systems to ensure lasting integrity and statutory compliance.',
    detailedOverview:
      'Our engineering consultancy practice advises developers, institutions, and infrastructure clients on the physical feasibility and structural resilience of complex developments. Operating strictly within statutory Nigerian building codes and international engineering norms, we conduct peer reviews, diagnostic structural condition assessments, and technical verification to eliminate risk before capital deployment.',
    typicalScope: [
      {
        phase: 'Structural Analysis & Design Advisory',
        items: [
          'Load modeling and finite element structural verification',
          'Reinforced concrete, structural steel, and composite design appraisal',
          'Foundation selection based on site-specific geotechnical investigations',
          'Vibration analysis and seismic/wind drift evaluation',
        ],
      },
      {
        phase: 'Civil & Environmental Systems',
        items: [
          'Site grading, stormwater drainage, and catchment hydrology modeling',
          'Access road geometry, pavement structure, and traffic circulation',
          'Water supply, treatment infrastructure, and reticulation advisory',
          'Erosion control and civil earthwork stabilization',
        ],
      },
      {
        phase: 'Technical Governance & Compliance',
        items: [
          'Statutory regulatory compliance reviews (Nigerian Building Code)',
          'Independent third-party structural audit and peer review',
          'Construction stage site engineering supervision and QA/QC oversight',
          'Defect investigation, structural diagnostics, and remedial guidance',
        ],
      },
    ],
    methodologyNotes: [
      'Empirical load verification avoiding over-design or structural vulnerability',
      'Geotechnical integration aligning subsurface behavior with superstructures',
      'Independent advisory position eliminating commercial contractor bias',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'High-precision steel geometric truss and structural engineering framing',
    figure: 'FIG. ENG-01',
  },
  {
    id: 'architectural-consultancy',
    number: '02',
    title: 'Architectural Consultancy',
    subtitle: 'Spatial Strategy, Master Planning & Built-Environment Design',
    summary:
      'Transforming complex development briefs into cohesive spatial architecture. Our consultancy focuses on programmatic logic, passive environmental design, climatic adaptability for the West African context, and refined spatial aesthetics.',
    detailedOverview:
      'Architectural consultancy at VOLIA NIG LTD balances spatial utility, contextual sensitivity, and construction viability. We work closely with stakeholders to translate organizational requirements into enduring architectural master plans. Every scheme is engineered to respond naturally to tropical sunlight, ventilation pathways, and long-term operating costs.',
    typicalScope: [
      {
        phase: 'Concept & Programmatic Development',
        items: [
          'Functional spatial programming and stakeholder brief formulation',
          'Site zoning, orientation analysis, and climatic sun-path modeling',
          'Conceptual massing, volumetric studies, and circulation diagrams',
          'Initial statutory planning and zoning compliance verification',
        ],
      },
      {
        phase: 'Detailed Architectural Schematics',
        items: [
          'Comprehensive architectural planning and dimensioned layouts',
          'Building envelope design, solar fenestration, and shading integration',
          'Specification of high-performance, durable, and local materials',
          'Acoustic separation, accessibility, and fire life-safety integration',
        ],
      },
      {
        phase: 'Master Planning & Urban Built Environment',
        items: [
          'Campus, mixed-use, and commercial master planning',
          'Infrastructure zoning and utility easement coordination',
          'Phased development framework formulation',
          'Landscape integration and pedestrian network planning',
        ],
      },
    ],
    methodologyNotes: [
      'Passive tropical climatic design reducing mechanical HVAC dependency',
      'Programmatic logic prioritizing operational efficiency and occupant wellbeing',
      'Material restraint emphasizing maintenance longevity in Nigerian climates',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Modernist concrete cantilever structure with glass facade',
    figure: 'FIG. ARCH-02',
  },
  {
    id: 'quantity-surveying',
    number: '03',
    title: 'Quantity Surveying',
    subtitle: 'Cost Governance, Commercial Controls & Contractual Precision',
    summary:
      'Disciplined commercial management protecting capital investments from inception through handover. We establish accurate bills of quantities, financial forecasting, tender evaluation, and post-contract cost administration.',
    detailedOverview:
      'Capital developments require uncompromising commercial discipline to safeguard investment returns against market volatility and scope creep. Our quantity surveying practice provides definitive cost modeling, rigorous tender evaluation, and ongoing financial audits. We ensure contractual agreements remain transparent, equitable, and legally binding.',
    typicalScope: [
      {
        phase: 'Pre-Contract Cost Planning & Estimating',
        items: [
          'Preliminary feasibility cost studies and benchmark financial modeling',
          'Elemental cost plans and value engineering advisory',
          'Preparation of detailed Bills of Quantities (BOQ) per standard methods',
          'Life-cycle cost appraisal and material cost sensitivity modeling',
        ],
      },
      {
        phase: 'Procurement & Tender Administration',
        items: [
          'Procurement route recommendation (Traditional, Design-Build, Management)',
          'Tender documentation preparation and contractor pre-qualification',
          'Comprehensive tender evaluation and commercial bid reporting',
          'Contract drafting and statutory documentation finalization',
        ],
      },
      {
        phase: 'Post-Contract Commercial Administration',
        items: [
          'Interim site measurement and contractor valuation certification',
          'Variation management, change-order appraisal, and cost tracking',
          'Contractual dispute advisory and claims analysis',
          'Final account negotiation, reconciliation, and project close-out audit',
        ],
      },
    ],
    methodologyNotes: [
      'Standard Method of Measurement compliance for airtight tender docs',
      'Rigorous variance tracking preventing unauthorized budget overruns',
      'Fiduciary commitment protecting client balance sheets throughout delivery',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Architectural drawings, measurement instruments and cost planning documents',
    figure: 'FIG. QS-03',
  },
];

export interface PhilosophyPillar {
  title: string;
  description: string;
  tag: string;
}

export const PHILOSOPHY_PILLARS: PhilosophyPillar[] = [
  {
    title: 'Technical Precision',
    description:
      'Applying exact mathematical models, engineering standards, and statutory codes to ensure every structural calculation withstands physical and environmental demands.',
    tag: 'Standard 01',
  },
  {
    title: 'Thoughtful Planning',
    description:
      'Aligning spatial layout, functional requirements, and lifecycle efficiency before ground is broken to prevent costly redesigns and delays.',
    tag: 'Standard 02',
  },
  {
    title: 'Professional Execution',
    description:
      'Maintaining unwavering ethics, meticulous site supervision, and transparent reporting throughout every consultancy phase.',
    tag: 'Standard 03',
  },
  {
    title: 'Responsible Project Delivery',
    description:
      'Upholding commercial stewardship, environmental responsibility, and long-term durability for investors, occupants, and communities.',
    tag: 'Standard 04',
  },
];

export interface ProjectReferenceItem {
  id: string;
  category: 'Engineering' | 'Architecture' | 'Construction' | 'Built Environment';
  title: string;
  subtitle: string;
  focus: string;
  typology: string;
  figure: string;
  imageUrl: string;
  imageAlt: string;
  specs?: {
    scope: string;
    structuralType: string;
    scale: string;
  };
}

export const PROJECT_PORTFOLIO_REFERENCES: ProjectReferenceItem[] = [
  {
    id: 'eng-01',
    category: 'Engineering',
    title: 'Long-Span Structural Grid & Facade Framing',
    subtitle: 'High-load commercial atrium and load-bearing framing',
    focus: 'Reinforced concrete post-tensioning, load distribution, and column-free spans for institutional public gathering spaces.',
    typology: 'Structural Engineering Reference',
    figure: 'REF. ENG-01',
    imageUrl:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Structural concrete interior atrium with geometric roof truss',
    specs: {
      scope: 'Post-Tensioned Frame & Load Distribution Analysis',
      structuralType: 'Reinforced High-Strength Concrete',
      scale: 'Institutional Public Atrium Specimen',
    },
  },
  {
    id: 'arch-01',
    category: 'Architecture',
    title: 'Monolithic Cantilever & Spatial Envelope',
    subtitle: 'Passive solar shading and minimalist spatial envelope',
    focus: 'Programmatic spatial balance, climatic solar shading, and material restraint adapted for tropical sun angles.',
    typology: 'Architectural Design Reference',
    figure: 'REF. ARCH-01',
    imageUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Minimalist contemporary architectural pavilion with clean geometric lines',
    specs: {
      scope: 'Climatic Envelope & Volumetric Massing',
      structuralType: 'Exposed Monolithic Concrete & Glazing',
      scale: 'Low-Energy Modernist Pavilion',
    },
  },
  {
    id: 'const-01',
    category: 'Construction',
    title: 'Precision Structural Jointing & Concrete Placement',
    subtitle: 'Cast-in-place architectural concrete detailing',
    focus: 'Formwork tolerance verification, structural reinforcement inspection, and quality assurance during critical placement phases.',
    typology: 'Construction Supervision Reference',
    figure: 'REF. CONST-01',
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Engineers reviewing site structural measurements with instruments',
    specs: {
      scope: 'Site QA/QC & Statutory Code Compliance',
      structuralType: 'Cast-In-Place Reinforced Concrete',
      scale: 'Commercial Site Superstructure',
    },
  },
  {
    id: 'env-01',
    category: 'Built Environment',
    title: 'High-Density Mixed-Use Civic Envelope',
    subtitle: 'Multi-tiered commercial and civic master planning',
    focus: 'Integrated MEP coordination, cost-controlled material assemblies, pedestrian circulation, and life-safety systems.',
    typology: 'Built Environment Master Reference',
    figure: 'REF. ENV-01',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Curved glass and architectural stone commercial high-rise tower',
    specs: {
      scope: 'Urban Master Planning & Utility Integration',
      structuralType: 'Composite Steel-Concrete Core',
      scale: 'High-Density Urban District',
    },
  },
  {
    id: 'eng-02',
    category: 'Engineering',
    title: 'Subsurface Geotechnical & Retaining Matrix',
    subtitle: 'Deep foundation piles and earthwork stability',
    focus: 'Multi-layer basement retaining systems and water table depression advisory in challenging alluvial Nigerian soils.',
    typology: 'Civil & Geotechnical Reference',
    figure: 'REF. ENG-02',
    imageUrl:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Deep structural engineering scaffolding and steel framework',
    specs: {
      scope: 'Geotechnical Borehole & Secant Pile Analysis',
      structuralType: 'Continuous Bored Piles & Ground Anchors',
      scale: 'Subsurface Deep Basement Engineering',
    },
  },
  {
    id: 'arch-02',
    category: 'Architecture',
    title: 'Modular Facade Screen & Climate Shading',
    subtitle: 'Bespoke brise-soleil and ventilated envelope',
    focus: 'Low-energy architectural skin mitigating solar radiation while maintaining natural daylighting and ventilation.',
    typology: 'Envelope Architecture Reference',
    figure: 'REF. ARCH-02',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Modern architectural building facade with concrete overhangs',
    specs: {
      scope: 'Parametric Shading & Passive Envelope',
      structuralType: 'Extruded Aluminum & Concrete Louvers',
      scale: 'Commercial Facade System',
    },
  },
  {
    id: 'const-02',
    category: 'Construction',
    title: 'Contractual Valuation & Quantity Verification',
    subtitle: 'On-site progress audits and material reconciliation',
    focus: 'Rigorous measurement of executed work against approved bills of quantities for certified interim payment certificates.',
    typology: 'Quantity Auditing Reference',
    figure: 'REF. CONST-02',
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Technical measurement tools and architectural plans on site',
    specs: {
      scope: 'Bills of Quantities & Interim Valuation Audit',
      structuralType: 'Standard Method of Measurement (SMM7/POMI)',
      scale: 'Multi-Contract Commercial Development',
    },
  },
  {
    id: 'env-02',
    category: 'Built Environment',
    title: 'Sustainable Infrastructure & Stormwater Drainage',
    subtitle: 'Civic water management and resilient surface engineering',
    focus: 'Large-scale stormwater discharge canals, flood risk alleviation, and civil infrastructure planning for high-rainfall regions.',
    typology: 'Infrastructure Systems Reference',
    figure: 'REF. ENV-02',
    imageUrl:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Textured architectural surface and linear structural drainage',
    specs: {
      scope: 'Hydrologic Runoff & Catchment Modeling',
      structuralType: 'Reinforced Culvert & Swale Systems',
      scale: 'Municipal Surface Infrastructure',
    },
  },
];
