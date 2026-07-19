-- Completes admin console ops: redirects, SEO, compliance, reports,
-- bans, content versions, schedules, media slots, preview tokens.

alter table public.fans
  add column if not exists banned boolean not null default false,
  add column if not exists ban_reason text not null default '';

create table if not exists public.cms_redirects (
  id uuid primary key default gen_random_uuid (),
  from_path text not null unique,
  to_path text not null,
  permanent boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.cms_seo (
  path text primary key,
  title text not null default '',
  description text not null default '',
  og_image text not null default '',
  noindex boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.legal_takedowns (
  id uuid primary key default gen_random_uuid (),
  requester text not null default '',
  contact text not null default '',
  target_type text not null default 'other'
    check (target_type in ('embed', 'image', 'page', 'comment', 'other')),
  target_ref text not null default '',
  notes text not null default '',
  status text not null default 'open'
    check (status in ('open', 'actioned', 'rejected', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.embed_blocks (
  id uuid primary key default gen_random_uuid (),
  provider text not null check (provider in ('spotify', 'youtube', 'audiomack', 'any')),
  embed_id text not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  unique (provider, embed_id)
);

create table if not exists public.fan_reports (
  id uuid primary key default gen_random_uuid (),
  reporter_fan_id uuid references public.fans (id) on delete set null,
  target_type text not null check (target_type in ('comment', 'fan', 'playlist', 'other')),
  target_id text not null,
  reason text not null default '',
  status text not null default 'open'
    check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users (id) on delete set null
);

create table if not exists public.cms_versions (
  id uuid primary key default gen_random_uuid (),
  entity_type text not null,
  entity_id text not null,
  snapshot jsonb not null default '{}'::jsonb,
  summary text not null default '',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

create index if not exists cms_versions_entity_idx
  on public.cms_versions (entity_type, entity_id, created_at desc);

create table if not exists public.cms_schedules (
  id uuid primary key default gen_random_uuid (),
  entity_type text not null check (entity_type in ('era', 'album', 'media', 'page')),
  entity_id text not null,
  publish_at timestamptz not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'published', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  unique (entity_type, entity_id)
);

create table if not exists public.media_slots (
  slot_id text primary key,
  path text not null,
  label text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.preview_tokens (
  token text primary key,
  entity_type text not null,
  entity_id text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

-- RLS
alter table public.cms_redirects enable row level security;
alter table public.cms_seo enable row level security;
alter table public.legal_takedowns enable row level security;
alter table public.embed_blocks enable row level security;
alter table public.fan_reports enable row level security;
alter table public.cms_versions enable row level security;
alter table public.cms_schedules enable row level security;
alter table public.media_slots enable row level security;
alter table public.preview_tokens enable row level security;

create policy "admins manage redirects"
  on public.cms_redirects for all to authenticated
  using (public.is_admin ()) with check (public.admin_has_role (array['owner', 'editor']));

create policy "public read redirects"
  on public.cms_redirects for select to anon, authenticated using (true);

create policy "admins manage seo"
  on public.cms_seo for all to authenticated
  using (public.is_admin ()) with check (public.admin_has_role (array['owner', 'editor']));

create policy "public read seo"
  on public.cms_seo for select to anon, authenticated using (true);

create policy "admins manage takedowns"
  on public.legal_takedowns for all to authenticated
  using (public.admin_has_role (array['owner', 'editor', 'moderator']))
  with check (public.admin_has_role (array['owner', 'editor', 'moderator']));

create policy "admins manage embed blocks"
  on public.embed_blocks for all to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "public read embed blocks"
  on public.embed_blocks for select to anon, authenticated using (true);

create policy "admins manage reports"
  on public.fan_reports for all to authenticated
  using (public.admin_has_role (array['owner', 'editor', 'moderator']))
  with check (public.admin_has_role (array['owner', 'editor', 'moderator']));

create policy "fans can file reports"
  on public.fan_reports for insert to authenticated
  with check (auth.uid () = reporter_fan_id);

create policy "admins manage versions"
  on public.cms_versions for all to authenticated
  using (public.is_admin ()) with check (public.is_admin ());

create policy "admins manage schedules"
  on public.cms_schedules for all to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "admins manage slots"
  on public.media_slots for all to authenticated
  using (public.admin_has_role (array['owner', 'editor']))
  with check (public.admin_has_role (array['owner', 'editor']));

create policy "public read slots"
  on public.media_slots for select to anon, authenticated using (true);

create policy "admins manage preview tokens"
  on public.preview_tokens for all to authenticated
  using (public.is_admin ()) with check (public.is_admin ());

create policy "public read valid preview tokens"
  on public.preview_tokens for select to anon, authenticated
  using (expires_at > now());

-- Grants
grant select on public.cms_redirects to anon, authenticated;
grant insert, update, delete on public.cms_redirects to authenticated, service_role;
grant select on public.cms_seo to anon, authenticated;
grant insert, update, delete on public.cms_seo to authenticated, service_role;
grant select, insert, update, delete on public.legal_takedowns to authenticated, service_role;
grant select on public.embed_blocks to anon, authenticated;
grant insert, update, delete on public.embed_blocks to authenticated, service_role;
grant select, insert, update, delete on public.fan_reports to authenticated, service_role;
grant select, insert, update, delete on public.cms_versions to authenticated, service_role;
grant select, insert, update, delete on public.cms_schedules to authenticated, service_role;
grant select on public.media_slots to anon, authenticated;
grant insert, update, delete on public.media_slots to authenticated, service_role;
grant select on public.preview_tokens to anon, authenticated;
grant insert, update, delete on public.preview_tokens to authenticated, service_role;
