#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env vars
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 BetArena - Supabase Schema Setup\n');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Erro: Variáveis de ambiente não encontradas!');
    console.error('Verifique se .env.local contém:');
    console.error('  - SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

async function executeSchema() {
    try {
        // Create Supabase client with service role (admin access)
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        });

        // Read schema file
        const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log(`📂 Schema carregado: ${schema.length} caracteres`);
        console.log(`🔗 Supabase URL: ${SUPABASE_URL}\n`);

        // Split queries by semicolon and execute
        const queries = schema
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`📋 Total de queries encontradas: ${queries.length}\n`);

        let successful = 0;
        let failed = 0;

        for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            
            try {
                // Use rpc to execute raw SQL
                const { data, error } = await supabase.rpc('exec_sql', {
                    sql: query
                }).single();

                if (error) throw error;

                successful++;
                const progress = Math.round((i + 1) / queries.length * 100);
                console.log(`✅ [${progress}%] Query ${i + 1}/${queries.length} executada`);
            } catch (err) {
                // If exec_sql doesn't exist, try another approach
                if (err.message && err.message.includes('exec_sql')) {
                    console.log('\n⚠️ exec_sql RPC não disponível. Usando método alternativo...\n');
                    return fallbackExecution(supabase, queries);
                }
                
                failed++;
                console.error(`❌ Query ${i + 1} falhou:`, err.message);
            }
        }

        console.log(`\n📊 Resumo:`);
        console.log(`  ✅ Sucesso: ${successful}`);
        console.log(`  ❌ Falhas: ${failed}`);

        if (failed === 0) {
            console.log('\n🎉 Schema executado com sucesso!');
            return true;
        } else {
            console.log('\n⚠️ Algumas queries falharam. Verifique os erros acima.');
            return false;
        }

    } catch (error) {
        console.error('❌ Erro fatal:', error.message);
        process.exit(1);
    }
}

async function fallbackExecution(supabase, queries) {
    console.log('📌 Alternativa: Executando via SQL direto...\n');
    
    // Try executing entire schema at once
    try {
        const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        const { data, error } = await supabase.from('pg_catalog.pg_tables').select('*').limit(1);
        
        if (error && error.message) {
            console.log('💡 Dica: O Supabase não permite executar SQL via API diretamente.');
            console.log('\n🔗 Siga estes passos manualmente:\n');
            console.log('1. Abra: https://supabase.com/dashboard/project/wjhsitjnccmfrudukbix/sql/new');
            console.log('2. Clique em "New query"');
            console.log('3. Copie TODO o arquivo supabase/schema.sql');
            console.log('4. Cole no editor SQL');
            console.log('5. Clique em "Run"');
            console.log('\n📌 O arquivo SETUP.html nesta pasta tem instruções passo a passo!\n');
            return false;
        }

    } catch (error) {
        console.log('💡 Dica: O Supabase não permite executar SQL via API diretamente.');
        console.log('\n🔗 Siga estes passos manualmente:\n');
        console.log('1. Abra: https://supabase.com/dashboard/project/wjhsitjnccmfrudukbix/sql/new');
        console.log('2. Clique em "New query"');
        console.log('3. Copie TODO o arquivo supabase/schema.sql');
        console.log('4. Cole no editor SQL');
        console.log('5. Clique em "Run"');
        console.log('\n📌 O arquivo SETUP.html nesta pasta tem instruções passo a passo!\n');
        return false;
    }
}

// Run
executeSchema().then(success => {
    if (!success) {
        process.exit(1);
    }
});
