#!/usr/bin/env node
/**
 * Setup Supabase - Executa schema SQL direto via API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const projectId = 'wjhsitjnccmfrudukbix';
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Erro: Env vars não configuradas');
  process.exit(1);
}

console.log('📋 BetArena - Setup Supabase');
console.log('='.repeat(60));

// Read schema
const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

console.log(`✅ Schema carregado: ${schema.length} caracteres`);
console.log(`✅ Project ID: ${projectId}`);
console.log(`✅ URL: ${supabaseUrl}\n`);

// Function to execute SQL via direct POST to supabase
async function executeSql() {
  return new Promise((resolve, reject) => {
    const url = new URL(supabaseUrl);
    
    // Use the query parameter to directly execute SQL
    const path = '/rest/v1/rpc/exec_sql';
    
    const payload = JSON.stringify({ sql_query: schema });

    const options = {
      hostname: url.hostname,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    console.log('🔄 Enviando schema para Supabase...');

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
          console.log(`✅ SQL executado com sucesso! (status: ${res.statusCode})`);
          resolve(true);
        } else if (res.statusCode === 404) {
          console.error(`❌ Erro 404: Função 'exec_sql' não existe`);
          console.error(`   A função precisa estar criada no Supabase\n`);
          console.error('💡 Solução: Adicione esta função SQL no Supabase:');
          console.error(`
create or replace function exec_sql(sql_query text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql_query;
end;
$$;
          `);
          resolve(false);
        } else {
          console.error(`❌ Erro ${res.statusCode}:`);
          console.error(data);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Erro de conexão:', err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

// Also provide manual instructions
async function main() {
  console.log('⚠️  Tentando executar via API...\n');
  
  try {
    const result = await executeSql();
    
    if (!result) {
      console.log('\n' + '='.repeat(60));
      console.log('📝 INSTRUÇÕES MANUAIS:');
      console.log('='.repeat(60));
      console.log(`
1. Acesse: https://supabase.com/dashboard/project/${projectId}/sql/new
2. Clique em "New query"
3. Cole o conteúdo do arquivo: supabase/schema.sql
4. Clique em "Run"
5. Aguarde a execução
      `);
    }
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

main();
