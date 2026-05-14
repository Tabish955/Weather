import { motion } from 'framer-motion';
import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudSnow,
  CloudLightning, CloudDrizzle, CloudFog, CloudHail, CloudRainWind,
  Droplets, Eye, Gauge, Wind, Sunrise, Sunset
} from 'lucide-react';
import type { WeatherData, LocationData, Settings } from '@/lib/types';
import { getWeatherInfo, isRainy, isSnowy, isThunderstorm, getWindDirectionLabel } from '@/lib/weather-codes';
import { formatTemp, formatWind, formatVisibility, formatPressure } from '@/lib/utils';
import { FlagImg } from '@/components/FlagImg';

interface Props {
  weather: WeatherData;
  location: LocationData;
  settings: Settings;
}

function WeatherIcon({ code, isDay, size = 'lg' }: { code: number; isDay: boolean; size?: 'sm' | 'lg' }) {
  const info = getWeatherInfo(code);
  const name = isDay ? info.iconDay : info.iconNight;
  const cls = size === 'lg' ? 'w-20 h-20 sm:w-28 sm:h-28 drop-shadow-lg' : 'w-8 h-8';

  const icons: Record<string, React.ReactNode> = {
    sun: <Sun className={`${cls} text-amber-300`} />,
    moon: <Moon className={`${cls} text-blue-200`} />,
    'cloud-sun': <CloudSun className={`${cls} text-white/90`} />,
    'cloud-moon': <CloudMoon className={`${cls} text-slate-200`} />,
    cloud: <Cloud className={`${cls} text-white/80`} />,
    'cloud-fog': <CloudFog className={`${cls} text-white/70`} />,
    'cloud-drizzle': <CloudDrizzle className={`${cls} text-blue-200`} />,
    'cloud-rain': <CloudRain className={`${cls} text-blue-200`} />,
    'cloud-rain-wind': <CloudRainWind className={`${cls} text-blue-200`} />,
    'cloud-hail': <CloudHail className={`${cls} text-cyan-200`} />,
    snowflake: <CloudSnow className={`${cls} text-blue-100`} />,
    'cloud-lightning': <CloudLightning className={`${cls} text-amber-300`} />,
    wind: <Wind className={`${cls} text-white/70`} />,
  };

  return icons[name] || <Cloud className={`${cls} text-white/80`} />;
}

export function CurrentWeatherCard({ weather, location, settings }: Props) {
  const { current, daily, timezone } = weather;
  const info = getWeatherInfo(current.weatherCode);
  const gradient = current.isDay ? info.gradient : info.darkGradient;
  const today = daily[0];

  const localTime = (() => {
    try {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
    } catch { return ''; }
  })();

  const localDate = (() => {
    try {
      return new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', timeZone: timezone });
    } catch { return ''; }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} text-white shadow-xl max-w-full`}
    >
      {/* Weather particle effects */}
      <WeatherEffects code={current.weatherCode} />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10 p-5 sm:p-8">
        {/* Top row: location + time */}
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <FlagImg code={location.countryCode} size="lg" countryName={location.country} />
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight truncate">{location.name}</h1>
            </div>
            <p className="text-white/50 text-xs sm:text-sm font-medium">
              {[location.admin1, location.country].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="text-right shrink-0">
            {localTime && <p className="text-2xl sm:text-3xl font-light tabular-nums tracking-tight">{localTime}</p>}
            {localDate && <p className="text-white/50 text-[11px] sm:text-xs mt-0.5">{localDate}</p>}
          </div>
        </div>

        {/* Center: Icon + Temperature */}
        <div className="flex items-center gap-4 sm:gap-8 mb-8">
          <div className="shrink-0 animate-float-gentle">
            <WeatherIcon code={current.weatherCode} isDay={current.isDay} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start">
              <span className="text-6xl sm:text-[110px] font-extralight leading-none tracking-tighter" style={{ fontSize: 'clamp(3.5rem, 15vw, 7rem)' }}>
                {formatTemp(current.temperature, settings.tempUnit).replace('°', '').replace(/C|F/, '')}
              </span>
              <span className="text-3xl sm:text-5xl font-light mt-1 sm:mt-2">
                °{settings.tempUnit === 'fahrenheit' ? 'F' : 'C'}
              </span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-white/90 mt-1">{info.description}</p>
            <p className="text-sm text-white/50 mt-0.5">
              Feels like {formatTemp(current.feelsLike, settings.tempUnit)}
            </p>
          </div>
          {today && (
            <div className="hidden sm:block text-right shrink-0 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs text-white/50 mb-1">Today's Range</p>
              <p className="text-lg font-bold">
                {formatTemp(today.tempMax, settings.tempUnit)}
              </p>
              <p className="text-sm text-white/60">
                {formatTemp(today.tempMin, settings.tempUnit)}
              </p>
            </div>
          )}
        </div>

        {/* Bottom: Detail Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Pill icon={<Droplets className="w-3.5 h-3.5" />} label={`${current.humidity}%`} />
          <Pill icon={<Wind className="w-3.5 h-3.5" />} label={formatWind(current.windSpeed, settings.windUnit)} sub={getWindDirectionLabel(current.windDirection)} />
          <Pill icon={<Eye className="w-3.5 h-3.5" />} label={formatVisibility(current.visibility)} />
          <Pill icon={<Gauge className="w-3.5 h-3.5" />} label={formatPressure(current.pressure)} />
          {today?.sunrise && <Pill icon={<Sunrise className="w-3.5 h-3.5" />} label={fmtSun(today.sunrise, timezone)} />}
          {today?.sunset && <Pill icon={<Sunset className="w-3.5 h-3.5" />} label={fmtSun(today.sunset, timezone)} />}
        </div>
      </div>
    </motion.div>
  );
}

function Pill({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3.5 py-2 border border-white/10">
      <span className="text-white/60">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
      {sub && <span className="text-[10px] text-white/40">{sub}</span>}
    </div>
  );
}

function WeatherEffects({ code }: { code: number }) {
  if (isRainy(code)) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-3 sm:h-4 bg-white/15 animate-rain"
            style={{
              left: `${(i / 30) * 100 + Math.random() * 5}%`,
              top: '-5%',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.6 + Math.random() * 0.4}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (isSnowy(code)) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/25 rounded-full animate-snow"
            style={{
              left: `${(i / 20) * 100 + Math.random() * 5}%`,
              top: '-5%',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (isThunderstorm(code)) {
    return <div className="absolute inset-0 bg-white/0 animate-lightning pointer-events-none" />;
  }
  return null;
}

function fmtSun(iso: string, tz?: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: tz });
  } catch { return iso; }
}
