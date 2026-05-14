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
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative font-sans">
      <div className="text-left mb-2 md:mb-4 border-b border-slate-700 pb-4">
        <h3 className="text-white font-bold text-lg md:text-2xl uppercase tracking-widest flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-slate-400 font-mono tracking-normal">TIMELINE_EDITOR_V1.0</span>
        </h3>
        {submitted ? (
           <div className="mt-4 text-sm md:text-base font-bold text-amber-400 bg-amber-400/10 inline-block px-4 py-2 rounded border border-amber-400/30 uppercase tracking-widest">
             {feedback}
           </div>
        ) : (
           <p className="text-slate-300 text-base mt-2">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 bg-black p-4 border border-slate-800 rounded-xl relative select-none">
        {imageUrl ? (
           <div className="h-32 w-full bg-slate-900 border border-slate-800 relative flex items-center mb-1 group">
             <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-80 transition-all duration-500" />
             <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur text-xs font-mono text-slate-300 border border-slate-700 rounded">V1</div>
           </div>
        ) : null}
        <div className="h-16 w-full bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center group">
           <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur text-xs font-mono text-slate-300 border border-slate-700 rounded z-20">A1</div>
           <div className="absolute inset-0 opacity-40 flex items-center justify-between gap-1 px-2">
              {Array.from({ length: 120 }).map((_, i) => (
                <div key={i} className="flex-1 bg-slate-500 rounded-sm" style={{ height: `${Math.random() * 80 + 10}%` }} />
              ))}
           </div>
           
           <div 
             className="absolute top-0 bottom-0 bg-amber-500/30 border-x-2 border-amber-400 z-10"
             style={{ left: `${targetConfig.zoneStart}%`, width: `${targetConfig.zoneWidth}%` }}
           >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 text-xs font-mono whitespace-nowrap bg-black/80 px-2 rounded">TARGET ZONE</div>
           </div>
        </div>

        <div className="h-8 w-full bg-slate-900 border border-slate-800 mt-1 relative overflow-hidden flex gap-[1px]">
           <div className="absolute top-1 right-2 px-2 py-0.5 bg-black/80 backdrop-blur text-xs font-mono text-slate-300 border border-slate-700 rounded z-20">A2</div>
           {Array.from({ length: 20 }).map((_, i) => (
               <div key={i} className="flex-1 bg-slate-800 relative"></div>
           ))}
        </div>

        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-red-500 z-30 transition-none -ml-[2px]"
          style={{ left: `${Math.max(2, Math.min(98, playheadPos))}%` }}
        >
          <div className="absolute -top-3 -left-[6px] w-[16px] h-[14px] bg-red-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)' }} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 border-t border-slate-700 pt-6">
         <div className="w-1/3">
           {submitted && finalDiff !== null && (
              <div className="text-xs font-mono text-slate-300 uppercase">
                 Diff: {finalDiff.toFixed(2)}%<br/>
                 Max: {(targetConfig.zoneWidth * 3).toFixed(2)}%
              </div>
           )}
         </div>
         <button
            onClick={makeCut}
            disabled={submitted || !isPlaying}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-sm py-3 px-8 rounded-lg shadow-md transition-colors disabled:opacity-50 uppercase tracking-widest border border-slate-600 hover:border-slate-400 focus:outline-none"
          >
            <Scissors className="w-5 h-5" />
            <span>Make Cut (C)</span>
         </button>
         <div className="w-1/3 flex justify-end">
           <div className="px-3 py-2 bg-black border border-slate-700 rounded font-mono text-xs text-slate-300 flex flex-col items-end">
             <span>FPS: 60.00</span>
             <span className="text-red-400 font-bold">REC</span>
           </div>
         </div>
      </div>
    </div>
  );
}
