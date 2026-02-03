# BetArena - Estrutura do Projeto

## 🏗️ Arquitetura Implementada

### Frontend (Next.js App Router)
```
apps/web/src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Estilos globais Tailwind
│   └── api/
│       └── geo/
│           └── route.ts   # API Route para geolocalização
├── components/
│   └── TournamentCard.tsx # Card de torneio (exemplo)
├── hooks/
│   └── useGeoLocation.ts  # Hook de detecção de localização/moeda
└── lib/
    └── supabase.ts        # Cliente Supabase (frontend)
```

### Backend (Node.js Express)
```
apps/api/src/
├── server.js              # Servidor principal
├── lib/
│   ├── supabase.js       # Cliente admin Supabase
│   ├── payments.js       # Lógica de pagamentos/escrow
│   └── antifraud.js      # Detecção de fraudes
└── webhooks/
    ├── stripe.js         # Webhook Stripe
    ├── paypal.js         # Webhook PayPal
    └── mercadopago.js    # Webhook Mercado Pago
```

### Database (Supabase)
```
supabase/
└── schema.sql             # Schema completo com:
                           - Enums (roles, status, tipos)
                           - Tabelas (profiles, tournaments, matches, etc.)
                           - RLS Policies
                           - Funções helper
```

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Pagamentos
- **Multi-gateway:** Stripe, PayPal e Mercado Pago
- **Webhooks:** Verificação de assinatura implementada
- **Escrow (Hold):** Retenção automática de fundos até finalização do torneio
- **Split automático:** Distribuição para vencedor, 2º lugar, organizador e plataforma (20%)
- **Carteira virtual:** Sistema de wallet com transações (credit, debit, hold, release)

### ✅ Segurança e Anti-Fraude
- **Auditoria de login:** Rastreamento de IP/user agent
- **Detecção de múltiplas contas:** Bloqueia usuários com mesmo IP em torneios pagos
- **Verificação de assinaturas:** Webhooks validados para todos os gateways
- **RLS (Row Level Security):** Políticas no Supabase para proteger dados

### ✅ Sistema de Roles (RBAC)
- **Admin:** Controle total
- **Partner (Influencer):** Dashboard de métricas, perfil público, % por indicação
- **Affiliate:** Sistema de indicação com comissão
- **Organizer:** Cria torneios, define regras, recebe %
- **Player:** Inscrição em campeonatos, reporta resultados
- **Spectator:** Apostas em vencedores

### ✅ Lógica de Negócio
- **Taxa da plataforma:** 20% retida automaticamente
- **Pool de prêmios:** Calculado dinamicamente (entry_fee × participants)
- **Splits configuráveis:** winner_pct, runnerup_pct, organizer_pct, platform_pct
- **Geolocalização financeira:** Detecta país/moeda e sugere gateway (Pix para BR, PayPal para US)

### ✅ Esqueleto de Funcionalidades Exclusivas
- **Tribunal de Disputas:** Tabela `disputes` pronta para implementação de upload de provas
- **Ranking ELO:** Tabela `elo_ratings` preparada para algoritmo de ranking
- **Social Feed:** Tabela `social_posts` para posts de parceiros
- **Sistema de Apostas:** Tabela `bets` com status (open, won, lost, void)

## 🔐 Variáveis de Ambiente

Configure no arquivo `.env` (baseado em `.env.example`):

### Backend
```env
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# PayPal
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx
PAYPAL_ENV=sandbox

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx
MERCADOPAGO_WEBHOOK_SECRET=xxx
```

### Frontend
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

## 🚀 Próximos Passos Sugeridos

### Prioridade Alta
1. **Implementar Auth do Supabase** no frontend (login/signup com email/OAuth)
2. **Criar API Routes** para criação de torneios
3. **Integrar Stripe Checkout** na página de inscrição
4. **Sistema de Matches:** Lógica de chaveamento (single/double elimination)
5. **Dashboard do Organizador:** CRUD de torneios, visualização de participantes

### Prioridade Média
6. **Algoritmo de Ranking ELO:** Implementar cálculo após cada partida
7. **Upload de Provas:** Integrar Supabase Storage para evidências em disputas
8. **Social Feed:** Página de posts de parceiros com likes/comentários
9. **Sistema de Notificações:** Realtime com Supabase para atualização de matches
10. **Dashboard de Métricas:** Gráficos de receita, participantes, conversão

### Prioridade Baixa
11. **Verificação de Identidade:** Integração com serviço de KYC (ex: Stripe Identity)
12. **Chat em Tempo Real:** Supabase Realtime para comunicação entre jogadores
13. **Sistema de Tickets/Suporte:** Para resolver disputas complexas
14. **Internacionalização (i18n):** Suporte para múltiplos idiomas
15. **Mobile App:** React Native com código compartilhado

## 📊 Fluxo de Pagamento

```
1. Usuário se inscreve no torneio
   ↓
2. Redireciona para gateway (Stripe/PayPal/MercadoPago)
   ↓
3. Pagamento aprovado → Webhook dispara
   ↓
4. Backend registra payment (status: captured)
   ↓
5. Aplica HOLD na carteira (escrow)
   ↓
6. Libera inscrição no torneio
   ↓
7. Torneio finaliza → settleTournamentPayouts()
   ↓
8. Distribui prêmios automaticamente:
   - Vencedor: 60% do prize_pool
   - 2º Lugar: 30% do prize_pool
   - Organizador: 10% do prize_pool
   - Plataforma: 20% do total (retido antes)
```

## 🛡️ Segurança Implementada

- **Helmet.js:** Headers de segurança HTTP
- **Rate Limiting:** 300 requests/15min
- **CORS:** Origem controlada por env
- **Row Level Security (RLS):** Todas as tabelas protegidas
- **Service Role Key:** Apenas no backend, nunca exposto ao cliente
- **Webhook Signature Verification:** Validação de todas as requisições de gateway
- **IP Tracking:** Auditoria de logins suspeitos

## 📝 Licença e Ética

- **MIT License:** Open source, uso comercial permitido
- **Code of Conduct:** Regras de respeito e colaboração
- **Security Policy:** Reporte responsável de vulnerabilidades
- **Compliance:** Estrutura preparada para regulamentações de apostas (verificar legislação local)

---

**Stack:** Next.js 14 + TypeScript + Tailwind + Framer Motion + Supabase + Node.js + Express + Stripe + PayPal + Mercado Pago
