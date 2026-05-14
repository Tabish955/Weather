import { useState, useEffect, useCallback, useRef } from 'react';
import type { Settings, LocationData, WeatherData, AirQualityData, RadarData, GeoSearchResult } from '@/lib/types';
import { storageGet, storageSet } from '@/lib/utils';
import { fetchWeather, searchLocations, reverseGeocode, fetchAirQuality, fetchRadarData } from '@/lib/api';

// ===== SETTINGS HOOK =====
const SETTINGS_KEY = 'settings';

const defaultSettings: Settings = {
  theme: 'light',
  tempUnit: 'celsius',
  windUnit: 'kmh',
};

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(() =>
    storageGet<Settings>(SETTINGS_KEY, defaultSettings)
  );

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...updates };
      storageSet(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  return { settings, updateSettings };
}

// ===== FAVORITES HOOK =====
const FAVORITES_KEY = 'favorites';

export function useFavorites() {
  const [favorites, setFavoritesState] = useState<LocationData[]>(() =>
    storageGet<LocationData[]>(FAVORITES_KEY, [])
  );

  const addFavorite = useCallback((loc: LocationData) => {
    setFavoritesState((prev) => {
      if (prev.some((f) => f.latitude === loc.latitude && f.longitude === loc.longitude)) return prev;
      const next = [...prev, loc];
      storageSet(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((lat: number, lon: number) => {
    setFavoritesState((prev) => {
      const next = prev.filter((f) => !(f.latitude === lat && f.longitude === lon));
      storageSet(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((lat: number, lon: number) => {
    return favorites.some((f) => f.latitude === lat && f.longitude === lon);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

// ===== GEOLOCATION HOOK =====
export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback((): Promise<{ lat: number; lon: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLoading(false);
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => {
          setLoading(false);
          const msg = err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Please search manually.'
            : 'Could not get your location. Please try again.';
          setError(msg);
          resolve(null);
        },
        { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }
      );
    });
  }, []);

  return { loading, error, requestLocation };
}

// ===== WEATHER HOOK =====
export function useWeather(location: LocationData | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = `weather_${location.latitude.toFixed(2)}_${location.longitude.toFixed(2)}`;
      const cached = storageGet<{ data: WeatherData; timestamp: number } | null>(cacheKey, null);
      if (cached && Date.now() - cached.timestamp < 600000) { // 10 min cache
        setData(cached.data);
        setLoading(false);
        return;
      }

      const weatherData = await fetchWeather(location.latitude, location.longitude);
      setData(weatherData);
      storageSet(cacheKey, { data: weatherData, timestamp: Date.now() });
      storageSet('last_location', location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ===== AIR QUALITY HOOK =====
export function useAirQuality(location: LocationData | null) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;
    setLoading(true);

    fetchAirQuality(location.latitude, location.longitude)
      .then((aqi) => setData(aqi))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [location]);

  return { data, loading };
}

// ===== RADAR HOOK =====
export function useRadar() {
  const [data, setData] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchRadarData()
      .then((radar) => setData(radar))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

// ===== SEARCH HOOK =====
export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        // Check cache
        const cacheKey = `geo_${q.toLowerCase()}`;
        const cached = storageGet<{ data: GeoSearchResult[]; timestamp: number } | null>(cacheKey, null);
        if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
          setResults(cached.data);
          setIsOpen(cached.data.length > 0);
          setLoading(false);
          return;
        }

        const searchResults = await searchLocations(q);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
        storageSet(cacheKey, { data: searchResults, timestamp: Date.now() });
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }, []);

  return { query, results, loading, isOpen, search, close, clear };
}

// ===== LAST LOCATION HOOK =====
export function useLastLocation() {
  return storageGet<LocationData | null>('last_location', null);
}

// ===== REVERSE GEOCODE HOOK =====
export function useReverseGeocode() {
  const lookup = useCallback(async (lat: number, lon: number): Promise<LocationData | null> => {
    return reverseGeocode(lat, lon);
  }, []);

  return { lookup };
}
