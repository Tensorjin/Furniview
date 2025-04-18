import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        navigate('/login'); // Redirect if error fetching session
      } else if (!session) {
        console.log('No active session found, redirecting to login.');
        navigate('/login'); // Redirect if no session
      } else {
        setUser(session.user);
        // TODO: Fetch company-specific data if needed based on user.id
      }
      setLoading(false);
    };

    fetchSession();

    // Optional: Listen for auth changes to handle logout while on page
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      // Listener above should handle navigation
      console.log('Logout successful');
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) {
    // This case should ideally be handled by the redirect, but as a fallback
    return <div>Please log in to view the dashboard. <button onClick={() => navigate('/login')}>Login</button></div>;
  }

  return (
    <div>
      <h2>Company Dashboard</h2>
      <p>Welcome, {user.email}!</p>
      <button onClick={handleLogout}>Logout</button>

      {/* TODO: Add components for: */}
      {/* - Viewing existing furniture items */}
      {/* - Uploading new furniture models */}
      {/* - Managing company profile/subscription */}

      <h3>Upload New Furniture Model</h3>
      {/* Placeholder for upload form/component */}
      <p>[Upload Form Placeholder]</p>

      <h3>Your Furniture Items</h3>
      {/* Placeholder for furniture list */}
      <p>[Furniture List Placeholder]</p>
    </div>
  );
}

export default DashboardPage;
