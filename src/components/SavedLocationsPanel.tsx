import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Trash2, X, Plus } from 'lucide-react';
import type { LocationData, Settings } from '@/lib/types';
import { FlagImg } from '@/components/FlagImg';

interface SavedLocationsPanelProps {
  favorites: LocationData[];
  onSelect: (location: LocationData) => void;
  onRemove: (lat: number, lon: number) => void;
  isFavorite: (lat: number, lon: number) => boolean;
  onToggleFavorite: (location: LocationData) => void;
  currentLocation: LocationData | null;
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
}

export function SavedLocationsPanel({
  favorites,
  onSelect,
  onRemove,
  isFavorite,
  onToggleFavorite,
  currentLocation,
  isOpen,
  onClose,
}: SavedLocationsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Saved Locations
                </h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* Save current */}
              {currentLocation && !isFavorite(currentLocation.latitude, currentLocation.longitude) && (
                <button
                  onClick={() => onToggleFavorite(currentLocation)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left group"
                >
                  <Plus className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Save current location
                    </p>
                    <p className="text-xs text-slate-400">{currentLocation.name}</p>
                  </div>
                </button>
              )}

              {favorites.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <Star className="w-14 h-14 text-slate-200 dark:text-slate-700 mb-3" />
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">
                    No saved locations
                  </p>
                  <p className="text-xs text-slate-300 dark:text-slate-600 max-w-[200px]">
                    Search for a city and tap the star icon to save it here
                  </p>
                </div>
              ) : (
                favorites.map((loc) => {
                  return (
                    <motion.div
                      key={`${loc.latitude}-${loc.longitude}`}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      className="group flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800/40"
                      onClick={() => { onSelect(loc); onClose(); }}
                    >
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <FlagImg code={loc.countryCode} size="sm" countryName={loc.country} />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {loc.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                          {[loc.admin1, loc.country].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(loc.latitude, loc.longitude); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* Favorite button for header */
interface FavoriteButtonProps {
  location: LocationData | null;
  isFavorite: boolean;
  onToggle: (location: LocationData) => void;
}

export function FavoriteButton({ location, isFavorite, onToggle }: FavoriteButtonProps) {
  if (!location) return null;
  return (
    <button
      onClick={() => onToggle(location)}
      className={`p-2 rounded-xl transition-all ${
        isFavorite
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 shadow-sm'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={`w-5 h-5 transition-transform ${isFavorite ? 'fill-current scale-110' : 'hover:scale-110'}`} />
    </button>
  );
}
