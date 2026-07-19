-- Security hardening pass (see docs/data audit, 2026-07-19):
--   1. preview_tokens was publicly enumerable via RLS — anyone could list
--      every valid preview token without ever having received one.
--   2. site-media storage bucket had no MIME/size limits.
--   3. No abuse-rate limiting on Fan Zone comments/reports.

-- ---------------------------------------------------------------------------
-- 1. Lock down preview_tokens: require possessing the token, not just being
--    logged in as anon/authenticated. The old policy let anyone SELECT the
--    whole table; replace it with a security-definer function that only
--    returns a boolean for a token the caller already supplies.
-- ---------------------------------------------------------------------------

drop policy if exists "public read valid preview tokens" on public.preview_tokens;
revoke select on public.preview_tokens from anon, authenticated;

create or replace function public.is_valid_preview_token(
  p_token text,
  p_entity_type text,
  p_entity_id text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.preview_tokens
    where token = p_token
      and entity_type = p_entity_type
      and entity_id = p_entity_id
      and expires_at > now()
  );
$$;

grant execute on function public.is_valid_preview_token (text, text, text)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Restrict the site-media bucket to images, with a size cap.
-- ---------------------------------------------------------------------------

update storage.buckets
set
  file_size_limit = 8388608, -- 8 MB
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
where id = 'site-media';

-- ---------------------------------------------------------------------------
-- 3. Per-fan write-rate limiting for comments and reports. RLS already
--    scopes these to the owning fan; this caps how fast any single fan
--    (however many accounts they mint) can write, since Supabase Auth's
--    anonymous-signup throttle (supabase/config.toml [auth.rate_limit])
--    only bounds account creation, not post-signup write volume.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_fan_write_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer;
begin
  if tg_table_name = 'comments' then
    select count(*) into recent_count
    from public.comments
    where fan_id = new.fan_id
      and created_at > now() - interval '1 minute';
    if recent_count >= 5 then
      raise exception 'Too many comments — slow down and try again shortly.'
        using errcode = 'P0001';
    end if;
  elsif tg_table_name = 'fan_reports' then
    select count(*) into recent_count
    from public.fan_reports
    where reporter_fan_id = new.reporter_fan_id
      and created_at > now() - interval '1 hour';
    if recent_count >= 10 then
      raise exception 'Too many reports — slow down and try again later.'
        using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists comments_rate_limit on public.comments;
create trigger comments_rate_limit
  before insert on public.comments
  for each row execute function public.enforce_fan_write_rate_limit();

drop trigger if exists fan_reports_rate_limit on public.fan_reports;
create trigger fan_reports_rate_limit
  before insert on public.fan_reports
  for each row execute function public.enforce_fan_write_rate_limit();
