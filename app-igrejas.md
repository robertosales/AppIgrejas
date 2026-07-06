# Plano completo para construir a plataforma App Igrejas

## Visão geral

Este documento consolida todas as etapas necessárias para construir uma plataforma SaaS multi-igreja com aplicativo mobile para membros e visitantes, painel administrativo web para cada igreja, módulo pastoral com triagem inicial por IA e modelo comercial por assinatura baseado em quantidade de pessoas.[cite:1][cite:4][cite:116]

A solução deve ser tratada como um produto white-label/customizável, e não como um app isolado para uma única igreja. Cada igreja precisa poder cadastrar sua instituição, configurar logo, identidade visual, responsáveis, canais oficiais, plano contratado e operação administrativa própria.[cite:116][cite:1]

## Objetivo do produto

O objetivo é oferecer uma plataforma onde cada igreja possa contratar um plano, configurar seu próprio aplicativo e operar funcionalidades como agenda, eventos, pedidos de oração, atendimento pastoral, conteúdos e comunicação com membros e visitantes.[cite:116]

O produto precisa atender quatro frentes ao mesmo tempo:

- Plataforma SaaS para comercialização.
- Painel web administrativo para operação da igreja.
- Aplicativo mobile para membros, visitantes e não membros.
- Camada de triagem e automação com IA e fluxos operacionais.[cite:4][cite:1]

## Princípios de arquitetura

A arquitetura recomendada para este produto é uma base única mobile em Expo/React Native com TypeScript, um painel administrativo web em React/TypeScript e backend em Supabase com PostgreSQL, autenticação, storage e políticas de acesso no banco.[cite:1]

O sistema deve nascer multi-tenant, com isolamento por igreja, uso de `church_id` nas tabelas de domínio, RLS no banco e evolução controlada por migrations SQL versionadas. Isso é especialmente importante porque o fluxo técnico do projeto já privilegia Supabase, branches saindo de `develop` e mudanças estruturais controladas por migrações.[cite:1][cite:39][cite:97][cite:98][cite:102]

## Stack recomendada

| Camada | Tecnologia | Papel no sistema |
|---|---|---|
| App mobile | Expo + React Native + TypeScript | Aplicativo Android e iOS com uma única base de código |
| Painel web | React + TypeScript | Administração da igreja e do SaaS |
| Backend | Supabase | Auth, Postgres, Storage, APIs e Realtime |
| Banco | PostgreSQL | Modelo relacional principal |
| Segurança | RLS no Supabase | Isolamento por igreja e por perfil |
| Automação | n8n | Fluxos operacionais, alertas e integrações |
| Versionamento | GitHub | Repositório, branches, PRs e histórico |
| Prototipação | Figma / Figma Make | Protótipos mobile e web |

A base da decisão é o alinhamento com o workflow já utilizado, que combina Supabase, desenvolvimento orientado por estrutura de produto SaaS e planejamento técnico por fases antes da implementação pesada.[cite:1][cite:4]

## Modelo de negócio

O produto deve ser comercializado em assinatura mensal, com planos por faixa de quantidade de pessoas atendidas pela igreja.[cite:116]

Estrutura inicial sugerida:

| Plano | Faixa sugerida | Regra de negócio |
|---|---|---|
| Starter | Até 50 pessoas | Entrada para igrejas pequenas |
| Growth | Até 100 pessoas | Escala inicial |
| Pro | Até 200 pessoas | Operação média |
| Enterprise | Acima de 200 pessoas | Plano personalizado |

Além do valor mensal, o produto deve prever status da assinatura, limite operacional por plano, upgrade, downgrade, histórico de cobrança e possibilidade de plano personalizado acima de 200 pessoas.[cite:116]

## Macroetapas do projeto

A construção do produto deve seguir uma ordem que reduz retrabalho e evita começar pela interface final antes de consolidar negócio, segurança e dados.[cite:4][cite:102]

As macroetapas recomendadas são:

1. Definição do escopo do MVP.
2. Refinamento do protótipo no Figma.
3. Modelagem de negócio e multi-tenancy.
4. Modelagem do banco de dados.
5. Estruturação do repositório e arquitetura de código.
6. Implementação do backoffice SaaS.
7. Implementação do app mobile.
8. Implementação do módulo pastoral e triagem IA.
9. Integrações e automações.
10. Testes, homologação e publicação.

## Fase 0 — definição do MVP

Antes de escrever código, é necessário congelar o escopo da versão 1. O MVP não pode tentar resolver tudo ao mesmo tempo.[cite:4]

### Entregáveis da fase

- Nome e posicionamento do produto.
- Escopo funcional da V1.
- O que entra e o que fica para V2.
- Personas principais: administrador da igreja, pastor, líder, membro e visitante.
- Jornada do visitante.
- Jornada do membro.
- Jornada da igreja contratante.
- Jornada da equipe pastoral.

