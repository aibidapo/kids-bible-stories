import type { SoundName } from "../types";

/**
 * Every sound effect is synthesised with the Web Audio API rather than loaded
 * from a file. That keeps the whole app a few hundred kilobytes, makes it work
 * offline the first time it is opened, and sidesteps audio licensing entirely.
 */

let ctx: AudioContext | null = null;
let muted = false;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  // iOS suspends the context until a user gesture; every call site is a tap.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function env(gain: GainNode, t: number, peak: number, attack: number, decay: number) {
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  peak = 0.22,
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  env(gain, start, peak, 0.012, dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.08);
}

function sweep(
  ac: AudioContext,
  from: number,
  to: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  peak = 0.2,
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + dur);
  env(gain, start, peak, 0.015, dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.08);
}

/** A short burst of filtered noise — the basis of splashes, thunder and roars. */
function noise(
  ac: AudioContext,
  start: number,
  dur: number,
  filterType: BiquadFilterType,
  freq: number,
  peak = 0.2,
  q = 1,
) {
  const frames = Math.floor(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(freq, start);
  filter.Q.value = q;
  const gain = ac.createGain();
  env(gain, start, peak, 0.02, dur);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(start);
  src.stop(start + dur);
}

const MAJOR = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5 D5 E5 G5 A5 — pentatonic, so nothing clashes

export function play(name: SoundName) {
  if (muted) return;
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;

  switch (name) {
    case "chime":
      tone(ac, MAJOR[2], t, 0.35, "sine", 0.2);
      tone(ac, MAJOR[4], t + 0.06, 0.4, "sine", 0.14);
      break;

    case "sparkle":
      MAJOR.forEach((f, i) => tone(ac, f * 2, t + i * 0.055, 0.22, "triangle", 0.12));
      break;

    case "splash":
      noise(ac, t, 0.28, "bandpass", 1400, 0.3, 0.8);
      sweep(ac, 900, 240, t, 0.3, "sine", 0.1);
      break;

    case "thunder":
      noise(ac, t, 1.1, "lowpass", 220, 0.32, 0.6);
      sweep(ac, 90, 40, t, 1.0, "sawtooth", 0.12);
      break;

    case "roar":
      sweep(ac, 180, 90, t, 0.7, "sawtooth", 0.16);
      noise(ac, t, 0.7, "lowpass", 600, 0.16, 0.7);
      break;

    case "sheep":
      // A wobbling bleat: two quick pitch dips.
      sweep(ac, 520, 440, t, 0.14, "sawtooth", 0.1);
      sweep(ac, 500, 420, t + 0.16, 0.14, "sawtooth", 0.1);
      sweep(ac, 480, 400, t + 0.32, 0.2, "sawtooth", 0.09);
      break;

    case "bird":
      sweep(ac, 1800, 2600, t, 0.1, "sine", 0.12);
      sweep(ac, 2400, 1700, t + 0.12, 0.12, "sine", 0.12);
      sweep(ac, 2000, 2800, t + 0.28, 0.1, "sine", 0.1);
      break;

    case "whoosh":
      noise(ac, t, 0.4, "bandpass", 900, 0.22, 2.5);
      break;

    case "cheer":
      MAJOR.forEach((f, i) => tone(ac, f, t + i * 0.07, 0.4, "triangle", 0.16));
      tone(ac, MAJOR[0] * 2, t + 0.36, 0.5, "sine", 0.16);
      noise(ac, t + 0.1, 0.5, "highpass", 2600, 0.07, 0.5);
      break;

    case "knock":
      noise(ac, t, 0.09, "lowpass", 500, 0.26, 1);
      tone(ac, 180, t, 0.1, "square", 0.1);
      break;
  }
}

/** Rising three-note flourish for a correct answer. */
export function playCorrect() {
  if (muted) return;
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  [MAJOR[0], MAJOR[2], MAJOR[3]].forEach((f, i) => tone(ac, f, t + i * 0.1, 0.32, "triangle", 0.2));
}

/** Gentle, non-punishing "not that one" — a soft two-note dip, never a buzzer. */
export function playTryAgain() {
  if (muted) return;
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  tone(ac, 392.0, t, 0.18, "sine", 0.14);
  tone(ac, 349.23, t + 0.12, 0.26, "sine", 0.12);
}
