import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MonitorX } from 'lucide-react';
import AppLayout from './components/Layout';
import { useGameStore } from './store/useGameStore';

// Lazy load pages
import Home from './pages/Home';
import Levels from './pages/Levels';
import GameView from './pages/GameView';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import SettingsPage from './pages/SettingsPage';
import Quiz from './pages/Quiz';
import Subscription from './pages/Subscription';

function App() {
  const restoreEnergy = useGameStore(state => state.restoreEnergy);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check initially
    handleResize();
    
    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Energy restoration loop
    const interval = setInterval(() => {
      restoreEnergy();
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [restoreEnergy]);

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-[9999]">
        <MonitorX className="w-16 h-16 text-cyan-500 mb-6" />
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Desktop Only</h1>
        <p className="text-slate-400 max-w-sm mb-8 text-lg">
          VFX Studio Master is a professional video editing simulator optimized for large screens.
        </p>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl max-w-xs shadow-2xl">
          <p className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 block animate-pulse"></span>
            Resolution Too Low
          </p>
          <p className="text-xs text-slate-500 mt-2 font-mono">
            Please switch to a desktop or laptop computer with a minimum width of 1024px to play.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/play/:levelId" element={<GameView />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
