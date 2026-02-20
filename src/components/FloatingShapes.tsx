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
  glow: string;
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

// Richer, more cohesive palette — jewel tones with soft pastels
const SHAPE_PALETTES: { fill: string; glow: string }[] = [
  { fill: '#A78BFA', glow: '#A78BFA' },  // soft violet
  { fill: '#60A5FA', glow: '#60A5FA' },  // sky blue
  { fill: '#F472B6', glow: '#F472B6' },  // pink
  { fill: '#34D399', glow: '#34D399' },  // emerald
  { fill: '#FBBF24', glow: '#FBBF24' },  // amber
  { fill: '#FB923C', glow: '#FB923C' },  // orange
  { fill: '#E879F9', glow: '#E879F9' },  // fuchsia
  { fill: '#38BDF8', glow: '#38BDF8' },  // cyan
  { fill: '#F87171', glow: '#F87171' },  // coral
  { fill: '#A3E635', glow: '#A3E635' },  // lime
];

const SHAPE_TYPES: ShapeType[] = ['hexagon', 'hexagon', 'hexagon', 'diamond', 'triangle', 'star', 'circle'];

let shapeIdCounter = 0;

function randomShape(): FloatingShape {
  const type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
  const w = window.innerWidth;
  const h = window.innerHeight;
  const margin = 40;
  let x: number, y: number;
  if (Math.random() < 0.5) {
    x = Math.random() < 0.5
      ? margin + Math.random() * (w * 0.2)
      : w * 0.8 + Math.random() * (w * 0.2 - margin);
    y = margin + Math.random() * (h - margin * 2);
  } else {
    x = margin + Math.random() * (w - margin * 2);
    y = Math.random() < 0.5
      ? margin + Math.random() * (h * 0.2)
      : h * 0.8 + Math.random() * (h * 0.2 - margin);
  }
  const palette = SHAPE_PALETTES[Math.floor(Math.random() * SHAPE_PALETTES.length)];
  return {
    id: shapeIdCounter++,
    type,
    x,
    y,
    size: 44 + Math.random() * 28,
    rotation: Math.random() * 360,
    color: palette.fill,
    glow: palette.glow,
    driftX: (Math.random() - 0.5) * 40,
    driftY: (Math.random() - 0.5) * 30,
    driftDuration: 6 + Math.random() * 8,
  };
}

// ── Shape SVG paths ──
// Each shape renders inside a viewBox with padding for the hit area

function HexagonShape({ size, color }: { size: number; color: string }) {
  const p = 8; // padding for hit area
  const s = size;
  const r = s / 2;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${p + r + r * Math.cos(angle)},${p + r + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg width={s + p * 2} height={s + p * 2} viewBox={`0 0 ${s + p * 2} ${s + p * 2}`} style={{ cursor: 'pointer' }}>
      <rect x="0" y="0" width={s + p * 2} height={s + p * 2} fill="transparent" />
      <polygon points={points} fill={color} />
    </svg>
  );
}

function DiamondShape({ size, color }: { size: number; color: string }) {
  const p = 8;
  const s = size;
  const h = s / 2;
  return (
    <svg width={s + p * 2} height={s + p * 2} viewBox={`0 0 ${s + p * 2} ${s + p * 2}`} style={{ cursor: 'pointer' }}>
      <rect x="0" y="0" width={s + p * 2} height={s + p * 2} fill="transparent" />
      <polygon points={`${p + h},${p} ${p + s},${p + h} ${p + h},${p + s} ${p},${p + h}`} fill={color} />
    </svg>
  );
}

function TriangleShape({ size, color }: { size: number; color: string }) {
  const p = 8;
  const s = size;
  return (
    <svg width={s + p * 2} height={s + p * 2} viewBox={`0 0 ${s + p * 2} ${s + p * 2}`} style={{ cursor: 'pointer' }}>
      <rect x="0" y="0" width={s + p * 2} height={s + p * 2} fill="transparent" />
      <polygon points={`${p + s / 2},${p} ${p + s},${p + s} ${p},${p + s}`} fill={color} />
    </svg>
  );
}

function StarShape({ size, color }: { size: number; color: string }) {
  const p = 8;
  const s = size;
  const cx = p + s / 2, cy = p + s / 2;
  const outerR = s / 2, innerR = s / 5;
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg width={s + p * 2} height={s + p * 2} viewBox={`0 0 ${s + p * 2} ${s + p * 2}`} style={{ cursor: 'pointer' }}>
      <rect x="0" y="0" width={s + p * 2} height={s + p * 2} fill="transparent" />
      <polygon points={points} fill={color} />
    </svg>
  );
}

function CircleShape({ size, color }: { size: number; color: string }) {
  const p = 8;
  const s = size;
  return (
    <svg width={s + p * 2} height={s + p * 2} viewBox={`0 0 ${s + p * 2} ${s + p * 2}`} style={{ cursor: 'pointer' }}>
      <rect x="0" y="0" width={s + p * 2} height={s + p * 2} fill="transparent" />
      <circle cx={p + s / 2} cy={p + s / 2} r={s / 2} fill={color} />
    </svg>
  );
}

