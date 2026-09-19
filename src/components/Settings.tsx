import { useEffect, useState } from "react";
import {
  setCalm,
  setMode,
  setMutedPref,
  setNarrate,
  resetProgress,
  useProgress,
} from "../lib/store";
import { setMuted } from "../lib/sound";
import { SCRIPTURE_NOTICE } from "../data/scripture";
import { clear as clearPilot, exportText, isEnabled, setEnabled } from "../lib/pilotLog";

/**
 * The grown-up panel. Deliberately plain and text-heavy so it reads as "not for
 * you" to a four-year-old, and so a parent can find the motion and sound
 * switches in a hurry.
 */
export function Settings({ onClose }: { onClose: () => void }) {
  const p = useProgress();
  const [pilot, setPilot] = useState(isEnabled);
  const [copied, setCopied] = useState(false);

  function togglePilot(on: boolean) {
    setEnabled(on);
    setPilot(on);
  }

  async function copyLog() {
    const text = exportText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // No clipboard permission: fall back to a selectable box the grown-up can copy from.
      const box = document.createElement("textarea");
      box.value = text;
      document.body.appendChild(box);
      box.select();
      document.execCommand?.("copy");
      box.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function clearLog() {
    clearPilot();
    setPilot(false);
  }

  useEffect(() => {
    setMuted(p.muted);
  }, [p.muted]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="sheet__panel">
        <header className="sheet__head">
          <h2>Settings</h2>
          <button
            type="button"
            className="btn btn--round"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </header>

        <fieldset className="sheet__group">
          <legend>Reading level</legend>
          <div className="segmented">
            <button
              type="button"
              className={p.mode === "little" ? "is-on" : ""}
              onClick={() => setMode("little")}
              aria-pressed={p.mode === "little"}
            >
              Little
              <small>Ages 3–5 · short sentences</small>
            </button>
            <button
              type="button"
              className={p.mode === "big" ? "is-on" : ""}
              onClick={() => setMode("big")}
              aria-pressed={p.mode === "big"}
            >
              Big
              <small>Ages 6+ · full story, verses, harder quiz</small>
            </button>
          </div>
        </fieldset>

        <ul className="sheet__toggles">
          <li>
            <label>
              <input
                type="checkbox"
                checked={p.narrate}
                onChange={(e) => setNarrate(e.target.checked)}
              />
              <span>
                <strong>Read pages aloud</strong>
                <small>
                  Uses the voice built into this device. Nothing is recorded or sent anywhere.
                </small>
              </span>
            </label>
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={!p.muted}
                onChange={(e) => setMutedPref(!e.target.checked)}
              />
              <span>
                <strong>Sound effects</strong>
                <small>Chimes, splashes and cheers when things are tapped.</small>
              </span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" checked={p.calm} onChange={(e) => setCalm(e.target.checked)} />
              <span>
                <strong>Calm mode</strong>
                <small>
                  Holds the pictures still. Turned on automatically if this device asks for reduced
                  motion.
                </small>
              </span>
            </label>
          </li>
        </ul>

        <fieldset className="sheet__group sheet__pilot">
          <legend>Group pilot</legend>
          <label>
            <input
              type="checkbox"
              checked={pilot}
              onChange={(e) => togglePilot(e.target.checked)}
            />
            <span>
              <strong>Keep a usage count on this device</strong>
              <small>
                For church and homeschool pilots. Counts pages opened, things found, quizzes
                finished and Family time cards opened, per day. No names, no times, nothing leaves
                this device unless you copy it.
              </small>
            </span>
          </label>
          {pilot && (
            <div className="sheet__pilot-actions">
              <button type="button" className="btn" onClick={copyLog}>
                {copied ? "Copied" : "Copy log"}
              </button>
              <button type="button" className="btn" onClick={clearLog}>
                Clear log
              </button>
            </div>
          )}
        </fieldset>

        <section className="sheet__notice" aria-label="Scripture">
          <h3>Scripture</h3>
          <p>{SCRIPTURE_NOTICE}</p>
        </section>

        <div className="sheet__danger">
          <p>
            Progress is saved on this device only. There is no account and no tracking. Clearing it
            cannot be undone.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (window.confirm("Clear all stickers and progress on this device?"))
                resetProgress();
            }}
          >
            Clear progress
          </button>
        </div>
      </div>
      <button
        type="button"
        className="sheet__scrim"
        onClick={onClose}
        aria-label="Close settings"
      />
    </div>
  );
}
