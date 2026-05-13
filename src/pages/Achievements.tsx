import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useGameStore } from '../store/useGameStore';

export default function Achievements() {
  const { stars, unlockedLevels } = useGameStore();
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  const achievementsData = [
    { id: 1, title: 'First Cut', desc: 'Complete your first level.', reqType: 'level', requirement: 1, current: unlockedLevels.length > 1 ? 1 : 0 },
    { id: 2, title: 'Color Master', desc: 'Earn 10 stars in Color Correction.', reqType: 'stars', requirement: 10, current: Math.min(totalStars, 10) },
    { id: 3, title: 'Perfectionist', desc: 'Get 3 stars on any boss level.', reqType: 'custom', requirement: 1, current: stars[10] === 3 ? 1 : 0 },
    { id: 4, title: 'Rising Star', desc: 'Earn a total of 50 stars.', reqType: 'stars', requirement: 50, current: Math.min(totalStars, 50) },
    { id: 5, title: 'Timeline God', desc: 'Reach level 30.', reqType: 'level', requirement: 30, current: Math.min(Math.max(...unlockedLevels), 30) },
    { id: 6, title: 'Completionist', desc: 'Unlock all 50 levels.', reqType: 'level', requirement: 50, current: unlockedLevels.length },
    { id: 7, title: 'Flawless Edit', desc: 'Get 3 stars on 5 levels in a row.', reqType: 'custom', requirement: 5, current: 0 },
    { id: 8, title: 'Shopaholic', desc: 'Buy your first theme in the shop.', reqType: 'custom', requirement: 1, current: 0 },
  ];

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Achievements</h1>
          <p className="text-slate-400">Unlock badges to show off your editing prowess.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievementsData.map((chk) => {
          const isUnlocked = chk.current >= chk.requirement;
          const progressPercent = (chk.current / chk.requirement) * 100;

          return (
            <div 
              key={chk.id} 
              className={cn(
                "p-6 rounded-2xl border relative overflow-hidden transition-all duration-300",
                isUnlocked 
                  ? "bg-slate-900 border-yellow-500/30 hover:border-yellow-500/60 shadow-[0_4px_20px_rgba(250,204,21,0.05)]" 
                  : "bg-slate-900/50 border-slate-800/80 grayscale opacity-80"
              )}
            >
              {isUnlocked && (
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
              )}
              
              <div className="flex gap-4 items-center">
                 <div className={cn(
                   "w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border border-slate-700",
                   isUnlocked ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg" : "bg-slate-800 text-slate-500"
                 )}>
                    {isUnlocked ? <Trophy className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                 </div>
                 <div className="flex-1">
                    <h3 className={cn("text-lg font-bold mb-1", isUnlocked ? "text-white" : "text-slate-300")}>{chk.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-snug">{chk.desc}</p>
                 </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                 <div className="flex-1 h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        isUnlocked ? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" : "bg-cyan-500/50"
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                 </div>
                 <span className="text-xs font-mono font-bold text-slate-500 w-12 text-right">
                    {chk.current} / {chk.requirement}
                 </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
