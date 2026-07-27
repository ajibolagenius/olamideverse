-- Opt-in public profiles: a fan can flip one switch to make their favorites
-- and playlist browsable by other fans (default off — private, as today).
-- Handles are already public (comment authorship); this extends the same
-- "not sensitive" display data to a fan's saved eras/albums/tracks, never
-- their account/auth details.

alter table public.fans
  add column public_profile boolean not null default false;

-- Existing "a fan manages only their own X" policies stay untouched (still
-- FOR ALL, still owner-only) — these are additive SELECT-only policies that
-- OR in visibility for anyone when the owning fan has opted in.

create policy "public favorites are visible"
  on public.favorites for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.fans f
      where f.id = favorites.fan_id
        and f.public_profile = true
        and f.banned = false
    )
  );

create policy "public playlists are visible"
  on public.playlist_items for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.fans f
      where f.id = playlist_items.fan_id
        and f.public_profile = true
        and f.banned = false
    )
  );

create index fans_public_profile_idx on public.fans (public_profile) where public_profile = true;

-- Table grants for favorites/playlist_items previously covered `authenticated`
-- only (private-by-default); anon needs SELECT too so signed-out visitors can
-- browse an opted-in fan's public profile. RLS above still gates which rows.
grant select on public.favorites to anon;
grant select on public.playlist_items to anon;
