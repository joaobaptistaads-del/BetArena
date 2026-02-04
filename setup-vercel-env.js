#!/usr/bin/env node
/**
 * Script para adicionar variáveis de ambiente ao Vercel via curl/fetch
 * Executar: node setup-vercel-env.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read token from Vercel CLI config
const tokenPath = path.join(process.env.HOME || process.env.USERPROFILE, '.vercel', 'auth.json');
let token = '';

try {
  const authData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  token = authData.token;
} catch (error) {
  console.error('❌ Erro: Não foi possível encontrar o token do Vercel em:', tokenPath);
  console.error('   Faça login com: npx vercel login');
  process.exit(1);
}

const projectId = 'betarena';
const teamId = 'joao-adrianos-projects-024efa77';

const envVars = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://wjhsitjnccmfrudukbix.supabase.co', sensitive: false },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTc1NTksImV4cCI6MjA4NTczMzU1OX0.WHUchnyNmt3hFdzNdLrQcNUFG-TuqJAO0lvxOiweots', sensitive: false },
  { key: 'SUPABASE_URL', value: 'https://wjhsitjnccmfrudukbix.supabase.co', sensitive: false },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1NzU1OSwiZXhwIjoyMDg1NzMzNTU5fQ.4o7G3mKad868PjJGWLgC679XmNUcwzjMxxI8lHwnZv0', sensitive: true },
  { key: 'FRONTEND_ORIGIN', value: 'https://betarena-kohl.vercel.app', sensitive: false },
  { key: 'ADMIN_API_KEY', value: 'betarena-admin-key-2026-super-secret', sensitive: true },
  { key: 'PORT', value: '3001', sensitive: false }
];

async function addEnvVar(variable) {
  const url = `https://api.vercel.com/v9/projects/${projectId}/env?teamId=${teamId}`;
  const payload = {
    key: variable.key,
    value: variable.value,
    target: ['production', 'preview', 'development'],
    type: variable.sensitive ? 'sensitive' : 'plain'
  };

  const curlCmd = `curl -X POST "${url}" -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`;
  
  try {
    const result = execSync(curlCmd, { encoding: 'utf-8' });
    const response = JSON.parse(result);
    
    if (response.id || response.key) {
      console.log(`✅ ${variable.key}: Adicionado com sucesso`);
      return true;
    } else if (response.error) {
      console.log(`⚠️  ${variable.key}: ${response.error.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${variable.key}: Erro na requisição`);
    return false;
  }
}

async function main() {
  console.log('🔐 Adicionando variáveis de ambiente ao Vercel...');
  console.log('='.repeat(80));

  for (const variable of envVars) {
    await addEnvVar(variable);
  }

  console.log('='.repeat(80));
  console.log('✨ Processo concluído!');
  console.log('\n📝 Próximo passo: Faça redeploy no Vercel');
  console.log('   npx vercel --prod');
}

main();
