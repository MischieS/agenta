import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// Hash password for comparison
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const userQuery = `
      SELECT id, email, password_hash, role
      FROM "user"
      WHERE email = $1
    `;
    
    const users = await executeQuery(userQuery, [email]);

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify role
    const userRole = user.role.toLowerCase();
    if (userRole !== 'admin' && userRole !== 'chief' && userRole !== 'manager' && userRole !== 'sales') {
      return NextResponse.json(
        { error: 'Access denied: insufficient privileges' },
        { status: 403 }
      );
    }

    // Check if password matches
    const hashedPassword = hashPassword(password);
    if (user.password_hash !== hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user has an admin role
    const validRoles = ['admin', 'chief', 'manager', 'sales'];
    if (!user.role || !validRoles.includes(user.role.toLowerCase())) {
      return NextResponse.json(
        { error: 'User does not have admin permissions' },
        { status: 403 }
      );
    }

    // Create session token
    const token = sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '8h' }
    );

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'strict',
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
