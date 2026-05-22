alter table public.site_banners enable row level security;
alter table public.news_articles enable row level security;

drop policy if exists "site_banners_public_select_active" on public.site_banners;
drop policy if exists "site_banners_admin_all" on public.site_banners;
drop policy if exists "news_articles_public_select_active" on public.news_articles;
drop policy if exists "news_articles_admin_all" on public.news_articles;

create policy "site_banners_public_select_active"
on public.site_banners
for select
to anon, authenticated
using (is_active = true);

create policy "site_banners_admin_all"
on public.site_banners
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "news_articles_public_select_active"
on public.news_articles
for select
to anon, authenticated
using (is_active = true);

create policy "news_articles_admin_all"
on public.news_articles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "site_banners_public_read" on storage.objects;
drop policy if exists "site_banners_admin_insert" on storage.objects;
drop policy if exists "site_banners_admin_update" on storage.objects;
drop policy if exists "site_banners_admin_delete" on storage.objects;
drop policy if exists "news_images_public_read" on storage.objects;
drop policy if exists "news_images_admin_insert" on storage.objects;
drop policy if exists "news_images_admin_update" on storage.objects;
drop policy if exists "news_images_admin_delete" on storage.objects;

create policy "site_banners_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-banners');

create policy "site_banners_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-banners' and public.is_admin());

create policy "site_banners_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-banners' and public.is_admin())
with check (bucket_id = 'site-banners' and public.is_admin());

create policy "site_banners_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-banners' and public.is_admin());

create policy "news_images_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'news-images');

create policy "news_images_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'news-images' and public.is_admin());

create policy "news_images_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'news-images' and public.is_admin())
with check (bucket_id = 'news-images' and public.is_admin());

create policy "news_images_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'news-images' and public.is_admin());
