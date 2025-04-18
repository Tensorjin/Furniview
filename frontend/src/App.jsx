import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ViewerPage from './pages/ViewerPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="App">
      {/* Basic Navigation (Temporary) */}
      <nav>
        <Link to="/">Home</Link>
      </nav>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Example route for viewer - might need dynamic segment */}
        <Route path="/view/:itemId" element={<ViewerPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}
      </Routes>
    </div>
  );
}

export default App;
