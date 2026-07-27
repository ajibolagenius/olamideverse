import { eraMomentHref, momentAnchor } from "./anchors";
import { ALBUM_TYPE_LABEL, type Album, type Era } from "./content-schema";

/**
 * "On this day" data: album `released` dates and era `moments[].year` are
 * free-form display strings (docs/INFORMATION-ARCHITECTURE.md), not real
 * dates — most album dates are full day-precision ("8 October 2020"), but
 * moments range from bare years ("2012") to ranges ("Jun–Jul 2025"). Only
 * entries that parse to a full day get an anniversary; the rest are ignored.
 */

export type Anniversary = {
  key: string;
  month: number; // 1-12
  day: number;
  year: number;
  title: string;
  body?: string;
  href: string;
  kind: "album" | "moment";
};

const MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDisplayDate(value: string): { month: number; day: number; year: number } | null {
  const match = value.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = MONTHS[match[2].toLowerCase()];
  const year = Number(match[3]);
  if (!month || day < 1 || day > 31) return null;
  return { month, day, year };
}

export function formatMonthDay(month: number, day: number): string {
  return `${day} ${MONTH_NAMES[month - 1]}`;
}

export function buildAnniversaries(albums: Album[], eras: Era[]): Anniversary[] {
  const out: Anniversary[] = [];

  for (const album of albums) {
    const parsed = album.released ? parseDisplayDate(album.released) : null;
    if (!parsed) continue;
    out.push({
      key: `album-${album.slug}`,
      ...parsed,
      title: album.title,
      body: `${ALBUM_TYPE_LABEL[album.type]} released`,
      href: `/albums/${album.slug}`,
      kind: "album",
    });
  }

  for (const era of eras) {
    for (const moment of era.moments) {
      const parsed = parseDisplayDate(moment.year);
      if (!parsed) continue;
      const anchor = momentAnchor(moment.year, moment.title);
      out.push({
        key: `moment-${era.slug}-${anchor}`,
        ...parsed,
        title: moment.title || era.title,
        body: moment.body,
        href: eraMomentHref(era.slug, anchor),
        kind: "moment",
      });
    }
  }

  return out;
}

/** Non-leap-year cumulative day-of-year — good enough for a "nearest" heuristic. */
const CUMULATIVE_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

function dayOfYear(month: number, day: number): number {
  return CUMULATIVE_DAYS[month - 1] + day;
}

export type OnThisDayResult =
  | { kind: "today"; items: Anniversary[]; currentYear: number }
  | { kind: "nearest"; item: Anniversary; distanceDays: number }
  | { kind: "none" };

export function getOnThisDay(anniversaries: Anniversary[], today: Date): OnThisDayResult {
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const exact = anniversaries.filter((a) => a.month === month && a.day === day);
  if (exact.length > 0) {
    return { kind: "today", items: exact, currentYear: today.getFullYear() };
  }

  if (anniversaries.length === 0) return { kind: "none" };

  const todayDoy = dayOfYear(month, day);
  let best: { item: Anniversary; distance: number } | null = null;
  for (const item of anniversaries) {
    const diff = Math.abs(dayOfYear(item.month, item.day) - todayDoy);
    const distance = Math.min(diff, 365 - diff);
    if (!best || distance < best.distance) best = { item, distance };
  }

  return best ? { kind: "nearest", item: best.item, distanceDays: best.distance } : { kind: "none" };
}
