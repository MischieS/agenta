import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Check if we have the required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables');
  throw new Error('Supabase URL is not configured');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables');
  throw new Error('Supabase anon key is not configured');
}

// GET /api/admin/auth/session - Get current user session
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('No active session:', sessionError?.message || 'No session found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get user data from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error fetching user:', userError?.message || 'No user found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }
    
    // Get additional user data from your profiles table if needed
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError.message);
      // Continue with basic user data if profile fetch fails
    }
    
    // Combine user data with profile data
    const userData = {
      id: user.id,
      email: user.email,
      role: profile?.role || 'user',
      name: profile?.name || user.user_metadata?.name || '',
      ...(profile || {})
    };
    
    // Validate user has admin role (adjust roles as needed)
    const validRoles = ['admin', 'chief', 'manager', 'sales'];
    if (!validRoles.includes(userData.role)) {
      return NextResponse.json(
        { error: 'User does not have admin permissions' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(userData, { status: 200 });
    
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { 
        error: 'Session validation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined
        })
      },
      { status: 500 }
    );
  }
}
