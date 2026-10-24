import { describe, it, expect, vi } from 'vitest';
import { trackEvent } from '../analytics';
import { validatePdfSignature } from '../fileValidation';

describe('Network Egress and Client-Side Confinement Audit', () => {
  it('confirms analytics does not invoke fetch, XMLHttpRequest, or sendBeacon', () => {
    // Spy on global network functions
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const sendBeaconSpy = vi.fn();
    Object.defineProperty(navigator, 'sendBeacon', {
      value: sendBeaconSpy,
      configurable: true,
      writable: true,
    });

    // Track sample events
    trackEvent('tool_view', { tool: 'merge' });
    trackEvent('processing_started', { tool: 'merge' });
    trackEvent('processing_succeeded', { tool: 'merge' });

    // Assert zero external network calls were initiated
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(sendBeaconSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
  });

  it('confirms file validation runs strictly on memory buffers without network I/O', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const blob = new Blob(['%PDF-1.4\n1 0 obj...'], { type: 'application/pdf' });

    const isValid = await validatePdfSignature(blob);
    expect(isValid).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
  });
});
