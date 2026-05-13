import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, CreditCard, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';

export default function Subscription() {
  const navigate = useNavigate();
  const { isSubscribed, completeSubscription } = useGameStore();
  const [processing, setProcessing] = useState(false);

  // If already subscribed, redirect them back to levels
  useEffect(() => {
    if (isSubscribed) {
      navigate('/levels');
    }
  }, [isSubscribed, navigate]);

  if (isSubscribed) {
    return null;
  }

  const handleSubscribe = () => {
    setProcessing(true);
    // Simulate Cashfree payment gateway delay
    setTimeout(() => {
      completeSubscription();
      setProcessing(false);
      navigate('/levels');
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white text-center mb-2">Pro Editor Access</h1>
        <p className="text-slate-400 text-center mb-8">
          Unlock all 100 levels and start your journey to become the ultimate video editor.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <CheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" />
            <span className="text-slate-200">Access to all 100 Campaigns</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <CheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" />
            <span className="text-slate-200">Exclusive color grading effects</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <CheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" />
            <span className="text-slate-200">Ad-free editing experience</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between mb-8">
          <div>
            <p className="text-slate-400 text-sm">One-time payment</p>
            <p className="text-white font-black text-2xl">₹99.00</p>
          </div>
          <div className="flex gap-2">
            <CreditCard className="w-6 h-6 text-slate-500" />
            <Shield className="w-6 h-6 text-slate-500" />
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={processing}
          className="w-full relative group bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 overflow-hidden"
        >
          {processing ? (
             <span className="flex items-center gap-2">
               <Zap className="w-5 h-5 animate-pulse" />
               Processing Payment...
             </span>
          ) : (
            <>
              <span className="relative z-10 flex items-center gap-2">
                Subscribe via Cashfree
              </span>
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -translate-x-full skew-x-12" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
           <Shield className="w-3 h-3" /> Secure checkout powered by Cashfree Payments
        </p>
      </motion.div>
    </div>
  );
}
