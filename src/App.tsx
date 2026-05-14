import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Settings as SettingsIcon, CloudSun, Navigation,
  Sun, Moon, MapPin, Sparkles
} from 'lucide-react';
import type { LocationData } from '@/lib/types';
import { storageGet } from '@/lib/utils';
import { FlagImg } from '@/components/FlagImg';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import {
  useSettings, useFavorites, useGeolocation,
  useWeather, useAirQuality, useRadar,
} from '@/hooks';
import { SearchBar } from '@/components/SearchBar';
import { CurrentWeatherCard } from '@/components/CurrentWeatherCard';
import { HourlyForecastChart } from '@/components/HourlyForecastChart';
import { DailyForecastList } from '@/components/DailyForecastList';
import { WeatherMap } from '@/components/WeatherMap';
import { AirQualityCard } from '@/components/AirQualityCard';
import { SavedLocationsPanel, FavoriteButton } from '@/components/SavedLocationsPanel';
import { SettingsPanel, ThemeToggle } from '@/components/Settings';
import { ErrorState } from '@/components/ErrorState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const POPULAR_CITIES: LocationData[] = [
  { name: 'New York', country: 'United States', countryCode: 'US', admin1: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Karachi', country: 'Pakistan', countryCode: 'PK', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
  { name: 'Berlin', country: 'Germany', countryCode: 'DE', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
  { name: 'Toronto', country: 'Canada', countryCode: 'CA', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
  { name: 'Mumbai', country: 'India', countryCode: 'IN', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Singapore', country: 'Singapore', countryCode: 'SG', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Cairo', country: 'Egypt', countryCode: 'EG', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
];

export default function App() {
  const { settings, updateSettings } = useSettings();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { loading: geoLoading, requestLocation } = useGeolocation();
  const layout = useResponsiveLayout();

  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [hasAutoLocated, setHasAutoLocated] = useState(false);

  const { data: weatherData, loading: weatherLoading, error: weatherError, refetch } = useWeather(selectedLocation);
  const { data: aqiData, loading: aqiLoading } = useAirQuality(selectedLocation);
  const { data: radarData } = useRadar();

  // Load last location or auto-detect on mount
  useEffect(() => {
    const last = storageGet<LocationData | null>('last_location', null);
    if (last) {
      setSelectedLocation(last);
      setHasAutoLocated(true);
    } else {
      // Auto-detect on first visit
      async function autoDetect() {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000, maximumAge: 300000, enableHighAccuracy: false,
            });
          });
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          // Reverse geocode
          try {
            const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString(), format: 'jsonv2' });
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
              headers: { 'User-Agent': 'SkyPulseWeather/1.0' },
            });
            if (res.ok) {
              const data = await res.json();
              const a = data.address || {};
              setSelectedLocation({
                name: a.city || a.town || a.village || a.municipality || 'Your Location',
                country: a.country || '',
                countryCode: (a.country_code || '').toUpperCase(),
                admin1: a.state || a.region || '',
                latitude: lat, longitude: lon, timezone: 'auto',
              });
            }
          } catch {
            setSelectedLocation({ name: 'Your Location', country: '', countryCode: '', latitude: lat, longitude: lon, timezone: 'auto' });
          }
        } catch {
          // Geolocation denied or unavailable — show empty state
        }
        setHasAutoLocated(true);
      }
      autoDetect();
    }
  }, []);

  const handleSelectLocation = useCallback((location: LocationData) => {
    setSelectedLocation(location);
    setGeoError(null);
  }, []);

  const handleGeolocate = useCallback(async () => {
    setGeoError(null);
    const result = await requestLocation();
    if (result) {
      try {
        const params = new URLSearchParams({ lat: result.lat.toString(), lon: result.lon.toString(), format: 'jsonv2' });
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
          headers: { 'User-Agent': 'SkyPulseWeather/1.0' },
        });
        if (res.ok) {
          const data = await res.json();
          const a = data.address || {};
          setSelectedLocation({
            name: a.city || a.town || a.village || a.municipality || 'Your Location',
            country: a.country || '',
            countryCode: (a.country_code || '').toUpperCase(),
            admin1: a.state || a.region || '',
            latitude: result.lat, longitude: result.lon, timezone: 'auto',
          });
          return;
        }
      } catch { /* fallback below */ }
      setSelectedLocation({ name: 'Your Location', country: '', countryCode: '', latitude: result.lat, longitude: result.lon, timezone: 'auto' });
    }
  }, [requestLocation]);

  const handleToggleFavorite = useCallback((location: LocationData) => {
    if (isFavorite(location.latitude, location.longitude)) {
      removeFavorite(location.latitude, location.longitude);
    } else {
      addFavorite(location);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const isDark = settings.theme === 'dark';

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        {/* ─── HEADER ─── */}
        <header className="sticky top-0 z-30 glass bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-700/40">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Logo */}
              <button onClick={() => setSelectedLocation(null)} className="flex items-center gap-2 shrink-0 group" aria-label="SkyPulse Home">
                <div className="w-9 h-9 min-w-[2.25rem] min-h-[2.25rem] bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                  <CloudSun className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent sm:inline hidden">
                  SkyPulse
                </span>
              </button>

              {/* Search */}
              <div className="flex-1 max-w-xl min-w-0">
                <SearchBar onSelect={handleSelectLocation} onGeolocate={handleGeolocate} geoLoading={geoLoading} />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {selectedLocation && (
                  <FavoriteButton
                    location={selectedLocation}
                    isFavorite={isFavorite(selectedLocation.latitude, selectedLocation.longitude)}
                    onToggle={handleToggleFavorite}
                  />
                )}
                <button
                  onClick={() => setFavoritesOpen(true)}
                  className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                  aria-label="Saved locations"
                >
                  <Star className="w-5 h-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {favorites.length}
                    </span>
                  )}
                </button>
                <ThemeToggle
                  theme={settings.theme}
                  onToggle={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
                />
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                  aria-label="Settings"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {geoError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 text-center">
                {geoError}
              </motion.p>
            )}
          </div>
        </header>

        {/* ─── MAIN ─── */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 max-w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            {!hasAutoLocated ? (
              <motion.div key="init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-32">
                <div className="animate-pulse-glow w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <CloudSun className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            ) : !selectedLocation ? (
              /* ─── EMPTY STATE ─── */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center py-16 sm:py-24 px-4"
              >
                {/* Illustration */}
                <div className="relative mb-10">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-400 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-400/30">
                    <CloudSun className="w-20 h-20 sm:w-24 sm:h-24 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-400 rounded-xl animate-float-gentle shadow-lg flex items-center justify-center">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl animate-float-gentle shadow-lg flex items-center justify-center" style={{ animationDelay: '1s' }}>
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 dark:text-white mb-3 text-center tracking-tight">
                  Welcome to SkyPulse
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mb-8 text-center text-base sm:text-lg leading-relaxed">
                  Your free, privacy-first weather companion. Search for any city or use your current location to get real-time forecasts.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-12">
                  <button
                    onClick={handleGeolocate}
                    disabled={geoLoading}
                    className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-semibold transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Navigation className="w-4.5 h-4.5" />
                    Use My Location
                  </button>
                </div>

                {/* Popular cities */}
                <div className="w-full max-w-2xl">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 text-center">
                    Popular Cities
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR_CITIES.map((city) => {
                      return (
                        <button
                          key={city.name}
                          onClick={() => handleSelectLocation(city)}
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <FlagImg code={city.countryCode} size="sm" countryName={city.country} />
                          <span>{city.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Favorites */}
                {favorites.length > 0 && (
                  <div className="w-full max-w-2xl mt-10">
                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-3 text-center flex items-center justify-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" /> Your Saved Locations
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {favorites.map((loc) => {
                        return (
                          <button
                            key={`${loc.latitude}-${loc.longitude}`}
                            onClick={() => handleSelectLocation(loc)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 hover:border-amber-400 dark:hover:border-amber-600 rounded-xl text-sm font-medium text-amber-700 dark:text-amber-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <FlagImg code={loc.countryCode} size="sm" countryName={loc.country} />
                            <span>{loc.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : weatherLoading ? (
              <LoadingSkeleton key="loading" />
            ) : weatherError ? (
              <ErrorState key="error" message={weatherError} onRetry={refetch} />
            ) : weatherData ? (
              /* ─── WEATHER DASHBOARD ─── */
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-5 sm:space-y-6"
              >
                {/* Hero: Current Weather */}
                <CurrentWeatherCard weather={weatherData} location={selectedLocation} settings={settings} />

                {/* Main Grid */}
                <div className={`grid gap-5 sm:gap-6 max-w-full ${layout.isMobile ? 'grid-cols-1' : layout.isTablet ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1 lg:grid-cols-12'}`}>
                  {/* Left Column: Charts + Daily */}
                  <div className={`${layout.isMobile ? '' : layout.isDesktop ? 'lg:col-span-8' : 'md:col-span-7'} space-y-5 sm:space-y-6 min-w-0`}>
                    <HourlyForecastChart weather={weatherData} settings={settings} />
                    <DailyForecastList weather={weatherData} settings={settings} />
                  </div>

                  {/* Right Column: Map, AQI, Details */}
                  <div className={`${layout.isMobile ? '' : layout.isDesktop ? 'lg:col-span-4' : 'md:col-span-5'} space-y-5 sm:space-y-6 min-w-0`}>
                    <WeatherMap location={selectedLocation} radarData={radarData} />
                    <AirQualityCard data={aqiData} loading={aqiLoading} />
                    <DetailCards weather={weatherData} settings={settings} />
                  </div>
                </div>

                {/* Footer */}
                <footer className="text-center py-8 text-xs text-slate-400 dark:text-slate-600 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                  <p>
                    Weather data by{' '}
                    <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500 transition-colors">Open-Meteo</a>
                    {' · '}Maps by{' '}
                    <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500 transition-colors">OpenStreetMap</a>
                    {radarData && (<>{' · '}Radar by{' '}<a href="https://www.rainviewer.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500 transition-colors">RainViewer</a></>)}
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" /> SkyPulse Weather — Free & Open Source
                  </p>
                </footer>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        <SettingsPanel settings={settings} onUpdate={updateSettings} isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <SavedLocationsPanel
          favorites={favorites} onSelect={handleSelectLocation} onRemove={removeFavorite}
          isFavorite={isFavorite} onToggleFavorite={handleToggleFavorite}
          currentLocation={selectedLocation} settings={settings} isOpen={favoritesOpen} onClose={() => setFavoritesOpen(false)}
        />
      </div>
    </div>
  );
}

/* ─── Detail Cards (UV + Wind combined) ─── */
import { getWindDirectionLabel } from '@/lib/weather-codes';
import { formatWind, formatTempShort, formatVisibility, formatPressure } from '@/lib/utils';
import type { WeatherData, Settings as SettingsType } from '@/lib/types';

function DetailCards({ weather, settings }: { weather: WeatherData; settings: SettingsType }) {
  const { current, daily, timezone } = weather;
  const today = daily[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="weather-card p-5"
    >
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-500" />
        Weather Details
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <DetailTile icon="🌡️" label="Feels Like" value={formatTempShort(current.feelsLike, settings.tempUnit)} />
        <DetailTile icon="💧" label="Humidity" value={`${current.humidity}%`} />
        <DetailTile icon="👁️" label="Visibility" value={formatVisibility(current.visibility)} />
        <DetailTile icon="📊" label="Pressure" value={formatPressure(current.pressure)} />
        <DetailTile icon="💨" label="Wind" value={formatWind(current.windSpeed, settings.windUnit)} sub={getWindDirectionLabel(current.windDirection)} />
        <DetailTile icon="☀️" label="UV Index" value={current.uvIndex.toFixed(1)} sub={getUvLabel(current.uvIndex)} />
        {today?.sunrise && <DetailTile icon="🌅" label="Sunrise" value={formatSunTime(today.sunrise, timezone)} />}
        {today?.sunset && <DetailTile icon="🌇" label="Sunset" value={formatSunTime(today.sunset, timezone)} />}
        <DetailTile icon="☁️" label="Cloud Cover" value={`${current.cloudCover}%`} />
      </div>
    </motion.div>
  );
}

function DetailTile({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 flex flex-col">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

function getUvLabel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

function formatSunTime(isoString: string, tz?: string): string {
  try {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: tz });
  } catch {
    return isoString;
  }
}
