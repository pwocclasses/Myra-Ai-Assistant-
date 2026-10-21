import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Radio, UserCheck, Activity } from 'lucide-react';
import { AssistantState } from '../types';
import { MAYRA_AVATAR } from '../assets/avatar';
import { playFuturisticSound } from '../services/synth';

interface AiOrbProps {
  state: AssistantState;
  onOrbClick: () => void;
  isAudioPlaying: boolean;
}

export const AiOrb: React.FC<AiOrbProps> = ({ state, onOrbClick, isAudioPlaying }) => {
  const [displayMode, setDisplayMode] = useState<'avatar' | 'orb'>('avatar');

  // Dynamic status text & subtitles
  const statusConfig = {
    idle: {
      text: 'MAYRA ONLINE',
      subtext: 'Tap mic or say "Mayra, meri baat suno"',
      glowClass: 'glow-purple',
      ringColor: 'border-purple-500/40',
      coreGrad: 'from-purple-600 via-indigo-700 to-cyan-600',
    },
    listening: {
      text: 'LISTENING CLOSELY...',
      subtext: 'Speaking in Hindi, Hinglish, or English',
      glowClass: 'glow-cyan animate-pulse',
      ringColor: 'border-cyan-400',
      coreGrad: 'from-cyan-500 via-teal-600 to-blue-600',
    },
    thinking: {
      text: 'THINKING & PROCESSING...',
      subtext: 'Gemini 3.8 Neural Synthesis',
      glowClass: 'glow-purple animate-pulse',
      ringColor: 'border-fuchsia-500',
      coreGrad: 'from-fuchsia-600 via-purple-700 to-cyan-500',
    },
    speaking: {
      text: 'MAYRA SPEAKING',
      subtext: 'Responding in your natural voice',
      glowClass: 'glow-magenta animate-pulse',
      ringColor: 'border-pink-500',
      coreGrad: 'from-pink-500 via-purple-600 to-cyan-400',
    },
  }[state];

  // Frequency wave bars for speaking state
  const waveBars = [14, 28, 48, 72, 90, 65, 84, 52, 38, 70, 88, 45, 22, 10];

  return (
    <div className="relative flex flex-col items-center justify-center py-4 select-none">
      
      {/* Background ambient lighting */}
      <div className={`absolute w-72 h-72 rounded-full blur-[90px] opacity-40 transition-all duration-700 pointer-events-none ${
        state === 'listening' ? 'bg-cyan-500' : state === 'speaking' ? 'bg-pink-600' : 'bg-purple-600'
      }`} />

      {/* Main Center Orb / Avatar Container */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center cursor-pointer" onClick={onOrbClick}>
        
        {/* Outermost rotating cyber ring */}
        <div className={`absolute inset-0 rounded-full border border-dashed ${statusConfig.ringColor} animate-orb-spin opacity-60`} />

        {/* Counter-rotating geometric ring with tick markers */}
        <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-orb-spin-reverse opacity-70">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-sm" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-fuchsia-400 shadow-sm" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm" />
        </div>

        {/* Pulsing aura ring */}
        <motion.div
          animate={{
            scale: state === 'listening' ? [1, 1.08, 1] : state === 'speaking' ? [1, 1.05, 1] : [1, 1.02, 1],
            opacity: [0.7, 0.95, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: state === 'listening' ? 1.4 : state === 'speaking' ? 0.9 : 3,
            ease: 'easeInOut',
          }}
          className={`absolute inset-6 rounded-full border-2 ${statusConfig.ringColor} ${statusConfig.glowClass}`}
        />

        {/* Center Content: Either Mayra's Avatar OR Pure Quantum Energy Orb */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-purple-800 via-indigo-900 to-cyan-800 shadow-2xl flex items-center justify-center">
          
          {displayMode === 'avatar' ? (
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img
                src={MAYRA_AVATAR}
                alt="Mayra Avatar"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  state === 'listening' ? 'scale-105 saturate-125' : state === 'speaking' ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Ethereal neon cyber overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-cyan-500/10 pointer-events-none" />

              {/* Holographic scanner line for active states */}
              {(state === 'listening' || state === 'thinking') && (
                <motion.div
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-75 shadow-cyan-400"
                />
              )}
            </div>
          ) : (
            /* Quantum Orb Mode */
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${statusConfig.coreGrad} animate-orb-pulse flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
              <div className="relative text-white font-orbitron font-bold text-center tracking-wider text-xs">
                <Sparkles className="w-8 h-8 mx-auto text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
                <span>MAYRA</span>
              </div>
            </div>
          )}

          {/* Holographic corner HUD brackets */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-purple-400 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-purple-400 rounded-br-sm pointer-events-none" />
        </div>

        {/* Orbiting Satellite Data Bead */}
        <div className="absolute inset-0 pointer-events-none animate-orb-spin" style={{ animationDuration: '10s' }}>
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-purple-900 shadow-[0_0_12px_#22d3ee] -top-1.5 left-1/2 -translate-x-1/2" />
        </div>
      </div>

      {/* Speaking Dynamic Waveform Equalizer */}
      <div className="h-8 flex items-center justify-center gap-1 mt-3 px-4">
        {state === 'speaking' || isAudioPlaying ? (
          waveBars.map((height, i) => (
            <motion.div
              key={i}
              animate={{
                height: [`${Math.max(6, height * 0.2)}px`, `${height * 0.35}px`, `${Math.max(8, height * 0.25)}px`],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.4 + (i % 4) * 0.15,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              className="w-1 rounded-full bg-gradient-to-t from-purple-500 to-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
              style={{ height: `${height * 0.25}px` }}
            />
          ))
        ) : state === 'listening' ? (
          <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-mono-code">
            <Radio className="w-4 h-4 animate-ping" />
            <span className="animate-pulse">Awaiting your voice input...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-30">
            {[10, 14, 18, 14, 10].map((h, i) => (
              <div key={i} className="w-1 rounded-full bg-purple-400" style={{ height: `${h}px` }} />
            ))}
          </div>
        )}
      </div>

      {/* State label & Toggle controls */}
      <div className="mt-2 text-center">
        <h3 className="font-orbitron font-bold text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-cyan-300">
          {statusConfig.text}
        </h3>
        <p className="text-xs text-purple-200/70 font-rajdhani tracking-wide mt-0.5">
          {statusConfig.subtext}
        </p>
      </div>

      {/* Avatar vs Orb View Toggle */}
      <div className="flex items-center gap-2 mt-3 text-[11px] font-mono-code">
        <button
          onClick={(e) => {
            e.stopPropagation();
            playFuturisticSound('click');
            setDisplayMode('avatar');
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
            displayMode === 'avatar'
              ? 'bg-purple-600/40 text-cyan-300 border border-purple-400/50 glow-purple'
              : 'text-purple-300/60 hover:text-white'
          }`}
        >
          <UserCheck className="w-3 h-3" />
          <span>Avatar Identity</span>
        </button>
        <span className="text-purple-600">•</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            playFuturisticSound('click');
            setDisplayMode('orb');
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
            displayMode === 'orb'
              ? 'bg-purple-600/40 text-cyan-300 border border-purple-400/50 glow-purple'
              : 'text-purple-300/60 hover:text-white'
          }`}
        >
          <Activity className="w-3 h-3" />
          <span>Quantum Orb</span>
        </button>
      </div>

    </div>
  );
};
