'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Get code and next URL from search params
    const code = searchParams.get('code')
    let next = searchParams.get('next') || '/user-dashboard'
    
    if (!code) {
      router.push('/signin?error=No%20code%20provided')
      return
    }
    
    const supabase = createClient()

    // Exchange the code for a session
    const exchangeCodeForSession = async () => {
      try {
        // The code will be automatically exchanged for a session by the Supabase client
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('Error exchanging code for session:', error.message)
          router.push(`/signin?error=${encodeURIComponent(error.message)}`)
          return
        }
        
        // Get session after code exchange
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/signin?error=Failed%20to%20get%20session')
          return
        }
        
        try {
          // Fetch user role from backend to determine redirect
          const res = await fetch('http://localhost:3003/auth/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });

          if (res.ok) {
            const userData = await res.json();
            // Assuming the user's role is in the metadata
            const role = userData.user_metadata?.role || 'user';

            if (role === 'admin') {
              next = '/admin';
            }
          }
        } catch (err) {
          console.error("Role fetch error:", err);
          // Default to user dashboard if role fetch fails
        }
        
        // Redirect to the appropriate dashboard
        router.push(next)
      } catch (err) {
        console.error('Unexpected error during auth callback:', err)
        router.push('/signin?error=Authentication%20failed')
      }
    }

    exchangeCodeForSession()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-center text-muted-foreground">
        Completing login process...
      </p>
    </div>
  )
}