### Critérios para o MVP

O MVP deve incluir:

- Cadastro da igreja.
- Personalização básica da identidade.
- Planos e assinatura.
- Painel web administrativo mínimo.
- App mobile funcional.
- Agenda e eventos.
- Pedido de oração.
- Atendimento com triagem inicial.
- Gestão mínima de usuários e perfis.

## Fase 1 — refinamento do protótipo

O protótipo deve ser validado como produto SaaS real, não apenas como app de uso final. O Figma precisa refletir duas camadas: plataforma administrativa web e aplicativo mobile da igreja.[cite:4][cite:116]

### Telas obrigatórias do painel web

- Landing de entrada do SaaS.
- Cadastro da igreja.
- Customização da marca.
- Escolha de plano.
- Assinatura e pagamento.
- Dashboard da igreja.
- Gestão de usuários e permissões.
- Gestão de membros e visitantes.
- Gestão de eventos.
- Gestão de pedidos de oração.
- Gestão da fila pastoral.
- Relatórios básicos.

### Telas obrigatórias do app mobile

- Splash.
- Boas-vindas.
- Home.
- Agenda.
- Detalhe de evento.
- Pedido de oração.
- Atendimento pastoral.
- Fluxo de triagem com IA.
- Perfil.
- Login/cadastro.
- Notificações.
- Conteúdo.
- Grupos e ministérios.

### Resultado esperado

Ao final da fase, deve existir um protótipo navegável com fluxos coerentes de negócio, operação e experiência final do usuário.[cite:4]

## Fase 2 — arquitetura SaaS e multi-tenancy

Esta é a fase mais importante da fundação do sistema. Antes de montar telas finais, é preciso definir como múltiplas igrejas coexistirão com isolamento, personalização e regras próprias dentro do mesmo produto.[cite:1]

### Regras arquiteturais

- Cada igreja é um tenant.
- Todo dado de domínio deve ser vinculado a uma igreja.
- O isolamento deve ser feito no banco, não apenas no frontend.
- O sistema precisa permitir branding por tenant.
- Os recursos disponíveis podem variar por plano ou configuração.

### Conceitos centrais

- `church_id` como chave de isolamento.
- `app_role` ou modelo equivalente para perfis de acesso.
- RLS aplicada por igreja e por papel.
- Estrutura preparada para white-label.

## Fase 3 — modelagem do banco de dados

O banco precisa ser projetado como núcleo do produto. Como a solução vai lidar com planos, membros, visitantes, eventos, oração, atendimento e assinatura, a modelagem relacional precisa vir antes da implementação final de interface.[cite:1][cite:102]

### Módulos de tabelas

#### Núcleo SaaS

- `churches`
- `church_branding`
- `church_branches`
- `church_users`
- `church_user_roles`
- `subscription_plans`
- `subscriptions`
- `billing_invoices`
- `payment_methods`
- `feature_flags`
- `church_feature_flags`

#### Usuários e comunidade

- `profiles`
- `members`
- `visitors`
- `ministries`
- `groups`
- `group_members`

#### Conteúdo e agenda

- `events`
- `event_registrations`
- `media_contents`
- `notifications`

#### Cuidado e atendimento

- `prayer_requests`
- `care_cases`
- `triage_assessments`
- `care_assignments`
- `care_case_messages`

#### Governança

- `audit_logs`
- `activity_logs`

### Regras obrigatórias do banco

- `church_id` em quase todas as tabelas de domínio.
- índices por `church_id` e status.
- timestamps padrão.
- soft delete onde fizer sentido.
- integridade referencial explícita.
- políticas RLS por papel e tenant.

### Estratégia de evolução do schema

Toda mudança estrutural deve ocorrer por migrations SQL versionadas, em sequência cronológica e com abordagem segura para produção, evitando alterações destrutivas prematuras.[cite:1][cite:97][cite:98][cite:102]

## Fase 4 — autenticação, autorização e perfis

O produto precisa ter autenticação sólida e controle fino de acesso, porque haverá dados sensíveis de membros, atendimento e cobrança.[cite:1]

### Perfis recomendados

- super_admin
- church_admin
- pastor
- leader
- care_team
- secretary
- finance
- member
- visitor

### Regras de acesso

- Igreja só acessa seus próprios dados.
- Pastor vê somente casos autorizados ou encaminhados.
- Financeiro não acessa conteúdo pastoral sensível.
- Membro vê apenas seus próprios dados e recursos públicos do tenant.
- Visitante acessa apenas áreas abertas.

## Fase 5 — estrutura do repositório

