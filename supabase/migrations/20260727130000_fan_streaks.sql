-- Return-visit streaks, which the "stamps" (badges) UI reads from. A fan's
-- browser calls record_fan_activity() once per session; it's a no-op if
-- already recorded today, so it's safe to call on every page load rather
-- than needing a scheduled job.

alter table public.fans
  add column current_streak integer not null default 0,
  add column longest_streak integer not null default 0,
  add column last_active_date date;

create or replace function public.record_fan_activity()
returns table (current_streak integer, longest_streak integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_last date;
  v_streak integer;
  v_longest integer;
begin
  select f.last_active_date, f.current_streak, f.longest_streak
    into v_last, v_streak, v_longest
    from public.fans f
    where f.id = auth.uid()
      and f.banned = false;

  if not found then
    return;
  end if;

  if v_last = current_date then
    -- Already recorded today — return the existing values unchanged.
    return query select v_streak, v_longest;
    return;
  elsif v_last = current_date - 1 then
    v_streak := v_streak + 1;
  else
    v_streak := 1;
  end if;

  if v_streak > v_longest then
    v_longest := v_streak;
  end if;

  update public.fans f
  set current_streak = v_streak,
      longest_streak = v_longest,
      last_active_date = current_date
  where f.id = auth.uid();

  return query select v_streak, v_longest;
end;
$$;

grant execute on function public.record_fan_activity () to authenticated;
