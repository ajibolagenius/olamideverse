import { Heart, Playlist, Stamp } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import PosterHero from "@/components/PosterHero";
import StampBoard from "@/components/fanzone/StampBoard";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  getFanByHandle,
  getFanStats,
  getPublicFavorites,
  getPublicPlaylist,
} from "@/lib/fanzone/queries";
import { getFeatureFlags } from "@/lib/settings";
import { safeInternalHref } from "@/lib/security/urls";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const fan = await getFanByHandle(decodeURIComponent(handle));
  if (!fan) return {};
  return resolvePageMetadata({
    title: `${fan.handle}'s Fan Zone`,
    description: `${fan.handle}'s public favorites and playlist on OlamideVerse.`,
    path: `/fanzone/fans/${encodeURIComponent(fan.handle)}`,
  });
}

export default async function PublicFanProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const flags = await getFeatureFlags();
  if (!flags.fanzone) notFound();

  const { handle } = await params;
  const fan = await getFanByHandle(decodeURIComponent(handle));
  if (!fan) notFound();

  const [favorites, playlist, fanStats] = await Promise.all([
    getPublicFavorites(fan.id),
    getPublicPlaylist(fan.id),
    getFanStats(fan.id),
  ]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Fan Zone", href: "/fanzone" },
          { label: "Public fans", href: "/fanzone/fans" },
          { label: fan.handle },
        ]}
      />

      <PosterHero
        eyebrow="Public fan profile"
        title={fan.handle}
        intro="A read-only look at what this fan has favorited and stacked into a playlist."
      />

      <section className="mx-auto max-w-4xl px-5 pt-12 sm:px-8">
        <SectionLabel>Stamps</SectionLabel>
        <h2 className="ov-icon-inline font-display text-display-md mb-5">
          <Stamp className="ov-icon" size={32} aria-hidden />
          {fan.handle}&apos;s stamps
        </h2>
        <StampBoard stats={fanStats} />
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <SectionLabel>Favorites</SectionLabel>
        <h2 className="ov-icon-inline font-display text-display-md mb-5">
          <Heart className="ov-icon" size={32} aria-hidden />
          What {fan.handle} favorited
        </h2>
        {favorites.length === 0 ? (
          <EmptyState icon={Heart} message="No public favorites yet." />
        ) : (
          <div className="flex flex-col gap-2.5">
            {favorites.map((fav) => {
              const href = safeInternalHref(fav.href);
              return (
                <div
                  key={fav.id}
                  className="ov-paste-up border-3 border-ink bg-white px-3.5 py-3 shadow-paste-sm"
                >
                  {href ? (
                    <Link href={href} className="ov-link-underline font-bold">
                      {fav.label}
                    </Link>
                  ) : (
                    <span className="font-bold">{fav.label}</span>
                  )}
                  <small className="block text-xs font-normal tracking-[0.04em] uppercase text-ink-soft">
                    {fav.kind}
                  </small>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <SectionLabel>Playlist</SectionLabel>
        <h2 className="ov-icon-inline font-display text-display-md mb-5">
          <Playlist className="ov-icon" size={32} aria-hidden />
          {fan.handle}&apos;s playlist
        </h2>
        {playlist.length === 0 ? (
          <EmptyState icon={Playlist} message="No public playlist yet." />
        ) : (
          <div className="ov-paste-up border-3 border-ink bg-white shadow-paste">
            {playlist.map((item) => (
              <div
                key={item.id}
                className="border-b-2 border-ink px-3.5 py-2.5 last:border-b-0"
              >
                <span className="text-sm font-semibold">
                  {item.title}
                  {item.subtitle ? (
                    <small className="block text-xs font-normal uppercase text-ink-soft">
                      {item.subtitle}
                    </small>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
