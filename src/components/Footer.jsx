import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">FurniView</h2>
            <p className="text-gray-300">Interactive 3D Furniture Assembly Platform</p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Links</h3>
              <ul className="space-y-1">
                <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="/viewer" className="text-gray-300 hover:text-white">3D Viewer</a></li>
                <li><a href="/upload" className="text-gray-300 hover:text-white">Upload Model</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <ul className="space-y-1">
                <li className="text-gray-300">Email: info@furniview.com</li>
                <li className="text-gray-300">Phone: (123) 456-7890</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} FurniView. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
