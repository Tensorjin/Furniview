import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { Canvas } from '@react-three/fiber'; // Import later for 3D
// import { OrbitControls } from '@react-three/drei'; // Import later for 3D

function ViewerPage() {
  const { itemId } = useParams(); // Get item ID from URL
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call to backend /api/furniture/:itemId
        console.log(`Fetching data for item: ${itemId}`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        // Placeholder data - replace with fetched data
        const fetchedData = {
          id: itemId,
          name: `Furniture Item ${itemId}`,
          description: 'A sample furniture item.',
          gltf_model_path: null // Will be fetched from backend later
        };
        if (itemId === 'example-item') { // Simulate finding an item
             setItemData(fetchedData);
        } else {
             setError('Furniture item not found.'); // Simulate not found
        }

      } catch (err) {
        console.error("Error fetching item data:", err);
        setError('Failed to load furniture item data.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [itemId]); // Refetch if itemId changes

  if (loading) {
    return <div>Loading furniture viewer...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!itemData) {
    return <div>Furniture item not found.</div>;
  }

  return (
    <div>
      <h2>{itemData.name}</h2>
      <p>{itemData.description}</p>

      {/* Placeholder for 3D Canvas */}
      <div style={{ height: '400px', width: '100%', background: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>[3D Viewer Placeholder - Requires Three.js/R3F Setup]</p>
        {itemData.gltf_model_path ? (
          <p>(Model path: {itemData.gltf_model_path})</p>
        ) : (
          <p>(GLTF Model Path not available yet)</p>
        )}
      </div>

      {/* Placeholder for assembly steps */}
      <div>
        <h3>Assembly Steps</h3>
        <p>[Assembly Steps Placeholder]</p>
      </div>
    </div>
  );
}

export default ViewerPage;
