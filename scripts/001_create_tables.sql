-- Profiles table (references auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'user' check (role in ('admin', 'supervisor', 'user')),
  church_id uuid,
  age_group text not null default 'adults' check (age_group in ('children', 'teens', 'young_adults', 'adults')),
  xp integer not null default 0,
  level integer not null default 1,
  quizzes_completed integer not null default 0,
  tournaments_won integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);
-- Admin can manage all profiles
create policy "profiles_admin_insert" on public.profiles for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "profiles_admin_update" on public.profiles for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "profiles_admin_delete" on public.profiles for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Churches table
create table if not exists public.churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  denomination text not null default 'other' check (denomination in ('baptist', 'pentecostal', 'presbyterian', 'methodist', 'adventist', 'catholic', 'lutheran', 'assembly_of_god', 'other')),
  city text not null,
  state text not null,
  total_members integer not null default 0,
  total_points integer not null default 0,
  tournaments_participated integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.churches enable row level security;
create policy "churches_select_all" on public.churches for select using (true);
create policy "churches_insert_admin" on public.churches for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "churches_update_admin" on public.churches for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "churches_delete_admin" on public.churches for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Add FK from profiles to churches
alter table public.profiles add constraint profiles_church_fk foreign key (church_id) references public.churches(id) on delete set null;

-- Questions table
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer integer not null,
  category text not null default 'general' check (category in ('old_testament', 'new_testament', 'prophets', 'gospels', 'psalms', 'proverbs', 'revelation', 'general')),
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  explanation text,
  bible_reference text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;
create policy "questions_select_all" on public.questions for select using (true);
create policy "questions_insert_auth" on public.questions for insert with check (auth.uid() is not null);
create policy "questions_update_admin" on public.questions for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "questions_delete_admin" on public.questions for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Tournaments table
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'finished')),
  max_participants integer not null default 50,
  current_participants integer not null default 0,
  age_group text not null default 'adults' check (age_group in ('children', 'teens', 'young_adults', 'adults', 'all')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.tournaments enable row level security;
create policy "tournaments_select_all" on public.tournaments for select using (true);
create policy "tournaments_insert_auth" on public.tournaments for insert with check (auth.uid() is not null);
create policy "tournaments_update_admin" on public.tournaments for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Tournament participants
create table if not exists public.tournament_participants (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null default 0,
  joined_at timestamptz not null default now(),
  unique(tournament_id, user_id)
);

alter table public.tournament_participants enable row level security;
create policy "tp_select_all" on public.tournament_participants for select using (true);
create policy "tp_insert_own" on public.tournament_participants for insert with check (auth.uid() = user_id);
create policy "tp_update_own" on public.tournament_participants for update using (auth.uid() = user_id);

-- Quiz results
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null default 0,
  total_questions integer not null,
  correct_answers integer not null,
  category text,
  difficulty text,
  time_spent integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.quiz_results enable row level security;
create policy "qr_select_own" on public.quiz_results for select using (auth.uid() = user_id);
create policy "qr_insert_own" on public.quiz_results for insert with check (auth.uid() = user_id);
create policy "qr_select_admin" on public.quiz_results for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
