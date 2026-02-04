import requests
import json
import os
import sys

# Get Vercel token from CLI config
vercel_token_path = os.path.expanduser('~/.vercel/auth.json')
try:
    with open(vercel_token_path, 'r') as f:
        auth_data = json.load(f)
        token = auth_data.get('token')
except:
    print("❌ Erro: Não foi possível encontrar o token do Vercel")
    sys.exit(1)

if not token:
    print("❌ Erro: Token do Vercel não encontrado")
    sys.exit(1)

# Environment variables to add
env_vars = {
    'NEXT_PUBLIC_SUPABASE_URL': {
        'value': 'https://wjhsitjnccmfrudukbix.supabase.co',
        'sensitive': False
    },
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
        'value': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTc1NTksImV4cCI6MjA4NTczMzU1OX0.WHUchnyNmt3hFdzNdLrQcNUFG-TuqJAO0lvxOiweots',
        'sensitive': False
    },
    'SUPABASE_URL': {
        'value': 'https://wjhsitjnccmfrudukbix.supabase.co',
        'sensitive': False
    },
    'SUPABASE_SERVICE_ROLE_KEY': {
        'value': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1NzU1OSwiZXhwIjoyMDg1NzMzNTU5fQ.4o7G3mKad868PjJGWLgC679XmNUcwzjMxxI8lHwnZv0',
        'sensitive': True
    },
    'FRONTEND_ORIGIN': {
        'value': 'https://betarena-kohl.vercel.app',
        'sensitive': False
    },
    'ADMIN_API_KEY': {
        'value': 'betarena-admin-key-2026-super-secret',
        'sensitive': True
    },
    'PORT': {
        'value': '3001',
        'sensitive': False
    }
}

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

project_id = 'betarena'
team_id = 'joao-adrianos-projects-024efa77'

print("🔐 Adicionando variáveis de ambiente ao Vercel...")
print("=" * 80)

for var_name, var_data in env_vars.items():
    url = f'https://api.vercel.com/v9/projects/{project_id}/env'
    
    payload = {
        'key': var_name,
        'value': var_data['value'],
        'target': ['production', 'preview', 'development'],
        'type': 'sensitive' if var_data['sensitive'] else 'plain'
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, params={'teamId': team_id})
        
        if response.status_code in [200, 201]:
            print(f"✅ {var_name}: Adicionado com sucesso")
        else:
            print(f"⚠️  {var_name}: Erro {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ {var_name}: Erro na requisição - {str(e)}")

print("=" * 80)
print("✨ Variáveis de ambiente adicionadas!")
print("\n📝 Próximo passo: Faça redeploy no Vercel")
print("   npx vercel --prod")
