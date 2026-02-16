export type SoundMode = 'ethereal' | 'piano' | 'ocean' | '8bit' | 'crystal' | 'jazz' | 'fire' | 'love';

export const MODES: { id: SoundMode; label: string; dot: string }[] = [
  { id: 'ethereal', label: 'Ethereal', dot: '#BB8FCE' },
  { id: 'piano', label: 'Piano', dot: '#F7DC6F' },
  { id: 'ocean', label: 'Ocean', dot: '#45B7D1' },
  { id: '8bit', label: '8-Bit', dot: '#39FF14' },
  { id: 'crystal', label: 'Crystal', dot: '#E0E7FF' },
  { id: 'jazz', label: 'Jazz', dot: '#E59866' },
  { id: 'fire', label: 'Fire', dot: '#FF4500' },
  { id: 'love', label: 'Love', dot: '#FF69B4' },
];

// ── Scales ──

const SCALES: Record<SoundMode, number[]> = {
  // Pentatonic C,D,E,G,A across octaves 2-6
  ethereal: [
    130.81,146.83,164.81,196.0,220.0,
    261.63,293.66,329.63,392.0,440.0,
    523.25,587.33,659.25,783.99,880.0,
    1046.5,1174.66,1318.51,1567.98,1760.0,
    65.41,73.42,82.41,98.0,110.0,
    523.25,
  ],
  // C major across 2 octaves (C,D,E,F,G,A,B) — 14 notes, cycle for 26
  piano: [
    261.63,293.66,329.63,349.23,392.0,440.0,493.88,
    523.25,587.33,659.25,698.46,783.99,880.0,987.77,
    261.63,293.66,329.63,349.23,392.0,440.0,493.88,
    523.25,587.33,659.25,698.46,783.99,
  ],
  // Whole tone: C,D,E,F#,G#,A# across octaves
  ocean: [
    130.81,146.83,164.81,185.0,207.65,233.08,
    261.63,293.66,329.63,369.99,415.3,466.16,
    523.25,587.33,659.25,739.99,830.61,932.33,
    1046.5,1174.66,1318.51,1479.98,1661.22,1864.66,
    261.63,293.66,
  ],
  // Pentatonic one octave higher than ethereal
  '8bit': [
    523.25,587.33,659.25,783.99,880.0,
    1046.5,1174.66,1318.51,1567.98,1760.0,
    2093.0,2349.32,2637.02,3135.96,3520.0,
    523.25,587.33,659.25,783.99,880.0,
    1046.5,1174.66,1318.51,1567.98,1760.0,
    2093.0,
  ],
  // Major pentatonic C5-C7
  crystal: [
    523.25,587.33,659.25,783.99,880.0,
    1046.5,1174.66,1318.51,1567.98,1760.0,
    2093.0,2349.32,2637.02,3135.96,3520.0,
    523.25,659.25,783.99,1046.5,1318.51,
    1567.98,2093.0,2637.02,3135.96,880.0,
    1760.0,
  ],
  // Minor pentatonic: C,Eb,F,G,Bb
  jazz: [
    130.81,155.56,174.61,196.0,233.08,
    261.63,311.13,349.23,392.0,466.16,
    523.25,622.25,698.46,783.99,932.33,
    1046.5,1244.51,1396.91,1567.98,1864.66,
    261.63,311.13,349.23,392.0,466.16,
    523.25,
  ],
  // Phrygian dominant: C,Db,E,F,G,Ab,Bb — flamenco/Spanish gypsy
  fire: [
    261.63,277.18,329.63,349.23,392.0,415.3,466.16,
    523.25,554.37,659.25,698.46,783.99,830.61,932.33,
    1046.5,1108.73,1318.51,1396.91,1567.98,1661.22,1864.66,
    261.63,329.63,392.0,523.25,659.25,
  ],
  // Lydian: C,D,E,F#,G,A,B — dreamy, floating, magical
  love: [
    261.63,293.66,329.63,369.99,392.0,440.0,493.88,
    523.25,587.33,659.25,739.99,783.99,880.0,987.77,
    261.63,293.66,329.63,369.99,392.0,440.0,493.88,
    523.25,587.33,659.25,739.99,783.99,
  ],
};

// ── Color palettes per mode ──

