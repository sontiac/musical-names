'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getLetterColor, type SoundMode } from '@/lib/audio';

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
  mode: SoundMode;
}

export type { Ring };

// ── Per-mode shape renderers ──

function EtherealRing({ ring }: { ring: Ring }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        border: `2px solid ${ring.color}`,
        boxShadow: `0 0 20px ${ring.color}40, inset 0 0 20px ${ring.color}10`,
      }}
      initial={{ width: 20, height: 20, opacity: 0.9 }}
      animate={{ width: [20, 300 + ring.index * 30], height: [20, 300 + ring.index * 30], opacity: [0.9, 0] }}
      transition={{ duration: 2, ease: 'easeOut' }}
      exit={{ opacity: 0 }}
    />
  );
}

function PianoRing({ ring }: { ring: Ring }) {
  // Horizontal bars that light up outward like piano keys
  return (
    <motion.div
      className="absolute"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${ring.color}80 50%, transparent 100%)`,
        borderRadius: 4,
      }}
      initial={{ width: 10, height: 6, opacity: 0.9 }}
      animate={{
        width: [10, 400 + ring.index * 20],
        height: [6, 16],
        opacity: [0.9, 0],
      }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      exit={{ opacity: 0 }}
    />
  );
}

function OceanRing({ ring }: { ring: Ring }) {
  // Fluid sine-wave-like organic shapes
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        border: `2px solid ${ring.color}`,
        boxShadow: `0 0 30px ${ring.color}50, 0 0 60px ${ring.color}20`,
        filter: 'blur(1px)',
      }}
      initial={{ width: 30, height: 20, opacity: 0.8 }}
      animate={{
        width: [30, 350 + ring.index * 25],
        height: [20, 200 + ring.index * 15],
        opacity: [0.8, 0],
        borderRadius: ['50%', '40% 60% 55% 45%'],
        rotate: [0, ring.index % 2 === 0 ? 15 : -15],
      }}
      transition={{ duration: 2.5, ease: 'easeOut' }}
      exit={{ opacity: 0 }}
    />
  );
}

function BitRing({ ring }: { ring: Ring }) {
  // Blocky pixel squares
  return (
    <motion.div
      className="absolute"
      style={{
        background: ring.color,
        boxShadow: `0 0 10px ${ring.color}`,
      }}
      initial={{ width: 8, height: 8, opacity: 1 }}
      animate={{
        width: [8, 200 + ring.index * 25],
        height: [8, 200 + ring.index * 25],
        opacity: [1, 0],
      }}
      transition={{ duration: 1, ease: 'linear' }}
      exit={{ opacity: 0 }}
    />
  );
}

function CrystalRing({ ring }: { ring: Ring }) {
  // Diamond/shard shapes
  return (
    <motion.div
      className="absolute"
      style={{
        border: `1px solid ${ring.color}`,
        boxShadow: `0 0 15px ${ring.color}60, 0 0 2px ${ring.color}`,
        transform: 'rotate(45deg)',
      }}
      initial={{ width: 10, height: 10, opacity: 1 }}
      animate={{
        width: [10, 180 + ring.index * 20],
        height: [10, 180 + ring.index * 20],
        opacity: [1, 0],
        rotate: [45, 45 + ring.index * 5],
      }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      exit={{ opacity: 0 }}
    />
  );
}

function JazzRing({ ring }: { ring: Ring }) {
  // Soft, blurred smoke rings
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        border: `3px solid ${ring.color}60`,
        boxShadow: `0 0 30px ${ring.color}30`,
        filter: 'blur(2px)',
      }}
      initial={{ width: 30, height: 30, opacity: 0.7 }}
      animate={{
        width: [30, 280 + ring.index * 25],
        height: [30, 280 + ring.index * 25],
        opacity: [0.7, 0],
      }}
      transition={{ duration: 2.5, ease: 'easeOut' }}
      exit={{ opacity: 0 }}
    />
  );
}

const RING_COMPONENTS: Record<SoundMode, React.ComponentType<{ ring: Ring }>> = {
  ethereal: EtherealRing,
  piano: PianoRing,
  ocean: OceanRing,
  '8bit': BitRing,
  crystal: CrystalRing,
  jazz: JazzRing,
};

// ── Per-mode ambient glow ──

function getAmbientStyle(mode: SoundMode, baseColor: string) {
  switch (mode) {
    case 'piano':
      return { background: `radial-gradient(ellipse 60% 40%, ${baseColor}12 0%, transparent 70%)` };
    case 'ocean':
      return { background: `radial-gradient(ellipse 70% 50%, ${baseColor}18 0%, transparent 80%)` };
    case '8bit':
      return { background: `radial-gradient(circle, ${baseColor}10 0%, transparent 50%)` };
    case 'crystal':
      return { background: `radial-gradient(circle, ${baseColor}15 0%, transparent 60%)` };
    case 'jazz':
      return { background: `radial-gradient(circle, ${baseColor}12 0%, transparent 65%)` };
    default:
      return { background: `radial-gradient(circle, ${baseColor}15 0%, transparent 70%)` };
  }
}

export default function Visualizer({ rings, displayName, isPlaying, isComplete, activeIndex, mode }: VisualizerProps) {
  const RingComponent = RING_COMPONENTS[mode];
  const baseColor = getLetterColor((displayName[0] || 'a'), mode);

  return (
    <div className={`relative flex items-center justify-center w-full h-[50vh] min-h-[300px] ${mode === '8bit' ? 'pixelated' : ''}`}>
      {/* 8-bit scanline overlay */}
      {mode === '8bit' && (isPlaying || isComplete) && (
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />
      )}

      {/* Expanding shapes */}
      <AnimatePresence>
        {rings.map((ring) => (
          <RingComponent key={ring.id} ring={ring} />
        ))}
      </AnimatePresence>

      {/* Ambient glow after completion */}
      {isComplete && (
        <motion.div
          className="absolute rounded-full"
          style={getAmbientStyle(mode, baseColor)}
          initial={{ width: 200, height: 200, opacity: 0 }}
          animate={{
            width: [200, 280, 200],
            height: [200, 280, 200],
            opacity: [0, 0.6, 0.4],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
              const color = isLetter ? getLetterColor(char, mode) : '#ffffff';
              const isActive = isPlaying && i === activeIndex;

              return (
                <motion.span
                  key={i}
                  className={`text-5xl sm:text-7xl tracking-wider ${mode === '8bit' ? 'font-mono font-bold' : 'font-light'}`}
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
