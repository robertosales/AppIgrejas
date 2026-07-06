-- ============================================================
-- App Igrejas — Migration 002: RLS Policies
-- Isolamento multi-tenant por church_id e controle por perfil
-- ============================================================

-- 1. HABILITAR RLS EM TODAS AS TABELAS
do $$
declare
  t text;
begin
  for t in
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end;
$$;

-- 2. FUNÇÕES AUXILIARES

-- Retorna o church_id do usuário logado
create or replace function auth_church_id()
returns uuid
language sql
stable
as $$
  select church_id from church_users
  where user_id = auth.uid()
    and is_active = true
  limit 1;
$$;

-- Retorna o perfil (role) do usuário logado em uma igreja específica
create or replace function auth_role(target_church_id uuid)
returns app_role
language sql
stable
as $$
  select role from church_users
  where user_id = auth.uid()
    and church_id = target_church_id
    and is_active = true
  limit 1;
$$;

-- Verifica se o usuário tem um papel específico na igreja
create or replace function auth_has_role(target_role app_role)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from church_users
    where user_id = auth.uid()
      and role = target_role
      and is_active = true
  );
$$;

-- Verifica se é super_admin
create or replace function auth_is_super_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from church_users
    where user_id = auth.uid()
      and role = 'super_admin'
      and is_active = true
  );
$$;

-- ============================================================
-- POLÍTICAS POR TABELA
-- ============================================================

-- ----------------------------------------
-- CHURCHES (apenas super_admin e church_admin da própria igreja)
-- ----------------------------------------
create policy "church_admin pode ver sua própria igreja"
  on churches for select
  using (
    auth_is_super_admin()
    or id = auth_church_id()
  );

create policy "super_admin pode gerenciar igrejas"
  on churches for all
  using (auth_is_super_admin())
  with check (auth_is_super_admin());

-- ----------------------------------------
-- CHURCH BRANDING
-- ----------------------------------------
create policy "membros da igreja podem ver branding"
  on church_branding for select
  using (church_id = auth_church_id());

create policy "church_admin pode gerenciar branding"
  on church_branding for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin')
  );

-- ----------------------------------------
-- CHURCH BRANCHES
-- ----------------------------------------
create policy "membros podem ver filiais"
  on church_branches for select
  using (church_id = auth_church_id());

create policy "church_admin pode gerenciar filiais"
  on church_branches for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin')
  );

-- ----------------------------------------
-- PROFILES
-- ----------------------------------------
create policy "usuário pode ver seu próprio perfil"
  on profiles for select
  using (id = auth.uid());

create policy "church_admin pode ver perfis da igreja"
  on profiles for select
  using (
    exists (
      select 1 from church_users cu
      where cu.church_id = auth_church_id()
        and cu.user_id = profiles.id
        and auth_role(cu.church_id) in ('super_admin', 'church_admin', 'pastor', 'secretary')
    )
  );

create policy "usuário pode atualizar próprio perfil"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ----------------------------------------
-- CHURCH USERS
-- ----------------------------------------
create policy "church_admin pode gerenciar usuários da igreja"
  on church_users for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin')
  );

create policy "usuário pode ver seu próprio vínculo"
  on church_users for select
  using (user_id = auth.uid());

-- ----------------------------------------
-- MEMBERS
-- ----------------------------------------
create policy "membro pode ver seus próprios dados"
  on members for select
  using (user_id = auth.uid());

create policy "secretary e admin podem ver todos os membros"
  on members for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'pastor', 'secretary')
  );

create policy "secretary e admin podem gerenciar membros"
  on members for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'secretary')
  );

-- ----------------------------------------
-- VISITORS
-- ----------------------------------------
create policy "secretary e admin podem gerenciar visitantes"
  on visitors for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'secretary', 'pastor')
  );

-- ----------------------------------------
-- SUBSCRIPTION PLANS (público para leitura)
-- ----------------------------------------
create policy "planos são públicos para leitura"
  on subscription_plans for select
  using (true);

create policy "super_admin pode gerenciar planos"
  on subscription_plans for all
  using (auth_is_super_admin());

-- ----------------------------------------
-- SUBSCRIPTIONS
-- ----------------------------------------
create policy "church_admin vê assinatura da própria igreja"
  on subscriptions for select
  using (church_id = auth_church_id());

create policy "finance vê assinatura da própria igreja"
  on subscriptions for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'finance')
  );

create policy "super_admin pode gerenciar assinaturas"
  on subscriptions for all
  using (auth_is_super_admin());

-- ----------------------------------------
-- BILLING INVOICES
-- ----------------------------------------
create policy "finance vê faturas da igreja"
  on billing_invoices for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'finance')
  );

create policy "super_admin gerencia faturas"
  on billing_invoices for all
  using (auth_is_super_admin());

-- ----------------------------------------
-- EVENTS
-- ----------------------------------------
create policy "todos veem eventos publicados"
  on events for select
  using (
    church_id = auth_church_id()
    and status = 'published'
  );

create policy "admin e pastor veem todos os eventos"
  on events for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'pastor', 'secretary')
  );

create policy "admin pode gerenciar eventos"
  on events for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'secretary')
  );

-- ----------------------------------------
-- EVENT REGISTRATIONS
-- ----------------------------------------
create policy "usuário vê suas próprias inscrições"
  on event_registrations for select
  using (user_id = auth.uid());

create policy "admin vê todas as inscrições"
  on event_registrations for select
  using (
    exists (
      select 1 from events e
      where e.id = event_registrations.event_id
        and e.church_id = auth_church_id()
        and auth_role(e.church_id) in ('super_admin', 'church_admin', 'secretary')
    )
  );

create policy "usuário pode se inscrever"
  on event_registrations for insert
  with check (user_id = auth.uid());

