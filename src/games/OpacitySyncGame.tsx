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
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative">
      <div className="text-center mb-2 md:mb-4">
        <h3 className="text-white font-bold text-lg md:text-2xl uppercase tracking-wider mb-2">{title}</h3>
        {submitted ? (
           <div className="mt-2 text-base md:text-xl font-black text-white bg-slate-800 inline-block px-4 py-2 rounded-lg border border-slate-700">
             {feedback}
           </div>
        ) : (
           <p className="text-slate-400 text-sm md:text-base">{description}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center">
        {/* Target */}
        <div className="flex flex-col gap-2 flex-1">
           <h4 className="text-slate-400 text-sm font-bold uppercase text-center">Reference</h4>
           <div className="aspect-video bg-slate-800 rounded-2xl relative overflow-hidden bg-[url('https://transparenttextures.com/patterns/black-scales.png')] border-4 border-slate-700">
             {/* Base layer */}
             {imageUrl ? (
               <img src={imageUrl} alt="base" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 bg-blue-900/50 flex items-center justify-center">
                  <span className="text-blue-200/50 font-black text-8xl blur-sm">BASE</span>
               </div>
             )}
             {/* Target Overlay layer */}
             <div 
               className="absolute inset-0 bg-rose-500 mix-blend-screen flex items-center justify-center"
               style={{ opacity: targetConfig.opacity / 100 }}
             >
                <Layers className="w-32 h-32 text-white" />
             </div>
           </div>
        </div>

        {/* User Edit */}
        <div className="flex flex-col gap-2 flex-1">
           <h4 className="text-cyan-400 text-sm font-bold uppercase text-center">Your Composition</h4>
           <div className="aspect-video bg-slate-800 rounded-2xl relative overflow-hidden bg-[url('https://transparenttextures.com/patterns/black-scales.png')] border-4 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
             {/* Base layer */}
             {imageUrl ? (
               <img src={imageUrl} alt="base" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 bg-blue-900/50 flex items-center justify-center">
                  <span className="text-blue-200/50 font-black text-8xl blur-sm">BASE</span>
               </div>
             )}
             {/* Edit Overlay layer */}
             <div 
               className="absolute inset-0 bg-rose-500 mix-blend-screen flex items-center justify-center transition-opacity"
               style={{ opacity: opacity / 100 }}
             >
                <Layers className="w-32 h-32 text-white" />
             </div>
           </div>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="flex flex-col items-center mt-6 gap-6 w-full max-w-md mx-auto">
        <div className="w-full relative">
           <div className="flex justify-between mb-2">
             <span className="text-slate-400 font-bold uppercase text-sm">Effect Opacity</span>
             <span className="text-cyan-400 font-mono text-sm">{opacity}%</span>
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
             className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-cyan-500 border border-slate-700"
           />
        </div>

         <button
            onClick={() => {
              playSound('click');
              checkMatch();
            }}
            disabled={submitted}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xl py-4 px-12 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest border border-cyan-400"
          >
            Apply Blend
         </button>
         {submitted && finalDiff !== null && (
            <div className="text-xs font-mono text-slate-400 text-center">
               Diff score: {finalDiff} / {targetConfig.tolerance} max
            </div>
         )}
      </div>
    </div>
  );
}
