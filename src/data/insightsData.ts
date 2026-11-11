/**
 * VOLIA NIG LTD — Technical Resource & Insights Repository
 * 
 * IMPORTANT COMPLIANCE NOTICE:
 * The articles and technical monographs in this repository represent demonstration
 * editorial samples designed to illustrate the knowledge-sharing architecture of VOLIA NIG LTD.
 * These sample articles are subject to executive editorial review and clearance before
 * formal publication.
 */

export type InsightCategory =
  | 'Engineering Insights'
  | 'Architecture'
  | 'Construction Planning'
  | 'Quantity Surveying'
  | 'Industry Knowledge';

export interface InsightSection {
  heading: string;
  body: string[];
  callout?: string;
  figure?: {
    caption: string;
    number: string;
  };
}

export interface InsightArticle {
  id: string;
  slug: string;
  category: InsightCategory;
  title: string;
  summary: string;
  readTime: string;
  publishedDate: string;
  authorRole: string;
  coverImage: string;
  coverAlt: string;
  featured: boolean;
  keyTakeaways: string[];
  sections: InsightSection[];
  relatedSlugs: string[];
  badge: 'DEMONSTRATION TECHNICAL MONOGRAPH';
}

export const INSIGHT_CATEGORIES: ('All' | InsightCategory)[] = [
  'All',
  'Engineering Insights',
  'Architecture',
  'Construction Planning',
  'Quantity Surveying',
  'Industry Knowledge',
];

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    id: 'art-01',
    slug: 'post-tensioned-concrete-economics-west-africa',
    category: 'Engineering Insights',
    title: 'Post-Tensioned Concrete in High-Rise Floor Systems: Structural Economics for the West African Context',
    summary:
      'An empirical analysis evaluating how unbonded and bonded post-tensioned floor slabs reduce structural steel tonnage, reduce foundation load requirements, and compress construction cycles in Nigerian commercial developments.',
    readTime: '7 min read',
    publishedDate: 'November 2026',
    authorRole: 'Structural Advisory Directorate',
    coverImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
    coverAlt: 'Structural concrete steel reinforcement framing in construction',
    featured: true,
    keyTakeaways: [
      'Post-tensioning achieves a 20% to 28% reduction in structural dead weight compared to traditional cast-in-place beam-and-slab systems.',
      'Thinner floor slabs (down to 200–240mm) enable an extra usable floor within statutory municipal building height limits.',
      'Mitigates early-age shrinkage and tensile cracking in high-ambient temperature environments common in Nigeria.',
      'Requires certified post-tensioning specialist subcontractors and stringent hydraulic jack calibration protocols.',
    ],
    sections: [
      {
        heading: '1. The Gravity Load Challenge in Urban High-Density Centers',
        body: [
          'In major urban commercial centers like Lagos, Abuja, and Port Harcourt, geotechnical soil bearing capacities frequently dictate structural feasibility. Alluvial soils, high water tables, and deep bedrock layers place immense economic premiums on building self-weight.',
          'Conventional reinforced concrete flat slabs often require depths exceeding 300mm to 350mm to satisfy span-to-depth deflection limits over modern 9-meter by 9-meter commercial grids. This dead weight translates exponentially down into foundation pile diameters, cap depths, and seismic shear wall requirements.',
        ],
        callout:
          '“Every ton of unnecessary dead weight engineered into an elevated floor slab requires roughly 0.35 tons of additional foundation capacity in poor coastal soils.”',
      },
      {
        heading: '2. Mechanics of Prestressed Equilibrium',
        body: [
          'Post-tensioning introduces intentional compressive stresses into the concrete matrix prior to the application of service live loads. High-tensile steel strands (typically 12.7mm or 15.7mm Grade 270) are placed in parabolic profiles matching the bending moment diagrams.',
          'When stressed by hydraulic jacks, the upward vertical component of tendon curvature balances up to 80% of the sustained dead load. Consequently, the concrete remains in compression across both top and bottom fibers, virtually eliminating micro-fissuring and deflection creep.',
        ],
        figure: {
          number: 'FIG. 1.1',
          caption: 'Parabolic post-tensioned tendon profile balancing gravitational bending moments.',
        },
      },
      {
        heading: '3. Commercial & Lifecycle Financial Appraisal',
        body: [
          'From a quantity surveying perspective, post-tensioning reduces rebar weight from an average of 110–130 kg/m³ down to 45–65 kg/m³ of conventional reinforcement, complemented by 3.5–5.0 kg/m³ of post-tensioning strand. In times of volatile rebar pricing, this material substitution provides substantial capital buffer.',
          'Furthermore, early-age stripping of formwork (typically when concrete achieves 70% characteristic compressive strength, roughly 72 hours post-pour) enables developers to cycle formwork every 5 to 7 days rather than the traditional 14-day cycle, saving months on the critical path schedule.',
        ],
      },
      {
        heading: '4. Supervisory Quality Governance on Site',
        body: [
          'The superior structural performance of post-tensioned concrete depends entirely on execution precision. Elongation measurements must match theoretical computer modeling within ±5%. Grouting of ducts must utilize non-shrink thixotropic grout to prevent interstitial moisture accumulation and corrosion in coastal maritime air.',
          'Independent engineering oversight during tendon placement, jack calibration, and stressing remains non-negotiable for project stakeholders.',
        ],
      },
    ],
    relatedSlugs: ['quantity-surveying-inflationary-volatility', 'passive-tropical-architecture-nigerian-climate'],
    badge: 'DEMONSTRATION TECHNICAL MONOGRAPH',
  },
  {
    id: 'art-02',
    slug: 'passive-tropical-architecture-nigerian-climate',
    category: 'Architecture',
    title: 'Passive Climatic Envelope Design: Mitigating HVAC Dependency in West African Commercial Architecture',
    summary:
      'Strategies for building envelopes that harness solar geometry, natural aerodynamic pressure differentials, and thermal mass to achieve occupant comfort while dramatically curtailing diesel generator operating expenditures.',
    readTime: '6 min read',
    publishedDate: 'November 2026',
    authorRole: 'Architectural & Master Planning Practice',
    coverImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    coverAlt: 'Modernist concrete cantilever structure with glass facade and shading',
    featured: true,
    keyTakeaways: [
      'Solar orientation aligned within 15° of the East-West axis cuts direct envelope solar irradiation by over 40%.',
      'Engineered horizontal brise-soleil and deep roof cantilevers protect glass surfaces between 10:00 and 16:00.',
      'Stack-effect ventilation through central atriums exhausts sensible heat gains without motorized mechanical fans.',
      'Low-E double glazing must prioritize a low Solar Heat Gain Coefficient (SHGC ≤ 0.28) over thermal U-value in tropical latitudes.',
    ],
    sections: [
      {
        heading: '1. The Energy Imperative of Nigerian Built Realities',
        body: [
          'In West Africa, energy reliability remains a central design determinant. Commercial office buildings often devote over 60% of their operational operating expenditures to diesel generator fuel directly servicing chilled-water HVAC systems.',
          'Designing an all-glass curtain wall building without consideration of local solar angles is an operational liability. Architecture must function as the primary environmental filter, utilizing geometry, thermal mass, and envelope physics before mechanical chillers are engaged.',
        ],
        callout:
          '“A building that relies 100% on mechanical refrigeration to remain habitable during a power interruption is an engineered failure of architectural strategy.”',
      },
      {
        heading: '2. Solar Geometry & Microclimate Orientation',
        body: [
          'Nigeria’s geographical position between latitudes 4°N and 14°N means the sun traverses almost directly overhead year-round, with distinct northern and southern zenith inclinations depending on the season. East and west facades receive intense low-angle solar rays that penetrate deep into building floorplates.',
          'By orienting long facades along the east-west axis and treating east/west end walls as solid service cores or heavily shaded buffers, the peak cooling load can be reduced by 25% to 35% before specifying glazing.',
        ],
      },
      {
        heading: '3. Fenestration, Shading & Glazing Physics',
        body: [
          'Glass specifications for tropical environments require fundamentally different optical metrics than temperate European products. While European codes prioritize low U-values to retain heat during winter, tropical architecture demands aggressive solar control: a Solar Heat Gain Coefficient (SHGC) under 0.28, accompanied by high visible light transmittance (VLT > 60%) to eliminate the need for artificial daytime lighting.',
          'Exterior horizontal overhangs and vertical stone or terra-cotta louvers provide physical shading that stops heat before it contacts the building envelope, outperforming internal blinds by a factor of three.',
        ],
      },
    ],
    relatedSlugs: ['post-tensioned-concrete-economics-west-africa', 'infrastructure-stormwater-resilience-delta'],
    badge: 'DEMONSTRATION TECHNICAL MONOGRAPH',
  },
  {
    id: 'art-03',
    slug: 'quantity-surveying-inflationary-volatility',
    category: 'Quantity Surveying',
    title: 'Commercial Governance in Volatile Markets: Dynamic Cost Planning and Fluctuation Formulas for Nigerian Capital Projects',
    summary:
      'A practical framework for quantity surveyors and developers to structure resilient construction contracts, index-linked fluctuation clauses, and contingency drawdown rules against currency and materials inflation.',
    readTime: '8 min read',
    publishedDate: 'October 2026',
    authorRole: 'Quantity Surveying & Commercial Advisory',
    coverImage:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85',
    coverAlt: 'Cost engineering documents, architectural plans, and calculations',
    featured: false,
    keyTakeaways: [
      'Fixed-price lump-sum contracts in high-inflation environments create contractor insolvency risks that jeopardize project completion.',
      'FIDIC-based fluctuation clauses linked to National Bureau of Statistics (NBS) indices provide transparent and equitable cost adjustments.',
      'Elemental cost modeling should bifurcate packages into domestic currency components versus foreign-exchange dependent plant.',
      'Milestone payment certifications must be coupled with strict physical joint measurement protocols on site.',
    ],
    sections: [
      {
        heading: '1. The Fallacy of the Rigid Fixed-Price Contract',
        body: [
          'During periods of macroeconomic stability, lump-sum turnkey contracts offer developers apparent cost certainty. However, in emerging markets subject to severe currency devaluation and 30%+ inflation in cement and rebar prices, a fixed-price contract merely transfers risk to the contractor until financial insolvency forces work stoppage.',
          'When a contractor abandons a site at 40% completion, the financial cost to re-tender and remediate degraded structural elements inevitably far exceeds whatever savings the client sought to lock in.',
        ],
        callout:
          '“A contract that bankrupts the contractor ultimately bankrupts the project timeline. Commercial discipline requires equitable, measurable mechanisms for volatility sharing.”',
      },
      {
        heading: '2. Structuring Equitable Price Fluctuation Formulas',
        body: [
          'Best practice in Nigerian commercial developments utilizes objective price adjustment formulas based on recognized industry indices, such as FIDIC Clause 13.8 or bespoke institutional forms. By establishing baseline weightings for labor, structural steel, cement, aggregates, and diesel fuel at tender award, subsequent price adjustments are calculated through pure mathematical indexing.',
          'This eliminates subjective contractor claims, speculative markups, and protracted dispute litigation during construction.',
        ],
      },
      {
        heading: '3. Strategic Procurement & Early Plant Buyout',
        body: [
          'For long-lead imported mechanical and electrical equipment—such as commercial chillers, backup generators, high-speed elevators, and building management systems—quantity surveyors must advise clients to execute early procurement commitments backed by secure off-site escrow or letter of credit guarantees.',
          'Early purchase locks in exchange rates, protects against factory lead-time extensions, and ensures equipment arrives in synchronization with structural frame progress.',
        ],
      },
    ],
    relatedSlugs: ['post-tensioned-concrete-economics-west-africa', 'construction-quality-supervision-nigeria'],
    badge: 'DEMONSTRATION TECHNICAL MONOGRAPH',
  },
  {
    id: 'art-04',
    slug: 'construction-quality-supervision-nigeria',
    category: 'Construction Planning',
    title: 'Site Supervision Protocols: Preventing Structural Failures Through Resident Engineering Oversight',
    summary:
      'An engineering protocol guide outlining mandatory pre-pour inspection checklists, batching plant audits, concrete cube verification regimes, and the enforcement of the Nigerian National Building Code on site.',
    readTime: '6 min read',
    publishedDate: 'October 2026',
    authorRole: 'Site Operations & Structural Oversight',
    coverImage:
      'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1600&q=85',
    coverAlt: 'Engineers on construction site reviewing measurements with precision instruments',
    featured: false,
    keyTakeaways: [
      'Over 75% of catastrophic structural failures in urban centers stem from unauthorized on-site design modifications and substandard materials.',
      'Mandatory "Permit-to-Pour" procedures stop concrete placement until rebar lap lengths, cover spacers, and shutter cleanliness are verified.',
      'Batching plant verification must include regular calibration of aggregate weigh-batchers and water-cement dosing sensors.',
      'Formwork striking times must be governed by actual compressive cube test breaks, never by arbitrary calendar days.',
    ],
    sections: [
      {
        heading: '1. Root Causes of Built-Environment Structural Failures',
        body: [
          'The unfortunate occurrence of building collapses in rapidly growing urban centers underscores the critical role of independent, resident engineering supervision. Forensic investigations demonstrate that failures rarely result from theoretical calculation errors by registered structural engineers.',
          'Instead, failure modes almost invariably occur at the transition from paper to site: unauthorized substitution of rebar diameters, insufficient concrete cover leading to rapid rebar corrosion, premature removal of formwork shoring, and poor compaction creating extensive honeycombing.',
        ],
        callout:
          '“Engineering design is only as durable as the supervisory rigor that enforces it on site every morning.”',
      },
      {
        heading: '2. The Uncompromising Pre-Pour Inspection Protocol',
        body: [
          'A robust site governance protocol requires that the contractor submit a formal Request for Inspection (RFI) a minimum of 24 hours prior to any planned concrete placement. The resident engineering team inspects the steel reinforcement cage against structural bending schedules, checking bar diameter, spacing, hook dimensions, and lap lengths.',
          'Equally critical is the placement of certified concrete spacer blocks (matching parent concrete strength) to guarantee statutory fire-rating and durability cover.',
        ],
      },
      {
        heading: '3. Testing & Documentation Audit Trails',
        body: [
          'Every concrete batch arriving on site must undergo immediate slump testing. A strict protocol dictates sampling: six standard 150mm test cubes taken for every 50m³ of concrete poured. Two cubes are crushed at 7 days to establish early-strength trajectory, and three at 28 days to verify characteristic strength.',
          'All records are digitized into an immutable audit trail, providing statutory protection for owners, engineers, and municipal authorities.',
        ],
      },
    ],
    relatedSlugs: ['post-tensioned-concrete-economics-west-africa', 'quantity-surveying-inflationary-volatility'],
    badge: 'DEMONSTRATION TECHNICAL MONOGRAPH',
  },
  {
    id: 'art-05',
    slug: 'infrastructure-stormwater-resilience-delta',
    category: 'Industry Knowledge',
    title: 'Civil Drainage and Sustainable Urban Drainage Systems (SuDS) in High-Precipitation Tropical Basins',
    summary:
      'Designing civil drainage networks capable of withstanding intense monsoon rainfall events through retention swales, siphonic outfalls, and sediment-controlled regional canals in West Africa.',
    readTime: '7 min read',
    publishedDate: 'September 2026',
    authorRole: 'Civil Infrastructure & Water Resources Directorate',
    coverImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    coverAlt: 'Modern drainage canals, civil engineering, and environmental infrastructure',
    featured: false,
    keyTakeaways: [
      'Traditional concrete open drains frequently fail in low-gradient coastal areas due to rapid siltation and inadequate hydraulic velocity.',
      'SuDS retention basins mitigate peak runoff discharge by attenuating storm surges before they reach arterial watercourses.',
      'Catchment modeling must integrate a minimum 20% resilience allowance for climate-induced intense precipitation anomalies.',
      'Siphonic and submerged outfalls require backflow prevention tide gates in coastal delta estuaries.',
    ],
    sections: [
      {
        heading: '1. The Hydrological Challenge of Tropical Monsoons',
        body: [
          'Coastal and riverine regions in West Africa regularly experience rainfall intensities exceeding 120mm to 160mm per hour during the monsoon season. In rapidly urbanizing watersheds where permeable green soils are replaced by asphalt and concrete roofs, the runoff coefficient (C) jumps from 0.20 to over 0.85.',
          'The result is severe surface flooding, road embankment erosion, and structural foundation softening across major transit corridors.',
        ],
        callout:
          '“Civil drainage is not simply about moving water away; it is about managing energy, velocity, and catchment equilibrium.”',
      },
      {
        heading: '2. Integrating Sustainable Drainage Systems (SuDS)',
        body: [
          'Rather than attempting to channel all storm runoff into ever-larger concrete trenches that transfer flooding problems to downstream communities, contemporary civil engineering employs decentralized retention and infiltration techniques.',
          'Vegetated swales, permeable pavers in parking areas, and stepped retention basins slow water velocities, facilitate natural groundwater recharge, and filter out suspended road silt before clean discharge occurs.',
        ],
      },
      {
        heading: '3. Hydraulic Longevity & Maintenance Governance',
        body: [
          'The greatest vulnerability of drainage infrastructure is siltation. Designing channels with minimum self-cleansing velocities (≥ 0.9 m/s) prevents sediment settlement during low-flow periods, while energy dissipation basins at outfalls prevent scouring of receiving natural creek beds.',
          'Proper civil infrastructure requires engineering designs that anticipate maintenance realities, incorporating sediment access ramps and standardized precast culvert sections.',
        ],
      },
    ],
    relatedSlugs: ['passive-tropical-architecture-nigerian-climate', 'post-tensioned-concrete-economics-west-africa'],
    badge: 'DEMONSTRATION TECHNICAL MONOGRAPH',
  },
];