function ShapeSVG({ type, size, color }: { type: ShapeType; size: number; color: string }) {
  switch (type) {
    case 'hexagon': return <HexagonShape size={size} color={color} />;
    case 'diamond': return <DiamondShape size={size} color={color} />;
    case 'triangle': return <TriangleShape size={size} color={color} />;
    case 'star': return <StarShape size={size} color={color} />;
    case 'circle': return <CircleShape size={size} color={color} />;
  }
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

  // Each shape has a distinct musical personality
  switch (type) {
    case 'hexagon': playHexPop(ctx, now); break;
    case 'diamond': playDiamondPop(ctx, now); break;
    case 'triangle': playTrianglePop(ctx, now); break;
    case 'star': playStarPop(ctx, now); break;
    case 'circle': playCirclePop(ctx, now); break;
  }
}

// Hexagon: ascending fifth resolve — two notes, root then fifth, warm and satisfying
function playHexPop(ctx: AudioContext, now: number) {
  const root = 220 + (Math.random() - 0.5) * 20; // ~A3
  const notes = [root, root * 1.5]; // root → fifth
  notes.forEach((f, i) => {
    const t = now + i * 0.12;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.14, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 1.1);
  });
  // Octave bloom on top
  const bloom = ctx.createOscillator();
  bloom.type = 'sine';
  bloom.frequency.setValueAtTime(root * 2, now + 0.24);
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0, now + 0.24);
  bg.gain.linearRampToValueAtTime(0.08, now + 0.28);
  bg.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  bloom.connect(bg); bg.connect(ctx.destination);
  bloom.start(now + 0.24); bloom.stop(now + 1.3);
}

// Diamond: major chord bloom — all three notes of a major chord staggered in
function playDiamondPop(ctx: AudioContext, now: number) {
  const root = 262 + (Math.random() - 0.5) * 20; // ~C4
  const notes = [root, root * 1.25, root * 1.5, root * 2]; // C E G C
  notes.forEach((f, i) => {
    const t = now + i * 0.07;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.11 - i * 0.01, t + 0.025);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.0 - i * 0.05);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 1.1);
  });
}

// Triangle: deep rising resolve — starts low, climbs to a warm landing note
function playTrianglePop(ctx: AudioContext, now: number) {
  const root = 147 + (Math.random() - 0.5) * 15; // ~D3
  const notes = [root, root * 1.335, root * 1.5]; // root, fourth, fifth — classic resolution
  notes.forEach((f, i) => {
    const t = now + i * 0.15;
    const osc = ctx.createOscillator();
    osc.type = i === 2 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(f, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(i === 2 ? 0.16 : 0.12, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + (i === 2 ? 1.2 : 0.6));
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 1.3);
  });
}

// Star: quick ascending arpeggio — 4 notes climbing a major triad + octave
function playStarPop(ctx: AudioContext, now: number) {
  const root = 330 + (Math.random() - 0.5) * 20; // ~E4
  const notes = [root, root * 1.25, root * 1.5, root * 2];
  notes.forEach((f, i) => {
    const t = now + i * 0.09;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.13 - i * 0.015, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9 - i * 0.08);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 1.0);
  });
}

// Circle: rising two-tone chime — like a doorbell or notification
function playCirclePop(ctx: AudioContext, now: number) {
  const root = 294 + (Math.random() - 0.5) * 20; // ~D4
  const notes = [root, root * 1.335]; // fourth interval — ding-dong
  notes.forEach((f, i) => {
    const t = now + i * 0.14;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);
    // Slight shimmer via second detuned osc
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(f * 1.003, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(0.06, t + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    osc.connect(g); g.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    osc.start(t); osc.stop(t + 1.2);
    osc2.start(t); osc2.stop(t + 1.2);
  });
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
    for (let i = 0; i < 12; i++) initial.push(randomShape());
    setShapes(initial);
  }, []);

  // Spawn new shapes to keep count at ~5
  useEffect(() => {
    const interval = setInterval(() => {
      setShapes(prev => {
        if (prev.length < 12) return [...prev, randomShape()];
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePop = useCallback((shape: FloatingShape, e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound(shape.type);

    setShapes(prev => prev.filter(s => s.id !== shape.id));

    const factId = factIdRef.current++;
    const rect = (e.target as HTMLElement).closest('[data-shape]')?.getBoundingClientRect();
    let fx = rect ? rect.left + rect.width / 2 : shape.x;
    let fy = rect ? rect.top : shape.y;
    // Clamp so tooltip stays on screen (tooltip is max-w-xs = 320px, ~60px tall)
    const pad = 20;
    fx = Math.max(170 + pad, Math.min(window.innerWidth - 170 - pad, fx));
    fy = Math.max(80 + pad, Math.min(window.innerHeight - 80 - pad, fy));
    setFacts(prev => [...prev, { id: factId, x: fx, y: fy, text: getRandomFact() }]);

    setTimeout(() => {
      setFacts(prev => prev.filter(f => f.id !== factId));
    }, 3500);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <AnimatePresence>
        {shapes.map(shape => (
          <motion.div
            key={shape.id}
            data-shape
            className="absolute pointer-events-auto"
            style={{ left: shape.x, top: shape.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.55, 0.45, 0.55],
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
            whileHover={{ scale: 1.25, opacity: 0.8 }}
            whileTap={{ scale: 0.85 }}
          >
            <div style={{ filter: `drop-shadow(0 0 12px ${shape.glow}50)` }}>
              <ShapeSVG type={shape.type} size={shape.size} color={shape.color} />
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
            <div className="relative -translate-x-1/2 max-w-xs px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white/80 text-sm leading-relaxed text-center shadow-xl">
              {fact.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
