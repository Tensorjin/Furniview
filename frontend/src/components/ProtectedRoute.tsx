import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  // Optional: Add props if needed, e.g., required roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { session, loading } = useAuth(); // Get session and loading state

  if (loading) {
    // Optional: Show a loading indicator while checking auth status
    return <div>Loading authentication status...</div>;
  }

  if (!session) {
    // If no session (user not logged in), redirect to the login page
    // Pass the current location to redirect back after login (optional)
    return <Navigate to="/login" replace />;
  }

  // If session exists (user logged in), render the child route component
  return <Outlet />; // Renders the nested route defined in App.tsx
};

export default ProtectedRoute;
