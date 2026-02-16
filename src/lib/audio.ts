// Pentatonic scale notes (C, D, E, G, A) across octaves
// These can't sound bad together — any combination is pleasant
const PENTATONIC_NOTES: number[] = [
  // Octave 3
  130.81, // C3
  146.83, // D3
  164.81, // E3
  196.0,  // G3
  220.0,  // A3
  // Octave 4
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.0,  // G4
  440.0,  // A4
  // Octave 5
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.0,  // A5
  // Octave 6 (partial — only need 11 more to reach 26)
  1046.5, // C6
  1174.66,// D6
  1318.51,// E6
  1567.98,// G6
  1760.0, // A6
  // Octave 2 (lower register for depth)
  65.41,  // C2
  73.42,  // D2
  82.41,  // E2
  98.0,   // G2
  110.0,  // A2
  // One more
  523.25, // C5 repeat
];

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

type OscType = OscillatorType;

interface LetterSound {
  frequency: number;
  type: OscType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  isVowel: boolean;
}

// Deterministic mapping: letter index -> sound properties
function getLetterSound(letter: string): LetterSound {
  const idx = letter.toLowerCase().charCodeAt(0) - 97;
  if (idx < 0 || idx > 25) {
    return { frequency: 440, type: 'sine', attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1, isVowel: false };
  }

  const frequency = PENTATONIC_NOTES[idx];
  const isVowel = VOWELS.has(letter.toLowerCase());

  // Vowels: warm sine waves, longer envelope
  // Consonants: varied timbres, shorter and more percussive
  let type: OscType;
  let attack: number;
  let decay: number;
  let sustain: number;
  let release: number;

  if (isVowel) {
    type = 'sine';
    attack = 0.05;
    decay = 0.15;
    sustain = 0.6;
    release = 0.2;
  } else {
    // Cycle through timbres for consonants
    const consonantTimbres: OscType[] = ['triangle', 'triangle', 'sawtooth', 'square'];
    type = consonantTimbres[idx % consonantTimbres.length];
    attack = 0.005;
    decay = 0.08;
    sustain = 0.2;
    release = 0.08;
  }

  return { frequency, type, attack, decay, sustain, release, isVowel };
}

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

// Create reverb impulse response
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

export function playName(name: string, callbacks: PlaybackCallbacks): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  if (letters.length === 0) return;

  // Target total duration: 1-3 seconds based on name length
  // Short names (1-3 letters): ~1s, long names (10+): ~3s
  const totalDuration = Math.min(3, Math.max(1, letters.length * 0.2));
  const onsetInterval = totalDuration / letters.length;

  // Master gain
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.3;

  // Reverb
  const convolver = ctx.createConvolver();
  convolver.buffer = createReverbImpulse(ctx, 2, 3);

  // Dry/wet mix
  const dryGain = ctx.createGain();
  dryGain.gain.value = 0.7;
  const wetGain = ctx.createGain();
  wetGain.gain.value = 0.3;

  // Delay for depth
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.15;
  const delayFeedback = ctx.createGain();
  delayFeedback.gain.value = 0.2;
  const delayWet = ctx.createGain();
  delayWet.gain.value = 0.15;

  // Routing: master -> dry + reverb + delay -> destination
  masterGain.connect(dryGain);
  masterGain.connect(convolver);
  convolver.connect(wetGain);
  masterGain.connect(delay);
  delay.connect(delayFeedback);
  delayFeedback.connect(delay);
  delay.connect(delayWet);

  dryGain.connect(ctx.destination);
  wetGain.connect(ctx.destination);
  delayWet.connect(ctx.destination);

  const now = ctx.currentTime + 0.05;

  letters.forEach((letter, i) => {
    const sound = getLetterSound(letter);
    const startTime = now + i * onsetInterval;

    // Schedule the visual callback
    const msUntilStart = (startTime - ctx.currentTime) * 1000;
    setTimeout(() => callbacks.onLetterStart(i, letter), Math.max(0, msUntilStart));

    // Main oscillator
    const osc = ctx.createOscillator();
    osc.type = sound.type;
    osc.frequency.value = sound.frequency;

    // For sawtooth/square, soften with lower volume and slight detune
    if (sound.type === 'sawtooth' || sound.type === 'square') {
      osc.frequency.value = sound.frequency * 0.995; // slight detune for warmth
    }

    // Gain envelope (ADSR)
    const noteGain = ctx.createGain();
    const noteDuration = sound.isVowel ? onsetInterval * 1.5 : onsetInterval * 0.9;
    const peakGain = sound.isVowel ? 0.8 : 0.5;

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(peakGain, startTime + sound.attack);
    noteGain.gain.linearRampToValueAtTime(peakGain * sound.sustain, startTime + sound.attack + sound.decay);
    noteGain.gain.setValueAtTime(peakGain * sound.sustain, startTime + noteDuration - sound.release);
    noteGain.gain.linearRampToValueAtTime(0, startTime + noteDuration);

    // Low-pass filter to soften harsh timbres
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = sound.isVowel ? 2000 : 3000;
    filter.Q.value = 0.5;

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + noteDuration + 0.1);

    // Add a subtle harmonic for vowels (octave above, very quiet)
    if (sound.isVowel) {
      const harmonic = ctx.createOscillator();
      harmonic.type = 'sine';
      harmonic.frequency.value = sound.frequency * 2;
      const harmonicGain = ctx.createGain();
      harmonicGain.gain.setValueAtTime(0, startTime);
      harmonicGain.gain.linearRampToValueAtTime(peakGain * 0.15, startTime + sound.attack * 1.5);
      harmonicGain.gain.linearRampToValueAtTime(0, startTime + noteDuration);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(masterGain);
      harmonic.start(startTime);
      harmonic.stop(startTime + noteDuration + 0.1);
    }
  });

  // Schedule completion callback
  const totalTime = letters.length * onsetInterval + 0.8; // extra for reverb tail
  const msUntilComplete = (now + totalTime - ctx.currentTime) * 1000;
  setTimeout(() => callbacks.onComplete(), Math.max(0, msUntilComplete));
}

// Letter -> color mapping (curated palette that looks good on dark bg)
const LETTER_COLORS: string[] = [
  '#FF6B6B', // a - warm red
  '#4ECDC4', // b - teal
  '#45B7D1', // c - sky blue
  '#96CEB4', // d - sage
  '#FFEAA7', // e - warm yellow
  '#DDA0DD', // f - plum
  '#98D8C8', // g - mint
  '#F7DC6F', // h - gold
  '#BB8FCE', // i - lavender
  '#85C1E9', // j - light blue
  '#F8C471', // k - peach
  '#82E0AA', // l - green
  '#F1948A', // m - salmon
  '#85929E', // n - steel
  '#F0B27A', // o - amber
  '#AED6F1', // p - powder blue
  '#A3E4D7', // q - aqua
  '#E59866', // r - terra cotta
  '#C39BD3', // s - orchid
  '#7FB3D8', // t - cornflower
  '#F9E79F', // u - cream gold
  '#A2D9CE', // v - seafoam
  '#D7BDE2', // w - wisteria
  '#F5B7B1', // x - rose
  '#AEB6BF', // y - silver
  '#A9DFBF', // z - jade
];

export function getLetterColor(letter: string): string {
  const idx = letter.toLowerCase().charCodeAt(0) - 97;
  if (idx < 0 || idx > 25) return '#ffffff';
  return LETTER_COLORS[idx];
}
