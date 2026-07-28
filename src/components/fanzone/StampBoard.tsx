import { Fire, SealCheck } from "@phosphor-icons/react/ssr";
import { BADGES } from "@/lib/fanzone/badges";
import type { FanStats } from "@/lib/fanzone/queries";

/** Paste-up "stamps" board — streak counter + earned/unearned badge grid. */
export default function StampBoard({
  stats,
  currentStreak,
}: {
  stats: FanStats;
  /** Only known for the account owner's own session — omit on someone else's public profile. */
  currentStreak?: number;
}) {
  return (
    <div className="ov-paste-up border-3 border-ink bg-white p-5 shadow-paste">
      <div className="mb-5 flex flex-wrap items-center gap-6 border-b-2 border-ink pb-4">
        {typeof currentStreak === "number" ? (
          <p className="ov-icon-inline text-sm">
            <Fire
              className="ov-icon text-danfo"
              size={20}
              weight={currentStreak > 0 ? "fill" : "regular"}
              aria-hidden
            />
            <b className="font-display text-2xl tabular-nums">{currentStreak}</b>
            <span className="text-ink-soft">
              day{currentStreak === 1 ? "" : "s"} in a row
            </span>
          </p>
        ) : null}
        <p className="text-xs tracking-[0.05em] uppercase text-ink-soft">
          Best streak: <b className="text-ink">{stats.longestStreak}</b>{" "}
          day{stats.longestStreak === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BADGES.map((badge) => {
          const earned = badge.earned(stats);
          const descId = `badge-desc-${badge.id}`;
          return (
            <div
              key={badge.id}
              aria-describedby={descId}
              className={`-rotate-1 border-2 px-3 py-3 text-center transition-colors even:rotate-1 ${
                earned
                  ? "border-ink bg-danfo-tint shadow-paste-sm"
                  : "border-dashed border-ink-soft text-ink-soft opacity-60"
              }`}
            >
              <SealCheck
                className="ov-icon mx-auto mb-1.5"
                size={22}
                weight={earned ? "fill" : "regular"}
                aria-hidden
              />
              <p className="text-[0.68rem] font-bold tracking-[0.04em] uppercase">
                {badge.label}
                {!earned ? (
                  <span className="sr-only"> (locked)</span>
                ) : null}
              </p>
              <p id={descId} className="sr-only">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
