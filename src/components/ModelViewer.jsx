import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';

// Model component that loads and displays a 3D model
const Model = ({ modelPath, highlightedParts = [] }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  useEffect(() => {
    if (scene) {
      // Clone the scene to avoid modifying the cached original
      scene.traverse((node) => {
        if (node.isMesh) {
          // Store original material for resetting
          node.userData.originalMaterial = node.material.clone();
          
          // Highlight parts if they match the highlighted parts list
          if (highlightedParts.includes(node.name)) {
            node.material.emissive.set(0x00ff00);
            node.material.emissiveIntensity = 0.5;
          }
        }
      });
    }
    
    return () => {
      // Clean up
      scene.traverse((node) => {
        if (node.isMesh && node.userData.originalMaterial) {
          node.material.dispose();
          node.material = node.userData.originalMaterial;
        }
      });
    };
  }, [scene, highlightedParts]);

  useFrame(() => {
    if (modelRef.current) {
      // Any per-frame updates can go here
    }
  });

  return <primitive ref={modelRef} object={scene} scale={1} />;
};

// Camera setup with default position
const CameraSetup = ({ position = [0, 5, 10] }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
  }, [camera, position]);
  
  return null;
};

// Main ModelViewer component
const ModelViewer = ({ 
  modelPath = '/models/default-model.glb', 
  cameraPosition = [0, 5, 10],
  highlightedParts = [],
  backgroundColor = '#f0f0f0'
}) => {
  return (
    <div style={{ width: '100%', height: '600px', backgroundColor }}>
      <Canvas shadows>
        <CameraSetup position={cameraPosition} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 7.5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        <Model modelPath={modelPath} highlightedParts={highlightedParts} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.25} 
          rotateSpeed={0.5}
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
