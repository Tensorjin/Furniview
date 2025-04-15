import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import axios from 'axios'; // Needed to fetch company profile
import { supabase } from '../supabaseClient'; // Import the configured client

// Define structure for Company Profile
interface CompanyProfile {
    id: string; // Should match user ID
    name: string;
    created_at: string;
    // Add other fields if needed
}

// Define the shape of the context data
interface AuthContextType {
  session: Session | null;
  user: User | null;
  companyProfile: CompanyProfile | null; // Add company profile state
  loading: boolean; // Overall loading state
  loadingProfile: boolean; // Specific loading state for profile fetch
  fetchCompanyProfile: () => Promise<void>; // Function to manually refetch profile
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
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initial auth check loading
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false); // Profile fetch loading

  // Function to fetch company profile
  const fetchCompanyProfile = useCallback(async (currentSession: Session | null) => {
      if (!currentSession) {
          setCompanyProfile(null);
          return;
      }
      setLoadingProfile(true);
      try {
          const { data } = await axios.get<CompanyProfile>('http://localhost:3001/api/companies/me', {
              headers: {
                  'Authorization': `Bearer ${currentSession.access_token}`
              }
          });
          setCompanyProfile(data);
      } catch (error: any) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
              console.log('No company profile found for user.');
              setCompanyProfile(null); // Explicitly set to null if not found
          } else {
              console.error("Error fetching company profile:", error);
              setCompanyProfile(null); // Set to null on other errors too
          }
      } finally {
          setLoadingProfile(false);
      }
  }, []); // useCallback with empty dependency array

  useEffect(() => {
    setLoading(true); // Start initial loading
    // 1. Check initial session state
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      // 2. Fetch profile based on initial session
      fetchCompanyProfile(initialSession).finally(() => {
          setLoading(false); // End initial loading only after session AND profile check
      });
    });

    // 3. Listen for changes in authentication state (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession);
        const sessionChanged = newSession?.access_token !== session?.access_token;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // 4. Fetch profile whenever auth state changes (login/logout)
        // Only refetch if the session actually changed to avoid redundant calls
        if (sessionChanged) {
            await fetchCompanyProfile(newSession);
        }
        // Ensure overall loading is false after state change is processed
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    // setLoading(true); // Loading state is handled by onAuthStateChange now
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error);
    }
    // State updates (session/user/profile to null) will be handled by onAuthStateChange listener
    // setLoading(false);
  };


  // Value provided to consuming components
  const value = {
    session,
    user,
    companyProfile,
    loading, // Overall initial loading
    loadingProfile, // Specific profile loading
    fetchCompanyProfile: () => fetchCompanyProfile(session), // Expose manual refetch bound to current session
    signOut,
  };

  // Don't render children until the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
  // Note: We removed the !loading check here; ProtectedRoute handles loading state now.
};

// Custom hook to use the Auth context easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
