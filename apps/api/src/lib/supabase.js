import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

let currentDir = process.cwd();
const maxDepth = 4;

for (let i = 0; i < maxDepth; i += 1) {
  const envLocalPath = path.join(currentDir, '.env.local');
  const envPath = path.join(currentDir, '.env');

  if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
    break;
  }

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }

  const parentDir = path.resolve(currentDir, '..');
  if (parentDir === currentDir) {
    break;
  }
  currentDir = parentDir;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export let supabaseAdmin = null;

if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
} else {
  console.warn(
    '⚠️  Supabase admin client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );
}
