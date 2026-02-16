'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getLetterColor } from '@/lib/audio';

interface Ring {
  id: string;
  letter: string;
  color: string;
  index: number;
}

interface VisualizerProps {
  rings: Ring[];
  displayName: string;
  isPlaying: boolean;
  isComplete: boolean;
  activeIndex: number;
}

export type { Ring };

export default function Visualizer({ rings, displayName, isPlaying, isComplete, activeIndex }: VisualizerProps) {
  return (
    <div className="relative flex items-center justify-center w-full h-[50vh] min-h-[300px]">
      {/* Expanding rings */}
      <AnimatePresence>
        {rings.map((ring) => (
          <motion.div
            key={ring.id}
            className="absolute rounded-full"
            style={{
              border: `2px solid ${ring.color}`,
              boxShadow: `0 0 20px ${ring.color}40, inset 0 0 20px ${ring.color}10`,
            }}
            initial={{ width: 20, height: 20, opacity: 0.9 }}
            animate={{
              width: [20, 300 + ring.index * 30],
              height: [20, 300 + ring.index * 30],
              opacity: [0.9, 0],
            }}
            transition={{ duration: 2, ease: 'easeOut' }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>

      {/* Ambient glow after completion */}
      {isComplete && (
        <motion.div
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${getLetterColor(displayName[0] || 'a')}15 0%, transparent 70%)`,
          }}
          initial={{ width: 200, height: 200, opacity: 0 }}
          animate={{
            width: [200, 280, 200],
            height: [200, 280, 200],
            opacity: [0, 0.6, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Name display during/after playback */}
      {(isPlaying || isComplete) && displayName && (
        <motion.div
          className="absolute z-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center gap-1">
            {displayName.split('').map((char, i) => {
              const isLetter = /[a-zA-Z]/.test(char);
              const color = isLetter ? getLetterColor(char) : '#ffffff';
              const isActive = isPlaying && i === activeIndex;

              return (
                <motion.span
                  key={i}
                  className="text-5xl sm:text-7xl font-light tracking-wider"
                  style={{ color }}
                  animate={isActive ? {
                    scale: [1, 1.3, 1],
                    textShadow: [`0 0 0px ${color}`, `0 0 30px ${color}`, `0 0 10px ${color}`],
                  } : isComplete ? {
                    textShadow: `0 0 10px ${color}60`,
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
