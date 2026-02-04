#!/usr/bin/env node
/**
 * Script para desabilitar confirmação de email no Supabase
 * Usa a Management API do Supabase
 */

const https = require('https');
require('dotenv').config();

const projectId = 'wjhsitjnccmfrudukbix';
const accessToken = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!accessToken) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não configurada');
  process.exit(1);
}

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.supabase.com${path}`);
    
    const options = {
      hostname: 'api.supabase.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
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

async function disableEmailConfirmation() {
  console.log('🔧 Desabilitando confirmação de email no Supabase...\n');

  try {
    // Update auth settings
    const response = await makeRequest(
      'PATCH',
      `/v1/projects/${projectId}/auth/config`,
      {
        jwt: {
          exp: 3600
        },
        mailer: {
          enable_signup_confirmation: false,
          enable_email_change_confirmation: false
        }
      }
    );

    if (response.status === 200) {
      console.log('✅ Confirmação de email DESABILITADA com sucesso!');
      return true;
    } else {
      console.error(`❌ Erro ${response.status}:`);
      console.error(response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao conectar à API:', error.message);
    return false;
  }
}

disableEmailConfirmation().then(success => {
  if (!success) {
    console.log('\n⚠️  Você pode desabilitar manualmente em:');
    console.log('   https://supabase.com/dashboard/project/wjhsitjnccmfrudukbix/auth/providers');
  }
  process.exit(success ? 0 : 1);
});
