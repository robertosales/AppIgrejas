# Ambientes — App Igrejas

## Desenvolvimento

```bash
# Supabase local
supabase start

# Admin web
cd apps/admin
cp .env.example .env.local
npm run dev

# Mobile
cd apps/mobile
cp .env.example .env
npx expo start
```

## Variáveis de Ambiente

### Admin (`apps/admin/.env`)
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<local-anon-key>
VITE_APP_NAME=App Igrejas (Dev)
```

### Mobile (`apps/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
```

## Homologação
- Branch: `develop`
- Supabase project: staging
- Admin: staging.appigrejas.com

## Produção
- Branch: `main`
- Supabase project: production
- Admin: appigrejas.com
- Mobile: App Store + Google Play

## Segurança
- Senhas de banco rotacionadas a cada 90 dias
- Access keys com escopo mínimo
- Logs de acesso monitorados
- Backup automático diário (retenção 30 dias)
- Ambientes isolados com credenciais distintas
