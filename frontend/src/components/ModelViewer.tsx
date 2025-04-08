import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';

interface ModelProps {
  url: string;
}

// Component to load and display the GLTF model
const Model: React.FC<ModelProps> = ({ url }) => {
  // useGLTF loads the model. It supports suspense, so we wrap it.
  const { scene } = useGLTF(url);
  // useGLTF returns the parsed GLTF structure, we typically use the scene object.
  return <primitive object={scene} scale={1} />; // Adjust scale as needed
};

interface ModelViewerProps {
  modelUrl: string | null; // URL of the GLTF model
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  if (!modelUrl) {
    return <div>No model URL provided.</div>;
  }

  return (
    <Canvas
        camera={{ position: [2, 2, 5], fov: 50 }} // Adjust camera position and field of view
        style={{ height: '500px', width: '100%', background: '#f0f0f0' }} // Set canvas size and background
    >
      {/* Basic lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {/* Suspense fallback while the model is loading */}
      <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
        <Model url={modelUrl} />
      </Suspense>

      {/* Controls for interacting with the scene */}
      <OrbitControls />
    </Canvas>
  );
};

export default ModelViewer;
