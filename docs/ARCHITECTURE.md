# VOLIA NIG LTD — Technical Architecture Specification

## 1. System Overview

VOLIA NIG LTD is a built-environment engineering consultancy platform unifying three mission-critical operational surfaces:
1. **Corporate Engineering Consultancy Website:** High-aesthetic architectural portfolio showcasing engineering disciplines, archival project briefs, and interactive 3D pavilion visualization.
2. **Public Talent & Careers Portal:** Vacancy discovery, discipline filters, statutory credential requirements, and secure candidate application submission with NDPA 2023 compliance.
3. **Internal HR/Admin Recruitment Operating System:** Authenticated platform featuring an interactive 7-stage Kanban recruitment pipeline, conflict-checked panel interview coordination, structured multidimensional evaluations, and real-time in-app notification center.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  - Public Corporate Portal (React 18 + Tailwind CSS + Framer Motion)              |
|  - Real-time 3D Pavilion Archetype (Three.js + React Three Fiber + Drei)          |
|  - Interactive 7-Stage Kanban Talent Pipeline (/admin/pipeline)                   |
|  - Interview Management & Panel Evaluation Hub (/admin/interviews)               |
+------------------------------------------+----------------------------------------+
                                           | HTTP / RESTful API (Port 3000 -> 5000)
                                           v
+-----------------------------------------------------------------------------------+
|                            EXPRESS BACKEND ENGINE (Node.js 22)                    |
|  - Helmet HTTP Security Headers & Cross-Origin Resource Policies                 |
|  - Rate Limiters (Auth Brute-Force & Application Spam Protection)                 |
|  - Bearer Token Session Validation & Role-Based Authorization                     |
|  - Validation Matrix: Recruitment Stage Transitions (VALID_STAGE_TRANSITIONS)    |
|  - Interview Conflict Prevention Engine (checkInterviewerConflict)                |
|  - Weighted Multi-Dimension Evaluation Composite Calculation                      |
|  - Multi-Channel Notification Dispatcher & In-App Notification Center             |
|  - NDPA 2023 Compliant Document Streaming with Path Traversal Protection          |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                                 DATA & FILE SYSTEM                                |
|  - In-Memory Operational Store / Relational PostgreSQL Compatibility              |
|  - Private Document Storage (/server/uploads/documents)                           |
|  - Immutable Audit Logging Stream & Activity Trail                                |
+-----------------------------------------------------------------------------------+
```

---

## 2. Technology Stack

### Frontend Architecture
- **Framework:** React 18.3 (TypeScript strict mode)
- **Build System:** Vite 6.1 (ESBuild minification, Rollup code splitting)
- **Styling:** Tailwind CSS 3.4 (Custom architectural warm ivory/charcoal tokens)
- **3D Engine:** Three.js 0.160, React Three Fiber 8.18, Drei 9.122
- **Animation:** Framer Motion 12.4
- **Icons:** Lucide React

### Backend Architecture
- **Runtime:** Node.js 22
- **Framework:** Express 5.3
- **Security:** Helmet, Express Rate Limit, CORS
- **File Ingestion:** Multer 2.5 (MIME filtering, 5MB ceiling, randomized disk storage)
- **Cryptographic Operations:** Native Node.js `crypto`
- **Testing:** Node.js native test runner (`node:test`, `node:assert/strict`)

---

## 3. Recruitment Pipeline State Machine

Candidate progression follows an auditable, server-enforced state machine:

```
[applied] ──────> [screening] ──────> [shortlisted] ──────> [interview]
    │                  │                     │                    │
    ├──────────────────┴─────────────────────┴────────────────────┤
    │                                                             │
    v                                                             v
[rejected] <─────────────────────────────────────────────── [assessment]
    ^                                                             │
    │                                                             v
    └────────────────────────────────────────────────────────── [offer]
                                                                  │
                                                                  v
                                                               [hired]
```

- **Transitions:** Handled via `PATCH /api/v1/admin/applications/:id/stage`.
- **Validation:** Unsanctioned jumps return `HTTP 422 Unprocessable Entity` with rollback.
- **Administrative Override:** Super Admins and HR Admins can bypass standard flows by submitting `override: true` and an explicit `overrideReason`, recorded in the immutable audit trail.

---

## 4. Interview Conflict Prevention Algorithm

Interview scheduling calculates time bounds:
$$\text{Start Time} \le t < \text{Start Time} + \text{Duration Minutes}$$

Before committing a booking, `checkInterviewerConflict` queries all active sessions involving the proposed panel leads. Overlapping sessions trigger `HTTP 409 Conflict`, returning the conflicting candidate and time details to prevent double-booking.

---

## 5. Security & Data Protection

- **Candidate Confidentiality:** Resumes and portfolios are isolated in private disk storage.
- **Document Streaming:** Accessible only via authenticated endpoint `GET /api/v1/admin/applications/:id/document/:docType` with path traversal guards.
- **Access Control:** Role-Based Access Control (`super_admin`, `hr_admin`, `recruiter`, `interviewer`).
- **Data Protection:** Form submission requires explicit consent in compliance with the Nigeria Data Protection Act (NDPA 2023).
