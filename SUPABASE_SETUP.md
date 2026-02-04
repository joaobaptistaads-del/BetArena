# Guia de Configuração do Supabase

## 📋 Pré-requisitos
- Conta no Supabase (criar em https://supabase.com)
- Acesso ao dashboard do Vercel

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse https://supabase.com e faça login
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: BetArena (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha South America (São Paulo) para melhor latência
   - **Pricing Plan**: Free (ou conforme necessidade)
4. Clique em **"Create new project"**
5. Aguarde ~2 minutos para o projeto ser provisionado

## 🗄️ Passo 2: Executar o Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor** (menu lateral esquerdo)
2. Clique em **"New query"**
3. Abra o arquivo `supabase/schema.sql` deste projeto
4. Copie **TODO** o conteúdo do arquivo
5. Cole no editor SQL do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. Aguarde a execução - você verá "Success. No rows returned"

### ✅ Verificar se funcionou:
- Vá em **Table Editor** no menu lateral
- Você deve ver todas as tabelas criadas: `profiles`, `tournaments`, `matches`, `wallets`, etc.

## 🔑 Passo 3: Obter as Credenciais

1. No dashboard do Supabase, clique em **Settings** (ícone de engrenagem)
2. Vá em **API** no menu lateral

### Copie estas informações:

**Project URL** (exemplo: `https://abcdefghijklmn.supabase.co`)
```
Esta é sua SUPABASE_URL e NEXT_PUBLIC_SUPABASE_URL
```

**anon public** (API Key)
```
Esta é sua NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**service_role secret** (⚠️ NUNCA COMPARTILHE)
```
Esta é sua SUPABASE_SERVICE_ROLE_KEY (só para backend!)
```

## 🌐 Passo 4: Configurar Variáveis de Ambiente Localmente

1. Na raiz do projeto, crie o arquivo `.env.local`:

```bash
# Frontend (Next.js)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Backend (API Express)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui

# Outras configurações
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
ADMIN_API_KEY=sua-chave-admin-forte
```

2. **IMPORTANTE**: O arquivo `.env.local` já está no `.gitignore` e NÃO será commitado

## ☁️ Passo 5: Configurar no Vercel

1. Acesse https://vercel.com/joao-adrianos-projects-024efa77/betarena
2. Vá em **Settings** → **Environment Variables**
3. Adicione TODAS as variáveis abaixo:

### Frontend (usadas pelo Next.js):
```
NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sua-anon-key-aqui
```

### Backend (usadas pela API):
```
SUPABASE_URL = https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY = sua-service-role-key-aqui
PORT = 3001
FRONTEND_ORIGIN = https://betarena-kohl.vercel.app
ADMIN_API_KEY = sua-chave-admin-forte
```

4. **Environment**: Selecione "Production, Preview, and Development" para todas
5. Clique em **"Save"** em cada variável

## 🔄 Passo 6: Fazer Redeploy

Após adicionar as variáveis no Vercel:

### Opção 1: Via Dashboard
1. Vá em **Deployments**
2. Clique nos 3 pontinhos do último deployment
3. Clique em **"Redeploy"**

### Opção 2: Via CLI (mais rápido)
```bash
npx vercel --prod
```

## 🧪 Passo 7: Testar a Autenticação

1. Acesse https://betarena-kohl.vercel.app/register
2. Crie uma conta de teste
3. Verifique se você foi redirecionado para `/home`
4. No Supabase, vá em **Authentication** → **Users**
5. Você deve ver o usuário criado!

## 📊 Passo 8: Verificar Dados

### No Supabase:
1. Vá em **Table Editor**
2. Clique na tabela `profiles`
3. Você deve ver um registro com seu usuário

### No Browser:
1. Abra DevTools (F12)
2. Vá em **Application** → **Local Storage**
3. Procure por `supabase.auth.token` - deve estar presente!

## 🔐 Configurar Row Level Security (RLS)

O schema já criou as políticas RLS, mas vamos confirmar:

1. No Supabase, vá em **Table Editor**
2. Para cada tabela, clique na tabela e depois em **RLS** (shield icon)
3. Verifique se está **"RLS enabled"**
4. Deve haver políticas como:
   - `Users can view their own profile`
   - `Users can update their own profile`
   - etc.

## 🎉 Pronto!

Sua aplicação agora tem:
- ✅ Autenticação funcional com Supabase
- ✅ Banco de dados PostgreSQL completo
- ✅ Row Level Security configurado
- ✅ Integração frontend + backend

## 🐛 Troubleshooting

### Erro: "Invalid JWT"
- Verifique se as URLs do Supabase estão corretas
- Confirme que está usando `NEXT_PUBLIC_` prefix no frontend

### Erro: "relation does not exist"
- Execute o schema SQL novamente
- Verifique se todas as tabelas foram criadas no Table Editor

### Usuário não aparece após registro
- Vá em Supabase → Authentication → URL Configuration
- Confirme que "Enable email confirmations" está **desabilitado** (ou configure emails)

### "Supabase client not configured"
- Verifique se as env vars estão no Vercel
- Faça redeploy após adicionar as variáveis

## 📞 Próximos Passos Opcionais

1. **Configurar Email**: Para confirmação de email e reset de senha
2. **Configurar OAuth**: Login com Google, GitHub, etc.
3. **Adicionar Storage**: Para avatars e imagens de torneios
4. **Configurar Webhooks**: Para eventos de autenticação
5. **Backups**: Configurar backups automáticos do banco

## 🔗 Links Úteis

- Documentação Supabase: https://supabase.com/docs
- Dashboard do Projeto: https://app.supabase.com
- Vercel Dashboard: https://vercel.com/dashboard
- BetArena Produção: https://betarena-kohl.vercel.app
