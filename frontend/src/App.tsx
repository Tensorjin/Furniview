import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ViewerPage from './pages/ViewerPage';
import ModelDetailPage from './pages/ModelDetailPage';
import CreateProfilePage from './pages/CreateProfilePage'; // Import CreateProfilePage
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { useAuth } from './context/AuthContext'; // Import useAuth to conditionally show links
import './App.css'; // Keep or replace with your global styles

function App() {
  const { session, signOut } = useAuth(); // Get session and signOut function

  return (
    <Router>
      <div>
        {/* Simple Navigation Bar - Conditionally show links */}
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link to="/" style={{ marginRight: '15px' }}>Home (Viewer)</Link>
            {session && <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>}
          </div>
          <div>
            {!session ? (
              <>
                <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
                <Link to="/signup" style={{ marginRight: '15px' }}>Signup</Link>
              </>
            ) : (
              <button onClick={signOut} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                Logout
              </button>
            )}
          </div>
        </nav>

        {/* Route Configuration */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ViewerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/model/:id" element={<ModelDetailPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Routes nested inside ProtectedRoute require authentication */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-profile" element={<CreateProfilePage />} /> {/* Add route for profile creation */}
            {/* Add other protected routes here */}
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<div><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
