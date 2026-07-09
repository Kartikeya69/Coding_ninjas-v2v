/**
 * Checks if email matches common regex standards
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates text length constraints
 */
export function isRequiredLength(val: string, min = 1, max = 5000): boolean {
  const len = val.trim().length;
  return len >= min && len <= max;
}

/**
 * Check if URL is structured properly
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
