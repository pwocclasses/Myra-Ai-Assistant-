import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Bug, 
  HelpCircle, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  FileCode, 
  Sparkles, 
  RotateCw, 
  Terminal, 
  Layers 
} from 'lucide-react';
import { CodeStudioResult, CodeProjectFile } from '../types';
import { playFuturisticSound } from '../services/synth';

export const CodingStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('Create a modern cyber neon Pomodoro Timer with sound and stats');
  const [selectedLanguage, setSelectedLanguage] = useState('html');
  const [explainLanguage, setExplainLanguage] = useState<'hinglish' | 'hindi' | 'english'>('hinglish');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'explanation'>('code');
  const [copied, setCopied] = useState(false);

  // Active coding result
  const [result, setResult] = useState<CodeStudioResult>({
    title: 'Cyber Neon Pomodoro Timer',
    language: 'html',
    previewableHtml: true,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cyber Timer</title>
  <style>
    body {
      background: #090514;
      color: #06b6d4;
      font-family: 'Courier New', monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .timer-card {
      background: rgba(25, 16, 45, 0.85);
      border: 1px solid #a855f7;
      box-shadow: 0 0 25px rgba(168, 85, 247, 0.4);
      padding: 30px;
      border-radius: 20px;
      text-align: center;
    }
    .display {
      font-size: 52px;
      font-weight: bold;
      color: #38bdf8;
      text-shadow: 0 0 15px #38bdf8;
      margin: 20px 0;
    }
    button {
      background: #a855f7;
      color: white;
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 16px;
      margin: 5px;
      font-weight: bold;
      transition: all 0.2s;
    }
    button:hover {
      background: #c084fc;
      box-shadow: 0 0 15px #a855f7;
    }
    .reset { background: #374151; }
  </style>
</head>
<body>
  <div class="timer-card">
    <h2>MAYRA CYBER TIMER</h2>
    <div class="display" id="time">25:00</div>
    <div>
      <button id="startBtn">START</button>
      <button id="pauseBtn">PAUSE</button>
      <button id="resetBtn" class="reset">RESET</button>
    </div>
  </div>

  <script>
    let timeLeft = 1500;
    let timer = null;
    const timeEl = document.getElementById('time');
    
    function updateDisplay() {
      const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const secs = (timeLeft % 60).toString().padStart(2, '0');
      timeEl.textContent = mins + ':' + secs;
    }

    document.getElementById('startBtn').onclick = () => {
      if (!timer) {
        timer = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
          } else {
            clearInterval(timer);
            timer = null;
            alert('Timer finished!');
          }
        }, 1000);
      }
    };

    document.getElementById('pauseBtn').onclick = () => {
      clearInterval(timer);
      timer = null;
    };

    document.getElementById('resetBtn').onclick = () => {
      clearInterval(timer);
      timer = null;
      timeLeft = 1500;
      updateDisplay();
    };
  </script>
</body>
</html>`,
    explanation: 'Yeh ek complete self-contained HTML5, CSS3, aur JavaScript Pomodoro Timer hai jo browser mein turant execute hota hai. Isme Start, Pause, aur Reset timer functions hain with a neon cybernetic aesthetic!',
    runInstructions: 'Is code ko index.html ke roop mein save karein aur kisi bhi browser mein double-click karke chalayein. Live Preview tab mein aap iska live execution abhi test kar sakte hain.',
    files: [
      {
        filename: 'index.html',
        language: 'html',
        content: `<!-- Self contained Cyber Pomodoro -->`,
      },
    ],
  });

  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const handleExecuteCodingAction = async (action: 'generate' | 'debug' | 'explain' | 'preview_html') => {
    setIsLoading(true);
    playFuturisticSound('think');

    try {
      const res = await fetch('/api/gemini/coding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt,
          code: result.code,
          language: selectedLanguage,
          explainLanguage,
        }),
      });

      if (!res.ok) throw new Error('Coding request failed');
      const data: CodeStudioResult = await res.json();
      
      setResult(data);
      playFuturisticSound('success');
      if (action === 'preview_html' || data.previewableHtml) {
        setActiveTab('preview');
      } else if (action === 'explain') {
        setActiveTab('explanation');
      } else {
        setActiveTab('code');
      }
    } catch (err: any) {
      console.error(err);
      playFuturisticSound('alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(result.code);
    setCopied(true);
    playFuturisticSound('click');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportFiles = () => {
    playFuturisticSound('click');
    const blob = new Blob([result.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mayra_project_${Date.now()}.${selectedLanguage === 'python' ? 'py' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'cpp' ? 'cpp' : 'html'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto">
      
      {/* Top Banner / Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel-elevated p-4 rounded-2xl border border-purple-500/40 glow-purple">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-900/60 border border-purple-400/40 text-cyan-300">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
              MAYRA CODING STUDIO
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                PRO ENGINE
              </span>
            </h2>
            <p className="text-xs text-purple-200/70 font-rajdhani">
              Full-stack Code Generation, Realtime HTML Sandbox, Hindi/Hinglish Explanations & Debugger
            </p>
          </div>
        </div>

        {/* Explain Language & Language selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 text-xs font-mono-code bg-purple-950/60 p-1 rounded-xl border border-purple-800">
            <span className="text-purple-400 pl-1 text-[10px]">EXPLAIN IN:</span>
            {(['hinglish', 'hindi', 'english'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setExplainLanguage(lang)}
                className={`px-2 py-0.5 rounded-lg capitalize ${
                  explainLanguage === lang ? 'bg-purple-600 text-white font-bold' : 'text-purple-300 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-purple-950/80 border border-purple-700 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 focus:outline-none font-mono-code"
          >
            <option value="html">HTML5 / Web App</option>
            <option value="javascript">JavaScript / Node</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="react">React Component</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      {/* Prompt Bar & Action Buttons */}
      <div className="glass-panel p-4 rounded-2xl border border-purple-800/40 flex flex-col gap-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            placeholder="Describe what to code, or paste your error message / question here..."
            className="w-full bg-purple-950/40 border border-purple-800/60 rounded-xl p-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 font-sans resize-none"
          />
        </div>

        {/* 5 Dedicated Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExecuteCodingAction('generate')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold font-rajdhani tracking-wider transition-all disabled:opacity-50 shadow-md glow-purple"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Generate Code</span>
          </button>

          <button
            onClick={() => handleExecuteCodingAction('preview_html')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold font-rajdhani tracking-wider transition-all disabled:opacity-50 shadow-md glow-cyan"
          >
            <Eye className="w-4 h-4" />
            <span>Preview HTML App</span>
          </button>

          <button
            onClick={() => handleExecuteCodingAction('debug')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 active:scale-95 border border-purple-600/50 text-purple-200 text-xs font-semibold font-rajdhani tracking-wider transition-all disabled:opacity-50"
          >
            <Bug className="w-4 h-4 text-rose-400" />
            <span>Debug Code</span>
          </button>

          <button
            onClick={() => handleExecuteCodingAction('explain')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 active:scale-95 border border-purple-600/50 text-purple-200 text-xs font-semibold font-rajdhani tracking-wider transition-all disabled:opacity-50"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Explain in Hindi/Hinglish</span>
          </button>

          <button
            onClick={handleExportFiles}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-900/40 text-purple-300 hover:text-white text-xs font-mono-code transition-all ml-auto"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export File</span>
          </button>
        </div>
      </div>

      {/* Editor & Viewer Canvas */}
      <div className="glass-panel-elevated rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl flex flex-col">
        
        {/* Navigation Tabs (Code / Live Preview / Hindi Explanation) */}
        <div className="flex items-center justify-between px-4 py-2 bg-purple-950/80 border-b border-purple-800/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-semibold transition-all ${
                activeTab === 'code'
                  ? 'bg-purple-600 text-white shadow-sm glow-purple'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Source Code</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-cyan-600 text-white shadow-sm glow-cyan'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive HTML Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('explanation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-semibold transition-all ${
                activeTab === 'explanation'
                  ? 'bg-fuchsia-600 text-white shadow-sm glow-magenta'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Explanation & Instructions</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-cyan-300/80 hidden sm:inline">
              {result.title}
            </span>
            <button
              onClick={handleCopyCode}
              title="Copy code"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-xs font-mono-code text-purple-200 hover:text-white border border-purple-700/50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="relative min-h-[420px] bg-[#070410]">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-cyan-300 font-mono-code text-sm">
              <RotateCw className="w-8 h-8 animate-spin mb-3 text-purple-400" />
              <span>MAYRA is synthesizing neural code...</span>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="p-4 overflow-x-auto font-mono-code text-xs sm:text-sm text-purple-100 leading-relaxed max-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre">{result.code}</pre>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="w-full h-[500px] bg-white">
              <iframe
                title="Live HTML Sandbox"
                srcDoc={result.code}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-modals"
              />
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="p-6 text-sm text-purple-100 font-sans max-h-[500px] overflow-y-auto space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800">
                <h4 className="font-orbitron font-bold text-cyan-300 mb-2">Code Summary & Logic:</h4>
                <p className="leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
              </div>

              {result.runInstructions && (
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800">
                  <h4 className="font-orbitron font-bold text-fuchsia-300 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" />
                    <span>How to Run & Where to Paste:</span>
                  </h4>
                  <p className="leading-relaxed whitespace-pre-wrap font-mono-code text-xs text-purple-200">
                    {result.runInstructions}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
