/**
 * Styled wrapper so third-party players sit inside the identity
 * (docs/VISUAL-IDENTITY.md §7). Embeds only — never hosted audio.
 * Pass `removed` when an admin kill-switch blocked the embed ID.
 *
 * YouTube Music shares YouTube video IDs — playback uses the nocookie
 * iframe; `provider="youtubemusic"` labels the chrome and adds a
 * music.youtube.com link-out.
 */
export type EmbedProvider = "spotify" | "youtube" | "youtubemusic";

const PROVIDER_LABEL: Record<EmbedProvider, string> = {
  spotify: "Spotify",
  youtube: "YouTube",
  youtubemusic: "YouTube Music",
};

export default function EmbedFrame({
  title,
  youtubeId,
  spotifyId,
  spotifyType = "track",
  /** Label when the YouTube iframe is the active player. Spotify always wins when present. */
  provider = "youtubemusic",
  removed = false,
}: {
  title: string;
  youtubeId?: string;
  spotifyId?: string;
  spotifyType?: "track" | "album";
  provider?: Exclude<EmbedProvider, "spotify">;
  removed?: boolean;
}) {
  let active: EmbedProvider | null = null;
  let player: React.ReactNode = null;

  if (!removed && spotifyId) {
    active = "spotify";
    player = (
      <iframe
        title={`${title} — Spotify player`}
        src={`https://open.spotify.com/embed/${spotifyType}/${spotifyId}`}
        className={
          spotifyType === "album" ? "h-[352px] w-full" : "h-[152px] w-full"
        }
        loading="lazy"
        allow="encrypted-media"
      />
    );
  } else if (!removed && youtubeId) {
    active = provider;
    player = (
      <iframe
        title={`${title} — ${PROVIDER_LABEL[provider]} player`}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        className="aspect-video w-full"
        loading="lazy"
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div className="ov-tape border-3 border-ink bg-ink shadow-paste-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink-soft/40 px-3.5 py-2 text-[0.7rem] font-bold tracking-[0.06em] uppercase text-ink-muted">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-danfo animate-pulse" aria-hidden />
          <span>
            Archive Embed
            {active ? ` · ${PROVIDER_LABEL[active]}` : null}
          </span>
        </div>
        <span className="truncate font-semibold text-danfo">{title}</span>
      </div>
      {player ?? (
        <div className="border-t border-[#3A332B] px-3 py-6 text-center text-sm text-ink-muted">
          {removed
            ? "This embed was removed at the rights holder's request."
            : "Embed coming in the content pass — no audio is hosted here."}
        </div>
      )}
      {active === "youtubemusic" && youtubeId ? (
        <div className="border-t border-ink-soft/40 px-3.5 py-2 text-right">
          <a
            href={`https://music.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.7rem] font-bold tracking-[0.06em] uppercase text-danfo underline decoration-2 underline-offset-2 hover:text-white"
          >
            Open in YouTube Music →
          </a>
        </div>
      ) : null}
    </div>
  );
}
