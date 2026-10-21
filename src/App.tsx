/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bot, 
  Code2, 
  Youtube, 
  Scan, 
  Smartphone, 
  CalendarDays, 
  Sparkles, 
  Flashlight, 
  Play, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { 
  AppView, 
  AssistantState, 
  ChatMessage, 
  UserPreferences, 
  ActionIntent, 
  LanguageOption 
} from './types';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { AiOrb } from './components/AiOrb';
import { ChatHistory } from './components/ChatHistory';
import { VoiceControls } from './components/VoiceControls';
import { ActionModal } from './components/ActionModal';
import { CodingStudio } from './components/CodingStudio';
import { YouTubeAssistant } from './components/YouTubeAssistant';
import { ScreenAssistant } from './components/ScreenAssistant';
import { AndroidAppLauncher } from './components/AndroidAppLauncher';
import { PersonalAssistant } from './components/PersonalAssistant';
import { SettingsModal } from './components/SettingsModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { speechService } from './services/speech';
import { androidService } from './services/android';
import { playFuturisticSound } from './services/synth';

const DEFAULT_PREFERENCES: UserPreferences = {
  name: 'Friend',
  language: 'hinglish',
  theme: 'cyber-purple',
  voiceRate: 1.05,
  voicePitch: 1.15,
  selectedVoiceName: '',
  continuousVoice: false,
  soundEffects: true,
  modelName: 'gemini-3.8-flash',
  temperature: 0.7,
  memoryNotes: [
    'User likes coding and modern Android tools',
    'Speaks fluent Hinglish and Hindi',
    'Enjoys Arijit Singh and soulful Bollywood melodies',
  ],
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('assistant');
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAndroidInstallOpen, setIsAndroidInstallOpen] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<ActionIntent | null>(null);

  // Load preferences from localStorage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('mayra_preferences');
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch (e) {
      return DEFAULT_PREFERENCES;
    }
  });

  // Load messages from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('mayra_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'init-1',
        role: 'model',
        text: 'नमस्ते! Main Mayra hoon — aapki personal AI companion. Main aapki baatein sun sakti hoon, YouTube songs chala sakti hoon, Python/HTML code likh sakti hoon, aur Android apps launch kar sakti hoon. Aaj hum kya banayein?',
        timestamp: '11:00 AM',
      },
    ];
  });

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('mayra_preferences', JSON.stringify(preferences));
    } catch (e) {}
  }, [preferences]);

  // Save messages
  useEffect(() => {
    try {
      localStorage.setItem('mayra_messages', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Handle Mayra Speech response
  const speakText = useCallback((text: string) => {
    setIsSpeaking(true);
    setAssistantState('speaking');

    speechService.speak(text, {
      language: preferences.language,
      voiceName: preferences.selectedVoiceName,
      rate: preferences.voiceRate,
      pitch: preferences.voicePitch,
      onStart: () => {
        setIsSpeaking(true);
        setAssistantState('speaking');
      },
      onEnd: () => {
        setIsSpeaking(false);
        setAssistantState('idle');
        // If continuous voice mode is on, start listening again
        if (preferences.continuousVoice) {
          setTimeout(() => {
            startListening();
          }, 800);
        }
      },
      onError: () => {
        setIsSpeaking(false);
        setAssistantState('idle');
      },
    });
  }, [preferences]);

  // Interrupt and stop speech
  const handleStopSpeaking = useCallback(() => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
    setAssistantState('idle');
  }, []);

  // Send message to Gemini server
  const handleSendMessage = useCallback(async (
    text: string,
    image?: { mimeType: string; data: string }
  ) => {
    if (!text && !image) return;

    // Interrupt any ongoing speech
    handleStopSpeaking();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text || 'Analyze this image',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setAssistantState('thinking');
    playFuturisticSound('think');

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            text: m.text,
            image: m.image,
          })),
          userPreferences: preferences,
          language: preferences.language,
          temperature: preferences.temperature,
          modelName: preferences.modelName,
        }),
      });

      if (!res.ok) {
        throw new Error('Gemini API responded with error');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text || 'Maine aapka sandesh prapt kiya.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionIntent: data.actionIntent,
      };

      setMessages((prev) => [...prev, botMsg]);

      // If there's an action intent, open confirmation modal
      if (data.actionIntent) {
        setPendingIntent(data.actionIntent);
      }

      // Speak Mayra's response
      speakText(botMsg.text);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Maaf kijiye, mujhe response generate karne mein samasya aayi. Kripya check karein ki Gemini API connect hai.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setAssistantState('idle');
      playFuturisticSound('alert');
    }
  }, [messages, preferences, handleStopSpeaking, speakText]);

  // Start speech recognition
  const startListening = useCallback(() => {
    handleStopSpeaking();
    setAssistantState('listening');

    const started = speechService.startListening(preferences.language, {
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          speechService.stopListening();
          handleSendMessage(transcript);
        }
      },
      onError: (err) => {
        console.warn('Speech recognition error:', err);
        setAssistantState('idle');
      },
      onEnd: () => {
        if (assistantState === 'listening') {
          setAssistantState('idle');
        }
      },
    });

    if (!started) {
      setAssistantState('idle');
    }
  }, [preferences.language, handleStopSpeaking, handleSendMessage, assistantState]);

  // Stop listening
  const stopListening = useCallback(() => {
    speechService.stopListening();
    setAssistantState('idle');
  }, []);

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('mayra_messages');
  };

  const handleResetAll = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setMessages([]);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-[#070410] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      
      {/* Background cyber grid & radiant spotlights */}
      <div className="fixed inset-0 cyber-grid opacity-35 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Futuristic Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Main Top Header */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        assistantState={assistantState}
        soundEnabled={preferences.soundEffects}
        onToggleSound={() => setPreferences({ ...preferences, soundEffects: !preferences.soundEffects })}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAndroidInstall={() => setIsAndroidInstallOpen(true)}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 z-10 flex flex-col">
        
        {/* VIEW 1: Main AI Companion View */}
        {currentView === 'assistant' && (
          <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full gap-4">
            
            {/* Center Animated Orb / Avatar */}
            <AiOrb
              state={assistantState}
              onOrbClick={() => {
                if (assistantState === 'idle') startListening();
                else if (assistantState === 'listening') stopListening();
                else if (assistantState === 'speaking') handleStopSpeaking();
              }}
              isAudioPlaying={isSpeaking}
            />

            {/* Quick Action Navigation Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => {
                  playFuturisticSound('click');
                  setCurrentView('coding');
                }}
                className="glass-panel p-2.5 rounded-xl border border-purple-800/50 hover:border-cyan-400/50 flex items-center gap-2 group transition-all text-left"
              >
                <div className="p-2 rounded-lg bg-purple-900/60 text-cyan-300 group-hover:scale-105 transition-transform">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-orbitron text-xs font-bold text-white group-hover:text-cyan-300">
                    Coding Studio
                  </div>
                  <div className="text-[10px] text-purple-300/60 font-rajdhani">
                    HTML Sandbox & Python
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  playFuturisticSound('click');
                  setCurrentView('youtube');
                }}
                className="glass-panel p-2.5 rounded-xl border border-purple-800/50 hover:border-red-400/50 flex items-center gap-2 group transition-all text-left"
              >
                <div className="p-2 rounded-lg bg-red-950/60 text-red-400 group-hover:scale-105 transition-transform">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-orbitron text-xs font-bold text-white group-hover:text-red-300">
                    YouTube Music
                  </div>
                  <div className="text-[10px] text-purple-300/60 font-rajdhani">
                    Arijit Singh & Lo-Fi
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  playFuturisticSound('click');
                  setCurrentView('screen');
                }}
                className="glass-panel p-2.5 rounded-xl border border-purple-800/50 hover:border-cyan-400/50 flex items-center gap-2 group transition-all text-left"
              >
                <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 group-hover:scale-105 transition-transform">
                  <Scan className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-orbitron text-xs font-bold text-white group-hover:text-cyan-300">
                    Screen Assistant
                  </div>
                  <div className="text-[10px] text-purple-300/60 font-rajdhani">
                    Touch & Vision AI
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  playFuturisticSound('click');
                  setCurrentView('apps');
                }}
                className="glass-panel p-2.5 rounded-xl border border-purple-800/50 hover:border-purple-400/50 flex items-center gap-2 group transition-all text-left"
              >
                <div className="p-2 rounded-lg bg-purple-900/60 text-purple-300 group-hover:scale-105 transition-transform">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-orbitron text-xs font-bold text-white group-hover:text-purple-200">
                    Android Apps
                  </div>
                  <div className="text-[10px] text-purple-300/60 font-rajdhani">
                    Camera, Maps & Torch
                  </div>
                </div>
              </button>
            </div>

            {/* Conversation Log Feed */}
            <div className="flex-1 glass-panel rounded-2xl border border-purple-900/40 p-2 sm:p-3 overflow-hidden flex flex-col">
              <ChatHistory
                messages={messages}
                onTriggerAction={(intent) => setPendingIntent(intent)}
                onClearHistory={handleClearHistory}
              />
            </div>

            {/* Voice & Message Control Panel */}
            <VoiceControls
              assistantState={assistantState}
              onSendMessage={handleSendMessage}
              onStartVoice={startListening}
              onStopVoice={stopListening}
              onStopSpeaking={handleStopSpeaking}
              isSpeaking={isSpeaking}
              language={preferences.language}
              onChangeLanguage={(lang) => setPreferences({ ...preferences, language: lang })}
              continuousVoice={preferences.continuousVoice}
              onToggleContinuousVoice={() => setPreferences({ ...preferences, continuousVoice: !preferences.continuousVoice })}
            />

          </div>
        )}

        {/* VIEW 2: Dedicated Coding Studio */}
        {currentView === 'coding' && <CodingStudio />}

        {/* VIEW 3: Dedicated YouTube Assistant */}
        {currentView === 'youtube' && <YouTubeAssistant />}

        {/* VIEW 4: Mayra Screen Assistant */}
        {currentView === 'screen' && <ScreenAssistant />}

        {/* VIEW 5: Android Apps & Hardware Controls */}
        {currentView === 'apps' && <AndroidAppLauncher />}

        {/* VIEW 6: Planner, Weather & Personal Tools */}
        {currentView === 'personal' && <PersonalAssistant />}

      </main>

      {/* Action Intent Confirmation Modal */}
      <ActionModal
        intent={pendingIntent}
        isOpen={!!pendingIntent}
        onClose={() => setPendingIntent(null)}
        onExecuted={() => setPendingIntent(null)}
      />

      {/* Settings & Diagnostics Dashboard Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={(newPref) => setPreferences({ ...preferences, ...newPref })}
        onClearHistory={handleClearHistory}
        onResetAll={handleResetAll}
        onOpenAndroidInstall={() => setIsAndroidInstallOpen(true)}
      />

      {/* Android APK & PWA Install Modal */}
      <AndroidInstallModal
        isOpen={isAndroidInstallOpen}
        onClose={() => setIsAndroidInstallOpen(false)}
      />

    </div>
  );
}
