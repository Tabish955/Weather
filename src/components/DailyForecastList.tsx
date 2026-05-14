import { motion } from 'framer-motion';
import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudSnow,
  CloudLightning, CloudDrizzle, CloudFog, Droplets, Wind
} from 'lucide-react';
import type { WeatherData, Settings } from '@/lib/types';
import { getWeatherInfo } from '@/lib/weather-codes';
import { formatTempShort, formatDay } from '@/lib/utils';

interface Props {
  weather: WeatherData;
  settings: Settings;
}

function DayIcon({ code }: { code: number }) {
  const info = getWeatherInfo(code);
  const cls = 'w-7 h-7';
  const icons: Record<string, React.ReactNode> = {
    sun: <Sun className={`${cls} text-amber-400`} />,
    moon: <Moon className={`${cls} text-blue-300`} />,
    'cloud-sun': <CloudSun className={`${cls} text-slate-500`} />,
    'cloud-moon': <CloudMoon className={`${cls} text-slate-400`} />,
    cloud: <Cloud className={`${cls} text-slate-400`} />,
    'cloud-fog': <CloudFog className={`${cls} text-slate-400`} />,
    'cloud-drizzle': <CloudDrizzle className={`${cls} text-blue-400`} />,
    'cloud-rain': <CloudRain className={`${cls} text-blue-500`} />,
    'cloud-rain-wind': <CloudRain className={`${cls} text-blue-600`} />,
    'cloud-hail': <CloudSnow className={`${cls} text-cyan-400`} />,
    snowflake: <CloudSnow className={`${cls} text-blue-300`} />,
    'cloud-lightning': <CloudLightning className={`${cls} text-amber-500`} />,
    wind: <Wind className={`${cls} text-slate-400`} />,
  };
  return icons[info.iconDay] || <Cloud className={`${cls} text-slate-400`} />;
}

export function DailyForecastList({ weather, settings }: Props) {
  const allTemps = weather.daily.flatMap((d) => [d.tempMin, d.tempMax]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const range = maxTemp - minTemp || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="weather-card p-5 sm:p-6"
    >
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
        7-Day Forecast
      </h2>

      <div className="space-y-1">
        {weather.daily.map((day, i) => {
          const leftPct = ((day.tempMin - minTemp) / range) * 100;
          const widthPct = Math.max(((day.tempMax - day.tempMin) / range) * 100, 5);
          const isToday = i === 0;

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isToday
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/20'
              }`}
            >
              {/* Day */}
              <div className="w-[72px] sm:w-20 shrink-0">
                <p className={`text-sm font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {formatDay(day.date)}
                </p>
              </div>

              {/* Icon */}
              <div className="w-8 flex justify-center shrink-0">
                <DayIcon code={day.weatherCode} />
              </div>

              {/* Precip */}
              <div className="w-12 shrink-0 flex items-center gap-1">
                {day.precipitationProbabilityMax > 0 ? (
                  <>
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-[11px] text-blue-500 font-semibold">
                      {day.precipitationProbabilityMax}%
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-slate-300 dark:text-slate-600">—</span>
                )}
              </div>

              {/* Min */}
              <div className="w-10 text-right shrink-0">
                <span className="text-sm text-slate-400 dark:text-slate-500 tabular-nums">
                  {formatTempShort(day.tempMin, settings.tempUnit)}
                </span>
              </div>

              {/* Bar */}
              <div className="flex-1 mx-1">
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-amber-400 to-orange-400"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </div>
              </div>

              {/* Max */}
              <div className="w-10 shrink-0">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                  {formatTempShort(day.tempMax, settings.tempUnit)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sunrise / Sunset */}
      {weather.daily[0] && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/40 flex items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            {fmtSun(weather.daily[0].sunrise, weather.timezone)}
          </span>
          <span className="flex items-center gap-1">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            {fmtSun(weather.daily[0].sunset, weather.timezone)}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function fmtSun(iso: string, tz?: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: tz });
  } catch { return iso; }
}
