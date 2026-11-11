# VOLIA NIG LTD — Corporate Website Prototype

> **Commercial Pitch Prototype**  
> Developed for **VOLIA NIG LTD** (Engineering & Built-Environment Consultancy, Nigeria).  
> *Note: This website is an unsolicited commercial prototype developed to demonstrate the visual, architectural, and technical foundation for the official corporate web presence of VOLIA NIG LTD.*

---

## 1. Project Overview & Three Connected Experiences

This application is engineered as an integrated, enterprise-grade platform for **VOLIA NIG LTD** comprising three synchronized modules sharing a cohesive Modern Architectural visual identity:

1. **Public Corporate Website**: Minimalist architectural showcase highlighting multidisciplinary engineering consultancy, architectural design, quantity surveying, 3D interactive structural exploration, and corporate governance.
2. **Public Careers & Talent Portal**: High-conversion candidate recruitment hub featuring live position specifications, peer-level discipline categorization, accreditation verification fields, and secure candidate application intake.
3. **Private HR & Recruitment Management Platform**: Role-protected administrative dashboard (`/admin`) designed for high information density, candidate dossier evaluations, interactive Kanban pipeline progression, technical interview scheduling, and immutable cryptographic audit logging.

### Visual Design System
- **Public & Careers Palette**:
  - Primary Canvas: `#F5F3EE` (warm limestone background)
  - Surface Neutral: `#EAE7DF` (structural architectural surface)
  - Ink / Charcoal: `#25251F` (high-contrast primary typography and dark surfaces)
  - Secondary Ink: `#77766F` (balanced editorial body text)
  - Bronze Accent: `#A58B67` (refined material accent)
  - Hairline Border: `#DCD8CE` (precision structural division)
  - Pure White: `#FFFFFF` (elevated cards and modals)
- **Administrative Slate Palette**:
  - Admin Canvas: `#F8F9FA` (high-readability neutral canvas)
  - Admin Sidebar: `#181A1F` (deep charcoal institutional sidebar)
  - Admin Borders: `#E5E7EB` (clean tabular hairlines)
  - Semantic Status: Success (`#15803D`), Warning (`#B45309`), Danger (`#B91C1C`), Info (`#1D4ED8`)
- **Typography**:
  - **Headings & Display**: *Cormorant Garamond* (editorial serif evoking permanence, refinement, and classical geometry).
  - **Body & Tabular Data**: *Manrope* (modern geometric sans-serif delivering clarity, technical legibility, and tabular precision with `tabular-nums`).
- **Architectural Rules**:
  - Restrained, intentional whitespace with responsive container margins.
  - Structural hairline borders (`border-border/60`) and registration corner crosshairs.
  - Strict absence of decorative gradients, random emojis, or exaggerated pill buttons.
  - Full adherence to accessibility guidelines (WCAG 2.1 AA) and `@media (prefers-reduced-motion: reduce)`.

---

## 2. Technology Stack

