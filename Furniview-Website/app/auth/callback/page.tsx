'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/loading-spinner' // Assuming you have this

export default function AuthCallbackPage() {
  const supabase = getSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // When Supabase redirects back to the app, it includes a hash in the URL if it's a new session.
      // The Supabase client library automatically handles this hash to establish the session.
      // We just need to wait for the auth state to change or for the session to be available.

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, redirect to homepage or dashboard
        router.replace('/') 
      } else {
        // If no session is found after callback, it might indicate an issue or that the link was already used/expired.
        // Listen to auth state changes as a fallback or to catch the session establishment.
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            authListener?.unsubscribe()
            router.replace('/')
          } else if (event === 'SIGN_IN_ERROR' || (event === 'SIGNED_OUT' && !session)) {
            // Handle cases where sign-in fails or somehow user gets signed out immediately
            authListener?.unsubscribe()
            router.replace('/login') // Redirect to login on error or if no session
          }
        });

        // Initial check, in case session was set very quickly
        if (supabase.auth.getUser()) {
            authListener?.unsubscribe();
            router.replace('/');
        }

        // Cleanup listener on component unmount
        return () => {
          authListener?.unsubscribe()
        }
      }
    }

    handleAuthCallback();
  }, [supabase, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-foreground-muted">Authenticating, please wait...</p>
    </div>
  )
} 