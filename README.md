# App Igrejas

Plataforma SaaS multi-igreja com app mobile, painel administrativo e triagem pastoral com IA.

## Estrutura

```
AppIgrejas/
├── apps/
│   ├── admin/          # Painel web administrativo (React + Vite)
│   └── mobile/         # App mobile (Expo + React Native)
├── packages/
│   ├── types/          # Tipos TypeScript compartilhados
│   ├── utils/          # Utilitários compartilhados
│   ├── ui/             # Componentes UI compartilhados
│   └── api-contracts/  # Contratos de API (Supabase client)
├── supabase/
│   ├── migrations/     # Migrações SQL versionadas
│   └── seeds/          # Dados iniciais
├── n8n/
│   └── workflows/      # Fluxos de automação
└── docs/
    ├── product/        # Documentação do produto
    ├── architecture/   # Decisões arquiteturais
    └── prompts/        # Prompts para IA
```

## Stack

- **Mobile**: Expo + React Native + TypeScript
- **Admin**: React + Vite + TypeScript + Tailwind
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Automação**: n8n

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Desenvolvimento do admin
npm run dev:admin

# Build do admin
npm run build:admin
```

## Migrações

As migrações SQL estão em `supabase/migrations/` e devem ser aplicadas via Supabase CLI ou dashboard.
