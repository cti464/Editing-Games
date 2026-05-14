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
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 bg-[#18181b] border border-zinc-800 rounded-lg shadow-2xl relative font-sans">
      <div className="text-left mb-2 md:mb-4 border-b border-zinc-800 pb-4">
        <h3 className="text-zinc-100 font-semibold text-lg md:text-xl uppercase tracking-widest flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs text-zinc-500 font-mono tracking-normal">COMPOSITOR_V1.0</span>
        </h3>
        {submitted ? (
           <div className="mt-4 text-sm font-bold text-amber-400 bg-amber-400/10 inline-block px-3 py-1 rounded border border-amber-400/20 uppercase tracking-widest">
             {feedback}
           </div>
        ) : (
           <p className="text-zinc-400 text-sm mt-2">{description}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        {/* Target */}
        <div className="flex flex-col gap-1 flex-1">
           <h3 className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider flex items-center justify-between bg-black px-2 py-1 border border-zinc-800 border-b-0 rounded-t-lg">
             <span className="text-zinc-500">Node:</span> Reference
           </h3>
           <div className="aspect-video bg-black rounded-b-lg relative overflow-hidden bg-[url('https://transparenttextures.com/patterns/black-scales.png')] border border-zinc-800">
             {/* Base layer */}
             {imageUrl ? (
               <img src={imageUrl} alt="base" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                  <span className="text-zinc-800 font-black text-8xl blur-sm">BASE</span>
               </div>
             )}
             {/* Target Overlay layer */}
             <div 
               className="absolute inset-0 bg-red-500 mix-blend-screen flex items-center justify-center"
               style={{ opacity: targetConfig.opacity / 100 }}
             >
                <Layers className="w-24 h-24 text-white" />
             </div>
             <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-500 bg-black/60 px-1 backdrop-blur rounded-sm">V1: REF</div>
           </div>
        </div>

        {/* User Edit */}
        <div className="flex flex-col gap-1 flex-1">
           <h3 className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider flex items-center justify-between bg-black px-2 py-1 border border-zinc-800 border-b-0 rounded-t-lg">
              <span className="text-amber-500">Node:</span> Active Comp
           </h3>
           <div className="aspect-video bg-black rounded-b-lg relative overflow-hidden bg-[url('https://transparenttextures.com/patterns/black-scales.png')] border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             {/* Base layer */}
             {imageUrl ? (
               <img src={imageUrl} alt="base" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                  <span className="text-zinc-800 font-black text-8xl blur-sm">BASE</span>
               </div>
             )}
             {/* Edit Overlay layer */}
             <div 
               className="absolute inset-0 bg-red-500 mix-blend-screen flex items-center justify-center transition-opacity"
               style={{ opacity: opacity / 100 }}
             >
                <Layers className="w-24 h-24 text-white" />
             </div>
             <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-500 bg-black/60 px-1 backdrop-blur rounded-sm">V2: OUT</div>
           </div>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="flex flex-col mt-4 bg-black p-4 border border-zinc-800 rounded-lg w-full max-w-2xl mx-auto">
        <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">
          Layer Properties
        </div>
        
        <div className="w-full relative flex flex-col gap-2 p-2 border border-zinc-800/50 rounded-lg bg-zinc-900/50 mb-6">
           <div className="flex justify-between items-center text-[10px] font-mono uppercase">
             <span className="font-bold text-zinc-300">Blend Opacity</span>
             <span className="text-amber-400">{opacity}%</span>
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
             className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-zinc-800 accent-amber-500 slider-thumb"
           />
        </div>

        <div className="flex justify-between items-center pt-2 mt-auto border-t border-zinc-800">
           <div className="w-1/3">
             {submitted && finalDiff !== null && (
                <div className="text-[10px] font-mono text-zinc-500 uppercase">
                   Delta: {finalDiff}% | Max Allowed: {targetConfig.tolerance}%
                </div>
             )}
           </div>
           <button
              onClick={() => {
                playSound('click');
                checkMatch();
              }}
              disabled={submitted}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-mono text-xs py-2 px-8 transition-colors rounded disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest border border-zinc-600 focus:outline-none"
            >
              Apply Composite
           </button>
           <div className="w-1/3 flex justify-end">
             <div className="px-3 py-1 bg-black border border-zinc-800 font-mono text-[10px] text-zinc-500 flex gap-2">
               <span>BLEND: SCREEN</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
