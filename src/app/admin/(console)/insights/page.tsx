import Link from "next/link";
import { AdminPageHeader, AdminTable, EmptyState } from "@/components/admin/ui";
import { getHealthReport } from "@/lib/admin/health";
import { createClient } from "@/lib/supabase/server";

export default async function AdminInsightsPage() {
  const health = await getHealthReport();
  const supabase = await createClient();

  const [favs, comments, albums, eras] = await Promise.all([
    supabase.from("favorites").select("target_id, kind"),
    supabase.from("comments").select("thread_id"),
    supabase.from("cms_albums").select("slug, data, cover_path, status"),
    supabase.from("cms_eras").select("slug, data, status"),
  ]);

  const favCounts = new Map<string, number>();
  for (const f of favs.data ?? []) {
    favCounts.set(f.target_id, (favCounts.get(f.target_id) ?? 0) + 1);
  }
  const topFavorites = [...favCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const commentCounts = new Map<string, number>();
  for (const c of comments.data ?? []) {
    commentCounts.set(c.thread_id, (commentCounts.get(c.thread_id) ?? 0) + 1);
  }

  const publishedEras = (eras.data ?? []).filter((e) => e.status === "published");
  const completeness = publishedEras.map((era) => {
    const eraAlbums = (albums.data ?? []).filter(
      (a) =>
        a.status === "published" &&
        (a.data as { era?: string }).era === era.slug,
    );
    const withCover = eraAlbums.filter((a) => a.cover_path).length;
    const score =
      eraAlbums.length === 0
        ? 0
        : Math.round((withCover / eraAlbums.length) * 100);
    return {
      slug: era.slug,
      title: String((era.data as { title?: string }).title ?? era.slug),
      albums: eraAlbums.length,
      withCover,
      score,
    };
  });

  const { data: assets } = await supabase
    .from("media_assets")
    .select("path, alt, credit")
    .limit(500);
  const missingAlt = (assets ?? []).filter((a) => !a.alt || !a.credit);

  return (
    <>
      <AdminPageHeader
        title="Insights"
        description="Completeness scores, missing metadata, favorites heat, and embed gaps."
      />

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Missing covers", health.missingCovers.length],
          ["Missing YT IDs", health.missingYoutube.length],
          ["Assets missing credit/alt", missingAlt.length],
          ["Open reports", health.openReports],
        ].map(([label, n]) => (
          <div key={String(label)} className="border-2 border-ink bg-white p-4">
            <p className="text-[0.65rem] font-bold uppercase text-ink-soft">
              {label}
            </p>
            <p className="mt-2 font-display text-3xl">{n as number}</p>
          </div>
        ))}
      </section>

      <h2 className="mb-3 font-display text-xl uppercase">Era completeness</h2>
      <AdminTable headers={["Era", "Albums", "With cover", "Score"]}>
        {completeness.map((row) => (
          <tr key={row.slug} className="hover:bg-paper">
            <td className="px-3 py-2 font-semibold">{row.title}</td>
            <td className="px-3 py-2">{row.albums}</td>
            <td className="px-3 py-2">{row.withCover}</td>
            <td className="px-3 py-2">{row.score}%</td>
          </tr>
        ))}
      </AdminTable>

      <h2 className="mt-10 mb-3 font-display text-xl uppercase">Top favorites</h2>
      {!topFavorites.length ? (
        <EmptyState>No favorites yet.</EmptyState>
      ) : (
        <AdminTable headers={["Target", "Count"]}>
          {topFavorites.map(([id, count]) => (
            <tr key={id}>
              <td className="px-3 py-2 font-mono text-xs">{id}</td>
              <td className="px-3 py-2">{count}</td>
            </tr>
          ))}
        </AdminTable>
      )}

      <h2 className="mt-10 mb-3 font-display text-xl uppercase">
        Missing YouTube IDs
      </h2>
      {!health.missingYoutube.length ? (
        <EmptyState>All published media have YouTube IDs.</EmptyState>
      ) : (
        <ul className="border-2 border-ink bg-white divide-y divide-ink/15">
          {health.missingYoutube.map((m) => (
            <li key={m.id} className="flex justify-between px-3 py-2 text-sm">
              <span>{m.title}</span>
              <Link
                href={`/admin/media/${m.id}`}
                className="text-xs font-bold uppercase text-adire underline"
              >
                Fix
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs text-ink-soft">
        Comment threads: {commentCounts.size} active · Performance / Lighthouse
        hooks can plug into CI separately.
      </p>
    </>
  );
}
