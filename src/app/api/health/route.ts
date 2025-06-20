import { NextRequest, NextResponse } from 'next/server';
import { databaseHealthCheck } from '@/lib/migrations';
import { createAdminSupabase } from '@/lib/supabase-server';

// GET /api/health - Health check endpoint
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const healthChecks = {
    database: { healthy: false, responseTime: 0, details: {} },
    auth: { healthy: false, responseTime: 0, details: {} },
    overall: { healthy: false, responseTime: 0, version: process.env.npm_package_version || 'unknown' }
  };

  try {
    // Database health check
    const dbHealthStart = Date.now();
    const dbHealth = await databaseHealthCheck();
    healthChecks.database = {
      healthy: dbHealth.healthy,
      responseTime: dbHealth.responseTime,
      details: dbHealth.details
    };

    // Auth service health check
    const authHealthStart = Date.now();
    try {
      const supabase = createAdminSupabase();
      await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
      healthChecks.auth = {
        healthy: true,
        responseTime: Date.now() - authHealthStart,
        details: { status: 'connected' }
      };
    } catch (authError) {
      healthChecks.auth = {
        healthy: false,
        responseTime: Date.now() - authHealthStart,
        details: { error: String(authError) }
      };
    }

    // Overall health assessment
    const overallHealthy = healthChecks.database.healthy && healthChecks.auth.healthy;
    const totalResponseTime = Date.now() - startTime;

    healthChecks.overall = {
      healthy: overallHealthy,
      responseTime: totalResponseTime,
      version: process.env.npm_package_version || 'unknown'
    };

    // Return appropriate status code
    const statusCode = overallHealthy ? 200 : 503;

    return NextResponse.json({
      status: overallHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: healthChecks,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }, { status: statusCode });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: String(error),
      checks: healthChecks,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }, { status: 503 });
  }
}