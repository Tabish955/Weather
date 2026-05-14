import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import type { AirQualityData } from '@/lib/types';
import { getAqiLevel, getAqiBarWidth } from '@/lib/utils';

interface Props {
  data: AirQualityData | null;
  loading: boolean;
}

export function AirQualityCard({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="weather-card p-5 animate-pulse">
        <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4" />
        <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    );
  }

  if (!data || (data.euAqi === null && data.usAqi === null)) return null;

  const aqi = data.euAqi ?? data.usAqi ?? 0;
  const level = getAqiLevel(aqi);

  const barColor = aqi <= 20 ? 'bg-emerald-500' :
    aqi <= 40 ? 'bg-lime-500' :
    aqi <= 60 ? 'bg-yellow-500' :
    aqi <= 80 ? 'bg-orange-500' :
    aqi <= 100 ? 'bg-red-500' : 'bg-purple-500';

  const pollutants = [
    { label: 'PM2.5', value: data.pm25 },
    { label: 'PM10', value: data.pm10 },
    { label: 'O₃', value: data.ozone },
    { label: 'NO₂', value: data.nitrogenDioxide },
    { label: 'SO₂', value: data.sulphurDioxide },
    { label: 'CO', value: data.carbonMonoxide },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="weather-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-4 h-4 text-emerald-500" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Air Quality</h2>
      </div>

      {/* AQI Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-14 h-14 rounded-2xl ${level.bgColor} flex items-center justify-center`}>
          <span className={`text-xl font-extrabold ${level.textColor}`}>{Math.round(aqi)}</span>
        </div>
        <div>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${level.bgColor} ${level.textColor}`}>
            {level.label}
          </span>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {getHealthMessage(aqi)}
          </p>
        </div>
      </div>

      {/* Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mb-4">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${getAqiBarWidth(aqi)}%` }}
        />
      </div>

      {/* Pollutants */}
      <div className="grid grid-cols-3 gap-1.5">
        {pollutants.map((p) => (
          <div key={p.label} className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">{p.label}</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {p.value !== null ? p.value.toFixed(1) : '—'}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function getHealthMessage(aqi: number): string {
  if (aqi <= 20) return 'Air quality is excellent';
  if (aqi <= 40) return 'Good — no risk from pollution';
  if (aqi <= 60) return 'Moderate — sensitive groups may be affected';
  if (aqi <= 80) return 'Poor — reduce outdoor exertion';
  if (aqi <= 100) return 'Very poor — limit outdoor activity';
  return 'Hazardous — avoid outdoor activity';
}
