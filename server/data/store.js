/**
 * VOLIA NIG LTD — Express Backend Data Store
 * In-memory operational store with realistic Nigerian engineering and architecture recruitment data.
 */

import crypto from 'crypto';

// Default password hash for administrative accounts: "Password123!"
const DEFAULT_PASSWORD_HASH = crypto.createHash('sha256').update('Password123!').digest('hex');

// Admin users with preconfigured roles
export const users = [
  {
    id: 'usr-1',
    name: 'Engr. Babatunde Alabi',
    email: 'admin@volia.ng',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'super_admin',
    title: 'Managing Director & Head of Practice',
    department: 'Executive & Operations',
    token: 'volia-token-super-admin-001',
    permissions: ['all'],
  },
  {
    id: 'usr-2',
    name: 'Amina Bello, MNIA',
    email: 'hr@volia.ng',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'hr_admin',
    title: 'People & Talent Lead',
    department: 'Executive & Operations',
    token: 'volia-token-hr-admin-002',
    permissions: ['jobs:manage', 'applications:manage', 'interviews:manage', 'candidates:view'],
  },
  {
    id: 'usr-3',
    name: 'Tariq Ibrahim',
    email: 'recruiter@volia.ng',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'recruiter',
    title: 'Senior Technical Recruiter',
    department: 'People & Talent',
    token: 'volia-token-recruiter-003',
    permissions: ['applications:review', 'interviews:schedule', 'candidates:view'],
  },
  {
    id: 'usr-4',
    name: 'Chukwuemeka Okonkwo, FNSE',
    email: 'interviewer@volia.ng',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'interviewer',
    title: 'Chief Structural Engineer & Panel Lead',
    department: 'Engineering',
    token: 'volia-token-interviewer-004',
    permissions: ['interviews:evaluate', 'applications:view'],
  },
];

