import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { cn } from '../lib/utils';

export default function Leaderboard() {
  const { xp, coins } = useGameStore();

  // Simulated offline leaderboard data
  const players = [
    { rank: 1, name: 'EditGod99', score: Math.max(xp + 5000, 15000), avatar: 'bg-purple-500' },
    { rank: 2, name: 'SliceMaster', score: Math.max(xp + 2000, 12000), avatar: 'bg-rose-500' },
    { rank: 3, name: 'ColorNinja', score: Math.max(xp + 500, 10500), avatar: 'bg-emerald-500' },
    { rank: 4, name: 'You (Local)', score: xp, isPlayer: true, avatar: 'bg-cyan-500' },
    { rank: 5, name: 'VfxRookie', score: Math.min(xp - 100, 8000), avatar: 'bg-yellow-500' },
    { rank: 6, name: 'CutAndRun', score: Math.min(xp - 500, 5000), avatar: 'bg-blue-500' },
    { rank: 7, name: 'TimelineJunkie', score: 2000, avatar: 'bg-pink-500' },
  ].sort((a, b) => b.score - a.score).map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto pb-10">
      <h1 className="text-4xl font-black text-white tracking-tight mb-2">Global Leaderboard</h1>
      <p className="text-slate-400 mb-8">Compete against the best editors around the world. Earn XP to climb the ranks.</p>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 backdrop-blur-xl relative overflow-hidden">
        
        {/* Top 3 Podium (Visual flair) */}
        <div className="flex items-end justify-center gap-2 sm:gap-6 mb-12 mt-4 px-2">
           {/* 2nd Place */}
           <div className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-full bg-rose-500 mb-2 border-2 border-slate-800 shadow-[0_0_15px_rgba(244,63,94,0.5)] flex items-center justify-center">
               <span className="font-bold text-white text-xs">{players[1].name.substring(0,2)}</span>
             </div>
             <div className="bg-slate-800/80 border border-slate-700/50 w-20 sm:w-24 h-24 rounded-t-lg flex flex-col items-center justify-start pt-2 relative overflow-hidden">
               <Medal className="w-6 h-6 text-slate-300 drop-shadow-md mb-1" />
               <span className="text-xs text-slate-400 font-bold">2ND</span>
               <span className="font-mono text-sm text-white mt-auto pb-2">{players[1].score}</span>
             </div>
           </div>

           {/* 1st Place */}
           <div className="flex flex-col items-center z-10">
             <Crown className="w-8 h-8 text-yellow-400 mb-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
             <div className="w-16 h-16 rounded-full bg-purple-500 mb-2 border-4 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.4)] flex items-center justify-center">
               <span className="font-black text-white">{players[0].name.substring(0,2)}</span>
             </div>
             <div className="bg-gradient-to-t from-slate-800 to-slate-700 border border-yellow-500/30 w-24 sm:w-28 h-32 rounded-t-lg flex flex-col items-center justify-start pt-2 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />
               <span className="text-sm text-yellow-500 font-black tracking-widest">1ST</span>
               <span className="font-mono text-lg font-bold text-yellow-400 mt-auto pb-4 drop-shadow-md">{players[0].score}</span>
             </div>
           </div>

           {/* 3rd Place */}
           <div className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-full bg-emerald-500 mb-2 border-2 border-slate-800 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center">
               <span className="font-bold text-white text-xs">{players[2].name.substring(0,2)}</span>
             </div>
             <div className="bg-slate-800/80 border border-slate-700/50 w-20 sm:w-24 h-20 rounded-t-lg flex flex-col items-center justify-start pt-2 relative overflow-hidden">
               <Medal className="w-5 h-5 text-amber-600 drop-shadow-md mb-1" />
               <span className="text-xs text-amber-700 font-bold">3RD</span>
               <span className="font-mono text-sm text-white mt-auto pb-2">{players[2].score}</span>
             </div>
           </div>
        </div>

        {/* List View */}
        <div className="flex flex-col gap-2">
           {players.map((plr, i) => (
             <div 
               key={i} 
               className={cn(
                 "flex items-center p-4 rounded-xl border transition-all hover:bg-slate-800",
                 plr.isPlayer 
                   ? "bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                   : "bg-slate-950/50 border-slate-800/80"
               )}
             >
               <div className="w-8 text-center font-bold text-slate-500 mr-4 font-mono">
                 #{plr.rank}
               </div>
               
               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg mr-4", plr.avatar)}>
                 {plr.name.substring(0,2).toUpperCase()}
               </div>
               
               <div className="flex-1">
                 <div className="font-bold text-white flex items-center gap-2">
                    {plr.name} 
                    {plr.isPlayer && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-cyan-500 text-slate-950 rounded">YOU</span>
                    )}
                 </div>
               </div>
               
               <div className="text-right">
                 <div className={cn("font-mono font-bold", plr.isPlayer ? "text-cyan-400" : "text-emerald-400")}>{plr.score} XP</div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
