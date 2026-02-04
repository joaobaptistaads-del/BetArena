#!/usr/bin/env node
/**
 * Script para executar o schema SQL no Supabase
 * Conecta usando o SUPABASE_SERVICE_ROLE_KEY e executa as queries
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas');
  console.error('   Verifique o arquivo .env.local');
  process.exit(1);
}

console.log('🚀 Conectando ao Supabase...');
console.log(`   URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      console.error('Erro ao executar SQL:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Erro de conexão:', err);
    return false;
  }
}

async function main() {
  try {
    // Read schema.sql
    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Arquivo não encontrado: ${schemaPath}`);
      process.exit(1);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    console.log(`✅ Schema SQL carregado (${schemaSql.length} caracteres)\n`);

    // Split by GO or ; for multiple statements
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`📝 Encontrado ${statements.length} statements SQL\n`);

    // Execute each statement
    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      process.stdout.write(`[${i + 1}/${statements.length}] Executando... `);

      // Use raw SQL via Postgres RLS bypass
      const { error } = await supabase.from('_sql_test').select('*').limit(1);
      
      // Since we can't use a custom function, let's try a different approach
      // We'll use the HTTP client to execute raw SQL
      console.log('⏭️  Pulado (método alternativo necessário)\n');
    }

    console.log('\n⚠️  Método 1 (RPC) não funcionou.');
    console.log('🔄 Tentando método alternativo via HTTP...\n');

    // Try using HTTP directly with the service role key
    await executeViaSql(schemaSql);

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

async function executeViaSql(sql) {
  const https = require('https');

  const url = new URL(supabaseUrl);
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: sql
    });

    const options = {
      hostname: url.hostname,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'apikey': supabaseServiceKey
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 204) {
          console.log('✅ Schema executado com sucesso!');
          resolve();
        } else {
          console.error(`❌ Erro HTTP ${res.statusCode}`);
          console.error(data);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

main();
