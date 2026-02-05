-- BetArena Supabase Schema (initial)

create extension if not exists "uuid-ossp";

-- Disable RLS on all tables first (to remove policy dependencies)
alter table if exists public.profiles disable row level security;
alter table if exists public.tournaments disable row level security;
alter table if exists public.tournament_participants disable row level security;
alter table if exists public.matches disable row level security;
alter table if exists public.match_results disable row level security;
alter table if exists public.disputes disable row level security;
alter table if exists public.social_posts disable row level security;
alter table if exists public.elo_ratings disable row level security;
alter table if exists public.wallets disable row level security;
alter table if exists public.wallet_transactions disable row level security;
alter table if exists public.payments disable row level security;
alter table if exists public.bets disable row level security;
alter table if exists public.payouts disable row level security;
alter table if exists public.referrals disable row level security;
alter table if exists public.login_audit disable row level security;

-- Drop triggers first
drop trigger if exists on_auth_user_created on auth.users;

-- Drop functions (CASCADE to remove dependent policies)
drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_admin() cascade;

-- Drop all tables (cascade removes dependencies)
drop table if exists public.login_audit cascade;
drop table if exists public.referrals cascade;
drop table if exists public.payouts cascade;
drop table if exists public.bets cascade;
drop table if exists public.payments cascade;
drop table if exists public.wallet_transactions cascade;
drop table if exists public.wallets cascade;
drop table if exists public.elo_ratings cascade;
drop table if exists public.social_posts cascade;
drop table if exists public.disputes cascade;
drop table if exists public.match_results cascade;
drop table if exists public.matches cascade;
drop table if exists public.tournament_participants cascade;
drop table if exists public.tournaments cascade;
drop table if exists public.challenges cascade;
drop table if exists public.games cascade;
drop table if exists public.profiles cascade;

-- Drop existing types if they exist (with cascade to handle dependencies)
drop type if exists public.role_type cascade;
drop type if exists public.game_platform cascade;
drop type if exists public.tournament_status cascade;
drop type if exists public.match_status cascade;
drop type if exists public.dispute_status cascade;
drop type if exists public.payment_status cascade;
drop type if exists public.bet_status cascade;
drop type if exists public.transaction_type cascade;

-- Enums
create type public.role_type as enum (
  'admin',
  'partner',
  'affiliate',
  'organizer',
  'player',
  'spectator'
);

create type public.game_platform as enum ('ps4', 'ps5', 'xbox');
create type public.tournament_status as enum ('draft', 'open', 'ongoing', 'completed', 'cancelled');
create type public.match_status as enum ('scheduled', 'reported', 'disputed', 'resolved');
create type public.dispute_status as enum ('open', 'under_review', 'resolved', 'rejected');
create type public.payment_status as enum ('pending', 'authorized', 'captured', 'failed', 'refunded');
create type public.bet_status as enum ('open', 'won', 'lost', 'void');
create type public.transaction_type as enum ('credit', 'debit', 'hold', 'release');

-- Core tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text unique,
  display_name text,
  role public.role_type not null default 'player',
  avatar_url text,
  bio text,
  partner_approved boolean not null default false,
  affiliate_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.games (name, slug, active)
values
  ('Counter-Strike 2', 'counter-strike-2', true),
  ('Valorant', 'valorant', true),
  ('Call of Duty', 'call-of-duty', true),
  ('EA FC 26', 'ea-fc-26', true)
on conflict (slug) do nothing;

create table if not exists public.tournaments (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references public.games(id),
  organizer_id uuid not null references public.profiles(id),
  title text not null,
  platform public.game_platform not null,
  status public.tournament_status not null default 'draft',
  entry_fee numeric(12,2) not null default 0,
  currency text not null default 'USD',
  max_players int not null default 32,
  prize_pool numeric(12,2) not null default 0,
  winner_pct numeric(5,4) not null default 0.6,
  runnerup_pct numeric(5,4) not null default 0.3,
  organizer_pct numeric(5,4) not null default 0.1,
  platform_pct numeric(5,4) not null default 0.2,
  start_at timestamptz,
  end_at timestamptz,
  rules jsonb,
  created_at timestamptz not null default now(),
  constraint pct_total_check check (winner_pct + runnerup_pct + organizer_pct + platform_pct >= 0.999)
);