const MODE_COLORS: Record<SoundMode, string[]> = {
  ethereal: [
    '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F',
    '#BB8FCE','#85C1E9','#F8C471','#82E0AA','#F1948A','#85929E','#F0B27A','#AED6F1',
    '#A3E4D7','#E59866','#C39BD3','#7FB3D8','#F9E79F','#A2D9CE','#D7BDE2','#F5B7B1',
    '#AEB6BF','#A9DFBF',
  ],
  piano: [
    '#FFF8E1','#FFE0B2','#FFCC80','#FFB74D','#FFA726','#FF9800','#FB8C00','#F57C00',
    '#EF6C00','#E65100','#FFF3E0','#FFE0B2','#FFCC80','#FFB74D','#FFA726','#FF9800',
    '#FFFDE7','#FFF9C4','#FFF176','#FFEE58','#FFEB3B','#FDD835','#F9A825','#F57F17',
    '#FFD54F','#FFE082',
  ],
  ocean: [
    '#E0F7FA','#B2EBF2','#80DEEA','#4DD0E1','#26C6DA','#00BCD4','#00ACC1','#0097A7',
    '#00838F','#006064','#E0F2F1','#B2DFDB','#80CBC4','#4DB6AC','#26A69A','#009688',
    '#00897B','#00796B','#004D40','#1DE9B6','#64FFDA','#A7FFEB','#84FFFF','#18FFFF',
    '#00E5FF','#00B8D4',
  ],
  '8bit': [
    '#FF00FF','#00FFFF','#39FF14','#FFFF00','#FF6EC7','#00FF00','#FF4500','#7DF9FF',
    '#FF1493','#ADFF2F','#FF69B4','#00CED1','#FFD700','#FF00FF','#00FF7F','#FF6347',
    '#E0FF00','#FF3F8E','#00BFFF','#FF4444','#77FF00','#FF9F00','#4DEEEA','#F000FF',
    '#74EE15','#FFE700',
  ],
  crystal: [
    '#E8EAF6','#C5CAE9','#9FA8DA','#7986CB','#5C6BC0','#E0E7FF','#C7D2FE','#A5B4FC',
    '#818CF8','#6366F1','#F0F4FF','#DBEAFE','#BFDBFE','#93C5FD','#60A5FA','#E0E7FF',
    '#F5F3FF','#EDE9FE','#DDD6FE','#C4B5FD','#A78BFA','#8B5CF6','#7C3AED','#6D28D9',
    '#D1D5DB','#E5E7EB',
  ],
  jazz: [
    '#D4A574','#C68642','#8B6914','#A0522D','#CD853F','#DEB887','#D2691E','#8B4513',
    '#A67B5B','#6F4E37','#C4A882','#B8860B','#DAA520','#BC8F8F','#F4A460','#E8D5B7',
    '#9B7653','#7B5B3A','#C9B99A','#A08060','#D2B48C','#C19A6B','#E6BE8A','#996515',
    '#BDB76B','#C8AD7F',
  ],
  fire: [
    '#FF0000','#FF4500','#FF6B00','#FF8C00','#FFA500','#FFD700','#FF4500','#FF0000',
    '#FF6347','#FF7F50','#FF8C00','#FFB347','#FF4500','#FF0000','#FF6B00','#FFA500',
    '#FFCC00','#FF3300','#FF5722','#FF6E40','#FF9100','#FFD740','#FF1744','#FF3D00',
    '#FFAB00','#FFE0B2',
  ],
  love: [
    '#FF69B4','#FF1493','#FFB6C1','#FFC0CB','#FF85A2','#E91E63','#F48FB1','#F06292',
    '#EC407A','#D81B60','#FCE4EC','#F8BBD0','#F48FB1','#F06292','#FF80AB','#FF4081',
    '#FFB3D9','#FF69B4','#E91E63','#C2185B','#FF8A80','#FF5252','#FF1744','#F50057',
    '#FF80AB','#FFD1DC',
  ],
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

type OscType = OscillatorType;

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function createReverbImpulse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

export interface PlaybackCallbacks {
  onLetterStart: (index: number, letter: string) => void;
  onComplete: () => void;
}

export function getLetterColor(letter: string, mode: SoundMode = 'ethereal'): string {
  const idx = letter.toLowerCase().charCodeAt(0) - 97;
  if (idx < 0 || idx > 25) return '#ffffff';
  return MODE_COLORS[mode][idx];
}

// ── Per-mode synth logic ──

function playEthereal(ctx: AudioContext, masterGain: GainNode, letters: string[], onsetInterval: number, now: number, callbacks: PlaybackCallbacks) {
  // Reverb + delay
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 2, 3);
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.7;
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.3;
  const delay = ctx.createDelay(1); delay.delayTime.value = 0.15;
  const delayFb = ctx.createGain(); delayFb.gain.value = 0.2;
  const delayWet = ctx.createGain(); delayWet.gain.value = 0.15;
  masterGain.connect(dryGain); masterGain.connect(convolver); convolver.connect(wetGain);
  masterGain.connect(delay); delay.connect(delayFb); delayFb.connect(delay); delay.connect(delayWet);
  dryGain.connect(ctx.destination); wetGain.connect(ctx.destination); delayWet.connect(ctx.destination);

  const scale = SCALES.ethereal;
  letters.forEach((letter, i) => {
    const idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) return;
    const freq = scale[idx];
    const isVowel = VOWELS.has(letter);
    const startTime = now + i * onsetInterval;
    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, (startTime - ctx.currentTime) * 1000));

    const type: OscType = isVowel ? 'sine' : (['triangle','triangle','sawtooth','square'] as OscType[])[idx % 4];
    const attack = isVowel ? 0.05 : 0.005;
    const decay = isVowel ? 0.15 : 0.08;
    const sustain = isVowel ? 0.6 : 0.2;
    const release = isVowel ? 0.2 : 0.08;
    const noteDur = isVowel ? onsetInterval * 1.5 : onsetInterval * 0.9;
    const peak = isVowel ? 0.8 : 0.5;

    const osc = ctx.createOscillator(); osc.type = type;
    osc.frequency.value = (type === 'sawtooth' || type === 'square') ? freq * 0.995 : freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(peak, startTime + attack);
    g.gain.linearRampToValueAtTime(peak * sustain, startTime + attack + decay);
    g.gain.setValueAtTime(peak * sustain, startTime + noteDur - release);
    g.gain.linearRampToValueAtTime(0, startTime + noteDur);
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = isVowel ? 2000 : 3000; filt.Q.value = 0.5;
    osc.connect(filt); filt.connect(g); g.connect(masterGain);
    osc.start(startTime); osc.stop(startTime + noteDur + 0.1);

    if (isVowel) {
      const h = ctx.createOscillator(); h.type = 'sine'; h.frequency.value = freq * 2;
      const hg = ctx.createGain();
      hg.gain.setValueAtTime(0, startTime);
      hg.gain.linearRampToValueAtTime(peak * 0.15, startTime + attack * 1.5);
      hg.gain.linearRampToValueAtTime(0, startTime + noteDur);
      h.connect(hg); hg.connect(masterGain); h.start(startTime); h.stop(startTime + noteDur + 0.1);
    }
  });
}

