import Link from "next/link";
import { AdminButton, AdminPageHeader, StatusBadge } from "@/components/admin/ui";
import { getHealthReport } from "@/lib/admin/health";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const health = await getHealthReport();

  const [
    eras,
    albums,
    media,
    comments,
    fans,
    draftsEras,
    draftsAlbums,
    draftsMedia,
    audit,
    pollVotes,
  ] = await Promise.all([
    supabase.from("cms_eras").select("slug", { count: "exact", head: true }),
    supabase.from("cms_albums").select("slug", { count: "exact", head: true }),
    supabase.from("cms_media_items").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase.from("fans").select("id", { count: "exact", head: true }),
    supabase.from("cms_eras").select("slug", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("cms_albums").select("slug", { count: "exact", head: true }).eq("status", "draft"),
    supabase
      .from("cms_media_items")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("admin_audit_log")
      .select("id, action, entity_type, entity_id, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("poll_votes").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Eras", count: eras.count ?? 0, href: "/admin/eras" },
    { label: "Albums", count: albums.count ?? 0, href: "/admin/albums" },
    { label: "Media", count: media.count ?? 0, href: "/admin/media" },
    { label: "Comments", count: comments.count ?? 0, href: "/admin/fanzone/comments" },
    { label: "Fans", count: fans.count ?? 0, href: "/admin/fanzone/fans" },
    {
      label: "Drafts",
      count:
        (draftsEras.count ?? 0) + (draftsAlbums.count ?? 0) + (draftsMedia.count ?? 0),
      href: "/admin/drafts",
    },
    { label: "Open reports", count: health.openReports, href: "/admin/fanzone/reports" },
    { label: "Poll votes", count: pollVotes.count ?? 0, href: "/admin/fanzone/polls" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Content health, Fan Zone pulse, launch checklist, and recent staff activity."
        actions={
          <>
            <AdminButton href="/admin/albums/new">New album</AdminButton>
            <AdminButton href="/admin/media/new" variant="secondary">
              New media
            </AdminButton>
            <AdminButton href="/admin/assets" variant="secondary">
              Upload asset
            </AdminButton>
            <AdminButton href="/" variant="secondary">
              Preview site
            </AdminButton>
          </>
        }
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#181410] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#181410]"
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
              {card.label}
            </p>
            <p className="mt-2 font-display text-4xl">{card.count}</p>
          </Link>
        ))}
      </div>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="border-2 border-ink bg-white p-4">
          <h2 className="mb-3 font-display text-xl uppercase">Launch checklist</h2>
          <ul className="space-y-2 text-sm">
            {health.checklist.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3">
                <span className={item.ok ? "text-palm" : "text-oxide"}>
                  {item.ok ? "✓" : "○"} {item.label}
                </span>
                <Link href={item.href} className="text-xs font-bold uppercase text-adire underline">
                  Fix
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-2 border-ink bg-white p-4">
          <h2 className="mb-3 font-display text-xl uppercase">Content health</h2>
          <ul className="space-y-2 text-sm">
            <li>
              Missing covers: <b>{health.missingCovers.length}</b>
            </li>
            <li>
              Media without YouTube ID: <b>{health.missingYoutube.length}</b>
            </li>
            <li>
              Eras without albums: <b>{health.erasWithoutAlbums.length}</b>
            </li>
            <li>
              Open takedowns: <b>{health.openTakedowns}</b>
            </li>
            <li>
              Scheduled publishes: <b>{health.scheduledPending}</b>
            </li>
          </ul>
          <Link
            href="/admin/insights"
            className="mt-3 inline-block text-xs font-bold uppercase text-adire underline"
          >
            Open insights →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl uppercase">Recent activity</h2>
        {audit.data?.length ? (
          <ul className="divide-y divide-ink/15 border-2 border-ink bg-white">
            {audit.data.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center gap-3 px-3 py-3 text-sm"
              >
                <StatusBadge status={row.action} />
                <span className="font-medium">
                  {row.summary || `${row.entity_type}:${row.entity_id}`}
                </span>
                <span className="ml-auto text-xs text-ink-soft">
                  {new Date(row.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-2 border-dashed border-ink/30 bg-white px-4 py-8 text-center text-sm text-ink-soft">
            No audit events yet.
          </p>
        )}
      </section>
    </>
  );
}
