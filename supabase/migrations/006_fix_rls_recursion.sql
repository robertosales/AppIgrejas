-- ============================================================
-- App Igrejas — Migration 006: Fix RLS recursion
-- As funcoes auxiliares precisam de security definer para
-- evitar recursao infinita nas politicas RLS
-- ============================================================

create or replace function auth_church_id()
returns uuid
language sql
stable
security definer
as $$
  select church_id from church_users
  where user_id = auth.uid()
    and is_active = true
  limit 1;
$$;

create or replace function auth_role(target_church_id uuid)
returns app_role
language sql
stable
security definer
as $$
  select role from church_users
  where user_id = auth.uid()
    and church_id = target_church_id
    and is_active = true
  limit 1;
$$;

create or replace function auth_has_role(target_role app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from church_users
    where user_id = auth.uid()
      and role = target_role
      and is_active = true
  );
$$;

create or replace function auth_is_super_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from church_users
    where user_id = auth.uid()
      and role = 'super_admin'
      and is_active = true
  );
$$;
