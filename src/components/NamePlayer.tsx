'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { playName, getLetterColor, MODES, type SoundMode } from '@/lib/audio';
import { getRandomName } from '@/lib/names';
import Visualizer, { type Ring } from '@/components/Visualizer';

function isValidMode(m: string | null): m is SoundMode {
  return !!m && MODES.some(mode => mode.id === m);
}

function NamePlayerInner() {
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [mode, setMode] = useState<SoundMode>('ethereal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [rings, setRings] = useState<Ring[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [displayName, setDisplayName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlay = useCallback((nameToPlay: string, playMode?: SoundMode) => {
    if (!nameToPlay.trim() || isPlaying) return;

    const cleaned = nameToPlay.trim();
    const m = playMode ?? mode;
    setDisplayName(cleaned);
    setName(cleaned);
    setIsPlaying(true);
    setIsComplete(false);
    setRings([]);
    setActiveIndex(-1);

    playName(cleaned, m, {
      onLetterStart: (index, letter) => {
        setActiveIndex(index);
        const color = getLetterColor(letter, m);
        setRings(prev => [...prev, {
          id: `${Date.now()}-${index}`,
          letter,
          color,
          index,
        }]);
      },
      onComplete: () => {
        setIsPlaying(false);
        setIsComplete(true);
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 400);
        setTimeout(() => {
          setRings(prev => prev.slice(-5));
        }, 2000);
      },
    });
  }, [isPlaying, mode]);

  // Auto-play from URL param
  useEffect(() => {
    const urlName = searchParams.get('name');
    const urlMode = searchParams.get('mode');
    if (urlName && !hasAutoPlayed) {
      setName(urlName);
      setDisplayName(urlName);
      if (isValidMode(urlMode)) setMode(urlMode);
      setHasAutoPlayed(true);
      setNeedsTap(true);
    }
  }, [searchParams, hasAutoPlayed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNeedsTap(false);
    handlePlay(name);
  };

  const handleModeChange = (newMode: SoundMode) => {
    setMode(newMode);
    // If a name has been played, replay in new mode immediately
    if (displayName && !isPlaying) {
      handlePlay(displayName, newMode);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(displayName)}&mode=${mode}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  const isInitial = !isPlaying && !isComplete && !needsTap && !displayName;

  return (
    <main className="relative flex flex-col items-center justify-center min-h-dvh px-6 overflow-hidden select-none">
      <Visualizer
        rings={rings}
        displayName={displayName}
        isPlaying={isPlaying}
        isComplete={isComplete}
        activeIndex={activeIndex}
        mode={mode}
      />

      <AnimatePresence mode="wait">
        {needsTap && !isPlaying && !isComplete && (
          <motion.div
            key="tap"
            className="absolute flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-3xl sm:text-5xl font-light text-white/80 tracking-wider">
              {displayName}
            </p>
            <motion.button
              onClick={() => { setNeedsTap(false); handlePlay(displayName); }}
              className="px-8 py-3 text-sm font-medium tracking-widest uppercase text-white/60 border border-white/10 rounded-full hover:text-white hover:border-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap to play
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input + controls — visible when not playing and not in tap-to-play */}
      {!isPlaying && !needsTap && (
        <motion.div
          className={`absolute flex flex-col items-center gap-4 ${isComplete ? 'bottom-12 sm:bottom-16' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: isComplete ? 0.3 : 0 }}
        >
          {isInitial && (
            <h1 className="text-2xl sm:text-3xl font-light text-white/80 text-center tracking-wide mb-2">
              What does your name sound like?
            </h1>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type a name..."
              maxLength={30}
              autoFocus
              className="w-72 sm:w-80 px-6 py-4 text-xl text-center bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all duration-300"
            />

            {/* Mode selector */}
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleModeChange(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full border transition-all duration-200 ${
                    mode === m.id
                      ? 'text-white/90 border-white/25 bg-white/10'
                      : 'text-white/35 border-white/[0.06] hover:text-white/60 hover:border-white/15'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: m.dot, opacity: mode === m.id ? 1 : 0.5 }}
                  />
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                type="submit"
                disabled={!name.trim()}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-white/15 bg-white/5 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isComplete ? "Play again" : "Play"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  const randomName = getRandomName();
                  setName(randomName);
                  handlePlay(randomName);
                }}
                className="px-6 py-3 text-sm font-medium tracking-widest uppercase text-white/40 border border-white/[0.06] rounded-full hover:text-white/70 hover:border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Random
              </motion.button>
              {isComplete && (
                <motion.button
                  type="button"
                  onClick={handleShare}
                  className="px-6 py-3 text-sm font-medium tracking-widest uppercase text-white/40 border border-white/[0.06] rounded-full hover:text-white/70 hover:border-white/20 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Share
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      )}

      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-4 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function NamePlayer() {
  return (
    <Suspense fallback={
      <main className="flex items-center justify-center min-h-dvh">
        <div className="text-white/30 text-lg">Loading...</div>
      </main>
    }>
      <NamePlayerInner />
    </Suspense>
  );
}
