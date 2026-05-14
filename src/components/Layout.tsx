import React, { useState, useEffect } from 'react';
import { Activity, LayoutDashboard, PlaySquare, Settings, Trophy, User, BarChart2, HelpCircle, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'motion/react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { level, xp, coins, energy, maxEnergy } = useGameStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Levels', path: '/levels', icon: PlaySquare },
    { name: 'Quiz', path: '/quiz', icon: HelpCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-cyan-500/30">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-md shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Editing Master
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isSidebarOpen || isDesktop) && (
          <motion.nav 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute md:relative flex w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex-col p-4 z-40 h-[calc(100vh-73px)] md:h-screen top-[73px] md:top-0",
              !isSidebarOpen && !isDesktop && "hidden"
            )}
          >
            <div className="hidden md:flex items-center gap-3 px-2 py-4 mb-6">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                  Editing Master
                </h1>
                <p className="text-xs text-slate-400 font-mono">CHALLENGE</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                      isActive 
                        ? "text-white bg-slate-800/80 shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-slate-700/50" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill" 
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-50"
                      />
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    )}
                    <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110 text-cyan-400" : "group-hover:scale-110")} />
                    <span className="font-medium relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Player Stats Widget */}
            <div className="mt-auto pt-6 gap-4 flex flex-col">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-300">Player Lv.{level}</span>
                    <span className="text-xs text-cyan-400 font-mono">{xp} XP</span>
                 </div>
                 {/* XP Bar */}
                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                      style={{ width: `${(xp % 100)}%` }}
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex bg-slate-950 rounded-lg p-2 items-center gap-1.5 border border-slate-800/50">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
                      <span className="font-mono text-yellow-100">{coins}</span>
                    </div>
                    <div className="flex bg-slate-950 rounded-lg p-2 items-center gap-1.5 border border-slate-800/50">
                      <Activity className="w-3 h-3 text-rose-400" />
                      <span className="font-mono text-rose-100">{energy}/{maxEnergy}</span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar pt-0 text-left">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
           <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
           <div className="absolute top-0 left-0 right-0 h-[100vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 opacity-80" />
        </div>
        
        <div className="relative z-10 p-4 md:p-8 h-full max-w-7xl mx-auto pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
