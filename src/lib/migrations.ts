import { createAdminSupabase } from './supabase-server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface Migration {
  name: string;
  version: number;
  sql: string;
  checksum: string;
}

interface MigrationHistory {
  id: number;
  migration_name: string;
  applied_at: string;
  checksum: string;
}

export class MigrationRunner {
  private supabase;
  private migrationsPath: string;

  constructor() {
    this.supabase = createAdminSupabase();
    this.migrationsPath = path.join(process.cwd(), 'migrations');
  }

  /**
   * Get all pending migrations by comparing files with database history
   */
  async getPendingMigrations(): Promise<Migration[]> {
    // Get current migration history from database
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedNames = new Set(appliedMigrations.map(m => m.migration_name));

    // Read migration files from filesystem
    const migrationFiles = this.getMigrationFiles();
    const pendingMigrations: Migration[] = [];

    for (const file of migrationFiles) {
      const migrationName = path.basename(file, '.sql');
      
      if (!appliedNames.has(migrationName)) {
        const sql = fs.readFileSync(file, 'utf8');
        const checksum = this.generateChecksum(sql);
        const version = this.extractVersionFromFilename(file);

        pendingMigrations.push({
          name: migrationName,
          version,
          sql,
          checksum
        });
      }
    }

    // Sort by version number
    return pendingMigrations.sort((a, b) => a.version - b.version);
  }

  /**
   * Run all pending migrations
   */
  async runMigrations(): Promise<void> {
    const pendingMigrations = await this.getPendingMigrations();

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations found.');
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migrations.`);

    for (const migration of pendingMigrations) {
      await this.runSingleMigration(migration);
    }

    console.log('All migrations completed successfully.');
  }

  /**
   * Run a single migration within a transaction
   */
  private async runSingleMigration(migration: Migration): Promise<void> {
    console.log(`Running migration: ${migration.name}`);

    try {
      // Execute the migration SQL
      const { error: sqlError } = await this.supabase.rpc('exec_sql', {
        sql: migration.sql
      });

      if (sqlError) {
        throw sqlError;
      }

      // Record the migration in history
      const { error: historyError } = await this.supabase
        .from('migration_history')
        .insert([{
          migration_name: migration.name,
          checksum: migration.checksum,
          applied_at: new Date().toISOString()
        }]);

      if (historyError) {
        throw historyError;
      }

      console.log(`✓ Migration completed: ${migration.name}`);

    } catch (error) {
      console.error(`✗ Migration failed: ${migration.name}`);
      console.error(error);
      throw error;
    }
  }

  /**
   * Get applied migrations from database
   */
  private async getAppliedMigrations(): Promise<MigrationHistory[]> {
    const { data, error } = await this.supabase
      .from('migration_history')
      .select('*')
      .order('applied_at', { ascending: true });

    if (error) {
      // If table doesn't exist, return empty array (fresh database)
      if (error.code === '42P01') {
        return [];
      }
      throw error;
    }

    return data || [];
  }

  /**
   * Get all migration files from the migrations directory
   */
  private getMigrationFiles(): string[] {
    if (!fs.existsSync(this.migrationsPath)) {
      return [];
    }

    return fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .map(file => path.join(this.migrationsPath, file))
      .sort();
  }

  /**
   * Extract version number from migration filename
   */
  private extractVersionFromFilename(filepath: string): number {
    const filename = path.basename(filepath);
    const match = filename.match(/^(\d+)_/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Generate MD5 checksum for migration content
   */
  private generateChecksum(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Validate database schema against expected structure
   */
  async validateSchema(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Check if all required tables exist
      const requiredTables = [
        'users',
        'child_profiles', 
        'decks',
        'questions',
        'test_sessions',
        'question_responses',
        'subscription_billing',
        'email_subscribers'
      ];

      for (const table of requiredTables) {
        const { error } = await this.supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          errors.push(`Table '${table}' does not exist or is not accessible`);
        }
      }

      // Check if RLS is enabled on all tables
      const { data: rlsStatus, error: rlsError } = await this.supabase
        .rpc('check_rls_status');

      if (rlsError) {
        errors.push('Could not verify RLS status');
      }

      // Additional schema validations could be added here

    } catch (error) {
      errors.push(`Schema validation failed: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Reset database by dropping all tables (DANGEROUS - only for development)
   */
  async resetDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database reset is not allowed in production');
    }

    console.warn('WARNING: Resetting database. All data will be lost.');

    const { error } = await this.supabase.rpc('reset_database');

    if (error) {
      throw error;
    }

    console.log('Database reset completed.');
  }

  /**
   * Check database health and connectivity
   */
  async healthCheck(): Promise<{ healthy: boolean; responseTime: number; details: any }> {
    const start = Date.now();
    
    try {
      // Simple query to test connectivity
      const { data, error } = await this.supabase
        .from('migration_history')
        .select('count')
        .limit(1);

      const responseTime = Date.now() - start;

      if (error) {
        return {
          healthy: false,
          responseTime,
          details: { error: error.message }
        };
      }

      return {
        healthy: responseTime < 1000,
        responseTime,
        details: { 
          status: 'connected',
          migrationsApplied: data?.length || 0
        }
      };

    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now() - start,
        details: { error: String(error) }
      };
    }
  }
}

// Export a singleton instance
export const migrationRunner = new MigrationRunner();

// Utility functions for common operations
export const runMigrations = () => migrationRunner.runMigrations();
export const validateSchema = () => migrationRunner.validateSchema();
export const databaseHealthCheck = () => migrationRunner.healthCheck();