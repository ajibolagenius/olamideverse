import { ACCENTS, type AccentName } from "@/lib/accents";
import type { Era } from "@/lib/content";

/**
 * "The moments" timeline. Live eras get the pin-scroll treatment (intro
 * panel pins while beats scroll past); the open-ended Legacy era gets a
 * plain stacked list under "The moments so far" instead.
 */
export default function EraMoments({ era }: { era: Era }) {
  if (era.moments.length === 0) return null;
  const accent: AccentName = era.accent;

  if (era.open) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          The moments so far
        </p>
        <div className="flex max-w-3xl flex-col gap-5">
          {era.moments.map((m, i) => (
            <div
              key={m.year + i}
              className="ov-paste-up flex items-baseline gap-5 border-[3px] border-ink bg-white p-5 shadow-paste-sm"
              data-tilt={(i % 2 === 0 ? -1 : 1) * 0.45}
              style={{ rotate: `${(i % 2 === 0 ? -1 : 1) * 0.45}deg` }}
            >
              <span
                className="font-display flex-shrink-0 text-xl"
                style={{ color: ACCENTS[accent].solid }}
              >
                {m.year}
              </span>
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">{m.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="ov-pin-section mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[340px_1fr]">
      <div className="ov-pin-panel lg:self-start">
        <p className="mb-3.5 text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft">
          The moments
        </p>
        <h2 className="font-display text-display-lg mb-4 leading-[0.95]">
          Four beats,
          <br />
          {era.momentsSpan ?? ""}
        </h2>
      </div>
      <div className="flex flex-col gap-12">
        {era.moments.map((m, i) => {
          const tilt = [-0.4, 0.5, -0.6, 0.4][i % 4];
          return (
            <div
              key={m.year + i}
              className="ov-paste-up border-[3px] border-ink bg-white p-6 shadow-paste-sm"
              data-tilt={tilt}
              style={{ rotate: `${tilt}deg` }}
            >
              <span
                className="font-display text-2xl"
                style={{ color: ACCENTS[accent].solid }}
              >
                {m.year}
              </span>
              <h3 className="my-1.5 text-lg font-bold tracking-[0.03em] uppercase">
                {m.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">{m.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
