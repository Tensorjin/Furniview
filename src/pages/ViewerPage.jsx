import React, { useState, useEffect } from 'react';
import ModelViewer from '../components/ModelViewer';
import StepNavigation from '../components/StepNavigation';

// Mock data for demonstration purposes
const mockModelData = {
  modelId: "chair-model-001",
  name: "Office Chair",
  manufacturer: "OfficeFurn",
  modelPath: "/models/office-chair.glb", // This would be a real path in production
  thumbnail: "/thumbnails/office-chair.jpg",
  totalSteps: 8
};

const mockSteps = [
  {
    stepId: 1,
    title: "Attach wheels to base",
    description: "Insert all 5 wheels into the star-shaped base",
    partsNeeded: ["wheel-part", "base-part"],
    cameraPosition: {x: 0, y: -5, z: 10},
    highlightedParts: ["wheel-part", "base-part"],
    visibleParts: ["wheel-part", "base-part", "main-body"]
  },
  {
    stepId: 2,
    title: "Attach hydraulic cylinder",
    description: "Insert the hydraulic cylinder into the center hole of the base",
    partsNeeded: ["cylinder-part", "base-part"],
    cameraPosition: {x: 0, y: -3, z: 10},
    highlightedParts: ["cylinder-part", "base-part"],
    visibleParts: ["wheel-part", "base-part", "cylinder-part", "main-body"]
  },
  {
    stepId: 3,
    title: "Attach seat to cylinder",
    description: "Place the seat onto the top of the hydraulic cylinder",
    partsNeeded: ["seat-part", "cylinder-part"],
    cameraPosition: {x: 0, y: 0, z: 10},
    highlightedParts: ["seat-part", "cylinder-part"],
    visibleParts: ["wheel-part", "base-part", "cylinder-part", "seat-part"]
  }
];

const ViewerPage = () => {
  const [model, setModel] = useState(mockModelData);
  const [steps, setSteps] = useState(mockSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  // In a real application, we would fetch the model and steps data from an API
  useEffect(() => {
    // This would be an API call in a real application
    // Example: fetchModelData(modelId).then(data => setModel(data));
    // Example: fetchSteps(modelId).then(data => setSteps(data));
  }, []);

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">{model.name} Assembly</h1>
          <p>Manufacturer: {model.manufacturer}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 3D Viewer takes up 2/3 of the space on large screens */}
          <div className="lg:col-span-2 bg-gray-100 rounded-lg overflow-hidden">
            <ModelViewer 
              modelPath={model.modelPath} 
              cameraPosition={[
                currentStep.cameraPosition.x,
                currentStep.cameraPosition.y,
                currentStep.cameraPosition.z
              ]}
              highlightedParts={currentStep.highlightedParts}
            />
          </div>
          
          {/* Step navigation takes up 1/3 of the space */}
          <div className="p-4">
            <StepNavigation 
              step={currentStep}
              totalSteps={steps.length}
              onPreviousStep={handlePreviousStep}
              onNextStep={handleNextStep}
            />
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Assembly Tips</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Make sure all parts are present before starting</li>
                <li>Follow each step carefully in order</li>
                <li>Use the 3D viewer to rotate and zoom for better visibility</li>
                <li>Highlighted parts show what you need to work with in this step</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
