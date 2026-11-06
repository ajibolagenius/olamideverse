"use client";

import { useState, useSyncExternalStore } from "react";
import { SpeakerHigh, SpeakerSlash, Monitor, Sparkle } from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";

function subscribeP3(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(color-gamut: p3)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getP3Snapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(color-gamut: p3)").matches;
}

function getServerP3Snapshot() {
  return false;
}

export default function P3SensoryLab() {
  const hasP3 = useSyncExternalStore(subscribeP3, getP3Snapshot, getServerP3Snapshot);
  const [audioFeedback, setAudioFeedback] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState<"danfo" | "adire" | "oxide">("danfo");

  // Synthetic Web Audio API analog tape-click sound (zero external asset, pure synthesis)
  const playAnalogClick = () => {
    if (!audioFeedback || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  return (
    <div className="space-y-8">
      {/* Sensor Detection Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-white p-4 shadow-print">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-danfo text-ink shadow-paste-sm">
            <Monitor weight={OV_ICON_WEIGHT} className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg uppercase tracking-wide">
                Sensory & Hardware Engine Lab
              </span>
              <span className="border border-ink bg-ink px-1.5 py-0.2 text-[0.65rem] font-bold uppercase text-paper">
                EXPERIMENT 06
              </span>
            </div>
            <p className="text-xs text-ink-soft">
              Display P3 wide color gamut calibration and Web Audio analog tactile feedback
            </p>
          </div>
        </div>

        {/* Display P3 Hardware Status Badge */}
        <div className="flex items-center gap-2">
          <div className="border-2 border-ink bg-paper px-3 py-1 text-xs font-mono font-bold uppercase text-ink flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${hasP3 ? "bg-palm" : "bg-oxide"}`}
            />
            <span>{hasP3 ? "Display P3 Supported (Wide Gamut)" : "sRGB Gamut Detected"}</span>
          </div>
        </div>
      </div>

      {/* Part 1: Display P3 vs sRGB Color Calibration */}
      <div className="border-2 border-ink bg-white p-6 sm:p-8 shadow-print">
        <div className="border-b-2 border-ink pb-3 mb-6 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
            SECTION A · WIDE GAMUT (P3) VS STANDARD (sRGB) COMPARISON
          </span>
          <span className="font-mono text-[0.65rem] text-ink-muted">CSS COLOR-4 ENGINE</span>
        </div>

        <p className="text-xs text-ink-soft max-w-2xl mb-6">
          On modern OLED and Super Retina displays, Danfo Yellow mapped to Display P3 hits
          the authentic, saturated neon-sunlight radiance of a Lagos bus, while preserving
          strict WCAG AA contrast against ink grounds.
        </p>

        {/* Swatch Selector */}
        <div className="flex gap-2 mb-6">
          {(["danfo", "adire", "oxide"] as const).map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => {
                setActiveSwatch(token);
                playAnalogClick();
              }}
              className={`border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeSwatch === token
                  ? "bg-ink text-danfo shadow-paste-sm"
                  : "bg-paper text-ink-soft hover:bg-white"
              }`}
            >
              {token.toUpperCase()} PALETTE
            </button>
          ))}
        </div>

        {/* Side-by-Side Comparison Panels */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* sRGB Standard Swatch */}
          <div className="border-2 border-ink bg-paper p-5">
            <div className="flex items-center justify-between border-b border-ink/20 pb-2 mb-3">
              <span className="font-mono text-xs font-bold uppercase text-ink">
                STANDARD sRGB
              </span>
              <span className="font-mono text-[0.65rem] text-ink-muted">LEGACY WEBSAFE</span>
            </div>
            <div
              className="h-32 w-full border-2 border-ink shadow-inner flex items-center justify-center font-display text-2xl uppercase tracking-wider text-ink"
              style={{
                backgroundColor:
                  activeSwatch === "danfo"
                    ? "#F5B301"
                    : activeSwatch === "adire"
                    ? "#1F2A63"
                    : "#C8451B",
                color: activeSwatch === "danfo" ? "#181410" : "#F4EFE6",
              }}
            >
              sRGB {activeSwatch.toUpperCase()}
            </div>
            <div className="mt-3 font-mono text-[0.68rem] text-ink-soft">
              HEX:{" "}
              {activeSwatch === "danfo"
                ? "#F5B301"
                : activeSwatch === "adire"
                ? "#1F2A63"
                : "#C8451B"}
            </div>
          </div>

          {/* Display P3 Wide Gamut Swatch */}
          <div className="border-2 border-ink bg-paper p-5">
            <div className="flex items-center justify-between border-b border-ink/20 pb-2 mb-3">
              <span className="font-mono text-xs font-bold uppercase text-ink flex items-center gap-1.5">
                <Sparkle weight={OV_ICON_WEIGHT} className="h-3.5 w-3.5 text-danfo" />
                <span>DISPLAY P3 WIDE GAMUT</span>
              </span>
              <span className="font-mono text-[0.65rem] text-danfo bg-ink px-1 font-bold">
                ENHANCED
              </span>
            </div>
            <div
              className="h-32 w-full border-2 border-ink shadow-inner flex items-center justify-center font-display text-2xl uppercase tracking-wider text-ink"
              style={{
                backgroundColor:
                  activeSwatch === "danfo"
                    ? "color(display-p3 0.96 0.70 0.05)"
                    : activeSwatch === "adire"
                    ? "color(display-p3 0.12 0.16 0.39)"
                    : "color(display-p3 0.78 0.27 0.11)",
                color: activeSwatch === "danfo" ? "#181410" : "#F4EFE6",
              }}
            >
              P3 {activeSwatch.toUpperCase()}
            </div>
            <div className="mt-3 font-mono text-[0.68rem] text-ink-soft">
              CSS: color(display-p3{" "}
              {activeSwatch === "danfo"
                ? "0.96 0.70 0.05"
                : activeSwatch === "adire"
                ? "0.12 0.16 0.39"
                : "0.78 0.27 0.11"}
              )
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Web Audio Analog Cassette Haptic Sound */}
      <div className="border-2 border-ink bg-white p-6 sm:p-8 shadow-print">
        <div className="border-b-2 border-ink pb-3 mb-6 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
            SECTION B · ANALOG TACTILE CASSETTE CLICKS
          </span>
          <span className="font-mono text-[0.65rem] text-ink-muted">WEB AUDIO SYNTHESIS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-ink/20 bg-paper p-5">
          <div>
            <h4 className="font-display text-lg uppercase tracking-wide">
              Micro-Audio Feedback Switch
            </h4>
            <p className="text-xs text-ink-soft max-w-md mt-1">
              Provides an authentic physical analog boombox button click when toggling chapters
              or cassette sleeves. Strictly opt-in (disabled by default).
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const nextState = !audioFeedback;
              setAudioFeedback(nextState);
              if (nextState) {
                setTimeout(playAnalogClick, 50);
              }
            }}
            className={`flex items-center gap-2 border-2 border-ink px-4 py-2 font-display text-xs uppercase tracking-wider transition-all shadow-paste-sm active:translate-y-0.5 ${
              audioFeedback ? "bg-danfo text-ink" : "bg-white text-ink-muted hover:text-ink"
            }`}
          >
            {audioFeedback ? (
              <>
                <SpeakerHigh weight={OV_ICON_WEIGHT} className="h-4 w-4" />
                <span>Feedback Enabled (Click to Mute)</span>
              </>
            ) : (
              <>
                <SpeakerSlash weight={OV_ICON_WEIGHT} className="h-4 w-4" />
                <span>Feedback Muted (Click to Enable)</span>
              </>
            )}
          </button>
        </div>

        {/* Click test button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={playAnalogClick}
            disabled={!audioFeedback}
            className={`border-2 border-ink px-4 py-2 font-display text-xs uppercase tracking-wider transition-all ${
              audioFeedback
                ? "bg-white text-ink shadow-paste-sm hover:bg-paper active:translate-y-0.5"
                : "bg-paper/50 text-ink-muted/50 border-ink/30 cursor-not-allowed"
            }`}
          >
            Test Tactile Click
          </button>
          <span className="text-xs text-ink-soft font-mono">
            {audioFeedback ? "Listen: simulated 140Hz→30Hz mechanical tape click" : "(Enable toggle above to test)"}
          </span>
        </div>
      </div>
    </div>
  );
}
