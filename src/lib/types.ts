export interface LocationData {
  id?: number;
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  cloudCover: number;
  uvIndex: number;
  precipitation: number;
  rain: number;
  snowfall: number;
  isDay: boolean;
  time: string;
}

export interface HourlyData {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
}

export interface DailyData {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: DailyData[];
  timezone: string;
  timezoneAbbreviation: string;
  latitude: number;
  longitude: number;
  fetchedAt: number;
}

export interface AirQualityData {
  pm10: number | null;
  pm25: number | null;
  carbonMonoxide: number | null;
  nitrogenDioxide: number | null;
  sulphurDioxide: number | null;
  ozone: number | null;
  euAqi: number | null;
  usAqi: number | null;
}

export interface RadarData {
  host: string;
  past: string[];
  nowcast: string[];
}

export interface Settings {
  theme: 'light' | 'dark';
  tempUnit: 'celsius' | 'fahrenheit';
  windUnit: 'kmh' | 'mph';
}

export interface GeoSearchResult {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  admin2?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
  featureCode?: string;
}

export type AqiLevel = {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
};
