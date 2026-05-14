/**
 * Reusable flag image component.
 *
 * Uses flagcdn.com PNG images — works on every device (Vivo, Infinix,
 * iPhone, Windows, Mac, Linux) because it's just an <img> tag.
 *
 * Falls back to a Globe icon if the code is invalid or the image fails to load.
 */

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { isValidCountryCode, getFlagImageUrl } from '@/lib/flags';

type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<FlagSize, { img: number; container: string; fallback: string }> = {
  xs: { img: 20, container: 'w-5 h-[14px]', fallback: 'w-3.5 h-3.5' },
  sm: { img: 40, container: 'w-6 h-4', fallback: 'w-4 h-4' },
  md: { img: 40, container: 'w-7 h-5', fallback: 'w-4.5 h-4.5' },
  lg: { img: 80, container: 'w-10 h-7', fallback: 'w-6 h-6' },
  xl: { img: 80, container: 'w-14 h-10', fallback: 'w-8 h-8' },
};

interface FlagImgProps {
  code: string;
  size?: FlagSize;
  countryName?: string;
  className?: string;
}

export function FlagImg({ code, size = 'md', countryName, className = '' }: FlagImgProps) {
  const [failed, setFailed] = useState(false);
  const valid = isValidCountryCode(code);
  const cfg = SIZE_MAP[size];

  if (!valid || failed) {
    return (
      <Globe
        className={`${cfg.fallback} text-slate-300 dark:text-slate-500 shrink-0 ${className}`}
        aria-label={countryName || 'Unknown country'}
      />
    );
  }

  return (
    <img
      src={getFlagImageUrl(code, cfg.img)}
      alt={countryName ? `${countryName} flag` : `${code.toUpperCase()} flag`}
      className={`${cfg.container} object-cover rounded-sm shrink-0 ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}

/**
 * Compact flag component for inline use in list items and search results.
 * Renders as a small rounded badge.
 */
export function FlagBadge({ code, countryName, className = '' }: { code: string; countryName?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const valid = isValidCountryCode(code);

  if (!valid || failed) {
    return (
      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0">
        <Globe className="w-3 h-3 text-slate-300 dark:text-slate-500" />
      </div>
    );
  }

  return (
    <div className={`w-6 h-6 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0 ${className}`}>
      <img
        src={getFlagImageUrl(code, 40)}
        alt={countryName ? `${countryName} flag` : `${code.toUpperCase()} flag`}
        className="w-5 h-[13px] object-cover rounded-[1px]"
        loading="lazy"
        onError={() => setFailed(true)}
        draggable={false}
      />
    </div>
  );
}