// Jobs collection
export let jobs = [
  {
    id: 'job-str-01',
    slug: 'senior-structural-engineer-bridges-tall-buildings',
    title: 'Senior Structural Engineer (Bridges & Tall Buildings)',
    department: 'Engineering',
    location: 'Abuja, FCT (Central Business District)',
    type: 'full_time',
    employmentType: 'full_time',
    workArrangement: 'on_site',
    experienceLevel: 'senior',
    status: 'published',
    featured: true,
    overview:
      'Lead finite element modeling, structural wind response analysis, and seismic stability verifications for institutional high-rise and complex bridge commissions across Nigeria.',
    description:
      'We require an exceptional Senior Structural Engineer to spearhead analysis and detail engineering on signature commercial towers and post-tensioned spans. You will collaborate directly with principal architects and ensure compliance with Eurocodes, BS 8110, and Nigerian National Building Code standards.',
    responsibilities: [
      'Perform linear and non-linear dynamic analysis of high-rise concrete and steel structures using ETABS, SAP2000, and Tekla.',
      'Supervise the generation of rebar detail schedules and structural steel fabrication shop drawings.',
      'Interface with geotechnical specialists to evaluate deep pile foundation configurations under challenging strata.',
      'Conduct rigorous structural peer reviews and lead engineering site inspections during critical pours.',
      'Mentor junior project engineers and direct BIM drafting teams in Revit Structure.',
    ],
    requirements: [
      'B.Eng. or B.Sc. in Civil or Structural Engineering (Minimum Second Class Upper).',
      'Active registration with the Council for the Regulation of Engineering in Nigeria (COREN) with valid practice seal.',
      'Corporate Membership of Nigerian Society of Engineers (MNSE) or Nigerian Institution of Civil Engineers (MNICE).',
      'Minimum of 8 years post-qualification consultancy experience in multi-storey and infrastructure design.',
      'Documented delivery track record on at least two multi-storey structures exceeding 10 storeys.',
    ],
    qualifications: [
      'B.Eng. or B.Sc. in Civil or Structural Engineering.',
      'COREN Registration (Active Seal).',
      'Corporate Membership of NSE / NICE.',
    ],
    experienceRequirements: [
      '8+ years post-NYSC structural engineering consultancy experience.',
      'Proven lead role on towers exceeding 10 storeys or span structures > 35m.',
    ],
    skills: [
      'ETABS & SAP2000 Dynamic Analysis',
      'Revit Structure & BIM 360',
      'Eurocode 2, 3, and BS 8110 Compliance',
      'Post-Tensioned Concrete Detailing',
      'Deep Foundation & Bored Pile Engineering',
    ],
    salaryInformation: 'Competitive executive consultancy package commensurate with professional accreditation and project track record',
    remunerationNote: 'Competitive executive consultancy package commensurate with professional accreditation and project track record.',
    openingsCount: 2,
    applicationCount: 14,
    publicationDate: '2026-10-15T08:00:00Z',
    publishedAt: '2026-10-15T08:00:00Z',
    closingDate: '2026-12-15T23:59:59Z',
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: '2026-10-15T08:00:00Z',
  },
  {
    id: 'job-arc-02',
    slug: 'lead-project-architect-institutional-complexes',
    title: 'Lead Project Architect (Institutional Complexes)',
    department: 'Architecture',
    location: 'Abuja, FCT',
    type: 'full_time',
    employmentType: 'full_time',
    workArrangement: 'hybrid',
    experienceLevel: 'lead',
    status: 'published',
    featured: true,
    overview:
      'Direct the spatial realization and comprehensive BIM documentation of civic headquarters, university masterplans, and diplomatic enclaves with uncompromising tropical modernism aesthetic.',
    description:
      'Seeking a visionary Lead Architect capable of guiding commissions from masterplanning concepts through design development, ARCON statutory approvals, and precision construction administration.',
    responsibilities: [
      'Spearhead concept design and architectural narratives for major institutional and civic projects.',
      'Direct architectural teams in producing fully coordinated BIM models in Revit and Archicad.',
      'Coordinate multidisciplinary consultants including MEP, structural, facade, and acoustic engineers.',
      'Lead design presentation sessions with institutional client boards and statutory planning authorities.',
      'Oversee architectural material selections and facade mock-up testing.',
    ],
    requirements: [
      'B.Arch. or M.Arch. from an ARCON-accredited institution.',
      'Active registration with Architects Registration Council of Nigeria (ARCON) with practice license.',
      'Corporate Member of the Nigerian Institute of Architects (MNIA).',
      '10+ years experience with documented portfolio of built institutional architecture.',
    ],
    qualifications: [
      'B.Arch / M.Arch degree.',
      'ARCON full professional registration with current license.',
      'MNIA corporate membership.',
    ],
    skills: [
      'Revit BIM Coordination',
      'Parametric Facade Design',
      'ARCON Regulatory Submissions',
      'Sustainable Tropical Architecture',
    ],
    remunerationNote: 'Top-tier consultancy partner-track package with project performance bonus.',
    openingsCount: 1,
    applicationCount: 9,
    publicationDate: '2026-10-20T08:00:00Z',
    publishedAt: '2026-10-20T08:00:00Z',
    createdAt: '2026-10-19T14:30:00Z',
    updatedAt: '2026-10-20T08:00:00Z',
  },
  {
    id: 'job-qs-03',
    slug: 'senior-quantity-surveyor-cost-engineering',
    title: 'Senior Quantity Surveyor (Cost Engineering & BoQ)',
    department: 'Quantity Surveying',
    location: 'Abuja, FCT',
    type: 'full_time',
    employmentType: 'full_time',
    workArrangement: 'on_site',
    experienceLevel: 'senior',
    status: 'published',
    featured: false,
    overview:
      'Responsible for total cost management, elemental cost planning, preparation of rigorous Bills of Quantities (BESMM4), and procurement contract administration for premier capital projects.',
    description:
      'The Senior Quantity Surveyor guarantees budgetary certainty throughout pre-contract and post-contract lifecycle stages.',
    responsibilities: [
      'Prepare comprehensive Bills of Quantities adhering strictly to BESMM4 / NRM2 standards.',
      'Develop detailed pre-tender cost estimates, lifecycle cost models, and value-engineering recommendations.',
      'Evaluate contractor tender submissions and draft tender recommendation reports.',
      'Administer monthly valuation certificates and final account negotiations.',
    ],
    requirements: [
      'B.Sc. in Quantity Surveying or Construction Economics.',
      'Active corporate membership with NIQS and professional registration with QSRBN.',
      '7+ years in commercial quantity surveying consultancy.',
    ],
    qualifications: [
      'B.Sc. Quantity Surveying.',
      'Registered Quantity Surveyor with QSRBN.',
      'MNIQS Corporate Member.',
    ],
    skills: ['BESMM4 BoQ Measurement', 'CostX / WinQS', 'FIDIC / JCT Contracts'],
    remunerationNote: 'Market-leading consultancy remuneration + performance incentives.',
    openingsCount: 2,
    applicationCount: 18,
    publicationDate: '2026-10-22T08:00:00Z',
    publishedAt: '2026-10-22T08:00:00Z',
    createdAt: '2026-10-21T09:15:00Z',
    updatedAt: '2026-10-22T08:00:00Z',
  },
  {
    id: 'job-pm-04',
    slug: 'senior-project-manager-capital-works',
    title: 'Senior Project Manager (Capital Works)',
    department: 'Project Management',
    location: 'Lagos / Abuja',
    type: 'contract',
    employmentType: 'contract',
    workArrangement: 'on_site',
    experienceLevel: 'senior',
    status: 'published',
    featured: false,
    overview:
      'Oversee commercial project delivery, master schedule tracking, contractor milestone compliance, and multi-tier quality assurance for high-value developments.',
    description:
      'Lead project operations on site, managing safety, contractual timelines, risk mitigation, and client milestone delivery.',
    responsibilities: [
      'Develop integrated master project schedules using Primavera P6 and MS Project.',
      'Enforce quality control procedures and site safety protocols.',
      'Manage stakeholder communications, risk registers, and weekly progress briefings.',
    ],
    requirements: [
      'B.Sc. in Construction Management, Civil Engineering, or Architecture.',
      'PMP or PRINCE2 Practitioner certification.',
      '8+ years demonstrated project management on major commercial builds.',
    ],
    qualifications: ['B.Sc. Construction / Engineering', 'PMP / PRINCE2'],
    skills: ['Primavera P6', 'Risk Management', 'FIDIC Administration'],
    remunerationNote: 'Executive contract package with milestone performance bonus.',
    openingsCount: 1,
    applicationCount: 11,
    publicationDate: '2026-10-25T08:00:00Z',
    publishedAt: '2026-10-25T08:00:00Z',
    createdAt: '2026-10-24T11:00:00Z',
    updatedAt: '2026-10-25T08:00:00Z',
  },
];

