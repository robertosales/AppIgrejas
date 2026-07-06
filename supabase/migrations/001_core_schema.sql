-- ============================================================
-- App Igrejas — Migration 001: Core Schema
-- Núcleo SaaS, multi-tenancy, perfis e domínio principal
-- ============================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. ENUMS
create type app_role as enum (
  'super_admin', 'church_admin', 'pastor', 'leader',
  'care_team', 'secretary', 'finance', 'member', 'visitor'
);

create type subscription_status as enum (
  'active', 'inactive', 'past_due', 'canceled', 'trial'
);

create type church_status as enum (
  'active', 'blocked', 'trial'
);

create type triage_color as enum ('green', 'yellow', 'red');

create type care_case_status as enum (
  'open', 'in_progress', 'resolved', 'escalated'
);

create type prayer_request_status as enum (
  'active', 'answered', 'archived'
);

create type prayer_privacy as enum ('public', 'private');

create type content_type as enum (
  'sermon', 'article', 'devotional', 'video', 'audio'
);

create type content_status as enum (
  'draft', 'published', 'archived'
);

create type event_status as enum (
  'draft', 'published', 'canceled'
);

create type billing_status as enum (
  'pending', 'paid', 'overdue', 'canceled'
);

-- ============================================================
-- NÚCLEO SAAS
-- ============================================================

