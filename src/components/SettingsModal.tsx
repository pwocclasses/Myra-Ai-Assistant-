import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings, 
  Cpu, 
  Mic, 
  Volume2, 
  ShieldCheck, 
  RotateCcw, 
  Trash2, 
  Check, 
  Activity, 
  Database, 
  Smartphone,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { UserPreferences, LanguageOption } from '../types';
import { speechService, VoiceOption } from '../services/speech';
import { playFuturisticSound } from '../services/synth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (pref: Partial<UserPreferences>) => void;
  onClearHistory: () => void;
  onResetAll: () => void;
  onOpenAndroidInstall?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onClearHistory,
  onResetAll,
  onOpenAndroidInstall,
}) => {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [activeTab, setActiveTab] = useState<'brain' | 'voice' | 'memory' | 'permissions' | 'about'>('brain');
  const [apiStatus, setApiStatus] = useState<{ connected: boolean; latencyMs?: number; message?: string } | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [newMemoryNote, setNewMemoryNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setVoices(speechService.getVoices());
      testApiConnection();
    }
  }, [isOpen]);

  const testApiConnection = async () => {
    setIsTestingApi(true);
    playFuturisticSound('think');
    try {
      const res = await fetch('/api/gemini/status');
      const data = await res.json();
      setApiStatus(data);
      if (data.connected) {
        playFuturisticSound('success');
      } else {
        playFuturisticSound('alert');
      }
    } catch (e: any) {
      setApiStatus({ connected: false, message: 'Server ping failed' });
      playFuturisticSound('alert');
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleAddMemory = () => {
    if (!newMemoryNote.trim()) return;
    playFuturisticSound('success');
    const updated = [...(preferences.memoryNotes || []), newMemoryNote.trim()];
    onUpdatePreferences({ memoryNotes: updated });
    setNewMemoryNote('');
  };

  const handleRemoveMemory = (idx: number) => {
    playFuturisticSound('click');
    const updated = preferences.memoryNotes.filter((_, i) => i !== idx);
    onUpdatePreferences({ memoryNotes: updated });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl max-h-[90vh] glass-panel-elevated rounded-3xl border border-purple-500/40 glow-purple shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-800/40 bg-purple-950/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-600/30 border border-purple-500/50 text-cyan-300">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-base text-white">
                  MAYRA AI SETTINGS & DIAGNOSTICS
                </h3>
                <p className="text-[11px] text-purple-300/70 font-rajdhani">
                  Gemini Brain, Neural Voice Synthesizer, Memory & System Permissions
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playFuturisticSound('click');
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-purple-800/50 text-purple-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 px-6 py-2.5 bg-purple-950/40 border-b border-purple-900/30 overflow-x-auto text-xs font-mono-code scrollbar-none">
            <button
              onClick={() => setActiveTab('brain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'brain' ? 'bg-purple-600 text-white font-bold glow-purple' : 'text-purple-300 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Gemini Brain</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'voice' ? 'bg-purple-600 text-white font-bold glow-purple' : 'text-purple-300 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Female Voice</span>
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'memory' ? 'bg-purple-600 text-white font-bold glow-purple' : 'text-purple-300 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Memory & Habits</span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'permissions' ? 'bg-purple-600 text-white font-bold glow-purple' : 'text-purple-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Permissions</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 overflow-y-auto space-y-5 text-sm font-sans flex-1">
            
            {/* 1. Gemini Brain */}
            {activeTab === 'brain' && (
              <div className="space-y-4">
                {/* Diagnostics Status Card */}
                <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${apiStatus?.connected ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-red-400'} animate-pulse`} />
                    <div>
                      <div className="font-bold text-white text-xs font-mono-code uppercase">
                        Connection: {apiStatus?.connected ? 'Online & Active' : 'Checking...'}
                      </div>
                      <div className="text-[11px] text-purple-300/70 font-rajdhani">
                        {apiStatus?.message || 'Securely connected to Google Gemini Server SDK'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {apiStatus?.latencyMs && (
                      <span className="text-xs font-mono-code text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                        {apiStatus.latencyMs}ms
                      </span>
                    )}
                    <button
                      onClick={testApiConnection}
                      disabled={isTestingApi}
                      className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-cyan-300 text-xs font-mono-code border border-purple-700/60 transition-all"
                    >
                      {isTestingApi ? 'Testing...' : 'Test Ping'}
                    </button>
                  </div>
                </div>

                {/* Gemini Model Selection */}
                <div>
                  <label className="text-xs font-mono-code text-purple-300 mb-1.5 block">
                    Active Gemini Model
                  </label>
                  <select
                    value={preferences.modelName}
                    onChange={(e) => onUpdatePreferences({ modelName: e.target.value })}
                    className="w-full bg-purple-950/80 border border-purple-800 rounded-xl p-3 text-sm text-cyan-200 font-mono-code focus:outline-none focus:border-cyan-400"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended, Low Latency & High Reasoning)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Lightweight, Fastest)</option>
                  </select>
                </div>

                {/* Temperature slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code text-purple-300 mb-1">
                    <span>Response Creativity (Temperature)</span>
                    <span className="text-cyan-300">{preferences.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={preferences.temperature}
                    onChange={(e) => onUpdatePreferences({ temperature: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono-code text-slate-500 mt-0.5">
                    <span>Focused & Precise</span>
                    <span>Balanced</span>
                    <span>Creative & Playful</span>
                  </div>
                </div>

                {/* API Security Rationale Notice */}
                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Your Gemini API key is managed securely server-side via the AI Studio Secrets panel. No sensitive API credentials are ever exposed in public client bundles or browser logs.
                  </span>
                </div>
              </div>
            )}

            {/* 2. Female Voice */}
            {activeTab === 'voice' && (
              <div className="space-y-4">
                {/* Voice Selection */}
                <div>
                  <label className="text-xs font-mono-code text-purple-300 mb-1.5 block">
                    Mayra Female Voice Persona
                  </label>
                  <select
                    value={preferences.selectedVoiceName}
                    onChange={(e) => onUpdatePreferences({ selectedVoiceName: e.target.value })}
                    className="w-full bg-purple-950/80 border border-purple-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    <option value="">Default Female Natural Voice (Auto-detected)</option>
                    {voices.map((v, i) => (
                      <option key={i} value={v.name}>
                        {v.name} ({v.lang}) {v.isFemale ? '★ Female' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speech Rate (Speed) */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code text-purple-300 mb-1">
                    <span>Speech Speed Rate</span>
                    <span className="text-cyan-300">{preferences.voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.05"
                    value={preferences.voiceRate}
                    onChange={(e) => onUpdatePreferences({ voiceRate: parseFloat(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Pitch */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code text-purple-300 mb-1">
                    <span>Vocal Pitch (Feminine Warmth)</span>
                    <span className="text-cyan-300">{preferences.voicePitch}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={preferences.voicePitch}
                    onChange={(e) => onUpdatePreferences({ voicePitch: parseFloat(e.target.value) })}
                    className="w-full accent-fuchsia-500"
                  />
                </div>

                {/* Test Voice Button */}
                <button
                  onClick={() => {
                    speechService.speak(
                      preferences.language === 'hindi'
                        ? 'नमस्ते! मैं मायरा हूँ, आपकी पर्सनल एआई साथी।'
                        : 'Hello! I am Mayra, your personal AI companion. I am excited to assist you!',
                      {
                        language: preferences.language,
                        voiceName: preferences.selectedVoiceName,
                        rate: preferences.voiceRate,
                        pitch: preferences.voicePitch,
                      }
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-orbitron text-xs font-bold transition-all shadow-md glow-purple"
                >
                  Listen to Voice Sample
                </button>
              </div>
            )}

            {/* 3. Memory & Habits */}
            {activeTab === 'memory' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono-code text-purple-300 mb-1 block">
                    Your Preferred Name / How Mayra Addresses You
                  </label>
                  <input
                    type="text"
                    value={preferences.name}
                    onChange={(e) => onUpdatePreferences({ name: e.target.value })}
                    placeholder="Your Name (e.g. Rahul, Priya, Alex)"
                    className="w-full bg-purple-950/60 border border-purple-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Memory notes */}
                <div>
                  <label className="text-xs font-mono-code text-purple-300 mb-1.5 block">
                    Mayra's User Memory Bank (Saved Preferences)
                  </label>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={newMemoryNote}
                      onChange={(e) => setNewMemoryNote(e.target.value)}
                      placeholder="e.g. Loves Arijit Singh, Prefers Python for backend..."
                      className="flex-1 bg-purple-950/60 border border-purple-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={handleAddMemory}
                      className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono-code text-xs font-bold"
                    >
                      Save Memory
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(preferences.memoryNotes || []).map((note, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between text-xs text-purple-100"
                      >
                        <span>• {note}</span>
                        <button
                          onClick={() => handleRemoveMemory(idx)}
                          className="text-purple-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-900/40 flex justify-between items-center">
                  <button
                    onClick={() => {
                      if (confirm('Clear all conversation messages?')) {
                        onClearHistory();
                        playFuturisticSound('alert');
                      }
                    }}
                    className="text-xs font-mono-code text-rose-400 hover:underline"
                  >
                    Clear Conversation History
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Reset all settings to initial defaults?')) {
                        onResetAll();
                        playFuturisticSound('alert');
                      }
                    }}
                    className="text-xs font-mono-code text-slate-400 hover:text-white"
                  >
                    Reset Factory Defaults
                  </button>
                </div>
              </div>
            )}

            {/* 4. Permissions */}
            {activeTab === 'permissions' && (
              <div className="space-y-3">
                {/* Android App Install Banner */}
                {onOpenAndroidInstall && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-cyan-900/60 border border-cyan-400/50 glow-cyan flex items-center justify-between gap-3">
                    <div>
                      <div className="font-orbitron font-bold text-xs text-white flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-cyan-300" />
                        <span>INSTALL NATIVE ANDROID APP</span>
                      </div>
                      <div className="text-[11px] text-purple-200/80 font-rajdhani mt-0.5">
                        Standalone full-screen window with launcher icon and zero address bar.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAndroidInstall();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron text-xs font-bold transition-all shrink-0"
                    >
                      Install APK
                    </button>
                  </div>
                )}
                {[
                  {
                    name: 'Microphone & Speech Input',
                    desc: 'Required for real-time natural voice conversation with Mayra.',
                    status: 'Active / Permitted',
                    granted: true,
                  },
                  {
                    name: 'Screen Capture & Vision API',
                    desc: 'Allows Mayra Screen Assistant to view your screen upon request.',
                    status: 'Ready on Demand',
                    granted: true,
                  },
                  {
                    name: 'Android Intent App Launcher',
                    desc: 'Dispatches deep links to YouTube, Camera, Maps, and Settings.',
                    status: 'Configured & Enabled',
                    granted: true,
                  },
                  {
                    name: 'Hardware Torch / Camera Flash',
                    desc: 'Controls device flashlight via MediaStream Track constraints.',
                    status: 'Enabled',
                    granted: true,
                  },
                  {
                    name: 'Haptic Vibration Feedback',
                    desc: 'Provides tactile pulses on button presses and voice confirmations.',
                    status: 'Active',
                    granted: true,
                  },
                ].map((perm, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white text-xs">{perm.name}</div>
                      <div className="text-[11px] text-purple-300/70 mt-0.5">{perm.desc}</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono-code font-bold">
                      <Check className="w-3 h-3" />
                      <span>{perm.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-purple-900/40 bg-purple-950/60 flex items-center justify-between">
            <span className="text-[11px] font-mono-code text-cyan-300/80">
              MAYRA AI v3.8.0 • Powered by Google Gemini
            </span>
            <button
              onClick={() => {
                playFuturisticSound('click');
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-orbitron text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md glow-purple"
            >
              Done
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
