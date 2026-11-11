# VOLIA NIG LTD — Express Backend API

A high-performance Express & Node.js backend powering the VOLIA corporate engineering platform and recruitment talent management OS.

---

## 1. Quick Start

### Start the Express API Server
```bash
# In project root
npm run server

# Or run with auto-reload in development
npm run server:dev
```
The server binds to `http://localhost:5000` with the health check at `http://localhost:5000/api/v1/health`.

---

## 2. API Endpoints

### Health & Diagnostic
- `GET /api/v1/health` — Service status, timestamp, and version check.

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/login` — Authenticate authorized personnel. Supports preconfigured roles:
  - `admin@volia.ng` (`super_admin`)
  - `hr@volia.ng` (`hr_admin`)
  - `recruiter@volia.ng` (`recruiter`)
  - `interviewer@volia.ng` (`interviewer`)
- `POST /api/v1/auth/logout` — Terminate session.
- `GET /api/v1/auth/me` — Retrieve current authenticated profile.

### Public Vacancies (`/api/v1/jobs`)
- `GET /api/v1/jobs` — Retrieve published vacancies with filters (`search`, `department`, `type`, `experienceLevel`).
- `GET /api/v1/jobs/:slug` — Detailed role specification by slug or ID.

### Careers Application Submission (`/api/v1/careers`)
- `POST /api/v1/careers/apply` — Multipart form-data submission with resume and optional portfolio.
  - Enforces 5MB limit and MIME type restriction (PDF, DOC, DOCX).
  - Validates NDPA 2023 candidate consent.
  - Generates verifiable reference identifier (`VOLIA-APP-XXXXXX`).

### Admin Recruitment Platform (`/api/v1/admin`)
- `GET /api/v1/admin/dashboard/metrics` — Talent pipeline counts, active vacancies, and stage breakdown.
- `GET /api/v1/admin/dashboard/activity` — Recent applications and system audit trail.
- `GET /api/v1/admin/jobs/all` — List all positions (published, draft, closed, archived).
- `POST /api/v1/admin/jobs/create` — Create new recruitment specification.
- `GET /api/v1/admin/jobs/:id` — Specification detail + associated candidate submissions.
- `PUT /api/v1/admin/jobs/:id` — Update job requirements and mandate.
- `PATCH /api/v1/admin/jobs/:id/status` — Status transition (`published`, `closed`, `archived`).
- `GET /api/v1/admin/applications` — List applications with stage and candidate search.
- `GET /api/v1/admin/applications/:id` — Dossier detail, stage history, and evaluation notes.
- `PATCH /api/v1/admin/applications/:id/stage` — Advance or reject candidate in pipeline.
- `POST /api/v1/admin/applications/:id/notes` — Add internal interviewer/recruiter review notes.
- `GET /api/v1/admin/applications/:id/document/:docType` — Stream resume or portfolio securely.
- `GET /api/v1/admin/candidates` — Aggregated candidate directory with COREN/ARCON accreditation filters.
- `GET /api/v1/admin/candidates/:id` — Comprehensive candidate dossier across all commission cycles.
- `GET /api/v1/admin/interviews` — List scheduled interview panels.
- `POST /api/v1/admin/interviews` — Schedule evaluation panel.
- `PATCH /api/v1/admin/interviews/:id` — Update interview feedback and panel recommendation.

### Public Enquiries (`/api/v1/enquiries`)
- `POST /api/v1/enquiries/consultation` — Client advisory request.
- `POST /api/v1/enquiries/project-brief` — Comprehensive project brief submission.

---

## 3. Security & Compliance
- **Nigeria Data Protection Act (NDPA 2023) Compliance:** Candidate resumes and personal data are stored privately in non-public storage (`uploads/documents/`) and accessed exclusively through signed/authenticated endpoints.
- **Role-Based Access Control (RBAC):** Middleware validates roles (`super_admin`, `hr_admin`, `recruiter`, `interviewer`) across administrative routes.
