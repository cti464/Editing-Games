import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

interface ColorCorrectionGameProps {
  targetConfig: { r: number; g: number; b: number; tolerance: number };
  onComplete: (stars: number) => void;
  timeRemaining: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export function ColorCorrectionGame({ targetConfig, onComplete, timeRemaining, title, description, imageUrl }: ColorCorrectionGameProps) {
  const [current, setCurrent] = useState({ r: 128, g: 128, b: 128 });
  const [submitted, setSubmitted] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [finalDiff, setFinalDiff] = useState<number | null>(null);

    // Hidden original image simulated with a gradient blob
    const targetColor = `rgb(${targetConfig.r}, ${targetConfig.g}, ${targetConfig.b})`;
    const currentColor = `rgb(${current.r}, ${current.g}, ${current.b})`;

    const checkMatch = () => {
      setSubmitted(true);
      const diffR = Math.abs(current.r - targetConfig.r);
      const diffG = Math.abs(current.g - targetConfig.g);
      const diffB = Math.abs(current.b - targetConfig.b);
      
      // Average difference
      const avgDiff = (diffR + diffG + diffB) / 3;
      setFinalDiff(avgDiff);
      
      let stars = 0;
    if (avgDiff <= targetConfig.tolerance * 0.5) {
      stars = 3;
      setFeedback('PERFECT MATCH!');
    } else if (avgDiff <= targetConfig.tolerance) {
      stars = 2;
      setFeedback('GOOD MATCH!');
    } else if (avgDiff <= targetConfig.tolerance * 2) {
      stars = 1;
      setFeedback('BARELY PASSED');
    } else {
      setFeedback('FAILED. NOT CLOSE ENOUGH.');
    }

    setTimeout(() => {
      onComplete(stars);
    }, 2000);
  };

  // Auto-fail if time runs out and not submitted
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

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center items-center w-full bg-slate-900 rounded-3xl relative overflow-hidden">
      
      {/* Editor Screen View */}
      <div className="flex-1 flex flex-col gap-4 lg:gap-6 w-full">
        <div className="flex flex-col gap-2">
           <h3 className="text-white font-bold text-lg uppercase tracking-wider">Reference Source</h3>
           <div 
             className="w-full aspect-video rounded-xl shadow-inner border-2 border-slate-700/50 overflow-hidden relative flex items-center justify-center bg-slate-950"
           >
             {imageUrl ? (
               <img src={imageUrl} alt="base" className="absolute inset-0 w-full h-full object-cover" 
                 style={{ filter: `sepia(100%) hue-rotate(${targetConfig.r + targetConfig.g + targetConfig.b}deg) saturate(${targetConfig.g}%) brightness(${targetConfig.b}%)` }} 
               />
             ) : (
               <div 
                 className="w-3/4 h-3/4 rounded-full blur-2xl opacity-80" 
                 style={{ backgroundColor: targetColor }} 
               />
             )}
             <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
           </div>
        </div>

        <div className="flex flex-col gap-2">
           <h3 className="text-white font-bold text-lg uppercase tracking-wider flex items-center justify-between">
              Your Edit
           </h3>
           <div 
             className="w-full aspect-video rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-cyan-500/30 overflow-hidden relative flex items-center justify-center bg-slate-950 transition-colors duration-200"
             style={{ boxShadow: submitted ? `0 0 40px ${currentColor}` : undefined }}
           >
             {imageUrl ? (
               <img src={imageUrl} alt="base" className="absolute inset-0 w-full h-full object-cover transition-all duration-200" 
                 style={{ filter: `sepia(100%) hue-rotate(${current.r + current.g + current.b}deg) saturate(${current.g}%) brightness(${current.b}%)` }} 
               />
             ) : (
               <div 
                 className="w-3/4 h-3/4 rounded-full blur-2xl opacity-80 transition-colors duration-200" 
                 style={{ backgroundColor: currentColor }} 
               />
             )}
             <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
           </div>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="w-full lg:w-80 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 z-10 shrink-0">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-800 pb-2">
          Color Wheels / Curves
        </div>

        {/* RGB Sliders */}
        {(['r', 'g', 'b'] as const).map((channel) => (
          <div key={channel} className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-300 uppercase">{channel === 'r' ? 'Red' : channel === 'g' ? 'Green' : 'Blue'}</span>
              <span className="text-slate-500 font-mono">{current[channel]}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={current[channel]}
              disabled={submitted}
              onChange={(e) => setCurrent(prev => ({ ...prev, [channel]: parseInt(e.target.value) }))}
              className={cn(
                "w-full h-2 rounded-lg appearance-none cursor-pointer range-sm slider-thumb",
                channel === 'r' ? 'accent-rose-500 bg-rose-500/20' : 
                channel === 'g' ? 'accent-emerald-500 bg-emerald-500/20' : 
                'accent-blue-500 bg-blue-500/20'
              )}
            />
          </div>
        ))}

        <div className="mt-4 pt-6 border-t border-slate-800 text-center">
            <button
              onClick={() => {
                playSound('click');
                checkMatch();
              }}
              disabled={submitted}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider text-sm"
            >
              {submitted ? "Rendering..." : "Final Output"}
            </button>
            {submitted && finalDiff !== null && (
              <div className="mt-4 text-xs font-mono text-slate-400">
                 Diff score: {finalDiff.toFixed(1)} / {targetConfig.tolerance} max
              </div>
            )}
        </div>
      </div>
      </div>
    </div>
  );
}
