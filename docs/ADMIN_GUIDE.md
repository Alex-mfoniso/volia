# VOLIA NIG LTD — Administrative Operations Manual

## 1. Authentication

1. Navigate to `/admin/login`.
2. Enter registered credentials:
   - **Managing Director / Super Admin:** `admin@volia.ng`
   - **HR Directorate Lead:** `hr@volia.ng`
   - **Technical Recruiter:** `recruiter@volia.ng`
   - **Panel Interview Lead:** `interviewer@volia.ng`
3. Enter administrative password.
4. On authentication, the session securely stores credentials and redirects to `/admin/dashboard`.

---

## 2. Managing Job Vacancies

- **Create Vacancy:** Navigate to `/admin/jobs/create`. Complete discipline, type, location, overview, responsibilities, requirements, and statutory qualifications (e.g., COREN, NIA, NIQS).
- **Save as Draft:** Choose "Save Draft" to keep the listing internal.
- **Publish:** Choose "Publish Vacancy" to display publicly on `/careers`.
- **Edit & Close:** Open `/admin/jobs/:id/edit` to update requirements or close applications.

---

## 3. Reviewing Applications & Candidate Dossiers

1. Navigate to `/admin/applications` or `/admin/pipeline`.
2. Select any applicant card to open the dossier (`/admin/applications/:id`).
3. **Download Documents:** Click "Download Official Resume" or "Portfolio Document" to stream confidential files.
4. **Assign Recruiter:** Choose a designated talent manager from the recruiter assignment dropdown.
5. **Add Evaluation Notes:** Record internal candidate observations in the review log.

---

## 4. Recruitment Pipeline Kanban (`/admin/pipeline`)

- **Interactive Drag & Drop:** Drag cards across valid columns (`applied` $\rightarrow$ `screening` $\rightarrow$ `shortlisted` $\rightarrow$ `interview` $\rightarrow$ `assessment` $\rightarrow$ `offer` $\rightarrow$ `hired`).
- **Keyboard Alternative:** Select the stage dropdown on any card for immediate transition.
- **Administrative Override:** If fast-tracking outside standard rules, enter a recorded justification in the prompt modal.
- **Filters:** Filter candidates by vacancy, engineering discipline, recruiter, or search terms.

---

## 5. Interview Panel Management (`/admin/interviews`)

1. Open `/admin/interviews`.
2. Click **Schedule Session**.
3. Select the candidate, interview type (e.g. *Structural Code Defense, Preliminary Screening*), format (Virtual / Office Panel), date, and panel leads.
4. If a panel lead is already booked for that time window, the system automatically prompts an alert (**HTTP 409 Conflict**).
5. Upon interview conclusion, click **Feedback** to register the 5-dimension evaluation score.

---

## 6. Formal Recruitment Decisions

1. Open the candidate dossier (`/admin/applications/:id`).
2. Click **Record Formal Decision**.
3. Select `Offer`, `Hired`, or `Rejected`.
4. Enter compensation terms, start date, or rejection reasons.
5. Toggle "Dispatch Candidate Notification" and click **Confirm & Record Decision**.