// Candidates registry
export let candidates = [
  {
    id: 'cand-001',
    fullName: 'Oluwaseun Adeyemi, MNSE',
    email: 'seun.adeyemi@example.com',
    phone: '+234 803 456 7890',
    currentLocation: 'Lagos, Nigeria',
    currentTitle: 'Lead Structural Analysis Engineer at ArchiStruct Ltd',
    yearsOfExperience: 9,
    highestDegree: 'M.Sc. Structural Engineering (University of Lagos)',
    professionalAccreditation: 'COREN Registered (R.48291), MNSE',
    noticePeriodWeeks: 4,
    linkedInUrl: 'https://linkedin.com/in/seun-adeyemi-consulting',
    portfolioUrl: 'https://seun-structures.example.com',
  },
  {
    id: 'cand-002',
    fullName: 'Arc. Fatima Abubakar, MNIA',
    email: 'fatima.abubakar@example.com',
    phone: '+234 802 345 6789',
    currentLocation: 'Abuja, Nigeria',
    currentTitle: 'Associate Principal at Studio Sahel Architects',
    yearsOfExperience: 11,
    highestDegree: 'M.Arch. (Ahmadu Bello University, Zaria)',
    professionalAccreditation: 'ARCON Registered (F.1894), MNIA',
    noticePeriodWeeks: 6,
    linkedInUrl: 'https://linkedin.com/in/fatima-abubakar-arch',
    portfolioUrl: 'https://fatima-portfolio.example.com',
  },
  {
    id: 'cand-003',
    fullName: 'Nnamdi Okeke, MNIQS',
    email: 'nnamdi.okeke@example.com',
    phone: '+234 806 789 0123',
    currentLocation: 'Port Harcourt, Nigeria',
    currentTitle: 'Senior Commercial Consultant at Coastal Cost Partners',
    yearsOfExperience: 8,
    highestDegree: 'B.Sc. Quantity Surveying (FUTO)',
    professionalAccreditation: 'QSRBN Registered (R.2104), MNIQS',
    noticePeriodWeeks: 2,
    linkedInUrl: 'https://linkedin.com/in/nnamdi-okeke-qs',
  },
  {
    id: 'cand-004',
    fullName: 'Khadijah Sanusi, PMP',
    email: 'khadijah.sanusi@example.com',
    phone: '+234 809 111 2233',
    currentLocation: 'Abuja, Nigeria',
    currentTitle: 'Senior Project Coordinator at Apex Prime Developments',
    yearsOfExperience: 7,
    highestDegree: 'B.Eng. Civil Engineering (Bayero University Kano)',
    professionalAccreditation: 'COREN Registered (R.53201), PMP Certified',
    noticePeriodWeeks: 4,
    linkedInUrl: 'https://linkedin.com/in/khadijah-sanusi-pmp',
  },
  {
    id: 'cand-005',
    fullName: 'Engr. Emeka Nwosu, MNSE',
    email: 'emeka.nwosu@example.com',
    phone: '+234 803 777 8899',
    currentLocation: 'Enugu / Abuja',
    currentTitle: 'Senior Principal Consultant at GeoBridge Nigeria',
    yearsOfExperience: 12,
    highestDegree: 'Ph.D. Civil & Structural Engineering (UNN)',
    professionalAccreditation: 'COREN Registered (R.31092), FNSE',
    noticePeriodWeeks: 2,
    linkedInUrl: 'https://linkedin.com/in/emeka-nwosu-phd',
  },
  {
    id: 'cand-006',
    fullName: 'Arc. Zainab Danjuma, MNIA',
    email: 'zainab.danjuma@example.com',
    phone: '+234 805 222 4455',
    currentLocation: 'Kaduna / Abuja',
    currentTitle: 'Lead Design Architect at Sahel Spatial Partners',
    yearsOfExperience: 9,
    highestDegree: 'M.Sc. Architecture (ABU Zaria)',
    professionalAccreditation: 'ARCON Registered (F.2301), MNIA',
    noticePeriodWeeks: 4,
    linkedInUrl: 'https://linkedin.com/in/zainab-danjuma-arch',
  },
  {
    id: 'cand-007',
    fullName: 'Ibrahim Bello',
    email: 'ibrahim.bello@example.com',
    phone: '+234 812 333 7788',
    currentLocation: 'Kano, Nigeria',
    currentTitle: 'Assistant Quantity Surveyor at Northern Builders Ltd',
    yearsOfExperience: 2,
    highestDegree: 'HND Quantity Surveying (Kano Poly)',
    noticePeriodWeeks: 1,
  },
];

