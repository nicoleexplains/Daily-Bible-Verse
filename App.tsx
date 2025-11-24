import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchVerseByTheme, fetchSpeechForText } from './services/geminiService';
import { VerseData, ThemeOption } from './types';
import { SAMPLE_VERSE } from './constants';
import VerseDisplay from './components/VerseDisplay';
import Controls from './components/Controls';
import ThemeBar from './components/ThemeBar';
import { RefreshCw, Sparkles } from 'lucide-react';

function App() {
  const [verse, setVerse] = useState<VerseData>(SAMPLE_VERSE);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(ThemeOption.DAILY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio State
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // UI State
  const [isCopied, setIsCopied] = useState(false);

  // Initial Load
  useEffect(() => {
    // We start with sample data, but let's fetch a fresh daily one on mount
    handleFetchVerse(ThemeOption.DAILY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchVerse = async (theme: ThemeOption) => {
    stopAudio(); // Stop any playing audio
    setLoading(true);
    setError(null);
    setSelectedTheme(theme);
    
    try {
      const data = await fetchVerseByTheme(theme);
      setVerse(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the divine source right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsAudioLoading(true);

    try {
      // Lazy init AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      // Resume if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const textToRead = `${verse.scripture}. ${verse.reference}.`;
      const buffer = await fetchSpeechForText(textToRead);

      playBuffer(buffer);
    } catch (err) {
      console.error("Audio generation failed", err);
      alert("Could not generate audio at this time.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const playBuffer = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    source.onended = () => {
      setIsPlaying(false);
      sourceNodeRef.current = null;
    };

    source.start();
    sourceNodeRef.current = source;
    setIsPlaying(true);
  };

  const stopAudio = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // ignore if already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const handleCopy = () => {
    const text = `"${verse.scripture}" - ${verse.reference}\n\n${verse.reflection}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    // Simple Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Daily Verse',
        text: `"${verse.scripture}" - ${verse.reference}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      handleCopy();
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-rose-50 flex items-center justify-center p-4 md:p-8">
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-200 rounded-full blur-[120px] opacity-30 animate-pulse-slow"></div>
      </div>

      <main className="w-full max-w-2xl relative z-10 flex flex-col gap-8 animate-fade-in">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold uppercase tracking-wider text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Lumina Daily Verse</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900">
            Word for the Day
          </h1>
        </header>

        {/* Theme Selection */}
        <ThemeBar 
          currentTheme={selectedTheme} 
          onSelectTheme={handleFetchVerse} 
          disabled={loading}
        />

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden group transition-all duration-500 hover:shadow-indigo-100/50">
           {/* Card internal gradient */}
           <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-indigo-50/30 opacity-50 pointer-events-none"></div>
           
           {error ? (
             <div className="text-center py-12 text-slate-500">
               <p>{error}</p>
               <button 
                 onClick={() => handleFetchVerse(selectedTheme)}
                 className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
               >
                 Try Again
               </button>
             </div>
           ) : (
             <VerseDisplay data={verse} isLoading={loading} />
           )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          <Controls 
            onPlayAudio={handlePlayAudio}
            onStopAudio={stopAudio}
            onShare={handleShare}
            onCopy={handleCopy}
            isAudioLoading={isAudioLoading}
            isPlaying={isPlaying}
            isCopied={isCopied}
          />
          
          <button 
            onClick={() => handleFetchVerse(selectedTheme)}
            disabled={loading}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Generate New Verse
          </button>
        </div>

      </main>

      {/* Footer/Attribution */}
      <footer className="fixed bottom-4 text-center w-full text-slate-400 text-xs pointer-events-none">
        Powered by Gemini • Peace be with you
      </footer>
    </div>
  );
}

export default App;