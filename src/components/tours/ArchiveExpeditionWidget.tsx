"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  startArchiveOrientationTour,
  startStoryAct,
  getSavedTourProgress,
} from "@/lib/tours";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import {
  ArrowRight,
  CheckCircle,
  Circle,
  Compass,
  Minus,
  Sparkle,
  X,
} from "@phosphor-icons/react";

interface StoryAct {
  id: string;
  actNumber: number;
  title: string;
  subtitle: string;
  targetHref: string;
}

const STORY_ACTS: StoryAct[] = [
  {
    id: "act-1",
    actNumber: 1,
    title: "Act I · The Bariga Gamble (2010)",
    subtitle: "How a Bariga upstart bet everything on Yoruba street rap.",
    targetHref: "/biography",
  },
  {
    id: "act-2",
    actNumber: 2,
    title: "Act II · The Rebel Empire (2012–2013)",
    subtitle: "Founding YBNL Nation to prove the discovery was his own.",
    targetHref: "/albums",
  },
  {
    id: "act-3",
    actNumber: 3,
    title: "Act III · Street King Coronation (2014–2017)",
    subtitle: "An album a year, OLIC stadium headlines, and the Shaku Shaku genesis.",
    targetHref: "/media",
  },
  {
    id: "act-4",
    actNumber: 4,
    title: "Act IV · The Empire Matrix (2018–2020)",
    subtitle: "Distribution joint venture with Empire and raising Fireboy DML & Asake.",
    targetHref: "/influence",
  },
  {
    id: "act-5",
    actNumber: 5,
    title: "Act V · The Transit Corridor (2021–2023)",
    subtitle: "From Bariga Mainland origin to London O2 Arena and world stages.",
    targetHref: "/impact",
  },
  {
    id: "act-6",
    actNumber: 6,
    title: "Act VI · The Living Legacy (2024–Present)",
    subtitle: "Billboard Global Power Player and 19.1M first-week Spotify record.",
    targetHref: "/snippets",
  },
];

