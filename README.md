# BetArena

Plataforma de campeonatos eSports (EA FC 26) com sistema de pagamentos multi-gateway, apostas e gestão financeira robusta.

## 🚀 Deploy Rápido

```bash
# 1. Push para GitHub (crie um repo primeiro)
git remote add origin https://github.com/SEU_USUARIO/betarena.git
git push -u origin main

# 2. Deploy na Vercel
vercel --prod
```

Veja [DEPLOY.md](DEPLOY.md) para instruções completas.

## 🏗️ Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express (Serverless Functions)
- **Database:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Payments:** Stripe + PayPal + Mercado Pago
- **Hosting:** Vercel

## 📁 Estrutura

```
apps/
  web/          # Next.js frontend
  api/          # Express backend (webhooks)
packages/
  shared/       # Código compartilhado
supabase/
  schema.sql    # Database schema completo
```

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis (copie .env.example para .env)
cp .env.example .env

# Iniciar dev servers
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3001

## ⚙️ Funcionalidades

✅ Sistema de Roles (Admin, Partner, Affiliate, Organizer, Player, Spectator)  
✅ Multi-gateway de pagamentos com escrow automático  
✅ Sistema anti-fraude (detecção de múltiplas contas)  
✅ Geolocalização financeira (moeda/gateway por região)  
✅ Split automático de prêmios  
✅ Carteira virtual interna  
✅ Tribunal de disputas  
✅ Ranking ELO  
✅ Social Feed para parceiros  
✅ Sistema de apostas  

Veja [ARCHITECTURE.md](ARCHITECTURE.md) para detalhes técnicos.

## 📄 Documentação

- [DEPLOY.md](DEPLOY.md) - Guia de deploy
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura técnica
- [SECURITY.md](SECURITY.md) - Política de segurança
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Código de conduta

## 📞 Suporte

Para reportar vulnerabilidades, veja [SECURITY.md](SECURITY.md).

## 📜 Licença

MIT - Veja [LICENSE](LICENSE)
