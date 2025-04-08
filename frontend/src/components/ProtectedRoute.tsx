import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  // Optional: Add props if needed, e.g., required roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { session, companyProfile, loading, loadingProfile } = useAuth();
  const location = useLocation(); // Get current location

  // Show loading indicator while checking session or profile
  if (loading || loadingProfile) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  // If no session, redirect to login
  if (!session) {
    // Pass the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If session exists, but no company profile, redirect to create profile page
  // Exception: Don't redirect if already on the create-profile page
  if (!companyProfile && location.pathname !== '/create-profile') {
    console.log("User logged in but no profile, redirecting to /create-profile");
    return <Navigate to="/create-profile" replace />;
  }

  // If session and profile exist (or if on create-profile page without profile), render the requested route
  return <Outlet />;
};

export default ProtectedRoute;