export default function ArchiveExpeditionWidget() {
  const [minimized, setMinimized] = useState(true);
  const [compact, setCompact] = useState(false);
  const [closed, setClosed] = useState(false);
  const [completedActs, setCompletedActs] = useState<string[]>([]);
  const [resumeActId, setResumeActId] = useState<string | null>(null);
  const [resumeStep, setResumeStep] = useState<number>(1);
  const [resumeTotal, setResumeTotal] = useState<number>(3);

  // Load completed acts and check resume progress
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem("ov-completed-acts");
        if (stored) {
          setCompletedActs(JSON.parse(stored));
        }

        // Check if any story act has saved progress
        for (const act of STORY_ACTS) {
          const progress = getSavedTourProgress(`act-${act.id}`);
          if (progress && progress.step < progress.total) {
            setResumeActId(act.id);
            setResumeStep(progress.step);
            setResumeTotal(progress.total);
            break;
          }
        }
      } catch {
        // Ignore storage errors in private browsing
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const toggleActCompleted = (actId: string) => {
    setCompletedActs((prev) => {
      const next = prev.includes(actId)
        ? prev.filter((id) => id !== actId)
        : [...prev, actId];
      try {
        localStorage.setItem("ov-completed-acts", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleLaunchAct = (actId: string, startIndex = 0) => {
    startStoryAct(actId, startIndex);
    if (!completedActs.includes(actId)) {
      toggleActCompleted(actId);
    }
  };

  const completedCount = completedActs.length;
  const progressPercent = Math.round((completedCount / STORY_ACTS.length) * 100);

  if (closed) {
    return (
      <button
        type="button"
        onClick={() => {
          setClosed(false);
          setMinimized(false);
        }}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 border-3 border-ink bg-danfo px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-paste transition-transform hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Re-open Archive Expedition"
      >
        <Compass weight={OV_ICON_WEIGHT} className="h-4 w-4" />
        <span>Expedition</span>
      </button>
    );
  }

  return (
    <>
      {minimized ? (
        /* Minimized Floating Pill Dock (Driver.js example style) */
        <div className="fixed bottom-5 left-5 z-40">
          <button
            type="button"
            onClick={() => setMinimized(false)}
            className="group flex items-center gap-2.5 border-3 border-ink bg-danfo px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-paste transition-transform hover:-translate-y-0.5 active:translate-y-0"
            aria-label="Open Archive Expedition Onboarding Checklist"
          >
            <Compass
              weight={OV_ICON_WEIGHT}
              className="h-4 w-4 transition-transform group-hover:rotate-45"
            />
            <span>Archive Expedition</span>
            <span className="rounded-full bg-ink px-2 py-0.5 text-[0.65rem] font-bold text-paper">
              {completedCount}/{STORY_ACTS.length}
            </span>
            {resumeActId && (
              <span className="h-2 w-2 rounded-full bg-oxide animate-pulse" aria-hidden="true" />
            )}
          </button>
        </div>
      ) : (
        /* Expanded Onboarding Checklist Card (Official Driver.js Onboarding Checklist style) */
        <aside
          role="region"
          aria-label="Archive Expedition Storytelling Checklist"
          className="fixed bottom-5 left-5 z-40 w-[min(24rem,calc(100vw-2.5rem))] border-3 border-ink bg-paper shadow-paste-lg overflow-hidden flex flex-col"
        >
          {/* Danfo Yellow Card Header */}
          <div className="border-b-3 border-ink bg-danfo p-4 text-ink">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink/80">
                  <Compass weight={OV_ICON_WEIGHT} className="h-3.5 w-3.5" />
                  <span>ONBOARDING EXPEDITION</span>
                </div>
                <h2 className="font-display mt-0.5 text-xl uppercase tracking-tight leading-none text-ink">
                  Bariga to the World
                </h2>
                <p className="mt-1 text-xs leading-snug text-ink/90">
                  Six storytelling acts across Olamide&rsquo;s 16-year living archive.
                </p>
              </div>

              {/* Controls: Compact, Minimize & Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setCompact(!compact)}
                  className="px-1.5 py-0.5 border-2 border-ink bg-white font-mono text-[0.62rem] font-bold uppercase text-ink hover:bg-danfo-tint"
                  aria-label={compact ? "Show detailed checklist" : "Switch to compact checklist"}
                >
                  {compact ? "Full" : "Mini"}
                </button>
                <button
                  type="button"
                  onClick={() => setMinimized(true)}
                  className="flex h-6 w-6 items-center justify-center border-2 border-ink bg-white text-ink hover:bg-danfo-tint"
                  aria-label="Minimize Expedition"
                >
                  <Minus weight="bold" className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setClosed(true)}
                  className="flex h-6 w-6 items-center justify-center border-2 border-ink bg-white text-ink hover:bg-danfo-tint"
                  aria-label="Close Expedition"
                >
                  <X weight="bold" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="mt-3">
              <div className="h-2 w-full border-2 border-ink bg-white overflow-hidden relative">
                <div
                  className="h-full bg-ink transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink/80">
                <span>{progressPercent}% EXPLORED</span>
                <span>
                  {completedCount} OF {STORY_ACTS.length} ACTS
                </span>
              </div>
            </div>
          </div>

          {/* Active Resume Banner (Driver.js 'left at X/Y' feature) */}
          {resumeActId && (
            <div className="border-b-2 border-ink bg-oxide/10 px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-oxide animate-pulse" />
                <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-oxide">
                  Paused at Step {resumeStep} of {resumeTotal}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchAct(resumeActId, resumeStep - 1)}
                className="border border-oxide bg-oxide px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase text-white hover:bg-oxide/90 shadow-paste-sm"
              >
                Resume Act →
              </button>
            </div>
          )}

          {/* Checklist Items Container */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-ink/15 p-2 bg-white">
            {STORY_ACTS.map((act) => {
              const isCompleted = completedActs.includes(act.id);

              if (compact) {
                return (
                  <div
                    key={act.id}
                    className={`flex items-center justify-between gap-2.5 p-2 transition-colors ${
                      isCompleted ? "bg-paper-dim/40" : "hover:bg-paper-dim/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleActCompleted(act.id)}
                        className="text-ink hover:text-oxide shrink-0 transition-colors"
                        aria-label={`Mark ${act.title} as ${isCompleted ? "incomplete" : "completed"}`}
                      >
                        {isCompleted ? (
                          <CheckCircle weight="fill" className="h-4 w-4 text-oxide" />
                        ) : (
                          <Circle weight="bold" className="h-4 w-4 text-ink-soft" />
                        )}
                      </button>
                      <h3
                        className={`text-xs font-bold leading-tight truncate ${
                          isCompleted ? "text-ink/60 line-through" : "text-ink"
                        }`}
                      >
                        {act.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLaunchAct(act.id)}
                      className="shrink-0 font-mono text-[0.62rem] font-bold uppercase text-oxide hover:underline"
                    >
                      Play →
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={act.id}
                  className={`p-3 transition-colors ${
                    isCompleted ? "bg-paper-dim/40" : "hover:bg-paper-dim/30"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleActCompleted(act.id)}
                      className="mt-0.5 text-ink hover:text-oxide shrink-0 transition-colors"
                      aria-label={`Mark ${act.title} as ${isCompleted ? "incomplete" : "completed"}`}
                    >
                      {isCompleted ? (
                        <CheckCircle weight="fill" className="h-4 w-4 text-oxide" />
                      ) : (
                        <Circle weight="bold" className="h-4 w-4 text-ink-soft" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <h3
                          className={`text-xs font-bold leading-tight truncate ${
                            isCompleted ? "text-ink/60 line-through" : "text-ink"
                          }`}
                        >
                          {act.title}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-[0.7rem] text-ink-soft leading-normal">
                        {act.subtitle}
                      </p>

                      {/* Action Trigger */}
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleLaunchAct(act.id)}
                          className="inline-flex items-center gap-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-oxide hover:underline"
                        >
                          <Sparkle weight="bold" className="h-3 w-3" />
                          <span>Launch Story Act</span>
                        </button>
                        <span className="text-ink/20">·</span>
                        <Link
                          href={act.targetHref}
                          className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink-soft hover:text-ink hover:underline"
                        >
                          Visit Section →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card Footer Bar */}
          <div className="border-t-2 border-ink bg-paper p-3 flex items-center justify-between gap-2">
            <span className="font-mono text-[0.65rem] font-bold uppercase text-ink-soft">
              POWERED BY DRIVER.JS
            </span>
            <button
              type="button"
              onClick={() => {
                setMinimized(true);
                startArchiveOrientationTour();
              }}
              className="inline-flex items-center gap-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink hover:text-oxide"
            >
              <span>Full Archive Tour</span>
              <ArrowRight weight="bold" className="h-3 w-3" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
