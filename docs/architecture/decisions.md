# Decisões Arquiteturais — App Igrejas

## ADR-001: Monorepo com npm workspaces
**Contexto**: Múltiplos aplicativos (admin, mobile) e pacotes compartilhados.
**Decisão**: Usar npm workspaces com pacotes em `packages/` e apps em `apps/`.
**Consequência**: Compartilhamento de tipos e utilitários sem duplicação.

## ADR-002: Multi-tenancy com church_id
**Contexto**: Isolamento de dados entre igrejas.
**Decisão**: `church_id` em todas as tabelas de domínio + RLS no PostgreSQL.
**Consequência**: Isolamento garantido no banco, não apenas no frontend.

## ADR-003: Supabase como backend
**Contexto**: Autenticação, banco, storage e APIs.
**Decisão**: Supabase com PostgreSQL, Auth, Storage e RLS.
**Consequência**: Redução de boilerplate, segurança nativa, escalabilidade.

## ADR-004: Perfis de acesso (app_role)
**Contexto**: Controle de acesso granular.
**Decisão**: Enum `app_role` com 9 perfis, do super_admin ao visitor.
**Consequência**: Políticas RLS podem verificar perfil diretamente.

## ADR-005: Migrações SQL versionadas
**Contexto**: Evolução controlada do schema.
**Decisão**: Migrações numéricas sequenciais em `supabase/migrations/`.
**Consequência**: Histórico claro, rollbacks possíveis, colaboração segura.

## ADR-006: Protótipo Figma como base do admin
**Contexto**: Já existe protótipo Figma exportado em Vite/React.
**Decisão**: Manter o protótipo como ponto de partida do `apps/admin`.
**Consequência**: Acelera desenvolvimento do admin, evita retrabalho de UI.
