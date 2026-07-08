# Plano de Ação — App Igrejas

## Visão Geral

Sistema completo de gestão eclesiástica (SaaS multi-tenant) com:

- **Portal Admin Web** (painel administrativo completo, não mobile)
- **App Membro Mobile** (já existe em `apps/mobile`)
- **Multi-igreja** (cada igreja com seus dados isolados por `church_id`)

Referências de mercado:
- [ChurchCRM](https://churchcrm.io) — Open Source PHP, módulos: People, Groups, Events, Finance, Reports
- [IgrejaHub](https://igrejahub.com.br) — SaaS BR: Membros, Financeiro, Patrimônio, Ministérios
- [MyChurch](https://mychurchlab.net) — SaaS BR: Membros, Financeiro, Patrimônio, Governança
- [FaithFlow](https://github.com/blackshrub/FaithFlow_Enterprise-Grade-Church-Management-System) — Open Source Python/React, módulos: Accounting, CMS, Groups, Prayer
- [Luminiahub](https://www.luminiahub.com.br) — SaaS BR: Membros, Financeiro, Patrimônio, Documentos
- [Planning Center](https://planning.center) — SaaS US: People, Check-in, Giving, Services

---

## Fase 1 — Fundação (MVP Atual)

### 1.1 Corrigir RLS (em andamento)
- [x] Migration 006 with `security definer` nas funções auxiliares
- [ ] Testar queries de profiles, church_users, churches

### 1.2 Migrar Admin para Web App
- [ ] Criar layout web dedicado (sidebar + topbar, sem mockup de celular)
- [ ] Separar rotas: `/admin/web/*` para admin completo
- [ ] Manter `/app/*` para visualização mobile (membros)

### 1.3 Autenticação e RBAC
- [ ] Auth context funcionando com Supabase
- [ ] Roles implementadas: `super_admin`, `church_admin`, `pastor`, `care_team`, `member`, `finance`, `secretary`
- [ ] Rotas protegidas por role

---

## Fase 2 — Módulo de Membresia

*Referência: ChurchCRM People Module, IgrejaHub Gestão de Membros*

### 2.1 Cadastro Completo
- [ ] Perfil completo (dados pessoais, contato, endereço)
- [ ] Histórico: batismo, conversão, cargos, cursos
- [ ] Documentos digitais (foto, certidão, RG)
- [ ] Status: membro, visitante, desligado, transferido

### 2.2 Famílias e Domicílios
- [ ] Vínculo familiar (cônjuges, filhos, pais)
- [ ] Endereço compartilhado por família
- [ ] Histórico familiar

### 2.3 Visitantes
- [ ] Registro de visitas com data
- [ ] Fluxo de acompanhamento (conversão → discipulado → membresia)
- [ ] Relatórios de crescimento

### 2.4 Relatórios
- [ ] Aniversariantes do mês
- [ ] Membros por status
- [ ] Crescimento mensal/anual
- [ ] Exportação CSV/PDF

---

## Fase 3 — Módulo Financeiro

*Referência: FaithFlow Accounting (16 coleções), ChurchCRM Finance Module, IgrejaHub Financeiro*

### 3.1 Plano de Contas
- [ ] Plano de contas hierárquico (ativo, passivo, receita, despesa)
- [ ] Centros de custo (departamentos, ministérios)
- [ ] Períodos fiscais (abertura/fechamento mensal)

### 3.2 Dízimos e Ofertas
- [ ] Lançamento rápido de dízimos por membro
- [ ] Ofertas avulsas e campanhas
- [ ] Extrato do dizimista
- [ ] Relatório por período

### 3.3 Contas a Pagar/Receber
- [ ] Despesas por centro de custo
- [ ] Controle de contas (água, luz, salários, etc.)
- [ ] Conciliação bancária
- [ ] Fluxo de caixa

### 3.4 Orçamento
- [ ] Orçamento anual por centro de custo
- [ ] Acompanhamento realizado vs. orçado
- [ ] Aprovação por diretoria

### 3.5 Relatórios Financeiros
- [ ] Balancete mensal
- [ ] DRE (Demonstração de Resultados)
- [ ] Relatório de dízimos por membro
- [ ] Exportação para contabilidade externa

---

## Fase 4 — Módulo Patrimonial

*Referência: IgrejaHub Patrimônio, MyChurch Gestão de Ativos*

### 4.1 Cadastro de Bens
- [ ] Imóveis (endereço, matrícula, valor)
- [ ] Veículos (placa, modelo, ano)
- [ ] Equipamentos (som, instrumentos, móveis)
- [ ] Categoria, localização, estado de conservação

### 4.2 Controle
- [ ] Depreciação
- [ ] Manutenção preventiva/corretiva
- [ ] Termo de responsabilidade
- [ ] Inventário periódico

### 4.3 Relatórios
- [ ] Relação de bens por categoria
- [ ] Valor total do patrimônio
- [ ] Histórico de manutenções

---

## Fase 5 — Módulo de Grupos e Ministérios

### 5.1 Ministérios
- [ ] Cadastro com líder, descrição, imagem
- [ ] Membros por ministério
- [ ] Escala de serviços

### 5.2 Pequenos Grupos (Células)
- [ ] Cadastro de grupos com líder, endereço, horário
- [ ] Membros por grupo
- [ ] Frequência dos encontros
- [ ] Mapa de grupos

### 5.3 Eventos e Agenda
- [ ] Calendário de eventos (cultos, ensaios, reuniões)
- [ ] Inscrição com controle de vagas
- [ ] Check-in de presença

---

## Fase 6 — Módulo de Atendimento e Cuidado Pastoral

*(Já parcialmente implementado no MVP)*

- [ ] Triagem com IA (já feito no ChatFlow)
- [ ] Abertura de caso de atendimento
- [ ] Atribuição a conselheiro/pastor
- [ ] Mensagens e histórico
- [ ] Aconselhamento e encaminhamento
- [ ] Relatórios de atendimento

---

## Fase 7 — Módulo de Conteúdo e Comunicação

### 7.1 Mensagens e Mídia
- [ ] Publicação de sermões (vídeo, áudio, texto)
- [ ] Devocionais diários
- [ ] Blog de notícias
- [ ] Categorias e tags

### 7.2 Comunicação
- [ ] Notificações push (app mobile)
- [ ] Disparo de e-mails
- [ ] Integração com WhatsApp
- [ ] Campanhas de comunicação

---

## Fase 8 — Módulo de Governança e Compliance

### 8.1 Assembléias e Atas
- [ ] Convocação de assembléias
- [ ] Ata digital com assinatura
- [ ] Votações

### 8.2 Documentos
- [ ] Estatuto social
- [ ] Regimento interno
- [ ] Atas de posse de diretoria
- [ ] GED (Gestão Eletrônica de Documentos)

### 8.3 Auditoria
- [ ] Logs de auditoria (tabela `audit_logs` já existe)
- [ ] Trilha de alterações
- [ ] Relatórios de compliance

---

## Fase 9 — Admin Web App

### 9.1 Novo Layout
- [ ] Sidebar de navegação (colapsável)
- [ ] Topbar com perfil, notificações, pesquisa global
- [ ] Dashboard com cards, gráficos, métricas em tempo real
- [ ] Tabelas com filtros, busca, paginação, exportação
- [ ] Design responsivo (web-first, não mobile-first)

### 9.2 Tech Stack
- [ ] React + Vite + Tailwind CSS (já está)
- [ ] shadcn/ui para componentes (já tem vários)
- [ ] React Router (já está)
- [ ] Recharts para gráficos (já instalado)
- [ ] React Hook Form para formulários (já instalado)

### 9.3 Estrutura de Rotas Web
```
/admin/web/
├── dashboard        # Visão geral
├── members/         # Membresia
│   ├── list
│   ├── :id
│   └── add
├── finance/         # Financeiro
│   ├── dashboard
│   ├── tithes
│   ├── expenses
│   ├── reports
│   └── budget
├── assets/          # Patrimônio
│   ├── list
│   ├── :id
│   └── add
├── groups/          # Grupos
│   ├── ministries
│   └── cells
├── events/          # Agenda
│   ├── calendar
│   └── :id
├── care/            # Atendimento
│   ├── cases
│   └── :id
├── content/         # Conteúdo
│   ├── sermons
│   └── devotions
├── settings/        # Configurações
│   ├── church
│   ├── subscription
│   ├── users
│   └── roles
└── system/          # Super Admin
    ├── churches
    ├── plans
    └── audit
```

---

## Fase 10 — Super Admin (Sistema)

- [ ] Gerenciamento de igrejas (criar, bloquear, ativar)
- [ ] Planos de assinatura (CRUD)
- [ ] Métricas de uso por igreja
- [ ] Logs de auditoria do sistema
- [ ] Painel de monitoramento (uptime, erros)

---

## Roadmap de Implementação

| Fase | Descrição | Prioridade | Esforço |
|------|-----------|------------|---------|
| 1 | Fundação (RLS, layout web, auth) | Alta | 1-2 semanas |
| 2 | Membresia | Alta | 2-3 semanas |
| 3 | Financeiro | Alta | 3-4 semanas |
| 4 | Patrimonial | Média | 1-2 semanas |
| 5 | Grupos e Ministérios | Média | 2 semanas |
| 6 | Atendimento Pastoral | Média | 1 semana |
| 7 | Conteúdo e Comunicação | Média | 2 semanas |
| 8 | Governança | Baixa | 2 semanas |
| 9 | Admin Web App | Alta | Contínuo |
| 10 | Super Admin | Alta | 1 semana |

---

## Próximos Passos Imediatos

1. **Rodar migration 006** no SQL Editor do Supabase
2. **Validar** se o login/admin está funcionando
3. **Decidir**: começar pelo novo layout web ou pelo módulo de membresia?
4. **Implementar** o primeiro módulo completo (Membresia)

> Obs: O banco de dados já tem a estrutura multi-tenant (`churches`, `church_users`, `profiles`, `members`, etc.) e suporta todos esses módulos. A tabela `members` já existe com `birth_date`, `baptized_at`, `joined_at`, etc. O módulo financeiro precisará de novas tabelas (plano de contas, lançamentos, etc.)
