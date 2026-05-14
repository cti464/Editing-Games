import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Layers } from 'lucide-react';
import { playSound } from '../lib/audio';

interface OpacitySyncGameProps {
  targetConfig: { opacity: number; tolerance: number };
  onComplete: (stars: number) => void;
  timeRemaining: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export function OpacitySyncGame({ targetConfig, onComplete, timeRemaining, title, description, imageUrl }: OpacitySyncGameProps) {
  const [opacity, setOpacity] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finalDiff, setFinalDiff] = useState<number | null>(null);

  const checkMatch = () => {
    setSubmitted(true);
    const diff = Math.abs(opacity - targetConfig.opacity);
    setFinalDiff(diff);
    
    let stars = 0;
    if (diff <= targetConfig.tolerance * 0.5) {
      stars = 3;
      setFeedback('PERFECT BLEND!');
    } else if (diff <= targetConfig.tolerance) {
      stars = 2;
      setFeedback('GOOD BLEND!');
    } else if (diff <= targetConfig.tolerance * 2) {
      stars = 1;
      setFeedback('ACCEPTABLE');
    } else {
      setFeedback('POOR MATCH');
    }

    setTimeout(() => {
      onComplete(stars);
    }, 2000);
  };

  useEffect(() => {
    if (timeRemaining <= 0 && !submitted) {
      checkMatch();
    }
  }, [timeRemaining, submitted]);

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative font-sans">
      <div className="text-left mb-2 md:mb-4 border-b border-slate-700 pb-4">
        <h3 className="text-white font-bold text-lg md:text-2xl uppercase tracking-widest flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-slate-400 font-mono tracking-normal">COMPOSITOR_V1.0</span>
        </h3>
        {submitted ? (
           <div className="mt-4 text-sm md:text-base font-bold text-amber-400 bg-amber-400/10 inline-block px-4 py-2 rounded border border-amber-400/30 uppercase tracking-widest">
             {feedback}
           </div>
        ) : (
           <p className="text-slate-300 text-base mt-2">{description}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-center">
        {/* Target */}
        <div className="flex flex-col gap-1 flex-1">
           <h3 className="text-slate-300 font-mono text-xs uppercase tracking-wider flex items-center justify-between bg-black px-3 py-2 border border-slate-800 border-b-0 rounded-t-lg">
             <span className="text-slate-500">Node:</span> Reference
           </h3>
           <div className="aspect-video bg-black rounded-b-lg relative overflow-hidden bg-[url('https://transparenttextures.com/patterns/black-scales.png')] border border-slate-800">
             {/* Base layer */}
             {imageUrl ? (
               <img src={imageUrl} alt="base" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <span className="text-slate-800 font-black text-8xl blur-sm">BASE</span>
               </div>
             )}
             {/* Target Overlay layer */}
             <div 
               className="absolute inset-0 bg-red-500 mix-blend-screen flex items-center justify-center"
               style={{ opacity: targetConfig.opacity / 100 }}
             >
                <Layers className="w-24 h-24 text-white" />
             </div>
             <div className="absolute top-2 left-2 text-xs font-mono text-slate-300 bg-black/80 px-2 backdrop-blur rounded">V1: REF</div>
           </div>
        </div>

        {/* User Edit */}
        <div className="flex flex-col gap-1 flex-1">
           <h3 className="text-slate-300 font-mono text-xs uppercase tracking-wider flex items-center justify-between bg-black px-3 py-2 border border-slate-800 border-b-0 rounded-t-lg">
              <span className="text-amber-500">Node:</span> Active Comp
           </h3>
           <div className="aspect-video bg-black rounded-b-lg relative overflow-hidden bg-[url('https://transparenttextures.com/patterns/black-scales.png')] border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
             {/* Base layer */}
             {imageUrl ? (
               <img src={imageUrl} alt="base" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <span className="text-slate-800 font-black text-8xl blur-sm">BASE</span>
               </div>
             )}
             {/* Edit Overlay layer */}
             <div 
               className="absolute inset-0 bg-red-500 mix-blend-screen flex items-center justify-center transition-opacity"
               style={{ opacity: opacity / 100 }}
             >
                <Layers className="w-24 h-24 text-white" />
             </div>
             <div className="absolute top-2 left-2 text-xs font-mono text-amber-500 bg-black/80 px-2 backdrop-blur rounded">V2: OUT</div>
           </div>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="flex flex-col mt-6 bg-black p-6 border border-slate-800 rounded-xl w-full max-w-2xl mx-auto">
        <div className="text-slate-400 text-xs font-bold font-mono uppercase tracking-widest border-b border-slate-800 pb-3 mb-6">
          Layer Properties
        </div>
        
        <div className="w-full relative flex flex-col gap-3 p-4 border border-slate-800/80 rounded-xl bg-slate-900/50 mb-8">
           <div className="flex justify-between items-center text-xs font-mono uppercase">
             <span className="font-bold text-slate-300 tracking-wider">Blend Opacity</span>
             <span className="text-amber-400 text-sm">{opacity}%</span>
           </div>
           <input 
             type="range" 
             min="0" 
             max="100" 
             value={opacity}
             disabled={submitted}
             onChange={(e) => {
               setOpacity(parseInt(e.target.value));
             }}
             className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-800 accent-amber-500 slider-thumb"
           />
        </div>

        <div className="flex justify-between items-center pt-2 mt-auto">
           <div className="w-1/3">
             {submitted && finalDiff !== null && (
                <div className="text-xs font-mono text-slate-300 uppercase">
                   Delta: {finalDiff}%<br/>Max Allowed: {targetConfig.tolerance}%
                </div>
             )}
           </div>
           <button
              onClick={() => {
                playSound('click');
                checkMatch();
              }}
              disabled={submitted}
              className="bg-slate-800 hover:bg-slate-700 text-white font-mono text-sm py-3 px-8 transition-colors rounded-lg shadow-md disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest border border-slate-600 hover:border-slate-400 focus:outline-none"
            >
              Apply Composite
           </button>
           <div className="w-1/3 flex justify-end">
             <div className="px-3 py-2 bg-black border border-slate-700 rounded font-mono text-xs text-slate-300 flex gap-2">
               <span>BLEND: SCREEN</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
