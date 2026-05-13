import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Star, Play } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { useGameStore } from '../store/useGameStore';
import { cn } from '../lib/utils';

export default function Levels() {
  const { unlockedLevels, stars, isSubscribed } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSubscribed) {
      navigate('/subscription');
    }
  }, [isSubscribed, navigate]);

  if (!isSubscribed) return null;

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Campaign Levels</h1>
          <p className="text-slate-400 mt-2">Complete 100 unique editing challenges to become a Master.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-3 rounded-xl backdrop-blur-sm">
           <div className="text-center px-4 border-r border-slate-800">
             <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Unlocked</div>
             <div className="text-xl font-bold text-cyan-400">{Math.min(unlockedLevels.length, 100)} <span className="text-sm text-slate-600">/ 100</span></div>
           </div>
           <div className="text-center px-4">
             <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Stars</div>
             <div className="text-xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                {Object.values(stars).reduce((a, b) => a + b, 0)}
                <Star className="w-4 h-4 fill-current opacity-80" />
             </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-12 space-y-12">
        {Array.from({length: 10}).map((_, i) => ({
          title: `Campaign ${i + 1}: ${i === 0 ? 'The Basics' : i === 9 ? 'Masterclass' : `Stage ${i + 1}`}`,
          startIndex: i * 10,
          endIndex: (i + 1) * 10
        })).map(campaign => (
          <div key={campaign.title}>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-cyan-500 font-black">#</span>
              {campaign.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {LEVELS.slice(campaign.startIndex, campaign.endIndex).map((level, index) => {
                const isUnlocked = unlockedLevels.includes(level.id);
                const earnedStars = stars[level.id] || 0;
                const isBoss = level.id % 10 === 0;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.5) }} // Cap delay
                    key={level.id}
                  >
                    <Link
                      to={isUnlocked ? `/play/${level.id}` : '#'}
                      className={cn(
                        "block group relative w-full aspect-square rounded-2xl border transition-all duration-300 overflow-hidden",
                        isUnlocked 
                          ? isBoss 
                            ? "bg-rose-950/40 border-rose-500/50 hover:bg-rose-900/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:-translate-y-1"
                            : "bg-slate-900/60 border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:-translate-y-1" 
                          : "bg-slate-950/50 border-slate-800/50 cursor-not-allowed opacity-60"
                      )}
                    >
                      {/* Level Number */}
                      <div className="absolute top-3 left-3">
                        <span className={cn(
                          "font-black text-2xl tracking-tighter", 
                          isUnlocked ? (isBoss ? "text-rose-400" : "text-slate-300") : "text-slate-700"
                        )}>
                          {level.id}
                        </span>
                      </div>

                      {/* Stars Indicator */}
                      <div className="absolute top-3 right-3 flex gap-0.5">
                        {[1, 2, 3].map((starIdx) => (
                          <Star 
                            key={starIdx} 
                            className={cn(
                              "w-3 h-3 transition-colors",
                              isUnlocked && starIdx <= earnedStars 
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.8)]" 
                                : "text-slate-700/50 fill-transparent"
                            )} 
                          />
                        ))}
                      </div>

                      {/* Content Center */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pt-8 text-center">
                         {isUnlocked ? (
                           <>
                              <div className="text-xs font-medium text-slate-400 mb-2 truncate w-full group-hover:text-cyan-300 transition-colors px-1" title={level.title}>
                                 {level.title}
                              </div>
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-125",
                                isBoss ? "bg-rose-500/20 text-rose-400" : "bg-cyan-500/10 text-cyan-400"
                              )}>
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              </div>
                           </>
                         ) : (
                           <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                             <Lock className="w-4 h-4 text-slate-600" />
                           </div>
                         )}
                      </div>

                      {/* Boss Banner */}
                      {isBoss && isUnlocked && (
                        <div className="absolute bottom-0 left-0 right-0 bg-rose-500/20 backdrop-blur-md border-t border-rose-500/30 py-1.5 text-center">
                          <span className="text-[10px] uppercase font-bold text-rose-300 tracking-widest">Boss Stage</span>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
