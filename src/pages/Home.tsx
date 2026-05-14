import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Star, Zap, Image as ImageIcon, Video, Scissors, Trophy } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { LEVELS, LevelType } from '../data/levels';

export default function Home() {
  const { level, xp, unlockedLevels, stars } = useGameStore();
  const navigate = useNavigate();

  const totalStars = Object.values(stars).reduce((acc, curr) => acc + curr, 0);
  const highestLevel = Math.max(...unlockedLevels, 1);

  const playType = (type: LevelType) => {
    const typeLevels = LEVELS.filter(l => l.type === type);
    let target = typeLevels.find(l => unlockedLevels.includes(l.id) && (stars[l.id] || 0) < 3);
    
    if (!target) {
      target = typeLevels.filter(l => unlockedLevels.includes(l.id)).pop();
    }
    
    if (target) {
      navigate(`/play/${target.id}`);
    } else {
      navigate(`/levels`);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 h-full flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
        
        <div className="relative z-10 flex flex-col items-start gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-2">
            <Zap className="w-4 h-4" />
            <span>Season 1: The Creators</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Master The Art Of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Visual Editing.
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mt-2 mb-4 leading-relaxed max-w-lg">
            Complete 100 unique challenges, test your precision, and rise to the top of the editor ranks.
          </p>
          
          <Link 
            to={`/play/${highestLevel}`}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-cyan-500 rounded-xl hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] focus:ring-offset-slate-900"
          >
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" />
              Continue Level {highestLevel}
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <motion.div 
          onClick={() => navigate('/levels')}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden cursor-pointer group"
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-white">{totalStars}</span>
          </div>
          <p className="text-slate-400 font-medium relative z-10">Total Stars Earned</p>
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full relative z-10">
            <div className="h-full bg-indigo-500 opacity-50" style={{ width: `${Math.min((totalStars / 300) * 100, 100)}%` }} />
          </div>
        </motion.div>

        <motion.div 
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group"
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-white">Lv.{level}</span>
          </div>
          <p className="text-slate-400 font-medium relative z-10">Editor Rank</p>
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full relative z-10">
            <div className="h-full bg-emerald-500 opacity-50" style={{ width: `${(xp % 100)}%` }} />
          </div>
        </motion.div>

        {/* Daily Challenge Promo */}
        <motion.div 
          onClick={() => playType('timeline-cut')}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group cursor-pointer"
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs font-bold rounded">NEW</span>
          </div>
          <h3 className="text-xl font-bold text-white relative z-10 mb-1">Daily Speed Edit</h3>
          <p className="text-slate-400 text-sm relative z-10">Complete 3 cuts in 10s for rare rewards.</p>
        </motion.div>
      </div>

      {/* Modes Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Game Modes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div onClick={() => playType('color-match')} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/60 transition-colors cursor-pointer group">
             <ImageIcon className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
             <h3 className="font-bold text-white mb-1">Color Grading</h3>
             <p className="text-xs text-slate-400">Match contrast & colors</p>
          </div>
          <div onClick={() => playType('timeline-cut')} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/60 transition-colors cursor-pointer group">
             <Scissors className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
             <h3 className="font-bold text-white mb-1">Precise Cuts</h3>
             <p className="text-xs text-slate-400">Time your cuts perfectly</p>
          </div>
          <div onClick={() => playType('opacity-sync')} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/60 transition-colors cursor-pointer group">
             <Video className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
             <h3 className="font-bold text-white mb-1">Keyframes</h3>
             <p className="text-xs text-slate-400">Animate smooth motion</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/60 transition-colors cursor-pointer group flex flex-col justify-center items-center text-center opacity-50 relative overflow-hidden">
             <div className="absolute inset-0 bg-slate-950/80 z-10 flex items-center justify-center">
                <span className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-slate-400 border border-slate-700">LOCKED</span>
             </div>
             <Trophy className="w-8 h-8 text-yellow-400 mb-4" />
             <h3 className="font-bold text-white mb-1">Tournament</h3>
             <p className="text-xs text-slate-400">PvP Editor Battles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
