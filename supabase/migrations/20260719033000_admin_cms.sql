-- Admin console + CMS schema.
-- Editorial content can live here (seeded from content/*.mdx) so the
-- /admin console can edit it without writing to the Vercel filesystem.
-- Public site prefers published CMS rows, falling back to repo MDX.

-- ---------------------------------------------------------------------------
-- Admin identities
-- ---------------------------------------------------------------------------

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null check (role in ('owner', 'editor', 'moderator', 'viewer')),
  disabled boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin ()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid ()
      and disabled = false
  );
$$;

create or replace function public.admin_has_role (allowed text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid ()
      and disabled = false
      and role = any (allowed)
  );
$$;

grant execute on function public.is_admin () to authenticated, anon;
grant execute on function public.admin_has_role (text[]) to authenticated, anon;

create policy "admins can read admin_users"
  on public.admin_users for select
  to authenticated
  using (public.is_admin ());

create policy "owners manage admin_users"
  on public.admin_users for all
  to authenticated
  using (public.admin_has_role (array['owner']))
  with check (public.admin_has_role (array['owner']));

-- ---------------------------------------------------------------------------
-- CMS collections (JSONB mirrors Zod content schemas)
-- ---------------------------------------------------------------------------

create table public.cms_eras (
  slug text primary key,
  data jsonb not null default '{}'::jsonb,
  body text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  context_photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.cms_albums (
  slug text primary key,
  data jsonb not null default '{}'::jsonb,
  body text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  cover_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.cms_media_items (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.cms_pages (
  key text primary key,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.cms_polls (
  id text primary key,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  base_votes jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid (),
  path text not null unique,
  kind text not null default 'other'
    check (kind in ('album-cover', 'era-photo', 'home', 'other')),
  alt text not null default '',
  credit text not null default '',
  license text not null default '',
  license_url text not null default '',
  bytes integer,
  mime text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid (),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  summary text not null default '',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_audit_log_created_at_idx
  on public.admin_audit_log (created_at desc);

-- Public read of published content; admin write for editors+
alter table public.cms_eras enable row level security;
alter table public.cms_albums enable row level security;
alter table public.cms_media_items enable row level security;
alter table public.cms_pages enable row level security;
alter table public.site_settings enable row level security;
alter table public.cms_polls enable row level security;
alter table public.media_assets enable row level security;
alter table public.admin_audit_log enable row level security;

create policy "published eras are public"
  on public.cms_eras for select
  to anon, authenticated
  using (status = 'published' or public.is_admin ());

create policy "admins write eras"
  on public.cms_eras for all
  to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "published albums are public"
  on public.cms_albums for select
  to anon, authenticated
  using (status = 'published' or public.is_admin ());

create policy "admins write albums"
  on public.cms_albums for all
  to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "published media items are public"
  on public.cms_media_items for select
  to anon, authenticated
  using (status = 'published' or public.is_admin ());

create policy "admins write media items"
  on public.cms_media_items for all
  to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "published pages are public"
  on public.cms_pages for select
  to anon, authenticated
  using (status = 'published' or public.is_admin ());

create policy "admins write pages"
  on public.cms_pages for all
  to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "settings readable by admins; public keys later via RPC if needed"
  on public.site_settings for select
  to authenticated
  using (public.is_admin ());

create policy "admins write settings"
  on public.site_settings for all
  to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

-- Public site needs a few settings (disclaimer, nav) — expose published-ish
-- keys to anon via a narrow select of known keys.
create policy "public can read public settings keys"
  on public.site_settings for select
  to anon, authenticated
  using (
    key in (
      'disclaimer',
      'navigation',
      'footer',
      'general',
      'feature_flags'
    )
  );

create policy "active polls are public"
  on public.cms_polls for select
  to anon, authenticated
  using (active = true or public.is_admin ());

create policy "admins write polls"
  on public.cms_polls for all
  to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "assets are public"
  on public.media_assets for select
  to anon, authenticated
  using (true);

create policy "admins write assets"
  on public.media_assets for all
  to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "admins read audit log"
  on public.admin_audit_log for select
  to authenticated
  using (public.is_admin ());

create policy "admins insert audit log"
  on public.admin_audit_log for insert
  to authenticated
  with check (public.is_admin ());

-- Fan Zone moderation: admins can delete any comment / manage fans
create policy "admins can delete any comment"
  on public.comments for delete
  to authenticated
  using (public.admin_has_role (array['owner', 'editor', 'moderator']));

create policy "admins can read all poll votes"
  on public.poll_votes for select
  to authenticated
  using (public.is_admin ());

create policy "admins can delete poll votes"
  on public.poll_votes for delete
  to authenticated
  using (public.admin_has_role (array['owner', 'editor', 'moderator']));

create policy "admins can update any fan"
  on public.fans for update
  to authenticated
  using (public.admin_has_role (array['owner', 'moderator']))
  with check (public.admin_has_role (array['owner', 'moderator']));

create policy "admins can delete fans"
  on public.fans for delete
  to authenticated
  using (public.admin_has_role (array['owner', 'moderator']));

-- Grants for PostgREST
grant select, insert, update, delete on public.admin_users to authenticated;
grant select on public.cms_eras to anon, authenticated;
grant insert, update, delete on public.cms_eras to authenticated;
grant select on public.cms_albums to anon, authenticated;
grant insert, update, delete on public.cms_albums to authenticated;
grant select on public.cms_media_items to anon, authenticated;
grant insert, update, delete on public.cms_media_items to authenticated;
grant select on public.cms_pages to anon, authenticated;
grant insert, update, delete on public.cms_pages to authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant select on public.cms_polls to anon, authenticated;
grant insert, update, delete on public.cms_polls to authenticated;
grant select on public.media_assets to anon, authenticated;
grant insert, update, delete on public.media_assets to authenticated;
grant select, insert on public.admin_audit_log to authenticated;

-- Storage bucket for admin uploads (public read)
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "public read site-media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

create policy "admins upload site-media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'site-media'
    and public.admin_has_role (array['owner', 'editor'])
  );

create policy "admins update site-media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'site-media'
    and public.admin_has_role (array['owner', 'editor'])
  );

create policy "admins delete site-media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'site-media'
    and public.admin_has_role (array['owner', 'editor'])
  );
