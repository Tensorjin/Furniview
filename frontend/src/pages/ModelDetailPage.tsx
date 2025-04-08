import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Import Link
import ModelViewer from '../components/ModelViewer'; // Import the viewer component
import styles from './ModelDetailPage.module.css';

// Define an interface for the detailed furniture item structure
interface FurnitureDetail {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    gltf_url: string | null;
    status: string;
    // Add other fields if needed from the backend response
}

const ModelDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the 'id' parameter from the route
    const [model, setModel] = useState<FurnitureDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('No model ID provided.');
            setLoading(false);
            return;
        }

        const fetchModelDetails = async () => {
            setLoading(true);
            setError(null);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            try {
                const response = await axios.get<FurnitureDetail>(`${apiUrl}/api/furniture/${id}`);
                setModel(response.data);
            } catch (err: any) {
                console.error(`Error fetching model details for ID ${id} from ${apiUrl}:`, err);
                setError(err.response?.data?.error || err.message || 'Failed to load model details.');
            } finally {
                setLoading(false);
            }
        };

        fetchModelDetails();
    }, [id]); // Re-run effect if the ID changes

    return (
        <div className={styles.container}>
            {loading && <p>Loading model details...</p>}
            {error && <p className={styles.error}>Error: {error}</p>}

            {model && (
                <>
                    <h1>{model.name || 'Unnamed Model'}</h1>
                    <p><strong>Status:</strong> {model.status}</p>
                    <p><strong>Description:</strong> {model.description || 'No description available.'}</p>
                    <p><strong>Created:</strong> {new Date(model.created_at).toLocaleString()}</p>
                    {model.gltf_url && (
                        <a href={model.gltf_url} target="_blank" rel="noopener noreferrer" className={styles.gltfLink}>
                            Download GLTF File
                        </a>
                    )}

                    {/* Conditionally render the ModelViewer if gltf_url exists */}
                    {model.gltf_url ? (
                        <ModelViewer modelUrl={model.gltf_url} />
                    ) : (
                         <div className={styles.viewerPlaceholder}>
                            <p>3D model preview is not available.</p>
                         </div>
                    )}
                </>
            )}
             {!loading && !model && !error && (
                 <div>
                    <p>Model not found or not available.</p>
                    <Link to="/">Back to list</Link>
                 </div>
             )}
        </div>
    );
};

export default ModelDetailPage;
