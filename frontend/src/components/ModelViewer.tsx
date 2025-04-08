import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';

interface ModelViewerProps {
  modelUrl: string; // URL of the GLTF model
}

// Component to load and display the GLTF model
const Model: React.FC<{ url: string }> = ({ url }) => {
  // useGLTF hook loads the model and handles caching
  // It throws a promise while loading, which Suspense catches
  const { scene } = useGLTF(url);
  // You might need to scale or position the scene depending on the model
  return <primitive object={scene} scale={1} />; // Adjust scale as needed
};

// Loading fallback component
const Loader: React.FC = () => {
  return (
    <Html center>
      <div style={{ color: 'grey', fontSize: '1.2em' }}>Loading 3D model...</div>
    </Html>
  );
};

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  return (
    <div style={{ height: '500px', width: '100%', background: '#f0f0f0', borderRadius: '8px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}> {/* Adjust camera position/fov */}
        {/* Suspense handles the loading state of the model */}
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />

          {/* Model */}
          <Model url={modelUrl} />

          {/* Controls - allows user to rotate/zoom */}
          <OrbitControls />

          {/* Optional: Add helpers like axes or grid */}
          {/* <axesHelper args={[5]} /> */}
          {/* <gridHelper args={[10, 10]} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
