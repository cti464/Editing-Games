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
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative font-sans">
      <div className="text-left mb-2 md:mb-4 border-b border-slate-700 pb-4">
        <h3 className="text-white font-bold text-lg md:text-2xl uppercase tracking-widest flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-slate-400 font-mono tracking-normal">COLOR_GRADING_V1.0</span>
        </h3>
        {submitted ? (
           <div className="mt-4 text-sm md:text-base font-bold text-amber-400 bg-amber-400/10 inline-block px-4 py-2 rounded border border-amber-400/30 uppercase tracking-widest">
             {feedback}
           </div>
        ) : (
           <p className="text-slate-300 text-base mt-2">{description}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch w-full relative">
      
      {/* Editor Screen View */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-1">
           <h3 className="text-slate-300 font-mono text-xs uppercase tracking-wider flex items-center justify-between bg-black px-3 py-2 border border-slate-800 border-b-0 rounded-t-lg">
             <span className="text-slate-500">Node:</span> Reference
           </h3>
           <div 
             className="w-full aspect-video border border-slate-800 overflow-hidden relative flex items-center justify-center bg-black rounded-b-lg"
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
             <div className="absolute top-2 left-2 text-xs font-mono text-slate-300 bg-black/80 px-2 backdrop-blur rounded">V1: REF</div>
           </div>
        </div>

        <div className="flex flex-col gap-1">
           <h3 className="text-slate-300 font-mono text-xs uppercase tracking-wider flex items-center justify-between bg-black px-3 py-2 border border-slate-800 border-b-0 rounded-t-lg">
              <span className="text-amber-500">Node:</span> Grading Output
           </h3>
           <div 
             className="w-full aspect-video border border-slate-800 overflow-hidden relative flex items-center justify-center bg-black transition-colors duration-200 rounded-b-lg shadow-[0_0_30px_rgba(0,0,0,0.5)]"
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
             <div className="absolute top-2 left-2 text-xs font-mono text-amber-500 bg-black/80 px-2 backdrop-blur rounded">V2: OUT</div>
           </div>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="w-full lg:w-80 bg-black border border-slate-800 rounded-xl p-6 flex flex-col gap-6 z-10 shrink-0 relative">
        <div className="text-slate-400 text-xs font-bold font-mono uppercase tracking-widest border-b border-slate-800 pb-3">
          Color Wheels / Curves
        </div>

        {/* RGB Sliders */}
        <div className="flex flex-col gap-6 flex-1 justify-center">
        {(['r', 'g', 'b'] as const).map((channel) => (
          <div key={channel} className="flex flex-col gap-2 p-3 border border-slate-800/80 rounded-xl bg-slate-900/50">
            <div className="flex justify-between text-xs font-mono uppercase items-center">
              <span className={cn("font-bold tracking-wider", channel === 'r' ? 'text-red-400' : channel === 'g' ? 'text-green-400' : 'text-blue-400')}>
                {channel === 'r' ? 'Red' : channel === 'g' ? 'Green' : 'Blue'}
              </span>
              <span className="text-slate-300 text-sm">{current[channel].toString().padStart(3, '0')}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={current[channel]}
              disabled={submitted}
              onChange={(e) => setCurrent(prev => ({ ...prev, [channel]: parseInt(e.target.value) }))}
              className={cn(
                "w-full h-2 rounded-full appearance-none cursor-pointer slider-thumb",
                channel === 'r' ? 'accent-red-500 bg-red-500/20' : 
                channel === 'g' ? 'accent-green-500 bg-green-500/20' : 
                'accent-blue-500 bg-blue-500/20'
              )}
            />
          </div>
        ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col gap-4 text-center">
            <button
              onClick={() => {
                playSound('click');
                checkMatch();
              }}
              disabled={submitted}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-mono text-sm py-4 px-6 transition-colors rounded-lg shadow-md disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest border border-slate-600 focus:outline-none"
            >
              {submitted ? "Rendered..." : "Apply Grade"}
            </button>
            {submitted && finalDiff !== null && (
              <div className="text-xs font-mono text-slate-300 text-center uppercase">
                 DelE: {finalDiff.toFixed(2)} | Max: {targetConfig.tolerance.toFixed(2)}
              </div>
            )}
        </div>
      </div>
      </div>
    </div>
  );
}
