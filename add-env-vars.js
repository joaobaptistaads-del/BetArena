#!/usr/bin/env node

/**
 * Script para adicionar variáveis de ambiente ao Vercel usando a API
 * Usa npx vercel whoami para obter o token implicitamente
 */

const { exec } = require('child_process');
const https = require('https');

const projectId = 'betarena';
const teamId = 'joao-adrianos-projects-024efa77';

const envVars = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    value: 'https://wjhsitjnccmfrudukbix.supabase.co',
    type: 'plain'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTc1NTksImV4cCI6MjA4NTczMzU1OX0.WHUchnyNmt3hFdzNdLrQcNUFG-TuqJAO0lvxOiweots',
    type: 'plain'
  },
  {
    key: 'SUPABASE_URL',
    value: 'https://wjhsitjnccmfrudukbix.supabase.co',
    type: 'plain'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1NzU1OSwiZXhwIjoyMDg1NzMzNTU5fQ.4o7G3mKad868PjJGWLgC679XmNUcwzjMxxI8lHwnZv0',
    type: 'sensitive'
  },
  {
    key: 'FRONTEND_ORIGIN',
    value: 'https://betarena-kohl.vercel.app',
    type: 'plain'
  },
  {
    key: 'ADMIN_API_KEY',
    value: 'betarena-admin-key-2026-super-secret',
    type: 'sensitive'
  }
];

function makeRequest(token, method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'BetArena-Setup/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function addEnvVar(token, envVar) {
  const path = `/v9/projects/${projectId}/env?teamId=${teamId}`;
  const body = {
    key: envVar.key,
    value: envVar.value,
    target: ['production', 'preview', 'development'],
    type: envVar.type
  };

  try {
    const response = await makeRequest(token, 'POST', path, body);
    if (response.status === 200 || response.status === 201) {
      return { success: true, key: envVar.key };
    } else {
      return { success: false, key: envVar.key, error: response.data };
    }
  } catch (error) {
    return { success: false, key: envVar.key, error: error.message };
  }
}

// Try to get token from Vercel CLI cache
function getTokenFromVercelCLI(callback) {
  // Try multiple possible locations
  const fs = require('fs');
  const path = require('path');
  
  const possiblePaths = [
    path.join(process.env.USERPROFILE || process.env.HOME, '.vercel', 'auth.json'),
    path.join(process.env.APPDATA || process.env.HOME, '.vercel', 'auth.json'),
  ];

  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (data.token) {
          callback(null, data.token);
          return;
        }
      }
    } catch (e) {
      // continue to next path
    }
  }

  // If we can't find it, notify user
  callback(new Error('Token not found. Make sure you are logged in with: npx vercel login'));
}

async function main() {
  console.log('🔐 Adicionando variáveis de ambiente ao Vercel...\n');

  getTokenFromVercelCLI(async (err, token) => {
    if (err) {
      console.error('❌', err.message);
      process.exit(1);
    }

    let successCount = 0;
    let failCount = 0;

    for (const envVar of envVars) {
      const result = await addEnvVar(token, envVar);
      if (result.success) {
        console.log(`✅ ${result.key}: Adicionado com sucesso`);
        successCount++;
      } else {
        console.log(`❌ ${result.key}: Erro - ${JSON.stringify(result.error)}`);
        failCount++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`✨ Processo concluído! (${successCount} sucesso, ${failCount} erro)`);
    console.log('='.repeat(80));

    if (failCount === 0) {
      console.log('\n📝 Próximo passo: Faça redeploy no Vercel');
      console.log('   npx vercel --prod');
    }
  });
}

main();