create table if not exists public.challenges (
  id uuid primary key default uuid_generate_v4(),
  challenger_id uuid not null references public.profiles(id),
  opponent_username text not null,
  game_id uuid not null references public.games(id),
  prize numeric(12,2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'pending',
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.tournament_participants (
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'registered',
  created_at timestamptz not null default now(),
  primary key (tournament_id, user_id)
);

create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  round int not null,
  player1_id uuid not null references public.profiles(id),
  player2_id uuid not null references public.profiles(id),
  status public.match_status not null default 'scheduled',
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.match_results (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references public.matches(id) on delete cascade,
  reported_by uuid not null references public.profiles(id),
  score text not null,
  evidence_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.disputes (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references public.matches(id) on delete cascade,
  opened_by uuid not null references public.profiles(id),
  status public.dispute_status not null default 'open',
  resolution text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.social_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id),
  content text not null,
  media_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.elo_ratings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id),
  game_id uuid not null references public.games(id),
  rating int not null default 1000,
  updated_at timestamptz not null default now(),
  unique (user_id, game_id)
);

create table if not exists public.wallets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  currency text not null default 'USD',
  balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, currency)
);

create table if not exists public.wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  type public.transaction_type not null,
  amount numeric(12,2) not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id),
  provider text not null,
  external_id text,
  status public.payment_status not null default 'pending',
  amount numeric(12,2) not null,
  currency text not null,
  kind text not null, -- entry_fee | bet | payout
  tournament_id uuid references public.tournaments(id),
  created_at timestamptz not null default now()
);

create table if not exists public.bets (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references public.matches(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  selection_user_id uuid not null references public.profiles(id),
  amount numeric(12,2) not null,
  odds numeric(6,2) not null default 1.0,
  status public.bet_status not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.payouts (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  amount numeric(12,2) not null,
  status public.payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid not null references public.profiles(id),
  referred_id uuid not null references public.profiles(id),
  role public.role_type not null,
  created_at timestamptz not null default now(),
  unique (referrer_id, referred_id)
);

create table if not exists public.login_audit (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id),
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Helper function (after profiles table exists)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.challenges enable row level security;
alter table public.tournament_participants enable row level security;
alter table public.matches enable row level security;
alter table public.match_results enable row level security;
alter table public.disputes enable row level security;
alter table public.social_posts enable row level security;
alter table public.elo_ratings enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.payments enable row level security;
alter table public.bets enable row level security;
alter table public.payouts enable row level security;
alter table public.referrals enable row level security;
alter table public.login_audit enable row level security;

-- Policies (mínimas iniciais)
create policy "Profiles are viewable" on public.profiles
  for select to authenticated
  using (true);

create policy "Profiles self update" on public.profiles
  for update to authenticated
  using (id = auth.uid());

create policy "Profiles insert by auth trigger" on public.profiles
  for insert with check (id = auth.uid());

create policy "Tournaments readable" on public.tournaments
  for select to authenticated
  using (true);

create policy "Organizer manage tournaments" on public.tournaments
  for all to authenticated
  using (organizer_id = auth.uid() or public.is_admin());

create policy "Challenges readable" on public.challenges
  for select to authenticated
  using (true);

create policy "Challenger manage challenges" on public.challenges
  for all to authenticated
  using (challenger_id = auth.uid());

create policy "Participants self manage" on public.tournament_participants
  for all to authenticated
  using (user_id = auth.uid());

create policy "Matches readable" on public.matches
  for select to authenticated
  using (true);

create policy "Match results self report" on public.match_results
  for insert to authenticated
  with check (reported_by = auth.uid());

create policy "Disputes readable" on public.disputes
  for select to authenticated
  using (true);

create policy "Social posts readable" on public.social_posts
  for select to authenticated
  using (true);

create policy "Social posts author" on public.social_posts
  for all to authenticated
  using (author_id = auth.uid() or public.is_admin());

create policy "Wallets self" on public.wallets
  for all to authenticated
  using (user_id = auth.uid());

create policy "Wallet transactions self" on public.wallet_transactions
  for select to authenticated
  using (wallet_id in (select id from public.wallets where user_id = auth.uid()));

create policy "Payments self" on public.payments
  for select to authenticated
  using (user_id = auth.uid());

create policy "Bets self" on public.bets
  for all to authenticated
  using (user_id = auth.uid());

create policy "Payouts self" on public.payouts
  for select to authenticated
  using (user_id = auth.uid());

create policy "Referrals self" on public.referrals
  for select to authenticated
  using (referrer_id = auth.uid() or referred_id = auth.uid());

create policy "Login audit self" on public.login_audit
  for select to authenticated
  using (user_id = auth.uid());

-- Trigger to auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  username_value text;
begin
  -- Get username from metadata, or use first part of email as fallback
  username_value := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1) || '_' || substring(new.id::text, 1, 8)
  );
  
  -- Insert profile with error handling
  begin
    insert into public.profiles (id, email, username, role)
    values (new.id, new.email, username_value, 'player');
  exception when unique_violation then
    -- Username already exists, add random suffix
    insert into public.profiles (id, email, username, role)
    values (new.id, new.email, username_value || '_' || substring(new.id::text, 1, 4), 'player');
  end;
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
