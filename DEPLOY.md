# Deployment Guide - BetArena

## 🚀 Deploy na Vercel (Recomendado)

### Pré-requisitos
1. Conta na [Vercel](https://vercel.com)
2. Conta no [GitHub](https://github.com)
3. Conta no [Supabase](https://supabase.com)
4. Contas nos gateways de pagamento (Stripe, PayPal, Mercado Pago)

### Passo 1: Inicializar Git e Push para GitHub

```bash
cd C:\Users\joaob\OneDrive\Desktop\BetArena
git init
git add .
git commit -m "Initial commit - BetArena eSports Platform"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/betarena.git
git push -u origin main
```

### Passo 2: Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. No SQL Editor, execute o conteúdo do arquivo `supabase/schema.sql`
3. Copie as credenciais:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` (para frontend)
   - `SUPABASE_SERVICE_ROLE_KEY` (para backend - NUNCA exponha!)

### Passo 3: Configurar Gateways de Pagamento

#### Stripe
1. Acesse [stripe.com](https://stripe.com) → Developers → API keys
2. Copie: `STRIPE_SECRET_KEY`
3. Configure webhook: Settings → Webhooks → Add endpoint
   - URL: `https://seu-dominio.vercel.app/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`
   - Copie: `STRIPE_WEBHOOK_SECRET`

#### PayPal
1. Acesse [developer.paypal.com](https://developer.paypal.com)
2. My Apps & Credentials → Create App
3. Copie: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
4. Configure webhook:
   - URL: `https://seu-dominio.vercel.app/webhooks/paypal`
   - Eventos: `CHECKOUT.ORDER.APPROVED`
   - Copie: `PAYPAL_WEBHOOK_ID`

#### Mercado Pago
1. Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Suas integrações → Criar aplicação
3. Copie: `MERCADOPAGO_ACCESS_TOKEN`
4. Configure webhook:
   - URL: `https://seu-dominio.vercel.app/webhooks/mercadopago`
   - Copie: `MERCADOPAGO_WEBHOOK_SECRET`

### Passo 4: Deploy na Vercel

#### Via CLI (Recomendado)
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Via Dashboard
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Import Git Repository → Selecione `betarena`
3. Configure o projeto:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. Configure as variáveis de ambiente:

**Frontend (apps/web)**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**Backend (apps/api) - Deploy separado como Serverless Functions**
```
PORT=3001
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx
PAYPAL_ENV=live
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx
MERCADOPAGO_WEBHOOK_SECRET=xxx
ADMIN_API_KEY=generate_random_key_here
```

5. Clique em **Deploy**

### Passo 5: Configurar Domínio Customizado (Opcional)

1. Vercel Dashboard → Settings → Domains
2. Adicione seu domínio (ex: `betarena.gg`)
3. Configure DNS conforme instruções da Vercel

### Passo 6: Atualizar URLs dos Webhooks

Após o deploy, atualize as URLs dos webhooks nos dashboards:
- Stripe: `https://betarena.gg/webhooks/stripe`
- PayPal: `https://betarena.gg/webhooks/paypal`
- Mercado Pago: `https://betarena.gg/webhooks/mercadopago`

### Passo 7: Testar o Deploy

1. Acesse `https://seu-projeto.vercel.app`
2. Verifique o health check da API: `https://seu-projeto.vercel.app/api/health`
3. Teste um pagamento em modo sandbox/teste

## 🔧 Deploy Alternativo (Backend Standalone)

Se preferir hospedar a API separadamente:

### Railway / Render / Fly.io
```bash
# Railway
npm install -g @railway/cli
railway login
railway init
railway up

# Render
# Conecte o repositório via dashboard

# Fly.io
flyctl launch
flyctl deploy
```

## 📊 Monitoramento

### Vercel Analytics
- Ative em Project Settings → Analytics

### Supabase Logs
- Dashboard → Logs (para queries e erros)

### Sentry (Opcional)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🔐 Checklist de Segurança Pré-Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Service Role Key do Supabase NUNCA exposta no frontend
- [ ] RLS (Row Level Security) ativado em todas as tabelas
- [ ] Webhooks com verificação de assinatura
- [ ] Rate limiting configurado
- [ ] CORS configurado corretamente
- [ ] HTTPS obrigatório (Vercel faz automaticamente)
- [ ] Secrets em produção (não usar keys de teste)

## 🚨 Pós-Deploy

1. **Monitore os logs** das primeiras transações
2. **Teste fluxo completo:** Inscrição → Pagamento → Webhook → Confirmação
3. **Configure alertas** para erros críticos
4. **Documente** os links dos webhooks registrados
5. **Faça backup** do schema do Supabase

## 📞 Suporte

Em caso de problemas:
- Vercel Logs: `vercel logs`
- Supabase Logs: Dashboard → Logs
- Stripe Logs: Dashboard → Developers → Logs
- PayPal Activity: Dashboard → Activity
- Mercado Pago: Dashboard → Atividade

---

**Importante:** Sempre teste em ambiente de sandbox antes de ir para produção!
