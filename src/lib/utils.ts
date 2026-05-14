import type { Settings, AqiLevel } from './types';

// ===== FLAG UTILITY =====
export function countryCodeToFlag(code: string): string {
  if (!code || typeof code !== 'string') return '';
  const clean = code.toUpperCase().trim();
  if (clean.length !== 2) return '';
  try {
    return String.fromCodePoint(
      127397 + clean.charCodeAt(0),
      127397 + clean.charCodeAt(1)
    );
  } catch {
    return '';
  }
}

export function countryCodeToFlagHtml(code: string): string {
  const flag = countryCodeToFlag(code);
  if (!flag) return '';
  return flag;
}

// ===== UNIT CONVERSIONS =====
export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371 * 10) / 10;
}

export function formatTemp(temp: number, unit: Settings['tempUnit']): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : Math.round(temp);
  return `${value}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatTempValue(temp: number, unit: Settings['tempUnit']): number {
  return unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : Math.round(temp);
}

export function formatTempShort(temp: number, unit: Settings['tempUnit']): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : Math.round(temp);
  return `${value}°`;
}

export function formatWind(speed: number, unit: Settings['windUnit']): string {
  const value = unit === 'mph' ? kmhToMph(speed) : Math.round(speed * 10) / 10;
  return `${value} ${unit === 'mph' ? 'mph' : 'km/h'}`;
}

export function formatWindValue(speed: number, unit: Settings['windUnit']): number {
  return unit === 'mph' ? kmhToMph(speed) : Math.round(speed * 10) / 10;
}

export function getTempUnitLabel(unit: Settings['tempUnit']): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function getWindUnitLabel(unit: Settings['windUnit']): string {
  return unit === 'mph' ? 'mph' : 'km/h';
}

// ===== LOCAL STORAGE =====
const STORAGE_PREFIX = 'skypulse_';

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // ignore
  }
}

// ===== AQI HELPERS =====
export function getAqiLevel(euAqi: number | null): AqiLevel {
  if (euAqi === null) {
    return { label: 'Unknown', color: 'gray', bgColor: 'bg-gray-100 dark:bg-gray-800', textColor: 'text-gray-700 dark:text-gray-300' };
  }
  if (euAqi <= 20) return { label: 'Good', color: 'green', bgColor: 'bg-emerald-100 dark:bg-emerald-900/40', textColor: 'text-emerald-700 dark:text-emerald-300' };
  if (euAqi <= 40) return { label: 'Fair', color: 'lime', bgColor: 'bg-lime-100 dark:bg-lime-900/40', textColor: 'text-lime-700 dark:text-lime-300' };
  if (euAqi <= 60) return { label: 'Moderate', color: 'yellow', bgColor: 'bg-yellow-100 dark:bg-yellow-900/40', textColor: 'text-yellow-700 dark:text-yellow-300' };
  if (euAqi <= 80) return { label: 'Poor', color: 'orange', bgColor: 'bg-orange-100 dark:bg-orange-900/40', textColor: 'text-orange-700 dark:text-orange-300' };
  if (euAqi <= 100) return { label: 'Very Poor', color: 'red', bgColor: 'bg-red-100 dark:bg-red-900/40', textColor: 'text-red-700 dark:text-red-300' };
  return { label: 'Hazardous', color: 'purple', bgColor: 'bg-purple-100 dark:bg-purple-900/40', textColor: 'text-purple-700 dark:text-purple-300' };
}

export function getAqiBarWidth(euAqi: number | null): number {
  if (euAqi === null) return 0;
  return Math.min(100, Math.max(0, euAqi));
}

// ===== FORMATTING =====
export function formatVisibility(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`;
}

export function formatTime(isoString: string, timezone?: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
  } catch {
    return isoString;
  }
}

export function formatHour(isoString: string, timezone?: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true, timeZone: timezone });
  } catch {
    return isoString;
  }
}

export function formatDay(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() === today.getTime()) return 'Today';
    if (target.getTime() === tomorrow.getTime()) return 'Tomorrow';

    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
