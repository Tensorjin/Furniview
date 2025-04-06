# FurniView Website Structure

## Overview
FurniView is a 3D furniture visualization platform that allows users to view and interact with 3D furniture models, with a focus on assembly instructions. The website will provide an interactive interface for users to upload, view, and manipulate 3D models of furniture items.

## Frontend Structure

### Pages
1. **Home Page**
   - Welcome section with platform introduction
   - Featured furniture models
   - Call-to-action for uploading models
   - Navigation to other sections

2. **Model Viewer Page**
   - 3D model display area
   - Controls for rotation, zoom, and pan
   - Step navigation for assembly instructions
   - Part highlighting functionality
   - Progress tracking

3. **Upload Page**
   - File upload interface
   - Model metadata input form
   - Preview functionality
   - Submission confirmation

4. **About Page**
   - Platform information
   - Usage instructions
   - Contact information

### Components

1. **Header Component**
   - Logo
   - Navigation menu
   - User actions (if applicable)

2. **Footer Component**
   - Copyright information
   - Links to about, contact, etc.
   - Social media links (if applicable)

3. **3D Viewer Component**
   - Three.js canvas for model rendering
   - Camera controls
   - Lighting setup
   - Part highlighting functionality

4. **Step Navigation Component**
   - Step title and description
   - Next/previous controls
   - Progress indicator
   - Parts list for current step

5. **File Upload Component**
   - File input control
   - Drag and drop area
   - File type validation
   - Upload progress indicator

6. **Model Card Component**
   - Thumbnail image
   - Model name and description
   - View button

## Backend Structure

### API Endpoints

1. **Model Management**
   - `GET /api/models` - List all available models
   - `GET /api/models/:modelId` - Get specific model metadata
   - `POST /api/models` - Upload new model
   - `PUT /api/models/:modelId` - Update model metadata
   - `DELETE /api/models/:modelId` - Remove a model

2. **Assembly Steps**
   - `GET /api/models/:modelId/steps` - Get all steps for a model
   - `GET /api/models/:modelId/steps/:stepId` - Get specific step details
   - `POST /api/models/:modelId/steps` - Add new step
   - `PUT /api/models/:modelId/steps/:stepId` - Update step details
   - `DELETE /api/models/:modelId/steps/:stepId` - Remove a step

### Data Models

1. **Furniture Model**
   ```json
   {
     "modelId": "string",
     "name": "string",
     "manufacturer": "string",
     "modelPath": "string",
     "thumbnail": "string",
     "totalSteps": "number",
     "createdAt": "date",
     "updatedAt": "date"
   }
   ```

2. **Assembly Step**
   ```json
   {
     "stepId": "number",
     "modelId": "string",
     "title": "string",
     "description": "string",
     "partsNeeded": ["string"],
     "cameraPosition": {
       "x": "number",
       "y": "number",
       "z": "number"
     },
     "highlightedParts": ["string"],
     "visibleParts": ["string"]
   }
   ```

## Technical Architecture

### Frontend
- **Framework**: React.js
- **3D Rendering**: Three.js
- **State Management**: React Context API or Redux
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Backend
- **Server**: Node.js with Express.js
- **File Storage**: Local file system (MVP), AWS S3 (future)
- **Database**: MongoDB or simple JSON storage for MVP

### Deployment
- **Frontend**: Netlify or Vercel
- **Backend**: Render or Heroku
