const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

// File filter to accept only 3D model files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.glb', '.gltf', '.obj', '.fbx', '.stl'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only 3D model files are allowed.'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Models data store (in-memory for demo, would use a database in production)
let models = [];

// Load initial models data if exists
const modelsFilePath = path.join(__dirname, 'models', 'models.json');
try {
  if (fs.existsSync(modelsFilePath)) {
    const data = fs.readFileSync(modelsFilePath, 'utf8');
    models = JSON.parse(data);
  }
} catch (error) {
  console.error('Error loading models data:', error);
}

// Save models data to file
const saveModelsData = () => {
  try {
    if (!fs.existsSync(path.join(__dirname, 'models'))) {
      fs.mkdirSync(path.join(__dirname, 'models'), { recursive: true });
    }
    fs.writeFileSync(modelsFilePath, JSON.stringify(models, null, 2));
  } catch (error) {
    console.error('Error saving models data:', error);
  }
};

// API Routes

// Get all models
app.get('/api/models', (req, res) => {
  res.json(models);
});

// Get a specific model
app.get('/api/models/:modelId', (req, res) => {
  const model = models.find(m => m.modelId === req.params.modelId);
  
  if (!model) {
    return res.status(404).json({ message: 'Model not found' });
  }
  
  res.json(model);
});

// Upload a new model
app.post('/api/models', upload.single('model'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { name, manufacturer, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Model name is required' });
    }
    
    const modelId = uuidv4();
    const modelPath = `/uploads/${req.file.filename}`;
    
    const newModel = {
      modelId,
      name,
      manufacturer: manufacturer || 'Unknown',
      description: description || '',
      modelPath,
      thumbnail: '/thumbnails/default-thumbnail.jpg', // Would generate thumbnails in production
      totalSteps: 1, // Default value, would be updated with actual steps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    models.push(newModel);
    saveModelsData();
    
    res.status(201).json(newModel);
  } catch (error) {
    console.error('Error uploading model:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Update model metadata
app.put('/api/models/:modelId', (req, res) => {
  const modelIndex = models.findIndex(m => m.modelId === req.params.modelId);
  
  if (modelIndex === -1) {
    return res.status(404).json({ message: 'Model not found' });
  }
  
  const { name, manufacturer, description } = req.body;
  
  if (name) models[modelIndex].name = name;
  if (manufacturer) models[modelIndex].manufacturer = manufacturer;
  if (description) models[modelIndex].description = description;
  
  models[modelIndex].updatedAt = new Date().toISOString();
  saveModelsData();
  
  res.json(models[modelIndex]);
});

// Delete a model
app.delete('/api/models/:modelId', (req, res) => {
  const modelIndex = models.findIndex(m => m.modelId === req.params.modelId);
  
  if (modelIndex === -1) {
    return res.status(404).json({ message: 'Model not found' });
  }
  
  // Delete the model file if it exists
  const modelPath = models[modelIndex].modelPath;
  const filePath = path.join(__dirname, '..', modelPath);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting model file:', error);
  }
  
  models.splice(modelIndex, 1);
  saveModelsData();
  
  res.json({ message: 'Model deleted successfully' });
});

// Steps API

// Get all steps for a model
app.get('/api/models/:modelId/steps', (req, res) => {
  const model = models.find(m => m.modelId === req.params.modelId);
  
  if (!model) {
    return res.status(404).json({ message: 'Model not found' });
  }
  
  // In a real app, steps would be stored in a database
  // For demo purposes, we'll return mock steps
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
  
  res.json(mockSteps);
});

// Get a specific step
app.get('/api/models/:modelId/steps/:stepId', (req, res) => {
  const model = models.find(m => m.modelId === req.params.modelId);
  
  if (!model) {
    return res.status(404).json({ message: 'Model not found' });
  }
  
  const stepId = parseInt(req.params.stepId);
  
  // In a real app, steps would be stored in a database
  // For demo purposes, we'll return a mock step
  if (stepId < 1 || stepId > 3) {
    return res.status(404).json({ message: 'Step not found' });
  }
  
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
  
  res.json(mockSteps[stepId - 1]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
