import React from 'react';

const StepNavigation = ({ 
  step, 
  totalSteps, 
  onPreviousStep, 
  onNextStep 
}) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Step {step.stepId} of {totalSteps}</h2>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            disabled={step.stepId === 1}
            onClick={onPreviousStep}
          >
            Previous
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            disabled={step.stepId === totalSteps}
            onClick={onNextStep}
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium">{step.title}</h3>
        <p>{step.description}</p>
      </div>
      
      <div className="mb-2">
        <h4 className="font-medium">Parts needed:</h4>
        <ul className="list-disc pl-5">
          {step.partsNeeded.map(part => <li key={part}>{part}</li>)}
        </ul>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${(step.stepId / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepNavigation;
