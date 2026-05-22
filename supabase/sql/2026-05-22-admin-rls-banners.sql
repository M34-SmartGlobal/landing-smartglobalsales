-- Smart Global Sales - RLS fix + modular hero banners

create extension if not exists "pgcrypto";

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.site_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_path text not null,
  image_alt text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_site_banners_active_sort
on public.site_banners(is_active, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_banners_updated_at on public.site_banners;
create trigger set_site_banners_updated_at
before update on public.site_banners
for each row execute function public.set_updated_at();

alter table public.site_banners enable row level security;

drop policy if exists "site_banners_public_select_active" on public.site_banners;
drop policy if exists "site_banners_admin_all" on public.site_banners;

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

drop policy if exists "campaigns_admin_all" on public.campaigns;
create policy "campaigns_admin_all"
on public.campaigns
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'campaign-logos',
  'campaign-logos',
  true,
  1048576,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-banners',
  'site-banners',
  true,
  3145728,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "campaign_logos_public_read" on storage.objects;
drop policy if exists "campaign_logos_admin_insert" on storage.objects;
drop policy if exists "campaign_logos_admin_update" on storage.objects;
drop policy if exists "campaign_logos_admin_delete" on storage.objects;
drop policy if exists "site_banners_public_read" on storage.objects;
drop policy if exists "site_banners_admin_insert" on storage.objects;
drop policy if exists "site_banners_admin_update" on storage.objects;
drop policy if exists "site_banners_admin_delete" on storage.objects;

create policy "campaign_logos_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'campaign-logos');

create policy "campaign_logos_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'campaign-logos' and public.is_admin());

create policy "campaign_logos_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'campaign-logos' and public.is_admin())
with check (bucket_id = 'campaign-logos' and public.is_admin());

create policy "campaign_logos_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'campaign-logos' and public.is_admin());

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
