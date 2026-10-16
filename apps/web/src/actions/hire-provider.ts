"use client";

export interface ResidentDetails {
  name: string;
  email?: string;
  phone?: string;
  society?: string;
  unit?: string;
  location?: string;
  address?: string;
  category?: string;
  providerName?: string;
  serviceCategory?: string;
  serviceRequired?: string;
  notes?: string;
  date?: string;
  time?: string;
}

export interface HireNotificationResponse {
  success: boolean;
  message: string;
  error?: string;
  emailId?: string;
  isRealDelivery?: boolean;
  directDelivery?: boolean;
  sandboxWarning?: string | null;
  method?: string;
  previewUrl?: string | false;
  residentPreviewUrl?: string | false;
  providerPreviewUrl?: string | false;
  gmailComposeUrl?: string;
}

/**
 * Dispatches automated email notifications to both the service provider
 * and the resident when a booking request is made.
 */
export async function sendHireNotification(
  providerEmail: string,
  residentDetails: ResidentDetails
): Promise<HireNotificationResponse> {
  const targetEmail = providerEmail?.trim();

  const residentName = residentDetails?.name || 'Resident Member';
  const serviceCategory = residentDetails?.serviceCategory || residentDetails?.category || 'Service Request';
  const residentLocation = residentDetails?.location || residentDetails?.society || residentDetails?.unit || residentDetails?.address || 'Greenfield Residency';
  const taskDesc = residentDetails?.serviceRequired || residentDetails?.notes || 'Doorstep society service request';
  const phone = residentDetails?.phone || '+91 98765 43210';

  const emailSubject = `🔔 Work Order: ${residentName} called you for ${serviceCategory} (${residentLocation})`;
  const emailBody = `Hello ${residentDetails?.providerName || 'Service Provider'},\n\nResident ${residentName} has requested your services on NearNest for ${serviceCategory}.\n\nDetails:\n- Location / Flat: ${residentLocation}\n- Phone: ${phone}\n- Work Required: ${taskDesc}\n\nPlease contact the resident directly to confirm your arrival.\n\nSent via NearNest Platform`;

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail || '')}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  try {
    if (!targetEmail || !targetEmail.includes('@')) {
      return {
        success: false,
        error: 'Invalid service provider email address.',
        message: 'Could not send request: missing or invalid provider email.',
        gmailComposeUrl,
      };
    }

    // Call the backend / edge email API route
    try {
      const res = await fetch('/api/services/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerEmail: targetEmail,
          residentDetails,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const activeUrl = data.residentPreviewUrl || data.previewUrl || data.providerPreviewUrl;
          if (activeUrl) {
            console.log(
              `%c[NearNest Real Email Preview Link]:%c ${activeUrl}`,
              'color: #10b981; font-weight: bold; font-size: 13px;',
              'color: #3b82f6; text-decoration: underline;'
            );
          }
          return {
            success: true,
            isRealDelivery: data.isRealDelivery,
            directDelivery: data.directDelivery,
            sandboxWarning: data.sandboxWarning,
            method: data.method,
            message: data.message || 'Confirmation email dispatched to resident and provider!',
            previewUrl: activeUrl,
            residentPreviewUrl: data.residentPreviewUrl,
            providerPreviewUrl: data.providerPreviewUrl,
            gmailComposeUrl,
          };
        }
      } else {
        console.warn(`[NearNest Email Dispatch]: /api/services/hire returned HTTP ${res.status}`);
      }
    } catch (apiErr) {
      console.warn('API /api/services/hire not reachable directly:', apiErr);
    }

    return {
      success: true,
      isRealDelivery: false,
      message: 'Request submitted successfully!',
      gmailComposeUrl,
    };
  } catch (err: any) {
    console.error('sendHireNotification error:', err);
    return {
      success: false,
      error: err?.message || 'Failed to dispatch email notification',
      message: 'Failed to send notification. Please try again.',
      gmailComposeUrl,
    };
  }
}
