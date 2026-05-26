-- Post likes: one row per user per post slug
create table if not exists public.post_likes (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (slug, user_id)
);

alter table public.post_likes enable row level security;

create policy "Anyone can read likes"
  on public.post_likes for select using (true);

create policy "Authenticated users can like"
  on public.post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike their own"
  on public.post_likes for delete
  using (auth.uid() = user_id);

-- Post ratings: one row per user per post slug (1–5 stars)
create table if not exists public.post_ratings (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null,
  user_id    uuid not null references auth.users(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, user_id)
);

alter table public.post_ratings enable row level security;

create policy "Anyone can read ratings"
  on public.post_ratings for select using (true);

create policy "Authenticated users can rate"
  on public.post_ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own rating"
  on public.post_ratings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own rating"
  on public.post_ratings for delete
  using (auth.uid() = user_id);
