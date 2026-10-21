import React, { useState } from 'react';
import { 
  Youtube, 
  Search, 
  Play, 
  ExternalLink, 
  Music, 
  Sparkles, 
  Smartphone, 
  Radio, 
  Headphones, 
  RotateCw 
} from 'lucide-react';
import { YouTubeItem } from '../types';
import { playFuturisticSound } from '../services/synth';

export const YouTubeAssistant: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Arijit Singh songs');
  const [isLoading, setIsLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<YouTubeItem | null>(null);

  const moodPresets = [
    { label: '🎤 Arijit Singh Hits', query: 'Arijit Singh romantic hits songs' },
    { label: '⚡ Motivational Workout', query: 'Best energetic Hindi motivational workout songs' },
    { label: '🎧 Lo-Fi Study Beats', query: 'Lofi hip hop beats to study relax Hindi lofi' },
    { label: '💖 Bollywood Chill', query: 'Bollywood acoustic unplugged soothing songs' },
    { label: '🔥 Trending Music', query: 'Trending new songs India playlist' },
    { label: '🧘 Meditation & Peace', query: 'Indian flute and sitar peaceful meditation music' },
  ];

  const [results, setResults] = useState<YouTubeItem[]>([
    {
      title: 'Arijit Singh - Best Romantic Mashup',
      artistOrChannel: 'Arijit Singh Official',
      genreOrCategory: 'Bollywood Romance',
      description: 'Soulful melodies and chart-topping romantic ballads collection.',
      estimatedDuration: '45 mins',
      youtubeSearchQuery: 'Arijit Singh Best Romantic Mashup',
      webUrl: 'https://www.youtube.com/results?search_query=Arijit+Singh+Best+Romantic+Mashup',
      intentUrl: 'vnd.youtube://results?q=Arijit+Singh+Best+Romantic+Mashup',
    },
    {
      title: 'Kesariya & Tum Hi Ho Symphony Live',
      artistOrChannel: 'Sony Music India',
      genreOrCategory: 'Live Symphony',
      description: 'Orchestral live concert rendition with grand audio acoustics.',
      estimatedDuration: '12 mins',
      youtubeSearchQuery: 'Kesariya Tum Hi Ho Symphony Live Arijit',
      webUrl: 'https://www.youtube.com/results?search_query=Kesariya+Tum+Hi+Ho+Symphony+Live',
      intentUrl: 'vnd.youtube://results?q=Kesariya+Tum+Hi+Ho+Symphony+Live',
    },
    {
      title: 'Midnight Lo-Fi Bollywood Study Beats',
      artistOrChannel: 'Lofi Chill Hub',
      genreOrCategory: 'Lo-Fi / Study',
      description: 'Relaxing aesthetic lo-fi beats with soft guitar and subtle rain ambient sound.',
      estimatedDuration: '1 hour',
      youtubeSearchQuery: 'Midnight Lo-Fi Bollywood Study Beats',
      webUrl: 'https://www.youtube.com/results?search_query=Midnight+Lo-Fi+Bollywood+Study+Beats',
      intentUrl: 'vnd.youtube://results?q=Midnight+Lo-Fi+Bollywood+Study+Beats',
    },
  ]);

  const handleSearch = async (queryToSearch: string) => {
    setIsLoading(true);
    playFuturisticSound('think');

    try {
      const res = await fetch('/api/gemini/youtube-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToSearch }),
      });

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      }
      playFuturisticSound('success');
    } catch (e) {
      console.warn('YouTube search fallback:', e);
      // Construct direct fallback results
      const fallback: YouTubeItem[] = [
        {
          title: `${queryToSearch} - Top Official Videos`,
          artistOrChannel: 'YouTube Music Search',
          genreOrCategory: 'Curated Track',
          description: `Direct curated results for "${queryToSearch}"`,
          estimatedDuration: 'Varies',
          youtubeSearchQuery: queryToSearch,
          webUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(queryToSearch)}`,
          intentUrl: `vnd.youtube://results?q=${encodeURIComponent(queryToSearch)}`,
        },
      ];
      setResults(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAppIntent = (item: YouTubeItem) => {
    playFuturisticSound('success');
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.location.href = item.intentUrl;
    } else {
      window.open(item.webUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="glass-panel-elevated p-4 sm:p-5 rounded-2xl border border-purple-500/40 glow-purple flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400">
            <Youtube className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
              MAYRA YOUTUBE ASSISTANT
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300">
                OFFICIAL INTENT
              </span>
            </h2>
            <p className="text-xs text-purple-200/70 font-rajdhani">
              Direct voice playback, mood curation, and Android YouTube app deep linking
            </p>
          </div>
        </div>

        {/* Quick Launch YouTube App Button */}
        <button
          onClick={() => {
            playFuturisticSound('click');
            const isAndroid = /Android/i.test(navigator.userAgent);
            if (isAndroid) {
              window.location.href = 'vnd.youtube://';
            } else {
              window.open('https://www.youtube.com', '_blank');
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold font-rajdhani tracking-wider transition-all shadow-md shrink-0"
        >
          <Smartphone className="w-4 h-4" />
          <span>Launch YouTube App</span>
        </button>
      </div>

      {/* Mood Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-1 px-1">
        {moodPresets.map((m, i) => (
          <button
            key={i}
            onClick={() => {
              setSearchQuery(m.query);
              handleSearch(m.query);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-200 hover:text-cyan-300 hover:border-cyan-400 text-xs font-rajdhani font-semibold whitespace-nowrap transition-all"
          >
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-2.5 rounded-2xl border border-purple-800/50 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            placeholder="Search songs, artists, study music, motivational talks..."
            className="w-full bg-purple-950/40 border border-purple-800/60 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          onClick={() => handleSearch(searchQuery)}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 active:scale-95 text-white text-xs font-bold font-orbitron tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          {isLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>Search</span>
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel-elevated p-4 rounded-2xl border border-purple-600/30 hover:border-cyan-400/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-700/50 text-purple-300 uppercase">
                  {item.genreOrCategory || 'Music'}
                </span>
                <span className="text-[11px] font-mono-code text-cyan-400">
                  {item.estimatedDuration}
                </span>
              </div>

              <h4 className="font-sans font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                {item.title}
              </h4>

              <p className="text-xs text-purple-300/80 font-medium mt-1">
                Channel / Artist: {item.artistOrChannel}
              </p>

              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-purple-800/40">
              <button
                onClick={() => handleOpenAppIntent(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-semibold transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Open in App</span>
              </button>

              <button
                onClick={() => {
                  playFuturisticSound('click');
                  window.open(item.webUrl, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-200 hover:text-cyan-300 border border-purple-700/50 text-xs font-semibold transition-all"
              >
                <span>Watch on Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
