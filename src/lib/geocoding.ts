/**
 * Geocoding filter — verified against Wikipedia city database.
 *
 * Two-layer filtering:
 * 1. Name must EXACTLY match the search query (rejects "Hyderabad Colony")
 * 2. Result is checked against the verified cities database
 *    (rejects "Hyderabad, Punjab, Pakistan" because our Wikipedia-sourced
 *    database says Hyderabad in PK is only valid in Sindh)
 */

import type { GeoSearchResult } from './types';
import { isVerifiedCity } from './cities';

// Feature codes for real populated places
const CITY_FEATURE_CODES = new Set([
  'PPL', 'PPLC', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLA5',
  'PPLG', 'PPLL', 'PPLS', 'PPLH', 'PPLW', 'PPLX', 'PPLQ', 'PPLF',
  'STLMT',
]);

function norm(s: string): string {
  return s.trim().replace(/\s+/g, ' ').toLowerCase();
}

function scoreResult(result: GeoSearchResult): number {
  let score = 0;
  if (result.featureCode === 'PPLC') score += 500;
  if (['PPLA', 'PPLA2'].includes(result.featureCode || '')) score += 200;
  if (result.population && result.population > 0) {
    score += Math.log10(result.population) * 50;
  }
  return score;
}

function sortByScore(results: GeoSearchResult[]): GeoSearchResult[] {
  return results
    .map((r) => ({ r, s: scoreResult(r) }))
    .sort((a, b) => b.s - a.s)
    .map((e) => e.r);
}

/**
 * Filter pipeline:
 *
 * Step 1: Only keep results where name EXACTLY matches query
 *         → "Hyderabad" keeps "Hyderabad", rejects "Hyderabad Colony"
 *
 * Step 2: Only keep results with a city feature code (PPL*)
 *         → rejects factories, lakes, mountains, etc.
 *
 * Step 3: Check against Wikipedia city database
 *         → "Hyderabad, Punjab, Pakistan" is NOT in our database
 *           (we only have "Hyderabad, Sindh, Pakistan")
 *           → REJECTED
 *
 * Step 4: Sort by score (capital > admin seat > population)
 *
 * Step 5: Limit to 5 results
 */
export function filterCities(
  raw: GeoSearchResult[],
  query: string,
  limit: number = 5,
): GeoSearchResult[] {
  const q = norm(query);

  // ── Exact name + city code + database verification ──
  const verified = raw.filter((r) => {
    // Name must exactly match
    if (norm(r.name) !== q) return false;

    // Must have city feature code
    if (!CITY_FEATURE_CODES.has(r.featureCode || '')) return false;

    // Must be in our verified database (or not tracked by us)
    if (!isVerifiedCity(r.name, r.countryCode || '', r.admin1 || '')) return false;

    return true;
  });

  if (verified.length > 0) {
    return sortByScore(verified).slice(0, limit);
  }

  // ── Fallback: prefix matches while typing (big cities only) ──
  const prefix = raw.filter((r) => {
    const name = norm(r.name);
    if (!name.startsWith(q) || name === q) return false;
    if (!CITY_FEATURE_CODES.has(r.featureCode || '')) return false;
    if (!isVerifiedCity(r.name, r.countryCode || '', r.admin1 || '')) return false;
    return true;
  });

  if (prefix.length > 0) {
    return sortByScore(prefix).slice(0, limit);
  }

  // ── Last resort: exact name without database check ──
  const loose = raw.filter((r) =>
    norm(r.name) === q && CITY_FEATURE_CODES.has(r.featureCode || '')
  );

  return sortByScore(loose).slice(0, limit);
}

export function clearGeocodingCache(): void {
  try {
    const remove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('skypulse_geo_')) remove.push(key);
    }
    remove.forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

export function normalizeSearchQuery(q: string): string {
  return norm(q);
}
