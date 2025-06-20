import { migrationRunner } from './migrations';
import { initializeStorage } from './storage';
import { createAdminSupabase } from './supabase-server';

export interface SetupResult {
  success: boolean;
  steps: Array<{
    name: string;
    success: boolean;
    message: string;
    duration: number;
  }>;
  totalDuration: number;
}

/**
 * Complete setup script for RecallForge backend
 * This should be run after environment variables are configured
 */
export async function setupRecallForge(): Promise<SetupResult> {
  const startTime = Date.now();
  const steps: SetupResult['steps'] = [];

  console.log('🚀 Starting RecallForge backend setup...\n');

  // Step 1: Validate environment variables
  const envStep = await validateEnvironment();
  steps.push(envStep);
  if (!envStep.success) {
    return {
      success: false,
      steps,
      totalDuration: Date.now() - startTime
    };
  }

  // Step 2: Test database connection
  const dbStep = await testDatabaseConnection();
  steps.push(dbStep);
  if (!dbStep.success) {
    return {
      success: false,
      steps,
      totalDuration: Date.now() - startTime
    };
  }

  // Step 3: Run database migrations
  const migrationStep = await runMigrations();
  steps.push(migrationStep);
  if (!migrationStep.success) {
    return {
      success: false,
      steps,
      totalDuration: Date.now() - startTime
    };
  }

  // Step 4: Initialize storage buckets
  const storageStep = await initializeStorageBuckets();
  steps.push(storageStep);

  // Step 5: Validate schema
  const schemaStep = await validateDatabaseSchema();
  steps.push(schemaStep);

  // Step 6: Test authentication
  const authStep = await testAuthentication();
  steps.push(authStep);

  const allSuccessful = steps.every(step => step.success);
  const totalDuration = Date.now() - startTime;

  if (allSuccessful) {
    console.log('\n✅ RecallForge backend setup completed successfully!');
    console.log(`Total time: ${totalDuration}ms\n`);
  } else {
    console.log('\n❌ RecallForge backend setup failed. Please check the errors above.\n');
  }

  return {
    success: allSuccessful,
    steps,
    totalDuration
  };
}

/**
 * Validate required environment variables
 */
async function validateEnvironment(): Promise<SetupResult['steps'][0]> {
  const stepStart = Date.now();
  console.log('1. Validating environment variables...');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    console.log(`   ❌ ${message}`);
    return {
      name: 'Environment Validation',
      success: false,
      message,
      duration: Date.now() - stepStart
    };
  }

  console.log('   ✅ All required environment variables found');
  return {
    name: 'Environment Validation',
    success: true,
    message: 'All required environment variables are configured',
    duration: Date.now() - stepStart
  };
}

/**
 * Test database connection
 */
async function testDatabaseConnection(): Promise<SetupResult['steps'][0]> {
  const stepStart = Date.now();
  console.log('2. Testing database connection...');

  try {
    const supabase = createAdminSupabase();
    
    // Simple query to test connection
    const { error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('   ✅ Database connection successful');
    return {
      name: 'Database Connection',
      success: true,
      message: 'Successfully connected to Supabase database',
      duration: Date.now() - stepStart
    };

  } catch (error) {
    const message = `Database connection failed: ${error}`;
    console.log(`   ❌ ${message}`);
    return {
      name: 'Database Connection',
      success: false,
      message,
      duration: Date.now() - stepStart
    };
  }
}

/**
 * Run database migrations
 */
async function runMigrations(): Promise<SetupResult['steps'][0]> {
  const stepStart = Date.now();
  console.log('3. Running database migrations...');

  try {
    await migrationRunner.runMigrations();
    
    console.log('   ✅ Database migrations completed');
    return {
      name: 'Database Migrations',
      success: true,
      message: 'All database migrations applied successfully',
      duration: Date.now() - stepStart
    };

  } catch (error) {
    const message = `Migration failed: ${error}`;
    console.log(`   ❌ ${message}`);
    return {
      name: 'Database Migrations',
      success: false,
      message,
      duration: Date.now() - stepStart
    };
  }
}

/**
 * Initialize storage buckets
 */
async function initializeStorageBuckets(): Promise<SetupResult['steps'][0]> {
  const stepStart = Date.now();
  console.log('4. Initializing storage buckets...');

  try {
    await initializeStorage();
    
    console.log('   ✅ Storage buckets initialized');
    return {
      name: 'Storage Initialization',
      success: true,
      message: 'Storage buckets created and configured',
      duration: Date.now() - stepStart
    };

  } catch (error) {
    const message = `Storage initialization failed: ${error}`;
    console.log(`   ⚠️  ${message}`);
    // Storage initialization is not critical, so we continue
    return {
      name: 'Storage Initialization',
      success: true, // Mark as success but with warning
      message: `Storage setup completed with warnings: ${error}`,
      duration: Date.now() - stepStart
    };
  }
}

/**
 * Validate database schema
 */
async function validateDatabaseSchema(): Promise<SetupResult['steps'][0]> {
  const stepStart = Date.now();
  console.log('5. Validating database schema...');

  try {
    const validation = await migrationRunner.validateSchema();
    
    if (validation.valid) {
      console.log('   ✅ Database schema validation passed');
      return {
        name: 'Schema Validation',
        success: true,
        message: 'Database schema is valid and complete',
        duration: Date.now() - stepStart
      };
    } else {
      const message = `Schema validation failed: ${validation.errors.join(', ')}`;
      console.log(`   ❌ ${message}`);
      return {
        name: 'Schema Validation',
        success: false,
        message,
        duration: Date.now() - stepStart
      };
    }

  } catch (error) {
    const message = `Schema validation error: ${error}`;
    console.log(`   ❌ ${message}`);
    return {
      name: 'Schema Validation',
      success: false,
      message,
      duration: Date.now() - stepStart
    };
  }
}

/**
 * Test authentication system
 */
async function testAuthentication(): Promise<SetupResult['steps'][0]> {
  const stepStart = Date.now();
  console.log('6. Testing authentication system...');

  try {
    const supabase = createAdminSupabase();
    
    // Test admin auth functions
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    
    if (error) {
      throw error;
    }

    console.log('   ✅ Authentication system working');
    return {
      name: 'Authentication Test',
      success: true,
      message: 'Authentication system is properly configured',
      duration: Date.now() - stepStart
    };

  } catch (error) {
    const message = `Authentication test failed: ${error}`;
    console.log(`   ❌ ${message}`);
    return {
      name: 'Authentication Test',
      success: false,
      message,
      duration: Date.now() - stepStart
    };
  }
}

/**
 * Quick health check for all systems
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  systems: Record<string, { status: string; responseTime: number }>;
}> {
  const systems: Record<string, { status: string; responseTime: number }> = {};

  // Database health
  const dbStart = Date.now();
  try {
    const dbHealth = await migrationRunner.healthCheck();
    systems.database = {
      status: dbHealth.healthy ? 'healthy' : 'unhealthy',
      responseTime: dbHealth.responseTime
    };
  } catch (error) {
    systems.database = {
      status: 'error',
      responseTime: Date.now() - dbStart
    };
  }

  // Auth health
  const authStart = Date.now();
  try {
    const supabase = createAdminSupabase();
    await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    systems.auth = {
      status: 'healthy',
      responseTime: Date.now() - authStart
    };
  } catch (error) {
    systems.auth = {
      status: 'error',
      responseTime: Date.now() - authStart
    };
  }

  const allHealthy = Object.values(systems).every(system => system.status === 'healthy');

  return {
    healthy: allHealthy,
    systems
  };
}

// Export for use in setup scripts
export { migrationRunner, initializeStorage };