-- Fan Zone (Phase 3) schema.
--
-- Ports the client-only localStorage model from the design's
-- fanzone-store.js (ovfz_handle, ovfz_favorites, ovfz_polls,
-- ovfz_comments, ovfz_playlist) onto Postgres, one table per key.
--
-- Identity: a fan picks a handle, which signs them in via Supabase
-- anonymous auth — no email/password friction, but every row is owned by
-- a real auth.uid() so RLS can enforce it at the database layer instead
-- of trusting the client (the original design's "not real auth" only had
-- app-level trust). Poll definitions (question/options/seed counts) stay
-- static in the Next.js app, matching the design's POLL_DEFS — only the
-- votes themselves live here.

-- One row per fan, keyed to their anonymous auth identity. Handles are
-- public display names (shown as "Signed in as BarigaFan" to everyone,
-- comment authorship, etc.) — not sensitive.
create table public.fans (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text not null unique check (char_length(handle) between 2 and 24),
  created_at timestamptz not null default now()
);

alter table public.fans enable row level security;

create policy "handles are public"
  on public.fans for select
  to anon, authenticated
  using (true);

create policy "a fan can create their own row"
  on public.fans for insert
  to authenticated
  with check (auth.uid () = id);

create policy "a fan can rename themselves"
  on public.fans for update
  to authenticated
  using (auth.uid () = id)
  with check (auth.uid () = id);

-- Favorited eras/albums. target_id mirrors the design's component id prop
-- (e.g. "era:upstart", "album:rapsodi"); private to the owning fan.
create table public.favorites (
  id uuid primary key default gen_random_uuid (),
  fan_id uuid not null references public.fans (id) on delete cascade,
  target_id text not null,
  label text not null,
  kind text not null check (kind in ('era', 'album')),
  href text not null,
  created_at timestamptz not null default now(),
  unique (fan_id, target_id)
);

create index favorites_fan_id_idx on public.favorites (fan_id);

alter table public.favorites enable row level security;

create policy "a fan manages only their own favorites"
  on public.favorites for all
  to authenticated
  using (auth.uid () = fan_id)
  with check (auth.uid () = fan_id);

-- One vote per fan per poll — the unique constraint is the "vote once"
-- enforcement the design calls for. poll_id/option_id reference the
-- static POLL_DEFS in the app, not a DB table.
create table public.poll_votes (
  id uuid primary key default gen_random_uuid (),
  fan_id uuid not null references public.fans (id) on delete cascade,
  poll_id text not null,
  option_id text not null,
  created_at timestamptz not null default now(),
  unique (fan_id, poll_id)
);

create index poll_votes_poll_id_idx on public.poll_votes (poll_id);

alter table public.poll_votes enable row level security;

create policy "a fan sees only their own vote"
  on public.poll_votes for select
  to authenticated
  using (auth.uid () = fan_id);

create policy "a fan can vote once per poll"
  on public.poll_votes for insert
  to authenticated
  with check (auth.uid () = fan_id);

-- Public aggregate counts per poll option — lets the UI show results to
-- everyone without exposing who voted for what.
create view public.poll_results
with (security_invoker = true) as
select poll_id, option_id, count(*)::int as votes
from public.poll_votes
group by poll_id, option_id;

grant select on public.poll_results to anon, authenticated;

-- Comments on an era/album/general thread — public read (it's a comment
-- section), write/delete restricted to the authoring fan.
create table public.comments (
  id uuid primary key default gen_random_uuid (),
  thread_id text not null,
  fan_id uuid not null references public.fans (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index comments_thread_id_idx on public.comments (thread_id, created_at desc);

alter table public.comments enable row level security;

create policy "comments are public"
  on public.comments for select
  to anon, authenticated
  using (true);

create policy "a signed-in fan can comment as themselves"
  on public.comments for insert
  to authenticated
  with check (auth.uid () = fan_id);

create policy "a fan can delete their own comment"
  on public.comments for delete
  to authenticated
  using (auth.uid () = fan_id);

-- Shareable playlist — ordered, private to the owning fan (the "copy
-- share link" flow in the design base64-encodes a snapshot client-side
-- rather than needing a public read policy here).
create table public.playlist_items (
  id uuid primary key default gen_random_uuid (),
  fan_id uuid not null references public.fans (id) on delete cascade,
  track_id text not null,
  title text not null,
  subtitle text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (fan_id, track_id)
);

create index playlist_items_fan_id_idx on public.playlist_items (fan_id, position);

alter table public.playlist_items enable row level security;

create policy "a fan manages only their own playlist"
  on public.playlist_items for all
  to authenticated
  using (auth.uid () = fan_id)
  with check (auth.uid () = fan_id);
