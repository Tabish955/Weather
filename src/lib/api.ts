import type { LocationData, WeatherData, AirQualityData, RadarData, GeoSearchResult } from './types';

// ===== OPEN-METEO WEATHER API =====
const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
      'precipitation', 'rain', 'snowfall', 'weather_code', 'cloud_cover',
      'pressure_msl', 'surface_pressure', 'wind_speed_10m', 'wind_direction_10m',
      'wind_gusts_10m', 'visibility', 'uv_index', 'is_day'
    ].join(','),
    hourly: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
      'precipitation_probability', 'precipitation', 'weather_code',
      'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
      'cloud_cover', 'visibility', 'uv_index'
    ].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'apparent_temperature_max', 'apparent_temperature_min',
      'sunrise', 'sunset', 'uv_index_max', 'precipitation_sum',
      'precipitation_probability_max', 'wind_speed_10m_max', 'wind_gusts_10m_max'
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
    forecast_hours: '24',
  });

  const res = await fetch(`${WEATHER_BASE}?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const data = await res.json();

  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  return {
    current: {
      temperature: current.temperature_2m ?? 0,
      feelsLike: current.apparent_temperature ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      pressure: current.pressure_msl ?? current.surface_pressure ?? 1013,
      visibility: current.visibility ?? 10000,
      windSpeed: current.wind_speed_10m ?? 0,
      windDirection: current.wind_direction_10m ?? 0,
      windGusts: current.wind_gusts_10m ?? 0,
      weatherCode: current.weather_code ?? 0,
      cloudCover: current.cloud_cover ?? 0,
      uvIndex: current.uv_index ?? 0,
      precipitation: current.precipitation ?? 0,
      rain: current.rain ?? 0,
      snowfall: current.snowfall ?? 0,
      isDay: current.is_day ?? true,
      time: current.time ?? new Date().toISOString(),
    },
    hourly: (hourly?.time || []).slice(0, 24).map((t: string, i: number) => ({
      time: t,
      temperature: hourly.temperature_2m?.[i] ?? 0,
      feelsLike: hourly.apparent_temperature?.[i] ?? 0,
      humidity: hourly.relative_humidity_2m?.[i] ?? 0,
      precipitationProbability: hourly.precipitation_probability?.[i] ?? 0,
      precipitation: hourly.precipitation?.[i] ?? 0,
      weatherCode: hourly.weather_code?.[i] ?? 0,
      windSpeed: hourly.wind_speed_10m?.[i] ?? 0,
      windDirection: hourly.wind_direction_10m?.[i] ?? 0,
      windGusts: hourly.wind_gusts_10m?.[i] ?? 0,
      cloudCover: hourly.cloud_cover?.[i] ?? 0,
      visibility: hourly.visibility?.[i] ?? 10000,
      uvIndex: hourly.uv_index?.[i] ?? 0,
    })),
    daily: (daily?.time || []).map((t: string, i: number) => ({
      date: t,
      weatherCode: daily.weather_code?.[i] ?? 0,
      tempMax: daily.temperature_2m_max?.[i] ?? 0,
      tempMin: daily.temperature_2m_min?.[i] ?? 0,
      apparentTempMax: daily.apparent_temperature_max?.[i] ?? 0,
      apparentTempMin: daily.apparent_temperature_min?.[i] ?? 0,
      sunrise: daily.sunrise?.[i] ?? '',
      sunset: daily.sunset?.[i] ?? '',
      uvIndexMax: daily.uv_index_max?.[i] ?? 0,
      precipitationSum: daily.precipitation_sum?.[i] ?? 0,
      precipitationProbabilityMax: daily.precipitation_probability_max?.[i] ?? 0,
      windSpeedMax: daily.wind_speed_10m_max?.[i] ?? 0,
      windGustsMax: daily.wind_gusts_10m_max?.[i] ?? 0,
    })),
    timezone: data.timezone ?? 'UTC',
    timezoneAbbreviation: data.timezone_abbreviation ?? 'UTC',
    latitude: data.latitude ?? lat,
    longitude: data.longitude ?? lon,
    fetchedAt: Date.now(),
  };
}

// ===== GEOCODING API =====
const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchLocations(query: string): Promise<GeoSearchResult[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'en',
    format: 'json',
  });

  const res = await fetch(`${GEO_BASE}?${params}`);
  if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`);

  const data = await res.json();
  if (!data.results) return [];

  return data.results.map((r: Record<string, unknown>) => ({
    id: r.id as number,
    name: (r.name as string) || '',
    country: (r.country as string) || '',
    countryCode: (r.country_code as string) || '',
    admin1: (r.admin1 as string) || undefined,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
    timezone: (r.timezone as string) || 'UTC',
  }));
}

// ===== NOMINATIM FALLBACK =====
export async function reverseGeocode(lat: number, lon: number): Promise<LocationData | null> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      format: 'jsonv2',
    });

    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: {
        'User-Agent': 'SkyPulseWeather/1.0',
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};

    return {
      name: addr.city || addr.town || addr.village || addr.municipality || data.name || 'Unknown Location',
      country: addr.country || '',
      countryCode: (addr.country_code || '').toUpperCase(),
      admin1: addr.state || addr.region || '',
      latitude: lat,
      longitude: lon,
      timezone: 'UTC',
    };
  } catch {
    return null;
  }
}

// ===== AIR QUALITY API =====
const AQ_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: ['pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone', 'eu_aqi', 'us_aqi'].join(','),
      timezone: 'auto',
    });

    const res = await fetch(`${AQ_BASE}?${params}`);
    if (!res.ok) return null;

    const data = await res.json();
    const c = data.current;

    return {
      pm10: c?.pm10 ?? null,
      pm25: c?.pm2_5 ?? null,
      carbonMonoxide: c?.carbon_monoxide ?? null,
      nitrogenDioxide: c?.nitrogen_dioxide ?? null,
      sulphurDioxide: c?.sulphur_dioxide ?? null,
      ozone: c?.ozone ?? null,
      euAqi: c?.eu_aqi ?? null,
      usAqi: c?.us_aqi ?? null,
    };
  } catch {
    return null;
  }
}

// ===== RAINVIEWER RADAR API =====
export async function fetchRadarData(): Promise<RadarData | null> {
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
    if (!res.ok) return null;

    const data = await res.json();
    const radar = data.radar;

    if (!radar) return null;

    return {
      host: data.host || 'https://tilecache.rainviewer.com',
      past: (radar.past || []).map((f: { time: number }) => f.time.toString()),
      nowcast: (radar.nowcast || []).map((f: { time: number }) => f.time.toString()),
    };
  } catch {
    return null;
  }
}
