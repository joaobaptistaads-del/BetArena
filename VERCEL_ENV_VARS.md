# 🔐 Adicionar Variáveis de Ambiente no Vercel

## ⚡ Rápido (5 minutos)

1. **Abra o link abaixo:**
   https://vercel.com/joao-adrianos-projects-024efa77/betarena/settings/environment-variables

2. **Clique em "Add"** no canto superior direito

3. **Cole cada linha abaixo, uma por uma:**

### Frontend (2 variáveis)

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://wjhsitjnccmfrudukbix.supabase.co
Environments: ✓ Production  ✓ Preview  ✓ Development
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTc1NTksImV4cCI6MjA4NTczMzU1OX0.WHUchnyNmt3hFdzNdLrQcNUFG-TuqJAO0lvxOiweots
Environments: ✓ Production  ✓ Preview  ✓ Development
```

### Backend (2 variáveis)

```
Name: SUPABASE_URL
Value: https://wjhsitjnccmfrudukbix.supabase.co
Environments: ✓ Production  ✓ Preview  ✓ Development
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1NzU1OSwiZXhwIjoyMDg1NzMzNTU5fQ.4o7G3mKad868PjJGWLgC679XmNUcwzjMxxI8lHwnZv0
Environments: ✓ Production  ✓ Preview  ✓ Development
```

### Configuração (2 variáveis)

```
Name: FRONTEND_ORIGIN
Value: https://betarena-kohl.vercel.app
Environments: ✓ Production  ✓ Preview  ✓ Development
```

```
Name: ADMIN_API_KEY
Value: betarena-admin-key-2026-super-secret
Environments: ✓ Production  ✓ Preview  ✓ Development
```

---

## ✅ Depois de adicionar todas:

1. **Vá em "Deployments"**
2. **Clique nos 3 pontinhos do último deployment**
3. **Clique em "Redeploy"**

Ou execute no terminal:
```bash
npx vercel --prod
```

---

## 🎉 Pronto!

Sua aplicação agora terá:
- ✅ Supabase configurado em produção
- ✅ Autenticação funcionando
- ✅ Banco de dados conectado
- ✅ API com acesso ao Supabase admin

---

## 🧪 Testar

1. Acesse: https://betarena-kohl.vercel.app/register
2. Crie uma conta de teste
3. Você deve ser redirecionado para `/home`
4. Verifique no Supabase → Authentication → Users