-- ----------------------------------------
-- MEDIA CONTENTS
-- ----------------------------------------
create policy "todos veem conteúdos publicados"
  on media_contents for select
  using (
    church_id = auth_church_id()
    and status = 'published'
  );

create policy "admin gerencia conteúdos"
  on media_contents for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'pastor', 'secretary')
  );

-- ----------------------------------------
-- NOTIFICATIONS
-- ----------------------------------------
create policy "usuário vê próprias notificações"
  on notifications for select
  using (user_id = auth.uid());

create policy "sistema pode inserir notificações"
  on notifications for insert
  with check (true);

-- ----------------------------------------
-- MINISTRIES
-- ----------------------------------------
create policy "todos veem ministérios ativos"
  on ministries for select
  using (
    church_id = auth_church_id()
    and (is_active = true or auth_role(church_id) in ('super_admin', 'church_admin'))
  );

create policy "admin gerencia ministérios"
  on ministries for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'pastor')
  );

-- ----------------------------------------
-- GROUPS
-- ----------------------------------------
create policy "todos veem grupos ativos"
  on groups for select
  using (
    church_id = auth_church_id()
    and (is_active = true or auth_role(church_id) in ('super_admin', 'church_admin'))
  );

create policy "admin e líderes gerenciam grupos"
  on groups for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'pastor', 'leader')
  );

-- ----------------------------------------
-- GROUP MEMBERS
-- ----------------------------------------
create policy "membro vê sua participação"
  on group_members for select
  using (user_id = auth.uid());

create policy "admin e líder veem todos os membros"
  on group_members for select
  using (
    exists (
      select 1 from groups g
      where g.id = group_members.group_id
        and g.church_id = auth_church_id()
        and auth_role(g.church_id) in ('super_admin', 'church_admin', 'pastor', 'leader')
    )
  );

-- ----------------------------------------
-- PRAYER REQUESTS
-- ----------------------------------------
create policy "todos veem orações públicas da igreja"
  on prayer_requests for select
  using (
    church_id = auth_church_id()
    and privacy = 'public'
  );

create policy "admin e pastor veem todas"
  on prayer_requests for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'pastor')
  );

create policy "usuário vê suas próprias orações"
  on prayer_requests for select
  using (user_id = auth.uid());

create policy "usuário pode criar oração"
  on prayer_requests for insert
  with check (church_id = auth_church_id());

create policy "usuário pode atualizar própria oração"
  on prayer_requests for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ----------------------------------------
-- CARE CASES (sigilo pastoral)
-- ----------------------------------------
create policy "care_team vê casos da igreja"
  on care_cases for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'pastor', 'care_team')
  );

create policy "pastor vê casos atribuídos a ele"
  on care_cases for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) = 'pastor'
    and (assigned_to = auth.uid() or assigned_to is null)
  );

create policy "usuário vê seus próprios casos"
  on care_cases for select
  using (user_id = auth.uid());

create policy "usuário pode abrir caso"
  on care_cases for insert
  with check (church_id = auth_church_id());

create policy "care_team pode atualizar casos"
  on care_cases for update
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin', 'pastor', 'care_team')
  );

-- ----------------------------------------
-- TRIAGE ASSESSMENTS
-- ----------------------------------------
create policy "care_team vê triagens"
  on triage_assessments for select
  using (
    exists (
      select 1 from care_cases cc
      where cc.id = triage_assessments.care_case_id
        and cc.church_id = auth_church_id()
        and auth_role(cc.church_id) in ('super_admin', 'church_admin', 'pastor', 'care_team')
    )
  );

-- ----------------------------------------
-- CARE CASE MESSAGES
-- ----------------------------------------
create policy "care_team vê mensagens do caso"
  on care_case_messages for select
  using (
    exists (
      select 1 from care_cases cc
      where cc.id = care_case_messages.care_case_id
        and cc.church_id = auth_church_id()
        and auth_role(cc.church_id) in ('super_admin', 'church_admin', 'pastor', 'care_team')
    )
  );

create policy "usuário vê mensagens do próprio caso"
  on care_case_messages for select
  using (
    exists (
      select 1 from care_cases cc
      where cc.id = care_case_messages.care_case_id
        and cc.user_id = auth.uid()
    )
  );

-- ----------------------------------------
-- CARE ASSIGNMENTS
-- ----------------------------------------
create policy "care_team vê atribuições"
  on care_assignments for select
  using (
    exists (
      select 1 from care_cases cc
      where cc.id = care_assignments.care_case_id
        and cc.church_id = auth_church_id()
        and auth_role(cc.church_id) in ('super_admin', 'church_admin', 'pastor', 'care_team')
    )
  );

-- ----------------------------------------
-- FEATURE FLAGS
-- ----------------------------------------
create policy "church_admin vê flags disponíveis"
  on feature_flags for select
  using (true);

create policy "super_admin gerencia flags"
  on feature_flags for all
  using (auth_is_super_admin());

-- ----------------------------------------
-- CHURCH FEATURE FLAGS
-- ----------------------------------------
create policy "membros veem flags da igreja"
  on church_feature_flags for select
  using (church_id = auth_church_id());

create policy "church_admin gerencia flags da igreja"
  on church_feature_flags for all
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin')
  );

-- ----------------------------------------
-- AUDIT LOGS
-- ----------------------------------------
create policy "admin vê logs da igreja"
  on audit_logs for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin')
  );

-- ----------------------------------------
-- ACTIVITY LOGS
-- ----------------------------------------
create policy "admin vê atividade da igreja"
  on activity_logs for select
  using (
    church_id = auth_church_id()
    and auth_role(church_id) in ('super_admin', 'church_admin')
  );
