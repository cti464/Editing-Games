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
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 bg-[#18181b] border border-zinc-800 rounded-lg shadow-2xl relative font-sans">
      <div className="text-left mb-2 md:mb-4 border-b border-zinc-800 pb-4">
        <h3 className="text-zinc-100 font-semibold text-lg md:text-xl uppercase tracking-widest flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs text-zinc-500 font-mono tracking-normal">COLOR_GRADING_V1.0</span>
        </h3>
        {submitted ? (
           <div className="mt-4 text-sm font-bold text-amber-400 bg-amber-400/10 inline-block px-3 py-1 rounded border border-amber-400/20 uppercase tracking-widest">
             {feedback}
           </div>
        ) : (
           <p className="text-zinc-400 text-sm mt-2">{description}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-center items-stretch w-full relative">
      
      {/* Editor Screen View */}
      <div className="flex-1 flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
           <h3 className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider flex items-center justify-between bg-black px-2 py-1 border border-zinc-800 border-b-0 rounded-t-lg">
             <span className="text-zinc-500">Node:</span> Reference
           </h3>
           <div 
             className="w-full aspect-video border border-zinc-800 overflow-hidden relative flex items-center justify-center bg-black rounded-b-lg"
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
             <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-500 bg-black/60 px-1 backdrop-blur rounded-sm">V1: REF</div>
           </div>
        </div>

        <div className="flex flex-col gap-1">
           <h3 className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider flex items-center justify-between bg-black px-2 py-1 border border-zinc-800 border-b-0 rounded-t-lg">
              <span className="text-amber-500">Node:</span> Grading Output
           </h3>
           <div 
             className="w-full aspect-video border border-zinc-800 overflow-hidden relative flex items-center justify-center bg-black transition-colors duration-200 rounded-b-lg"
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
             <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-500 bg-black/60 px-1 backdrop-blur rounded-sm">V2: OUT</div>
           </div>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="w-full lg:w-72 bg-black border border-zinc-800 rounded-lg p-4 flex flex-col gap-4 z-10 shrink-0 relative">
        <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest border-b border-zinc-800 pb-2">
          Color Wheels / Curves
        </div>

        {/* RGB Sliders */}
        {(['r', 'g', 'b'] as const).map((channel) => (
          <div key={channel} className="flex flex-col gap-1.5 p-2 border border-zinc-800/50 rounded-lg bg-zinc-900/50">
            <div className="flex justify-between text-[10px] font-mono uppercase">
              <span className={cn("font-bold tracking-wider", channel === 'r' ? 'text-red-400' : channel === 'g' ? 'text-green-400' : 'text-blue-400')}>
                {channel === 'r' ? 'Red' : channel === 'g' ? 'Green' : 'Blue'}
              </span>
              <span className="text-zinc-400">{current[channel].toString().padStart(3, '0')}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={current[channel]}
              disabled={submitted}
              onChange={(e) => setCurrent(prev => ({ ...prev, [channel]: parseInt(e.target.value) }))}
              className={cn(
                "w-full h-1.5 rounded-full appearance-none cursor-pointer slider-thumb",
                channel === 'r' ? 'accent-red-500 bg-red-500/10' : 
                channel === 'g' ? 'accent-green-500 bg-green-500/10' : 
                'accent-blue-500 bg-blue-500/10'
              )}
            />
          </div>
        ))}

        <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                playSound('click');
                checkMatch();
              }}
              disabled={submitted}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-mono text-xs py-3 px-6 transition-colors rounded disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest border border-zinc-600 focus:outline-none"
            >
              {submitted ? "Rendered..." : "Apply Grade"}
            </button>
            {submitted && finalDiff !== null && (
              <div className="text-[10px] font-mono text-zinc-500 text-center uppercase mt-2">
                 DelE: {finalDiff.toFixed(2)} | Max: {targetConfig.tolerance.toFixed(2)}
              </div>
            )}
        </div>
      </div>
      </div>
    </div>
  );
}
