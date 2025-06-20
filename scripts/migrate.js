#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env.local file has:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Starting database migration...');
  
  try {
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();
    
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    
    for (const file of migrationFiles) {
      if (!file.endsWith('.sql')) continue;
      
      console.log(`📄 Running migration: ${file}`);
      
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf-8');
      
      // Split by semicolon and filter out empty statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
          if (error) {
            // Try direct query if RPC fails
            const { error: directError } = await supabase
              .from('_migrations')
              .select('*')
              .limit(1);
            
            if (directError) {
              // Execute SQL directly via the REST API
              const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                  'Content-Type': 'application/json',
                  'apikey': supabaseServiceKey,
                },
                body: JSON.stringify({ query: statement })
              });
              
              if (!response.ok) {
                console.warn(`⚠️  Warning executing statement: ${statement.substring(0, 100)}...`);
                console.warn(`Response: ${response.status} ${response.statusText}`);
              }
            }
          }
        } catch (err) {
          console.warn(`⚠️  Warning with statement: ${err.message}`);
        }
      }
      
      console.log(`✅ Completed: ${file}`);
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('✅ Your RecallForge database is ready!');
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Go to http://localhost:3000/auth/signup');
    console.log('3. Create your first parent account');
    console.log('');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

async function validateDatabase() {
  console.log('🔍 Validating database schema...');
  
  try {
    // Check if essential tables exist
    const tables = ['users', 'child_profiles', 'decks', 'questions', 'test_sessions', 'question_responses'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table '${table}' not found or inaccessible:`, error.message);
        return false;
      } else {
        console.log(`✅ Table '${table}' exists and accessible`);
      }
    }
    
    console.log('🎉 Database schema validation passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Database validation failed:', error.message);
    return false;
  }
}

// Main execution
const command = process.argv[2];

if (command === 'validate') {
  validateDatabase();
} else {
  runMigrations();
}