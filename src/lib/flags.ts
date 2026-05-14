/**
 * Device-independent country flag rendering.
 *
 * Problem: Unicode emoji flags (🇵🇰) depend on OS emoji support.
 * They work on most iPhones but fail on many Android devices (Vivo, etc.)
 * and look inconsistent across platforms.
 *
 * Solution: Use flagcdn.com PNG flag images — they render identically
 * on every device since they're just <img> tags.
 *
 * flagcdn.com is a free, open-source flag CDN maintained by the
 * flag-icons project. No API key needed. No rate limits for normal use.
 * https://flagcdn.com
 */

const FLAG_BASE_URL = 'https://flagcdn.com';

/**
 * Get the URL for a country flag image.
 * Returns an empty string if the code is invalid.
 */
export function getFlagImageUrl(code: string, width: number = 40): string {
  if (!code || typeof code !== 'string') return '';
  const clean = code.toLowerCase().trim();
  if (clean.length !== 2) return '';
  return `${FLAG_BASE_URL}/w${width}/${clean}.png`;
}

/**
 * Get a small flag URL (20px) for inline use in lists/dropdowns.
 */
export function getSmallFlagUrl(code: string): string {
  return getFlagImageUrl(code, 20);
}

/**
 * Get a medium flag URL (40px) for headers/cards.
 */
export function getMediumFlagUrl(code: string): string {
  return getFlagImageUrl(code, 40);
}

/**
 * Get a large flag URL (80px) for hero sections.
 */
export function getLargeFlagUrl(code: string): string {
  return getFlagImageUrl(code, 80);
}

/**
 * SVG flag URLs — sharper at any size but may not be available for all codes.
 */
export function getFlagSvgUrl(code: string): string {
  if (!code || typeof code !== 'string') return '';
  const clean = code.toLowerCase().trim();
  if (clean.length !== 2) return '';
  return `${FLAG_BASE_URL}/${clean}.svg`;
}

/**
 * Check if a country code is valid (2-letter ISO).
 */
export function isValidCountryCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const clean = code.toUpperCase().trim();
  return clean.length === 2 && /^[A-Z]{2}$/.test(clean);
}
