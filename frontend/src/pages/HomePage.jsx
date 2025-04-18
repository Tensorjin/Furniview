import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to Furniview!</h1>
      <p>Interactive 3D Furniture Assembly Instructions.</p>
      <nav>
        <Link to="/login">Login/Signup</Link> | {' '}
        <Link to="/dashboard">Company Dashboard (Requires Login)</Link> | {' '}
        <Link to="/view/example-item">View Example Item</Link>
        {/* Add search/browse functionality later */}
      </nav>
    </div>
  );
}

export default HomePage;
