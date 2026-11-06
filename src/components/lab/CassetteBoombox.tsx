"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  Equalizer,
} from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";

export default function CassetteBoombox() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<"cassette" | "vinyl">("cassette");
  const [dolby, setDolby] = useState(true);

  return (
    <div className="space-y-8">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-white p-4 shadow-print">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-danfo text-ink shadow-paste-sm">
            <Equalizer weight={OV_ICON_WEIGHT} className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg uppercase tracking-wide">
                Analog Sound Chassis Engine
              </span>
              <span className="border border-ink bg-ink px-1.5 py-0.2 text-[0.65rem] font-bold uppercase text-paper">
                HI-FI PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-ink-soft">
              Tactile physical music packaging for the persistent player dock
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("cassette")}
            className={`border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              mode === "cassette"
                ? "bg-danfo text-ink shadow-paste-sm"
                : "bg-paper text-ink-soft hover:bg-white"
            }`}
          >
            Boombox Cassette
          </button>
          <button
            type="button"
            onClick={() => setMode("vinyl")}
            className={`border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              mode === "vinyl"
                ? "bg-danfo text-ink shadow-paste-sm"
                : "bg-paper text-ink-soft hover:bg-white"
            }`}
          >
            7-Inch Vinyl Turntable
          </button>
        </div>
      </div>

      {/* Main Player Chassis */}
      <div className="mx-auto max-w-2xl border-4 border-ink bg-paper p-6 sm:p-8 shadow-paste">
        {/* Chassis Brand Header */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl uppercase tracking-wider text-ink">
              YBNL SOUNDMASTER
            </span>
            <span className="font-mono text-xs uppercase text-ink-soft">
              SERIES 2011-DX
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDolby(!dolby)}
              className={`border border-ink px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase ${
                dolby ? "bg-danfo text-ink" : "bg-white text-ink-muted"
              }`}
            >
              DOLBY NR {dolby ? "ON" : "OFF"}
            </button>
            <span className="border border-ink bg-ink px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase text-paper">
              STEREO
            </span>
          </div>
        </div>

        {/* Dynamic Display: Cassette vs Vinyl */}
        <div className="mt-6 border-2 border-ink bg-ink p-6 text-paper">
          {mode === "cassette" ? (
            /* Cassette Deck Window */
            <div className="space-y-6">
              {/* Cassette Tape Shell */}
              <div className="relative mx-auto max-w-md border-2 border-ink-soft bg-[#25201b] p-4 shadow-inner">
                {/* Tape Label */}
                <div className="border border-ink-soft bg-paper px-3 py-1.5 text-ink flex items-center justify-between">
                  <div>
                    <span className="font-display text-xs uppercase">
                      OLAMIDE · ENI DURO (CODED TUNES)
                    </span>
                    <div className="font-mono text-[0.6rem] text-ink-soft">
                      SIDE A · 4:12 · YBNL CHROME C-60
                    </div>
                  </div>
                  <span className="border border-ink bg-danfo px-1 font-mono text-[0.6rem] font-bold">
                    C-60
                  </span>
                </div>

                {/* Cassette Center Window with Dual Rotating Spools */}
                <div className="mt-3 flex items-center justify-around border-2 border-black bg-[#120f0d] py-5 px-6">
                  {/* Left Spool */}
                  <div
                    className={`h-12 w-12 rounded-full border-2 border-dashed border-paper flex items-center justify-center transition-transform ${
                      isPlaying ? "animate-spin" : ""
                    }`}
                    style={{ animationDuration: "3s" }}
                  >
                    <div className="h-4 w-4 rounded-full bg-danfo border border-ink" />
                  </div>

                  {/* Tape Level Window */}
                  <div className="flex flex-col items-center gap-1 font-mono text-[0.65rem] text-paper/60">
                    <span>TAPE LEVEL</span>
                    <div className="h-1.5 w-20 bg-ink-soft rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-danfo" />
                    </div>
                  </div>

                  {/* Right Spool */}
                  <div
                    className={`h-12 w-12 rounded-full border-2 border-dashed border-paper flex items-center justify-center transition-transform ${
                      isPlaying ? "animate-spin" : ""
                    }`}
                    style={{ animationDuration: "3s" }}
                  >
                    <div className="h-4 w-4 rounded-full bg-danfo border border-ink" />
                  </div>
                </div>
              </div>

              {/* Analog VU Meter */}
              <div className="border border-ink-soft bg-[#120f0d] p-3">
                <div className="flex items-center justify-between text-[0.65rem] font-mono text-ink-muted mb-1.5">
                  <span>LEFT / RIGHT VU LEVEL</span>
                  <span className="text-danfo">{isPlaying ? "+2 dB ACTIVE" : "0 dB IDLE"}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex gap-0.5 h-2">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${
                          isPlaying && i < 14
                            ? i > 16
                              ? "bg-oxide"
                              : i > 12
                              ? "bg-danfo"
                              : "bg-palm"
                            : "bg-ink-soft/40"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-0.5 h-2">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${
                          isPlaying && i < 12
                            ? i > 16
                              ? "bg-oxide"
                              : i > 12
                              ? "bg-danfo"
                              : "bg-palm"
                            : "bg-ink-soft/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 7-Inch Vinyl Turntable Mode */
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              {/* Rotating Vinyl Record */}
              <div
                className={`relative h-48 w-48 rounded-full border-4 border-black bg-[#151515] shadow-2xl flex items-center justify-center transition-transform ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "2.5s" }}
              >
                {/* Grooves */}
                <div className="absolute inset-4 rounded-full border border-white/5" />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-12 rounded-full border border-white/5" />

                {/* Stamped Center Label */}
                <div className="h-20 w-20 rounded-full border-2 border-ink bg-danfo text-ink flex flex-col items-center justify-center text-center p-1">
                  <span className="font-display text-[0.65rem] uppercase leading-tight">
                    YBNL 45 RPM
                  </span>
                  <span className="font-mono text-[0.5rem] font-bold">RAPSODI-01</span>
                </div>
              </div>

              {/* Tonearm & Speed Details */}
              <div className="space-y-3 font-mono text-xs">
                <div className="border border-ink-soft bg-[#120f0d] p-3 space-y-1">
                  <div className="text-danfo font-bold">SPEED: 45 RPM</div>
                  <div className="text-ink-muted">CARTRIDGE: ORTOFON CONCORDE</div>
                  <div className="text-paper">STATUS: {isPlaying ? "TRACKING" : "REST"}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tactile Mechanical Transport Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 border-2 border-ink px-5 py-2.5 font-display text-sm uppercase tracking-wider transition-all active:translate-y-1 ${
              isPlaying
                ? "bg-danfo text-ink shadow-paste"
                : "bg-white text-ink shadow-paste-sm hover:bg-paper"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause weight={OV_ICON_WEIGHT} className="h-4 w-4" />
                <span>Pause Tape</span>
              </>
            ) : (
              <>
                <Play weight={OV_ICON_WEIGHT} className="h-4 w-4" />
                <span>Play Tape</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 border-2 border-ink bg-white px-3.5 py-2.5 font-display text-xs uppercase tracking-wider text-ink shadow-paste-sm hover:bg-paper active:translate-y-1"
          >
            <Rewind weight={OV_ICON_WEIGHT} className="h-4 w-4" />
            <span>Rewind</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 border-2 border-ink bg-white px-3.5 py-2.5 font-display text-xs uppercase tracking-wider text-ink shadow-paste-sm hover:bg-paper active:translate-y-1"
          >
            <FastForward weight={OV_ICON_WEIGHT} className="h-4 w-4" />
            <span>Fast Fwd</span>
          </button>
        </div>
      </div>
    </div>
  );
}
