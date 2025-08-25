const fs = require('fs');
const path = require('path');

// Function to output all migrations for manual execution
function runMigrationsDirectly() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log('Found migration files:', migrationFiles);
  console.log('\n📋 Copy and paste the following SQL into your Supabase SQL Editor:\n');
  console.log('-- ='.repeat(40));
  console.log('-- FITNESS COACH APP DATABASE MIGRATIONS');
  console.log('-- Run these in order in your Supabase SQL Editor');
  console.log('-- ='.repeat(40));

  for (const file of migrationFiles) {
    console.log(`\n-- Migration: ${file}`);
    console.log('-- ' + '-'.repeat(50));
    
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(sql);
    console.log('\n-- End of ' + file);
    console.log('-- ' + '-'.repeat(50));
  }

  console.log('\n-- ='.repeat(40));
  console.log('-- END OF MIGRATIONS');
  console.log('-- ='.repeat(40));
}

function main() {
  console.log('🚀 Fitness Coach App Database Migrations');
  console.log('📋 Copy and paste the following SQL into your Supabase SQL Editor:\n');
  runMigrationsDirectly();
}

main();