-- 3. CHURCHES (tenants)
create table churches (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  document    text,
  email       text,
  phone       text,
  status      church_status not null default 'trial',
  max_members integer not null default 50,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_churches_slug on churches (slug);
create index idx_churches_status on churches (status);

-- 4. CHURCH BRANDING (identidade visual por tenant)
create table church_branding (
  id             uuid primary key default uuid_generate_v4(),
  church_id      uuid not null references churches(id) on delete cascade,
  logo_url       text,
  banner_url     text,
  primary_color  text not null default '#6366f1',
  secondary_color text not null default '#8b5cf6',
  accent_color   text not null default '#06b6d4',
  font_family    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique(church_id)
);

-- 5. CHURCH BRANCHES (multicampus)
create table church_branches (
  id         uuid primary key default uuid_generate_v4(),
  church_id  uuid not null references churches(id) on delete cascade,
  name       text not null,
  address    text,
  city       text,
  state      text,
  phone      text,
  email      text,
  is_main    boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_branches_church on church_branches (church_id);

-- 6. SUBSCRIPTION PLANS (catálogo)
create table subscription_plans (
  id                uuid primary key default uuid_generate_v4(),
  tier              text not null unique,
  name              text not null,
  description       text,
  max_members       integer not null,
  monthly_price_cents integer not null,
  features          jsonb not null default '[]',
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 7. SUBSCRIPTIONS (assinatura ativa de cada igreja)
create table subscriptions (
  id                   uuid primary key default uuid_generate_v4(),
  church_id            uuid not null references churches(id) on delete cascade,
  plan_id              uuid not null references subscription_plans(id),
  status               subscription_status not null default 'trial',
  current_period_start timestamptz not null default now(),
  current_period_end   timestamptz,
  canceled_at          timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique(church_id)
);

create index idx_subscriptions_church on subscriptions (church_id);
create index idx_subscriptions_status on subscriptions (status);

-- 8. BILLING INVOICES
create table billing_invoices (
  id              uuid primary key default uuid_generate_v4(),
  church_id       uuid not null references churches(id) on delete cascade,
  subscription_id uuid not null references subscriptions(id),
  amount_cents    integer not null,
  currency        text not null default 'BRL',
  status          billing_status not null default 'pending',
  due_date        date not null,
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index idx_invoices_church on billing_invoices (church_id);
create index idx_invoices_status on billing_invoices (status);

-- 9. FEATURE FLAGS (catálogo de recursos)
create table feature_flags (
  id          uuid primary key default uuid_generate_v4(),
  code        text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- 10. CHURCH FEATURE FLAGS (recursos habilitados por igreja)
create table church_feature_flags (
  id              uuid primary key default uuid_generate_v4(),
  church_id       uuid not null references churches(id) on delete cascade,
  feature_flag_id uuid not null references feature_flags(id),
  is_enabled      boolean not null default false,
  created_at      timestamptz not null default now(),
  unique(church_id, feature_flag_id)
);

-- ============================================================
-- USUÁRIOS E PERFIS
-- ============================================================

-- 11. PROFILES (estende auth.users do Supabase)
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text not null,
  avatar_url text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12. CHURCH USERS (vínculo user + igreja + perfil)
create table church_users (
  id         uuid primary key default uuid_generate_v4(),
  church_id  uuid not null references churches(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  role       app_role not null default 'member',
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(church_id, user_id)
);

create index idx_church_users_church on church_users (church_id);
create index idx_church_users_user on church_users (user_id);
create index idx_church_users_role on church_users (role);

-- 13. MEMBERS (dados específicos de membros)
create table members (
  id            uuid primary key default uuid_generate_v4(),
  church_id     uuid not null references churches(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  birth_date    date,
  gender        text,
  address       text,
  city          text,
  state         text,
  baptized_at   date,
  joined_at     date,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(church_id, user_id)
);

create index idx_members_church on members (church_id);

-- 14. VISITORS
create table visitors (
  id          uuid primary key default uuid_generate_v4(),
  church_id   uuid not null references churches(id) on delete cascade,
  name        text not null,
  email       text,
  phone       text,
  visited_at  timestamptz not null default now(),
  converted   boolean not null default false,
  notes       text,
  created_at  timestamptz not null default now()
);

create index idx_visitors_church on visitors (church_id);

-- ============================================================
-- MINISTÉRIOS E GRUPOS
-- ============================================================

-- 15. MINISTRIES
create table ministries (
  id          uuid primary key default uuid_generate_v4(),
  church_id   uuid not null references churches(id) on delete cascade,
  name        text not null,
  description text,
  leader_id   uuid references profiles(id),
  image_url   text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_ministries_church on ministries (church_id);

-- 16. GROUPS
create table groups (
  id              uuid primary key default uuid_generate_v4(),
  church_id       uuid not null references churches(id) on delete cascade,
  ministry_id     uuid references ministries(id) on delete set null,
  name            text not null,
  description     text,
  meeting_schedule text,
  location        text,
  max_capacity    integer,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_groups_church on groups (church_id);

-- 17. GROUP MEMBERS
create table group_members (
  id        uuid primary key default uuid_generate_v4(),
  group_id  uuid not null references groups(id) on delete cascade,
  user_id   uuid not null references profiles(id) on delete cascade,
  role      text not null default 'member' check (role in ('leader', 'member')),
  joined_at timestamptz not null default now(),
  unique(group_id, user_id)
);

-- ============================================================
-- CONTEÚDO E AGENDA
-- ============================================================

-- 18. EVENTS
create table events (
  id           uuid primary key default uuid_generate_v4(),
  church_id    uuid not null references churches(id) on delete cascade,
  title        text not null,
  description  text,
  date         date not null,
  start_time   time not null,
  end_time     time,
  location     text,
  image_url    text,
  category     text,
  max_capacity integer,
  status       event_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_events_church on events (church_id);
create index idx_events_date on events (date);
create index idx_events_status on events (status);

-- 19. EVENT REGISTRATIONS
create table event_registrations (
  id        uuid primary key default uuid_generate_v4(),
  event_id  uuid not null references events(id) on delete cascade,
  user_id   uuid not null references profiles(id) on delete cascade,
  status    text not null default 'confirmed' check (status in ('confirmed', 'waitlist', 'canceled')),
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

-- 20. MEDIA CONTENTS
create table media_contents (
  id           uuid primary key default uuid_generate_v4(),
  church_id    uuid not null references churches(id) on delete cascade,
  title        text not null,
  description  text,
  content_type content_type not null,
  url          text,
  image_url    text,
  author_id    uuid references profiles(id),
  status       content_status not null default 'draft',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_contents_church on media_contents (church_id);
create index idx_contents_type on media_contents (content_type);
create index idx_contents_status on media_contents (status);

-- 21. NOTIFICATIONS
create table notifications (
  id         uuid primary key default uuid_generate_v4(),
  church_id  uuid not null references churches(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  title      text not null,
  body       text not null,
  data       jsonb,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index idx_notifications_user on notifications (user_id);
create index idx_notifications_read on notifications (read_at);

-- ============================================================
-- CUIDADO E ATENDIMENTO
-- ============================================================

-- 22. PRAYER REQUESTS
create table prayer_requests (
  id           uuid primary key default uuid_generate_v4(),
  church_id    uuid not null references churches(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  title        text not null,
  content      text not null,
  status       prayer_request_status not null default 'active',
  privacy      prayer_privacy not null default 'public',
  is_anonymous boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_prayer_church on prayer_requests (church_id);
create index idx_prayer_status on prayer_requests (status);

-- 23. CARE CASES (atendimento pastoral)
create table care_cases (
  id          uuid primary key default uuid_generate_v4(),
  church_id   uuid not null references churches(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  assigned_to uuid references profiles(id),
  status      care_case_status not null default 'open',
  priority    triage_color not null default 'green',
  subject     text not null,
  description text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_care_church on care_cases (church_id);
create index idx_care_status on care_cases (status);
create index idx_care_priority on care_cases (priority);
create index idx_care_assigned on care_cases (assigned_to);

-- 24. TRIAGE ASSESSMENTS (avaliação da IA)
create table triage_assessments (
  id                uuid primary key default uuid_generate_v4(),
  care_case_id      uuid not null references care_cases(id) on delete cascade,
  classification    triage_color not null,
  summary           text not null,
  risk_indicators   jsonb not null default '[]',
  ai_confidence     real not null,
  reviewed_by_human boolean not null default false,
  created_at        timestamptz not null default now()
);

-- 25. CARE ASSIGNMENTS (histórico de atribuições)
create table care_assignments (
  id           uuid primary key default uuid_generate_v4(),
  care_case_id uuid not null references care_cases(id) on delete cascade,
  assigned_to  uuid not null references profiles(id),
  assigned_by  uuid not null references profiles(id),
  reason       text,
  created_at   timestamptz not null default now()
);

-- 26. CARE CASE MESSAGES
create table care_case_messages (
  id           uuid primary key default uuid_generate_v4(),
  care_case_id uuid not null references care_cases(id) on delete cascade,
  sender_id    uuid not null references profiles(id),
  content      text not null,
  is_from_ai   boolean not null default false,
  created_at   timestamptz not null default now()
);

create index idx_messages_case on care_case_messages (care_case_id);

-- ============================================================
-- GOVERNANÇA
-- ============================================================

-- 27. AUDIT LOGS
create table audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  church_id   uuid references churches(id) on delete set null,
  user_id     uuid references profiles(id) on delete set null,
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  metadata    jsonb,
  ip_address  text,
  created_at  timestamptz not null default now()
);

create index idx_audit_church on audit_logs (church_id);
create index idx_audit_action on audit_logs (action);
create index idx_audit_created on audit_logs (created_at);

-- 28. ACTIVITY LOGS
create table activity_logs (
  id          uuid primary key default uuid_generate_v4(),
  church_id   uuid not null references churches(id) on delete cascade,
  user_id     uuid references profiles(id) on delete set null,
  activity    text not null,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index idx_activity_church on activity_logs (church_id);
create index idx_activity_created on activity_logs (created_at);

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  for t in
    select table_name from information_schema.columns
    where column_name = 'updated_at'
      and table_schema = 'public'
      and table_name not in ('billing_invoices', 'visitors', 'triage_assessments', 'care_assignments', 'care_case_messages', 'audit_logs', 'activity_logs', 'notifications', 'group_members', 'event_registrations')
  loop
    execute format(
      'create trigger trg_%I_updated_at before update on %I for each row execute function update_updated_at()',
      t, t
    );
  end loop;
end;
$$;
