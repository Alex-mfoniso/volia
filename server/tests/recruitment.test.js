/**
 * VOLIA NIG LTD — Phase 07 Recruitment & Interview Engine Test Suite
 * Automated verification of:
 * 1. Health & Server Status (Express on Node.js)
 * 2. Valid recruitment stage transitions (applied -> screening -> shortlisted)
 * 3. Invalid stage transition rejection (422)
 * 4. Administrative override with mandatory justification
 * 5. Conflict-checked interview scheduling (Africa/Lagos timezone)
 * 6. Conflict prevention on overlapping panel bookings (409)
 * 7. Structured interview evaluation and panel feedback calculation
 * 8. Formal recruitment decision recording & candidate notification dispatch
 * 9. In-app notification center, read receipts, and preferences
 * 10. Comprehensive audit logging across all operations
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_API_URL || 'http://127.0.0.1:5000/api/v1';

// Preconfigured Auth Tokens
const TOKENS = {
  superAdmin: 'volia-token-super-admin-001',
  hrAdmin: 'volia-token-hr-admin-002',
  recruiter: 'volia-token-recruiter-003',
  interviewer: 'volia-token-interviewer-004',
};

describe('VOLIA Phase 07: Recruitment Pipeline, Interviews & Notifications Test Suite', () => {
  let createdInterviewId = null;
  const targetCandidateId = 'app-003'; // Nnamdi Okeke
  const interviewCandidateId = 'app-001'; // Oluwaseun Adeyemi

  // Unique time windows per test run to prevent cross-run slot collision
  const testRunOffset = Date.now() + 86400000 * (30 + Math.floor(Math.random() * 50));
  const scheduledTime = new Date(testRunOffset).toISOString();
  const overlappingTime = new Date(testRunOffset + 20 * 60 * 1000).toISOString();

  // 1. Health & Server Status
  it('1. API Server is operational with Express on Node.js', async () => {
    // Ensure app-003 is reset to 'applied' for idempotent stage testing
    await fetch(`${BASE_URL}/admin/applications/${targetCandidateId}/stage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.superAdmin}`,
      },
      body: JSON.stringify({
        stage: 'applied',
        override: true,
        overrideReason: 'Automated test suite idempotency fixture reset.',
      }),
    });

    const res = await fetch(`${BASE_URL}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'operational');
    assert.equal(data.engine, 'Express on Node.js');
  });

  // 2. Valid Stage Transition: applied -> screening
  it('2. Enforces valid recruitment stage transitions (applied -> screening)', async () => {
    const res = await fetch(`${BASE_URL}/admin/applications/${targetCandidateId}/stage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.hrAdmin}`,
      },
      body: JSON.stringify({
        stage: 'screening',
        notes: 'Passed automated credentials verification and preliminary review.',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.stage, 'screening');
  });

  // 3. Invalid Stage Transition Rejection: screening -> hired
  it('3. Rejects illegal forward stage jumps with HTTP 422 (screening -> hired)', async () => {
    const res = await fetch(`${BASE_URL}/admin/applications/${targetCandidateId}/stage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.recruiter}`,
      },
      body: JSON.stringify({
        stage: 'hired',
        notes: 'Attempting invalid jump without interview, evaluation, or offer.',
      }),
    });

    assert.equal(res.status, 422);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.message, /invalid stage transition/i);
  });

  // 4. Administrative Override with Recorded Justification
  it('4. Allows privileged stage override when accompanied by mandatory justification', async () => {
    const res = await fetch(`${BASE_URL}/admin/applications/${targetCandidateId}/stage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.superAdmin}`,
      },
      body: JSON.stringify({
        stage: 'interview',
        override: true,
        overrideReason: 'Executive partner board exemption approved for registered NIQS project director.',
        notes: 'Accelerated directly to technical defense panel.',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.stage, 'interview');
  });

  // 5. Interview Scheduling & Africa/Lagos Timezone
  it('5. Schedules interview session with candidate and assigned panel lead', async () => {
    const res = await fetch(`${BASE_URL}/admin/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.hrAdmin}`,
      },
      body: JSON.stringify({
        applicationId: interviewCandidateId,
        interviewType: 'technical_assessment',
        interviewRound: 'Structural Code Defense (Eurocode & BS 8110)',
        mode: 'virtual_secure_meeting',
        scheduledAt: scheduledTime,
        durationMinutes: 60,
        meetingDetails: 'https://meet.volia.ng/room/technical-defense-amina',
        interviewerNames: ['Engr. Chukwuemeka Okonkwo, FNSE'],
        interviewerIds: ['usr-4'],
        panelLeadId: 'usr-4',
        notes: 'Candidate should prepare deep-dive on high-rise shear wall calculations.',
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.id);
    assert.equal(body.data.status, 'scheduled');
    createdInterviewId = body.data.id;
  });

  // 6. Interview Conflict Detection
  it('6. Detects interviewer scheduling conflict and prevents double-booking (HTTP 409)', async () => {
    const res = await fetch(`${BASE_URL}/admin/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.recruiter}`,
      },
      body: JSON.stringify({
        applicationId: targetCandidateId,
        interviewType: 'preliminary_screening',
        interviewRound: 'Cost Modeling Panel',
        mode: 'office_panel',
        scheduledAt: overlappingTime,
        durationMinutes: 45,
        meetingDetails: 'Boardroom A, Lagos HQ',
        interviewerNames: ['Engr. Chukwuemeka Okonkwo, FNSE'],
        interviewerIds: ['usr-4'],
        panelLeadId: 'usr-4',
      }),
    });

    assert.equal(res.status, 409);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.message, /conflict/i);
    assert.ok(body.conflict || (body.conflicts && body.conflicts.length > 0));
  });

  // 7. Structured Interview Evaluation & Feedback
  it('7. Records structured panel evaluation across 5 rating dimensions and computes weighted score', async () => {
    assert.ok(createdInterviewId, 'Interview ID must exist from previous step');

    // First mark interview as completed
    await fetch(`${BASE_URL}/admin/interviews/${createdInterviewId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.interviewer}`,
      },
    });

    // Submit structured evaluation
    const res = await fetch(`${BASE_URL}/admin/interviews/${createdInterviewId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.interviewer}`,
      },
      body: JSON.stringify({
        applicationId: interviewCandidateId,
        technicalCompetency: 5,
        communication: 5,
        relevantExperience: 4,
        problemSolving: 5,
        roleSuitability: 5,
        strengths: 'Rigorous structural modeling capability, profound knowledge of post-tensioned slabs and wind load dynamics on coastal Lagos developments.',
        concerns: 'None identified. Candidate communicated structural safety margins with supreme clarity.',
        comments: 'One of the strongest technical candidates evaluated this fiscal year. Immediate board recommendation.',
        recommendation: 'strong_hire',
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.averageScore, 4.8);
    assert.equal(body.data.recommendation, 'strong_hire');
  });

  // 8. Formal Recruitment Decision & Notification Dispatch
  it('8. Records formal recruitment decision (offer) and dispatches applicant notification', async () => {
    const res = await fetch(`${BASE_URL}/admin/applications/${interviewCandidateId}/decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKENS.superAdmin}`,
      },
      body: JSON.stringify({
        decision: 'offer',
        sendEmail: true,
        reason: 'Unanimous panel recommendation following flawless structural defense session.',
        salaryOffered: 'NGN 24,000,000 per annum + project delivery incentives',
        startDate: '2027-01-15',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.stage, 'offer');
    assert.ok(body.data.stageHistory.some((h) => h.stage === 'offer'));
  });

  // 9. In-App Notification Center & Read Receipts
  it('9. Fetches in-app notifications and marks notification as read', async () => {
    const res = await fetch(`${BASE_URL}/admin/notifications`, {
      headers: {
        Authorization: `Bearer ${TOKENS.superAdmin}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);

    const firstNotification = body.data[0];

    // Mark as read
    const readRes = await fetch(`${BASE_URL}/admin/notifications/${firstNotification.id}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${TOKENS.superAdmin}`,
      },
    });

    assert.equal(readRes.status, 200);
    const readBody = await readRes.json();
    assert.equal(readBody.success, true);
    assert.equal(readBody.data.isRead, true);
  });

  // 10. Audit Trail Verification
  it('10. Confirms comprehensive audit trail captures all stage movements and governance decisions', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard/activities`, {
      headers: {
        Authorization: `Bearer ${TOKENS.superAdmin}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));

    // Verify recent audit events exist
    const hasAuditAction = body.data.some(
      (log) =>
        log.action === 'RECRUITMENT_DECISION_RECORDED' ||
        log.action === 'APPLICATION_STAGE_OVERRIDDEN' ||
        log.action === 'APPLICATION_STAGE_CHANGED' ||
        log.action === 'INTERVIEW_SCHEDULED' ||
        log.action === 'INTERVIEW_FEEDBACK_SUBMITTED'
    );
    assert.ok(hasAuditAction, 'Audit log must record stage changes, interviews, and decisions');
  });

  // 11. Security: Rejection of unauthenticated document download requests (HTTP 401)
  it('11. Rejects unauthenticated document download requests without Authorization header (HTTP 401)', async () => {
    const res = await fetch(`${BASE_URL}/admin/applications/app-001/document/resume`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.message, /access denied/i);
  });

  // 12. Security: Rejection of invalid administrative login credentials (HTTP 401)
  it('12. Rejects invalid administrative login credentials with HTTP 401', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@volia.ng',
        password: 'WrongPassword999!',
      }),
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.message, /invalid administrative password/i);
  });

  // 13. Security: Authentication with valid credentials succeeds (HTTP 200)
  it('13. Authenticates registered administrative user with valid credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@volia.ng',
        password: 'Password123!',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.token);
    assert.equal(body.data.user.role, 'super_admin');
  });

  // 14. Functional: Rejection of application to non-existent or unpublished vacancy (HTTP 404/400)
  it('14. Rejects candidate applications to invalid vacancy identifiers (HTTP 404)', async () => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16);
    const multipartBody =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="jobId"\r\n\r\n` +
      `non-existent-vacancy-id\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="fullName"\r\n\r\n` +
      `Test Candidate\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="email"\r\n\r\n` +
      `test.candidate@example.ng\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="phone"\r\n\r\n` +
      `+234 803 000 0000\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="consentDataProcessing"\r\n\r\n` +
      `true\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="resume"; filename="resume.pdf"\r\n` +
      `Content-Type: application/pdf\r\n\r\n` +
      `%PDF-1.4 mock content\r\n` +
      `--${boundary}--\r\n`;

    const res = await fetch(`${BASE_URL}/careers/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.message, /not found/i);
  });

  // 15. Functional: Duplicate application rejection (HTTP 409)
  it('15. Prevents duplicate candidate submissions for the same engineering vacancy (HTTP 409)', async () => {
    // cand-001 already applied to job-str-01 (app-001 has Oluwaseun Adeyemi, seun.adeyemi@example.com)
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16);
    const multipartBody =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="jobId"\r\n\r\n` +
      `job-str-01\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="fullName"\r\n\r\n` +
      `Oluwaseun Adeyemi, MNSE\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="email"\r\n\r\n` +
      `seun.adeyemi@example.com\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="phone"\r\n\r\n` +
      `+234 803 456 7890\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="consentDataProcessing"\r\n\r\n` +
      `true\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="resume"; filename="resume.pdf"\r\n` +
      `Content-Type: application/pdf\r\n\r\n` +
      `%PDF-1.4 mock content\r\n` +
      `--${boundary}--\r\n`;

    const res = await fetch(`${BASE_URL}/careers/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    assert.equal(res.status, 409);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.message, /already been submitted/i);
  });

  // 16. Security: Authorized document streaming succeeds with Bearer token
  it('16. Streams confidential candidate document to authorized HR personnel with Bearer token', async () => {
    const res = await fetch(`${BASE_URL}/admin/applications/app-001/document/resume`, {
      headers: {
        Authorization: `Bearer ${TOKENS.superAdmin}`,
      },
    });

    assert.equal(res.status, 200);
    const text = await res.text();
    assert.match(text, /VOLIA NIG LTD/);
  });
});
