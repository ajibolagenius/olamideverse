/**
 * Styled wrapper so third-party players sit inside the identity
 * (docs/VISUAL-IDENTITY.md §7). Embeds only — never hosted audio.
 */
export default function EmbedFrame({
  title,
  youtubeId,
  spotifyId,
  spotifyType = "track",
}: {
  title: string;
  youtubeId?: string;
  spotifyId?: string;
  spotifyType?: "track" | "album";
}) {
  let player: React.ReactNode = null;
  if (spotifyId) {
    player = (
      <iframe
        title={`${title} — Spotify player`}
        src={`https://open.spotify.com/embed/${spotifyType}/${spotifyId}`}
        className="h-[152px] w-full"
        loading="lazy"
        allow="encrypted-media"
      />
    );
  } else if (youtubeId) {
    player = (
      <iframe
        title={`${title} — YouTube player`}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        className="aspect-video w-full"
        loading="lazy"
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div className="border-[3px] border-ink bg-ink shadow-paste-sm">
      <div className="flex items-center justify-between px-3 py-1.5 text-[0.68rem] tracking-[0.06em] uppercase text-ink-muted">
        <span>Now playing</span>
        <span className="text-danfo">{title}</span>
      </div>
      {player ?? (
        <div className="border-t border-[#3A332B] px-3 py-6 text-center text-sm text-ink-muted">
          Embed coming in the content pass — no audio is hosted here.
        </div>
      )}
    </div>
  );
}
