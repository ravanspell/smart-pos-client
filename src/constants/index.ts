
//Max number of retries for the RTK API
export const MAX_RETRIES = 5;

// Default Error Section ID
export const DEFAULT_ERROR_SECTION_ID = 'defaultError';

// Error Types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  UNEXPECTED: 'UNEXPECTED',
  SERVER: 'SERVER',
} as const;

// Error Layout Types
export const ERROR_LAYOUT_TYPES = {
  TOAST: 'TOAST',
  FULL_PAGE: 'FULL_PAGE',
} as const;

export type ErrorType = keyof typeof ERROR_TYPES; // 'NETWORK' | 'UNEXPECTED' | 'SERVER'
export type ErrorLayoutType = keyof typeof ERROR_LAYOUT_TYPES | undefined; // 'TOAST' | 'FULL_PAGE'