// Applications collection
export let applications = [
  {
    id: 'app-001',
    jobId: 'job-str-01',
    jobTitle: 'Senior Structural Engineer (Bridges & Tall Buildings)',
    jobDepartment: 'Engineering',
    candidate: candidates[0],
    coverLetter:
      'Having delivered three 14+ storey reinforced concrete towers in Victoria Island and Ikoyi, my expertise in Eurocode 2 compliance and post-tensioned floor systems directly aligns with VOLIA’s architectural rigor.',
    resume: {
      id: 'doc-001',
      name: 'Oluwaseun_Adeyemi_CV_2026.pdf',
      sizeBytes: 1845000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-18T11:20:00Z',
      downloadEndpoint: '/api/v1/admin/applications/app-001/document/resume',
    },
    stage: 'interview',
    rating: 5,
    stageHistory: [
      {
        stage: 'applied',
        changedById: 'system',
        changedByName: 'Candidate Submission',
        changedAt: '2026-10-18T11:20:00Z',
      },
      {
        stage: 'shortlisted',
        changedById: 'usr-2',
        changedByName: 'Amina Bello, MNIA',
        changedAt: '2026-10-20T09:15:00Z',
        note: 'Excellent portfolio of 14-storey structures. COREN registration verified.',
      },
      {
        stage: 'interview',
        changedById: 'usr-3',
        changedByName: 'Tariq Ibrahim',
        changedAt: '2026-10-24T14:00:00Z',
        note: 'Advanced to structural panel interview with Engr. Chukwuemeka Okonkwo.',
      },
    ],
    notes: [
      {
        id: 'note-01',
        authorId: 'usr-2',
        authorName: 'Amina Bello, MNIA',
        content: 'Candidate has proven experience in post-tensioned slab designs and dynamic wind load modeling.',
        isPrivate: false,
        createdAt: '2026-10-20T09:30:00Z',
      },
    ],
    interviews: ['int-001'],
    appliedAt: '2026-10-18T11:20:00Z',
    updatedAt: '2026-10-24T14:00:00Z',
  },
  {
    id: 'app-002',
    jobId: 'job-arc-02',
    jobTitle: 'Lead Project Architect (Institutional Complexes)',
    jobDepartment: 'Architecture',
    candidate: candidates[1],
    coverLetter:
      'My architectural philosophy aligns with VOLIA’s devotion to structural honesty and environmental performance. Over 11 years, I have directed civic masterplans across northern Nigeria.',
    resume: {
      id: 'doc-002',
      name: 'Arc_Fatima_Abubakar_Resume.pdf',
      sizeBytes: 2410000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-22T14:45:00Z',
      downloadEndpoint: '/api/v1/admin/applications/app-002/document/resume',
    },
    portfolioDocument: {
      id: 'doc-002-p',
      name: 'Fatima_Abubakar_Curated_Portfolio.pdf',
      sizeBytes: 4890000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-22T14:48:00Z',
      downloadEndpoint: '/api/v1/admin/applications/app-002/document/portfolio',
    },
    stage: 'shortlisted',
    rating: 5,
    stageHistory: [
      {
        stage: 'applied',
        changedById: 'system',
        changedByName: 'Candidate Submission',
        changedAt: '2026-10-22T14:45:00Z',
      },
      {
        stage: 'shortlisted',
        changedById: 'usr-2',
        changedByName: 'Amina Bello, MNIA',
        changedAt: '2026-10-25T11:00:00Z',
        note: 'Outstanding design portfolio. ARCON license active.',
      },
    ],
    notes: [],
    interviews: [],
    appliedAt: '2026-10-22T14:45:00Z',
    updatedAt: '2026-10-25T11:00:00Z',
  },
  {
    id: 'app-003',
    jobId: 'job-qs-03',
    jobTitle: 'Senior Quantity Surveyor (Cost Engineering & BoQ)',
    jobDepartment: 'Quantity Surveying',
    candidate: candidates[2],
    coverLetter:
      'I offer rigorous cost engineering and BoQ preparation under BESMM4. Having defended project final accounts on institutional developments valued at over ₦3 Billion, I bring fiscal precision to VOLIA.',
    resume: {
      id: 'doc-003',
      name: 'Nnamdi_Okeke_MNIQS_CV.pdf',
      sizeBytes: 1250000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-26T09:10:00Z',
      downloadEndpoint: '/api/v1/admin/applications/app-003/document/resume',
    },
    stage: 'applied',
    rating: 4,
    stageHistory: [
      {
        stage: 'applied',
        changedById: 'system',
        changedByName: 'Candidate Submission',
        changedAt: '2026-10-26T09:10:00Z',
      },
    ],
    notes: [],
    interviews: [],
    appliedAt: '2026-10-26T09:10:00Z',
    updatedAt: '2026-10-26T09:10:00Z',
  },
  {
    id: 'app-004',
    jobId: 'job-pm-04',
    jobTitle: 'Senior Project Manager (Capital Works)',
    jobDepartment: 'Project Management',
    candidate: candidates[3],
    coverLetter:
      'I possess a 7-year track record leading commercial builds with Primavera P6 and FIDIC contract supervision.',
    resume: {
      id: 'doc-004',
      name: 'Khadijah_Sanusi_Resume_2026.pdf',
      sizeBytes: 1560000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-28T16:00:00Z',
      downloadEndpoint: '/api/v1/admin/applications/app-004/document/resume',
    },
    stage: 'screening',
    rating: 4,
    stageHistory: [
      {
        stage: 'applied',
        changedById: 'system',
        changedByName: 'Candidate Submission',
        changedAt: '2026-10-28T16:00:00Z',
      },
      {
        stage: 'screening',
        changedById: 'usr-3',
        changedByName: 'Tariq Ibrahim',
        changedAt: '2026-11-01T10:00:00Z',
        note: 'Dossier undergoing structural compliance and experience verification.',
      },
    ],
    notes: [],
    interviews: ['int-002'],
    assignedRecruiter: { id: 'usr-3', name: 'Tariq Ibrahim' },
    appliedAt: '2026-10-28T16:00:00Z',
    updatedAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 'app-005',
    jobId: 'job-str-01',
    jobTitle: 'Senior Structural Engineer (Bridges & Tall Buildings)',
    jobDepartment: 'Engineering',
    candidate: candidates[4],
    coverLetter:
      'With over a decade leading deep-foundation bridge projects and complex commercial towers, I bring rigorous peer review standards and COREN certification to VOLIA.',
    resume: {
      id: 'doc-005',
      name: 'Dr_Emeka_Nwosu_FNSE_CV.pdf',
      sizeBytes: 2100000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-15T12:00:00Z',
      downloadEndpoint: '/api/v1/admin/applications/app-005/document/resume',
    },
    stage: 'offer',
    rating: 5,
    assignedRecruiter: { id: 'usr-2', name: 'Amina Bello, MNIA' },
    stageHistory: [
      {
        stage: 'applied',
        changedById: 'system',
        changedByName: 'Candidate Submission',
        changedAt: '2026-10-15T12:00:00Z',
      },
      {
        stage: 'shortlisted',
        changedById: 'usr-2',
        changedByName: 'Amina Bello, MNIA',
        changedAt: '2026-10-18T10:00:00Z',
      },
      {
        stage: 'interview',
        changedById: 'usr-3',
        changedByName: 'Tariq Ibrahim',
        changedAt: '2026-10-22T15:00:00Z',
      },
      {
        stage: 'offer',
        changedById: 'usr-1',
        changedByName: 'Engr. Babatunde Alabi',
        changedAt: '2026-11-02T16:30:00Z',
        note: 'Managing partner approved offer of senior structural leadership engagement.',
      },
    ],
    notes: [
      {
        id: 'note-05',
        authorId: 'usr-1',
        authorName: 'Engr. Babatunde Alabi',
        content: 'Candidate passed partner defense with distinction. Competitive partner-track remuneration approved.',
        isPrivate: false,
        createdAt: '2026-11-02T16:35:00Z',
      },
    ],
    interviews: ['int-003'],
    appliedAt: '2026-10-15T12:00:00Z',
    updatedAt: '2026-11-02T16:30:00Z',
  },
  {
    id: 'app-006',
    jobId: 'job-arc-02',
    jobTitle: 'Lead Project Architect (Institutional Complexes)',
    jobDepartment: 'Architecture',
    candidate: candidates[5],
    coverLetter:
      'My 9-year portfolio includes high-profile institutional headquarters in Abuja and Kaduna, coordinated in Revit BIM and compliant with ARCON codes.',
    resume: {
      id: 'doc-006',
      name: 'Arc_Zainab_Danjuma_Dossier.pdf',
      sizeBytes: 3200000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-09-10T09:00:00Z',
      downloadEndpoint: '/api/v1/admin/applications/app-006/document/resume',
    },
    stage: 'hired',
    rating: 5,
    assignedRecruiter: { id: 'usr-2', name: 'Amina Bello, MNIA' },
    stageHistory: [
      {
        stage: 'applied',
        changedById: 'system',
        changedByName: 'Candidate Submission',
        changedAt: '2026-09-10T09:00:00Z',
      },
      {
        stage: 'interview',
        changedById: 'usr-2',
        changedByName: 'Amina Bello, MNIA',
        changedAt: '2026-09-20T11:00:00Z',
      },
      {
        stage: 'offer',
        changedById: 'usr-1',
        changedByName: 'Engr. Babatunde Alabi',
        changedAt: '2026-10-01T14:00:00Z',
      },
      {
        stage: 'hired',
        changedById: 'usr-2',
        changedByName: 'Amina Bello, MNIA',
        changedAt: '2026-10-15T09:00:00Z',
        note: 'Contract executed. Onboarding commenced in Abuja studio.',
      },
    ],
    notes: [],
    interviews: [],
    appliedAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'app-007',
    jobId: 'job-qs-03',
    jobTitle: 'Senior Quantity Surveyor (Cost Engineering & BoQ)',
    jobDepartment: 'Quantity Surveying',
    candidate: candidates[6],
    coverLetter:
      'Assistant quantity surveyor seeking advancement into commercial consultancy role.',
    resume: {
      id: 'doc-007',
      name: 'Ibrahim_Bello_Resume.pdf',
      sizeBytes: 850000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-25T14:00:00Z',
      downloadEndpoint: '/api/v1/admin/applications/app-007/document/resume',
    },
    stage: 'rejected',
    rating: 2,
    assignedRecruiter: { id: 'usr-3', name: 'Tariq Ibrahim' },
    stageHistory: [
      {
        stage: 'applied',
        changedById: 'system',
        changedByName: 'Candidate Submission',
        changedAt: '2026-10-25T14:00:00Z',
      },
      {
        stage: 'rejected',
        changedById: 'usr-3',
        changedByName: 'Tariq Ibrahim',
        changedAt: '2026-10-27T10:00:00Z',
        note: 'Years of post-qualification experience (2 yrs) does not meet mandatory Senior QS specification (7+ yrs).',
      },
    ],
    notes: [],
    interviews: [],
    appliedAt: '2026-10-25T14:00:00Z',
    updatedAt: '2026-10-27T10:00:00Z',
  },
];

