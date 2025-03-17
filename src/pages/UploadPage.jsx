import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [modelName, setModelName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadSuccess(false);
    setUploadError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setUploadSuccess(false);
      setUploadError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadError('Please select a 3D model file');
      return;
    }

    if (!modelName) {
      setUploadError('Please enter a name for your model');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('model', file);
      formData.append('name', modelName);
      formData.append('manufacturer', manufacturer);
      formData.append('description', description);
      
      const response = await fetch(`${API_URL}/models`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload model');
      }
      
      const data = await response.json();
      console.log('Upload successful:', data);
      
      setUploadSuccess(true);
      setFile(null);
      setModelName('');
      setManufacturer('');
      setDescription('');
    } catch (error) {
      setUploadError(`Failed to upload model: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload 3D Model</h1>
        
        {uploadSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Model uploaded successfully!
          </div>
        )}
        
        {uploadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {uploadError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model-file">
              3D Model File
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition duration-300"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('model-file').click()}
            >
              <input 
                type="file" 
                id="model-file" 
                accept=".glb,.gltf,.obj,.fbx,.stl" 
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <div>
                  <p className="text-green-600 font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 font-medium">Drag and drop your 3D model here</p>
                  <p className="text-gray-500 text-sm mt-1">
                    or click to browse files
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Supported formats: .glb, .gltf, .obj, .fbx, .stl
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model-name">
              Model Name *
            </label>
            <input 
              type="text" 
              id="model-name" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manufacturer">
              Manufacturer
            </label>
            <input 
              type="text" 
              id="manufacturer" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea 
              id="description" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Model'}
            </button>
            <button 
              type="button" 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                setFile(null);
                setModelName('');
                setManufacturer('');
                setDescription('');
                setUploadError('');
              }}
            >
              Clear Form
            </button>
          </div>
        </form>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Tips for Uploading Models</h2>
          <ul className="list-disc pl-5 text-blue-700">
            <li>Use .glb format for best compatibility</li>
            <li>Keep file size under 10MB for optimal performance</li>
            <li>Ensure your model has proper materials and textures</li>
            <li>Name parts appropriately for assembly instructions</li>
            <li>Test your model in a 3D viewer before uploading</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
