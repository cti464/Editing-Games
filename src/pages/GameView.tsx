import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LEVELS, LevelData } from '../data/levels';
import { useGameStore } from '../store/useGameStore';
import { Clock, Zap, Star, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

// Import Games
import { ColorCorrectionGame } from '../games/ColorCorrectionGame';
import { TimelineCutGame } from '../games/TimelineCutGame';
import { OpacitySyncGame } from '../games/OpacitySyncGame';

export default function GameView() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const levelNum = parseInt(levelId || '1');
  
  const levelData = LEVELS.find(l => l.id === levelNum);
  const { consumeEnergy, completeLevel, unlockedLevels, addXp, addCoins, isSubscribed } = useGameStore();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed' | 'failed'>('intro');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);

  // Initial Check for Unlocks
  useEffect(() => {
    if (!isSubscribed) {
      navigate('/subscription');
      return;
    }
    if (!levelData || (!unlockedLevels.includes(levelNum) && levelNum !== 1)) {
      navigate('/levels');
    }
  }, [levelData, levelNum, unlockedLevels, navigate, isSubscribed]);

  // Reset state when level changes
  useEffect(() => {
    setGameState('intro');
    if (levelData) setTimeRemaining(levelData.timeLimit);
  }, [levelId, levelData]);

  // Timer Logic
  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      const timer = setInterval(() => setTimeRemaining(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeRemaining <= 0) {
      // Auto fail or triggers component auto-submit
      // Components manage auto submit internally when time runs out.
    }
  }, [gameState, timeRemaining]);

  const startGame = () => {
    // Energy Check
    const energyCost = Math.ceil(levelData!.difficulty * 1.5);
    if (useGameStore.getState().energy < energyCost) {
       // If out of energy, let's just give them a free refill so they aren't blocked!
       useGameStore.setState({ energy: useGameStore.getState().maxEnergy });
    }
    consumeEnergy(energyCost);
    
    playSound('start');
    setGameState('playing');
  };

  const handleComplete = (stars: number) => {
    if (stars > 0) {
      playSound('success');
      setGameState('completed');
      setStarsEarned(stars);
      completeLevel(levelNum, stars);
      addXp(levelData!.rewards.xp * stars);
      addCoins(levelData!.rewards.coins * stars);
    } else {
      playSound('fail');
      setGameState('failed');
    }
  };

  if (!levelData) return null;

  const renderGameComponent = () => {
    switch (levelData.type) {
      case 'color-match':
        return <ColorCorrectionGame targetConfig={levelData.target} onComplete={handleComplete} timeRemaining={timeRemaining} title={levelData.title} description={levelData.description} imageUrl={levelData.imageUrl} />;
      case 'timeline-cut':
        return <TimelineCutGame targetConfig={levelData.target} onComplete={handleComplete} timeRemaining={timeRemaining} title={levelData.title} description={levelData.description} imageUrl={levelData.imageUrl} />;
      case 'opacity-sync':
        return <OpacitySyncGame targetConfig={levelData.target} onComplete={handleComplete} timeRemaining={timeRemaining} title={levelData.title} description={levelData.description} imageUrl={levelData.imageUrl} />;
      default:
        return <div>Game type not implemented yet.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl mb-8 relative z-20">
        <button 
          onClick={() => navigate('/levels')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{levelData.type.replace('-', ' ')}</div>
          <h2 className="text-xl font-black text-white">{levelData.title}</h2>
        </div>

        {/* Timer */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 font-mono text-xl transition-colors",
          timeRemaining <= 5 && gameState === 'playing' ? "bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse" : "bg-slate-950 text-cyan-400"
        )}>
          <Clock className="w-5 h-5" />
          {Math.floor(Math.max(0, timeRemaining) / 60)}:{(Math.max(0, timeRemaining) % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          
          {gameState === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-lg text-center backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 pointer-events-none" />
              <div className="w-20 h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12 shadow-[0_0_30px_rgba(6,182,212,0.3)] border border-cyan-500/30">
                <Zap className="w-10 h-10 text-cyan-400 -rotate-12" />
              </div>
              
              <h1 className="text-3xl font-black text-white mb-2">{levelData.title}</h1>
              <p className="text-slate-400 text-lg mb-8">{levelData.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-500 font-bold uppercase mb-1">Time Limit</span>
                    <span className="text-xl font-mono text-white">{levelData.timeLimit}s</span>
                 </div>
                 <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-500 font-bold uppercase mb-1">Energy Cost</span>
                    <span className="text-xl font-mono text-rose-400 flex items-center gap-1"><Zap className="w-4 h-4 fill-current"/> {Math.ceil(levelData.difficulty * 1.5)}</span>
                 </div>
              </div>

              <button 
                onClick={startGame}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black text-lg tracking-wider uppercase transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95"
              >
                Start Editing
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full"
            >
              {renderGameComponent()}
            </motion.div>
          )}

          {gameState === 'completed' && (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-slate-900 border border-emerald-500/30 p-12 rounded-3xl max-w-lg text-center backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-500 mb-6 drop-shadow-lg">
                LEVEL CLEARED!
              </h2>
              
              <div className="flex justify-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                  <motion.div 
                    key={s}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: s * 0.2, type: 'spring' }}
                    onAnimationComplete={() => {
                      if (s <= starsEarned) {
                        playSound('star');
                      }
                    }}
                  >
                    <Star className={cn(
                      "w-16 h-16 transition-colors drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]",
                      s <= starsEarned ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
                    )} />
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">XP Earned</span>
                    <span className="text-2xl font-mono text-cyan-400">+{levelData.rewards.xp * starsEarned}</span>
                 </div>
                 <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Coins</span>
                    <span className="text-2xl font-mono text-yellow-400">+{levelData.rewards.coins * starsEarned}</span>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/levels')}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                  All Levels
                </button>
                <button 
                  onClick={() => navigate(`/play/${levelNum + 1}`)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Next Level
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'failed' && (
            <motion.div 
              key="failed"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-slate-900 border border-rose-500/30 p-12 rounded-3xl max-w-lg text-center backdrop-blur-xl shadow-[0_0_50px_rgba(244,63,94,0.1)]"
            >
              <h2 className="text-4xl font-black text-rose-500 mb-6 drop-shadow-lg">
                EDIT FAILED
              </h2>
              <p className="text-slate-400 mb-8">You didn't meet the target quality in time. Try again and focus on precision!</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/levels')}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                  Quit
                </button>
                <button 
                  onClick={() => {
                    setGameState('intro');
                    setTimeRemaining(levelData.timeLimit);
                  }}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                >
                  Retry Mode
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
