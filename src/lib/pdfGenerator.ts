import { jsPDF } from 'jspdf';
import type { ProjectBriefSubmission } from '@/services/enquiryService';
import { CAPABILITY_STATEMENT_DATA } from '@/data/capabilityData';

/**
 * VOLIA NIG LTD — Architectural Vector PDF Engine
 * Generates publication-grade, branded PDF documents directly in the browser.
 */

// Color Constants (RGB)
const COLOR_INK = [37, 37, 31] as const; // #25251F
const COLOR_ACCENT = [165, 139, 103] as const; // #A58B67
const COLOR_MUTED = [119, 118, 111] as const; // #77766F
const COLOR_BORDER = [220, 216, 206] as const; // #DCD8CE
const COLOR_SURFACE = [245, 243, 238] as const; // #F5F3EE

/**
 * Draws a standardized architectural page header on a given jsPDF document
 */
function drawHeader(doc: jsPDF, pageNumber: number, totalPages: number, title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Accent Bar
  doc.setDrawColor(...COLOR_ACCENT);
  doc.setLineWidth(0.8);
  doc.line(20, 15, pageWidth - 20, 15);

  // Masthead Brand
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_INK);
  doc.text('VOLIA.', 20, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('ENGINEERING & CONSULTANCY // NIGERIA', 40, 22);

  // Document Title & Page counter
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(title.toUpperCase(), pageWidth - 70, 22, { align: 'right' });
  doc.text(`PAGE ${pageNumber} OF ${totalPages}`, pageWidth - 20, 22, { align: 'right' });

  // Divider Rule
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(20, 25, pageWidth - 20, 25);
}

/**
 * Draws a standardized footer on a given jsPDF document
 */
function drawFooter(doc: jsPDF, refCode: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(20, pageHeight - 18, pageWidth - 20, pageHeight - 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(
    'VOLIA NIG LTD // COMMERCIAL PROTOTYPE SPECIMEN // CONFIDENTIAL',
    20,
    pageHeight - 12
  );
  doc.text(`REF: ${refCode}`, pageWidth - 20, pageHeight - 12, { align: 'right' });
}

// ============================================================================
// 1. PROJECT BRIEF PDF GENERATOR
// ============================================================================

export function generateProjectBriefPdf(brief: ProjectBriefSubmission): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const totalPages = 2;

  // ---------------- PAGE 1: CLIENT & PROJECT CORE PARAMETERS ----------------
  drawHeader(doc, 1, totalPages, 'Project Scoping Brief');

  let y = 35;

  // Title Block
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLOR_INK);
  doc.text('Client Project Brief', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('Preliminary Engineering, Architectural & Cost Advisory Scoping Dossier', margin, y);
  y += 10;

  // Meta Box (Surface Fill)
  doc.setFillColor(...COLOR_SURFACE);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setDrawColor(...COLOR_BORDER);
  doc.rect(margin, y, contentWidth, 18, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_INK);
  doc.text('DOSSIER REFERENCE:', margin + 4, y + 6);
  doc.text('SUBMISSION DATE:', margin + 70, y + 6);
  doc.text('CLASSIFICATION:', margin + 125, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_ACCENT);
  doc.text(brief.referenceId, margin + 4, y + 12);
  doc.setTextColor(...COLOR_INK);
  doc.text(new Date(brief.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), margin + 70, y + 12);
  doc.text('COMMERCIAL-IN-CONFIDENCE', margin + 125, y + 12);

  y += 26;

  // Section 1: Client Information
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_INK);
  doc.text('01 // Proponent Information', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  const clientInfo = [
    { label: 'Proponent Name', value: brief.fullName },
    { label: 'Organization / Entity', value: brief.companyName || 'Private Developer' },
    { label: 'Corporate Email', value: brief.email },
    { label: 'Telephone Number', value: brief.phone },
  ];

  clientInfo.forEach((item, index) => {
    const colX = margin + (index % 2) * (contentWidth / 2);
    const rowY = y + Math.floor(index / 2) * 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(item.label.toUpperCase(), colX, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_INK);
    doc.text(item.value, colX, rowY + 5);
  });

  y += 28;

  // Section 2: Project Parameters
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_INK);
  doc.text('02 // Project Parameters & Context', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  const projectParams = [
    { label: 'Project Name', value: brief.projectName },
    { label: 'Geographic Location', value: brief.projectLocation },
    { label: 'Development Typology', value: brief.projectType },
    { label: 'Current Project Stage', value: brief.projectStage },
    { label: 'Estimated Capital Budget', value: brief.estimatedBudget },
    { label: 'Anticipated Timeline', value: brief.expectedTimeline },
  ];

  projectParams.forEach((item, index) => {
    const colX = margin + (index % 2) * (contentWidth / 2);
    const rowY = y + Math.floor(index / 2) * 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(item.label.toUpperCase(), colX, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_INK);
    doc.text(item.value, colX, rowY + 5);
  });

  y += 42;

  // Section 3: Services Required
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_INK);
  doc.text('03 // Requested Professional Disciplines', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  brief.servicesRequired.forEach((svc) => {
    doc.setFillColor(...COLOR_SURFACE);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(...COLOR_BORDER);
    doc.rect(margin, y, contentWidth, 7, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_INK);
    doc.text(`[X]  ${svc}`, margin + 4, y + 4.8);
    y += 9;
  });

  if (brief.otherServiceDescription) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(`Additional Discipline Scope: ${brief.otherServiceDescription}`, margin + 2, y + 2);
    y += 8;
  }

  drawFooter(doc, brief.referenceId);

  // ---------------- PAGE 2: NARRATIVE, SPECIAL SPECS & DISCLAIMER ----------------
  doc.addPage();
  drawHeader(doc, 2, totalPages, 'Project Scoping Brief');

  y = 35;

  // Section 4: Narrative Description
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_INK);
  doc.text('04 // Development Narrative & Spatial Objectives', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_INK);

  const descLines = doc.splitTextToSize(brief.projectDescription || 'No detailed narrative provided.', contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 4.5 + 10;

  // Section 5: Special Requirements
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_INK);
  doc.text('05 // Technical Constraints & Special Requirements', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_INK);

  const reqLines = doc.splitTextToSize(
    brief.specialRequirements || 'Standard statutory building and engineering codes apply. No bespoke structural anomalies declared.',
    contentWidth
  );
  doc.text(reqLines, margin, y);
  y += reqLines.length * 4.5 + 10;

  // Attachment note if present
  if (brief.referenceAttachmentName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_ACCENT);
    doc.text(`ATTACHED REFERENCE DOCUMENTATION: ${brief.referenceAttachmentName}`, margin, y);
    y += 10;
  }

  // Section 6: Commercial & Legal Disclaimer
  y = Math.max(y + 6, 205);

  doc.setFillColor(...COLOR_SURFACE);
  doc.rect(margin, y, contentWidth, 38, 'F');
  doc.setDrawColor(...COLOR_BORDER);
  doc.rect(margin, y, contentWidth, 38, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_INK);
  doc.text('VOLIA NIG LTD // CONSULTANCY SCOPING PROTOCOL & NOTICE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_MUTED);

  const disclaimer =
    'This generated brief serves as a preliminary scoping document to establish design parameters, regulatory requirements, and baseline fee scheduling. It does not constitute a binding legal contract or formal commencement of works. A formal Letter of Engagement and technical scope memorandum will be executed following peer review by VOLIA NIG LTD executive partners.';

  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
  doc.text(disclaimerLines, margin + 4, y + 12);

  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_ACCENT);
  doc.text('VOLIA NIG LTD // Integrated Engineering, Architecture & Quantity Surveying', margin + 4, y + 33);

  drawFooter(doc, brief.referenceId);

  // Trigger browser download
  doc.save(`VOLIA_Project_Brief_${brief.referenceId}.pdf`);
}

