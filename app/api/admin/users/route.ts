import { NextRequest, NextResponse } from 'next/server';
import { db, executeQuery } from '@/lib/db';
import { createHash } from 'crypto';

// Helper function to hash passwords
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// GET /api/admin/users - Get all admin users
export async function GET(request: NextRequest) {
  try {
    // Only fetch users with admin roles
    const adminRoles = ['admin', 'chief', 'manager', 'sales'];
    
    // Fetch admin users ordered by role priority
    const users = await executeQuery`
      SELECT u.id, u.first_name as "name", u.last_name as "surname", u.email, 
             u.role, u.created_at as "createdAt", u.updated_at as "updatedAt"
      FROM "user" u
      WHERE u.role IN ('admin', 'chief', 'manager', 'sales')
      ORDER BY CASE
        WHEN u.role = 'admin' THEN 1
        WHEN u.role = 'chief' THEN 2
        WHEN u.role = 'manager' THEN 3
        WHEN u.role = 'sales' THEN 4
        ELSE 5
      END
    `;
    
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, surname, email, role, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles = ['admin', 'chief', 'manager', 'sales'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create new user
    // First check if email already exists
    const existingUser = await executeQuery`
      SELECT id FROM "user" WHERE email = ${body.email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create the user in "user" table
    const passwordHash = hashPassword(password);
    const now = new Date().toISOString();
    
    // First create user
    const newUser = await executeQuery`
      INSERT INTO "user" (email, password_hash, first_name, last_name, role, created_at, updated_at)
      VALUES (${body.email}, ${passwordHash}, ${body.name}, ${body.surname}, ${body.role}, ${now}, ${now})
      RETURNING id, email, first_name as name, last_name as surname, role, created_at as "createdAt", updated_at as "updatedAt"
    `;

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error: any) {
    console.error('Failed to create admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
