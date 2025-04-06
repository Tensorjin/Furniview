import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { supabase } from '../supabaseClient'; // Import Supabase client
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import styles from './LoginPage.module.css'; // Import CSS module

const LoginPage: React.FC = () => {
  const { session } = useAuth(); // Get session state
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

  return (
    <div className={styles.container}>
      <h1>Login</h1>
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
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className={styles.signupLink}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
