#!/usr/bin/env node

/**
 * RecallForge Backend Setup Script
 * Run this script to set up the complete Supabase backend
 */

const { setupRecallForge, healthCheck } = require('../src/lib/setup.ts');

async function main() {
  console.log('🎯 RecallForge Backend Setup\n');
  console.log('This script will set up your Supabase backend with:');
  console.log('• Database schema with COPPA-compliant structure');
  console.log('• Row Level Security policies');
  console.log('• Storage buckets for file uploads');
  console.log('• Authentication configuration\n');

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'setup':
      await runSetup();
      break;
    case 'health':
      await runHealthCheck();
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

async function runSetup() {
  try {
    const result = await setupRecallForge();
    
    if (result.success) {
      console.log('\n🎉 Setup completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Start your development server: npm run dev');
      console.log('2. Visit http://localhost:3000 to test the application');
      console.log('3. Create your first parent account and child profile');
      process.exit(0);
    } else {
      console.log('\n❌ Setup failed. Please check the errors above and try again.');
      console.log('\nCommon issues:');
      console.log('• Missing environment variables (check .env.local)');
      console.log('• Incorrect Supabase configuration');
      console.log('• Network connectivity issues');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Setup script failed:', error);
    process.exit(1);
  }
}

async function runHealthCheck() {
  console.log('🔍 Running health check...\n');
  
  try {
    const health = await healthCheck();
    
    console.log('System Health Report:');
    console.log('====================');
    
    for (const [system, status] of Object.entries(health.systems)) {
      const icon = status.status === 'healthy' ? '✅' : '❌';
      console.log(`${icon} ${system}: ${status.status} (${status.responseTime}ms)`);
    }
    
    console.log(`\nOverall Status: ${health.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    
    process.exit(health.healthy ? 0 : 1);
  } catch (error) {
    console.error('\n💥 Health check failed:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log('RecallForge Backend Setup Commands:');
  console.log('');
  console.log('Commands:');
  console.log('  setup    Run complete backend setup');
  console.log('  health   Check system health');
  console.log('  help     Show this help message');
  console.log('');
  console.log('Environment Variables Required:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL      Your Supabase project URL');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY Your Supabase anonymous key');
  console.log('  SUPABASE_SERVICE_ROLE_KEY     Your Supabase service role key');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/setup.js setup');
  console.log('  node scripts/setup.js health');
  console.log('');
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  console.error('\n💥 Script error:', error);
  process.exit(1);
});