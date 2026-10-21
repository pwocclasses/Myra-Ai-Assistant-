export type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking';

export type LanguageOption = 'hinglish' | 'hindi' | 'english';

export type AppView = 'assistant' | 'coding' | 'youtube' | 'screen' | 'apps' | 'personal' | 'settings';

export interface ActionIntent {
  type: 'launch_app' | 'play_music' | 'set_reminder' | 'device_control' | 'web_search' | 'open_coding';
  payload: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  actionIntent?: ActionIntent;
  image?: {
    mimeType: string;
    data: string;
  };
  audioPlayed?: boolean;
}

export interface UserPreferences {
  name: string;
  language: LanguageOption;
  theme: 'cyber-purple' | 'matrix-cyan' | 'cosmic-dark';
  voiceRate: number; // 0.8 - 1.5
  voicePitch: number; // 0.8 - 1.4
  selectedVoiceName: string;
  continuousVoice: boolean;
  soundEffects: boolean;
  modelName: string;
  temperature: number;
  memoryNotes: string[];
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'study' | 'health';
}

export interface ScreenElement {
  name: string;
  type: 'button' | 'input' | 'icon' | 'text' | 'card';
  approxPosition: { x: number; y: number };
  purpose: string;
}

export interface ScreenStep {
  stepNumber: number;
  action: 'tap' | 'scroll' | 'type' | 'back';
  target: string;
  xPercent: number;
  yPercent: number;
  instructions: string;
}

export interface ScreenAnalysisResult {
  screenSummary: string;
  activeApp: string;
  isSensitive: boolean;
  safetyWarning?: string;
  detectedElements: ScreenElement[];
  recommendedSteps: ScreenStep[];
  accessibilityGuidance: string;
}

export interface CodeProjectFile {
  filename: string;
  content: string;
  language: string;
}

export interface CodeStudioResult {
  title: string;
  code: string;
  language: string;
  explanation: string;
  runInstructions?: string;
  previewableHtml?: boolean;
  files?: CodeProjectFile[];
}

export interface YouTubeItem {
  title: string;
  artistOrChannel: string;
  genreOrCategory: string;
  description: string;
  estimatedDuration: string;
  youtubeSearchQuery: string;
  webUrl: string;
  intentUrl: string;
}
