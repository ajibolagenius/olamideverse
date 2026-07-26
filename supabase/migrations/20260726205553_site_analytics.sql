-- First-party site analytics: anonymous pageviews + visitor counter.
-- Writes go through the Next.js collect route (service role). Admins read
-- via RLS + is_admin(). The public footer badge only reads aggregate counters.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.analytics_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  path text not null,
  referrer_host text,
  visitor_id uuid not null,
  session_id uuid not null,
  device text not null default 'unknown'
    check (device in ('mobile', 'tablet', 'desktop', 'unknown')),
  country text,
  is_new_visitor boolean not null default false
);

create index analytics_events_created_at_idx
  on public.analytics_events (created_at desc);
create index analytics_events_path_created_at_idx
  on public.analytics_events (path, created_at desc);
create index analytics_events_visitor_id_idx
  on public.analytics_events (visitor_id);

create table public.analytics_visitors (
  visitor_id uuid primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  visit_count integer not null default 1
);

create table public.analytics_daily (
  day date not null,
  path text not null default '',
  pageviews bigint not null default 0,
  visitors bigint not null default 0,
  primary key (day, path)
);

create index analytics_daily_day_idx on public.analytics_daily (day desc);

-- Visitor uniques per day (site-wide). Used to bump analytics_daily.visitors
-- without double-counting the same cookie on refresh.
create table public.analytics_daily_visitors (
  day date not null,
  visitor_id uuid not null,
  primary key (day, visitor_id)
);

create table public.analytics_counters (
  key text primary key,
  value bigint not null default 0
);

insert into public.analytics_counters (key, value)
values
  ('total_pageviews', 0),
  ('total_visitors', 0);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.analytics_events enable row level security;
alter table public.analytics_visitors enable row level security;
alter table public.analytics_daily enable row level security;
alter table public.analytics_daily_visitors enable row level security;
alter table public.analytics_counters enable row level security;

-- Admins can inspect everything.
create policy "admins read analytics events"
  on public.analytics_events for select
  to authenticated
  using (public.is_admin ());

create policy "admins read analytics visitors"
  on public.analytics_visitors for select
  to authenticated
  using (public.is_admin ());

create policy "admins read analytics daily"
  on public.analytics_daily for select
  to authenticated
  using (public.is_admin ());

create policy "admins read analytics daily visitors"
  on public.analytics_daily_visitors for select
  to authenticated
  using (public.is_admin ());

create policy "admins read analytics counters"
  on public.analytics_counters for select
  to authenticated
  using (public.is_admin ());

-- Public footer badge: aggregate totals only (no paths / visitor ids).
create policy "public read analytics counters"
  on public.analytics_counters for select
  to anon, authenticated
  using (key in ('total_pageviews', 'total_visitors'));

-- ---------------------------------------------------------------------------
-- Data API grants (RLS still applies)
-- ---------------------------------------------------------------------------

grant select on public.analytics_counters to anon, authenticated;
grant select on public.analytics_events to authenticated;
grant select on public.analytics_visitors to authenticated;
grant select on public.analytics_daily to authenticated;
grant select on public.analytics_daily_visitors to authenticated;

-- ---------------------------------------------------------------------------
-- Atomic record helper (service role / postgres). Keeps counters + daily
-- rollups consistent with the event insert.
-- ---------------------------------------------------------------------------

create or replace function public.record_analytics_pageview (
  p_path text,
  p_visitor_id uuid,
  p_session_id uuid,
  p_referrer_host text default null,
  p_device text default 'unknown',
  p_country text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date := (timezone('utc', now()))::date;
  v_is_new boolean := false;
  v_is_new_today boolean := false;
  v_device text := coalesce(nullif(trim(p_device), ''), 'unknown');
  v_path text := left(coalesce(nullif(trim(p_path), ''), '/'), 500);
  v_ref text := nullif(left(trim(coalesce(p_referrer_host, '')), 200), '');
  v_country text := nullif(left(upper(trim(coalesce(p_country, ''))), 2), '');
  v_total_visitors bigint;
  v_total_pageviews bigint;
begin
  if v_device not in ('mobile', 'tablet', 'desktop', 'unknown') then
    v_device := 'unknown';
  end if;

  -- Reject obvious junk paths.
  if v_path !~ '^/' or v_path ~* '^/(admin|api)(/|$)' then
    return jsonb_build_object('ok', false, 'error', 'ignored_path');
  end if;

  insert into public.analytics_visitors (visitor_id, first_seen_at, last_seen_at, visit_count)
  values (p_visitor_id, now(), now(), 1)
  on conflict (visitor_id) do nothing;
  v_is_new := found;

  if not v_is_new then
    update public.analytics_visitors
    set last_seen_at = now(),
        visit_count = visit_count + 1
    where visitor_id = p_visitor_id;
  end if;

  insert into public.analytics_daily_visitors (day, visitor_id)
  values (v_day, p_visitor_id)
  on conflict do nothing;
  v_is_new_today := found;

  insert into public.analytics_events (
    path, referrer_host, visitor_id, session_id, device, country, is_new_visitor
  ) values (
    v_path, v_ref, p_visitor_id, p_session_id, v_device, v_country, v_is_new
  );

  insert into public.analytics_daily (day, path, pageviews, visitors)
  values (v_day, '', 1, case when v_is_new_today then 1 else 0 end)
  on conflict (day, path) do update
    set pageviews = public.analytics_daily.pageviews + 1,
        visitors = public.analytics_daily.visitors
          + case when v_is_new_today then 1 else 0 end;

  insert into public.analytics_daily (day, path, pageviews, visitors)
  values (v_day, v_path, 1, 0)
  on conflict (day, path) do update
    set pageviews = public.analytics_daily.pageviews + 1;

  update public.analytics_counters
  set value = value + 1
  where key = 'total_pageviews'
  returning value into v_total_pageviews;

  if v_is_new then
    update public.analytics_counters
    set value = value + 1
    where key = 'total_visitors'
    returning value into v_total_visitors;
  else
    select value into v_total_visitors
    from public.analytics_counters
    where key = 'total_visitors';
  end if;

  return jsonb_build_object(
    'ok', true,
    'is_new_visitor', v_is_new,
    'total_visitors', coalesce(v_total_visitors, 0),
    'total_pageviews', coalesce(v_total_pageviews, 0)
  );
end;
$$;

-- Callable only by service_role (and postgres). Not granted to anon.
revoke all on function public.record_analytics_pageview (
  text, uuid, uuid, text, text, text
) from public;
grant execute on function public.record_analytics_pageview (
  text, uuid, uuid, text, text, text
) to service_role;

-- Public helper for the footer badge (aggregate only).
create or replace function public.get_analytics_totals ()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'visitors', coalesce(
      (select value from public.analytics_counters where key = 'total_visitors'),
      0
    ),
    'pageviews', coalesce(
      (select value from public.analytics_counters where key = 'total_pageviews'),
      0
    )
  );
$$;

revoke all on function public.get_analytics_totals () from public;
grant execute on function public.get_analytics_totals () to anon, authenticated;
