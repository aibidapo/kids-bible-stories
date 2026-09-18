import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Word {
  text: string;
  start: number;
  end: number;
}

/** Splits narration into words plus their character offsets, for read-along highlighting. */
export function splitWords(text: string): Word[] {
  const words: Word[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    words.push({ text: m[0], start: m.index, end: m.index + m[0].length });
  }
  return words;
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length ? english : voices;
  // Prefer a voice that ships with the device: it works offline and starts instantly.
  return pool.find((v) => v.localService) ?? pool[0];
}

/**
 * Read-along narration built on the browser's own speech synthesiser.
 *
 * Nothing is downloaded and nothing is recorded, so the app stays tiny and works
 * on a plane. Where `onboundary` is supported (Chrome, Edge, Safari) the current
 * word is reported back for highlighting; where it is not, the text simply does
 * not highlight and the audio still plays.
 */
export function useNarration() {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [speaking, setSpeaking] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    const refresh = () => {
      voiceRef.current = pickVoice(window.speechSynthesis.getVoices());
    };
    refresh();
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", refresh);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utterRef.current = null;
    setSpeaking(false);
    setCharIndex(-1);
  }, [supported]);

  const speak = useCallback(
    (text: string, rate = 0.9) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      u.pitch = 1.05;
      if (voiceRef.current) u.voice = voiceRef.current;
      u.onstart = () => setSpeaking(true);
      u.onboundary = (e) => {
        if (e.name === "word" || e.name === undefined) setCharIndex(e.charIndex);
      };
      const finish = () => {
        setSpeaking(false);
        setCharIndex(-1);
        utterRef.current = null;
      };
      u.onend = finish;
      u.onerror = finish;
      utterRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [supported],
  );

  // Never leave a voice talking over a page the child has navigated away from.
  useEffect(() => stop, [stop]);

  return useMemo(
    () => ({ supported, speaking, charIndex, speak, stop }),
    [supported, speaking, charIndex, speak, stop],
  );
}
