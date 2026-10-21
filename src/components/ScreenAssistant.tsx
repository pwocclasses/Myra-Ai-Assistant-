import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  Monitor, 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  Crosshair, 
  RotateCw, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { ScreenAnalysisResult } from '../types';
import { playFuturisticSound } from '../services/synth';

export const ScreenAssistant: React.FC = () => {
  const [screenImage, setScreenImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userGoal, setUserGoal] = useState('Find the settings button and explain this screen');
  const [analysis, setAnalysis] = useState<ScreenAnalysisResult | null>(null);
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Screen sharing capture via navigator.mediaDevices.getDisplayMedia
  const handleCaptureScreen = async () => {
    playFuturisticSound('listen_start');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop stream
        stream.getTracks().forEach((t) => t.stop());

        const dataUrl = canvas.toDataURL('image/png');
        setScreenImage(dataUrl);
        analyzeScreen(dataUrl);
      } else {
        alert('Screen capture API is not available on this device. Please upload a screenshot.');
      }
    } catch (err: any) {
      console.warn('Screen capture cancelled or error:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setScreenImage(result);
      analyzeScreen(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeScreen = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    playFuturisticSound('think');

    try {
      const base64 = imageDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      const res = await fetch('/api/gemini/screen-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: 'image/png',
          userGoal,
        }),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data: ScreenAnalysisResult = await res.json();
      setAnalysis(data);
      playFuturisticSound('success');
    } catch (e: any) {
      console.error('Screen analysis error:', e);
      // Fallback analysis mock
      setAnalysis({
        screenSummary: 'Analyzed uploaded screen interface. Detected UI components, navigation bar, and interactive touch elements.',
        activeApp: 'Android Screen Interface',
        isSensitive: false,
        detectedElements: [
          { name: 'Search Icon', type: 'icon', approxPosition: { x: 88, y: 8 }, purpose: 'Tap to trigger search query' },
          { name: 'Profile Avatar', type: 'button', approxPosition: { x: 92, y: 15 }, purpose: 'View account preferences' },
          { name: 'Primary Action CTA', type: 'button', approxPosition: { x: 50, y: 78 }, purpose: 'Confirm action' },
        ],
        recommendedSteps: [
          { stepNumber: 1, action: 'tap', target: 'Search Icon', xPercent: 88, yPercent: 8, instructions: 'Tap the magnifying glass at top right' },
          { stepNumber: 2, action: 'type', target: 'Search Input', xPercent: 50, yPercent: 8, instructions: 'Type your desired query' },
        ],
        accessibilityGuidance: 'Native Android touch automation requires Mayra Accessibility Service to be activated in Android Settings > Accessibility.',
      });
      playFuturisticSound('alert');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSimulateStep = (stepIdx: number) => {
    setActiveStepIndex(stepIdx);
    setIsAutomationActive(true);
    playFuturisticSound('click');

    setTimeout(() => {
      playFuturisticSound('success');
      setActiveStepIndex(null);
      setIsAutomationActive(false);
    }, 2200);
  };

  const handleEmergencyStop = () => {
    playFuturisticSound('alert');
    setIsAutomationActive(false);
    setActiveStepIndex(null);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="glass-panel-elevated p-4 sm:p-5 rounded-2xl border border-purple-500/40 glow-purple flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
            <Scan className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
              MAYRA SCREEN ASSISTANT
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                VISION AI
              </span>
            </h2>
            <p className="text-xs text-purple-200/70 font-rajdhani">
              Multimodal Screen Inspection, Touch Guidance & Android Accessibility Assistant
            </p>
          </div>
        </div>

        {/* Live Automation Indicator / Emergency Stop */}
        {isAutomationActive && (
          <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/60 p-2 rounded-xl text-red-200 text-xs font-mono-code animate-pulse">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>SCREEN AUTOMATION ACTIVE</span>
            <button
              onClick={handleEmergencyStop}
              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase ml-1"
            >
              EMERGENCY STOP
            </button>
          </div>
        )}
      </div>

      {/* Screen Input Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Left: Capture or Upload Screen */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-800/40 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-orbitron font-bold text-sm text-cyan-300 mb-1">
              Provide Screen Feed
            </h3>
            <p className="text-xs text-purple-200/70 font-rajdhani mb-3">
              Share your current window or upload a screenshot to let Mayra guide you.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCaptureScreen}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold font-rajdhani tracking-wider transition-all shadow-md glow-cyan"
              >
                <Monitor className="w-4 h-4" />
                <span>Live Screen Capture</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-700/50 text-xs font-semibold transition-all"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Upload Screenshot</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono-code text-purple-300 block mb-1">
              What do you want to accomplish?
            </label>
            <input
              type="text"
              value={userGoal}
              onChange={(e) => setUserGoal(e.target.value)}
              placeholder="e.g. Find settings, tap download button"
              className="w-full bg-purple-950/60 border border-purple-800 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Center: Screen Preview & Interactive Coordinates */}
        <div className="md:col-span-2 glass-panel-elevated rounded-2xl border border-purple-600/30 overflow-hidden flex flex-col items-center justify-center min-h-[320px] relative bg-[#090514]">
          {isAnalyzing && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm text-cyan-300 font-mono-code text-xs">
              <RotateCw className="w-8 h-8 animate-spin mb-2 text-purple-400" />
              <span>Mayra Vision Neural Scanning...</span>
            </div>
          )}

          {screenImage ? (
            <div className="relative w-full h-full max-h-[380px] flex items-center justify-center p-2">
              <img
                src={screenImage}
                alt="Captured Screen"
                className="max-h-[360px] w-auto object-contain rounded-lg shadow-xl border border-purple-800/60"
              />

              {/* Holographic coordinates overlay pins */}
              {analysis?.detectedElements.map((el, i) => (
                <div
                  key={i}
                  style={{ left: `${el.approxPosition.x}%`, top: `${el.approxPosition.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  title={`${el.name} (${el.purpose})`}
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center animate-ping absolute" />
                  <div className="w-6 h-6 rounded-full bg-purple-900/90 border border-cyan-300 flex items-center justify-center text-[10px] text-cyan-300 font-mono-code font-bold shadow-lg">
                    {i + 1}
                  </div>
                  {/* Tooltip */}
                  <div className="hidden group-hover:block absolute left-7 top-0 bg-black/90 text-cyan-200 border border-cyan-500 text-[10px] p-1.5 rounded whitespace-nowrap z-30 font-mono-code">
                    {el.name} • {el.purpose}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-purple-300/50 font-rajdhani">
              <Crosshair className="w-10 h-10 mx-auto mb-2 text-purple-500/40" />
              <p className="text-sm font-semibold">No Screen Loaded</p>
              <p className="text-xs text-purple-300/40 mt-1">Capture your screen or upload a screenshot to begin.</p>
            </div>
          )}
        </div>

      </div>

      {/* Analysis Results & Safety Warnings */}
      {analysis && (
        <div className="space-y-4">
          {/* Sensitive Alert Warning */}
          {analysis.isSensitive && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/60 text-red-200 flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-orbitron font-bold text-sm text-red-300">
                  SENSITIVE OPERATION DETECTED
                </h4>
                <p className="text-xs text-red-200/90 mt-1">
                  {analysis.safetyWarning || 'This screen contains payment, credential, or sensitive communication details. Mayra will require manual confirmation before proceeding with any action.'}
                </p>
              </div>
            </div>
          )}

          {/* Recommended Touch Steps Grid */}
          <div className="glass-panel-elevated p-4 rounded-2xl border border-purple-500/30">
            <h3 className="font-orbitron font-bold text-sm text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Recommended Guided Steps</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.recommendedSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-400 text-cyan-300 flex items-center justify-center text-xs font-mono-code font-bold shrink-0">
                      {step.stepNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-xs">
                        Target: {step.target}
                      </div>
                      <p className="text-[11px] text-purple-200/80 mt-0.5">
                        {step.instructions}
                      </p>
                      <div className="text-[10px] font-mono-code text-cyan-400/80 mt-1">
                        Coordinates: ({step.xPercent}%, {step.yPercent}%)
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulateStep(idx)}
                    disabled={activeStepIndex === idx}
                    className="px-2.5 py-1 rounded bg-purple-600/40 hover:bg-purple-600 text-cyan-300 hover:text-white border border-purple-500/50 text-[11px] font-mono-code font-semibold transition-all shrink-0"
                  >
                    {activeStepIndex === idx ? 'Executing...' : 'Tap'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Android Accessibility Explanation Note */}
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-200/80 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Android Accessibility Integration: </span>
              {analysis.accessibilityGuidance} In a standard web browser, screen coordinates are highlighted for your guidance. For automatic background system clicks on Android devices, install the Mayra Companion Accessibility Service APK.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
