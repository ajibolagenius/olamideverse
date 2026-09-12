-- Apple Music and YouTube Music joined the player (EmbedFrame), so the
-- takedown kill-switch has to be able to name them. Without this, a rights
-- holder's request against an Apple Music ID has nowhere to land and the
-- only remedy is a redeploy.
--
-- 'youtubemusic' is accepted for symmetry with the admin UI; the app already
-- treats it and 'youtube' as one family (src/lib/embeds.ts) because they
-- share video IDs, so either spelling kills both.

alter table public.embed_blocks
  drop constraint if exists embed_blocks_provider_check;

alter table public.embed_blocks
  add constraint embed_blocks_provider_check
  check (
    provider in (
      'spotify',
      'applemusic',
      'youtube',
      'youtubemusic',
      'audiomack',
      'any'
    )
  );
