-- ============================================================
-- App Igrejas — Migration 008: Assets Module
-- Bens patrimoniais e manutenções
-- ============================================================

-- 1. ASSETS (bens patrimoniais)
create table assets (
  id                uuid primary key default uuid_generate_v4(),
  church_id         uuid not null references churches(id) on delete cascade,
  name              text not null,
  category          text not null check (category in ('real_estate', 'vehicle', 'furniture', 'equipment', 'instrument', 'other')),
  description       text,
  acquisition_date  date,
  acquisition_value numeric(15,2),
  current_value     numeric(15,2),
  location          text,
  responsible_id    uuid references profiles(id) on delete set null,
  status            text not null default 'active' check (status in ('active', 'maintenance', 'inactive', 'sold')),
  serial_number     text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_assets_church on assets (church_id);
create index idx_assets_category on assets (category);
create index idx_assets_status on assets (status);

-- 2. ASSET MAINTENANCES
create table asset_maintenances (
  id                   uuid primary key default uuid_generate_v4(),
  church_id            uuid not null references churches(id) on delete cascade,
  asset_id             uuid not null references assets(id) on delete cascade,
  date                 date not null,
  description          text not null,
  cost                 numeric(15,2),
  performed_by         text,
  next_maintenance_date date,
  notes                text,
  created_at           timestamptz not null default now()
);

create index idx_asset_maintenances_asset on asset_maintenances (asset_id);
create index idx_asset_maintenances_date on asset_maintenances (date);

-- ============================================================
-- RLS
-- ============================================================

alter table assets enable row level security;
alter table asset_maintenances enable row level security;

create policy "Church isolation on assets"
  on assets for all using (church_id = auth_church_id());

create policy "Church isolation on asset_maintenances"
  on asset_maintenances for all using (church_id = auth_church_id());

-- ============================================================
-- Updated_at triggers
-- ============================================================

create trigger trg_assets_updated_at
  before update on assets for each row execute function update_updated_at();
