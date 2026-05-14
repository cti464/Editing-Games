import React, { useState, useEffect, useRef } from 'react';
import { Scissors } from 'lucide-react';
import { playSound } from '../lib/audio';

interface TimelineCutGameProps {
  targetConfig: { zoneStart: number; zoneWidth: number; speed: number };
  onComplete: (stars: number) => void;
  timeRemaining: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export function TimelineCutGame({ targetConfig, onComplete, timeRemaining, title, description, imageUrl }: TimelineCutGameProps) {
  const [playheadPos, setPlayheadPos] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finalDiff, setFinalDiff] = useState<number | null>(null);
  
  const requestRef = useRef<number>();

  const animate = () => {
    if (!isPlaying) return;
    setPlayheadPos(prev => {
      const next = prev + (targetConfig.speed * 0.4);
      if (next >= 100) return 0;
      return next;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, targetConfig.speed]);

  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const makeCut = () => {
    if (submitted) return;
    setIsPlaying(false);
    setSubmitted(true);
    playSound('cut');
    
    const zoneCenter = targetConfig.zoneStart + (targetConfig.zoneWidth / 2);
    const distance = Math.abs(playheadPos - zoneCenter);
    setFinalDiff(distance);
    
    let stars = 0;
    if (distance <= targetConfig.zoneWidth / 2) {
      stars = 3; setFeedback('PERFECT TIMING!');
    } else if (distance <= targetConfig.zoneWidth * 1.5) {
      stars = 2; setFeedback('GOOD CUT!');
    } else if (distance <= targetConfig.zoneWidth * 3) {
      stars = 1; setFeedback('POOR TIMING');
    } else {
      setFeedback('MISSED ENTIRELY');
    }
    setTimeout(() => onComplete(stars), 2000);
  };

  useEffect(() => {
    if (timeRemaining <= 0 && !submitted) makeCut();
  }, [timeRemaining, submitted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c' && !submitted && isPlaying) {
        makeCut();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitted, isPlaying]);

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 bg-[#18181b] border border-zinc-800 rounded-lg shadow-2xl relative font-sans">
      <div className="text-left mb-2 md:mb-4 border-b border-zinc-800 pb-4">
        <h3 className="text-zinc-100 font-semibold text-lg md:text-xl uppercase tracking-widest flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs text-zinc-500 font-mono tracking-normal">TIMELINE_EDITOR_V1.0</span>
        </h3>
        {submitted ? (
           <div className="mt-4 text-sm font-bold text-amber-400 bg-amber-400/10 inline-block px-3 py-1 rounded border border-amber-400/20 uppercase tracking-widest">
             {feedback}
           </div>
        ) : (
           <p className="text-zinc-400 text-sm mt-2">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-[2px] bg-black p-4 border border-zinc-800 rounded-md relative select-none">
        {imageUrl ? (
           <div className="h-32 w-full bg-zinc-900 border border-zinc-800 relative flex items-center mb-1 group">
             <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-60 grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
             <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur text-[10px] font-mono text-zinc-400 border border-zinc-800 rounded-sm">V1</div>
           </div>
        ) : null}
        <div className="h-16 w-full bg-zinc-900 border border-zinc-800 relative overflow-hidden flex items-center group">
           <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur text-[10px] font-mono text-zinc-400 border border-zinc-800 rounded-sm">A1</div>
           <div className="absolute inset-0 opacity-40 flex items-center justify-between gap-0.5 px-2">
              {Array.from({ length: 120 }).map((_, i) => (
                <div key={i} className="flex-1 bg-zinc-500 rounded-sm" style={{ height: `${Math.random() * 80 + 10}%` }} />
              ))}
           </div>
           
           <div 
             className="absolute top-0 bottom-0 bg-amber-500/20 border-x border-amber-400/50 z-10"
             style={{ left: `${targetConfig.zoneStart}%`, width: `${targetConfig.zoneWidth}%` }}
           >
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-500 text-[10px] font-mono whitespace-nowrap">TARGET ZONE</div>
           </div>
        </div>

        <div className="h-8 w-full bg-zinc-900 border border-zinc-800 mt-1 relative overflow-hidden flex gap-[1px]">
           <div className="absolute top-1 right-2 px-2 py-0.5 bg-black/60 backdrop-blur text-[10px] font-mono text-zinc-400 border border-zinc-800 rounded-sm z-20">A2</div>
           {Array.from({ length: 20 }).map((_, i) => (
               <div key={i} className="flex-1 bg-zinc-800 relative"></div>
           ))}
        </div>

        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-red-500 z-30 transition-none -ml-px"
          style={{ left: `${Math.max(2, Math.min(98, playheadPos))}%` }}
        >
          <div className="absolute -top-2 -left-[5px] w-[11px] h-[10px] bg-red-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)' }} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 border-t border-zinc-800 pt-4">
         <div className="w-1/3">
           {submitted && finalDiff !== null && (
              <div className="text-[10px] font-mono text-zinc-500 uppercase">
                 Diff: {finalDiff.toFixed(2)}%<br/>
                 Max: {(targetConfig.zoneWidth * 3).toFixed(2)}%
              </div>
           )}
         </div>
         <button
            onClick={makeCut}
            disabled={submitted || !isPlaying}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs py-2 px-6 shadow-md transition-colors disabled:opacity-50 uppercase tracking-widest border border-zinc-700 hover:border-zinc-500 focus:outline-none"
          >
            <Scissors className="w-4 h-4" />
            <span>Make Cut (C)</span>
         </button>
         <div className="w-1/3 flex justify-end">
           <div className="px-3 py-1 bg-black border border-zinc-800 font-mono text-[10px] text-zinc-500 flex flex-col items-end">
             <span>FPS: 60.00</span>
             <span className="text-red-400">REC</span>
           </div>
         </div>
      </div>
    </div>
  );
}