O repositório deve ser organizado para suportar evolução modular e reuso de tipos, componentes e contratos. Como o fluxo do projeto já privilegia branches saindo de `develop`, o ideal é preparar o repositório desde o início para trabalho por fases e features.[cite:39][cite:99]

### Estrutura sugerida

```txt
AppIgrejas/
  apps/
    mobile/
    admin/
  packages/
    ui/
    types/
    utils/
    api-contracts/
  supabase/
    migrations/
    seeds/
  n8n/
    workflows/
  docs/
    product/
    architecture/
    prompts/
```

### Convenções de branch

- `main` para produção.
- `develop` para integração.
- `feature/...` para novas entregas.
- `fix/...` para correções.
- merge preferencial via squash quando apropriado ao fluxo.[cite:39][cite:60]

## Fase 6 — backoffice SaaS

Este módulo transforma o projeto em produto comercializável. É onde a igreja entra, assina, configura e opera sua própria instância.[cite:116]

### Módulos mínimos do backoffice

- Cadastro da igreja.
- Configuração institucional.
- Upload de logo e banner.
- Configuração de cores.
- Cadastro de responsáveis.
- Configuração de canais sociais.
- Gestão do plano.
- Assinatura e cobrança.
- Convite e gestão de usuários.
- Permissões por perfil.
- Dashboard operacional.

### Recursos essenciais

- status da assinatura.
- visão do consumo por faixa.
- histórico de pagamento.
- upgrade de plano.
- downgrade.
- alertas de limite.
- ativação e bloqueio administrativo.

## Fase 7 — app mobile da igreja

O app mobile é a camada final para membros, visitantes e não membros. Ele deve consumir a configuração da igreja e mudar visual, conteúdo e recursos de acordo com o tenant.[cite:116]

### Módulos mínimos do app

- Splash e onboarding.
- Login/cadastro.
- Home personalizada.
- Agenda.
- Eventos.
- Detalhe do evento.
- Pedido de oração.
- Atendimento pastoral.
- Perfil.
- Notificações.
- Conteúdos.
- Ministérios e grupos.

### Regras importantes

- Parte do app deve funcionar sem login.
- A identidade visual deve ser puxada da igreja.
- O menu deve respeitar módulos habilitados.
- O app precisa funcionar em Android e iOS com a mesma base de código.

## Fase 8 — módulo pastoral e triagem com IA

A IA deve ser tratada como mecanismo de acolhimento inicial, classificação e encaminhamento, nunca como substituta do cuidado pastoral humano.[cite:4]

### Fluxo recomendado

1. Usuário inicia atendimento.
2. Sistema informa que a conversa começa com triagem automatizada.
3. IA coleta contexto mínimo.
4. IA classifica prioridade.
5. Caso é salvo no banco.
6. Equipe humana recebe encaminhamento conforme regra.

### Classificação sugerida

| Cor | Situação | Ação |
|---|---|---|
| Verde | Dúvidas simples, acolhimento leve, orientação básica | Resposta automática e/ou acompanhamento opcional |
| Amarela | Sofrimento emocional, luto, conflito, necessidade de cuidado | Encaminhamento pastoral prioritário |
| Vermelha | Risco imediato, urgência, ameaça, crise grave | Escalonamento humano urgente |

### Regras de segurança

- Transparência explícita no início do atendimento.
- Registro do resultado da triagem.
- Encaminhamento auditável.
- Permissão restrita para leitura dos casos.
- Tratamento especial para casos vermelhos.

## Fase 9 — planos, assinatura e billing

O billing precisa existir desde cedo na arquitetura, mesmo que a cobrança real seja simplificada no começo. Isso evita retrabalho no núcleo comercial do produto.[cite:116]

### Funcionalidades necessárias

- catálogo de planos.
- faixa por quantidade de pessoas.
- assinatura ativa/inativa.
- data de renovação.
- histórico de pagamento.
- status de inadimplência.
- alerta de estouro de faixa.
- solicitação de plano personalizado.

### Dados importantes por assinatura

- plano atual.
- valor mensal.
- limite de pessoas.
- quantidade atual registrada.
- forma de pagamento.
- datas de início e renovação.
- status operacional.

## Fase 10 — integrações e automações

O n8n entra como camada operacional para integrar canais, enviar alertas e automatizar tarefas internas. Ele não substitui o backend principal, mas acelera muito a operação do produto.[cite:1]

### Fluxos recomendados

- onboarding da igreja.
- aviso de pagamento.
- follow-up de visitante.
- evento com lembrete automático.
- oração com notificação para equipe.
- triagem com encaminhamento.
- alerta urgente para casos críticos.
- integração com WhatsApp e Instagram.

## Fase 11 — observabilidade, segurança e conformidade

