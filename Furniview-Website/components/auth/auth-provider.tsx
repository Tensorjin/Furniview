'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  user: User | null
  signOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const setData = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
        setIsLoading(false)
        return
      }
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setIsLoading(false)
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setIsLoading(false) // Also set loading to false on auth state change
    })

    setData() // Initial check

    return () => {
      listener?.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    setIsLoading(true); // Optionally set loading true during sign out
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
      // Handle error appropriately, maybe set an error state
    }
    // Session and user will be set to null by onAuthStateChange
    setIsLoading(false);
  }

  const value = {
    session,
    user,
    signOut,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 