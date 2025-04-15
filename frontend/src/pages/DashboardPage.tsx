import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To get the session token
import styles from './DashboardPage.module.css'; // Import CSS module

const DashboardPage: React.FC = () => {
  const { session } = useAuth(); // Get session for token
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null); // Clear previous errors on new file selection
      setSuccessMessage(null);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!session) {
      setError('You must be logged in to upload files.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    // 'furnitureFile' must match the name expected by multer on the backend
    formData.append('furnitureFile', selectedFile);
    // Optional: Add other form data if needed (e.g., name, description)
    // formData.append('name', 'Custom Name');
    // formData.append('description', 'Custom Description');

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${session.access_token}`, // Include the auth token
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setUploadProgress(percentCompleted);
        },
      });

      console.log('Upload successful:', response.data);
      setSuccessMessage(response.data.message || 'File uploaded successfully!');
      setSelectedFile(null); // Clear file input after successful upload
      // TODO: Optionally refresh the list of uploaded models

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || err.message || 'Upload failed.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Company Dashboard</h1>
      <p>Upload new furniture models here.</p>

      <div className={styles.uploadSection}>
        <h2>Upload Model</h2>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".stl,.obj,.fbx,.gltf,.glb" // Accept common 3D formats
          disabled={uploading}
        />
        {selectedFile && <p>Selected: {selectedFile.name}</p>}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={styles.uploadButton}
        >
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload File'}
        </button>

        {uploading && (
          <progress value={uploadProgress} max="100" style={{ width: '100%', marginTop: '10px' }} />
        )}
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </div>

      <hr className={styles.divider} />

      <div className={styles.listSection}>
        <h2>Your Uploaded Models</h2>
        {/* TODO: Implement list of uploaded models fetched from backend */}
        <p>List of uploaded models will appear here.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
