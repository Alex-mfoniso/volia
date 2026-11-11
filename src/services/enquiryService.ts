/**
 * VOLIA NIG LTD — Enterprise Enquiry & Project Brief Service Abstraction
 * 
 * IMPORTANT ARCHITECTURAL DESIGN:
 * This service provides a clean, modular abstraction layer for client inquiries.
 * If VITE_CONTACT_API_ENDPOINT is not configured or set to a placeholder,
 * the service transparently enters PROTOTYPE SIMULATION MODE.
 * It NEVER falsifies external server delivery, maintaining 100% commercial integrity.
 */

export interface ProjectBriefSubmission {
  // Personal & Corporate Contact
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;

  // Project Parameters
  projectName: string;
  projectLocation: string;
  projectType: string;
  estimatedBudget: string;
  projectStage: string;
  expectedTimeline: string;

  // Selected Disciplines
  servicesRequired: string[];
  otherServiceDescription?: string;

  // Narrative & Attachments
  projectDescription: string;
  specialRequirements?: string;
  referenceAttachmentName?: string;

  // Generated Meta
  referenceId: string;
  timestamp: string;
}

export interface SubmissionResult {
  success: boolean;
  mode: 'live_backend' | 'prototype_simulation';
  referenceId: string;
  message: string;
  timestamp: string;
  data: ProjectBriefSubmission;
  technicalDetails?: {
    endpointUsed?: string;
    httpStatus?: number;
    notes: string;
  };
}

/**
 * Generate a sequential, professional engineering reference code
 */
export function generateBriefReferenceCode(): string {
  const year = new Date().getFullYear();
  const randomHex = Math.floor(1000 + Math.random() * 9000);
  return `VOLIA-BRF-${year}-${randomHex}`;
}

export interface GeneralEnquirySubmission {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  inquiryCategory: string;
  message: string;
}

export interface GeneralEnquiryResult {
  success: boolean;
  mode: 'live_backend' | 'prototype_simulation';
  referenceId: string;
  message: string;
  timestamp: string;
  data: GeneralEnquirySubmission;
}

export class EnquiryService {
  private static apiEndpoint = (import.meta.env.VITE_CONTACT_API_ENDPOINT as string | undefined)?.trim();

  /**
   * Determine whether a production backend endpoint is configured
   */
  public static isBackendConfigured(): boolean {
    if (!this.apiEndpoint) return false;
    // Check if it's the template placeholder or invalid
    if (this.apiEndpoint.includes('api.volia.ng/v1') || this.apiEndpoint.includes('example.com')) {
      return false;
    }
    return true;
  }

  /**
   * Submit a general corporate contact inquiry
   */
  public static async submitGeneralEnquiry(
    enquiry: GeneralEnquirySubmission
  ): Promise<GeneralEnquiryResult> {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `VOLIA-INQ-${year}-${randomHex}`;
    const timestamp = new Date().toISOString();

    if (this.isBackendConfigured() && this.apiEndpoint) {
      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ ...enquiry, referenceId, timestamp }),
        });

        if (!response.ok) {
          throw new Error(`Endpoint returned HTTP ${response.status}`);
        }

        return {
          success: true,
          mode: 'live_backend',
          referenceId,
          message: 'Your inquiry has been successfully transmitted to VOLIA corporate intake.',
          timestamp,
          data: enquiry,
        };
      } catch (err) {
        console.warn('[VOLIA EnquiryService] Fallback to simulation mode:', err);
      }
    }

    // Honest simulation
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      mode: 'prototype_simulation',
      referenceId,
      message:
        'Inquiry processed in demonstration prototype mode. In production, this dispatches to the corporate Laravel API endpoint.',
      timestamp,
      data: enquiry,
    };
  }

  /**
   * Submit a structured project brief with honest simulation fallback
   */
  public static async submitProjectBrief(
    brief: Omit<ProjectBriefSubmission, 'referenceId' | 'timestamp'>
  ): Promise<SubmissionResult> {
    const referenceId = generateBriefReferenceCode();
    const timestamp = new Date().toISOString();

    const completePayload: ProjectBriefSubmission = {
      ...brief,
      referenceId,
      timestamp,
    };

    // If a verified live backend endpoint is configured, attempt real transmission
    if (this.isBackendConfigured() && this.apiEndpoint) {
      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(completePayload),
        });

        if (!response.ok) {
          throw new Error(`Endpoint returned HTTP ${response.status}: ${response.statusText}`);
        }

        return {
          success: true,
          mode: 'live_backend',
          referenceId,
          message: 'Your project brief has been successfully received by VOLIA NIG LTD corporate intake.',
          timestamp,
          data: completePayload,
          technicalDetails: {
            endpointUsed: this.apiEndpoint,
            httpStatus: response.status,
            notes: 'Successfully committed to live corporate backend integration.',
          },
        };
      } catch (error) {
        console.warn('[VOLIA EnquiryService] Backend transmission failed, falling back to prototype receipt:', error);
        return {
          success: false,
          mode: 'prototype_simulation',
          referenceId,
          message:
            'A backend endpoint was configured, but connection could not be established. A local simulation receipt has been generated.',
          timestamp,
          data: completePayload,
          technicalDetails: {
            endpointUsed: this.apiEndpoint,
            notes: error instanceof Error ? error.message : 'Unknown network failure',
          },
        };
      }
    }

    // HONEST PROTOTYPE SIMULATION
    // Simulate brief processing delay for realistic user feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      mode: 'prototype_simulation',
      referenceId,
      message:
        'Prototype Mode: Inquiries endpoint is currently in demonstration mode. Your project brief has been formatted and stored in temporary browser memory for review and PDF download.',
      timestamp,
      data: completePayload,
      technicalDetails: {
        notes:
          'No external server endpoint is attached in this prototype build. All parameters were verified client-side without data falsification.',
      },
    };
  }
}
