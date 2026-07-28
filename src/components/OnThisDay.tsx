import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import { formatMonthDay, type OnThisDayResult } from "@/lib/anniversaries";

/** Homepage highlight: a real anniversary today, or the nearest one otherwise. */
export default function OnThisDay({ result }: { result: OnThisDayResult }) {
  if (result.kind === "none") return null;

  if (result.kind === "today") {
    const items = result.items;
    return (
      <section className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
        <SectionLabel>On this day</SectionLabel>
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => {
            const yearsAgo = result.currentYear - item.year;
            return (
              <Link
                key={item.key}
                href={item.href}
                className="ov-paste-up ov-lift block border-3 border-ink bg-white shadow-paste-sm"
                data-tilt="-0.4"
                style={{ rotate: "-0.4deg" }}
              >
                <div className="flex items-center justify-between gap-3 border-b-3 border-ink bg-danfo px-4 py-2">
                  <span className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-ink">
                    On this day
                  </span>
                  <span className="font-display text-lg text-ink">
                    {yearsAgo} {yearsAgo === 1 ? "year" : "years"} ago
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-display text-2xl leading-tight">{item.title}</p>
                  {item.body ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  const { item } = result;
  return (
    <section className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
      <SectionLabel>From the archive</SectionLabel>
      <Link
        href={item.href}
        className="ov-lift block max-w-xl border-3 border-ink bg-paper-dim shadow-paste-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b-3 border-ink px-4 py-2">
          <span className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-ink-soft">
            From the archive
          </span>
          <span className="font-display text-lg">
            {formatMonthDay(item.month, item.day)} {item.year}
          </span>
        </div>
        <div className="p-5">
          <p className="font-display text-2xl leading-tight">{item.title}</p>
          {item.body ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
          ) : null}
        </div>
      </Link>
    </section>
  );
}
