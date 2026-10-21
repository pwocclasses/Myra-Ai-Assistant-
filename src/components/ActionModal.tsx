import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ExternalLink, ShieldAlert, Check, X, Smartphone } from 'lucide-react';
import { ActionIntent } from '../types';
import { androidService } from '../services/android';
import { playFuturisticSound } from '../services/synth';

interface ActionModalProps {
  intent: ActionIntent | null;
  isOpen: boolean;
  onClose: () => void;
  onExecuted: () => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  intent,
  isOpen,
  onClose,
  onExecuted,
}) => {
  if (!isOpen || !intent) return null;

  const handleExecute = () => {
    playFuturisticSound('success');
    if (intent.type === 'launch_app') {
      const appName = intent.payload?.appName?.toLowerCase() || '';
      let targetId = 'youtube';
      if (appName.includes('camera')) targetId = 'camera';
      else if (appName.includes('map')) targetId = 'maps';
      else if (appName.includes('whatsapp')) targetId = 'whatsapp';
      else if (appName.includes('setting')) targetId = 'settings';
      else if (appName.includes('chrome')) targetId = 'chrome';
      else if (appName.includes('gallery')) targetId = 'gallery';
      else if (appName.includes('clock') || appName.includes('alarm')) targetId = 'clock';
      else if (appName.includes('calc')) targetId = 'calculator';
      else if (appName.includes('mail') || appName.includes('gmail')) targetId = 'gmail';

      androidService.launchApp(targetId);
    } else if (intent.type === 'play_music') {
      const url = intent.payload?.directYoutubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(intent.payload?.song || intent.payload?.query || 'Music')}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (intent.type === 'device_control') {
      if (intent.payload?.control === 'flashlight_toggle') {
        androidService.toggleFlashlight();
      }
    } else if (intent.type === 'web_search') {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(intent.payload?.query || '')}`, '_blank');
    }

    onExecuted();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md glass-panel-elevated rounded-2xl p-6 border border-purple-500/40 glow-purple shadow-2xl text-white"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-900/50 border border-purple-500/50 text-cyan-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-lg text-white">
                Android Intent Action
              </h3>
              <p className="text-xs text-purple-300 font-rajdhani">
                Mayra requested permission to execute this operation
              </p>
            </div>
          </div>

          {/* Details Card */}
          <div className="rounded-xl bg-purple-950/60 border border-purple-800/60 p-4 mb-4 text-sm font-sans space-y-2">
            <div className="flex justify-between items-center text-xs font-mono-code text-purple-400">
              <span>ACTION TYPE</span>
              <span className="uppercase text-cyan-400">{intent.type}</span>
            </div>

            <div className="text-white font-medium">
              {intent.type === 'launch_app' && (
                <span>Launch Android Application: <strong className="text-cyan-300">{intent.payload?.appName}</strong></span>
              )}
              {intent.type === 'play_music' && (
                <span>Play YouTube Track: <strong className="text-cyan-300">"{intent.payload?.song || 'Music'}"</strong> by {intent.payload?.artist || 'artist'}</span>
              )}
              {intent.type === 'set_reminder' && (
                <span>Set Reminder: <strong className="text-cyan-300">"{intent.payload?.title}"</strong> at {intent.payload?.time}</span>
              )}
              {intent.type === 'device_control' && (
                <span>Hardware Control: <strong className="text-cyan-300">{intent.payload?.control}</strong></span>
              )}
              {intent.type === 'web_search' && (
                <span>Search the Web for: <strong className="text-cyan-300">"{intent.payload?.query}"</strong></span>
              )}
            </div>

            <div className="text-xs text-slate-400 font-mono-code pt-1 border-t border-purple-800/40">
              Platform Target: Android System Intent / Web Protocol
            </div>
          </div>

          {/* Safety Notice */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-xs mb-5">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Mayra adheres to Android security sandboxes. Native app control operates with explicit user confirmation.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                playFuturisticSound('click');
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-purple-800 text-purple-300 hover:text-white hover:bg-purple-900/30 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg glow-purple"
            >
              <Check className="w-4 h-4" />
              <span>Allow & Execute</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
