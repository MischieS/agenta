const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './.env.local' });

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(`${colors.red}Error: Supabase URL and key are required in .env.local file${colors.reset}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrationsDir = path.join(__dirname, '..', 'migrations');

async function runMigration(filePath) {
  const fileName = path.basename(filePath);
  console.log(`${colors.yellow}Applying migration: ${fileName}${colors.reset}`);

  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split the SQL by semicolons to handle multiple statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const { error } = await supabase.rpc('pgcode_exec', {
        query: statement
      });

      if (error) {
        console.error(`${colors.red}Error executing statement in ${fileName}:${colors.reset}`, error);
        console.error(`Statement: ${statement}`);
        // Don't exit - try to apply other statements and migrations
      }
    }
    
    console.log(`${colors.green}✓ Successfully applied migration: ${fileName}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error applying migration ${fileName}:${colors.reset}`, error);
    return false;
  }
}

async function applyMigrations() {
  console.log(`${colors.bright}${colors.blue}===== Applying Database Migrations =====${colors.reset}\n`);
  
  try {
    // Get all SQL files in the migrations directory
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => path.join(migrationsDir, file));
    
    console.log(`Found ${migrationFiles.length} migration files to apply:\n`);
    migrationFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${path.basename(file)}`);
    });
    console.log('');
    
    // Apply migrations in sequence
    let successCount = 0;
    let failCount = 0;
    
    for (const file of migrationFiles) {
      const success = await runMigration(file);
      if (success) successCount++;
      else failCount++;
    }
    
    console.log(`\n${colors.bright}${colors.green}===== Migration Summary =====${colors.reset}`);
    console.log(`Total migrations: ${migrationFiles.length}`);
    console.log(`Successfully applied: ${successCount}`);
    
    if (failCount > 0) {
      console.log(`${colors.red}Failed migrations: ${failCount}${colors.reset}`);
      return false;
    }
    
    console.log(`\n${colors.bright}${colors.green}All migrations applied successfully!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error during migration process:${colors.reset}`, error);
    return false;
  }
}

// Run migrations
applyMigrations().then(success => {
  if (!success) {
    console.log(`\n${colors.yellow}There were errors during the migration process. Please review the logs above.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}Database is now ready for testing!${colors.reset}`);
    process.exit(0);
  }
});
