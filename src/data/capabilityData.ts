/**
 * VOLIA NIG LTD — Corporate Capability Statement Structured Data
 * 
 * IMPORTANT COMPLIANCE DIRECTIVE:
 * This data structure feeds both the web presentation at /company-profile
 * and the vector-crisp downloadable Corporate Capability Statement PDF.
 * In strict compliance with commercial integrity standards:
 * - Directors, staff biographies, revenues, client lists, and awards are omitted.
 * - Reported 1993 incorporation remains subject to formal management confirmation.
 * - Portfolio items are marked as illustrative reference typologies.
 */

export interface CapabilitySection {
  id: string;
  number: string;
  title: string;
  kicker: string;
  leadParagraph: string;
  detailedPoints: {
    heading: string;
    description: string;
  }[];
  complianceNote?: string;
}

export const CAPABILITY_STATEMENT_DATA = {
  documentMeta: {
    code: 'VOLIA-CAP-2026-V1',
    title: 'CORPORATE CAPABILITY STATEMENT',
    subtitle: 'Multidisciplinary Built-Environment & Engineering Advisory Mandate',
    edition: '2026 Pitch Prototype Edition',
    status: 'PROVISIONAL // COMMERCIAL PRESENTATION SPECIMEN',
    companyName: 'VOLIA NIG LTD',
    descriptor: 'ENGINEERING & CONSULTANCY',
    incorporationCaveat:
      'Reported incorporation: 1993 [Subject to formal executive management verification prior to publication]',
    headquarters: 'Central Business District, Abuja, FCT, Nigeria [Provisional Physical Address]',
    regionalLiaison: 'Lagos State Commercial Corridor, Nigeria [Provisional Liaison Office]',
    contactEmail: 'inquiries@volia.ng',
    contactPhone: '+234 (0) 1 000 0000',
  },

  overview: {
    statement:
      'VOLIA NIG LTD is a multidisciplinary Nigerian built-environment and engineering consultancy delivering integrated structural engineering advisory, architectural planning, and commercial cost governance for institutional, commercial, and infrastructure developments.',
    mandate:
      'Our practice exists to provide uncompromised technical integrity, statutory compliance defense, and commercial discipline across the entire asset delivery lifecycle. We bridge conceptual design aspirations with rigorous construction realities.',
    corePillars: [
      {
        title: 'Technical Precision',
        detail: 'Applying finite element modeling, empirical geotechnical analysis, and statutory engineering codes to ensure structural durability.',
      },
      {
        title: 'Commercial Stewardship',
        detail: 'Protecting capital outlays through rigorous quantity takeoff, market fluctuation formulas, and certified interim valuations.',
      },
      {
        title: 'Contextual Architecture',
        detail: 'Designing low-energy, passive solar building envelopes tailored to the unique microclimates of West Africa.',
      },
      {
        title: 'Statutory Governance',
        detail: 'Enforcing strict compliance with the Nigerian National Building Code, COREN guidelines, and international standards.',
      },
    ],
  },

  background: {
    historyNote:
      'Reported incorporated in 1993, the practice has maintained a sustained focus on built-environment excellence in Nigeria. (Formal company history, corporate registry documents, and statutory filing certificates remain subject to final executive management verification).',
    governanceModel:
      'The practice operates under an independent advisory governance model, eliminating conflicts of interest by maintaining strict separation between consultancy design advisory and commercial construction contracting.',
  },

  services: [
    {
      code: 'SVC-01',
      name: 'Engineering Consultancy',
      focus: 'Structural Analysis, Civil Systems & Statutory Code Governance',
      scopeItems: [
        'Finite Element Analysis (FEA) and dynamic live load structural modeling',
        'Reinforced concrete, post-tensioned systems, and structural steel framing appraisal',
        'Geotechnical investigation interpretation, deep foundation pile matrix design, and earth retaining systems',
        'Civil stormwater catchment modeling, arterial drainage design, and site grading optimization',
        'Independent third-party structural audit, defect investigation, and remedial engineering advisory',
      ],
    },
    {
      code: 'SVC-02',
      name: 'Architectural Consultancy',
      focus: 'Master Planning, Passive Tropical Design & Built-Environment Strategy',
      scopeItems: [
        'Strategic programmatic spatial planning, feasibility zoning, and brief formulation',
        'Passive tropical envelope design, solar fenestration, and natural stack-effect airflow modeling',
        'Detailed architectural construction schematics, material durability specifications, and life-safety integration',
        'Mixed-use civic master planning, infrastructure zoning, and phased development roadmaps',
        'Regulatory statutory building plan submission documentation and development control defense',
      ],
    },
    {
      code: 'SVC-03',
      name: 'Quantity Surveying',
      focus: 'Cost Engineering, BoQ Preparation & Post-Contract Commercial Administration',
      scopeItems: [
        'Preliminary capital feasibility modeling, elemental cost planning, and parameter budgeting',
        'Preparation of unassailable itemized Bills of Quantities (BoQ) per BESMM4 / POMI standards',
        'Procurement strategy formulation, contractor pre-qualification, and normalized tender evaluation',
        'Interim site measurement, payment certification, and contractual variation management',
        'Final account reconciliation, claims analysis, and project close-out financial audits',
      ],
    },
  ],

  methodology: [
    {
      phase: 'Phase 01',
      title: 'Preliminary Feasibility & Site Analysis',
      deliverables: 'Geotechnical parameter review, site zoning appraisal, preliminary elemental cost model, and risk register.',
    },
    {
      phase: 'Phase 02',
      title: 'Scheme Design & Statutory Coordination',
      deliverables: 'Architectural massing, structural framing concept, statutory planning compliance dossier, and updated cost plan.',
    },
    {
      phase: 'Phase 03',
      title: 'Detailed Engineering & Cost Takeoff',
      deliverables: 'Full structural FEA calculations, 1:20 construction details, priced Bills of Quantities, and tender bid dossiers.',
    },
    {
      phase: 'Phase 04',
      title: 'Construction Oversight & Financial Audit',
      deliverables: 'Resident engineering supervision, mandatory pour permits, interim valuation certificates, and final account audit.',
    },
  ],

  portfolioNotice:
    'All referenced projects in this capability statement serve as illustrative benchmark typologies demonstrating technical scope and capacity. Verified client commission retrospectives will be incorporated following formal executive clearance.',

  complianceDisclaimer:
    'This capability statement is a commercial presentation document prepared for corporate pitch purposes. Formal corporate filings, director appointments, verified tax compliance certs, and certified statutory licenses will be provided upon formal engagement request.',
};
