'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Or from 'next/router' if using Pages Router
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getSupabaseClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = getSupabaseClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    // Determine the redirect URL. This should be an absolute URL.
    // For local development, it might be http://localhost:3000/
    // For production, it would be your production URL.
    // Ensure this matches one of your Supabase Auth redirect URLs.
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error: supaError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // This is the URL to open when the user clicks the link in the email.
        // It should be a route in your app that handles the session.
        // For now, we can redirect to the homepage, but typically you'd have an /auth/callback route.
        emailRedirectTo: redirectTo,
      },
    })

    if (supaError) {
      console.error("Error sending magic link:", supaError)
      setError(supaError.message || 'Could not send magic link. Please try again.')
    } else {
      setMessage('Check your email for the magic login link!')
      setEmail('') // Clear the email input
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-subtle px-4 py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium">Sign In / Sign Up</CardTitle>
          <CardDescription>Enter your email below to receive a magic link to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full text-base py-3" disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm min-h-[40px]">
          {message && <p className="text-green-600 dark:text-green-500 animate-fade-in">{message}</p>}
          {error && <p className="text-red-600 dark:text-red-500 animate-fade-in">{error}</p>}
        </CardFooter>
      </Card>
    </div>
  )
} 