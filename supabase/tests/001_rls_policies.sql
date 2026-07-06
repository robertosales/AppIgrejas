-- ============================================================
-- App Igrejas — Testes de RLS
-- Cenários críticos de isolamento multi-tenant
-- ============================================================

-- Cenário 1: Igreja A não pode ver dados da Igreja B
begin;
  -- Criar igrejas de teste
  insert into churches (id, name, slug) values
    ('00000000-0000-0000-0000-000000000001', 'Igreja A', 'igreja-a'),
    ('00000000-0000-0000-0000-000000000002', 'Igreja B', 'igreja-b');

  -- Criar usuários de teste
  -- (assumindo que auth.users já existe via setup)

  -- Verificar isolamento
  -- assert: user da Igreja A não vê eventos da Igreja B
rollback;

-- Cenário 2: Membro não pode acessar área pastoral
begin;
  -- assert: user com role 'member' não pode SELECT em care_cases onde user_id != auth.uid()
rollback;

-- Cenário 3: Financeiro não pode abrir casos sensíveis
begin;
  -- assert: user com role 'finance' não pode SELECT em care_cases
rollback;

-- Cenário 4: Caso vermelho precisa ser encaminhado corretamente
begin;
  -- assert: triagem 'red' cria notificação para equipe pastoral
rollback;

-- Cenário 5: Plano excedido gera alerta sem quebrar uso
begin;
  -- assert: count_active_members > max_members não bloqueia operações
  -- apenas gera alerta
rollback;
