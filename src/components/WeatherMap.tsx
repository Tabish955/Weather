import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon, Radar, Layers } from 'lucide-react';
import type { LocationData, RadarData } from '@/lib/types';

interface WeatherMapProps {
  location: LocationData;
  radarData: RadarData | null;
}

export function WeatherMap({ location, radarData }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radarLayerRef = useRef<any>(null);
  const [showRadar, setShowRadar] = useState(false);

  // Dynamically import Leaflet and initialize map
  useEffect(() => {
    let mounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;

      // Import Leaflet CSS
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement('link');
        link.setAttribute('data-leaflet', 'true');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!mounted || !mapRef.current) return;

      // Clean up previous map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 10,
        zoomControl: true,
        attributionControl: true,
      });

      // OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Custom marker using divIcon
      const markerIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3" fill="#ffffff"/>
          </svg>
        </div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      L.marker([location.latitude, location.longitude], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>${location.country}`);

      mapInstanceRef.current = map;

      // Force map to recalculate size
      setTimeout(() => map.invalidateSize(), 200);
    }

    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location]);

  // Handle radar toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !radarData) return;

    async function toggleRadar() {
      const L = (await import('leaflet')).default;
      const rd = radarData;

      if (!mapInstanceRef.current || !rd) return;

      if (showRadar) {
        const latestPath = rd.past[rd.past.length - 1];
        if (latestPath) {
          const radarUrl = `${rd.host}/v2/radar/${latestPath}/256/{z}/{x}/{y}/6/1_1.png`;
          radarLayerRef.current = L.tileLayer(radarUrl, {
            opacity: 0.6,
            maxZoom: 18,
          }).addTo(mapInstanceRef.current);
        }
      } else {
        if (radarLayerRef.current) {
          radarLayerRef.current.remove();
          radarLayerRef.current = null;
        }
      }
    }

    toggleRadar();

    return () => {
      if (radarLayerRef.current) {
        radarLayerRef.current.remove();
        radarLayerRef.current = null;
      }
    };
  }, [showRadar, radarData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="weather-card p-4 sm:p-6 max-w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Map
          </h2>
        </div>

        {radarData && radarData.past.length > 0 && (
          <button
            onClick={() => setShowRadar(!showRadar)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showRadar
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            Radar
          </button>
        )}
      </div>

      <div
        ref={mapRef}
        className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
        style={{ background: '#f1f5f9' }}
      />

      {showRadar && (
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
          <Layers className="w-3 h-3" />
          <span>Radar data: © RainViewer</span>
        </div>
      )}
    </motion.div>
  );
}
