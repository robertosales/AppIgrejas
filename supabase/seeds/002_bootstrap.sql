-- ============================================================
-- Bootstrap: dados mínimos para o MVP funcionar
-- Execute APÓS criar a conta em http://localhost:5173/signup
-- ============================================================

-- 1. Criar igreja padrão
insert into churches (id, name, slug, status, max_members)
values (
  '00000000-0000-0000-0000-000000000001',
  'Comunidade Vida',
  'comunidade-vida',
  'active',
  500
);

-- 2. Atribuir super_admin ao Roberto
insert into church_users (church_id, user_id, role)
select
  '00000000-0000-0000-0000-000000000001',
  id,
  'super_admin'
from profiles
where email = 'roberto.sales@gmail.com';

-- 3. Criar assinatura ativa (plano Pro)
insert into subscriptions (church_id, plan_id, status)
select
  '00000000-0000-0000-0000-000000000001',
  id,
  'active'
from subscription_plans
where tier = 'pro';
