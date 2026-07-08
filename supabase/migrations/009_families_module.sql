-- ============================================================
-- App Igrejas — Migration 009: Families Module
-- Vínculo familiar entre membros
-- ============================================================

-- 1. FAMILIES
create table families (
  id         uuid primary key default uuid_generate_v4(),
  church_id  uuid not null references churches(id) on delete cascade,
  name       text not null,
  address    text,
  city       text,
  state      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_families_church on families (church_id);

-- 2. FAMILY MEMBERS
create table family_members (
  id           uuid primary key default uuid_generate_v4(),
  family_id    uuid not null references families(id) on delete cascade,
  member_id    uuid not null references members(id) on delete cascade,
  relationship text not null check (relationship in ('spouse', 'child', 'parent', 'sibling', 'other')),
  is_head      boolean not null default false,
  created_at   timestamptz not null default now(),
  unique(family_id, member_id)
);

create index idx_family_members_family on family_members (family_id);
create index idx_family_members_member on family_members (member_id);

-- ============================================================
-- RLS
-- ============================================================

alter table families enable row level security;
alter table family_members enable row level security;

create policy "Church isolation on families"
  on families for all using (church_id = auth_church_id());

create policy "Church isolation on family_members"
  on family_members for all using (
    family_id in (select id from families where church_id = auth_church_id())
  );

-- ============================================================
-- Updated_at triggers
-- ============================================================

create trigger trg_families_updated_at
  before update on families for each row execute function update_updated_at();
