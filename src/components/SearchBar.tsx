import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, X, Navigation, Building2, Crown } from 'lucide-react';
import type { GeoSearchResult, LocationData } from '@/lib/types';
import { filterCities, normalizeSearchQuery, clearGeocodingCache } from '@/lib/geocoding';
import { FlagBadge } from '@/components/FlagImg';

interface SearchBarProps {
  onSelect: (location: LocationData) => void;
  onGeolocate: () => void;
  geoLoading: boolean;
}

/* ── Helpers ── */

function isCapital(fc?: string): boolean {
  return fc === 'PPLC';
}

function formatPopulation(pop?: number): string {
  if (!pop) return '';
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)}K`;
  return pop.toLocaleString();
}

function buildLocationLabel(r: GeoSearchResult): string {
  const parts: string[] = [];
  if (r.admin1) parts.push(r.admin1);
  parts.push(r.country);
  return parts.join(', ');
}

/* ── Component ── */

export function SearchBar({ onSelect, onGeolocate, geoLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* Close on outside click + clear stale cache on mount */
  useEffect(() => {
    clearGeocodingCache(); // clear old unfiltered cache from previous versions

    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = highlightedIdx >= 0 ? highlightedIdx : 0;
        if (results[idx]) handleSelect(results[idx]);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, results, highlightedIdx]);

  /* Scroll highlighted item into view */
  useEffect(() => {
    if (highlightedIdx < 0 || !listRef.current) return;
    const el = listRef.current.children[highlightedIdx] as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIdx]);

  /* ── Fetch ── */
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setIsOpen(false); return; }

    setLoading(true);
    try {
      const normalizedQuery = normalizeSearchQuery(q);
      const cacheKey = `skypulse_geo_${normalizedQuery}`;
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (Date.now() - cached.timestamp < 3600000) {
          setResults(cached.data);
          setIsOpen(cached.data.length > 0);
          setHighlightedIdx(-1);
          setLoading(false);
          return;
        }
      }

      const params = new URLSearchParams({ name: q, count: '20', language: 'en', format: 'json' });
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();

      const raw: GeoSearchResult[] = (data.results || []).map((r: Record<string, unknown>) => ({
        id: r.id as number,
        name: (r.name as string) || '',
        country: (r.country as string) || '',
        countryCode: (r.country_code as string) || '',
        admin1: (r.admin1 as string) || undefined,
        admin2: (r.admin2 as string) || undefined,
        latitude: r.latitude as number,
        longitude: r.longitude as number,
        timezone: (r.timezone as string) || 'UTC',
        population: (r.population as number) || undefined,
        featureCode: (r.feature_code as string) || undefined,
      }));

      /* ── FILTER: only exact city name matches ── */
      const clean = filterCities(raw, q, 5);

      setResults(clean);
      setIsOpen(clean.length > 0);
      setHighlightedIdx(-1);
      localStorage.setItem(cacheKey, JSON.stringify({ data: clean, timestamp: Date.now() }));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = useCallback((result: GeoSearchResult) => {
    onSelect({
      name: result.name,
      country: result.country,
      countryCode: result.countryCode,
      admin1: result.admin1,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    });
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setHighlightedIdx(-1);
    inputRef.current?.blur();
  }, [onSelect]);

  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(value), 350);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  /* ── Render ── */
  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Search any city..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-400 dark:focus:border-blue-500 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
            aria-label="Search for a city"
            autoComplete="off"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
          )}
          {!loading && query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={onGeolocate}
          disabled={geoLoading}
          className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white rounded-xl font-medium transition-all text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 shrink-0"
          aria-label="Use my current location"
        >
          {geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          <span className="hidden sm:inline">Locate</span>
        </button>
      </div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/50">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {results.length} cit{results.length !== 1 ? 'ies' : 'y'} found
              </p>
            </div>

            <div ref={listRef} className="max-h-[340px] overflow-y-auto">
              {results.map((result, idx) => {
                const topMatch = idx === 0;
                const capital = isCapital(result.featureCode);
                const highlighted = idx === highlightedIdx;
                const pop = formatPopulation(result.population);
                const locationLabel = buildLocationLabel(result);

                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setHighlightedIdx(idx)}
                    className={`w-full flex items-start gap-3 px-4 py-3 transition-colors text-left ${
                      highlighted
                        ? 'bg-blue-50 dark:bg-slate-700/60'
                        : idx !== results.length - 1
                          ? 'border-b border-slate-50 dark:border-slate-700/30'
                          : ''
                    } ${topMatch && !highlighted ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}
                  >
                    {/* Flag */}
                    <FlagBadge code={result.countryCode} countryName={result.country} />

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-sm font-semibold ${highlighted ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'} truncate`}>
                          {result.name}
                        </span>
                        {capital && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded text-[10px] font-bold uppercase tracking-wide">
                            <Crown className="w-2.5 h-2.5" />
                            Capital
                          </span>
                        )}
                        {topMatch && !capital && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold uppercase tracking-wide">
                            <Building2 className="w-2.5 h-2.5" />
                            Top Match
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {locationLabel}
                      </p>

                      <div className="flex items-center gap-3 mt-1">
                        {pop && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            Pop. {pop}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-300 dark:text-slate-600 font-mono">
                          {result.latitude.toFixed(2)}°, {result.longitude.toFixed(2)}°
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results */}
      <AnimatePresence>
        {isOpen && results.length === 0 && query.length >= 2 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 text-center"
          >
            <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No cities found for &quot;{query}&quot;
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Try a different spelling or search for a nearby larger city
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