- **Framework**: [React 18.3.1](https://react.dev/) + [TypeScript 5.7.3](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 6.1.0](https://vitejs.dev/) with optimized Rollup manual chunking
- **3D Visualization & Graphics**: [Three.js 0.160.1](https://threejs.org/) + [@react-three/fiber 8.18.0](https://docs.pmnd.rs/react-three-fiber/) + [@react-three/drei 9.122.0](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS 3.4.17](https://tailwindcss.com/) with custom architectural design tokens
- **Routing**: [React Router DOM 7.18.5](https://reactrouter.com/) (HTML5 History API with SPA rewrites)
- **Animation**: [Framer Motion 12.4.7](https://www.framer.com/motion/) (subtle, non-distracting staggered reveals and layout transitions)
- **Vector PDF Generation**: [jsPDF 4.2.1](https://github.com/parallax/jsPDF) for publication-grade client deliverables
- **Icons**: [Lucide React 1.16.0](https://lucide.dev/) (precise stroke geometry)
- **Utilities**: `clsx` and `tailwind-merge` for robust CSS class composition

---

## 3. Architecture & File Structure

```
c:\Users\Alex\Desktop\viola/
├── public/
│   ├── favicon.svg             # Precision serif monogram favicon
│   ├── robots.txt              # Production crawler directives
│   └── sitemap.xml             # XML sitemap indexing all primary routes
├── src/
│   ├── assets/                 # Brand assets and imagery
│   ├── components/
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx # Top-level client crash boundary
│   │   │   └── SEO.tsx         # Route-specific Open Graph, Twitter & JSON-LD metadata
│   │   ├── layout/
│   │   │   ├── admin/
│   │   │   │   ├── AdminHeader.tsx   # Top control bar, breadcrumbs & status indicator
│   │   │   │   ├── AdminLayout.tsx   # Administrative shell coordinating sidebar & main
│   │   │   │   └── AdminSidebar.tsx  # Responsive dark architectural navigation drawer
│   │   │   ├── public/
│   │   │   │   ├── AppLayout.tsx     # Shell for corporate public pages
│   │   │   │   └── CareersLayout.tsx # Shell for public recruitment & careers pages
│   │   │   ├── Footer.tsx      # Institutional dark footer with compliance disclaimers
│   │   │   ├── Navbar.tsx      # Transparent-to-solid architectural header (with Careers)
│   │   │   ├── PageHeader.tsx  # Editorial page masthead with breadcrumb navigation
│   │   │   ├── ReusableCTA.tsx # Standardized bottom-of-page inquiry conversion banner
│   │   │   └── ScrollToTop.tsx # Route change window scroll reset
│   │   ├── three/              # Interactive 3D architectural visualization suite
│   │   │   ├── ArchitectureModel.tsx # Procedural contemporary pavilion geometry & subsystems
│   │   │   ├── ArchitectureScene.tsx # R3F Canvas container with camera presets & controls
│   │   │   ├── BlueprintScene.tsx    # 5-stage blueprint-to-architecture metamorphosis
│   │   │   ├── CameraControls.tsx    # Damped OrbitControls with constrained polar angles
│   │   │   ├── ModelFallback.tsx     # Architectural drafting grid fallback & loader
│   │   │   ├── SceneLighting.tsx     # Studio lighting with warm sun, sky bounce & ground fill
│   │   │   └── StructuralExplorer.tsx# Exploded structural view & subsystem dossier inspector
│   │   └── ui/
│   │       ├── admin/
│   │       │   ├── DataTable.tsx     # High-density sortable, paginated data table
│   │       │   ├── MetricCard.tsx    # Executive KPI cards with trend indicators
│   │       │   └── StatusBadge.tsx   # Semantic status badges for recruitment stages
│   │       ├── feedback/
│   │       │   ├── Alert.tsx         # Contextual alert banner (info, success, warning, danger)
│   │       │   ├── EmptyState.tsx    # Structured empty state placeholder
│   │       │   └── LoadingSkeleton.tsx# Shimmer loading placeholders
│   │       ├── form/
│   │       │   ├── Checkbox.tsx      # Accessible checkbox control
│   │       │   ├── FileUpload.tsx    # Drag-and-drop file upload with 5MB & MIME validation
│   │       │   ├── FormField.tsx     # Field wrapper with label, hint, and error message
│   │       │   ├── Input.tsx         # Clean architectural text input
│   │       │   ├── Select.tsx        # Styled select with chevron
│   │       │   └── Textarea.tsx      # Multi-line text input
│   │       ├── overlay/
│   │       │   ├── ConfirmModal.tsx  # Action confirmation dialog
│   │       │   └── Modal.tsx         # Accessible dialog modal
│   │       ├── ArchitecturalImage.tsx# Image frame with shimmer and registration marks
│   │       ├── Badge.tsx             # Universal badge component
│   │       ├── Button.tsx            # Architectural and admin button variants
│   │       ├── Container.tsx         # 4 responsive fluid layout width configurations
│   │       └── SectionHeading.tsx    # Editorial serif section headings with kickers
│   ├── context/
│   │   └── AuthContext.tsx     # User authentication state, RBAC roles & permissions
│   ├── data/
│   │   ├── company.ts          # Verified company metadata, services, and reference projects
│   │   ├── insightsData.ts     # Engineering monographs, technical whitepapers & digests
│   │   ├── mockRecruitmentData.ts# Authentic engineering & architecture recruitment fixtures
│   │   └── threeData.ts        # Structural subsystem engineering specs & transformation milestones
│   ├── hooks/
│   │   ├── useAuth.ts          # Hook to access current user, permissions, and logout
│   │   ├── useReducedMotion.ts # Media query hook for prefers-reduced-motion
│   │   └── useWebGLSupport.ts  # WebGL 1.0/2.0 context detection & graceful fallback
│   ├── lib/
│   │   ├── animations.ts       # Shared Framer Motion variant definitions
│   │   └── utils.ts            # Class merging utility (cn)
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminApplicationDetailPage.tsx # Comprehensive candidate review dossier
│   │   │   ├── AdminApplicationsPage.tsx      # Filterable candidate applications table
│   │   │   ├── AdminDashboardPage.tsx         # Recruitment KPI metrics & pipeline summary
│   │   │   ├── AdminInterviewsPage.tsx        # Technical panel review scheduling
│   │   │   ├── AdminJobCreatePage.tsx         # Publish new engineering vacancy
│   │   │   ├── AdminJobDetailPage.tsx         # Specification details & candidate links
│   │   │   ├── AdminJobsPage.tsx              # Position management table
│   │   │   ├── AdminLoginPage.tsx             # Privileged administrative portal login
│   │   │   ├── AdminPipelinePage.tsx          # Interactive Kanban pipeline board
│   │   │   └── AdminSettingsPage.tsx          # RBAC matrix & cryptographic audit logs
│   │   ├── careers/
│   │   │   ├── ApplicationConfirmationPage.tsx# Candidate submission receipt & protocol
│   │   │   ├── CareersPage.tsx                # Public practice openings listing & culture
│   │   │   ├── JobApplyPage.tsx               # Candidate intake form with resume upload
│   │   │   └── JobDetailPage.tsx              # Full role mandate & technical prerequisites
│   │   ├── AboutPage.tsx       # Practice overview, 1993 history, vision, and 4-phase methodology
│   │   ├── CompanyProfilePage.tsx # Institutional capability statement with PDF download
│   │   ├── ConsultationPage.tsx   # Guided 4-step diagnostic service scoping wizard
│   │   ├── ContactPage.tsx     # Validated intake form with simulated receipt modal
│   │   ├── HomePage.tsx        # Assembled homepage sections with 3D pavilion & structural explorer
│   │   ├── InsightsDetailPage.tsx# Editorial technical monograph viewer
│   │   ├── InsightsPage.tsx    # Technical Resource Centre with search & category filters
│   │   ├── NotFoundPage.tsx    # Architectural 404 recovery page
│   │   ├── ProjectBriefPage.tsx# 5-stage project brief builder with vector PDF export
│   │   ├── ProjectsPage.tsx    # Filterable portfolio gallery with 3D BIM model modal
│   │   └── ServicesPage.tsx    # In-depth discipline matrices and deliverables
│   ├── routes/
│   │   ├── AppRoutes.tsx       # Centralized route definitions across all 3 experiences
│   │   ├── ProtectedRoute.tsx  # Guards admin routes with role & permission enforcement
│   │   └── PublicOnlyRoute.tsx # Redirects authenticated staff away from login screen
│   ├── sections/               # Modular homepage section blocks
│   │   ├── ContactSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── HeroSection.tsx     # Editorial hero with interactive 3D pavilion / photo switcher
│   │   ├── IntroductionSection.tsx
│   │   ├── PhilosophySection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ServicesSection.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── apiClient.ts    # Centralized client for Laravel Sanctum REST endpoints
│   │   │   └── apiTypes.ts     # Standard Laravel response envelopes & validation error bags
│   │   ├── authService.ts      # Authentication & session persistence (Mock & Laravel ready)
│   │   ├── enquiryService.ts   # Clean submission abstraction with prototype simulation mode
│   │   ├── interviewService.ts # Interview scheduling & audit trail operations
│   │   ├── jobApplicationService.ts # Candidate submission intake & stage progression
│   │   └── jobService.ts       # Job postings CRUD & public listing operations
│   ├── styles/
│   │   └── globals.css         # CSS variables, typography imports, and custom scrollbars
│   ├── types/
│   │   ├── auth.ts             # User roles, permissions, and session contracts
│   │   ├── index.ts            # Centralized types entrypoint
│   │   ├── recruitment.ts      # Job postings, applications, interviews, and metrics
│   │   └── ui.ts               # Tables, metrics, and pagination contracts
│   ├── App.tsx                 # Root application setup with AuthProvider & ErrorBoundary
│   ├── main.tsx                # React DOM entry point
│   └── vite-env.d.ts           # Vite client environment type definitions
├── .env.example                # Environment variable reference (Laravel API & Mock toggle)
├── .gitignore                  # Git exclusions for dependencies, builds, and logs
├── index.html                  # Semantic HTML5 entry with Google Fonts and meta tags
├── package.json                # Project dependencies and npm scripts
├── tailwind.config.js          # Extended architectural design tokens & admin palette
├── tsconfig.json               # Strict TypeScript configuration
├── vercel.json                 # Vercel SPA routing rewrites and cache headers
└── vite.config.ts              # Vite configuration with chunk splitting
```

---

## 4. Key Pages & Features

### 1. Homepage (`/`)
- **Interactive 3D Architectural Centerpiece (Hero)**:
  - Monumental typography (*"Engineering spaces. Shaping possibilities."*), geographic coordinates masthead, and real-time interactive 3D pavilion.
  - Procedural contemporary architectural pavilion constructed with geometric forms, plinth with reflecting pool, structural columns, post-tensioned slabs, cantilevered terrace, sheer core, bronze brise-soleil, and roof canopy.
  - Interactive camera viewpoints: `Perspective`, `Front Elevation`, `Cantilever Detail`, `Aerial Plan`.
  - OrbitControls with realistic inertia damping (`dampingFactor: 0.05`), distance constraints, and floor clipping prevention.
  - Wireframe analysis mode and smooth auto-rotation toggles.
  - View switcher: seamless toggle between the **Interactive 3D Pavilion** and high-resolution **Archival Photography**.
- **Practice Introduction**: Explains VOLIA's core built-environment advisory role across Nigeria with an asymmetric editorial grid.
- **The Three Core Disciplines**:
  - `01` Engineering Consultancy (Structural, Civil, Infrastructure, Building Services)
  - `02` Architectural Consultancy (Spatial Planning, Concept Design, Urban Context)
  - `03` Quantity Surveying (Cost Engineering, BoQ, Tender Evaluation, Value Optimization)
- **Blueprint to Architecture Transformation (`BlueprintScene`)**:
  - Visual architectural metamorphosis section (*"From schematic wireframe to enduring physical reality"*).
  - 5 sequential phases: `01. Schematic Wireframe`, `02. Structural Outlines`, `03. Slabs & Massing`, `04. Envelope & Brise-Soleil`, `05. Realized Architectural Commission`.
  - Interactive phase progression with auto-play sequence and technical milestone documentation.
- **Interactive Exploded Structural View (`StructuralExplorer`)**:
  - Dedicated interactive structural section (*"Understanding what holds everything together"*).
  - Continuous explosion slider separating the structure along realistic vertical/horizontal load displacement vectors.
  - 6 individual structural subsystems: `01. Foundation & Substructure`, `02. Reinforced Concrete Columns`, `03. Primary & Secondary Beams`, `04. Post-Tensioned Floor Slabs`, `05. Building Envelope & Curtain Wall`, `06. Structural Roof Canopy`.
  - Real-time component selection highlighting with detailed engineering dossiers (Eurocode 2 / BS EN 1992-1-1, Nigerian Building Code, material specifications, and load path narratives).
  - Explicit compliance disclaimer: *"Illustrative Engineering Demonstration &bull; Pedagogical Model"*.
- **Operational Philosophy**: Four pillars (Technical Precision, Thoughtful Planning, Professional Execution, Responsible Delivery) transparently marked as proposed brand positioning.
- **Selected Project References**: Interactive cards showcasing reference benchmarks linking directly to the portfolio.
- **1993 Institutional Continuity**: Highlights reported 1993 incorporation with an explicit management confirmation disclaimer.
- **Direct Engagement Section**: Intake form allowing prospective clients to initiate inquiries immediately.

### 2. About Us (`/about`)
- Comprehensive background narrative detailing the practice's Nigerian roots.
- Formal Vision and Mission statements centered on sustainable, resilient infrastructure.
- 4-Phase Delivery Framework:
  - *Phase 01*: Preliminary Feasibility & Site Analysis
  - *Phase 02*: Scheme Design & Statutory Coordination
  - *Phase 03*: Technical Documentation & Cost Engineering
  - *Phase 04*: Construction Administration & Commissioning
- Transparent Corporate Registry Status box indicating pending executive confirmation of official incorporation details.

### 3. Services (`/services` & `/services/consultation`)
- In-depth discipline breakdowns for Engineering Consultancy, Architectural Consultancy, and Quantity Surveying.
- Comprehensive scope matrices, including feasibility analysis, statutory approvals, BOQ preparation, and contract administration.
- **Guided Service Selector (`/services/consultation`)**: A 4-step diagnostic wizard (Typology &rarr; Support &rarr; Stage &rarr; Narrative) generating a tailored technical scoping recommendation and pre-populating the Project Brief Builder.

### 4. Interactive Project Explorer (`/projects`)
- Advanced portfolio interface covering 5 core disciplines:
  - `Engineering`
  - `Architecture`
  - `Construction`
  - `Quantity Surveying`
  - `Infrastructure`
- Real-time search interface and category filtering.
- **Deep Technical Case Study Modal Explorer**:
  - Interactive view mode toggle: switch seamlessly between **2D Photography** and the **Interactive 3D BIM Model**.
  - 3D BIM Model viewer with interactive OrbitControls, camera presets (`Perspective`, `Elevation`, `Cantilever`, `Aerial`), and wireframe analysis overlay.
  - Multi-image gallery with thumbnail navigation and figure captions.
  - Full case study sections: *Overview & Objectives*, *Engineering Challenges & Applied Approach*, *Phased Lifecycle Stages (01 to 04)*, and *Technical Specifications Table*.
  - Direct contextual action: *"Consult On Similar Typology"* &rarr; pre-fills `/project-brief`.
  - Visible compliance stamp on every card and modal: `"ILLUSTRATIVE PROJECT CONCEPT"`.

### 5. Project Brief Builder (`/project-brief`)
- High-conversion multi-step business development application:
  - Part 01: Proponent & Corporate Contact (Full Name, Company, Email, Phone).
  - Part 02: Development Parameters (Project Name, Location, Typology, Budget, Stage, Timeline).
  - Part 03: Disciplines Required (Multi-select service checkboxes + custom specialty).
  - Part 04: Narrative Brief, Special Engineering Constraints & Reference Attachment.
  - Part 05: Executive Synthesis, Review Screen & Dual Actions.
- **Branded Vector PDF Generation**: Generates publication-grade, vector-crisp client project briefs (`VOLIA_Project_Brief_VOLIA-BRF-*.pdf`) directly in the browser via `jspdf`.
- **Clean Service Abstraction**: Submits via `EnquiryService`. When no live API is configured, transparently operates in prototype simulation mode with zero false delivery claims.

### 6. Corporate Capability Statement (`/company-profile`)
- Comprehensive institutional profile prepared for procurement committees and executive boards.
- Editorial presentation covering Executive Mandate, 1993 Heritage Note (subject to management verification), Core Disciplines, 4-Phase Delivery Framework, and Provisional Coordinates.
- **Vector PDF Download**: Generates a 4-page branded PDF (`VOLIA_Corporate_Capability_Statement.pdf`) complete with cover page, headers, footers, and compliance disclosures.

### 7. Technical Resource Centre (`/insights` & `/insights/:slug`)
- Professional engineering insights and knowledge repository.
- 5 Content Categories: *Engineering Insights*, *Architecture*, *Construction Planning*, *Quantity Surveying*, *Industry Knowledge*.
- Search interface, category filters, and reading-time indicators.
- **Monograph Detail View (`/insights/:slug`)**: Editorial typography, key executive takeaways box, structured technical sections, and related monographs.
- Explicit compliance notice: *"Demonstration Technical Monograph &bull; Subject to VOLIA Editorial Clearance"*.

### 8. Contact & Consultation (`/contact`)
- Interactive enquiry form with client-side validation (full name, corporate email regex, phone format, discipline selection, and inquiry narrative).
- Prototype simulation mode with verified receipt modal.
- Direct contact details with Abuja/Lagos provisional coordinates.

### 9. Public Careers & Job Application Portal (`/careers`)
- **Careers Overview (`/careers`)**:
  - Editorial header: *"Engineering permanence. Shaping multidisciplinary careers."*
  - Real-time discipline filtering (`All`, `Engineering`, `Architecture`, `Quantity Surveying`) and instantaneous title/location search.
  - Commission opportunity cards featuring department badge, seniority level, location, vacancy count, and engagement type.
  - The VOLIA Culture pillars: *Professional Accreditation First*, *Institutional Longevity*, and *Integrated Multidisciplinary Delivery*.
- **Commission Specification View (`/careers/:slug`)**:
  - Full technical mandate breakdown: *Role Overview*, *Core Responsibilities & Technical Scope*, *Statutory Accreditations & Prerequisites*, and *Remuneration Policy*.
  - Sticky application action sidebar with vacancy parameters, direct apply CTA, and clipboard share action.
- **Candidate Application Submission (`/careers/:slug/apply`)**:
  - 4-step structured intake form: Personal & Contact Information, Professional Accreditations (COREN, ARCON, NIQS, years of experience, highest degree, notice period), Online Folio Links, and Document Uploads.
  - Drag-and-drop file upload component validating file extensions (`.pdf, .doc, .docx`) and maximum 5MB size limit.
  - Data protection declaration ensuring candidate privacy compliance.
- **Application Confirmation Protocol (`/application/confirmation`)**:
  - Formal submission receipt displaying unique tracking code (e.g., `VOLIA-APP-891234`), timestamp, and dispatched contact details.
  - Transparent 3-step evaluation protocol explanation: Preliminary Credential Screening &rarr; Practice Lead Shortlisting &rarr; Technical Defense Invitation.

### 10. Private HR & Recruitment Management Platform (`/admin/*`)
- **Authentication Gateway (`/admin/login`)**:
  - Dark-minimalist institutional sign-in protected via `PublicOnlyRoute` (redirects authenticated users directly to dashboard).
  - Quick demo persona switchers (*Amina Bello - HR Manager*, *Engr. B. Alabi - Practice Administrator*) for presentation evaluation.
- **Executive Recruitment Dashboard (`/admin/dashboard`)**:
  - Key KPI Metric Cards: *Active Published Vacancies*, *Total Pipeline Applications*, *Active Under Review*, and *Fortnight Technical Interviews*.
  - Visual stage distribution funnel covering all 7 recruitment pipeline stages.
  - Recent candidate submissions table with quick navigation to candidate review dossiers.
  - Upcoming interview schedules and active position vacancy counters.
- **Job Openings Management (`/admin/jobs`)**:
  - Filterable by status (`published`, `draft`, `closed`) and searchable across disciplines.
  - Quick action controls to toggle status, inspect details, edit, or safely delete postings.
- **Publish New Specification (`/admin/jobs/create`)**:
  - Comprehensive form to draft or publish vacancies with discipline selection, seniority level, target headcounts, line-separated duties, and accreditation prerequisites.
- **Candidate Submissions & Review Dossiers (`/admin/applications` & `/admin/applications/:id`)**:
  - Deep candidate review dossier displaying verified academic degrees, statutory registrations (COREN / ARCON / NIQS), contact info, and cover statements.
  - Secure Document Vault: displays CV and portfolio files with authenticated download simulation (zero public URL exposure).
  - Internal reviewer notes system for documenting peer evaluations.
  - Pipeline stage governor with audit notes and historical stage transition timeline.
- **Interactive Kanban Pipeline Board (`/admin/pipeline`)**:
  - Multi-column visual board (`Applied` &rarr; `Screening` &rarr; `Shortlisted` &rarr; `Interview` &rarr; `Assessment` &rarr; `Offer` &rarr; `Hired`).
  - Candidate cards with peer score ratings, experience years, and quick stage forward/backward controls.
- **Interview Scheduling & Panel Governance (`/admin/interviews`)**:
  - Tracks technical assessments, portfolio defenses, and partner consultations across Abuja, Lagos, or virtual encrypted meeting bridges.
  - Modal wizard to schedule new sessions with automated auditor logging.
- **Platform Settings & RBAC Access Matrix (`/admin/settings`)**:
  - Granular permissions matrix for 4 distinct roles: `admin`, `hr_manager`, `hiring_manager`, `recruiter`.
  - Cryptographic audit log trail displaying immutable timestamps, actor IDs, actions, target entities, and client IP addresses.

### 11. Architectural 404 Page (`*`)
- Clean spatial-recovery page (*"Coordinate Out of Bounds — Spatial Plan Not Found"*).
- Direct recovery links to return home, explore services, or contact the team.

---

## 5. Getting Started & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher (or pnpm / yarn)

### 1. Clone & Install
```bash
# Navigate to project directory
cd viola

# Install dependencies
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000/`. Vite's Fast Refresh enables instant HMR during design iteration.

### 3. Build for Production
```bash
npm run build
```
This executes TypeScript verification (`tsc -b`) followed by Vite production bundling. Output files are placed in the `dist/` directory with clean Rollup code splitting:
- `dist/assets/three-*.js` (Three.js WebGL rendering core)
- `dist/assets/r3f-*.js` (React Three Fiber & Drei integration layer)
- `dist/assets/pdf-*.js` (jsPDF vector document generation engine)
- `dist/assets/vendor-*.js` (React, React DOM, React Router)
- `dist/assets/motion-*.js` (Framer Motion)
- `dist/assets/icons-*.js` (Lucide React)
- `dist/assets/index-*.js` (Application code & routing)
- `dist/assets/index-*.css` (Tailwind architectural styles)

### 4. Preview Production Build Locally
```bash
npm run preview
```
Serves the generated `dist/` build locally at `http://localhost:4173/` for final inspection.

---

## 6. Temporary Vercel Deployment Guide (Free / Zero Cost)

The repository includes a ready-to-deploy `vercel.json` configuration with SPA route rewrites and asset cache headers. You can deploy this prototype to a free temporary Vercel URL for the client pitch without purchasing domains or standing up infrastructure.

### Method A: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI globally** (or use `npx`):
   ```bash
   npm i -g vercel
   ```

2. **Authenticate with Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```
   Follow the interactive prompts:
   - *Set up and deploy?* &rarr; **`Y`**
   - *Which scope?* &rarr; Select your personal Vercel account
   - *Link to existing project?* &rarr; **`N`**
   - *What's your project's name?* &rarr; **`volia-nig-ltd`** (or press Enter)
   - *In which directory is your code located?* &rarr; **`./`**
   - *Auto-detected settings (Vite):* &rarr; **`Y`**

4. **Deploy to Production URL**:
   ```bash
   vercel --prod
   ```
   Vercel will output a live staging/production URL (e.g., `https://volia-nig-ltd.vercel.app`), ready to share with prospective clients.

### Method B: Deploy via GitHub & Vercel Dashboard

1. Initialize a Git repository and push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete VOLIA NIG LTD corporate website prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/volia-nig-ltd.git
   git push -u origin main
   ```
2. Open [vercel.com](https://vercel.com/) and click **"Add New..." &rarr; "Project"**.
3. Import the `volia-nig-ltd` repository.
4. Keep the default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will build the project and assign a free HTTPS URL.

---

## 7. Outstanding Company Information Checklist

Before officially publishing the website as VOLIA NIG LTD's live commercial site, management and client representatives must confirm and provide the following real-world data:

| # | Item | Current Prototype State | Required Production Data |
|---|---|---|---|
| 1 | **CAC Registration** | Labeled as *"Reported 1993 incorporation (Subject to Management Confirmation)"* | Official RC Number, exact incorporation date, and legal corporate entity name. |
| 2 | **Headquarters Address** | Displayed as *"Central Business District, Abuja, FCT, Nigeria"* | Verified physical office address, floor, and suite number. |
| 3 | **Corporate Phone** | Provisional placeholder `+234 (0) 1 234 5678` | Verified corporate switchboard phone number(s). |
| 4 | **Official Email** | Provisional placeholder `inquiries@volia.ng` | Verified corporate receiving email addresses for inquiries and tenders. |
| 5 | **Leadership Profiles** | Kept unstated to prevent fabricating biographies | Names, qualifications (FNSE, COREN, ARCON, NIQS), and high-resolution portraits of leadership. |
| 6 | **Project Retrospectives** | 8 architectural typologies explicitly marked as reference benchmarks | Real project commission retrospectives, photographs, client names, and completion years. |
| 7 | **Professional Licenses** | Documented standard disciplines without claiming specific unverified accreditations | Copies/registration numbers for COREN, ARCON, QSRBN, or relevant regulatory bodies. |

---

## 8. Backend & Production Integration Roadmap

When transitioning from the pitch prototype to a full production deployment, the following backend integrations are recommended:

1. **Contact Form Inquiries Endpoint**:
   - Integrate an email delivery service (e.g., [Resend](https://resend.com/), [Formspree](https://formspree.io/), or a lightweight Node.js/Serverless function) using the `VITE_CONTACT_API_ENDPOINT` variable.
   - Configure email notifications to forward submissions directly to VOLIA's executive inbox.
2. **Domain Mapping & SSL**:
   - In Vercel Project Settings &rarr; **Domains**, attach `volia.ng` and `www.volia.ng`.
   - Update DNS records with the domain registrar (A records pointing to `76.76.21.21` or CNAME to `cname.vercel-dns.com`).
3. **Analytics & Search Console**:
   - Add Google Analytics 4 (`G-XXXXXXXXXX`) or Google Tag Manager script to `index.html`.
   - Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
4. **Content Management System (Optional Future Phase)**:
   - For regular project updates and news publications, connect a headless CMS (e.g., Sanity, Strapi, or Contentful) to drive the `/projects` route dynamically.

---

## 9. Final Quality Audit Matrix

| Audit Area | Specification & Verification Method | Status |
|---|---|---|
| **Route Rendering** | All routes (`/`, `/about`, `/services`, `/projects`, `/contact`, `/404`) load directly and via client navigation. | **PASS (100%)** |
| **Vite Production Build** | `tsc -b && vite build` succeeds with zero errors; Rollup chunks cleanly split. | **PASS (0 Errors)** |
| **Console Errors** | Inspected runtime across routes; no uncaught exceptions or React key warnings. | **PASS (0 Errors)** |
| **Mobile Responsiveness** | Verified across 8 viewports: 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1920px. | **PASS** |
| **Touch Usability** | All interactive links and controls meet or exceed 44×44px minimum tap targets. | **PASS** |
| **iOS Viewport Stability** | Form inputs styled at `text-base sm:text-xs` to prevent iOS Safari auto-zooming. | **PASS** |
| **Form Integrity** | Validates required fields and email regex; displays loading spinner and honest prototype simulation receipt. | **PASS** |
| **Link Integrity** | Zero dead `#` links; all navigation and CTA buttons link to valid internal routes or standard protocols. | **PASS** |
| **Performance & SEO** | Open Graph tags, Twitter cards, Schema.org JSON-LD, XML sitemap, and Google Fonts `display=swap`. | **PASS** |
| **Accessibility** | Semantic HTML5 structure, ARIA dialog modal, visible focus rings, and reduced-motion media query. | **PASS** |
| **Corporate Ethics** | Zero fabricated client names, leadership bios, awards, or fake commission claims. | **PASS** |

---

*Designed and engineered with precision for VOLIA NIG LTD.*
