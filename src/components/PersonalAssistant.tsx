import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CloudSun, 
  CheckSquare, 
  BookOpen, 
  Languages, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  ExternalLink, 
  Volume2, 
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';
import { ReminderItem } from '../types';
import { fetchLiveWeather, WeatherData } from '../services/weather';
import { speechService } from '../services/speech';
import { playFuturisticSound } from '../services/synth';

export const PersonalAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'weather' | 'translate' | 'quiz'>('planner');

  // Reminders & Schedule State
  const [reminders, setReminders] = useState<ReminderItem[]>([
    {
      id: '1',
      title: 'Review Machine Learning & Gemini 3.8 Notes',
      time: '04:00 PM',
      date: 'Today',
      completed: false,
      priority: 'high',
      category: 'study',
    },
    {
      id: '2',
      title: 'Evening Fitness / Jogging Walk',
      time: '06:30 PM',
      date: 'Today',
      completed: false,
      priority: 'medium',
      category: 'health',
    },
    {
      id: '3',
      title: 'Prepare Python REST API deployment structure',
      time: '08:00 PM',
      date: 'Today',
      completed: true,
      priority: 'high',
      category: 'work',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('07:00 PM');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Weather State
  const [cityInput, setCityInput] = useState('New Delhi');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Translation State
  const [transInput, setTransInput] = useState('How can I help you build your dream application today?');
  const [transOutput, setTransOutput] = useState('आज मैं आपका सपनों का ऐप्लिकेशन बनाने में कैसे मदद कर सकती हूँ?');
  const [transDirection, setTransDirection] = useState<'en-to-hi' | 'hi-to-en'>('en-to-hi');
  const [isTranslating, setIsTranslating] = useState(false);

  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const quizQuestions = [
    {
      q: 'Which architecture does Google Gemini use for unified multimodal reasoning?',
      options: ['Transformer-based multimodal dense architecture', 'Recurrent Neural Network', 'Random Forest ensemble', 'Convolutional-only grid'],
      correct: 0,
      explanation: 'Gemini is built from the ground up as a native multimodal Transformer model.',
    },
    {
      q: 'In Android, which component is used to request an action from another app?',
      options: ['Intent', 'Activity Record', 'Broadcast BroadcastReceiver', 'ContentProvider only'],
      correct: 0,
      explanation: 'Android Intents (both explicit and implicit) allow apps to request actions from other applications.',
    },
    {
      q: 'Which frequency rate is the default for Gemini Live audio streams?',
      options: ['24kHz output / 16kHz input', '44.1kHz stereo', '48kHz surround', '8kHz narrowband'],
      correct: 0,
      explanation: 'Gemini Live accepts 16kHz input audio and returns 24kHz audio output.',
    },
  ];

  // Fetch initial weather
  useEffect(() => {
    loadWeather('New Delhi');
  }, []);

  const loadWeather = async (city: string) => {
    setLoadingWeather(true);
    const data = await fetchLiveWeather(city);
    setWeather(data);
    setLoadingWeather(false);
  };

  const handleAddReminder = () => {
    if (!newTitle.trim()) return;
    playFuturisticSound('success');
    const item: ReminderItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      time: newTime,
      date: 'Today',
      completed: false,
      priority: newPriority,
      category: 'personal',
    };
    setReminders([item, ...reminders]);
    setNewTitle('');
  };

  const handleToggleReminder = (id: string) => {
    playFuturisticSound('click');
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    playFuturisticSound('click');
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleTranslate = async () => {
    if (!transInput.trim()) return;
    setIsTranslating(true);
    playFuturisticSound('think');

    try {
      const prompt = transDirection === 'en-to-hi'
        ? `Translate this English text accurately and naturally into Hindi: "${transInput}". Return only the translation.`
        : `Translate this Hindi text accurately and naturally into English: "${transInput}". Return only the translation.`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: prompt }],
          temperature: 0.2,
        }),
      });
      const data = await res.json();
      setTransOutput(data.text || '');
      playFuturisticSound('success');
    } catch (e) {
      console.warn('Translate error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeakTranslation = () => {
    playFuturisticSound('click');
    speechService.speak(transOutput, {
      language: transDirection === 'en-to-hi' ? 'hindi' : 'english',
    });
  };

  const handleSelectQuizOption = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (idx === quizQuestions[currentQuestionIdx].correct) {
      playFuturisticSound('success');
      setQuizScore((prev) => prev + 1);
    } else {
      playFuturisticSound('alert');
    }
  };

  const handleNextQuestion = () => {
    playFuturisticSound('click');
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // restart quiz
      setCurrentQuestionIdx(0);
      setSelectedAnswer(null);
      setAnswered(false);
      setQuizScore(0);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="glass-panel-elevated p-4 sm:p-5 rounded-2xl border border-purple-500/40 glow-purple flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-cyan-400">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
              PERSONAL PLANNER & TOOLS
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                PRODUCTIVITY
              </span>
            </h2>
            <p className="text-xs text-purple-200/70 font-rajdhani">
              Daily Schedule, Live Open-Meteo Weather, Hindi-English Translation & Knowledge Quizzes
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-purple-950/60 p-1 rounded-xl border border-purple-800 text-xs font-mono-code">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'planner' ? 'bg-purple-600 text-white font-bold' : 'text-purple-300'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'weather' ? 'bg-cyan-600 text-white font-bold' : 'text-purple-300'
            }`}
          >
            Weather
          </button>
          <button
            onClick={() => setActiveTab('translate')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'translate' ? 'bg-fuchsia-600 text-white font-bold' : 'text-purple-300'
            }`}
          >
            Translate
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'quiz' ? 'bg-emerald-600 text-white font-bold' : 'text-purple-300'
            }`}
          >
            Quiz
          </button>
        </div>
      </div>

      {/* Tab 1: Planner & Reminders */}
      {activeTab === 'planner' && (
        <div className="space-y-4">
          {/* Add reminder bar */}
          <div className="glass-panel p-4 rounded-2xl border border-purple-800/50 flex flex-col sm:flex-row items-center gap-2.5">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add reminder or task (e.g. Call client, Study Python)..."
              className="flex-1 bg-purple-950/40 border border-purple-800/60 rounded-xl px-3.5 py-2 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="Time"
              className="w-28 bg-purple-950/40 border border-purple-800/60 rounded-xl px-2.5 py-2 text-xs text-cyan-300 font-mono-code focus:outline-none"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="bg-purple-950/40 border border-purple-800/60 rounded-xl px-2.5 py-2 text-xs text-purple-200 font-mono-code focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High Priority</option>
            </select>
            <button
              onClick={handleAddReminder}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 active:scale-95 text-white text-xs font-bold font-orbitron transition-all flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* List of Reminders */}
          <div className="glass-panel-elevated p-4 rounded-2xl border border-purple-500/30 space-y-2.5">
            <h3 className="font-orbitron font-bold text-sm text-white mb-2 flex items-center justify-between">
              <span>Today's Active Schedule</span>
              <span className="text-xs font-mono-code text-cyan-400">
                {reminders.filter((r) => !r.completed).length} Pending
              </span>
            </h3>

            {reminders.map((r) => (
              <div
                key={r.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  r.completed
                    ? 'bg-purple-950/20 border-purple-900/30 opacity-60'
                    : 'bg-purple-950/60 border-purple-800/60 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleReminder(r.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      r.completed
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-purple-600 hover:border-cyan-400'
                    }`}
                  >
                    {r.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <div className={`text-sm font-medium ${r.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {r.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono-code text-purple-300/70 mt-0.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{r.time}</span>
                      <span>•</span>
                      <span className={`uppercase font-bold ${
                        r.priority === 'high' ? 'text-rose-400' : r.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {r.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteReminder(r.id)}
                  className="p-1.5 text-purple-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Live Weather */}
      {activeTab === 'weather' && (
        <div className="glass-panel-elevated p-6 rounded-2xl border border-purple-500/30 space-y-4">
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city (e.g. Mumbai, Delhi, London)..."
              className="flex-1 bg-purple-950/60 border border-purple-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => loadWeather(cityInput)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron text-xs font-bold transition-all"
            >
              Update
            </button>
          </div>

          {weather && (
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-purple-900/40 to-cyan-900/40 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 glow-cyan">
              <div className="flex items-center gap-5">
                <CloudSun className="w-16 h-16 text-amber-300 animate-pulse" />
                <div>
                  <div className="text-xs font-mono-code text-cyan-300 uppercase tracking-widest">
                    {weather.city}
                  </div>
                  <div className="text-4xl font-black font-orbitron text-white">
                    {weather.temperature}°C
                  </div>
                  <div className="text-sm text-purple-200 font-rajdhani font-semibold mt-0.5">
                    {weather.condition}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono-code text-xs text-purple-200">
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800 text-center">
                  <div className="text-slate-400 text-[10px]">WIND</div>
                  <div className="text-cyan-300 font-bold mt-1">{weather.windSpeed} km/h</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800 text-center">
                  <div className="text-slate-400 text-[10px]">HUMIDITY</div>
                  <div className="text-cyan-300 font-bold mt-1">{weather.humidity}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Hindi <-> English Translator */}
      {activeTab === 'translate' && (
        <div className="glass-panel-elevated p-6 rounded-2xl border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-orbitron font-bold text-sm text-white">
              Neural Language Translator
            </span>
            <button
              onClick={() => {
                setTransDirection(transDirection === 'en-to-hi' ? 'hi-to-en' : 'en-to-hi');
                playFuturisticSound('click');
              }}
              className="px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-700 text-xs font-mono-code text-cyan-300 hover:text-white transition-colors"
            >
              {transDirection === 'en-to-hi' ? 'English ➔ Hindi' : 'Hindi ➔ English'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono-code text-purple-300 mb-1 block">Input Text</label>
              <textarea
                value={transInput}
                onChange={(e) => setTransInput(e.target.value)}
                rows={4}
                className="w-full bg-purple-950/60 border border-purple-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none font-sans"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono-code text-purple-300">Mayra Translation</label>
                {transOutput && (
                  <button
                    onClick={handleSpeakTranslation}
                    className="flex items-center gap-1 text-[11px] font-mono-code text-cyan-400 hover:text-cyan-300"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Pronounce</span>
                  </button>
                )}
              </div>
              <div className="w-full h-[106px] bg-purple-950/30 border border-purple-800 rounded-xl p-3 text-sm text-cyan-100 font-sans overflow-y-auto">
                {transOutput || 'Translation will appear here...'}
              </div>
            </div>
          </div>

          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-orbitron text-xs font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {isTranslating ? 'Translating...' : 'Translate with Gemini'}
          </button>
        </div>
      )}

      {/* Tab 4: Interactive Quiz */}
      {activeTab === 'quiz' && (
        <div className="glass-panel-elevated p-6 rounded-2xl border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-base text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Mayra Knowledge Challenge</span>
            </h3>
            <span className="text-xs font-mono-code px-2.5 py-1 rounded-full bg-purple-950 border border-purple-700 text-cyan-300">
              Score: {quizScore} / {quizQuestions.length}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800">
            <div className="text-xs font-mono-code text-purple-400 mb-2">
              QUESTION {currentQuestionIdx + 1} OF {quizQuestions.length}
            </div>
            <p className="text-base font-semibold text-white mb-4">
              {quizQuestions[currentQuestionIdx].q}
            </p>

            <div className="space-y-2">
              {quizQuestions[currentQuestionIdx].options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === quizQuestions[currentQuestionIdx].correct;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-sans transition-all flex items-center justify-between ${
                      answered
                        ? isCorrect
                          ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 font-bold'
                          : isSelected
                          ? 'bg-rose-950/70 border-rose-400 text-rose-200'
                          : 'bg-purple-950/30 border-purple-900 text-purple-300'
                        : 'bg-purple-950/40 border-purple-800 hover:border-cyan-400 text-purple-200'
                    }`}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between">
                <span className="text-xs text-purple-300/80">
                  {quizQuestions[currentQuestionIdx].explanation}
                </span>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-orbitron text-xs font-bold hover:brightness-110"
                >
                  {currentQuestionIdx < quizQuestions.length - 1 ? 'Next' : 'Restart'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
