-- ============================================================
-- App Igrejas — Seed: Dados iniciais
-- ============================================================

-- Planos de assinatura
insert into subscription_plans (tier, name, description, max_members, monthly_price_cents, features) values
  ('starter',    'Starter',    'Para igrejas em início de organização',       50,   0,     '["app_mobile","agenda","prayer_requests","content_basic"]'),
  ('growth',     'Growth',     'Para igrejas em crescimento',                 100,  4990,  '["app_mobile","agenda","prayer_requests","content_basic","event_registration","groups","notifications","care_basic"]'),
  ('pro',        'Pro',        'Para igrejas com operação completa',          200,  9990,  '["app_mobile","agenda","prayer_requests","content_full","event_registration","groups","notifications","care_full","triage_ai","reports","branches","multicampus"]'),
  ('enterprise', 'Enterprise', 'Para igrejas com necessidades personalizadas', 500, 19990, '["app_mobile","agenda","prayer_requests","content_full","event_registration","groups","notifications","care_full","triage_ai","reports","branches","multicampus","custom_branding","api_access","dedicated_support"]')
on conflict (tier) do nothing;

-- Feature flags do sistema
insert into feature_flags (code, name, description) values
  ('app_mobile',       'Aplicativo Mobile',       'App mobile para membros e visitantes'),
  ('agenda',           'Agenda',                  'Agenda de eventos e programações'),
  ('prayer_requests',  'Pedidos de Oração',       'Módulo de pedidos de oração'),
  ('content_basic',    'Conteúdo Básico',         'Publicação de conteúdos simples'),
  ('content_full',     'Conteúdo Completo',       'Conteúdo com áudio, vídeo e séries'),
  ('event_registration','Inscrição em Eventos',   'Inscrição e controle de vagas'),
  ('groups',           'Grupos e Ministérios',    'Gestão de grupos e ministérios'),
  ('notifications',    'Notificações Push',       'Notificações no app'),
  ('care_basic',       'Atendimento Básico',      'Registro de pedidos de cuidado'),
  ('care_full',        'Atendimento Completo',    'Fluxo completo com triagem e encaminhamento'),
  ('triage_ai',        'Triagem com IA',          'Triagem inteligente de atendimento'),
  ('reports',          'Relatórios',              'Relatórios e métricas'),
  ('branches',         'Filiais',                 'Gestão de múltiplas filiais'),
  ('multicampus',      'Multicampus',             'Suporte a múltiplos campi'),
  ('custom_branding',  'Branding Personalizado',  'Personalização visual avançada'),
  ('api_access',       'API Pública',             'Acesso à API do sistema'),
  ('dedicated_support','Suporte Dedicado',        'Canal de suporte prioritário')
on conflict (code) do nothing;
