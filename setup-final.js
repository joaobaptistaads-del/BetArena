#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_ID = 'wjhsitjnccmfrudukbix';

console.log('🚀 BetArena - Setup Final');
console.log('='.repeat(60));

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Erro: SUPABASE_URL ou SERVICE_ROLE_KEY não configurados');
  console.error('Verifique .env.local');
  process.exit(1);
}

// Read schema.sql
const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

console.log(`✅ Schema carregado: ${schema.length} caracteres`);
console.log(`✅ URL: ${SUPABASE_URL}\n`);

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ sql }));
    req.end();
  });
}

async function main() {
  try {
    console.log('📡 Tentando executar schema via API...\n');
    
    const result = await executeSQL(schema);
    
    if (result.success) {
      console.log('✅ Schema executado com sucesso!\n');
      console.log('🎉 BetArena está pronto para uso!\n');
      console.log('Próximos passos:');
      console.log('1. Aguarde 2-3 minutos para o Vercel fazer deploy');
      console.log('2. Acesse: https://betarena-kohl.vercel.app/register');
      console.log('3. Crie uma conta e faça login');
      console.log('4. Você deve ser redirecionado para /home\n');
      process.exit(0);
    } else if (result.status === 404) {
      console.log('⚠️  RPC exec_sql não disponível. Não há problema!\n');
      console.log('📌 INSTRUÇÕES MANUAIS (2 minutos):\n');
      console.log('1. Abra: https://supabase.com/dashboard/project/wjhsitjnccmfrudukbix/sql/new');
      console.log('2. Execute isto primeiro:\n');
      console.log('   drop trigger if exists on_auth_user_created on auth.users;');
      console.log('   drop function if exists public.handle_new_user();\n');
      console.log('3. Depois copie TODO o arquivo: supabase/schema.sql');
      console.log('4. Cole no editor SQL e clique em RUN\n');
      console.log('5. Aguarde a execução completar\n');
      console.log('Pronto! O setup está feito. 🚀');
      process.exit(0);
    } else {
      console.log(`⚠️  Erro ${result.status}:`, result.data);
      console.log('\nTentando método alternativo...\n');
      
      // Fallback: mostrar instruções
      console.log('📌 INSTRUÇÕES ALTERNATIVAS:\n');
      console.log('1. Abra: https://supabase.com/dashboard/project/wjhsitjnccmfrudukbix/sql/new');
      console.log('2. Execute isto primeiro:\n');
      console.log('   drop trigger if exists on_auth_user_created on auth.users;');
      console.log('   drop function if exists public.handle_new_user();\n');
      console.log('3. Depois copie TODO o arquivo: supabase/schema.sql');
      console.log('4. Cole no editor SQL e clique em RUN\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n📌 INSTRUÇÕES ALTERNATIVAS:\n');
    console.log('1. Abra: https://supabase.com/dashboard/project/wjhsitjnccmfrudukbix/sql/new');
    console.log('2. Execute isto primeiro:\n');
    console.log('   drop trigger if exists on_auth_user_created on auth.users;');
    console.log('   drop function if exists public.handle_new_user();\n');
    console.log('3. Depois copie TODO o arquivo: supabase/schema.sql');
    console.log('4. Cole no editor SQL e clique em RUN\n');
    process.exit(1);
  }
}

main();
