'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { playName, getLetterColor } from '@/lib/audio';
import Visualizer, { type Ring } from '@/components/Visualizer';

function NamePlayer() {
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [rings, setRings] = useState<Ring[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [displayName, setDisplayName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlay = useCallback((nameToPlay: string) => {
    if (!nameToPlay.trim() || isPlaying) return;

    const cleaned = nameToPlay.trim();
    setDisplayName(cleaned);
    setIsPlaying(true);
    setIsComplete(false);
    setRings([]);
    setActiveIndex(-1);

    playName(cleaned, {
      onLetterStart: (index, letter) => {
        setActiveIndex(index);
        const color = getLetterColor(letter);
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
        // Clean up old rings after animation
        setTimeout(() => {
          setRings(prev => prev.slice(-5));
        }, 2000);
      },
    });
  }, [isPlaying]);

  // Auto-play from URL param
  useEffect(() => {
    const urlName = searchParams.get('name');
    if (urlName && !hasAutoPlayed) {
      setName(urlName);
      setHasAutoPlayed(true);
      // Try auto-play after delay
      const timer = setTimeout(() => {
        try {
          handlePlay(urlName);
        } catch {
          setNeedsTap(true);
          setDisplayName(urlName);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, hasAutoPlayed, handlePlay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNeedsTap(false);
    handlePlay(name);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(displayName)}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  const handleReset = () => {
    setIsComplete(false);
    setIsPlaying(false);
    setDisplayName('');
    setRings([]);
    setActiveIndex(-1);
    setName('');
    // Update URL to remove name param
    window.history.replaceState({}, '', window.location.pathname);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const showInput = !isPlaying && !isComplete && !needsTap;

  return (
    <main className="relative flex flex-col items-center justify-center min-h-dvh px-6 overflow-hidden select-none">
      {/* Visualizer layer */}
      <Visualizer
        rings={rings}
        displayName={displayName}
        isPlaying={isPlaying}
        isComplete={isComplete}
        activeIndex={activeIndex}
      />

      {/* Input state */}
      <AnimatePresence mode="wait">
        {showInput && (
          <motion.div
            key="input"
            className="absolute flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl sm:text-3xl font-light text-white/80 text-center tracking-wide">
              What does your name sound like?
            </h1>
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
              <motion.button
                type="submit"
                disabled={!name.trim()}
                className="px-8 py-3 text-sm font-medium tracking-widest uppercase text-white/60 border border-white/10 rounded-full hover:text-white hover:border-white/30 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Tap to play fallback (autoplay blocked) */}
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

        {/* Post-play controls */}
        {isComplete && (
          <motion.div
            key="controls"
            className="absolute bottom-16 sm:bottom-24 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.button
              onClick={() => handlePlay(displayName)}
              className="px-6 py-3 text-sm font-medium tracking-widest uppercase text-white/60 border border-white/10 rounded-full hover:text-white hover:border-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play again
            </motion.button>
            <motion.button
              onClick={handleShare}
              className="px-6 py-3 text-sm font-medium tracking-widest uppercase text-white/60 border border-white/10 rounded-full hover:text-white hover:border-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share
            </motion.button>
            <motion.button
              onClick={handleReset}
              className="px-6 py-3 text-sm font-medium tracking-widest uppercase text-white/60 border border-white/10 rounded-full hover:text-white hover:border-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New name
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-8 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm"
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

export default function Home() {
  return (
    <Suspense fallback={
      <main className="flex items-center justify-center min-h-dvh">
        <div className="text-white/30 text-lg">Loading...</div>
      </main>
    }>
      <NamePlayer />
    </Suspense>
  );
}
