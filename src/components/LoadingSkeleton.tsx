import { motion } from 'framer-motion';

function Pulse({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`} />;
}

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 sm:space-y-6"
    >
      {/* Hero skeleton */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 p-6 sm:p-8 h-72 sm:h-80">
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            <Pulse className="h-7 w-48" />
            <Pulse className="h-4 w-32" />
          </div>
          <Pulse className="h-8 w-20" />
        </div>
        <div className="flex items-center gap-6">
          <Pulse className="w-20 h-20 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Pulse className="h-16 w-40" />
            <Pulse className="h-5 w-28" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          {/* Chart skeleton */}
          <div className="weather-card p-6">
            <Pulse className="h-5 w-36 mb-4" />
            <Pulse className="h-56 w-full rounded-2xl" />
          </div>
          {/* Daily skeleton */}
          <div className="weather-card p-6">
            <Pulse className="h-5 w-28 mb-4" />
            <div className="space-y-2">
              {[...Array(7)].map((_, i) => (
                <Pulse key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-5 sm:space-y-6">
          <div className="weather-card p-5">
            <Pulse className="h-5 w-20 mb-3" />
            <Pulse className="h-48 w-full rounded-xl" />
          </div>
          <div className="weather-card p-5">
            <Pulse className="h-5 w-24 mb-3" />
            <Pulse className="h-20 w-full rounded-xl mb-3" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <Pulse key={i} className="h-12" />
              ))}
            </div>
          </div>
          <div className="weather-card p-5">
            <Pulse className="h-5 w-28 mb-3" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <Pulse key={i} className="h-16" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
