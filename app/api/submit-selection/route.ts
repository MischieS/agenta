import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Backend API endpoint with environment variable support for cloud deployment
const BACKEND_URL = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/students/submit`;

export async function POST(req: NextRequest) {
  try {
    // Initialize cookie store
    const cookieStore = cookies();
    
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Log the request for debugging
    console.log('Forwarding request to backend:', {
      url: BACKEND_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token.substring(0, 10)}...`
      },
      body: {
        ...body,
        user_id: session.user.id
      }
    });

    // Make request to backend
    const backendRes = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        ...body,
        user_id: session.user.id
      })
    });

    // Parse response
    const responseText = await backendRes.text();
    let responseData;
    
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Failed to parse backend response:', responseText);
      throw new Error(`Invalid JSON response from backend: ${responseText.substring(0, 200)}`);
    }

    // Handle non-OK responses
    if (!backendRes.ok) {
      console.error('Backend error response:', {
        status: backendRes.status,
        statusText: backendRes.statusText,
        response: responseData
      });
      
      return NextResponse.json(
        { 
          error: 'Backend request failed',
          status: backendRes.status,
          details: responseData.error || responseData.message || 'No error details provided'
        },
        { status: backendRes.status }
      );
    }

    // Return successful response
    return NextResponse.json(responseData);
    
  } catch (error) {
    // Handle any errors
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
