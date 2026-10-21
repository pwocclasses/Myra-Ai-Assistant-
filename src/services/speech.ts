// Speech Recognition and Text-To-Speech Service for MAYRA AI

export interface VoiceOption {
  name: string;
  lang: string;
  isFemale: boolean;
  voice: SpeechSynthesisVoice;
}

class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private synth: SpeechSynthesis | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis || null;

      // Check browser speech recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        null;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  // Get available voices and identify best female voices
  public getVoices(): VoiceOption[] {
    if (!this.synth) return [];
    const rawVoices = this.synth.getVoices();
    this.cachedVoices = rawVoices;

    return rawVoices.map((v) => {
      const lower = (v.name + ' ' + v.lang).toLowerCase();
      // Female voice indicators
      const isFemale =
        lower.includes('female') ||
        lower.includes('zira') ||
        lower.includes('samantha') ||
        lower.includes('kore') ||
        lower.includes('kalpana') ||
        lower.includes('veena') ||
        lower.includes('lekha') ||
        lower.includes('swara') ||
        lower.includes('heera') ||
        lower.includes('neerja') ||
        lower.includes('aditi') ||
        lower.includes('kavya') ||
        lower.includes('victoria') ||
        lower.includes('karen') ||
        lower.includes('moira') ||
        lower.includes('tessa') ||
        lower.includes('siri') ||
        lower.includes('google');

      return {
        name: v.name,
        lang: v.lang,
        isFemale,
        voice: v,
      };
    });
  }

  // Pick the most suitable natural female voice for chosen language
  public getBestFemaleVoice(language: 'hinglish' | 'hindi' | 'english'): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.getVoices();
    if (!voices.length) return null;

    if (language === 'hindi') {
      // Look for Hindi voice first
      const hiVoice = voices.find((v) => v.lang.startsWith('hi') && v.isFemale);
      if (hiVoice) return hiVoice.voice;
      const anyHi = voices.find((v) => v.lang.startsWith('hi'));
      if (anyHi) return anyHi.voice;
    }

    if (language === 'hinglish') {
      // Look for Indian English female voice (e.g. en-IN) which sounds most natural for Hinglish
      const inEnVoice = voices.find((v) => v.lang.toLowerCase().includes('in') && v.isFemale);
      if (inEnVoice) return inEnVoice.voice;
      const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
      if (hiVoice) return hiVoice.voice;
    }

    // Default English / International female voice
    const femaleVoice = voices.find((v) => (v.lang.startsWith('en') || v.lang.includes('IN')) && v.isFemale);
    if (femaleVoice) return femaleVoice.voice;

    const anyEn = voices.find((v) => v.lang.startsWith('en'));
    return anyEn ? anyEn.voice : voices[0]?.voice || null;
  }

  // Text-To-Speech with Mayra parameters
  public speak(
    text: string,
    options: {
      language?: 'hinglish' | 'hindi' | 'english';
      voiceName?: string;
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): void {
    if (!this.synth) {
      options.onError?.('Speech synthesis not supported in this browser');
      return;
    }

    // Clean text: strip markdown code blocks and action tags for cleaner speech
    const cleanSpeech = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*#_~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanSpeech) {
      options.onEnd?.();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    const chosenLanguage = options.language || 'hinglish';

    // Set voice
    if (options.voiceName) {
      const found = this.cachedVoices.find((v) => v.name === options.voiceName);
      if (found) {
        utterance.voice = found;
      } else {
        const best = this.getBestFemaleVoice(chosenLanguage);
        if (best) utterance.voice = best;
      }
    } else {
      const best = this.getBestFemaleVoice(chosenLanguage);
      if (best) utterance.voice = best;
    }

    // Voice tone: friendly, warm, slight female pitch lift
    utterance.rate = options.rate ?? 1.05;
    utterance.pitch = options.pitch ?? 1.15;

    // Set utterance lang
    if (chosenLanguage === 'hindi') {
      utterance.lang = 'hi-IN';
    } else if (chosenLanguage === 'hinglish') {
      utterance.lang = 'en-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      // In some browsers cancel triggers error 'canceled', ignore that
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('TTS utterance error:', e);
      }
      options.onEnd?.();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public pauseSpeaking(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resumeSpeaking(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }

  // Speech-To-Text
  public startListening(
    language: 'hinglish' | 'hindi' | 'english',
    callbacks: {
      onResult: (transcript: string, isFinal: boolean) => void;
      onError: (error: string) => void;
      onEnd: () => void;
    }
  ): boolean {
    if (!this.recognition) {
      callbacks.onError('Microphone speech recognition is not supported in this browser. Please use Chrome or modern Chromium/Android WebView.');
      return false;
    }

    if (this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {}
    }

    // Set recognition language
    if (language === 'hindi') {
      this.recognition.lang = 'hi-IN';
    } else if (language === 'hinglish') {
      // 'en-IN' supports Indian accent and mixed Hinglish phrasing well
      this.recognition.lang = 'en-IN';
    } else {
      this.recognition.lang = 'en-US';
    }

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        callbacks.onResult(finalTranscript, true);
      } else if (interimTranscript) {
        callbacks.onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
      if (event.error === 'not-allowed') {
        callbacks.onError('Microphone permission denied. Please allow microphone access in browser or Android permissions.');
      } else if (event.error !== 'no-speech') {
        callbacks.onError(`Speech error: ${event.error}`);
      }
      callbacks.onEnd();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      callbacks.onError(err?.message || 'Could not start microphone');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