function playPiano(ctx: AudioContext, masterGain: GainNode, letters: string[], onsetInterval: number, now: number, callbacks: PlaybackCallbacks) {
  // Light reverb for room feel
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 1.5, 4);
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.8;
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.2;
  masterGain.connect(dryGain); masterGain.connect(convolver); convolver.connect(wetGain);
  dryGain.connect(ctx.destination); wetGain.connect(ctx.destination);

  const scale = SCALES.piano;
  letters.forEach((letter, i) => {
    const idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) return;
    const freq = scale[idx];
    const startTime = now + i * onsetInterval;
    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, (startTime - ctx.currentTime) * 1000));

    const noteDur = onsetInterval * 1.2;
    // Piano: fundamental + harmonics
    [1, 2, 3].forEach((harmonic) => {
      const osc = ctx.createOscillator(); osc.type = 'sine';
      osc.frequency.value = freq * harmonic;
      const g = ctx.createGain();
      const vol = harmonic === 1 ? 0.7 : harmonic === 2 ? 0.2 : 0.08;
      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(vol, startTime + 0.005); // sharp attack
      g.gain.exponentialRampToValueAtTime(vol * 0.3, startTime + 0.8); // moderate decay
      g.gain.exponentialRampToValueAtTime(0.001, startTime + noteDur + 1.5); // long release
      osc.connect(g); g.connect(masterGain);
      osc.start(startTime); osc.stop(startTime + noteDur + 1.6);
    });
  });
}

