-- Security hardening pass 2 (secure-me fixes):
--   1. Durable rate-limit helper for analytics + Fan Zone signup
--   2. Stop exposing takedownEmail via public site_settings.general
--   3. Favorites: constrain href to same-origin relative paths at DB layer

-- ---------------------------------------------------------------------------
-- 1. Rate limits (service_role writes via RPC)
-- ---------------------------------------------------------------------------

create table if not exists public.rate_limits (
  key text primary key,
  window_start timestamptz not null,
  hit_count integer not null default 0
);

alter table public.rate_limits enable row level security;
-- No policies for anon/authenticated — service_role bypasses RLS.

create or replace function public.check_rate_limit (
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window interval := make_interval(secs => greatest(p_window_seconds, 1));
  v_start timestamptz;
  v_count integer;
begin
  if p_key is null or length(trim(p_key)) = 0 then
    return false;
  end if;

  select window_start, hit_count
  into v_start, v_count
  from public.rate_limits
  where key = p_key
  for update;

  if not found then
    insert into public.rate_limits (key, window_start, hit_count)
    values (p_key, v_now, 1);
    return true;
  end if;

  if v_now - v_start >= v_window then
    update public.rate_limits
    set window_start = v_now, hit_count = 1
    where key = p_key;
    return true;
  end if;

  if v_count >= p_limit then
    return false;
  end if;

  update public.rate_limits
  set hit_count = hit_count + 1
  where key = p_key;
  return true;
end;
$$;

revoke all on function public.check_rate_limit (text, integer, integer) from public;
grant execute on function public.check_rate_limit (text, integer, integer) to service_role;

-- ---------------------------------------------------------------------------
-- 2. Public general settings — scrub sensitive fields (takedownEmail)
-- ---------------------------------------------------------------------------

drop policy if exists "public can read public settings keys" on public.site_settings;

create policy "public can read public settings keys"
  on public.site_settings for select
  to anon, authenticated
  using (
    key in (
      'disclaimer',
      'navigation',
      'footer',
      'feature_flags'
      -- 'general' removed: contains takedownEmail; use get_public_general()
    )
  );

create or replace function public.get_public_general ()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select jsonb_build_object(
        'siteName', coalesce(value ->> 'siteName', 'OlamideVerse'),
        'analyticsId', coalesce(value ->> 'analyticsId', '')
      )
      from public.site_settings
      where key = 'general'
    ),
    jsonb_build_object('siteName', 'OlamideVerse', 'analyticsId', '')
  );
$$;

revoke all on function public.get_public_general () from public;
grant execute on function public.get_public_general () to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Favorites href must be a same-site relative path
-- ---------------------------------------------------------------------------

-- Drop unsafe favorite targets before enforcing the path check.
delete from public.favorites
where href is null
  or href !~ '^/[^/]'
  or href ~ '://'
  or char_length(href) < 2
  or char_length(href) > 200;

alter table public.favorites
  drop constraint if exists favorites_href_internal_check;

alter table public.favorites
  add constraint favorites_href_internal_check
  check (
    href ~ '^/[^/]'
    and href !~ '://'
    and char_length(href) between 2 and 200
  );
