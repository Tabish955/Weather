export interface WeatherInfo {
  description: string;
  iconDay: string;
  iconNight: string;
  gradient: string;
  darkGradient: string;
}

export const weatherCodeMap: Record<number, WeatherInfo> = {
  0: {
    description: 'Clear sky',
    iconDay: 'sun',
    iconNight: 'moon',
    gradient: 'from-amber-300 via-sky-400 to-blue-500',
    darkGradient: 'from-indigo-900 via-slate-900 to-blue-950',
  },
  1: {
    description: 'Mainly clear',
    iconDay: 'sun',
    iconNight: 'moon',
    gradient: 'from-amber-200 via-sky-300 to-blue-400',
    darkGradient: 'from-indigo-900 via-slate-800 to-blue-950',
  },
  2: {
    description: 'Partly cloudy',
    iconDay: 'cloud-sun',
    iconNight: 'cloud-moon',
    gradient: 'from-sky-300 via-blue-300 to-slate-400',
    darkGradient: 'from-slate-800 via-indigo-900 to-slate-950',
  },
  3: {
    description: 'Overcast',
    iconDay: 'cloud',
    iconNight: 'cloud',
    gradient: 'from-gray-300 via-slate-400 to-gray-500',
    darkGradient: 'from-slate-700 via-gray-800 to-slate-900',
  },
  45: {
    description: 'Fog',
    iconDay: 'cloud-fog',
    iconNight: 'cloud-fog',
    gradient: 'from-gray-300 via-slate-300 to-gray-400',
    darkGradient: 'from-slate-700 via-gray-700 to-slate-800',
  },
  48: {
    description: 'Depositing rime fog',
    iconDay: 'cloud-fog',
    iconNight: 'cloud-fog',
    gradient: 'from-gray-300 via-slate-300 to-gray-400',
    darkGradient: 'from-slate-700 via-gray-700 to-slate-800',
  },
  51: {
    description: 'Light drizzle',
    iconDay: 'cloud-drizzle',
    iconNight: 'cloud-drizzle',
    gradient: 'from-slate-400 via-blue-400 to-slate-500',
    darkGradient: 'from-slate-700 via-blue-900 to-slate-800',
  },
  53: {
    description: 'Moderate drizzle',
    iconDay: 'cloud-drizzle',
    iconNight: 'cloud-drizzle',
    gradient: 'from-slate-400 via-blue-500 to-slate-600',
    darkGradient: 'from-slate-700 via-blue-900 to-slate-900',
  },
  55: {
    description: 'Dense drizzle',
    iconDay: 'cloud-drizzle',
    iconNight: 'cloud-drizzle',
    gradient: 'from-slate-500 via-blue-500 to-slate-600',
    darkGradient: 'from-slate-800 via-blue-900 to-slate-900',
  },
  56: {
    description: 'Light freezing drizzle',
    iconDay: 'cloud-hail',
    iconNight: 'cloud-hail',
    gradient: 'from-slate-400 via-blue-300 to-cyan-400',
    darkGradient: 'from-slate-700 via-blue-800 to-slate-900',
  },
  57: {
    description: 'Dense freezing drizzle',
    iconDay: 'cloud-hail',
    iconNight: 'cloud-hail',
    gradient: 'from-slate-500 via-blue-400 to-cyan-500',
    darkGradient: 'from-slate-800 via-blue-900 to-slate-950',
  },
  61: {
    description: 'Slight rain',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    gradient: 'from-slate-500 via-blue-500 to-indigo-500',
    darkGradient: 'from-slate-800 via-blue-900 to-indigo-950',
  },
  63: {
    description: 'Moderate rain',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    gradient: 'from-slate-600 via-blue-600 to-indigo-600',
    darkGradient: 'from-slate-800 via-blue-950 to-indigo-950',
  },
  65: {
    description: 'Heavy rain',
    iconDay: 'cloud-rain-wind',
    iconNight: 'cloud-rain-wind',
    gradient: 'from-slate-700 via-blue-700 to-indigo-700',
    darkGradient: 'from-slate-900 via-blue-950 to-indigo-950',
  },
  66: {
    description: 'Light freezing rain',
    iconDay: 'cloud-hail',
    iconNight: 'cloud-hail',
    gradient: 'from-slate-500 via-cyan-400 to-blue-500',
    darkGradient: 'from-slate-800 via-cyan-900 to-blue-950',
  },
  67: {
    description: 'Heavy freezing rain',
    iconDay: 'cloud-hail',
    iconNight: 'cloud-hail',
    gradient: 'from-slate-600 via-cyan-500 to-blue-600',
    darkGradient: 'from-slate-900 via-cyan-900 to-blue-950',
  },
  71: {
    description: 'Slight snowfall',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    gradient: 'from-blue-100 via-slate-200 to-blue-200',
    darkGradient: 'from-slate-700 via-blue-800 to-slate-800',
  },
  73: {
    description: 'Moderate snowfall',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    gradient: 'from-blue-200 via-slate-300 to-blue-300',
    darkGradient: 'from-slate-700 via-blue-900 to-slate-800',
  },
  75: {
    description: 'Heavy snowfall',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    gradient: 'from-blue-300 via-slate-300 to-blue-400',
    darkGradient: 'from-slate-800 via-blue-900 to-slate-900',
  },
  77: {
    description: 'Snow grains',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    gradient: 'from-blue-100 via-slate-200 to-white',
    darkGradient: 'from-slate-700 via-blue-800 to-slate-800',
  },
  80: {
    description: 'Slight rain showers',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    gradient: 'from-slate-400 via-blue-400 to-indigo-400',
    darkGradient: 'from-slate-700 via-blue-900 to-indigo-900',
  },
  81: {
    description: 'Moderate rain showers',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    gradient: 'from-slate-500 via-blue-500 to-indigo-500',
    darkGradient: 'from-slate-800 via-blue-900 to-indigo-950',
  },
  82: {
    description: 'Violent rain showers',
    iconDay: 'cloud-rain-wind',
    iconNight: 'cloud-rain-wind',
    gradient: 'from-slate-600 via-blue-600 to-indigo-600',
    darkGradient: 'from-slate-900 via-blue-950 to-indigo-950',
  },
  85: {
    description: 'Slight snow showers',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    gradient: 'from-blue-100 via-slate-200 to-blue-200',
    darkGradient: 'from-slate-700 via-blue-800 to-slate-800',
  },
  86: {
    description: 'Heavy snow showers',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    gradient: 'from-blue-200 via-slate-300 to-blue-300',
    darkGradient: 'from-slate-800 via-blue-900 to-slate-900',
  },
  95: {
    description: 'Thunderstorm',
    iconDay: 'cloud-lightning',
    iconNight: 'cloud-lightning',
    gradient: 'from-purple-800 via-slate-700 to-indigo-900',
    darkGradient: 'from-purple-950 via-slate-950 to-indigo-950',
  },
  96: {
    description: 'Thunderstorm with slight hail',
    iconDay: 'cloud-lightning',
    iconNight: 'cloud-lightning',
    gradient: 'from-purple-800 via-slate-800 to-indigo-900',
    darkGradient: 'from-purple-950 via-slate-950 to-indigo-950',
  },
  99: {
    description: 'Thunderstorm with heavy hail',
    iconDay: 'cloud-lightning',
    iconNight: 'cloud-lightning',
    gradient: 'from-purple-900 via-slate-900 to-indigo-950',
    darkGradient: 'from-purple-950 via-slate-950 to-indigo-950',
  },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return weatherCodeMap[code] || {
    description: 'Unknown',
    iconDay: 'cloud',
    iconNight: 'cloud',
    gradient: 'from-gray-400 via-slate-400 to-gray-500',
    darkGradient: 'from-slate-700 via-gray-800 to-slate-900',
  };
}

export function isRainy(code: number): boolean {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
}

export function isSnowy(code: number): boolean {
  return [71, 73, 75, 77, 85, 86].includes(code);
}

export function isThunderstorm(code: number): boolean {
  return [95, 96, 99].includes(code);
}

export function isFoggy(code: number): boolean {
  return [45, 48].includes(code);
}

export function isCloudy(code: number): boolean {
  return [3, 45, 48].includes(code);
}

export function getWindDirectionLabel(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return dirs[index];
}