function playOcean(ctx: AudioContext, masterGain: GainNode, letters: string[], onsetInterval: number, now: number, callbacks: PlaybackCallbacks) {
  // Heavy reverb — oceanic space
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 3, 2);
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.5;
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.5;
  masterGain.connect(dryGain); masterGain.connect(convolver); convolver.connect(wetGain);
  dryGain.connect(ctx.destination); wetGain.connect(ctx.destination);

  const scale = SCALES.ocean;
  letters.forEach((letter, i) => {
    const idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) return;
    const freq = scale[idx];
    const startTime = now + i * onsetInterval;
    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, (startTime - ctx.currentTime) * 1000));

    // Legato — notes are longer, overlap significantly
    const noteDur = onsetInterval * 2.5;

    // Main tone: slow fade-in sine
    const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.6, startTime + 0.1); // slow attack
    g.gain.linearRampToValueAtTime(0.3, startTime + noteDur * 0.6);
    g.gain.linearRampToValueAtTime(0, startTime + noteDur); // long release
    osc.connect(g); g.connect(masterGain);
    osc.start(startTime); osc.stop(startTime + noteDur + 0.1);

    // Filtered noise wash
    const bufferSize = ctx.sampleRate * noteDur;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) noiseData[j] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = noiseBuffer;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 5;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0, startTime);
    ng.gain.linearRampToValueAtTime(0.08, startTime + 0.15);
    ng.gain.linearRampToValueAtTime(0, startTime + noteDur);
    noise.connect(bp); bp.connect(ng); ng.connect(masterGain);
    noise.start(startTime); noise.stop(startTime + noteDur + 0.1);
  });
}

function play8Bit(ctx: AudioContext, masterGain: GainNode, letters: string[], onsetInterval: number, now: number, callbacks: PlaybackCallbacks) {
  // Minimal reverb — dry and punchy
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.95;
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 0.3, 8);
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.05;
  masterGain.connect(dryGain); masterGain.connect(convolver); convolver.connect(wetGain);
  dryGain.connect(ctx.destination); wetGain.connect(ctx.destination);

  const scale = SCALES['8bit'];
  letters.forEach((letter, i) => {
    const idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) return;
    const freq = scale[idx];
    const startTime = now + i * onsetInterval;
    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, (startTime - ctx.currentTime) * 1000));

    const noteDur = onsetInterval * 0.7; // tight and snappy
    const osc = ctx.createOscillator(); osc.type = 'square'; osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.5, startTime + 0.001); // instant attack
    g.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    g.gain.linearRampToValueAtTime(0, startTime + noteDur);
    // Low-pass to avoid harsh high-frequency square artifacts
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 4000; filt.Q.value = 0.7;
    osc.connect(filt); filt.connect(g); g.connect(masterGain);
    osc.start(startTime); osc.stop(startTime + noteDur + 0.05);
  });
}

function playCrystal(ctx: AudioContext, masterGain: GainNode, letters: string[], onsetInterval: number, now: number, callbacks: PlaybackCallbacks) {
  // Heavy reverb — shimmery space
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 3, 2.5);
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.4;
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.6;
  // Chorus via short delay with modulation
  const chorusDelay = ctx.createDelay(0.1); chorusDelay.delayTime.value = 0.015;
  const chorusGain = ctx.createGain(); chorusGain.gain.value = 0.3;
  masterGain.connect(dryGain); masterGain.connect(convolver); convolver.connect(wetGain);
  masterGain.connect(chorusDelay); chorusDelay.connect(chorusGain);
  dryGain.connect(ctx.destination); wetGain.connect(ctx.destination); chorusGain.connect(ctx.destination);

  const scale = SCALES.crystal;
  letters.forEach((letter, i) => {
    const idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) return;
    const freq = scale[idx];
    const startTime = now + i * onsetInterval;
    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, (startTime - ctx.currentTime) * 1000));

    const noteDur = onsetInterval * 0.8;
    // Quick sine/triangle tap
    const type: OscType = idx % 2 === 0 ? 'sine' : 'triangle';
    const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.6, startTime + 0.002); // very short attack
    g.gain.exponentialRampToValueAtTime(0.15, startTime + 0.1); // quick decay
    g.gain.exponentialRampToValueAtTime(0.001, startTime + noteDur + 1.0); // long release — reverb does the rest
    osc.connect(g); g.connect(masterGain);
    osc.start(startTime); osc.stop(startTime + noteDur + 1.1);
  });
}

