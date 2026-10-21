import React, { useEffect, useState } from 'react';
import { 
  Bot, 
  Code2, 
  Youtube, 
  Smartphone, 
  Settings, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Battery, 
  BatteryCharging, 
  Scan, 
  CalendarDays,
  Download
} from 'lucide-react';
import { AppView, AssistantState } from '../types';
import { androidService } from '../services/android';
import { playFuturisticSound } from '../services/synth';

interface HeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  assistantState: AssistantState;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenAndroidInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  assistantState,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenAndroidInstall,
}) => {
  const [battery, setBattery] = useState<{ level: number; charging: boolean }>({ level: 88, charging: false });

  useEffect(() => {
    androidService.getBatteryStatus().then((b) => {
      if (b) setBattery(b);
    });
  }, []);

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'assistant', label: 'Companion', icon: <Bot className="w-4 h-4" /> },
    { view: 'coding', label: 'Coding Studio', icon: <Code2 className="w-4 h-4" /> },
    { view: 'youtube', label: 'YouTube Music', icon: <Youtube className="w-4 h-4" /> },
    { view: 'screen', label: 'Screen Assistant', icon: <Scan className="w-4 h-4" /> },
    { view: 'apps', label: 'Android Apps', icon: <Smartphone className="w-4 h-4" /> },
    { view: 'personal', label: 'Planner & Tools', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  // State color mapping
  const stateColor = {
    idle: 'bg-emerald-500 text-emerald-300 border-emerald-500/30',
    listening: 'bg-cyan-500 text-cyan-300 border-cyan-400/50 animate-pulse',
    thinking: 'bg-purple-500 text-purple-200 border-purple-400/50 animate-pulse',
    speaking: 'bg-fuchsia-500 text-fuchsia-200 border-fuchsia-400/50 animate-bounce',
  }[assistantState];

  const stateLabel = {
    idle: 'MAYRA ONLINE',
    listening: 'LISTENING...',
    thinking: 'THINKING...',
    speaking: 'SPEAKING...',
  }[assistantState];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-900/40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onSelectView('assistant')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 glow-purple">
              <div className="w-full h-full bg-[#0d091e] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-cyan-300">
                  MAYRA AI
                </span>
                {/* Assistant State pill */}
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-semibold border ${stateColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{stateLabel}</span>
                </div>
              </div>
              <p className="text-[11px] text-purple-300/70 hidden sm:block font-rajdhani font-medium tracking-wide">
                Your Personal AI Companion
              </p>
            </div>
          </button>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => {
                playFuturisticSound('listen_start');
                onOpenAndroidInstall();
              }}
              title="Install Android App"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-orbitron text-[10px] font-bold glow-cyan shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>APK</span>
            </button>
            <button
              onClick={() => {
                onToggleSound();
                playFuturisticSound('click');
              }}
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
              className="p-1.5 rounded-lg border border-purple-800/40 text-purple-300 hover:text-cyan-300 hover:bg-purple-900/20"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            </button>
            <button
              onClick={() => {
                playFuturisticSound('click');
                onOpenSettings();
              }}
              title="Settings"
              className="p-1.5 rounded-lg border border-purple-800/40 text-purple-300 hover:text-cyan-300 hover:bg-purple-900/20"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center / Navigation tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 -mx-2 px-2 sm:mx-0 sm:px-0">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  playFuturisticSound('click');
                  onSelectView(item.view);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/50 glow-purple shadow-sm'
                    : 'text-purple-200/70 hover:text-white hover:bg-purple-900/20 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Right HUD Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Install Android App CTA Button */}
          <button
            onClick={() => {
              playFuturisticSound('listen_start');
              onOpenAndroidInstall();
            }}
            title="Convert & Install as Native Android App"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 active:scale-95 text-white font-orbitron text-xs font-bold transition-all shadow-md glow-cyan border border-cyan-400/50 animate-pulse"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-200" />
            <span>Install Android App</span>
          </button>

          {/* Battery Status */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/40 text-[11px] font-mono-code text-purple-300">
            {battery.charging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>{battery.level}%</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              playFuturisticSound('click');
            }}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-1.5 rounded-lg border border-purple-800/40 text-purple-300 hover:text-cyan-300 hover:bg-purple-900/20 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              playFuturisticSound('click');
              onOpenSettings();
            }}
            title="Settings & Diagnostics"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-700/50 bg-purple-900/20 text-purple-200 hover:text-cyan-300 hover:border-cyan-500/50 transition-all text-xs font-medium"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
};
