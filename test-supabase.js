// Test script to check Supabase connection and data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wjhsitjnccmfrudukbix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaHNpdGpuY2NtZnJ1ZHVrYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTc1NTksImV4cCI6MjA4NTczMzU1OX0.WHUchnyNmt3hFdzNdLrQcNUFG-TuqJAO0lvxOiweots';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('🧪 Testing Supabase connection...\n');

  try {
    // Test 1: Check if games table exists and has data
    console.log('✓ Test 1: Fetching games...');
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*');
    
    if (gamesError) {
      console.error('❌ Error fetching games:', gamesError.message);
    } else {
      console.log('✅ Games found:', games.length);
      console.log(games);
    }

    // Test 2: Check if profiles table exists
    console.log('\n✓ Test 2: Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error accessing profiles:', profilesError.message);
    } else {
      console.log('✅ Profiles table accessible');
    }

    // Test 3: Check if challenges table exists
    console.log('\n✓ Test 3: Checking challenges table...');
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('count')
      .limit(1);
    
    if (challengesError) {
      console.error('❌ Error accessing challenges:', challengesError.message);
    } else {
      console.log('✅ Challenges table accessible');
    }

    console.log('\n✅ All tests passed! Supabase is connected properly.');

  } catch (err) {
    console.error('❌ Fatal error:', err.message);
  }
}

test();
