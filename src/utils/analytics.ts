/**
 * Privacy-conscious analytics module
 * Collects zero document contents, zero filenames, zero personal metadata.
 * Only records aggregate tool usage events to compare utility interactions.
 */

export type AnalyticsEventType =
  | 'tool_view'
  | 'processing_started'
  | 'processing_succeeded'
  | 'processing_failed'
  | 'output_downloaded'
  | 'smartlink_clicked';

interface AnalyticsPayload {
  tool: string;
  action?: string;
  durationMs?: number;
  reductionPercent?: number;
}

export function trackEvent(eventType: AnalyticsEventType, payload: AnalyticsPayload): void {
  try {
    // Only aggregate data, never file names or contents
    const eventDetail = {
      event: eventType,
      tool: payload.tool,
      timestamp: Date.now(),
      reductionPercent: payload.reductionPercent,
    };

    // Emit custom event for client monitoring or privacy-friendly beacons if integrated
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pqt_analytics', { detail: eventDetail }));
      
      // Store anonymous aggregate counters in sessionStorage for the session
      const key = `pqt_count_${payload.tool}_${eventType}`;
      const prev = parseInt(sessionStorage.getItem(key) || '0', 10);
      sessionStorage.setItem(key, (prev + 1).toString());
    }
  } catch {
    // Silent fail; analytics must never interrupt tool execution
  }
}
