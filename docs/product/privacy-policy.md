# Política de Privacidade — App Igrejas

## Dados coletados
- Nome, email, telefone (cadastro do usuário)
- Dados da igreja (nome, documento, endereço)
- Pedidos de oração e conteúdo de atendimento pastoral
- Registros de eventos e grupos

## Uso dos dados
- Operação da plataforma e comunicação entre igreja e membros
- Triagem de atendimento pastoral (processado por IA)
- Cobrança e gestão de assinatura
- Melhoria do serviço

## Compartilhamento
- Dados não são compartilhados com terceiros sem consentimento
- Igrejas têm acesso apenas aos seus próprios dados (isolamento multi-tenant)
- A equipe pastoral tem acesso aos casos de atendimento

## Retenção
- Dados são mantidos enquanto a conta da igreja estiver ativa
- Após cancelamento, dados podem ser exportados em até 30 dias
- Logs de auditoria são mantidos por 12 meses

## Segurança
- Dados armazenados em PostgreSQL com criptografia em repouso
- Autenticação via Supabase Auth
- Isolamento por RLS (Row Level Security)
- Buckets de storage privados

## Consentimento IA
- O usuário é informado no início do atendimento que a triagem é feita por IA
- O usuário pode optar por não continuar com a triagem
- Casos classificados como vermelhos (urgentes) são escalados imediatamente para humanos

## Contato
Para solicitar remoção de dados ou mais informações: privacy@appigrejas.com
