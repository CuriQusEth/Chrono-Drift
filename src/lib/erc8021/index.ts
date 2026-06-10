// ERC-8021: Transaction Attribution
// Allows specifying attribution and builder codes for dApp transactions.

export const BUILDER_CODE = "[BUILDER_CODE]";
export const APP_ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";

export interface AttributionDetails {
  builder: string;
  attribution: string;
}

/**
 * Appends attribution tracking to transaction calldata if required.
 * For this implementation, we simply return the standard format or emit an event.
 */
export function getAttributionPayload(): AttributionDetails {
  return {
    builder: BUILDER_CODE,
    attribution: APP_ATTRIBUTION_CODE,
  };
}

export function buildTransactionWithAttribution(baseCalldata: string): string {
  // Mock implementation of appending ERC-8021 data to calldata
  // In a real scenario, this applies the EIP-8021 specification
  console.log(`[ERC-8021] Tracking transaction for builder: ${BUILDER_CODE}`);
  return baseCalldata;
}