// Interviews collection
export let interviews = [
  {
    id: 'int-001',
    applicationId: 'app-001',
    candidateName: 'Oluwaseun Adeyemi, MNSE',
    jobTitle: 'Senior Structural Engineer (Bridges & Tall Buildings)',
    interviewType: 'technical_assessment',
    interviewerNames: ['Chukwuemeka Okonkwo, FNSE', 'Amina Bello, MNIA'],
    scheduledAt: '2026-11-14T10:00:00Z',
    durationMinutes: 60,
    mode: 'in_person_abuja',
    meetingDetails: 'Conference Room 3B, VOLIA Head Office, Abuja',
    status: 'scheduled',
    feedbackSummary: 'Deep structural calculations review and Eurocode 2 parametric test scheduled.',
    createdAt: '2026-10-24T14:00:00Z',
  },
  {
    id: 'int-002',
    applicationId: 'app-004',
    candidateName: 'Khadijah Sanusi, PMP',
    jobTitle: 'Senior Project Manager (Capital Works)',
    interviewType: 'partner_interview',
    interviewerNames: ['Engr. Babatunde Alabi', 'Amina Bello, MNIA'],
    scheduledAt: '2026-11-15T14:30:00Z',
    durationMinutes: 45,
    mode: 'virtual_secure_meeting',
    meetingDetails: 'Encrypted Executive Video Conference (Link delivered via secure email)',
    status: 'scheduled',
    createdAt: '2026-11-01T10:00:00Z',
  },
];

