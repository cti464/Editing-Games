import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { User, Activity, Star, Zap, Edit2, Play, Check, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVATARS = [
  '',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Kingston&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Chase&backgroundColor=b6e3f4',
];

export default function Profile() {
  const { xp, level, coins, maxEnergy, energy, stars, unlockedLevels, playerName, updatePlayerName, profileImage, updateProfileImage } = useGameStore();
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playerName || 'Anonymous Creator');
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);

  const handleSaveName = () => {
    if (editName.trim()) {
      updatePlayerName(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto pb-10">
      <h1 className="text-4xl font-black text-white tracking-tight mb-8">Editor Profile</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
           <div className="relative z-10 flex items-center gap-6 mb-8 group/header">
             <div className="relative">
               <button 
                 onClick={() => setShowAvatarSelect(true)}
                 className="relative w-24 h-24 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-full p-1 shadow-[0_0_20px_rgba(6,182,212,0.4)] group overflow-hidden transition-transform hover:scale-105 active:scale-95"
               >
                 <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center overflow-hidden relative">
                   {profileImage ? (
                     <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-10 h-10 text-white" />
                   )}
                   <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <ImageIcon className="w-6 h-6 text-white" />
                   </div>
                 </div>
               </button>
               <div className="absolute -bottom-2 lg:-bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg pointer-events-none">
                 <span className="text-xs font-black text-emerald-400">Lv.{level}</span>
               </div>
             </div>

             <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   {isEditing ? (
                     <div className="flex items-center gap-2">
                       <input
                         type="text"
                         value={editName}
                         onChange={(e) => setEditName(e.target.value)}
                         onKeyDown={handleKeyDown}
                         className="bg-slate-800 text-white px-2 py-1 rounded border border-cyan-500/50 outline-none focus:border-cyan-400 w-48 text-lg"
                         autoFocus
                         onBlur={handleSaveName}
                       />
                       <button onMouseDown={handleSaveName} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                         <Check className="w-5 h-5" />
                       </button>
                     </div>
                   ) : (
                     <>
                       {playerName || 'Anonymous Creator'}
                       <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-cyan-400 transition-colors">
                         <Edit2 className="w-4 h-4" />
                       </button>
                     </>
                   )}
                </h2>
                <p className="text-slate-400">Offline Local Storage Account</p>
             </div>
           </div>

           <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl mb-6">
              <div className="flex justify-between items-end mb-2">
                 <div className="font-bold text-slate-300">Level Progression</div>
                 <div className="text-xs text-cyan-400 font-mono">{xp} / {Math.pow(level, 2) * 100} XP</div>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(xp % 100)}%` }} // Simplified representation
                   className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex flex-col items-center">
                 <Star className="w-6 h-6 text-yellow-400 mb-2" />
                 <span className="text-2xl font-black text-white">{totalStars}</span>
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Stars</span>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex flex-col items-center">
                 <Play className="w-6 h-6 text-cyan-400 mb-2" />
                 <span className="text-2xl font-black text-white">{unlockedLevels.length - 1}</span>
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Levels Won</span>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex flex-col items-center">
                 <div className="w-6 h-6 rounded-full bg-yellow-400 mb-2" />
                 <span className="text-2xl font-black text-white">{coins}</span>
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Coins</span>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex flex-col items-center">
                 <Zap className="w-6 h-6 text-rose-400 mb-2" />
                 <span className="text-2xl font-black text-white">{energy} <span className="text-sm text-slate-500">/ {maxEnergy}</span></span>
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Energy</span>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showAvatarSelect && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">Choose an Avatar</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                {AVATARS.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      updateProfileImage(url);
                      setShowAvatarSelect(false);
                    }}
                    className={`aspect-square rounded-2xl p-1 transition-all ${profileImage === url ? 'bg-gradient-to-tr from-cyan-500 to-purple-500 scale-105 shadow-lg' : 'bg-slate-800/50 hover:bg-slate-800 hover:scale-105 border border-slate-700/50'}`}
                  >
                    <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden">
                      {url ? (
                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-slate-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowAvatarSelect(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
