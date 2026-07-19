-- Service role needs explicit table privileges for seed/bootstrap scripts
-- (RLS is bypassed, but GRANT is still required).

grant select, insert, update, delete on public.admin_users to service_role;
grant select, insert, update, delete on public.cms_eras to service_role;
grant select, insert, update, delete on public.cms_albums to service_role;
grant select, insert, update, delete on public.cms_media_items to service_role;
grant select, insert, update, delete on public.cms_pages to service_role;
grant select, insert, update, delete on public.site_settings to service_role;
grant select, insert, update, delete on public.cms_polls to service_role;
grant select, insert, update, delete on public.media_assets to service_role;
grant select, insert, update, delete on public.admin_audit_log to service_role;
