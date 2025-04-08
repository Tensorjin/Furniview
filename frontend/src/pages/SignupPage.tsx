import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import styles from './SignupPage.module.css';

const SignupPage: React.FC = () => {
  const { session, fetchCompanyProfile } = useAuth(); // Get session state and profile fetch function
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        // Options can be used if needed, e.g., for redirect URLs or metadata
        // options: { data: { company_name: companyName } } // Example metadata
      });

      if (signUpError) {
        throw signUpError; // Throw Supabase error
      }

      // Check if signup requires email confirmation
      if (signUpData.user && signUpData.user.identities?.length === 0) {
         setSuccessMessage('Signup successful! Please check your email to confirm your account.');
         // Don't proceed to create company profile until confirmed (or adjust backend logic)
         // For now, we just show the message and don't redirect immediately.
         setLoading(false);
         return; // Stop execution here
      }

      if (!signUpData.user) {
          // This case might happen if confirmation is required and user object isn't returned immediately
          // Or if there's an unexpected issue.
          setSuccessMessage('Signup successful! Please check your email to complete registration.');
          setLoading(false);
          return; // Stop execution here
      }

      console.log('Supabase signup successful, user ID:', signUpData.user.id);

      console.log('Supabase signup successful, user ID:', signUpData.user.id);

      // Ensure we have a session token to make the authenticated call
      // This might require waiting briefly for the onAuthStateChange listener to update the session
      // Or relying on the session returned directly if available and confirmation isn't needed.
      // For simplicity here, we assume a session becomes available quickly if no confirmation needed.
      // A more robust solution might involve polling getSession or using the session from signUpData if present.

      // Let's try getting the session again immediately after signup
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (!currentSession) {
          // This might happen if email confirmation is required.
          setSuccessMessage('Signup successful! Please check your email to confirm your account before logging in.');
          setLoading(false);
          return;
      }

      // 2. Call backend to create the company profile
      try {
          console.log('Attempting to create company profile...');
          await axios.post(
              'http://localhost:3001/api/companies',
              { companyName },
              {
                  headers: {
                      'Authorization': `Bearer ${currentSession.access_token}`
                  }
              }
          );
          console.log('Company profile created successfully.');
          // Refresh profile in context
          await fetchCompanyProfile();
          setSuccessMessage('Signup and profile creation successful! Redirecting to dashboard...');
          // Redirect to dashboard directly since profile is created
           setTimeout(() => {
               navigate('/dashboard');
           }, 1500);

      } catch (profileError: any) {
          console.error('Error creating company profile after signup:', profileError);
          // If profile creation failed, the user exists in Supabase Auth but not in our companies table.
          // They will be redirected to /create-profile next time they log in.
          setError(`Signup succeeded but failed to create company profile: ${profileError.response?.data?.error || profileError.message}. Please try logging in.`);
          // Don't delete the auth user automatically, let them try logging in.
          setLoading(false);
          return;
      }

    } catch (err: any) {
      console.error('Supabase signup error:', err);
      // Handle specific Supabase errors like "User already registered"
      if (err.message && err.message.includes('User already registered')) {
          setError('An account with this email already exists.');
      } else {
          setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
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
            minLength={6} // Basic validation
            disabled={loading}
          />
           <small>Password must be at least 6 characters long.</small>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
         <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
