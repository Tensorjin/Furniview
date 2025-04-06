import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About FurniView</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            FurniView aims to revolutionize the furniture assembly experience by providing interactive 3D instructions that make the process intuitive and stress-free. We believe that assembling furniture should be an enjoyable experience, not a frustrating one.
          </p>
          <p className="text-gray-700">
            Our platform combines cutting-edge 3D visualization technology with step-by-step guidance to help users assemble their furniture with confidence and ease.
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
              <div>
                <h3 className="text-lg font-medium mb-1">Select a Furniture Model</h3>
                <p className="text-gray-700">Browse our collection of 3D furniture models or upload your own model.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
              <div>
                <h3 className="text-lg font-medium mb-1">Interactive 3D Viewer</h3>
                <p className="text-gray-700">Use our intuitive controls to rotate, zoom, and explore the 3D model from any angle.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
              <div>
                <h3 className="text-lg font-medium mb-1">Step-by-Step Instructions</h3>
                <p className="text-gray-700">Follow the detailed assembly instructions with highlighted parts for each step.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
              <div>
                <h3 className="text-lg font-medium mb-1">Complete Assembly</h3>
                <p className="text-gray-700">Enjoy your successfully assembled furniture without the frustration of confusing paper instructions.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Technology</h2>
          <p className="text-gray-700 mb-4">
            FurniView is built using modern web technologies to provide a seamless and responsive user experience:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li><span className="font-medium">React.js</span> - For building a dynamic and responsive user interface</li>
            <li><span className="font-medium">Three.js</span> - For rendering and manipulating 3D models in the browser</li>
            <li><span className="font-medium">WebGL</span> - For hardware-accelerated graphics rendering</li>
            <li><span className="font-medium">Tailwind CSS</span> - For modern, responsive styling</li>
          </ul>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            Have questions, suggestions, or feedback? We'd love to hear from you!
          </p>
          <div className="space-y-2">
            <p className="text-gray-700"><span className="font-medium">Email:</span> info@furniview.com</p>
            <p className="text-gray-700"><span className="font-medium">Phone:</span> (123) 456-7890</p>
            <p className="text-gray-700"><span className="font-medium">Address:</span> 123 Assembly Lane, Furniture City, FC 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
