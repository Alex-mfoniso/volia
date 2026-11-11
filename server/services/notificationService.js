/**
 * VOLIA NIG LTD — Notification & Email Dispatch Service
 * Handles candidate notifications, interviewer alerts, HR notifications,
 * and maintains complete delivery records and audit history.
 */

import { notifications, auditLogs } from '../data/store.js';

// Delivery logs store
export let notificationDeliveries = [];

/**
 * Generate professional VOLIA-branded HTML and Plain-text email templates
 */
export const generateEmailTemplate = ({ type, recipientName, data }) => {
  const brandHeader = `
    <div style="background-color: #141412; padding: 24px 32px; border-bottom: 2px solid #C5A059;">
      <span style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #FFFFFF; letter-spacing: 2px;">
        VOLIA
      </span>
      <span style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #C5A059; margin-left: 12px;">
        Engineering & Consultancy
      </span>
    </div>
  `;

  const brandFooter = `
    <div style="background-color: #F8F7F4; padding: 24px 32px; border-top: 1px solid #E6E4DD; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #73736C; line-height: 1.6;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #25251F;">VOLIA NIG LTD &bull; Corporate Engineering Practice</p>
      <p style="margin: 0 0 4px 0;">Central Business District, Abuja, Federal Capital Territory, Nigeria</p>
      <p style="margin: 0 0 8px 0;">In compliance with the Nigeria Data Protection Act (NDPA 2023). Confidential Communication.</p>
      <p style="margin: 0; font-size: 10px; color: #A09E96;">&copy; ${new Date().getFullYear()} VOLIA NIG LTD. All rights reserved.</p>
    </div>
  `;

  let subject = '';
  let bodyContent = '';
  let plainText = '';

  switch (type) {
    case 'application_received':
      subject = `Application Received | ${data.jobTitle} | VOLIA`;
      bodyContent = `
        <h2 style="font-family: Georgia, serif; color: #141412; font-size: 18px; margin-top: 0;">Application Registered Successfully</h2>
        <p>Dear ${recipientName},</p>
        <p>Thank you for submitting your credential dossier for the commission of <strong>${data.jobTitle}</strong> at VOLIA NIG LTD.</p>
        <div style="background-color: #F8F7F4; border-left: 3px solid #C5A059; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 12px;">
          <p style="margin: 0 0 6px 0;"><strong>Application Reference:</strong> ${data.applicationReference}</p>
          <p style="margin: 0 0 6px 0;"><strong>Commission Discipline:</strong> ${data.department || 'Engineering & Consultancy'}</p>
          <p style="margin: 0;"><strong>Verification Status:</strong> NDPA 2023 Intake Confirmed</p>
        </div>
        <p>Our Principal Engineers and Practice Directorate will carefully review your qualifications, accredited licensure (COREN/ARCON/NIQS), and track record. If shortlisted, you will receive a direct invitation to our formal technical evaluation panel.</p>
        <p style="margin-top: 24px;">Sincerely,<br/><strong>People & Talent Directorate</strong><br/>VOLIA NIG LTD</p>
      `;
      plainText = `Dear ${recipientName},\n\nYour application for ${data.jobTitle} (Ref: ${data.applicationReference}) has been registered at VOLIA NIG LTD.\n\nOur Practice Directorate will review your credentials. Thank you for your interest in our engineering consultancy.\n\nVOLIA NIG LTD`;
      break;

    case 'interview_invitation':
      subject = `Interview Invitation | ${data.jobTitle} | VOLIA`;
      bodyContent = `
        <h2 style="font-family: Georgia, serif; color: #141412; font-size: 18px; margin-top: 0;">Formal Technical Panel Session</h2>
        <p>Dear ${recipientName},</p>
        <p>Following a review of your application dossier, the Practice Directorate invites you to participate in an evaluation interview for the commission of <strong>${data.jobTitle}</strong>.</p>
        <div style="background-color: #F8F7F4; border-left: 3px solid #C5A059; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 12px; line-height: 1.8;">
          <p style="margin: 0;"><strong>Format:</strong> ${data.interviewType?.replace(/_/g, ' ').toUpperCase()}</p>
          <p style="margin: 0;"><strong>Date & Time:</strong> ${data.scheduledTime}</p>
          <p style="margin: 0;"><strong>Timezone:</strong> Africa/Lagos (West Africa Time - UTC+1)</p>
          <p style="margin: 0;"><strong>Duration:</strong> ${data.durationMinutes || 60} Minutes</p>
          <p style="margin: 0;"><strong>Venue / Instructions:</strong> ${data.meetingDetails}</p>
          <p style="margin: 0;"><strong>Evaluation Panel:</strong> ${data.interviewerNames || 'Designated Lead Consultants'}</p>
        </div>
        <p>Please review your project portfolio and ensure you are prepared to discuss your statutory design verifications, Eurocode/BS compliance, and previous project executions.</p>
        <p>Kindly acknowledge receipt of this schedule by replying directly to this communication.</p>
        <p style="margin-top: 24px;">Sincerely,<br/><strong>Engineering Recruitment Panel</strong><br/>VOLIA NIG LTD</p>
      `;
      plainText = `Dear ${recipientName},\n\nYou are invited to a technical evaluation interview for ${data.jobTitle}.\n\nDate & Time: ${data.scheduledTime} (Africa/Lagos)\nVenue / Meeting: ${data.meetingDetails}\n\nVOLIA NIG LTD`;
      break;

    case 'interview_rescheduled':
      subject = `Updated Schedule: Technical Panel Session | VOLIA`;
      bodyContent = `
        <h2 style="font-family: Georgia, serif; color: #141412; font-size: 18px; margin-top: 0;">Interview Session Rescheduled</h2>
        <p>Dear ${recipientName},</p>
        <p>Please note that your scheduled interview for <strong>${data.jobTitle}</strong> has been updated as follows:</p>
        <div style="background-color: #F8F7F4; border-left: 3px solid #C5A059; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 12px;">
          <p style="margin: 0 0 6px 0;"><strong>New Date & Time:</strong> ${data.scheduledTime} (Africa/Lagos)</p>
          <p style="margin: 0 0 6px 0;"><strong>Venue / Bridge:</strong> ${data.meetingDetails}</p>
          <p style="margin: 0;"><strong>Reason:</strong> ${data.reason || 'Practice Panel schedule adjustment'}</p>
        </div>
        <p>We apologize for any inconvenience this adjustment may cause. Please let us know if this timing requires further alignment.</p>
        <p style="margin-top: 24px;">Sincerely,<br/><strong>People & Talent Directorate</strong><br/>VOLIA NIG LTD</p>
      `;
      plainText = `Dear ${recipientName},\n\nYour interview for ${data.jobTitle} has been rescheduled to ${data.scheduledTime} (Africa/Lagos).\n\nVenue: ${data.meetingDetails}\n\nVOLIA NIG LTD`;
      break;

    case 'interview_cancelled':
      subject = `Session Cancellation Notice | VOLIA`;
      bodyContent = `
        <h2 style="font-family: Georgia, serif; color: #141412; font-size: 18px; margin-top: 0;">Interview Session Cancelled</h2>
        <p>Dear ${recipientName},</p>
        <p>We write to inform you that your scheduled interview session for <strong>${data.jobTitle}</strong> has been cancelled.</p>
        <p><strong>Note:</strong> ${data.reason || 'The session has been cancelled by the recruitment directorate. Further correspondence will follow if applicable.'}</p>
        <p>Should you have any inquiries, you may reach out to talent@volia.ng.</p>
        <p style="margin-top: 24px;">Sincerely,<br/><strong>VOLIA NIG LTD</strong></p>
      `;
      plainText = `Dear ${recipientName},\n\nYour interview for ${data.jobTitle} has been cancelled.\nReason: ${data.reason || 'Schedule cancellation'}\n\nVOLIA NIG LTD`;
      break;

    case 'recruitment_outcome':
      if (data.decision === 'offer' || data.decision === 'hired') {
        subject = `Offer of Engagement | ${data.jobTitle} | VOLIA`;
        bodyContent = `
          <h2 style="font-family: Georgia, serif; color: #141412; font-size: 18px; margin-top: 0;">Offer of Professional Engagement</h2>
          <p>Dear ${recipientName},</p>
          <p>On behalf of the Managing Partners and Board of VOLIA NIG LTD, we are pleased to extend an offer of engagement for the position of <strong>${data.jobTitle}</strong>.</p>
          <p>Your technical evaluations, design methodology defense, and professional credentials demonstrated the caliber of engineering rigor that distinguishes our practice.</p>
          <div style="background-color: #F8F7F4; border-left: 3px solid #2E7D32; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 12px;">
            <p style="margin: 0 0 6px 0;"><strong>Engagement Commission:</strong> ${data.jobTitle}</p>
            <p style="margin: 0 0 6px 0;"><strong>Practice Department:</strong> ${data.department || 'Engineering'}</p>
            <p style="margin: 0;"><strong>Status:</strong> Formal Offer Dispatched</p>
          </div>
          <p>The comprehensive formal letter of engagement and terms of reference are being forwarded separately by our Executive Directorate.</p>
          <p style="margin-top: 24px;">Warm congratulations,<br/><strong>Engr. Babatunde Alabi</strong><br/>Managing Director & Head of Practice<br/>VOLIA NIG LTD</p>
        `;
        plainText = `Dear ${recipientName},\n\nWe are pleased to extend an offer of engagement for ${data.jobTitle} at VOLIA NIG LTD.\n\nFormal documentation will follow.\n\nCongratulations,\nVOLIA NIG LTD`;
      } else {
        subject = `Commission Status Update | ${data.jobTitle} | VOLIA`;
        bodyContent = `
          <h2 style="font-family: Georgia, serif; color: #141412; font-size: 18px; margin-top: 0;">Commission Recruitment Outcome</h2>
          <p>Dear ${recipientName},</p>
          <p>Thank you for participating in our recruitment evaluation process for the commission of <strong>${data.jobTitle}</strong>.</p>
          <p>Following thorough assessment by our panel, we regret to inform you that we have decided to advance another candidate whose specific technical domain experience more closely matches the current requirements of this specific commission.</p>
          <p>We were sincerely impressed by your professional background and accomplishments. With your permission under NDPA guidelines, we will retain your dossier in our executive talent pool for future signature commissions.</p>
          <p>We wish you continued success in your professional endeavors.</p>
          <p style="margin-top: 24px;">Sincerely,<br/><strong>People & Talent Directorate</strong><br/>VOLIA NIG LTD</p>
        `;
        plainText = `Dear ${recipientName},\n\nThank you for participating in our evaluation process for ${data.jobTitle}. We have decided to advance another candidate for this commission. We wish you every success.\n\nVOLIA NIG LTD`;
      }
      break;

    default:
      subject = `Recruitment Notification | VOLIA`;
      bodyContent = `<p>Dear ${recipientName},</p><p>${data.message || 'Recruitment status update.'}</p>`;
      plainText = `Dear ${recipientName},\n\n${data.message || 'Recruitment status update.'}\n\nVOLIA NIG LTD`;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #EFEFEA; font-family: 'Helvetica Neue', Arial, sans-serif; color: #25251F;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #D8D6CD; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <tr>
                <td>${brandHeader}</td>
              </tr>
              <tr>
                <td style="padding: 32px 32px 24px 32px; font-size: 14px; line-height: 1.6;">
                  ${bodyContent}
                </td>
              </tr>
              <tr>
                <td>${brandFooter}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html, plainText };
};

