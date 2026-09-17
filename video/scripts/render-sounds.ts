// Renders the site's synthesized UI sounds (src/lib/sounds.ts) to WAV files so
// Remotion can place them on the timeline. The patch is sines and squares
// with simple envelopes, so it is reproduced here directly instead of running
// Web Audio headlessly. Output: public/sounds/<name>.wav
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Layer = {
  type: "sine" | "square";
  frequency: number | { start: number; end: number };
  envelope: { attack: number; decay: number; sustain: number; release: number };
  gain: number;
  delay?: number;
};

const SOUNDS: Record<string, Layer[]> = {
  hover: [
    {
      type: "sine",
      frequency: 1300,
      envelope: { attack: 0, decay: 0.01, sustain: 0, release: 0.004 },
      gain: 0.01,
    },
  ],
  tick: [
    {
      type: "sine",
      frequency: 1200,
      envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.004 },
      gain: 0.08,
    },
  ],
  pop: [
    {
      type: "sine",
      frequency: { start: 400, end: 200 },
      envelope: { attack: 0, decay: 0.04, sustain: 0, release: 0.012 },
      gain: 0.1,
    },
  ],
  success: [
    { type: "square", frequency: 523, envelope: { attack: 0, decay: 0.06, sustain: 0, release: 0.02 }, gain: 0.06 },
    { type: "square", frequency: 659, envelope: { attack: 0, decay: 0.06, sustain: 0, release: 0.02 }, gain: 0.05, delay: 0.06 },
    { type: "square", frequency: 784, envelope: { attack: 0, decay: 0.06, sustain: 0, release: 0.02 }, gain: 0.045, delay: 0.12 },
    { type: "square", frequency: 1047, envelope: { attack: 0, decay: 0.08, sustain: 0, release: 0.025 }, gain: 0.04, delay: 0.18 },
  ],
  // A stutter of low square blips under the wordmark's Redaction glitch.
  glitch: [
    { type: "square", frequency: 220, envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.004 }, gain: 0.05 },
    { type: "square", frequency: 165, envelope: { attack: 0, decay: 0.01, sustain: 0, release: 0.004 }, gain: 0.04, delay: 0.035 },
    { type: "square", frequency: 260, envelope: { attack: 0, decay: 0.008, sustain: 0, release: 0.004 }, gain: 0.035, delay: 0.07 },
    { type: "square", frequency: 140, envelope: { attack: 0, decay: 0.014, sustain: 0, release: 0.005 }, gain: 0.04, delay: 0.11 },
    { type: "square", frequency: 196, envelope: { attack: 0, decay: 0.008, sustain: 0, release: 0.004 }, gain: 0.03, delay: 0.16 },
  ],
  toggle: [
    { type: "sine", frequency: 880, envelope: { attack: 0, decay: 0.02, sustain: 0, release: 0.006 }, gain: 0.08 },
    { type: "sine", frequency: 1320, envelope: { attack: 0, decay: 0.02, sustain: 0, release: 0.006 }, gain: 0.07, delay: 0.03 },
  ],
};

const RATE = 44100;
// Short, percussive sounds get a little silence so the file never ends on a
// non-zero sample.
const TAIL = 0.02;

function envelope(t: number, e: Layer["envelope"]) {
  if (t < 0) return 0;
  if (t < e.attack) return t / e.attack;
  t -= e.attack;
  if (t < e.decay) return 1 - (1 - e.sustain) * (t / e.decay);
  t -= e.decay;
  if (t < e.release) return e.sustain * (1 - t / e.release);
  return 0;
}

function render(layers: Layer[]) {
  const length = Math.max(
    ...layers.map(
      (l) => (l.delay ?? 0) + l.envelope.attack + l.envelope.decay + l.envelope.release
    )
  );
  const samples = new Float32Array(Math.ceil((length + TAIL) * RATE));
  for (const layer of layers) {
    const start = layer.delay ?? 0;
    const duration = layer.envelope.attack + layer.envelope.decay + layer.envelope.release;
    let phase = 0;
    for (let i = 0; i < samples.length; i++) {
      const t = i / RATE - start;
      if (t < 0) continue;
      const freq =
        typeof layer.frequency === "number"
          ? layer.frequency
          : layer.frequency.start +
            (layer.frequency.end - layer.frequency.start) * Math.min(1, t / duration);
      phase += (2 * Math.PI * freq) / RATE;
      const wave = layer.type === "sine" ? Math.sin(phase) : Math.sign(Math.sin(phase));
      samples[i] += wave * envelope(t, layer.envelope) * layer.gain;
    }
  }
  return samples;
}

// The patch's gains are tuned for a quiet UI; in a video that is inaudible.
// Normalise every file to the same peak and set relative levels in Remotion.
function normalise(samples: Float32Array) {
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  if (peak === 0) return samples;
  const k = 0.9 / peak;
  return samples.map((s) => s * k);
}

function toWav(samples: Float32Array) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(RATE, 24);
  buffer.writeUInt32LE(RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buffer;
}

// Room tone: a few seconds of low, filtered noise that loops cleanly. Its
// level is set in Remotion; here it is only shaped.
function renderRoom(seconds: number) {
  const samples = new Float32Array(seconds * RATE);
  let brown = 0;
  let seed = 1;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 - 0.5;
  };
  for (let i = 0; i < samples.length; i++) {
    brown = (brown + 0.02 * random()) / 1.02;
    samples[i] = brown;
  }
  // Fade the ends so the loop point is silent.
  const edge = Math.round(0.05 * RATE);
  for (let i = 0; i < edge; i++) {
    const k = i / edge;
    samples[i] *= k;
    samples[samples.length - 1 - i] *= k;
  }
  return samples;
}

const out = join(process.cwd(), "public", "sounds");
mkdirSync(out, { recursive: true });
for (const [name, layers] of Object.entries(SOUNDS)) {
  writeFileSync(join(out, `${name}.wav`), toWav(normalise(render(layers))));
  console.log(`wrote ${name}.wav`);
}
writeFileSync(join(out, "room.wav"), toWav(normalise(renderRoom(8))));
console.log("wrote room.wav");
