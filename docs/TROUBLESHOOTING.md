# VOLIA NIG LTD — Operational Troubleshooting & Maintenance

## 1. Common Operational Issues & Remediation

### A. Backend Connection Error (`Failed to synchronize ...`)
- **Symptoms:** Dashboard or pipeline indicates backend communication failure.
- **Remediation:**
  1. Confirm Express is active on port 5000:
     ```bash
     curl http://localhost:5000/api/v1/health
     ```
  2. Verify Vite reverse proxy in `vite.config.ts`:
     ```ts
     proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } }
     ```

---

### B. Interview Scheduling Conflict (HTTP 409)
- **Symptoms:** Scheduling modal alerts: `Scheduling conflict detected: Panel lead is already booked...`
- **Cause:** One or more selected interviewers are already assigned to another interview overlapping the selected start time and duration.
- **Remediation:** Select an alternative time window or designate another panel lead.

---

### C. Illegal Stage Transition Rejection (HTTP 422)
- **Symptoms:** Moving candidate directly from `screening` to `offer` fails with error: `Invalid stage transition`.
- **Cause:** Server enforces the progressive transition matrix (`VALID_STAGE_TRANSITIONS`).
- **Remediation:** Move candidate sequentially through `shortlisted` $\rightarrow$ `interview`, or use an administrative override with mandatory recorded justification.

---

### D. File Upload Rejections (HTTP 400 / 413)
- **Symptoms:** Candidate or admin upload fails.
- **Causes:**
  - File exceeds 5MB limit.
  - File is not a PDF, DOC, or DOCX.
- **Remediation:** Compress document below 5MB and save in standard PDF format.

---

### E. WebGL / 3D Experience Fallback on Lower-Powered Devices
- **Symptoms:** 3D model does not render or shows hardware warning.
- **Behavior:** The application automatically falls back to high-resolution archival photography with zero impact on page usability.
- **Remediation:** Ensure hardware acceleration is enabled in browser settings (`chrome://settings/system`).