// ============================================================================
// 2. CORPORATE CAPABILITY STATEMENT PDF GENERATOR
// ============================================================================

export function generateCapabilityStatementPdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const totalPages = 4;
  const refCode = CAPABILITY_STATEMENT_DATA.documentMeta.code;

  // ---------------- PAGE 1: COVER PAGE ----------------
  // Top hairline accent rule
  doc.setDrawColor(...COLOR_ACCENT);
  doc.setLineWidth(1.2);
  doc.line(margin, 25, pageWidth - margin, 25);

  // Big Monogram Wordmark
  doc.setFont('times', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(...COLOR_INK);
  doc.text('VOLIA.', margin, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('ENGINEERING & BUILT-ENVIRONMENT CONSULTANCY', margin, 50);

  // Center Headline Block
  let y = 120;
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...COLOR_INK);
  doc.text('Corporate Capability', margin, y);
  y += 10;
  doc.text('Statement', margin, y);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_ACCENT);
  doc.text('Multidisciplinary Advisory Mandate & Practice Profile', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  const coverIntro =
    'An institutional overview of engineering consultancy, architectural strategy, and quantity surveying capabilities tailored for capital projects across Nigeria and the West African built environment.';
  const coverLines = doc.splitTextToSize(coverIntro, contentWidth - 20);
  doc.text(coverLines, margin, y);

  // Cover Footer Meta
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 45, pageWidth - margin, pageHeight - 45);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_INK);
  doc.text('DOCUMENT CODE:', margin, pageHeight - 38);
  doc.text('CORPORATE STATUS:', margin + 60, pageHeight - 38);
  doc.text('EDITION:', margin + 125, pageHeight - 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_ACCENT);
  doc.text(refCode, margin, pageHeight - 32);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('COMMERCIAL PITCH PROTOTYPE', margin + 60, pageHeight - 32);
  doc.text('2026 PROVISIONAL', margin + 125, pageHeight - 32);

  doc.text(
    'Note: Historical incorporation (Reported 1993) and leadership accreditations subject to final executive management verification.',
    margin,
    pageHeight - 24
  );

  // ---------------- PAGE 2: PRACTICE OVERVIEW & METHODOLOGY ----------------
  doc.addPage();
  drawHeader(doc, 2, totalPages, 'Practice Profile');

  y = 35;
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_INK);
  doc.text('01 // Executive Overview & Advisory Mandate', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_INK);
  const overviewLines = doc.splitTextToSize(CAPABILITY_STATEMENT_DATA.overview.statement, contentWidth);
  doc.text(overviewLines, margin, y);
  y += overviewLines.length * 4.5 + 4;

  const mandateLines = doc.splitTextToSize(CAPABILITY_STATEMENT_DATA.overview.mandate, contentWidth);
  doc.text(mandateLines, margin, y);
  y += mandateLines.length * 4.5 + 8;

  // 4 Core Pillars Grid
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_INK);
  doc.text('Operational Quality Pillars', margin, y);
  y += 6;

  CAPABILITY_STATEMENT_DATA.overview.corePillars.forEach((pillar) => {
    doc.setFillColor(...COLOR_SURFACE);
    doc.rect(margin, y, contentWidth, 13, 'F');
    doc.setDrawColor(...COLOR_BORDER);
    doc.rect(margin, y, contentWidth, 13, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_ACCENT);
    doc.text(pillar.title.toUpperCase(), margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_INK);
    const pLines = doc.splitTextToSize(pillar.detail, contentWidth - 8);
    doc.text(pLines, margin + 4, y + 9);

    y += 15;
  });

  y += 5;

  // Background Note Box
  doc.setFillColor(...COLOR_SURFACE);
  doc.rect(margin, y, contentWidth, 24, 'F');
  doc.setDrawColor(...COLOR_BORDER);
  doc.rect(margin, y, contentWidth, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_INK);
  doc.text('CORPORATE HERITAGE & INDEPENDENCE (Reported 1993)', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_MUTED);
  const histLines = doc.splitTextToSize(
    `${CAPABILITY_STATEMENT_DATA.background.historyNote} ${CAPABILITY_STATEMENT_DATA.background.governanceModel}`,
    contentWidth - 8
  );
  doc.text(histLines, margin + 4, y + 10.5);

  drawFooter(doc, refCode);

  // ---------------- PAGE 3: THREE CORE DISCIPLINES & SCOPES ----------------
  doc.addPage();
  drawHeader(doc, 3, totalPages, 'Services & Scope of Advisory');

  y = 35;
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_INK);
  doc.text('02 // Multidisciplinary Scope of Services', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  CAPABILITY_STATEMENT_DATA.services.forEach((service) => {
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_INK);
    doc.text(`${service.code} // ${service.name}`, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_ACCENT);
    doc.text(service.focus, margin, y);
    y += 5;

    service.scopeItems.forEach((scope) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLOR_INK);
      doc.text(`•  ${scope}`, margin + 3, y);
      y += 4;
    });

    y += 6;
  });

  drawFooter(doc, refCode);

  // ---------------- PAGE 4: DELIVERY FRAMEWORK & PROTOCOL ----------------
  doc.addPage();
  drawHeader(doc, 4, totalPages, 'Delivery Framework & Contact');

  y = 35;
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_INK);
  doc.text('03 // Four-Phase Delivery Framework', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  CAPABILITY_STATEMENT_DATA.methodology.forEach((m) => {
    doc.setFillColor(...COLOR_SURFACE);
    doc.rect(margin, y, contentWidth, 14, 'F');
    doc.setDrawColor(...COLOR_BORDER);
    doc.rect(margin, y, contentWidth, 14, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_INK);
    doc.text(`${m.phase.toUpperCase()}: ${m.title}`, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(`Key Deliverables: ${m.deliverables}`, margin + 4, y + 10);

    y += 16;
  });

  y += 6;

  // Contact & Protocol Information
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_INK);
  doc.text('04 // Engagement & Corporate Communications', margin, y);
  y += 3;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  const contactRows = [
    { label: 'CORPORATE EMAIL:', val: CAPABILITY_STATEMENT_DATA.documentMeta.contactEmail },
    { label: 'SWITCHBOARD:', val: CAPABILITY_STATEMENT_DATA.documentMeta.contactPhone },
    { label: 'HEADQUARTERS:', val: CAPABILITY_STATEMENT_DATA.documentMeta.headquarters },
    { label: 'LIAISON OFFICE:', val: CAPABILITY_STATEMENT_DATA.documentMeta.regionalLiaison },
  ];

  contactRows.forEach((row) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(row.label, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_INK);
    doc.text(row.val, margin + 45, y);
    y += 5.5;
  });

  y += 8;

  // Disclaimer block
  doc.setFillColor(...COLOR_SURFACE);
  doc.rect(margin, y, contentWidth, 24, 'F');
  doc.setDrawColor(...COLOR_BORDER);
  doc.rect(margin, y, contentWidth, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_INK);
  doc.text('GOVERNANCE & COMMERCIAL PROTOTYPE NOTICE', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...COLOR_MUTED);
  const discLines = doc.splitTextToSize(
    `${CAPABILITY_STATEMENT_DATA.portfolioNotice} ${CAPABILITY_STATEMENT_DATA.complianceDisclaimer}`,
    contentWidth - 8
  );
  doc.text(discLines, margin + 4, y + 10);

  drawFooter(doc, refCode);

  doc.save('VOLIA_Corporate_Capability_Statement.pdf');
}
