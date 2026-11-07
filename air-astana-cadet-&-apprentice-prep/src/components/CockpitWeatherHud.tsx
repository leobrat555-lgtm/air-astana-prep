import React, { useState, useEffect } from 'react';
import { Wind, MapPin, Cloud, Sun, CloudRain, CloudSnow, CloudFog } from 'lucide-react';
import { LanguageMode } from '../types';
import { translations } from '../utils/i18n';

interface CockpitWeatherHudProps {
  language?: LanguageMode;
}

interface WeatherData {
  temperature: number;
  windSpeedKts: number;
  weatherCode: number;
  conditionLabel: string;
}

export const CockpitWeatherHud: React.FC<CockpitWeatherHudProps> = ({ language = 'ru' }) => {
  const [localTime, setLocalTime] = useState('');
  const [zuluTime, setZuluTime] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const t = translations[language];

  // Update clock every second from user's local device clock
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      // Local device time in HH:MM
      const local = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Zulu (UTC) time in HH:MMZ
      const zulu = now.toISOString().substring(11, 16) + 'Z';
      setLocalTime(local);
      setZuluTime(zulu);
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Open-Meteo live weather for Almaty (Air Astana primary hub)
  const fetchWeather = async () => {
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=43.24&longitude=76.89&current=temperature_2m,weather_code,wind_speed_10m&wind_speed_unit=kn'
      );
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      if (data.current) {
        const code = data.current.weather_code;
        let label = 'Ясно';
        if (code >= 1 && code <= 3) label = 'Облачно';
        else if (code >= 45 && code <= 48) label = 'Туман';
        else if (code >= 51 && code <= 67) label = 'Дождь';
        else if (code >= 71 && code <= 77) label = 'Снег';
        else if (code >= 80 && code <= 82) label = 'Ливень';
        else if (code >= 95) label = 'Гроза';

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          windSpeedKts: Math.round(data.current.wind_speed_10m * 10) / 10,
          weatherCode: code,
          conditionLabel: label,
        });
      }
    } catch (err) {
      console.warn('Open-Meteo fallback:', err);
      setWeather({
        temperature: 14,
        windSpeedKts: 8.5,
        weatherCode: 1,
        conditionLabel: 'Ясно / Ветер умеренный',
      });
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code?: number) => {
    if (code === undefined) return <Sun className="w-3.5 h-3.5 text-amber-500" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="w-3.5 h-3.5 text-blue-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-3.5 h-3.5 text-blue-600" />;
    if (code >= 45 && code <= 48) return <CloudFog className="w-3.5 h-3.5 text-slate-500" />;
    if (code >= 1 && code <= 3) return <Cloud className="w-3.5 h-3.5 text-sky-500" />;
    return <Sun className="w-3.5 h-3.5 text-amber-500" />;
  };

  return (
    <div className="liquid-glass-dock px-3.5 py-2 flex items-center justify-between text-xs font-mono-avionics text-slate-800 shadow-sm border border-white/95">
      {/* Device System Time & Zulu UTC */}
      <div className="flex items-center gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold font-cockpit text-slate-950 tracking-tight">
            {localTime || '12:00'}
          </span>
          <span className="text-[11px] font-mono-avionics text-blue-700 font-bold bg-blue-100/90 px-1.5 py-0.5 rounded-md border border-blue-300">
            {zuluTime || '06:00Z'}
          </span>
        </div>
      </div>

      {/* Live Open-Meteo Aviation Weather for Almaty (ALA / UAAA) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 liquid-glass-nested px-2.5 py-1 rounded-full text-[11px] border border-white/90 shadow-xs">
          <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
          <span className="font-bold text-slate-950">ALA / UAAA</span>
          <span className="text-slate-400">•</span>
          {getWeatherIcon(weather?.weatherCode)}
          <span className="font-bold text-slate-950">
            {weather ? `${weather.temperature > 0 ? '+' : ''}${weather.temperature}°C` : '+14°C'}
          </span>
          <span className="text-slate-400">•</span>
          <div className="flex items-center gap-0.5 text-blue-800 font-bold" title={t.windSpeed}>
            <Wind className="w-3 h-3 text-blue-600" />
            <span>{weather ? `${weather.windSpeedKts} ${t.kts}` : `8 ${t.kts}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