function playJazz(ctx: AudioContext, masterGain: GainNode, letters: string[], onsetInterval: number, now: number, callbacks: PlaybackCallbacks) {
  // Warm room reverb
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 2, 3.5);
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.65;
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.35;
  masterGain.connect(dryGain); masterGain.connect(convolver); convolver.connect(wetGain);
  dryGain.connect(ctx.destination); wetGain.connect(ctx.destination);

  const scale = SCALES.jazz;
  letters.forEach((letter, i) => {
    const idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) return;
    const freq = scale[idx];

    // Swing timing: odd notes get 60% of slot, even notes get 40%
    let startTime: number;
    if (i === 0) {
      startTime = now;
    } else {
      const pairIndex = Math.floor(i / 2);
      const isSecondInPair = i % 2 === 1;
      startTime = now + pairIndex * (onsetInterval * 2) + (isSecondInPair ? onsetInterval * 1.2 : 0);
    }

    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, (startTime - ctx.currentTime) * 1000));

    const noteDur = onsetInterval * 1.4;
    // Soft sawtooth with low-pass
    const osc = ctx.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = freq;
    // Subtle vibrato
    const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 5;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = freq * 0.008;
    lfo.connect(lfoGain); lfoGain.connect(osc.frequency);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.5, startTime + 0.02); // medium attack
    g.gain.linearRampToValueAtTime(0.35, startTime + noteDur * 0.5);
    g.gain.linearRampToValueAtTime(0, startTime + noteDur);
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 1200; filt.Q.value = 1;
    osc.connect(filt); filt.connect(g); g.connect(masterGain);
    osc.start(startTime); osc.stop(startTime + noteDur + 0.1);
    lfo.start(startTime); lfo.stop(startTime + noteDur + 0.1);
  });
}

function playFire(ctx: AudioContext, masterGain: GainNode, letters: string[], onsetInterval: number, now: number, callbacks: PlaybackCallbacks) {
  // Warm reverb — medium room
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 1.5, 3);
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.7;
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.3;
  masterGain.connect(dryGain); masterGain.connect(convolver); convolver.connect(wetGain);
  dryGain.connect(ctx.destination); wetGain.connect(ctx.destination);

  const scale = SCALES.fire;
  letters.forEach((letter, i) => {
    const idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) return;
    const freq = scale[idx];
    const startTime = now + i * onsetInterval;
    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, (startTime - ctx.currentTime) * 1000));

    const noteDur = onsetInterval * 1.2;

    // Triangle wave — naturally warm without any distortion
    const osc = ctx.createOscillator(); osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 1.02, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.06);

    // Second voice a fifth above, quieter — adds richness like harmonics in a flame
    const osc2 = ctx.createOscillator(); osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, startTime);
    osc2.frequency.exponentialRampToValueAtTime(freq * 1.498, startTime + noteDur);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, startTime);
    g2.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.01, startTime + noteDur * 0.5);

    // Gentle lowpass — warm, no resonance
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.Q.value = 0.7;
    filt.frequency.setValueAtTime(2500, startTime);
    filt.frequency.exponentialRampToValueAtTime(800, startTime + noteDur * 0.7);

    // Smooth envelope
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.55, startTime + 0.015);
    g.gain.linearRampToValueAtTime(0.35, startTime + noteDur * 0.4);
    g.gain.exponentialRampToValueAtTime(0.01, startTime + noteDur);

    osc.connect(filt); filt.connect(g); g.connect(masterGain);
    osc2.connect(g2); g2.connect(filt);
    osc.start(startTime); osc.stop(startTime + noteDur + 0.1);
    osc2.start(startTime); osc2.stop(startTime + noteDur + 0.1);

    // Sub-octave for warmth and weight
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = freq * 0.5;
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0, startTime);
    subGain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
    subGain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDur * 0.7);
    sub.connect(subGain); subGain.connect(masterGain);
    sub.start(startTime); sub.stop(startTime + noteDur + 0.1);

    // Soft ember crackle
    const crackleLen = 0.06;
    const crackleBuffer = ctx.createBuffer(1, ctx.sampleRate * crackleLen, ctx.sampleRate);
    const crackleData = crackleBuffer.getChannelData(0);
    for (let j = 0; j < crackleData.length; j++) crackleData[j] = Math.random() * 2 - 1;
    const crackle = ctx.createBufferSource(); crackle.buffer = crackleBuffer;
    const crackleBp = ctx.createBiquadFilter(); crackleBp.type = 'bandpass'; crackleBp.frequency.value = 600; crackleBp.Q.value = 0.8;
    const crackleGain = ctx.createGain();
    crackleGain.gain.setValueAtTime(0.06, startTime);
    crackleGain.gain.exponentialRampToValueAtTime(0.001, startTime + crackleLen);
    crackle.connect(crackleBp); crackleBp.connect(crackleGain); crackleGain.connect(masterGain);
    crackle.start(startTime); crackle.stop(startTime + crackleLen + 0.01);
  });
}

