import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { Volume2, Music, Monitor, HardDrive, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

export default function SettingsPage() {
  const { settings, updateSettings, resetData } = useGameStore();
  const navigate = useNavigate();

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to completely clear your save data? This cannot be undone.')) {
      resetData();
      navigate('/');
    }
  };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto pb-10">
      <h1 className="text-4xl font-black text-white tracking-tight mb-8">Settings</h1>

      <div className="space-y-6">
        
        {/* Audio Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
           <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
             <Volume2 className="w-5 h-5 text-cyan-400" /> Audio & Sound
           </h3>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                 <div className="flex items-center gap-3">
                   <Volume2 className="w-5 h-5 text-slate-400"/>
                   <div>
                     <div className="text-white font-bold">Sound Effects</div>
                     <div className="text-sm text-slate-500">UI clicks, success chimes, cuts.</div>
                   </div>
                 </div>
                 <button 
                   onClick={() => {
                     updateSettings({ sfx: !settings.sfx });
                     playSound('click');
                   }}
                   className={cn(
                     "w-12 h-6 rounded-full transition-colors relative",
                     settings.sfx ? "bg-cyan-500" : "bg-slate-700"
                   )}
                 >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-md",
                      settings.sfx ? "left-7" : "left-1"
                    )} />
                 </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                 <div className="flex items-center gap-3">
                   <Music className="w-5 h-5 text-slate-400"/>
                   <div>
                     <div className="text-white font-bold">Background Music</div>
                     <div className="text-sm text-slate-500">Vaporwave / Synthwave ambient tracks.</div>
                   </div>
                 </div>
                 <button 
                   onClick={() => {
                     updateSettings({ music: !settings.music });
                     playSound('click');
                   }}
                   className={cn(
                     "w-12 h-6 rounded-full transition-colors relative",
                     settings.music ? "bg-cyan-500" : "bg-slate-700"
                   )}
                 >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-md",
                      settings.music ? "left-7" : "left-1"
                    )} />
                 </button>
              </div>
           </div>
        </div>

        {/* Display Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
           <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
             <Monitor className="w-5 h-5 text-purple-400" /> Display
           </h3>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl opacity-70">
                 <div className="flex items-center gap-3">
                   <Monitor className="w-5 h-5 text-slate-400"/>
                   <div>
                     <div className="text-white font-bold">Dark Mode</div>
                     <div className="text-sm text-slate-500">Locked to dark mode for editing visibility.</div>
                   </div>
                 </div>
                 <div className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded">FORCED ON</div>
              </div>
           </div>
        </div>

        {/* Data Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
           <h3 className="text-lg font-bold text-rose-500 mb-6 uppercase tracking-wider flex items-center gap-2">
             <HardDrive className="w-5 h-5" /> Data Management
           </h3>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl border-dashed">
                 <div>
                   <div className="text-white font-bold text-rose-400">Clear Save Data</div>
                   <div className="text-sm text-slate-500">Wipes all progress, coins, levels.</div>
                 </div>
                 <button 
                    onClick={resetProgress}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-400 font-bold rounded-lg transition-colors"
                 >
                    <RefreshCw className="w-4 h-4" /> Reset
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
