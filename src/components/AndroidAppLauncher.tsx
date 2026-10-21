import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Flashlight, 
  Volume2, 
  VolumeX, 
  Sun, 
  Battery, 
  Vibrate, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  Youtube, 
  Camera, 
  MapPin, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Globe, 
  Image, 
  Clock, 
  Calculator, 
  Mail,
  Zap,
  X,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ANDROID_APPS, androidService, AndroidAppInfo } from '../services/android';
import { playFuturisticSound } from '../services/synth';

export const AndroidAppLauncher: React.FC = () => {
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(85);
  const [battery, setBattery] = useState<{ level: number; charging: boolean }>({ level: 88, charging: false });
  const [hapticCount, setHapticCount] = useState(0);
  const [launchedNotice, setLaunchedNotice] = useState<string | null>(null);

  // Live Camera Viewfinder Modal State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    androidService.getBatteryStatus().then((b) => {
      if (b) setBattery(b);
    });
  }, []);

  // Cleanup camera stream
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const startCamera = async (facing: 'user' | 'environment') => {
    stopCameraStream();
    setCapturedPhoto(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (err) {
      console.warn('In-app camera stream failed or permission denied:', err);
    }
  };

  const handleOpenInAppCamera = () => {
    playFuturisticSound('listen_start');
    setShowCameraModal(true);
    startCamera(cameraFacing);
  };

  const handleCloseCamera = () => {
    playFuturisticSound('click');
    stopCameraStream();
    setShowCameraModal(false);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    playFuturisticSound('success');
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/png');
    setCapturedPhoto(photo);
  };

  const handleToggleTorch = async () => {
    playFuturisticSound('click');
    const newState = await androidService.toggleFlashlight();
    setIsTorchOn(newState);
    if (newState) playFuturisticSound('success');
  };

  const handleVibrate = () => {
    playFuturisticSound('click');
    androidService.vibrate([60, 80, 60]);
    setHapticCount((prev) => prev + 1);
  };

  const handleLaunch = (app: AndroidAppInfo) => {
    playFuturisticSound('success');
    if (app.id === 'camera') {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        androidService.launchApp(app.id);
      } else {
        handleOpenInAppCamera();
        return;
      }
    }

    const result = androidService.launchApp(app.id);
    setLaunchedNotice(`Dispatched Intent for ${app.name} (${result.method === 'intent' ? 'Native Android' : 'Web Fallback'})`);
    setTimeout(() => setLaunchedNotice(null), 3000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube': return <Youtube className="w-5 h-5 text-red-400" />;
      case 'Camera': return <Camera className="w-5 h-5 text-purple-400" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-emerald-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'Settings': return <SettingsIcon className="w-5 h-5 text-slate-300" />;
      case 'Globe': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Image': return <Image className="w-5 h-5 text-amber-400" />;
      case 'Clock': return <Clock className="w-5 h-5 text-teal-400" />;
      case 'Calculator': return <Calculator className="w-5 h-5 text-indigo-400" />;
      case 'Mail': return <Mail className="w-5 h-5 text-rose-400" />;
      default: return <Smartphone className="w-5 h-5 text-cyan-400" />;
    }
  };

  // Screen dimmer opacity calculation
  const dimmerOpacity = Math.max(0, (100 - brightness) * 0.0075);

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      
      {/* Physical Screen Dimmer Overlay */}
      {dimmerOpacity > 0 && (
        <div
          className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-200"
          style={{ opacity: dimmerOpacity }}
        />
      )}

      {/* Top Banner */}
      <div className="glass-panel-elevated p-4 sm:p-5 rounded-2xl border border-purple-500/40 glow-purple flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-900 to-cyan-900 border border-purple-400/40 text-cyan-300">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
              ANDROID INTENTS & DEVICE CONTROLS
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300">
                HARDWARE BRIDGE
              </span>
            </h2>
            <p className="text-xs text-purple-200/70 font-rajdhani">
              Direct Application Intents, Camera Viewfinder, Flashlight Torch, Battery HUD, Haptics & Brightness
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Android Sandbox Safe</span>
        </div>
      </div>

      {/* Dispatched Notice Banner */}
      {launchedNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-400/60 text-cyan-200 text-xs font-mono-code flex items-center justify-between animate-pulse">
          <span>{launchedNotice}</span>
          <Check className="w-4 h-4 text-cyan-300" />
        </div>
      )}

      {/* Hardware & Device Quick Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Flashlight Torch */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-800/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-code text-purple-300 uppercase">FLASHLIGHT / TORCH</span>
            <Flashlight className={`w-5 h-5 ${isTorchOn ? 'text-amber-300 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <button
            onClick={handleToggleTorch}
            className={`w-full py-2.5 rounded-xl font-orbitron text-xs font-bold transition-all shadow-md ${
              isTorchOn
                ? 'bg-amber-400 text-black shadow-amber-400/40 glow-magenta'
                : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800 border border-purple-600/50'
            }`}
          >
            {isTorchOn ? 'TORCH ON' : 'TURN ON TORCH'}
          </button>
        </div>

        {/* Haptic Vibration */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-800/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-code text-purple-300 uppercase">HAPTIC MOTOR</span>
            <Vibrate className="w-5 h-5 text-cyan-400" />
          </div>
          <button
            onClick={handleVibrate}
            className="w-full py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/50 font-orbitron text-xs font-bold transition-all"
          >
            TEST HAPTIC PULSE ({hapticCount})
          </button>
        </div>

        {/* Screen Brightness Slider */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-800/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono-code text-purple-300 uppercase">DISPLAY BRIGHTNESS</span>
            <span className="text-xs font-mono-code text-cyan-300">{brightness}%</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Sun className="w-4 h-4 text-purple-400" />
            <input
              type="range"
              min="20"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Volume Level */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-800/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono-code text-purple-300 uppercase">MEDIA VOLUME</span>
            <span className="text-xs font-mono-code text-cyan-300">{volume}%</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {volume > 0 ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* Installed Android Apps Hub */}
      <div className="glass-panel-elevated p-5 rounded-2xl border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-orbitron font-bold text-base text-white">
              Installed Applications Intent Hub
            </h3>
            <p className="text-xs text-purple-200/70 font-rajdhani">
              Click to launch direct Android deep link intent or access via voice commands like "Mayra, WhatsApp kholo"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ANDROID_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => handleLaunch(app)}
              className="glass-panel p-3.5 rounded-xl border border-purple-800/60 hover:border-cyan-400/60 hover:bg-purple-900/40 text-left transition-all flex flex-col justify-between group active:scale-95"
            >
              <div>
                <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800/60 w-fit mb-2 group-hover:scale-110 transition-transform">
                  {getIcon(app.iconName)}
                </div>
                <div className="font-sans font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                  {app.name}
                </div>
                <div className="text-[10px] font-mono-code text-purple-300/60 truncate mt-0.5">
                  {app.packageName}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] font-mono-code text-cyan-400/80 pt-1 border-t border-purple-900/40">
                <span>OPEN</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive In-App Camera Viewfinder Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-5 border border-purple-500/40 glow-purple flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-400" />
                <span className="font-orbitron font-bold text-sm">MAYRA CAMERA VIEWFINDER</span>
              </div>
              <button
                onClick={handleCloseCamera}
                className="p-1 rounded-full hover:bg-purple-800/50 text-purple-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-purple-700/50 flex items-center justify-center">
              {capturedPhoto ? (
                <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              )}

              {/* Viewfinder HUD crosshair overlay */}
              <div className="absolute inset-8 border border-dashed border-cyan-400/40 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-300 absolute top-0 left-0" />
                <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-300 absolute top-0 right-0" />
                <div className="w-6 h-6 border-b-2 border-l-2 border-purple-400 absolute bottom-0 left-0" />
                <div className="w-6 h-6 border-b-2 border-r-2 border-purple-400 absolute bottom-0 right-0" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
                  setCameraFacing(nextFacing);
                  startCamera(nextFacing);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-900/50 border border-purple-700 text-xs font-mono-code text-purple-200 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Switch Facing</span>
              </button>

              {capturedPhoto ? (
                <button
                  onClick={() => setCapturedPhoto(null)}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-orbitron text-xs font-bold"
                >
                  Retake Photo
                </button>
              ) : (
                <button
                  onClick={handleCaptureSnapshot}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 active:scale-95 text-white font-orbitron text-xs font-bold glow-cyan shadow-lg"
                >
                  Capture Snapshot
                </button>
              )}

              <button
                onClick={handleCloseCamera}
                className="px-4 py-2 rounded-xl bg-purple-950 border border-purple-800 text-xs font-mono-code text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
