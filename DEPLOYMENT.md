# BetArena - eSports Betting Platform

Plataforma de torneios EA FC 26 com pagamentos e sistema de apostas.

## Setup Local

```bash
# Instalar dependências
npm install

# Criar arquivo .env.local na raiz
# Copiar variáveis de SUPABASE_URL e chaves do Supabase

# Rodar em desenvolvimento
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3001

## Páginas

- `/` - Landing page
- `/register` - Cadastro
- `/login` - Login
- `/home` - Torneios
- `/profile` - Perfil
- `/ranking` - Ranking
- `/debug` - Debug de autenticação (apenas desenvolvimento)

## Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Express.js
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Payments**: Stripe, PayPal, Mercado Pago

## Deployment

Conectar repositório no Vercel e fazer deploy automático.
