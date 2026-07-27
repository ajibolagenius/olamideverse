import { UsersThree } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import PosterHero from "@/components/PosterHero";
import { getPublicFans } from "@/lib/fanzone/queries";
import { getFeatureFlags } from "@/lib/settings";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Public fans",
    description: "Browse the favorites and playlists fans have opted to share.",
    path: "/fanzone/fans",
  });
}

export default async function PublicFansPage() {
  const flags = await getFeatureFlags();
  if (!flags.fanzone) notFound();

  const fans = await getPublicFans();

  return (
    <>
      <Breadcrumb items={[{ label: "Fan Zone", href: "/fanzone" }, { label: "Public fans" }]} />

      <PosterHero
        eyebrow="Opted-in fan profiles"
        title={
          <>
            Public <span className="text-danfo">fans</span>
          </>
        }
        intro="Fans who've flipped on a public profile — browse what they've favorited and stacked into a playlist. Flip your own on from the Fan Zone account panel."
      />

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        {fans.length === 0 ? (
          <EmptyState
            icon={UsersThree}
            message="No public profiles yet — be the first to opt in from your Fan Zone account panel."
          />
        ) : (
          <ul className="ov-paste-up border-3 border-ink bg-white shadow-paste">
            {fans.map((fan) => (
              <li key={fan.handle} className="border-b-2 border-ink last:border-b-0">
                <Link
                  href={`/fanzone/fans/${encodeURIComponent(fan.handle)}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-paper-dim"
                >
                  <span className="font-bold">{fan.handle}</span>
                  <span className="ov-btn ov-btn-ghost px-3 py-1.5 text-xs">View profile →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
