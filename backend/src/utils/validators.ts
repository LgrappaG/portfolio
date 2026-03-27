/**
 * Utility functions for input validation and sanitization
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  const htmlMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlMap[char]);
}

/**
 * Validate email address using regex (RFC 5322 simplified)
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false;
  }

  // RFC 5322 simplified regex
  // Matches: user@example.com, user.name@example.co.uk, etc.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Additional validation checks
  if (!emailRegex.test(email)) {
    return false;
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return false;
  }

  // Check local part length (max 64 chars per RFC)
  const [localPart] = email.split('@');
  if (localPart.length > 64) {
    return false;
  }

  // Check total length (max 254 chars per RFC)
  if (email.length > 254) {
    return false;
  }

  return true;
}

/**
 * Sanitize string input - trim and remove potentially dangerous characters
 */
export function sanitizeString(
  input: string,
  options: {
    maxLength?: number;
    allowSpecialChars?: boolean;
    toTrim?: boolean;
  } = {}
): string {
  const {
    maxLength = 1000,
    allowSpecialChars = true,
    toTrim = true,
  } = options;

  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Trim whitespace
  if (toTrim) {
    sanitized = sanitized.trim();
  }

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  return sanitized;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: string | number, limit?: string | number) {
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 12;
  const MAX_LIMIT = 100;
  const MAX_PAGE = 1000;

  let parsedPage = typeof page === 'string' ? parseInt(page, 10) : page || DEFAULT_PAGE;
  let parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit || DEFAULT_LIMIT;

  // Validate page
  if (isNaN(parsedPage) || parsedPage < 1) {
    parsedPage = DEFAULT_PAGE;
  }
  if (parsedPage > MAX_PAGE) {
    parsedPage = MAX_PAGE;
  }

  // Validate limit
  if (isNaN(parsedLimit) || parsedLimit < 1) {
    parsedLimit = DEFAULT_LIMIT;
  }
  if (parsedLimit > MAX_LIMIT) {
    parsedLimit = MAX_LIMIT;
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
  };
}

/**
 * Validate search query
 */
export function validateSearchQuery(query?: string): { valid: boolean; query: string } {
  if (!query || typeof query !== 'string') {
    return { valid: false, query: '' };
  }

  const sanitized = sanitizeString(query, {
    maxLength: 100,
    toTrim: true,
  });

  // Check minimum length
  if (sanitized.length < 1) {
    return { valid: false, query: '' };
  }

  // Check maximum length
  if (sanitized.length > 100) {
    return { valid: false, query: '' };
  }

  // Allow alphanumeric, spaces, hyphens, dots, underscores
  if (!/^[a-zA-Z0-9\s\-._]+$/.test(sanitized)) {
    return { valid: false, query: '' };
  }

  return { valid: true, query: sanitized };
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse integer safely with bounds
 */
export function parseIntSafe(
  value: string | number | undefined,
  defaultValue: number,
  minValue?: number,
  maxValue?: number
): number {
  let parsed = typeof value === 'string' ? parseInt(value, 10) : value || defaultValue;

  if (isNaN(parsed)) {
    parsed = defaultValue;
  }

  if (minValue !== undefined && parsed < minValue) {
    parsed = minValue;
  }

  if (maxValue !== undefined && parsed > maxValue) {
    parsed = maxValue;
  }

  return parsed;
}

/**
 * Validate boolean string ('true' or 'false')
 */
export function parseBooleanString(
  value: string | boolean | undefined,
  defaultValue: boolean = false
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return defaultValue;
}
