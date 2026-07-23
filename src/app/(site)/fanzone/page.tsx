import {
  ChartBar,
  ChatCircle,
  Heart,
  Playlist,
  UserCircle,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommentBox from "@/components/fanzone/CommentBox";
import FanZoneSignIn from "@/components/fanzone/FanZoneSignIn";
import FavoritesList from "@/components/fanzone/FavoritesList";
import PlaylistPanel from "@/components/fanzone/PlaylistPanel";
import PollCard from "@/components/fanzone/PollCard";
import PosterHero from "@/components/PosterHero";
import SectionLabel from "@/components/ui/SectionLabel";
import { getPollDefs } from "@/lib/fanzone/polls";
import { getComments, getFavorites, getPlaylist, getPollResults } from "@/lib/fanzone/queries";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { getFeatureFlags } from "@/lib/settings";
import { resolvePageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Fan Zone",
    description:
      "Favorite eras and albums, vote in polls, argue in the comments, and build a playlist to share.",
    path: "/fanzone",
  });
}

export default async function FanZonePage() {
  const flags = await getFeatureFlags();
  if (!flags.fanzone) notFound();

  const polls = flags.polls ? await getPollDefs() : [];
  const [favorites, playlist, comments, ...pollResults] = await Promise.all([
    getFavorites(),
    getPlaylist(),
    flags.comments ? getComments("general") : Promise.resolve([]),
    ...polls.map((p) => getPollResults(p.id)),
  ]);

  return (
    <>
      <PosterHero
        eyebrow="Favorites, polls, comments & playlists"
        title={
          <>
            Fan <span className="text-danfo">Zone</span>
          </>
        }
        intro="Favorite eras and albums, vote in polls, argue in the comments, and build a playlist to share. Pick a handle and it's yours — no email, no password."
      />

      <section className="mx-auto max-w-4xl px-5 pt-12 sm:px-8">
        <SectionLabel>Your handle</SectionLabel>
        <h2 className="ov-icon-inline font-display text-display-md mb-5">
          <UserCircle className="ov-icon" size={32} weight={OV_ICON_WEIGHT} aria-hidden />
          Sign in
        </h2>
        <FanZoneSignIn />
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <SectionLabel>Saved from the archive</SectionLabel>
        <h2 className="ov-icon-inline font-display text-display-md mb-5">
          <Heart className="ov-icon" size={32} weight={OV_ICON_WEIGHT} aria-hidden />
          Your favorites
        </h2>
        <FavoritesList initialFavorites={favorites} />
      </section>

      {polls.length > 0 ? (
        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <SectionLabel>Cast a vote</SectionLabel>
          <h2 className="ov-icon-inline font-display text-display-md mb-5">
            <ChartBar className="ov-icon" size={32} weight={OV_ICON_WEIGHT} aria-hidden />
            Polls
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {polls.map((poll, i) => (
              <PollCard
                key={poll.id}
                poll={poll}
                initialCounts={pollResults[i].counts}
                initialUserVote={pollResults[i].userVote}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <SectionLabel>Tracks you stacked</SectionLabel>
        <h2 className="ov-icon-inline font-display text-display-md mb-5">
          <Playlist className="ov-icon" size={32} weight={OV_ICON_WEIGHT} aria-hidden />
          Your playlist
        </h2>
        <PlaylistPanel initialPlaylist={playlist} />
      </section>

      {flags.comments ? (
        <section className="mx-auto max-w-4xl px-5 pt-12 pb-20 sm:px-8">
          <SectionLabel>Talk about it</SectionLabel>
          <h2 className="ov-icon-inline font-display text-display-md mb-5">
            <ChatCircle className="ov-icon" size={32} weight={OV_ICON_WEIGHT} aria-hidden />
            General discussion
          </h2>
          <CommentBox threadId="general" threadLabel="General" initialComments={comments} />
        </section>
      ) : null}
    </>
  );
}
