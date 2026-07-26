import Link from "next/link";
import { AdminPageHeader, AdminTable, EmptyState } from "@/components/admin/ui";
import { getAnalyticsReport } from "@/lib/analytics/queries";
import { requireAdmin } from "@/lib/admin/auth";

function StatCard({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string | number;
  secondary?: string;
}) {
  return (
    <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#181410]">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl leading-none">{primary}</p>
      {secondary ? (
        <p className="mt-2 text-xs text-ink-soft">{secondary}</p>
      ) : null}
    </div>
  );
}

function BarChart({
  points,
  valueKey,
}: {
  points: Array<{ day: string; pageviews: number; visitors: number }>;
  valueKey: "pageviews" | "visitors";
}) {
  const max = Math.max(1, ...points.map((p) => p[valueKey]));
  return (
    <div className="border-2 border-ink bg-white p-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-display text-xl uppercase">
          {valueKey === "pageviews" ? "Pageviews" : "Visitors"} · 30 days
        </h2>
        <span className="text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft">
          UTC days
        </span>
      </div>
      <div
        className="flex h-40 items-end gap-[3px]"
        role="img"
        aria-label={`Daily ${valueKey} for the last 30 days`}
      >
        {points.map((p) => {
          const h = Math.round((p[valueKey] / max) * 100);
          return (
            <div
              key={`${valueKey}-${p.day}`}
              className="group relative flex-1 bg-danfo/30 transition hover:bg-danfo"
              style={{ height: `${Math.max(h, p[valueKey] > 0 ? 4 : 1)}%` }}
              title={`${p.day}: ${p[valueKey].toLocaleString()} ${valueKey}`}
            >
              <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap bg-ink px-1.5 py-0.5 text-[0.6rem] text-paper group-hover:block">
                {p[valueKey]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[0.65rem] text-ink-soft">
        <span>{points[0]?.day?.slice(5)}</span>
        <span>{points[points.length - 1]?.day?.slice(5)}</span>
      </div>
    </div>
  );
}

function ShareBars({ rows, label }: { rows: Array<{ key: string; pageviews: number }>; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r.pageviews));
  if (!rows.length) return <EmptyState>No {label.toLowerCase()} yet.</EmptyState>;
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate font-semibold">{row.key}</span>
            <span className="shrink-0 tabular-nums text-ink-soft">
              {row.pageviews.toLocaleString()}
            </span>
          </div>
          <div className="h-2 border border-ink bg-paper">
            <div
              className="h-full bg-adire"
              style={{ width: `${Math.round((row.pageviews / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const report = await getAnalyticsReport();

  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="First-party traffic — unique visitors, pageviews, top routes, referrers, and devices. Separate from optional GA/GTM in Settings."
        actions={
          <Link
            href="/admin/insights"
            className="ov-btn ov-btn-ghost inline-flex px-3 py-2 text-[0.75rem]"
          >
            Content insights
          </Link>
        }
      />

      <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total visitors"
          primary={report.totals.visitors.toLocaleString()}
          secondary="Unique browsers (cookie)"
        />
        <StatCard
          label="Total pageviews"
          primary={report.totals.pageviews.toLocaleString()}
          secondary="All recorded hits"
        />
        <StatCard
          label="Today"
          primary={report.today.visitors.toLocaleString()}
          secondary={`${report.today.pageviews.toLocaleString()} pageviews`}
        />
        <StatCard
          label="Last 7 days"
          primary={report.last7.visitors.toLocaleString()}
          secondary={`${report.last7.pageviews.toLocaleString()} pageviews`}
        />
      </section>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Last 30 days · visitors"
          primary={report.last30.visitors.toLocaleString()}
        />
        <StatCard
          label="Last 30 days · pageviews"
          primary={report.last30.pageviews.toLocaleString()}
        />
        <StatCard
          label="Pages tracked (30d)"
          primary={report.topPages.length}
          secondary="Distinct paths in window"
        />
        <StatCard
          label="Referrers (30d)"
          primary={report.topReferrers.length}
          secondary="External hosts only"
        />
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <BarChart points={report.daily} valueKey="visitors" />
        <BarChart points={report.daily} valueKey="pageviews" />
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-xl uppercase">Top pages · 30d</h2>
          {!report.topPages.length ? (
            <EmptyState>No pageviews recorded yet.</EmptyState>
          ) : (
            <AdminTable headers={["Path", "Views", "Visitors"]}>
              {report.topPages.map((row) => (
                <tr key={row.key} className="hover:bg-paper">
                  <td className="px-3 py-2 font-mono text-xs">{row.key}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {row.pageviews.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {(row.visitors ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>
        <div>
          <h2 className="mb-3 font-display text-xl uppercase">Top referrers · 30d</h2>
          <div className="border-2 border-ink bg-white p-4">
            <ShareBars rows={report.topReferrers} label="Referrers" />
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-xl uppercase">Devices · 30d</h2>
          <div className="border-2 border-ink bg-white p-4">
            <ShareBars rows={report.devices} label="Devices" />
          </div>
        </div>
        <div>
          <h2 className="mb-3 font-display text-xl uppercase">Countries · 30d</h2>
          <div className="border-2 border-ink bg-white p-4">
            <ShareBars
              rows={report.countries.map((c) => ({
                key: c.key,
                pageviews: c.pageviews,
              }))}
              label="Countries"
            />
            <p className="mt-3 text-[0.7rem] text-ink-soft">
              From edge headers when available (Vercel / Cloudflare). Not every
              hit includes a country.
            </p>
          </div>
        </div>
      </section>

      <h2 className="mb-3 font-display text-xl uppercase">Recent hits</h2>
      {!report.recent.length ? (
        <EmptyState>
          Waiting for the first public pageview. Open the live site to seed the
          counter.
        </EmptyState>
      ) : (
        <AdminTable
          headers={["When", "Path", "Device", "Country", "Referrer", "New?"]}
        >
          {report.recent.map((row) => (
            <tr key={row.id} className="hover:bg-paper">
              <td className="px-3 py-2 whitespace-nowrap text-xs text-ink-soft">
                {formatWhen(row.created_at)}
              </td>
              <td className="px-3 py-2 font-mono text-xs">{row.path}</td>
              <td className="px-3 py-2 text-xs capitalize">{row.device}</td>
              <td className="px-3 py-2 text-xs">{row.country ?? "—"}</td>
              <td className="px-3 py-2 font-mono text-xs">
                {row.referrer_host ?? "—"}
              </td>
              <td className="px-3 py-2 text-xs">
                {row.is_new_visitor ? "Yes" : "—"}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-soft">
        Privacy posture: anonymous cookie IDs only — no IP addresses, no full
        user-agents, no personal profiles. Admin paths and known bots are
        skipped. Optional Google Analytics / GTM (Settings → analytics ID) is
        independent of this first-party log.
      </p>
    </>
  );
}
