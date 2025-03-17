import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to FurniView</h1>
          <p className="text-xl md:text-2xl mb-8">Interactive 3D Furniture Assembly Instructions</p>
          <Link 
            to="/viewer" 
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition duration-300"
          >
            Try 3D Viewer
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Interactive 3D Models</h3>
              <p className="text-gray-600">Explore furniture models from every angle with intuitive rotation and zoom controls.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Step-by-Step Assembly</h3>
              <p className="text-gray-600">Follow clear, visual instructions for assembling your furniture with highlighted parts.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Upload Your Models</h3>
              <p className="text-gray-600">Upload your own 3D models to create custom assembly instructions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* This would be populated with actual models from the database */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Office Chair</h3>
                <p className="text-gray-600 mb-4">Modern ergonomic office chair with adjustable height.</p>
                <Link 
                  to="/viewer?model=office-chair" 
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Assembly
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Bookshelf</h3>
                <p className="text-gray-600 mb-4">5-tier bookshelf with modern design.</p>
                <Link 
                  to="/viewer?model=bookshelf" 
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Assembly
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Coffee Table</h3>
                <p className="text-gray-600 mb-4">Minimalist coffee table with storage compartment.</p>
                <Link 
                  to="/viewer?model=coffee-table" 
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Assembly
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Try FurniView?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Experience the future of furniture assembly with our interactive 3D instructions.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/viewer" 
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition duration-300"
            >
              Try 3D Viewer
            </Link>
            <Link 
              to="/upload" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Upload Model
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
