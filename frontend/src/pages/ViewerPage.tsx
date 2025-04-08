import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Or use fetch
import { Link } from 'react-router-dom'; // For linking to detail pages
import styles from './ViewerPage.module.css'; // Import CSS module

// Define an interface for the furniture item structure
interface FurnitureItem {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    gltf_url: string | null;
}

const ViewerPage: React.FC = () => {
    const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFurniture = async () => {
            setLoading(true);
            setError(null);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Fallback for local dev if needed
            try {
                // Fetch from the backend API endpoint using environment variable
                const response = await axios.get<FurnitureItem[]>(`${apiUrl}/api/furniture`);
                setFurniture(response.data);
            } catch (err: any) {
                console.error("Error fetching furniture from:", `${apiUrl}/api/furniture`, err);
                setError(err.response?.data?.error || err.message || 'Failed to load furniture models.');
            } finally {
                setLoading(false);
            }
        };

        fetchFurniture();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className={styles.container}>
            <h1>Browse Furniture Models</h1>

            {loading && <p>Loading models...</p>}
            {error && <p className={styles.error}>Error: {error}</p>}

            {!loading && !error && (
                <ul className={styles.list}>
                    {furniture.length === 0 ? (
                        <li>No models available yet.</li>
                    ) : (
                        furniture.map(item => (
                            <li key={item.id} className={styles.listItem}>
                                <h2>{item.name || 'Unnamed Model'}</h2>
                                <p>{item.description || 'No description.'}</p>
                                {/* Link to a detail page (route needs to be set up) */}
                                <Link to={`/model/${item.id}`}>View Details</Link>
                                {item.gltf_url && (
                                    <a href={item.gltf_url} target="_blank" rel="noopener noreferrer" className={styles.gltfLink}>
                                        Download GLTF
                                    </a>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default ViewerPage;
