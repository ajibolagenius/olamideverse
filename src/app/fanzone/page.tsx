import type { Metadata } from "next";
import CommentBox from "@/components/fanzone/CommentBox";
import FanZoneSignIn from "@/components/fanzone/FanZoneSignIn";
import FavoritesList from "@/components/fanzone/FavoritesList";
import PlaylistPanel from "@/components/fanzone/PlaylistPanel";
import PollCard from "@/components/fanzone/PollCard";
import PosterHero from "@/components/PosterHero";
import { POLL_DEFS } from "@/lib/fanzone/polls";
import { getComments, getFavorites, getPlaylist, getPollResults } from "@/lib/fanzone/queries";

export const metadata: Metadata = {
  title: "Fan Zone",
  description:
    "Favorite eras and albums, vote in polls, argue in the comments, and build a playlist to share.",
};

export default async function FanZonePage() {
  const [favorites, playlist, comments, ...pollResults] = await Promise.all([
    getFavorites(),
    getPlaylist(),
    getComments("general"),
    ...POLL_DEFS.map((p) => getPollResults(p.id)),
  ]);

  return (
    <>
      <PosterHero
        eyebrow="Favorites, polls, comments & playlists"
        title="Fan Zone"
        intro="Favorite eras and albums, vote in polls, argue in the comments, and build a playlist to share. Pick a handle and it's yours — no email, no password."
      />

      <section className="mx-auto max-w-4xl px-5 pt-12 sm:px-8">
        <FanZoneSignIn />
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <h2 className="font-display text-display-md mb-5">Your favorites</h2>
        <FavoritesList initialFavorites={favorites} />
      </section>

      {POLL_DEFS.length > 0 ? (
        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <h2 className="font-display text-display-md mb-5">Polls</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {POLL_DEFS.map((poll, i) => (
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
        <h2 className="font-display text-display-md mb-5">Your playlist</h2>
        <PlaylistPanel initialPlaylist={playlist} />
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-12 pb-20 sm:px-8">
        <h2 className="font-display text-display-md mb-5">General discussion</h2>
        <CommentBox threadId="general" threadLabel="General" initialComments={comments} />
      </section>
    </>
  );
}
