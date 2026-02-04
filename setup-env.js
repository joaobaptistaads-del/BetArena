#!/usr/bin/env node
const https = require('https');
const fs = require('fs');

const envVars = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://wjhsitjnccmfrudukbix.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTc1NTksImV4cCI6MjA4NTczMzU1OX0.WHUchnyNmt3hFdzNdLrQcNUFG-TuqJAO0lvxOiweots',
  SUPABASE_URL: 'https://wjhsitjnccmfrudukbix.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1NzU1OSwiZXhwIjoyMDg1NzMzNTU5fQ.4o7G3mKad868PjJGWLgC679XmNUcwzjMxxI8lHwnZv0',
  FRONTEND_ORIGIN: 'https://betarena-kohl.vercel.app',
  ADMIN_API_KEY: 'betarena-admin-key-2026-super-secret',
  PORT: '3001'
};

console.log('Variáveis de ambiente para adicionar no Vercel:');
console.log('='.repeat(80));
Object.entries(envVars).forEach(([key, value]) => {
  const masked = key.includes('KEY') || key.includes('SECRET') ? value.substring(0, 20) + '...' : value;
  console.log(`${key}: ${masked}`);
});
console.log('='.repeat(80));
console.log('\nAcesse: https://vercel.com/joao-adrianos-projects-024efa77/betarena/settings/environment-variables');
console.log('E adicione cada variável acima selecionando "Production, Preview, and Development"');