function playLove(ctx: AudioContext, masterGain: GainNode, letters: string[], onsetInterval: number, now: number, callbacks: PlaybackCallbacks) {
  // Warm medium-large reverb with echo trails
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 2.5, 2.5);
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.5;
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.5;
  // Echo delay with high feedback for trailing echoes
  const delay = ctx.createDelay(1); delay.delayTime.value = 0.25;
  const delayFb = ctx.createGain(); delayFb.gain.value = 0.35;
  const delayWet = ctx.createGain(); delayWet.gain.value = 0.2;
  masterGain.connect(dryGain); masterGain.connect(convolver); convolver.connect(wetGain);
  masterGain.connect(delay); delay.connect(delayFb); delayFb.connect(delay); delay.connect(delayWet);
  dryGain.connect(ctx.destination); wetGain.connect(ctx.destination); delayWet.connect(ctx.destination);

  const scale = SCALES.love;
  letters.forEach((letter, i) => {
    const idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) return;
    const freq = scale[idx];
    const startTime = now + i * onsetInterval;
    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, (startTime - ctx.currentTime) * 1000));

    // Legato — long, overlapping, breathing
    const noteDur = onsetInterval * 2.0;

    // Two slightly detuned sines for natural chorus shimmer
    [-3, 3].forEach((detuneCents) => {
      const osc = ctx.createOscillator(); osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detuneCents;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(0.4, startTime + 0.08); // slow gentle attack
      g.gain.linearRampToValueAtTime(0.3, startTime + noteDur * 0.5);
      g.gain.linearRampToValueAtTime(0, startTime + noteDur); // very long release
      osc.connect(g); g.connect(masterGain);
      osc.start(startTime); osc.stop(startTime + noteDur + 0.1);
    });

    // Subtle octave-up harmonic for sparkle
    const harmonic = ctx.createOscillator(); harmonic.type = 'sine'; harmonic.frequency.value = freq * 2;
    const hg = ctx.createGain();
    hg.gain.setValueAtTime(0, startTime);
    hg.gain.linearRampToValueAtTime(0.08, startTime + 0.12);
    hg.gain.linearRampToValueAtTime(0, startTime + noteDur * 0.8);
    harmonic.connect(hg); hg.connect(masterGain);
    harmonic.start(startTime); harmonic.stop(startTime + noteDur + 0.1);
  });
}

export function playName(name: string, mode: SoundMode, callbacks: PlaybackCallbacks): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  if (letters.length === 0) return;

  const totalDuration = Math.min(3, Math.max(1, letters.length * 0.2));
  const onsetInterval = totalDuration / letters.length;

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.3;

  const now = ctx.currentTime + 0.05;

  const modePlayer: Record<SoundMode, () => void> = {
    ethereal: () => playEthereal(ctx, masterGain, letters, onsetInterval, now, callbacks),
    piano: () => playPiano(ctx, masterGain, letters, onsetInterval, now, callbacks),
    ocean: () => playOcean(ctx, masterGain, letters, onsetInterval, now, callbacks),
    '8bit': () => play8Bit(ctx, masterGain, letters, onsetInterval, now, callbacks),
    crystal: () => playCrystal(ctx, masterGain, letters, onsetInterval, now, callbacks),
    jazz: () => playJazz(ctx, masterGain, letters, onsetInterval, now, callbacks),
    fire: () => playFire(ctx, masterGain, letters, onsetInterval, now, callbacks),
    love: () => playLove(ctx, masterGain, letters, onsetInterval, now, callbacks),
  };

  modePlayer[mode]();

  const tailDuration = mode === 'ocean' ? 1.5 : mode === 'crystal' ? 1.2 : mode === 'love' ? 1.5 : mode === 'fire' ? 0.6 : 0.8;
  const totalTime = totalDuration + tailDuration;
  const msUntilComplete = (now + totalTime - ctx.currentTime) * 1000;
  setTimeout(() => callbacks.onComplete(), Math.max(0, msUntilComplete));
}
