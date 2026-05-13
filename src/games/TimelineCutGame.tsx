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
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto p-4 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative">
      <div className="text-center mb-2 md:mb-4">
        <h3 className="text-white font-bold text-lg md:text-2xl uppercase tracking-wider mb-2">{title}</h3>
        {submitted ? (
           <div className="mt-2 md:mt-4 text-base md:text-xl font-black text-white bg-slate-800 inline-block px-4 py-2 rounded-lg border border-slate-700">
             {feedback}
           </div>
        ) : (
           <p className="text-slate-400 text-sm md:text-base">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 bg-slate-950 p-4 border border-slate-800 rounded-xl relative">
        {imageUrl ? (
           <div className="h-32 w-full bg-slate-800 rounded border border-slate-700 relative overflow-hidden flex items-center mb-2">
             <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
           </div>
        ) : null}
        <div className="h-16 w-full bg-slate-800 rounded border border-slate-700 relative overflow-hidden flex items-center">
           <div className="absolute inset-0 opacity-20 flex items-center justify-between gap-1 px-4">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-2 bg-emerald-500 rounded-full" style={{ height: `${Math.random() * 80 + 10}%` }} />
              ))}
           </div>
           
           <div 
             className="absolute top-0 bottom-0 bg-blue-500/40 border-x-2 border-blue-400 z-10 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
             style={{ left: `${targetConfig.zoneStart}%`, width: `${targetConfig.zoneWidth}%` }}
           >
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-xs px-2 rounded font-mono font-bold">TARGET</div>
           </div>
        </div>

        <div className="h-12 w-full bg-slate-800 rounded border border-slate-700 mt-2 relative overflow-hidden flex gap-1">
           {Array.from({ length: 10 }).map((_, i) => (
               <div key={i} className="flex-1 bg-slate-700 border-r border-slate-600 opacity-50 relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent" />
               </div>
           ))}
        </div>

        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-30 transition-none shadow-[0_0_10px_rgba(244,63,94,1)] -ml-px"
          style={{ left: `${Math.max(2, Math.min(98, playheadPos))}%` }}
        >
          <div className="absolute -top-1 -left-2 w-4 h-4 bg-rose-500 rotate-45 rounded-sm" />
        </div>
      </div>

      <div className="flex justify-center mt-6 flex-col items-center gap-4">
         <button
            onClick={makeCut}
            disabled={submitted || !isPlaying}
            className="flex items-center gap-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xl py-4 px-12 rounded-2xl shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-all transform active:scale-95 disabled:opacity-50 uppercase tracking-widest border border-rose-400"
          >
            <Scissors className="w-6 h-6" />
            <span>Make Cut (C)</span>
         </button>
         {submitted && finalDiff !== null && (
            <div className="text-xs font-mono text-slate-400 text-center">
               Distance from center: {finalDiff.toFixed(1)}% / {(targetConfig.zoneWidth * 3).toFixed(1)}% max
            </div>
         )}
      </div>
    </div>
  );
}
