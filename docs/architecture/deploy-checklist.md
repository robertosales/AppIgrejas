# Deploy Checklist — App Igrejas

## Pré-requisitos
- [ ] Conta Supabase criada (produção)
- [ ] Domínio configurado (appigrejas.com)
- [ ] Certificado SSL
- [ ] Conta Vercel ou Railway para admin web
- [ ] Contas Apple Developer + Google Play para mobile
- [ ] Variáveis de ambiente configuradas

## Etapas de Deploy

### 1. Backend (Supabase)
```bash
supabase link --project-ref <project-id>
supabase db push
supabase storage init
```

### 2. Admin Web (Vercel)
```bash
cd apps/admin
npm run build
# Deploy via Vercel CLI ou GitHub Actions
```

### 3. Mobile (Expo)
```bash
cd apps/mobile
eas build --platform android --profile production
eas build --platform ios --profile production
eas submit --platform android
eas submit --platform ios
```

## Ambientes
| Ambiente | Supabase | Admin | Mobile |
|----------|----------|-------|--------|
| Dev | Local | localhost:5173 | Expo Go |
| Staging | staging-ref | staging.appigrejas.com | TestFlight/Internal |
| Produção | production | appigrejas.com | App Store/Play Store |

## Rollback
- Database: `supabase db restore --version <timestamp>`
- Admin: Vercel rollback via dashboard
- Mobile: Manter versão anterior na loja durante validação
