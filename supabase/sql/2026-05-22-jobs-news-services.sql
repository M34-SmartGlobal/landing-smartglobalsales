-- Smart Global Sales - job positions, news, services settings

create extension if not exists "pgcrypto";

create table if not exists public.job_positions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_job_positions_active_sort on public.job_positions(is_active, sort_order);
create index if not exists idx_news_articles_active_created on public.news_articles(is_active, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_job_positions_updated_at on public.job_positions;
create trigger set_job_positions_updated_at
before update on public.job_positions
for each row execute function public.set_updated_at();

drop trigger if exists set_news_articles_updated_at on public.news_articles;
create trigger set_news_articles_updated_at
before update on public.news_articles
for each row execute function public.set_updated_at();

alter table public.job_positions enable row level security;
alter table public.news_articles enable row level security;

drop policy if exists "job_positions_public_select_active" on public.job_positions;
drop policy if exists "job_positions_admin_all" on public.job_positions;
drop policy if exists "news_articles_public_select_active" on public.news_articles;
drop policy if exists "news_articles_admin_all" on public.news_articles;

create policy "job_positions_public_select_active"
on public.job_positions
for select
to anon, authenticated
using (is_active = true);

create policy "job_positions_admin_all"
on public.job_positions
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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-images',
  'news-images',
  true,
  3145728,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "news_images_public_read" on storage.objects;
drop policy if exists "news_images_admin_insert" on storage.objects;
drop policy if exists "news_images_admin_update" on storage.objects;
drop policy if exists "news_images_admin_delete" on storage.objects;

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

insert into public.site_settings (key, value)
values (
  'public_services_text',
  to_jsonb('En Smart Global Sales impulsamos el desarrollo del talento humano y la excelencia operativa. Ofrecemos programas de capacitación personalizados para potenciar las habilidades de cada colaborador, promovemos equipos de trabajo eficientes y colaborativos, y brindamos consultoría estratégica para mejorar el rendimiento organizacional. Nos enfocamos en soluciones innovadoras que transforman el potencial de las personas y empresas, ayudándolas a alcanzar sus objetivos de negocio.'::text)
)
on conflict (key) do update set value = excluded.value;

-- If application_leads.campaign_id currently references campaigns(id), remove the FK so it can store job_positions.id.
do $$
declare
  constraint_name text;
begin
  select tc.constraint_name into constraint_name
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name
   and tc.table_schema = kcu.table_schema
  where tc.table_schema = 'public'
    and tc.table_name = 'application_leads'
    and tc.constraint_type = 'FOREIGN KEY'
    and kcu.column_name = 'campaign_id'
  limit 1;

  if constraint_name is not null then
    execute format('alter table public.application_leads drop constraint %I', constraint_name);
  end if;
end $$;

insert into public.job_positions (name, is_active, sort_order)
values
  ('Comercial', true, 10),
  ('Asistente TI', true, 20)
on conflict do nothing;
