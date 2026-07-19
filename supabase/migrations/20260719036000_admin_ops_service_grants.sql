-- Service-role grants for ops tables (seed + server admin client).

grant select, insert, update, delete on public.cms_redirects to service_role;
grant select, insert, update, delete on public.cms_seo to service_role;
grant select, insert, update, delete on public.legal_takedowns to service_role;
grant select, insert, update, delete on public.embed_blocks to service_role;
grant select, insert, update, delete on public.fan_reports to service_role;
grant select, insert, update, delete on public.cms_versions to service_role;
grant select, insert, update, delete on public.cms_schedules to service_role;
grant select, insert, update, delete on public.media_slots to service_role;
grant select, insert, update, delete on public.preview_tokens to service_role;
