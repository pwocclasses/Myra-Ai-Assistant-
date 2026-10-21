import React, { useRef, useEffect } from 'react';
import { Bot, User, Volume2, Copy, Check, Sparkles, ExternalLink, Play } from 'lucide-react';
import { ChatMessage } from '../types';
import { speechService } from '../services/speech';
import { playFuturisticSound } from '../services/synth';

interface ChatHistoryProps {
  messages: ChatMessage[];
  onTriggerAction: (intent: any) => void;
  onClearHistory: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  onTriggerAction,
  onClearHistory,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playFuturisticSound('click');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    playFuturisticSound('click');
    speechService.speak(text, { language: 'hinglish' });
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-purple-300/60 font-rajdhani">
        <Sparkles className="w-8 h-8 mb-2 text-purple-400/40 animate-pulse" />
        <p className="text-base font-semibold">Mayra is ready to assist you.</p>
        <p className="text-xs text-purple-300/40 mt-1 max-w-sm">
          Ask questions, talk in Hindi/Hinglish/English, launch Android apps, search YouTube music, or ask for coding help.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-2 px-1 max-h-[380px] sm:max-h-[460px] overflow-y-auto">
      {/* Header bar for clear */}
      <div className="flex justify-between items-center px-2 py-1 text-[11px] font-mono-code text-purple-300/60 border-b border-purple-900/30">
        <span>CONVERSATION LOG ({messages.length})</span>
        <button
          onClick={() => {
            playFuturisticSound('click');
            onClearHistory();
          }}
          className="hover:text-red-400 transition-colors uppercase tracking-wider"
        >
          [ Clear Log ]
        </button>
      </div>

      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1 max-w-[92%] sm:max-w-[85%] ${
              isUser ? 'ml-auto' : 'mr-auto'
            }`}
          >
            {/* Sender header */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-purple-300/70 px-1">
              {isUser ? (
                <>
                  <span>YOU</span>
                  <User className="w-3 h-3 text-cyan-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-fuchsia-400" />
                  <span className="text-fuchsia-300 font-semibold">MAYRA</span>
                  <span className="text-slate-500">• {msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`relative group rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all ${
                isUser
                  ? 'bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border border-cyan-500/30 text-cyan-100 rounded-tr-sm glow-cyan'
                  : 'glass-panel-elevated border border-purple-500/30 text-slate-100 rounded-tl-sm glow-purple'
              }`}
            >
              {/* Optional user-uploaded image */}
              {msg.image && (
                <div className="mb-2 max-w-xs rounded-lg overflow-hidden border border-purple-500/30">
                  <img
                    src={`data:${msg.image.mimeType};base64,${msg.image.data}`}
                    alt="Uploaded attachment"
                    className="w-full h-auto object-cover max-h-48"
                  />
                </div>
              )}

              {/* Message text with basic formatting */}
              <div className="whitespace-pre-wrap break-words font-sans">
                {msg.text}
              </div>

              {/* Action Intent Card Badge if present */}
              {msg.actionIntent && (
                <div className="mt-3 pt-2 border-t border-purple-700/30 flex items-center justify-between gap-2 bg-purple-950/40 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-cyan-300">
                      {msg.actionIntent.type === 'play_music' ? (
                        <Play className="w-3.5 h-3.5" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-cyan-200">
                        {msg.actionIntent.type === 'play_music'
                          ? `Music: ${msg.actionIntent.payload?.song || 'YouTube Track'}`
                          : msg.actionIntent.type === 'launch_app'
                          ? `Launch: ${msg.actionIntent.payload?.appName}`
                          : `Action: ${msg.actionIntent.type}`}
                      </div>
                      <div className="text-[10px] text-purple-300/70">
                        Click to execute Android intent
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playFuturisticSound('success');
                      onTriggerAction(msg.actionIntent);
                    }}
                    className="px-2.5 py-1 text-xs rounded bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>Execute</span>
                  </button>
                </div>
              )}

              {/* Message Action Utilities */}
              <div className="flex items-center justify-end gap-1.5 mt-2 pt-1 border-t border-purple-900/20 text-purple-300/50 group-hover:text-purple-300/80 transition-colors">
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  title="Copy text"
                  className="p-1 hover:text-cyan-300 transition-colors"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {!isUser && (
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    title="Read aloud"
                    className="p-1 hover:text-cyan-300 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
