-- Explicit Data API role grants for the Fan Zone tables.
--
-- RLS policies only restrict *rows* a role can touch — the role still
-- needs the underlying SQL privilege (SELECT/INSERT/etc.) on the table
-- itself, which this project's api.auto_expose_new_tables setting does
-- NOT grant automatically for tables created after project init (that's
-- the new, more locked-down default). Without these, PostgREST rejects
-- every request with 403 before RLS is ever evaluated.

grant usage on schema public to anon, authenticated;

grant select on public.fans to anon, authenticated;
grant insert, update on public.fans to authenticated;

grant select, insert, delete on public.favorites to authenticated;

grant select, insert on public.poll_votes to authenticated;

grant select on public.comments to anon, authenticated;
grant insert, delete on public.comments to authenticated;

grant select, insert, update, delete on public.playlist_items to authenticated;
