import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, X, Sun, Moon, Thermometer, Wind } from 'lucide-react';
import type { Settings } from '@/lib/types';

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ settings, onUpdate, isOpen, onClose }: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Theme */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                  Appearance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdate({ theme: 'light' })}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      settings.theme === 'light'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Sun className={`w-4 h-4 ${settings.theme === 'light' ? 'text-blue-500' : 'text-slate-400'}`} />
                    <span className={`text-sm font-medium ${settings.theme === 'light' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
                      Light
                    </span>
                  </button>
                  <button
                    onClick={() => onUpdate({ theme: 'dark' })}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      settings.theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Moon className={`w-4 h-4 ${settings.theme === 'dark' ? 'text-blue-500' : 'text-slate-400'}`} />
                    <span className={`text-sm font-medium ${settings.theme === 'dark' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
                      Dark
                    </span>
                  </button>
                </div>
              </div>

              {/* Temperature Unit */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Temperature Unit
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdate({ tempUnit: 'celsius' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      settings.tempUnit === 'celsius'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-sm font-medium ${settings.tempUnit === 'celsius' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
                      °C Celsius
                    </span>
                  </button>
                  <button
                    onClick={() => onUpdate({ tempUnit: 'fahrenheit' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      settings.tempUnit === 'fahrenheit'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-sm font-medium ${settings.tempUnit === 'fahrenheit' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
                      °F Fahrenheit
                    </span>
                  </button>
                </div>
              </div>

              {/* Wind Speed Unit */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Wind Speed Unit
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdate({ windUnit: 'kmh' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      settings.windUnit === 'kmh'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-sm font-medium ${settings.windUnit === 'kmh' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
                      km/h
                    </span>
                  </button>
                  <button
                    onClick={() => onUpdate({ windUnit: 'mph' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                      settings.windUnit === 'mph'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-sm font-medium ${settings.windUnit === 'mph' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
                      mph
                    </span>
                  </button>
                </div>
              </div>

              {/* Data Sources */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                  Data Sources
                </label>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Weather: Open-Meteo (Free, No Key Required)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Geocoding: Open-Meteo / Nominatim</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Air Quality: Open-Meteo</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Maps: OpenStreetMap</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Radar: RainViewer</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ThemeToggleProps {
  theme: Settings['theme'];
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
