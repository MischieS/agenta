import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET /api/admin/test-db - Test database connection
export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test the database connection with a simple query
    const result = await executeQuery`SELECT 1 as test`;
    
    console.log('Database test result:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result
    });
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        // Only include stack trace in development
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined
        })
      },
      { status: 500 }
    );
  }
}
