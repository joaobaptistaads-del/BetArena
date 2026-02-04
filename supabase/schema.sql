-- BetArena Supabase Schema (initial)

create extension if not exists "uuid-ossp";

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

-- Helper functions
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

-- RLS
alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
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

create policy "Tournaments readable" on public.tournaments
  for select to authenticated
  using (true);

create policy "Organizer manage tournaments" on public.tournaments
  for all to authenticated
  using (organizer_id = auth.uid() or public.is_admin());

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
-- Trigger to automatically create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, role)
  values (new.id, new.email, new.raw_user_meta_data->>'username', 'player')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();