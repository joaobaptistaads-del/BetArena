# BetArena

Projeto base para desenvolvimento de web app com Next.js (React + TypeScript) no frontend e Node.js (Express) no backend, seguindo boas práticas de segurança.

## Requisitos
- Node.js 18+ (recomendado 20+)

## Instalação
1. Copie o arquivo de ambiente:
   - Crie um arquivo `.env` a partir de `.env.example`.
2. Instale as dependências:
   - `npm install`

## Desenvolvimento
- Iniciar frontend e backend juntos:
   - `npm run dev`

## Scripts úteis
- Lint: `npm run lint`
- Build frontend: `npm run build`

## Webhooks de Pagamento
Endpoints iniciais no backend:
- Stripe: `/webhooks/stripe`
- PayPal: `/webhooks/paypal`
- Mercado Pago: `/webhooks/mercadopago`

Para liquidação manual (admin):
- POST `/admin/tournaments/:id/settle` (header `x-admin-key`)

Configure as credenciais no arquivo `.env` (veja `.env.example`).

## Estrutura
- `apps/web`: Next.js + TypeScript + Tailwind
- `apps/api`: Node.js + Express
- `packages/shared`: código compartilhado

## Segurança
Consulte a política em SECURITY.md para reporte responsável de vulnerabilidades.
