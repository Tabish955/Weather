import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { WeatherData, Settings } from '@/lib/types';
import { formatTempValue, getTempUnitLabel } from '@/lib/utils';

interface Props {
  weather: WeatherData;
  settings: Settings;
}

export function HourlyForecastChart({ weather, settings }: Props) {
  const chartData = useMemo(() => {
    return weather.hourly.map((h) => ({
      time: (() => {
        try {
          return new Date(h.time).toLocaleTimeString([], { hour: 'numeric', hour12: true, timeZone: weather.timezone });
        } catch { return h.time; }
      })(),
      temp: formatTempValue(h.temperature, settings.tempUnit),
      rain: h.precipitationProbability,
      wind: Math.round(h.windSpeed * 10) / 10,
      cloud: h.cloudCover,
    }));
  }, [weather.hourly, weather.timezone, settings]);

  const unit = getTempUnitLabel(settings.tempUnit);

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 text-xs min-w-[140px]">
        <p className="font-bold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-3 mb-1">
            <span className="text-slate-500 dark:text-slate-400">
              {entry.dataKey === 'temp' ? 'Temp' : entry.dataKey === 'rain' ? 'Rain' : 'Wind'}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {entry.value}{entry.dataKey === 'temp' ? unit : entry.dataKey === 'rain' ? '%' : ' km/h'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="weather-card p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
          24-Hour Forecast
        </h2>
      </div>

      {/* Temperature + Rain */}
      <div className="h-56 sm:h-64 mb-6 min-w-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="temp"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}°`}
            />
            <YAxis
              yAxisId="rain"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="rain"
              type="monotone"
              dataKey="rain"
              stroke="#60a5fa"
              strokeWidth={1}
              fill="url(#rainGrad)"
              dot={false}
            />
            <Area
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#tempGrad)"
              dot={false}
              activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" />
          Temperature ({unit})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-blue-300/30 rounded inline-block" />
          Rain probability
        </span>
      </div>

      {/* Wind mini chart */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/40">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
          🌬️ Wind (km/h)
        </p>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" tick={false} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Bar dataKey="wind" fill="#10b981" fillOpacity={0.35} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
