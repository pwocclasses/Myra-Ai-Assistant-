import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { MAYRA_AVATAR, MAYRA_TAGLINE } from '../assets/avatar';
import { playFuturisticSound } from '../services/synth';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(10);
  const [bootStep, setBootStep] = useState('Initializing Quantum Core...');

  useEffect(() => {
    playFuturisticSound('startup');

    const steps = [
      { p: 25, label: 'Connecting to Gemini Neural Engine...' },
      { p: 55, label: 'Calibrating Neural Voice Matrix...' },
      { p: 80, label: 'Syncing Android Intent Gateway...' },
      { p: 100, label: 'MAYRA AI Online & Ready.' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current].p);
        setBootStep(steps[current].label);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070410] text-white px-6 overflow-hidden select-none"
    >
      {/* Background Cyber Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Center Mayra Holographic Avatar / Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mb-8 flex flex-col items-center"
      >
        {/* Animated concentric rings */}
        <div className="absolute -inset-4 rounded-full border border-purple-500/30 animate-orb-spin" />
        <div className="absolute -inset-8 rounded-full border border-dashed border-cyan-400/20 animate-orb-spin-reverse" />
        
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-400 glow-purple shadow-2xl p-1 bg-gradient-to-tr from-purple-900 to-cyan-900">
          <img
            src={MAYRA_AVATAR}
            alt="Mayra AI Avatar"
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 to-transparent pointer-events-none" />
        </div>

        {/* Live Pulse Beacon */}
        <div className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-cyan-400 border-2 border-[#070410] animate-ping" />
        <div className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-cyan-400 border-2 border-[#070410]" />
      </motion.div>

      {/* Title & Tagline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          <h1 className="font-orbitron text-4xl sm:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300">
            MAYRA AI
          </h1>
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>
        <p className="font-rajdhani text-lg sm:text-xl text-purple-200/80 font-medium tracking-wide">
          {MAYRA_TAGLINE}
        </p>
        <div className="flex items-center justify-center gap-3 mt-3 text-xs uppercase tracking-widest text-cyan-400/90 font-mono-code">
          <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> Gemini 3.8</span>
          <span>•</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Neural Voice</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Android Core</span>
        </div>
      </motion.div>

      {/* Futuristic Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-xs sm:max-w-md flex flex-col gap-2"
      >
        <div className="flex justify-between items-center text-xs font-mono-code text-purple-300/80">
          <span className="truncate pr-2">{bootStep}</span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>

        <div className="w-full h-2 bg-purple-950/60 rounded-full overflow-hidden border border-purple-500/30 p-[1px]">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Skip button for impatient users */}
      <button
        onClick={onComplete}
        className="mt-8 text-xs font-mono-code text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest"
      >
        [ Tap to Start Immediately ]
      </button>
    </motion.div>
  );
};
