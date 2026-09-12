/**
 * Styled wrapper so third-party players sit inside the identity
 * (docs/VISUAL-IDENTITY.md §7). Embeds only — never hosted audio.
 * Pass `removed` when an admin kill-switch blocked every embed ID.
 *
 * Precedence is Spotify → Apple Music → YouTube/YTM → Audiomack. Spotify
 * wins because it is the only provider with a compact 152px track player.
 * Whatever does not win becomes a link-out, so a reader on their own
 * subscription can open the track where their licence lives.
 *
 * YouTube Music shares YouTube video IDs — playback uses the nocookie
 * iframe; `provider="youtubemusic"` labels the chrome and adds a
 * music.youtube.com link-out.
 *
 * Every ID is shape-checked before it reaches an iframe `src`
 * (src/lib/security/urls.ts). A malformed catalogue row renders as "no
 * embed", never as a frame pointed somewhere unexpected.
 */
import {
  safeAppleMusicId,
  safeAudiomackEmbedSrc,
  safeAudiomackPageUrl,
  safeSpotifyId,
  safeYoutubeId,
} from "@/lib/security/urls";

export type EmbedProvider =
  | "spotify"
  | "applemusic"
  | "youtube"
  | "youtubemusic"
  | "audiomack";

const PROVIDER_LABEL: Record<EmbedProvider, string> = {
  spotify: "Spotify",
  applemusic: "Apple Music",
  youtube: "YouTube",
  youtubemusic: "YouTube Music",
  audiomack: "Audiomack",
};

/** Apple Music embeds are storefront-scoped; this archive is Nigerian. */
const APPLE_STOREFRONT = "ng";

export default function EmbedFrame({
  title,
  youtubeId,
  spotifyId,
  spotifyType = "track",
  appleMusicId,
  audiomackUrl,
  /** Label when the YouTube iframe is the active player. Spotify always wins when present. */
  provider = "youtubemusic",
  removed = false,
}: {
  title: string;
  youtubeId?: string;
  spotifyId?: string;
  spotifyType?: "track" | "album";
  appleMusicId?: string;
  audiomackUrl?: string;
  provider?: Exclude<EmbedProvider, "spotify" | "applemusic" | "audiomack">;
  removed?: boolean;
}) {
  const spotify = removed ? undefined : safeSpotifyId(spotifyId);
  const apple = removed ? undefined : safeAppleMusicId(appleMusicId);
  const youtube = removed ? undefined : safeYoutubeId(youtubeId);
  const audiomack = removed ? undefined : safeAudiomackEmbedSrc(audiomackUrl);

  let active: EmbedProvider | null = null;
  let player: React.ReactNode = null;

  if (spotify) {
    active = "spotify";
    player = (
      <iframe
        title={`${title} — Spotify player`}
        src={`https://open.spotify.com/embed/${spotifyType}/${spotify}`}
        className={
          spotifyType === "album" ? "h-[352px] w-full" : "h-[152px] w-full"
        }
        loading="lazy"
        allow="encrypted-media"
      />
    );
  } else if (apple) {
    active = "applemusic";
    player = (
      <iframe
        title={`${title} — Apple Music player`}
        src={`https://embed.music.apple.com/${APPLE_STOREFRONT}/song/${apple}`}
        className="h-[175px] w-full"
        loading="lazy"
        allow="encrypted-media"
      />
    );
  } else if (youtube) {
    active = provider;
    player = (
      <iframe
        title={`${title} — ${PROVIDER_LABEL[provider]} player`}
        src={`https://www.youtube-nocookie.com/embed/${youtube}`}
        className="aspect-video w-full"
        loading="lazy"
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  } else if (audiomack) {
    active = "audiomack";
    player = (
      <iframe
        title={`${title} — Audiomack player`}
        src={audiomack}
        className="h-[252px] w-full"
        loading="lazy"
        allow="encrypted-media"
      />
    );
  }

  // Everything playable that isn't the active player becomes a link-out.
  const linkOuts: Array<{ label: string; href: string }> = [];
  if (active !== "applemusic" && apple) {
    linkOuts.push({
      label: "Apple Music",
      href: `https://music.apple.com/${APPLE_STOREFRONT}/song/${apple}`,
    });
  }
  // The YTM "player" is really the YouTube iframe, so its link-out to
  // music.youtube.com still earns its place; a plain YouTube player's does not.
  if (youtube && active !== "youtube") {
    linkOuts.push({
      label: PROVIDER_LABEL[provider],
      href:
        provider === "youtubemusic"
          ? `https://music.youtube.com/watch?v=${youtube}`
          : `https://www.youtube.com/watch?v=${youtube}`,
    });
  }
  const audiomackPage = safeAudiomackPageUrl(audiomackUrl);
  if (active !== "audiomack" && audiomackPage) {
    linkOuts.push({ label: "Audiomack", href: audiomackPage });
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
      {linkOuts.length > 0 ? (
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 border-t border-ink-soft/40 px-3.5 py-2">
          {linkOuts.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.7rem] font-bold tracking-[0.06em] uppercase text-danfo underline decoration-2 underline-offset-2 hover:text-white"
            >
              Open in {link.label} →
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
