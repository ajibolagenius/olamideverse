import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export type AnalyticsTotals = {
  visitors: number;
  pageviews: number;
};

export type DailyPoint = {
  day: string;
  pageviews: number;
  visitors: number;
};

export type RankedRow = {
  key: string;
  pageviews: number;
  visitors?: number;
};

export type AnalyticsReport = {
  totals: AnalyticsTotals;
  today: AnalyticsTotals;
  last7: AnalyticsTotals;
  last30: AnalyticsTotals;
  daily: DailyPoint[];
  topPages: RankedRow[];
  topReferrers: RankedRow[];
  devices: RankedRow[];
  countries: RankedRow[];
  recent: Array<{
    id: number;
    created_at: string;
    path: string;
    referrer_host: string | null;
    device: string;
    country: string | null;
    is_new_visitor: boolean;
  }>;
};

function emptyTotals(): AnalyticsTotals {
  return { visitors: 0, pageviews: 0 };
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

export async function getPublicTotals(): Promise<AnalyticsTotals> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.rpc("get_analytics_totals");
    if (error || !data) return emptyTotals();
    const row = data as { visitors?: number; pageviews?: number };
    return {
      visitors: Number(row.visitors ?? 0),
      pageviews: Number(row.pageviews ?? 0),
    };
  } catch {
    return emptyTotals();
  }
}

export async function getAnalyticsReport(): Promise<AnalyticsReport> {
  const empty: AnalyticsReport = {
    totals: emptyTotals(),
    today: emptyTotals(),
    last7: emptyTotals(),
    last30: emptyTotals(),
    daily: [],
    topPages: [],
    topReferrers: [],
    devices: [],
    countries: [],
    recent: [],
  };

  try {
    const supabase = await createClient();
    const since30 = daysAgo(29).toISOString();
    const today = dayKey(new Date());
    const since7 = dayKey(daysAgo(6));

    const [counters, daily, events, recent] = await Promise.all([
      supabase.from("analytics_counters").select("key, value"),
      supabase
        .from("analytics_daily")
        .select("day, path, pageviews, visitors")
        .eq("path", "")
        .gte("day", dayKey(daysAgo(29)))
        .order("day", { ascending: true }),
      supabase
        .from("analytics_events")
        .select("path, referrer_host, device, country, visitor_id, created_at")
        .gte("created_at", since30)
        .limit(20_000),
      supabase
        .from("analytics_events")
        .select(
          "id, created_at, path, referrer_host, device, country, is_new_visitor",
        )
        .order("created_at", { ascending: false })
        .limit(25),
    ]);

    if (counters.error && daily.error) return empty;

    const totals = emptyTotals();
    for (const row of counters.data ?? []) {
      if (row.key === "total_visitors") totals.visitors = Number(row.value);
      if (row.key === "total_pageviews") totals.pageviews = Number(row.value);
    }

    const dailyMap = new Map<string, DailyPoint>();
    for (let i = 29; i >= 0; i--) {
      const key = dayKey(daysAgo(i));
      dailyMap.set(key, { day: key, pageviews: 0, visitors: 0 });
    }
    for (const row of daily.data ?? []) {
      const key = String(row.day).slice(0, 10);
      dailyMap.set(key, {
        day: key,
        pageviews: Number(row.pageviews),
        visitors: Number(row.visitors),
      });
    }
    const dailyPoints = [...dailyMap.values()];

    const sumRange = (fromDay: string): AnalyticsTotals => {
      let pageviews = 0;
      let visitors = 0;
      for (const p of dailyPoints) {
        if (p.day >= fromDay) {
          pageviews += p.pageviews;
          visitors += p.visitors;
        }
      }
      return { pageviews, visitors };
    };

    const todayPoint = dailyMap.get(today) ?? { pageviews: 0, visitors: 0 };

    // Rankings from recent event sample (30d window).
    const pageCounts = new Map<string, { pageviews: number; visitors: Set<string> }>();
    const refCounts = new Map<string, number>();
    const deviceCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();

    for (const ev of events.data ?? []) {
      const path = ev.path || "/";
      const page = pageCounts.get(path) ?? {
        pageviews: 0,
        visitors: new Set<string>(),
      };
      page.pageviews += 1;
      page.visitors.add(ev.visitor_id);
      pageCounts.set(path, page);

      if (ev.referrer_host) {
        refCounts.set(ev.referrer_host, (refCounts.get(ev.referrer_host) ?? 0) + 1);
      }
      deviceCounts.set(ev.device, (deviceCounts.get(ev.device) ?? 0) + 1);
      if (ev.country) {
        countryCounts.set(ev.country, (countryCounts.get(ev.country) ?? 0) + 1);
      }
    }

    const topPages: RankedRow[] = [...pageCounts.entries()]
      .map(([key, v]) => ({
        key,
        pageviews: v.pageviews,
        visitors: v.visitors.size,
      }))
      .sort((a, b) => b.pageviews - a.pageviews)
      .slice(0, 15);

    const topReferrers: RankedRow[] = [...refCounts.entries()]
      .map(([key, pageviews]) => ({ key, pageviews }))
      .sort((a, b) => b.pageviews - a.pageviews)
      .slice(0, 12);

    const devices: RankedRow[] = [...deviceCounts.entries()]
      .map(([key, pageviews]) => ({ key, pageviews }))
      .sort((a, b) => b.pageviews - a.pageviews);

    const countries: RankedRow[] = [...countryCounts.entries()]
      .map(([key, pageviews]) => ({ key, pageviews }))
      .sort((a, b) => b.pageviews - a.pageviews)
      .slice(0, 12);

    return {
      totals,
      today: {
        pageviews: todayPoint.pageviews,
        visitors: todayPoint.visitors,
      },
      last7: sumRange(since7),
      last30: sumRange(dayKey(daysAgo(29))),
      daily: dailyPoints,
      topPages,
      topReferrers,
      devices,
      countries,
      recent: (recent.data ?? []).map((r) => ({
        id: Number(r.id),
        created_at: r.created_at,
        path: r.path,
        referrer_host: r.referrer_host,
        device: r.device,
        country: r.country,
        is_new_visitor: Boolean(r.is_new_visitor),
      })),
    };
  } catch {
    return empty;
  }
}
