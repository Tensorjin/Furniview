import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">FurniView</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            </li>
            <li>
              <Link to="/viewer" className="text-gray-700 hover:text-blue-600">3D Viewer</Link>
            </li>
            <li>
              <Link to="/upload" className="text-gray-700 hover:text-blue-600">Upload Model</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