Como o sistema terá dados pessoais e casos sensíveis, segurança e rastreabilidade não podem ficar para o final.[cite:98]

### Itens obrigatórios

- logs estruturados.
- trilha de auditoria.
- controle de acesso por perfil.
- política de privacidade.
- consentimento no atendimento com IA.
- proteção de buckets privados.
- separação de ambientes.
- backup e recuperação.

## Fase 12 — testes

O produto deve ser validado em múltiplas camadas antes da publicação.

### Camadas de teste

- Testes de modelagem e migrations.
- Testes de políticas RLS.
- Testes de autenticação.
- Testes de fluxo no admin web.
- Testes de fluxo no app mobile.
- Testes de atendimento e escalonamento.
- Testes de cobrança.
- Testes de responsividade e usabilidade.

### Cenários críticos

- Igreja A não pode ver dados da Igreja B.
- Membro não pode acessar área pastoral.
- Financeiro não pode abrir casos sensíveis.
- Caso vermelho precisa ser encaminhado corretamente.
- Plano excedido precisa gerar alerta sem quebrar o uso.

## Fase 13 — deploy e publicação

A publicação deve acontecer por etapas controladas, com ambientes separados e validação progressiva.[cite:1][cite:39]

### Etapas sugeridas

1. Ambiente de desenvolvimento.
2. Ambiente de homologação.
3. Produção do backend.
4. Publicação do painel web.
5. Build mobile para testes internos.
6. TestFlight e teste fechado Android.
7. Publicação em App Store e Google Play.

## Fase 14 — roadmap pós-MVP

Depois da primeira versão estável, o produto pode evoluir para recursos mais avançados.

### Evoluções possíveis

- multicampus avançado.
- CRM ministerial.
- automação de discipulado.
- campanhas de comunicação segmentadas.
- escalas de voluntariado.
- check-in em eventos.
- trilhas de curso e formação.
- analytics mais completos.
- módulo financeiro ampliado.
- marketplace de integrações.

## Ordem prática de execução

A sequência mais segura e eficiente para executar o projeto é esta:[cite:4][cite:102]

1. Fechar escopo do MVP.
2. Refinar protótipo final no Figma.
3. Definir arquitetura SaaS e multi-tenancy.
4. Modelar banco de dados.
5. Definir perfis e RLS.
6. Estruturar o repositório.
7. Implementar backoffice da igreja.
8. Implementar planos e assinatura.
9. Implementar app mobile.
10. Implementar módulo pastoral e IA.
11. Integrar n8n, WhatsApp e Instagram.
12. Testar tudo.
13. Publicar gradualmente.

## Backlog inicial por sprints

### Sprint 1 — fundação

- Criar estrutura do repositório.
- Criar projeto mobile.
- Criar projeto admin.
- Criar projeto Supabase.
- Definir convenções de código.
- Criar migrations iniciais de núcleo SaaS.

### Sprint 2 — multi-tenancy

- Tabela de igrejas.
- Branding.
- Usuários por igreja.
- Perfis e permissões.
- RLS inicial.

### Sprint 3 — assinatura

- Planos.
- Assinaturas.
- Cobrança.
- Dashboard financeiro básico.

### Sprint 4 — backoffice inicial

- Cadastro da igreja.
- Configuração institucional.
- Upload de logo.
- Personalização visual.
- Gestão de usuários.

### Sprint 5 — mobile base

- Splash.
- Home.
- Agenda.
- Eventos.
- Perfil.
- Login/cadastro.

### Sprint 6 — relacionamento

- Pedido de oração.
- Conteúdos.
- Notificações.
- Grupos e ministérios.

### Sprint 7 — atendimento

- Tela de acolhimento.
- Fluxo de triagem.
- Persistência dos casos.
- Fila pastoral.

### Sprint 8 — automação e integrações

- n8n.
- alertas.
- WhatsApp.
- Instagram.
- follow-up.

### Sprint 9 — teste e publicação

- Hardening de segurança.
- Testes de ponta a ponta.
- Ajustes finais.
- Build e distribuição.

## Decisão executiva final

A decisão arquitetural correta é começar pela fundação do SaaS e do banco, não pela implementação completa do app visual. O protótipo ajuda a validar experiência, mas o que vai sustentar o produto é a combinação de multi-tenancy, assinatura, segurança, backoffice e operação pastoral bem modelados desde o início.[cite:4][cite:116][cite:102]

A ordem certa é: produto, arquitetura, banco, segurança, backoffice, mobile, IA, integrações e publicação. Essa abordagem reduz retrabalho, protege o produto desde cedo e cria uma base sólida para evoluir o App Igrejas para uma plataforma real de mercado.[cite:1][cite:39][cite:97][cite:98]
