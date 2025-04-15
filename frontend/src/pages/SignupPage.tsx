import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Still needed to call our backend for company profile creation
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { supabase } from '../supabaseClient'; // Import Supabase client
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import styles from './SignupPage.module.css'; // Import CSS module

const SignupPage: React.FC = () => {
  const { session } = useAuth(); // Get session state
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

      // 2. Call our backend to create the company profile, passing the necessary info
      // Note: The backend signup endpoint needs modification to handle this flow
      // It should ideally take the userId from the *already authenticated* Supabase user
      // For now, we'll send it, but this needs refinement for security.
      // A better approach might be a Supabase Function triggered on auth.users insert.
      try {
          const profileResponse = await axios.post('http://localhost:3001/api/auth/signup', {
              // WARNING: Sending email/password again is NOT ideal.
              // The backend endpoint should be refactored.
              // For now, just sending companyName and relying on backend logic (which needs update)
              email: email, // Backend needs refactoring to not require this
              password: '***', // Backend needs refactoring to not require this
              companyName: companyName,
              // Ideally, backend uses the token from Supabase signup to verify and get userId
          });
          console.log('Company profile creation response:', profileResponse.data);
          setSuccessMessage(profileResponse.data.message || 'Signup complete! Redirecting...');

      } catch (profileError: any) {
          console.error('Error creating company profile:', profileError);
          // Optional: Attempt to delete the Supabase auth user if profile creation fails
          // await supabase.auth.admin.deleteUser(signUpData.user.id); // Requires admin privileges
          setError(`Signup succeeded but failed to create company profile: ${profileError.response?.data?.error || profileError.message}`);
          setLoading(false);
          return; // Stop on profile creation error
      }


      // Redirect to login page after a short delay on full success
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Supabase signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
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
