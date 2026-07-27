-- Let a poll be tied to a specific era or album page, so its results can be
-- surfaced there as permanent content instead of living only in the
-- transient Fan Zone hub. Unscoped polls (scope_type null) keep showing
-- only in Fan Zone, same as before.

alter table public.cms_polls
  add column scope_type text check (scope_type in ('era', 'album')),
  add column scope_slug text;

alter table public.cms_polls
  add constraint cms_polls_scope_pair check (
    (scope_type is null) = (scope_slug is null)
  );

create index cms_polls_scope_idx on public.cms_polls (scope_type, scope_slug)
  where scope_type is not null;
