import React, { useState, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Square, 
  Image as ImageIcon, 
  Sparkles, 
  RefreshCw, 
  X,
  VolumeX
} from 'lucide-react';
import { AssistantState, LanguageOption } from '../types';
import { playFuturisticSound } from '../services/synth';

interface VoiceControlsProps {
  assistantState: AssistantState;
  onSendMessage: (text: string, image?: { mimeType: string; data: string }) => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
  onStopSpeaking: () => void;
  isSpeaking: boolean;
  language: LanguageOption;
  onChangeLanguage: (lang: LanguageOption) => void;
  continuousVoice: boolean;
  onToggleContinuousVoice: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  assistantState,
  onSendMessage,
  onStartVoice,
  onStopVoice,
  onStopSpeaking,
  isSpeaking,
  language,
  onChangeLanguage,
  continuousVoice,
  onToggleContinuousVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<{ mimeType: string; data: string; preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    { label: '🎙️ "Mayra, meri baat suno."', text: 'Mayra, meri baat suno.' },
    { label: '📅 "Aaj ka schedule batao."', text: 'Mayra, aaj ka schedule aur reminders batao.' },
    { label: '🎵 "YouTube kholo."', text: 'Mayra, YouTube kholo aur Arijit Singh ka gana chalao.' },
    { label: '💻 "Python code likho."', text: 'Mayra, Python mein ek modern web scraper ya REST API ka code likho.' },
    { label: '⏰ "Reminder lagao."', text: 'Mayra, mujhe sham ko 6 baje walk par jaane ka reminder lagao.' },
  ];

  const handleSend = () => {
    if (!inputText.trim() && !attachedImage) return;
    playFuturisticSound('click');
    onSendMessage(
      inputText.trim(),
      attachedImage ? { mimeType: attachedImage.mimeType, data: attachedImage.data } : undefined
    );
    setInputText('');
    setAttachedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setAttachedImage({
        mimeType: file.type || 'image/jpeg',
        data: base64,
        preview: result,
      });
      playFuturisticSound('success');
    };
    reader.readAsDataURL(file);
  };

  const isListening = assistantState === 'listening';

  return (
    <div className="w-full flex flex-col gap-2.5 pt-2">
      
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-1 px-1">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              playFuturisticSound('click');
              onSendMessage(p.text);
            }}
            className="text-[11px] font-rajdhani font-semibold px-2.5 py-1 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-200 hover:text-cyan-300 hover:border-cyan-500/50 whitespace-nowrap transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Attached image preview banner if present */}
      {attachedImage && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-purple-900/30 border border-purple-500/40">
          <div className="flex items-center gap-2">
            <img
              src={attachedImage.preview}
              alt="Attachment preview"
              className="w-10 h-10 object-cover rounded-lg border border-purple-400"
            />
            <span className="text-xs text-purple-200 font-mono-code">Image attached for Mayra</span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="p-1 rounded-full hover:bg-purple-800/40 text-purple-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Controls Row */}
      <div className="flex items-center gap-2">
        
        {/* Language Selector Pill */}
        <div className="flex items-center rounded-xl bg-purple-950/60 border border-purple-800/50 p-0.5 text-[11px] font-mono-code shrink-0">
          {(['hinglish', 'hindi', 'english'] as LanguageOption[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                playFuturisticSound('click');
                onChangeLanguage(lang);
              }}
              className={`px-2 py-1 rounded-lg capitalize transition-all ${
                language === lang
                  ? 'bg-purple-600 text-white font-bold glow-purple'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              {lang === 'hinglish' ? 'Hinglish' : lang === 'hindi' ? 'हिंदी' : 'Eng'}
            </button>
          ))}
        </div>

        {/* Text Input with attach button */}
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Mayra is listening... Speak now'
                : 'Message Mayra (Hindi / Hinglish / English)...'
            }
            className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
          />

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Attach image icon */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach screen photo or image"
            className="absolute right-2 text-purple-400/70 hover:text-cyan-300 transition-colors p-1"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Send Button */}
        {inputText.trim() || attachedImage ? (
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg hover:brightness-110 active:scale-95 transition-all shrink-0 glow-purple"
            title="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : null}

        {/* Stop Speaking Interrupter button */}
        {isSpeaking && (
          <button
            onClick={() => {
              playFuturisticSound('click');
              onStopSpeaking();
            }}
            title="Interrupt & Stop Mayra Speaking"
            className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg active:scale-95 transition-all shrink-0 flex items-center gap-1.5 text-xs font-orbitron font-bold animate-pulse border border-red-400 glow-magenta"
          >
            <VolumeX className="w-4 h-4" />
            <span>INTERRUPT</span>
          </button>
        )}

        {/* Central Glowing Mic Button */}
        <button
          onClick={() => {
            if (isListening) {
              playFuturisticSound('listen_stop');
              onStopVoice();
            } else {
              playFuturisticSound('listen_start');
              onStartVoice();
            }
          }}
          title={isListening ? 'Stop Listening' : 'Talk with Mayra'}
          className={`relative p-3 rounded-2xl transition-all duration-300 shrink-0 ${
            isListening
              ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 text-black glow-cyan animate-pulse scale-105'
              : 'bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white hover:brightness-110 active:scale-95 glow-purple'
          }`}
        >
          {isListening ? (
            <Square className="w-5 h-5 fill-current" />
          ) : (
            <Mic className="w-5 h-5" />
          )}

          {/* Pulse ring around active microphone */}
          {isListening && (
            <span className="absolute -inset-1 rounded-2xl border-2 border-cyan-400 animate-ping pointer-events-none" />
          )}
        </button>

      </div>

      {/* Bottom Sub-bar: Continuous conversation mode switch & wake hint */}
      <div className="flex items-center justify-between text-[11px] font-mono-code text-purple-300/60 px-1">
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-purple-200">
          <input
            type="checkbox"
            checked={continuousVoice}
            onChange={() => {
              playFuturisticSound('click');
              onToggleContinuousVoice();
            }}
            className="rounded border-purple-700 text-purple-600 focus:ring-0 bg-purple-950"
          />
          <span>Continuous Conversation Mode</span>
        </label>

        <span className="text-[10px] text-cyan-400/80 hidden sm:inline">
          Voice Engine: WebSpeech & Neural Synthesis
        </span>
      </div>

    </div>
  );
};
