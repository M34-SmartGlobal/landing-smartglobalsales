alter table public.news_articles
add column if not exists content text;

update public.news_articles
set content = excerpt
where content is null;
