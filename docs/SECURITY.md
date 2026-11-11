# VOLIA NIG LTD — Security & Data Protection Specification

## 1. Authentication & Session Security

- **Credential Verification:** SHA-256 password hash comparison. Invalid attempts trigger `HTTP 401 Unauthorized`.
- **Brute-Force Rate Limiting:** Enforced via `express-rate-limit` on `/api/v1/auth/login` (max 20 requests per 15-minute window per IP).
- **Session Tokens:** Bearer token authentication required on all `/api/v1/admin/*` routes.
- **Production Isolation:** In production mode (`NODE_ENV=production`), token resolution bypasses are completely disabled.

---

## 2. Role-Based Access Control (RBAC)

| Role | Capabilities | Permitted Boundaries |
| :--- | :--- | :--- |
| `super_admin` | Unrestricted practice governance | All vacancy, application, interview, decision, and system settings |
| `hr_admin` | Talent operations lead | Vacancy management, application progression, interview coordination |
| `recruiter` | Candidate sourcing & screening | Candidate reviews, interview scheduling, note additions |
| `interviewer` | Technical defense panel lead | **Restricted:** Only assigned interview sessions and peer feedback evaluations |

---

## 3. Document Protection & NDPA 2023 Compliance

- **Private Ingestion:** Resumes and portfolios are saved outside the public document root in `server/uploads/documents`.
- **MIME Whitelist:** Strictly permits `application/pdf`, `application/msword`, and `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
- **File Size Ceiling:** Capped at 5 megabytes.
- **Randomized Storage Names:** File names are obscured with timestamp prefixes and crypto-random hashes:
  `${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${sanitizedName}`
- **Path Traversal Guards:** All streaming requests strictly verify:
  `resolvedPath.startsWith(uploadDir)`
  Unauthorized path manipulation triggers `HTTP 403 Forbidden`.
- **Interviewer Access Boundary:** Interviewers may only stream documents for candidates participating in their assigned panel sessions.

---

## 4. HTTP Headers & Transport Defense

- **Helmet Integration:** Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and strict referrer policies.
- **CORS Protection:** Configurable whitelist via `CORS_ORIGIN`.
- **Application Submission Rate Limiting:** `/api/v1/careers/apply` capped at 30 requests per hour per IP.
