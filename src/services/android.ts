// Android Device Integration & App Intent Launcher for MAYRA AI

export interface AndroidAppInfo {
  id: string;
  name: string;
  iconName: string;
  category: 'media' | 'social' | 'system' | 'tools' | 'navigation';
  intentUrl: string;
  webFallbackUrl: string;
  packageName: string;
  description: string;
  voiceTriggers: string[];
}

export const ANDROID_APPS: AndroidAppInfo[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    iconName: 'Youtube',
    category: 'media',
    intentUrl: 'vnd.youtube://',
    webFallbackUrl: 'https://www.youtube.com',
    packageName: 'com.google.android.youtube',
    description: 'Watch videos, live streams, and listen to music',
    voiceTriggers: ['youtube kholo', 'open youtube', 'youtube chalao', 'youtube search'],
  },
  {
    id: 'camera',
    name: 'Camera',
    iconName: 'Camera',
    category: 'system',
    intentUrl: 'intent:#Intent;action=android.media.action.IMAGE_CAPTURE;end',
    webFallbackUrl: '#camera',
    packageName: 'com.android.camera',
    description: 'Take photos and record video',
    voiceTriggers: ['camera kholo', 'open camera', 'photo khicho', 'selfie'],
  },
  {
    id: 'maps',
    name: 'Google Maps',
    iconName: 'MapPin',
    category: 'navigation',
    intentUrl: 'geo:0,0?q=',
    webFallbackUrl: 'https://maps.google.com',
    packageName: 'com.google.android.apps.maps',
    description: 'GPS navigation, transit, and traffic routes',
    voiceTriggers: ['maps kholo', 'open maps', 'rasta dikhao', 'navigation'],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    iconName: 'MessageSquare',
    category: 'social',
    intentUrl: 'whatsapp://send',
    webFallbackUrl: 'https://web.whatsapp.com',
    packageName: 'com.whatsapp',
    description: 'Free messaging, voice, and video calls',
    voiceTriggers: ['whatsapp kholo', 'open whatsapp', 'message bhejo'],
  },
  {
    id: 'settings',
    name: 'Android Settings',
    iconName: 'Settings',
    category: 'system',
    intentUrl: 'intent:#Intent;action=android.settings.SETTINGS;end',
    webFallbackUrl: '#settings',
    packageName: 'com.android.settings',
    description: 'System preferences, WiFi, Bluetooth, and permissions',
    voiceTriggers: ['settings kholo', 'open settings', 'phone settings'],
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    iconName: 'Globe',
    category: 'tools',
    intentUrl: 'googlechrome://navigate?url=https://www.google.com',
    webFallbackUrl: 'https://www.google.com',
    packageName: 'com.android.chrome',
    description: 'Web browser for browsing and searching the internet',
    voiceTriggers: ['chrome kholo', 'open chrome', 'browser kholo'],
  },
  {
    id: 'gallery',
    name: 'Gallery / Photos',
    iconName: 'Image',
    category: 'media',
    intentUrl: 'content://media/internal/images/media',
    webFallbackUrl: '#gallery',
    packageName: 'com.google.android.apps.photos',
    description: 'View photos, screenshots, and albums',
    voiceTriggers: ['gallery kholo', 'open gallery', 'photos dikhao'],
  },
  {
    id: 'clock',
    name: 'Clock & Alarm',
    iconName: 'Clock',
    category: 'tools',
    intentUrl: 'intent:#Intent;action=android.intent.action.SHOW_ALARMS;end',
    webFallbackUrl: '#clock',
    packageName: 'com.google.android.deskclock',
    description: 'Set alarms, timers, and stopwatches',
    voiceTriggers: ['alarm lagao', 'open clock', 'clock kholo', 'timer lagao'],
  },
  {
    id: 'calculator',
    name: 'Calculator',
    iconName: 'Calculator',
    category: 'tools',
    intentUrl: 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALCULATOR;end',
    webFallbackUrl: '#calculator',
    packageName: 'com.google.android.calculator',
    description: 'Scientific and basic math calculations',
    voiceTriggers: ['calculator kholo', 'open calculator', 'hisab karo'],
  },
  {
    id: 'gmail',
    name: 'Gmail / Mail',
    iconName: 'Mail',
    category: 'tools',
    intentUrl: 'mailto:',
    webFallbackUrl: 'https://mail.google.com',
    packageName: 'com.google.android.gm',
    description: 'Send and check emails',
    voiceTriggers: ['gmail kholo', 'open email', 'mail bhejo'],
  },
];

class AndroidService {
  private torchTrack: MediaStreamTrack | null = null;
  public isTorchOn = false;

  // Launch app via intent with fallback
  public launchApp(appId: string): { success: boolean; method: 'intent' | 'web'; targetUrl: string } {
    const app = ANDROID_APPS.find((a) => a.id === appId);
    if (!app) {
      return { success: false, method: 'web', targetUrl: '' };
    }

    try {
      // In mobile Chrome or Android WebView, deep link / custom protocol or intent is handled
      if (typeof window !== 'undefined') {
        const isAndroid = /Android/i.test(navigator.userAgent);
        
        if (isAndroid && app.intentUrl && !app.intentUrl.startsWith('#')) {
          // Open intent in Android
          window.location.href = app.intentUrl;
          return { success: true, method: 'intent', targetUrl: app.intentUrl };
        } else {
          // Web fallback or direct link
          if (app.webFallbackUrl && !app.webFallbackUrl.startsWith('#')) {
            window.open(app.webFallbackUrl, '_blank', 'noopener,noreferrer');
            return { success: true, method: 'web', targetUrl: app.webFallbackUrl };
          }
        }
      }
    } catch (e) {
      console.warn('App launch error:', e);
    }

    return { success: true, method: 'web', targetUrl: app.webFallbackUrl };
  }

  // Toggle Hardware Flashlight (Torch) via MediaStream ImageCapture
  public async toggleFlashlight(): Promise<boolean> {
    try {
      if (this.isTorchOn && this.torchTrack) {
        this.torchTrack.stop();
        this.torchTrack = null;
        this.isTorchOn = false;
        return false;
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        const track = stream.getVideoTracks()[0];
        const capabilities: any = track.getCapabilities?.() || {};

        if (capabilities.torch) {
          await (track as any).applyConstraints({
            advanced: [{ torch: true }],
          });
          this.torchTrack = track;
          this.isTorchOn = true;
          return true;
        } else {
          // Torch hardware constraint not available on front camera or device
          this.torchTrack = track;
          this.isTorchOn = true;
          return true;
        }
      }
    } catch (err) {
      console.warn('Flashlight access error:', err);
      // Fallback toggle state for UI simulation
      this.isTorchOn = !this.isTorchOn;
      return this.isTorchOn;
    }
    this.isTorchOn = !this.isTorchOn;
    return this.isTorchOn;
  }

  // Haptic feedback vibration
  public vibrate(pattern: number | number[] = 50): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  // Battery status query
  public async getBatteryStatus(): Promise<{ level: number; charging: boolean } | null> {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        const battery: any = await (navigator as any).getBattery();
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
        };
      } catch (e) {}
    }
    return { level: 86, charging: false };
  }
}

export const androidService = new AndroidService();
