import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/admin/auth/logout - Log out the current user
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    
    // Remove the authentication cookie
    cookieStore.delete('admin_token');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
