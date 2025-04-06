import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient'; // Import the configured client

// Define the shape of the context data
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Create the context with a default value (null or undefined)
// Using 'null!' as a temporary default, will be replaced by Provider value
const AuthContext = createContext<AuthContextType>(null!);

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    // Check initial session state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes in authentication state (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false); // Ensure loading is false after state change
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error);
    }
    // State updates (session/user to null) will be handled by onAuthStateChange listener
    setLoading(false);
  };


  // Value provided to consuming components
  const value = {
    session,
    user,
    loading,
    signOut,
  };

  // Don't render children until the initial session check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