// Enquiries & Consultation leads
export let enquiries = [];

// Valid Stage Transitions Engine (Phase 07)
export const VALID_STAGE_TRANSITIONS = {
  applied: ['screening', 'rejected'],
  screening: ['shortlisted', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview: ['assessment', 'offer', 'rejected'],
  assessment: ['interview', 'offer', 'rejected'],
  offer: ['hired', 'rejected'],
  hired: [],
  rejected: ['screening', 'shortlisted'], // Reopen with justification
};

// Interview structured feedback collection
export let interviewFeedback = [
  {
    id: 'fb-001',
    interviewId: 'int-001',
    applicationId: 'app-001',
    interviewerId: 'usr-4',
    interviewerName: 'Chukwuemeka Okonkwo, FNSE',
    technicalCompetency: 5,
    communication: 4,
    relevantExperience: 5,
    problemSolving: 5,
    roleSuitability: 5,
    strengths:
      'Mastery of finite element dynamic analysis in ETABS, profound grasp of post-tensioned beam tendons and wind shear walls.',
    concerns: 'Notice period of 4 weeks must be accounted for in commissioning timetable.',
    comments:
      'Candidate has actively stamped multi-storey commercial towers in Victoria Island. High engineering caliber.',
    recommendation: 'strongly_recommend',
    submittedAt: '2026-11-05T16:00:00Z',
  },
];

// In-app notifications collection
export let notifications = [
  {
    id: 'notif-01',
    userId: 'all_hr',
    type: 'application_received',
    title: 'New Commission Application',
    message: 'Nnamdi Okeke submitted an application for Senior Quantity Surveyor (Cost Engineering).',
    relatedEntityId: 'app-003',
    relatedEntityType: 'application',
    isRead: false,
    createdAt: '2026-10-26T09:10:00Z',
  },
  {
    id: 'notif-02',
    userId: 'usr-4',
    type: 'interview_invitation',
    title: 'Assigned to Evaluation Panel',
    message: 'You have been assigned to evaluate Oluwaseun Adeyemi for Senior Structural Engineer.',
    relatedEntityId: 'int-001',
    relatedEntityType: 'interview',
    isRead: false,
    createdAt: '2026-10-24T14:05:00Z',
  },
  {
    id: 'notif-03',
    userId: 'all_hr',
    type: 'feedback_submitted',
    title: 'Technical Evaluation Submitted',
    message: 'Engr. Chukwuemeka Okonkwo submitted feedback for candidate Oluwaseun Adeyemi: Strongly Recommend.',
    relatedEntityId: 'int-001',
    relatedEntityType: 'interview',
    isRead: true,
    createdAt: '2026-11-05T16:00:00Z',
  },
];

// Notification preferences per user
export let notificationPreferences = [
  {
    id: 'pref-01',
    userId: 'usr-1',
    emailEnabled: true,
    inAppEnabled: true,
    notifyOnStatusChange: true,
    notifyOnInterviewScheduled: true,
    notifyOnFeedbackSubmitted: true,
  },
  {
    id: 'pref-02',
    userId: 'usr-2',
    emailEnabled: true,
    inAppEnabled: true,
    notifyOnStatusChange: true,
    notifyOnInterviewScheduled: true,
    notifyOnFeedbackSubmitted: true,
  },
  {
    id: 'pref-03',
    userId: 'usr-3',
    emailEnabled: true,
    inAppEnabled: true,
    notifyOnStatusChange: true,
    notifyOnInterviewScheduled: true,
    notifyOnFeedbackSubmitted: true,
  },
  {
    id: 'pref-04',
    userId: 'usr-4',
    emailEnabled: true,
    inAppEnabled: true,
    notifyOnStatusChange: false,
    notifyOnInterviewScheduled: true,
    notifyOnFeedbackSubmitted: true,
  },
];

/**
 * Validates whether an interviewer has a scheduling conflict.
 * Returns null if no conflict, or the conflicting interview object if a conflict exists.
 */
export const checkInterviewerConflict = ({
  interviewerNames,
  interviewerIds,
  scheduledAt,
  durationMinutes = 60,
  excludeInterviewId,
}) => {
  const start = new Date(scheduledAt).getTime();
  const end = start + durationMinutes * 60 * 1000;

  for (const item of interviews) {
    if (excludeInterviewId && item.id === excludeInterviewId) continue;
    if (item.status === 'cancelled') continue;

    const itemStart = new Date(item.scheduledAt).getTime();
    const itemEnd = itemStart + (item.durationMinutes || 60) * 60 * 1000;

    // Check time overlap: (start < itemEnd) && (end > itemStart)
    const isOverlapping = start < itemEnd && end > itemStart;
    if (!isOverlapping) continue;

    // Check if interviewers overlap
    const namesOverlap =
      Array.isArray(interviewerNames) &&
      interviewerNames.some((name) =>
        item.interviewerNames?.some(
          (existing) => existing.toLowerCase().trim() === name.toLowerCase().trim()
        )
      );

    const idsOverlap =
      Array.isArray(interviewerIds) &&
      interviewerIds.some((id) => item.interviewerIds?.includes(id));

    if (namesOverlap || idsOverlap) {
      return item;
    }
  }

  return null;
};

// Audit logs
export let auditLogs = [
  {
    id: 'aud-001',
    actorId: 'usr-2',
    actorName: 'Amina Bello, MNIA',
    action: 'APPLICATION_STAGE_CHANGED',
    entityType: 'application',
    entityId: 'app-001',
    details: 'Advanced candidate Oluwaseun Adeyemi to Interview stage.',
    ipAddress: '197.210.54.12',
    timestamp: '2026-10-24T14:00:00Z',
  },
  {
    id: 'aud-002',
    actorId: 'usr-3',
    actorName: 'Tariq Ibrahim',
    action: 'INTERVIEW_SCHEDULED',
    entityType: 'interview',
    entityId: 'int-001',
    details: 'Scheduled Technical Assessment with Engr. Chukwuemeka Okonkwo.',
    ipAddress: '197.210.54.18',
    timestamp: '2026-10-24T14:05:00Z',
  },
];