/**
 * Dispatch notification: records to in-app notification store and queues email delivery
 */
export const dispatchNotification = async ({
  userId,
  recipientEmail,
  recipientName,
  type,
  title,
  message,
  relatedEntityId,
  relatedEntityType,
  emailData,
}) => {
  // 1. Create In-App Notification Record
  const newNotification = {
    id: `notif-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    userId: userId || 'all_hr',
    recipientEmail,
    type,
    title,
    message,
    relatedEntityId,
    relatedEntityType,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  notifications.unshift(newNotification);

  // 2. Queue Email Delivery Record
  let emailDelivery = null;
  if (recipientEmail && emailData) {
    const template = generateEmailTemplate({
      type,
      recipientName: recipientName || 'Candidate',
      data: emailData,
    });

    emailDelivery = {
      id: `deliv-${Date.now().toString(36)}`,
      notificationId: newNotification.id,
      recipientEmail,
      recipientName,
      subject: template.subject,
      type,
      status: 'delivered', // simulated instant delivery via production queue
      attemptCount: 1,
      sentAt: new Date().toISOString(),
      previewSnippet: template.plainText.substring(0, 120),
    };

    notificationDeliveries.unshift(emailDelivery);
  }

  // 3. Log Audit Record
  auditLogs.unshift({
    id: `aud-${Date.now().toString(36)}`,
    actorId: 'system',
    actorName: 'Notification Queue',
    action: 'NOTIFICATION_DISPATCHED',
    entityType: relatedEntityType || 'application',
    entityId: relatedEntityId || newNotification.id,
    details: `Dispatched ${type} notification to ${recipientEmail || userId}: "${title}"`,
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString(),
  });

  return { notification: newNotification, delivery: emailDelivery };
};
