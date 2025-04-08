import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { supabase } from '../supabaseClient'; // Import Supabase client
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import styles from './LoginPage.module.css'; // Import CSS module

const LoginPage: React.FC = () => {
  const { session } = useAuth(); // Get session state
  const [googleLoading, setGoogleLoading] = useState<boolean>(false); // Loading state for Google button
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      navigate('/dashboard'); // Or wherever logged-in users should go
    }
  }, [session, navigate]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use Supabase client's signInWithPassword
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError; // Throw error to be caught below
      }

      // No need to manually store token, Supabase client handles it.
      // AuthProvider's onAuthStateChange will detect the new session.
      // Navigation is handled by the useEffect hook above.
      console.log('Supabase login initiated successfully');
      // alert('Login successful!'); // Feedback can be handled differently if needed

    } catch (err: any) {
      console.error('Supabase login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        // Optional: Add redirect options if needed
        // options: {
        //   redirectTo: window.location.origin // Redirect back to the app after Google login
        // }
      });
      if (error) {
        throw error;
      }
      // Supabase handles the redirect to Google and back.
      // The onAuthStateChange listener in AuthContext will handle the session update.
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed.');
      setGoogleLoading(false); // Ensure loading is reset on error
    }
    // Don't setGoogleLoading(false) here, as the page will redirect
  };


  return (
    <div className={styles.container}>
      <h1>Login</h1>
      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading || googleLoading} className={styles.submitButton}>
          {loading ? 'Logging in...' : 'Login with Email'}
        </button>
      </form>

      <div className={styles.divider}>OR</div>

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading || googleLoading}
        className={`${styles.submitButton} ${styles.googleButton}`}
      >
        {googleLoading ? 'Redirecting...' : 'Login with Google'}
      </button>

      {/* Display general errors */}
      {error && !loading && !googleLoading && <p className={styles.error}>{error}</p>}

      <p className={styles.signupLink}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
