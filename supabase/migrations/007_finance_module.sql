-- ============================================================
-- App Igrejas — Migration 007: Finance Module
-- Plano de contas, centro de custo, transações, dízimos, ofertas, orçamentos
-- ============================================================

-- 1. COST CENTERS
create table cost_centers (
  id          uuid primary key default uuid_generate_v4(),
  church_id   uuid not null references churches(id) on delete cascade,
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(church_id, name)
);

create index idx_cost_centers_church on cost_centers (church_id);

-- 2. CHART OF ACCOUNTS
create table chart_of_accounts (
  id          uuid primary key default uuid_generate_v4(),
  church_id   uuid not null references churches(id) on delete cascade,
  parent_id   uuid references chart_of_accounts(id) on delete set null,
  code        text not null,
  name        text not null,
  type        text not null check (type in ('asset', 'liability', 'equity', 'revenue', 'expense')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(church_id, code)
);

create index idx_chart_of_accounts_church on chart_of_accounts (church_id);
create index idx_chart_of_accounts_type on chart_of_accounts (type);

-- 3. FINANCIAL TRANSACTIONS
create table financial_transactions (
  id              uuid primary key default uuid_generate_v4(),
  church_id       uuid not null references churches(id) on delete cascade,
  account_id      uuid not null references chart_of_accounts(id),
  cost_center_id  uuid references cost_centers(id) on delete set null,
  type            text not null check (type in ('income', 'expense', 'transfer')),
  amount          numeric(15,2) not null,
  description     text not null,
  transaction_date date not null,
  reference       text,
  created_by      uuid references profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_financial_transactions_church on financial_transactions (church_id);
create index idx_financial_transactions_date on financial_transactions (transaction_date);
create index idx_financial_transactions_type on financial_transactions (type);
create index idx_financial_transactions_account on financial_transactions (account_id);

-- 4. TITHES (dízimos)
create table tithes (
  id               uuid primary key default uuid_generate_v4(),
  church_id        uuid not null references churches(id) on delete cascade,
  member_id        uuid not null references members(id) on delete cascade,
  amount           numeric(15,2) not null,
  transaction_date date not null,
  reference        text,
  notes            text,
  created_by       uuid references profiles(id),
  created_at       timestamptz not null default now()
);

create index idx_tithes_church on tithes (church_id);
create index idx_tithes_date on tithes (transaction_date);
create index idx_tithes_member on tithes (member_id);

-- 5. OFFERINGS (ofertas)
create table offerings (
  id               uuid primary key default uuid_generate_v4(),
  church_id        uuid not null references churches(id) on delete cascade,
  campaign         text,
  amount           numeric(15,2) not null,
  transaction_date date not null,
  description      text,
  created_by       uuid references profiles(id),
  created_at       timestamptz not null default now()
);

create index idx_offerings_church on offerings (church_id);
create index idx_offerings_date on offerings (transaction_date);

-- 6. BUDGETS (orçamentos)
create table budgets (
  id             uuid primary key default uuid_generate_v4(),
  church_id      uuid not null references churches(id) on delete cascade,
  year           integer not null,
  account_id     uuid not null references chart_of_accounts(id),
  cost_center_id uuid references cost_centers(id) on delete set null,
  planned_amount numeric(15,2) not null default 0,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique(church_id, year, account_id, cost_center_id)
);

create index idx_budgets_church on budgets (church_id);
create index idx_budgets_year on budgets (year);

-- ============================================================
-- RLS
-- ============================================================

alter table cost_centers enable row level security;
alter table chart_of_accounts enable row level security;
alter table financial_transactions enable row level security;
alter table tithes enable row level security;
alter table offerings enable row level security;
alter table budgets enable row level security;

create policy "Church isolation on cost_centers"
  on cost_centers for all using (church_id = auth_church_id());

create policy "Church isolation on chart_of_accounts"
  on chart_of_accounts for all using (church_id = auth_church_id());

create policy "Church isolation on financial_transactions"
  on financial_transactions for all using (church_id = auth_church_id());

create policy "Church isolation on tithes"
  on tithes for all using (church_id = auth_church_id());

create policy "Church isolation on offerings"
  on offerings for all using (church_id = auth_church_id());

create policy "Church isolation on budgets"
  on budgets for all using (church_id = auth_church_id());

-- ============================================================
-- Updated_at triggers
-- ============================================================

create trigger trg_cost_centers_updated_at
  before update on cost_centers for each row execute function update_updated_at();

create trigger trg_chart_of_accounts_updated_at
  before update on chart_of_accounts for each row execute function update_updated_at();

create trigger trg_financial_transactions_updated_at
  before update on financial_transactions for each row execute function update_updated_at();

create trigger trg_budgets_updated_at
  before update on budgets for each row execute function update_updated_at();
