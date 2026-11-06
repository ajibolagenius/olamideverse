"use client";

import { useState } from "react";
import { PenNib } from "@phosphor-icons/react";
import { OV_ICON_WEIGHT } from "@/lib/icons";

export default function SignwritingProof() {
  const [showAnnotations, setShowAnnotations] = useState(true);

  return (
    <div className="space-y-8">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-white p-4 shadow-print">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-danfo text-ink shadow-paste-sm">
            <PenNib weight={OV_ICON_WEIGHT} className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg uppercase tracking-wide">
                Lagos Signwriting & Editorial Red-Pen Proof
              </span>
              <span className="border border-ink bg-ink px-1.5 py-0.2 text-[0.65rem] font-bold uppercase text-paper">
                TYPOGRAPHIC SPEC
              </span>
            </div>
            <p className="text-xs text-ink-soft">
              Hand-painted street signboards, editor manuscript callouts, and wax stamps
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAnnotations(!showAnnotations)}
          className={`border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
            showAnnotations
              ? "bg-oxide text-white shadow-paste-sm"
              : "bg-paper text-ink-soft hover:bg-white"
          }`}
        >
          {showAnnotations ? "Hide Red-Pen Notes" : "Show Red-Pen Proof"}
        </button>
      </div>

      {/* Showcase Part 1: Lagos Hand-Painted Danfo Signboards */}
      <div className="border-2 border-ink bg-white p-6 sm:p-8 shadow-print">
        <div className="border-b-2 border-ink pb-3 mb-6 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
            SECTION A · HAND-PAINTED LAGOS STREET SIGNWRITING
          </span>
          <span className="font-mono text-[0.65rem] text-ink-muted">BARIGA SIGN-PAINTER GUILD</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Signboard 1: Danfo Yellow Board */}
          <div className="border-4 border-ink bg-danfo p-5 shadow-paste transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="border-2 border-dashed border-ink p-3 text-center text-ink">
              <div className="font-mono text-[0.6rem] font-bold uppercase tracking-widest">
                LAGOS STATE ROUTE MOTTO
              </div>
              <h3 className="mt-2 font-display text-2xl uppercase leading-tight tracking-tight">
                NO RUSH IN LIFE · BARIGA BOY
              </h3>
              <p className="mt-1 font-mono text-[0.65rem] font-bold uppercase">
                MOTOR PARK SPECIAL · 2011
              </p>
            </div>
          </div>

          {/* Signboard 2: Oxide Red Barbershop Board */}
          <div className="border-4 border-ink bg-oxide p-5 shadow-paste transform rotate-1 hover:rotate-0 transition-transform text-paper">
            <div className="border-2 border-dashed border-paper/40 p-3 text-center">
              <div className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-danfo">
                YBNL HEADQUARTERS
              </div>
              <h3 className="mt-2 font-display text-2xl uppercase leading-tight tracking-tight">
                BADDEST GUY EVER LIVETH
              </h3>
              <p className="mt-1 font-mono text-[0.65rem] uppercase text-paper/80">
                REGISTERED STREET HOP · 2013
              </p>
            </div>
          </div>

          {/* Signboard 3: Adire Indigo Studio Board */}
          <div className="border-4 border-ink bg-adire p-5 shadow-paste transform -rotate-0.5 hover:rotate-0 transition-transform text-paper">
            <div className="border-2 border-dashed border-paper/40 p-3 text-center">
              <div className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-danfo">
                CODED TUNES LABORATORY
              </div>
              <h3 className="mt-2 font-display text-2xl uppercase leading-tight tracking-tight">
                RAPSODI · VOL. 01
              </h3>
              <p className="mt-1 font-mono text-[0.65rem] uppercase text-paper/80">
                PRODUCED BY ID CABASA · 2011
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Showcase Part 2: Editorial Proof Sheet with Red-Pen Annotations */}
      <div className="relative border-2 border-ink bg-paper p-6 sm:p-10 shadow-paste">
        <div className="flex items-center justify-between border-b-2 border-ink pb-4">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            PROOF SHEET // MANUSCRIPT CORRECTION DRAFT
          </div>
          <div className="border border-ink bg-white px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase text-oxide">
            CORRECTIONS PENDING
          </div>
        </div>

        {/* Article Body with Red-Penning and Margin Notes */}
        <div className="relative mt-8 max-w-3xl">
          {/* Margin Scribe Callout (Floating on desktop) */}
          {showAnnotations && (
            <aside
              className="hidden xl:block absolute -right-64 top-4 w-52 border-l-2 border-oxide pl-3 text-xs text-oxide font-mono leading-snug"
              aria-label="Editor Margin Note"
            >
              <span className="font-bold uppercase block text-[0.65rem]">
                EDITOR NOTE [ADÍSÁ]:
              </span>
              Verify underdots on Yoruba words (Ọ ọ Ẹ ẹ Ṣ ṣ). Bariga date confirmed with ID Cabasa.
            </aside>
          )}

          <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-ink">
            How Bariga Rapped When The Country Spoke English
          </h2>

          <div className="mt-4 text-base leading-relaxed text-ink-soft space-y-4">
            <p>
              In{" "}
              {showAnnotations ? (
                <span className="relative inline-block font-bold text-ink px-1">
                  <span className="relative z-10">2010</span>
                  <svg
                    className="absolute -inset-1.5 h-7 w-12 text-oxide -rotate-2"
                    viewBox="0 0 50 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <ellipse
                      cx="25"
                      cy="15"
                      rx="22"
                      ry="12"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              ) : (
                <span className="font-bold text-ink">2010</span>
              )}
              , conventional wisdom in the Nigerian music industry dictated that mainstream
              commercial hip-hop had to be delivered in English or pidgin to travel beyond
              the mainland. Olamide Adedeji rejected the formula from day one.
            </p>

            <blockquote className="relative my-6 pl-4 border-l-4 border-danfo py-2">
              <span className="font-display text-2xl uppercase tracking-wide text-ink block">
                “TÍ N BÁ RAPP NÍ YORÙBÁ, WỌ́N LỌ́ WỌ́N Ò GBỌ́ — BỤ̀T NÍSÌYÍ WỌ́N JỌ́ SÍ I!”
              </span>
              {/* Hand-painted SVG brush underline */}
              <svg
                className="mt-2 h-3 w-48 text-danfo"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 8C50 2 150 10 198 4"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </blockquote>

            <p>
              The result was <em>Eni Duro</em>, an explosive manifesto that shifted the axis of
              indigenous rap and established Coded Tunes as the creative engine room of Lagos.
            </p>
          </div>

          {/* Rubber Stamp Seals */}
          <div className="mt-8 flex flex-wrap items-center gap-4 pt-4 border-t border-ink/20">
            <div className="border-2 border-oxide px-3 py-1 text-oxide font-mono text-xs font-bold uppercase tracking-wider transform -rotate-3">
              ARCHIVE SEAL: VERIFIED BARIGA ORIGIN
            </div>
            <div className="border-2 border-danfo bg-white px-3 py-1 text-ink font-mono text-xs font-bold uppercase tracking-wider transform rotate-2 shadow-paste-sm">
              EDITORIAL PASS: ISSUE 06
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
