import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  FileCode, 
  Zap, 
  Layers, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { usePWAInstall } from '../services/usePWAInstall';
import { playFuturisticSound } from '../services/synth';
import { MAYRA_AVATAR } from '../assets/avatar';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant' | 'instructions' | 'source'>('instant');
  const [isInstalling, setIsInstalling] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleInstantInstall = async () => {
    setIsInstalling(true);
    playFuturisticSound('listen_start');
    try {
      const success = await install();
      if (success) {
        playFuturisticSound('success');
      }
    } catch (e) {
      console.warn('Install prompt error:', e);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDownloadAndroidZip = () => {
    playFuturisticSound('success');
    // Generate an Android source code bundle text file
    const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="ai.mayra.companion">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.FLASHLIGHT" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="MAYRA AI"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MayraAI"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:theme="@style/Theme.MayraAI.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

    const blob = new Blob([manifestCode], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AndroidManifest.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          className="relative w-full max-w-2xl max-h-[92vh] glass-panel-elevated rounded-3xl border border-purple-500/50 glow-purple shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-800/50 bg-gradient-to-r from-purple-950/80 to-cyan-950/80">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-purple-600 to-cyan-400 glow-purple">
                <img src={MAYRA_AVATAR} alt="Mayra" className="w-full h-full object-cover rounded-[14px]" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-base text-white flex items-center gap-2">
                  INSTALL MAYRA AI ON ANDROID
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300">
                    APK / PWA
                  </span>
                </h3>
                <p className="text-xs text-purple-200/80 font-rajdhani">
                  Install as a standalone native Android application on your smartphone
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

          {/* Tab Selector */}
          <div className="flex items-center gap-1 px-6 py-2.5 bg-purple-950/40 border-b border-purple-900/30 overflow-x-auto text-xs font-mono-code scrollbar-none">
            <button
              onClick={() => setActiveTab('instant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'instant' ? 'bg-purple-600 text-white font-bold glow-purple' : 'text-purple-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>1-Tap Instant Install</span>
            </button>

            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'instructions' ? 'bg-purple-600 text-white font-bold glow-purple' : 'text-purple-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-purple-300" />
              <span>Hindi Setup Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('source')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'source' ? 'bg-purple-600 text-white font-bold glow-purple' : 'text-purple-300 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-300" />
              <span>Android Studio / APK Project</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-sm font-sans flex-1">
            
            {/* TAB 1: 1-Tap Instant Install */}
            {activeTab === 'instant' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-purple-950/60 to-cyan-950/60 border border-cyan-500/40 glow-cyan flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-900/80 border-2 border-cyan-400 p-1 flex items-center justify-center shrink-0 shadow-lg">
                      <img src={MAYRA_AVATAR} alt="Icon" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold text-base text-white">
                        MAYRA AI — Android WebAPK
                      </h4>
                      <p className="text-xs text-purple-200/80 mt-0.5 font-rajdhani">
                        Direct Home Screen & App Drawer Installation with Standalone Full-Screen Mode
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] font-mono-code text-cyan-300">
                        <span>• Zero Play Store download wait</span>
                        <span>• Offline cache support</span>
                      </div>
                    </div>
                  </div>

                  {isInstalled ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono-code font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Already Installed!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleInstantInstall}
                      disabled={isInstalling}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-600 hover:brightness-110 active:scale-95 text-white font-orbitron text-xs font-bold shadow-xl transition-all glow-cyan flex items-center gap-2 shrink-0 animate-pulse"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isInstalling ? 'Installing...' : 'Install on Android'}</span>
                    </button>
                  )}
                </div>

                {/* Features of Installed App */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs">
                    <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Native App Window</span>
                    </div>
                    <p className="text-purple-200/70 text-[11px]">
                      Runs in pure standalone Android full-screen without any browser address bar.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs">
                    <div className="font-bold text-fuchsia-300 mb-1 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Launcher Icon</span>
                    </div>
                    <p className="text-purple-200/70 text-[11px]">
                      Shows on Android home screen and app launcher drawer with Mayra's futuristic icon.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs">
                    <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Device Integration</span>
                    </div>
                    <p className="text-purple-200/70 text-[11px]">
                      Full access to microphone, camera viewfinder, torch flashlight, and Android intents.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Hindi Step-by-Step Instructions */}
            {activeTab === 'instructions' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800">
                  <h4 className="font-orbitron font-bold text-sm text-cyan-300 mb-2">
                    Android Phone par Install karne ke 3 simple steps:
                  </h4>
                  <ol className="space-y-3 text-xs text-purple-100 font-sans list-decimal list-inside leading-relaxed">
                    <li className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-800/60">
                      <strong>Chrome Browser mein App Kholein:</strong> Apne Android phone ke Google Chrome browser mein is URL ko open karein.
                    </li>
                    <li className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-800/60">
                      <strong>Install Prompt par Tap Karein:</strong> Chrome ke top right par <strong>3 dots (Menu)</strong> par click karein aur <strong>"Install App"</strong> ya <strong>"Add to Home Screen"</strong> select karein.
                    </li>
                    <li className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-800/60">
                      <strong>Direct Android App Ready:</strong> Kuch hi seconds mein Mayra AI ka icon aapke phone ke app drawer aur home screen par aa jayega, bilkul Google Play Store app ki tarah!
                    </li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800 text-xs text-cyan-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Yeh ek modern <strong>Google WebAPK</strong> technology use karta hai. Isme aapko koi unknown APK file install karne ki warning nahi aayegi, aur yeh 100% secure aur verified hota hai.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 3: Android Studio & Native Source */}
            {activeTab === 'source' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-orbitron font-bold text-xs text-cyan-300">
                      Android Native Manifest (AndroidManifest.xml)
                    </h4>
                    <button
                      onClick={handleDownloadAndroidZip}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 border border-purple-700 text-xs text-cyan-300"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download XML</span>
                    </button>
                  </div>

                  <p className="text-xs text-purple-200/70 mb-3">
                    Agar aap Android Studio se full native APK build karna chahte hain, toh yeh ready-to-use configuration use karein:
                  </p>

                  <div className="p-3 rounded-xl bg-[#070410] border border-purple-900 font-mono-code text-[11px] text-cyan-200 overflow-x-auto max-h-48">
                    <pre>{`package ai.mayra.companion

// Permissions configured:
// android.permission.INTERNET
// android.permission.CAMERA
// android.permission.RECORD_AUDIO
// android.permission.VIBRATE
// android.permission.FLASHLIGHT

// WebView & PWA wrapper target:
// WebApp URL: https://ais-dev-6hortlhjcrk6r25wiqpcup-266735033529.asia-east1.run.app`}</pre>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-900/50 border border-purple-700 hover:border-cyan-400 text-xs font-mono-code text-cyan-300 hover:text-white transition-all text-center"
                  >
                    <span>PWABuilder (1-Click APK Generator)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleDownloadAndroidZip}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-orbitron text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md glow-purple"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Native Config</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-purple-900/40 bg-purple-950/60 flex items-center justify-between">
            <span className="text-[11px] font-mono-code text-purple-300/80">
              Android 10+ • Standalone WebAPK Supported
            </span>
            <button
              onClick={() => {
                playFuturisticSound('click');
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white font-orbitron text-xs font-bold transition-all border border-purple-700"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
