'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomFact } from '@/lib/musicFacts';

type ShapeType = 'hexagon' | 'diamond' | 'triangle' | 'star' | 'circle';

interface FloatingShape {
  id: number;
  type: ShapeType;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  driftX: number;
  driftY: number;
  driftDuration: number;
}

interface PopFact {
  id: number;
  x: number;
  y: number;
  text: string;
}

const SHAPE_COLORS = [
  '#BB8FCE', '#45B7D1', '#FF69B4', '#39FF14',
  '#F7DC6F', '#E59866', '#FF4500', '#E0E7FF',
  '#7FB3D8', '#C39BD3', '#82E0AA', '#F1948A',
];

const SHAPE_TYPES: ShapeType[] = ['hexagon', 'hexagon', 'hexagon', 'diamond', 'triangle', 'star', 'circle'];

let shapeIdCounter = 0;

function randomShape(): FloatingShape {
  const type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
  const margin = 80;
  return {
    id: shapeIdCounter++,
    type,
    x: margin + Math.random() * (window.innerWidth - margin * 2),
    y: margin + Math.random() * (window.innerHeight - margin * 2),
    size: 30 + Math.random() * 30,
    rotation: Math.random() * 360,
    color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
    driftX: (Math.random() - 0.5) * 60,
    driftY: (Math.random() - 0.5) * 40,
    driftDuration: 6 + Math.random() * 8,
  };
}

// ── Shape SVG paths ──

function HexagonPath({ size }: { size: number }) {
  const r = size / 2;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${r + r * Math.cos(angle)},${r + r * Math.sin(angle)}`;
  }).join(' ');
  return <polygon points={points} />;
}

function DiamondPath({ size }: { size: number }) {
  const h = size / 2;
  return <polygon points={`${h},0 ${size},${h} ${h},${size} 0,${h}`} />;
}

function TrianglePath({ size }: { size: number }) {
  return <polygon points={`${size / 2},0 ${size},${size} 0,${size}`} />;
}

function StarPath({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const outerR = size / 2, innerR = size / 5;
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
  return <polygon points={points} />;
}

function CirclePath({ size }: { size: number }) {
  return <circle cx={size / 2} cy={size / 2} r={size / 2} />;
}

function ShapeSVG({ type, size }: { type: ShapeType; size: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {type === 'hexagon' && <HexagonPath size={size} />}
      {type === 'diamond' && <DiamondPath size={size} />}
      {type === 'triangle' && <TrianglePath size={size} />}
      {type === 'star' && <StarPath size={size} />}
      {type === 'circle' && <CirclePath size={size} />}
    </svg>
  );
}

// ── Pop sounds ──

let audioCtx: AudioContext | null = null;
function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playPopSound(type: ShapeType) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const baseFreqs: Record<ShapeType, number> = {
    hexagon: 880,
    diamond: 1200,
    triangle: 660,
    star: 1400,
    circle: 520,
  };

  const freq = baseFreqs[type] + (Math.random() - 0.5) * 100;

  // Main pop tone
  const osc = ctx.createOscillator();
  osc.type = type === 'star' ? 'sine' : 'triangle';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.15);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 3000;
  filter.Q.value = 1;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);

  // Sparkle overtone
  const sparkle = ctx.createOscillator();
  sparkle.type = 'sine';
  sparkle.frequency.setValueAtTime(freq * 2.5, now);
  sparkle.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.1);
  const sparkleGain = ctx.createGain();
  sparkleGain.gain.setValueAtTime(0.06, now);
  sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  sparkle.connect(sparkleGain);
  sparkleGain.connect(ctx.destination);
  sparkle.start(now);
  sparkle.stop(now + 0.15);
}

// ── Main component ──

export default function FloatingShapes() {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const [facts, setFacts] = useState<PopFact[]>([]);
  const factIdRef = useRef(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const initial: FloatingShape[] = [];
    for (let i = 0; i < 5; i++) initial.push(randomShape());
    setShapes(initial);
  }, []);

  // Spawn new shapes to keep count at ~5
  useEffect(() => {
    const interval = setInterval(() => {
      setShapes(prev => {
        if (prev.length < 5) return [...prev, randomShape()];
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePop = useCallback((shape: FloatingShape, e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound(shape.type);

    // Remove shape
    setShapes(prev => prev.filter(s => s.id !== shape.id));

    // Show fact
    const factId = factIdRef.current++;
    const rect = (e.target as HTMLElement).closest('[data-shape]')?.getBoundingClientRect();
    const fx = rect ? rect.left + rect.width / 2 : shape.x;
    const fy = rect ? rect.top : shape.y;
    setFacts(prev => [...prev, { id: factId, x: fx, y: fy, text: getRandomFact() }]);

    // Remove fact after 3.5s
    setTimeout(() => {
      setFacts(prev => prev.filter(f => f.id !== factId));
    }, 3500);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {shapes.map(shape => (
          <motion.div
            key={shape.id}
            data-shape
            className="absolute cursor-pointer pointer-events-auto"
            style={{ left: shape.x, top: shape.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0.3, 0.4],
              scale: 1,
              x: [0, shape.driftX, -shape.driftX * 0.5, shape.driftX * 0.3],
              y: [0, shape.driftY, -shape.driftY * 0.7, shape.driftY * 0.5],
              rotate: [shape.rotation, shape.rotation + 20, shape.rotation - 10, shape.rotation + 15],
            }}
            exit={{ opacity: 0, scale: 1.8, transition: { duration: 0.3 } }}
            transition={{
              opacity: { duration: 3, repeat: Infinity, repeatType: 'reverse' },
              x: { duration: shape.driftDuration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              y: { duration: shape.driftDuration * 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              rotate: { duration: shape.driftDuration * 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              scale: { duration: 0.5, ease: 'backOut' },
            }}
            onClick={(e) => handlePop(shape, e)}
            whileHover={{ scale: 1.2, opacity: 0.7 }}
            whileTap={{ scale: 0.8 }}
          >
            <div
              className="drop-shadow-lg"
              style={{
                color: shape.color,
                fill: shape.color,
                filter: `drop-shadow(0 0 8px ${shape.color}40)`,
              }}
            >
              <ShapeSVG type={shape.type} size={shape.size} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Pop facts */}
      <AnimatePresence>
        {facts.map(fact => (
          <motion.div
            key={fact.id}
            className="fixed pointer-events-none z-50"
            style={{ left: fact.x, top: fact.y }}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="relative -translate-x-1/2 max-w-xs px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white/80 text-sm leading-relaxed text-center shadow-xl"
            >
              {fact.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
