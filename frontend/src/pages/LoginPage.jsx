import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared'; // Optional: for pre-built theme
import { supabase } from '../services/supabase'; // Import your Supabase client

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          console.log('User logged in, navigating to dashboard (or home)');
          // Redirect logged-in users away from the login page
          // Might want to redirect to dashboard or previous page
          navigate('/dashboard'); // Or navigate('/')
        } else {
          console.log('User logged out or session expired');
          // Ensure user stays on login page if not logged in
        }
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, [navigate]);

  return (
    <div>
      <h2>Login or Sign Up</h2>
      <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '20px' }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }} // Use Supabase's theme
          providers={['google']} // Enable Google Sign-In as configured in Supabase
          // You can add more customization options here
          // view="sign_in" // or "sign_up" to default to one view
          redirectTo={window.location.origin} // Redirect back to app after OAuth
        />
      </div>
    </div>
  );
}

export default LoginPage;
