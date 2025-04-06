# Below is a program document tailored to guide you through building the Furniview website. This plan is designed to create a minimum viable product (MVP) efficiently.

---

## Program Document: Furniview Development Plan

### Overview
Furniview is a website where companies upload furniture files (common 3D formats like STL, OBJ, FBX, etc.) and end users view interactive 3D assembly instructions. The site requires a backend for file management and data processing and a frontend for user interaction. The development process is split into phases, prioritizing the backend to establish core functionality before building the user interface.

---

### Should You Start with Frontend or Backend?
**Start with the Backend First.**
- **Reason**: The backend handles essential tasks like file uploads, storage, and converting various 3D files to GLTF for 3D rendering. Building it first ensures these critical features work before the frontend relies on them. It also allows early testing of file and data operations.

---

### Development Phases and Order

#### Phase 1: Backend Development
**Purpose**: Set up the foundation for file handling, storage, conversions, and data management.

**Recommended Languages and Tools**:
- **Language**: Node.js (JavaScript)  
  - **Why**: Node.js excels at file operations, running scripts (e.g., for conversions), and integrating with databases like Supabase. It’s fast, scalable, and widely supported.
- **Framework**: Express.js  
  - **Why**: Express simplifies creating RESTful APIs, which will connect the backend to the frontend.
- **Database and Storage**: Supabase  
  - **Why**: Supabase provides a PostgreSQL database, file storage, and authentication out of the box, reducing setup time.

**Key Tasks**:
1. **Set Up Supabase**:
   - Create a Supabase project.
   - Set up a PostgreSQL database for furniture and user data.
   - Configure storage buckets for GLTF files.
   - Enable authentication for companies and end users.
2. **File Upload and Storage**:
   - Build an API endpoint (e.g., `/upload`) using Express.js to accept file uploads from the frontend.
   - Store files in Supabase Storage.
   - Language: Node.js with Supabase SDK.
3. **Automated Conversion (3D to GLTF)**:
   - Install Assimp (a library for 3D file conversion) on the server.
   - Write a Node.js script to convert uploaded 3D files (STL, OBJ, FBX, etc.) to GLTF using Assimp.
   - Use Supabase triggers to detect new 3D file uploads and run the conversion script.
   - Store GLTF files in Supabase Storage.
   - Language: Node.js.
4. **Database Management**:
   - Design tables for furniture (e.g., name, file URLs, metadata) and users (e.g., company details, credentials).
   - Use Supabase’s Node.js SDK to interact with the database.
   - Language: Node.js.
5. **API Development**:
   - Create RESTful API endpoints with Express.js:
     - `POST /upload`: Upload files.
     - `GET /furniture`: Retrieve furniture data and file URLs.
     - `POST /login`: Handle user authentication via Supabase.
   - Language: Node.js with Express.js.

---

#### Phase 2: Frontend Development
**Purpose**: Build the user interface to interact with the backend, display 3D models, and provide a seamless experience.

**Recommended Languages and Tools**:
- **Language**: JavaScript (with React)  
  - **Why**: React is ideal for creating dynamic, reusable UI components, perfect for interactive features like 3D viewers.
- **3D Rendering**: Three.js  
  - **Why**: Three.js integrates with JavaScript/React to render GLTF models in the browser efficiently.
- **API Calls**: Fetch API or Axios  
  - **Why**: These tools simplify HTTP requests to the backend.

**Key Tasks**:
1. **User Interface Design**:
   - Design layouts for:
     - Company dashboard (file uploads, furniture management).
     - End-user viewer (browsing furniture, viewing instructions).
   - Use React to build components.
   - Language: JavaScript with React.
2. **Authentication**:
   - Create login/registration forms.
   - Use Supabase’s JavaScript SDK to connect to the backend’s authentication endpoints.
   - Language: JavaScript with React.
3. **File Upload Interface (for Companies)**:
   - Build a form to upload supported 3D files (STL, OBJ, FBX, etc.).
   - Send files to the backend’s `/upload` endpoint using Fetch API or Axios.
   - Language: JavaScript with React.
4. **3D Rendering**:
   - Use Three.js to load GLTF files from Supabase Storage (via backend URLs).
   - Add controls for rotating, zooming, and stepping through assembly instructions.
   - Language: JavaScript with Three.js.
5. **API Integration**:
   - Fetch furniture data and file URLs from the backend’s `/furniture` endpoint.
   - Display loading states and handle errors (e.g., file not found).
   - Language: JavaScript with Fetch API or Axios.

---

#### Phase 3: Integration and Testing
**Purpose**: Ensure the frontend and backend work together and the site functions across devices.

**Key Tasks**:
1. **API Testing**:
   - Test backend endpoints (e.g., with Postman) to confirm file uploads, conversions, and data retrieval work.
   - Language: N/A (tool-based).
2. **Frontend-Backend Integration**:
   - Connect frontend components to backend APIs.
   - Verify data flows correctly (e.g., upload → conversion → display).
   - Language: JavaScript (frontend) and Node.js (backend).
3. **Device Compatibility Testing**:
   - Test 3D rendering on smartphones, tablets, and laptops.
   - Language: N/A (testing phase).
4. **User Flow Testing**:
   - Simulate a company uploading files and an end user viewing instructions.
   - Fix usability bugs or performance issues.

---

### Frontend and Backend Interaction
**How They Communicate**:
- **Method**: RESTful API  
  - The frontend sends HTTP requests (e.g., GET, POST) to backend endpoints.
  - Example: A company uploads a file via `POST /upload`, and the backend responds with a success message.
- **Data Flow**:
  - **Upload**: Frontend sends files to backend → Backend stores in Supabase Storage.
  - **Conversion**: Backend detects new 3D file, converts to GLTF, and stores it.
  - **Retrieval**: Frontend requests data via `GET /furniture` → Backend fetches from Supabase and sends it back.
- **Authentication**: Supabase manages user login; the backend verifies tokens for secure access.

**Why This Works**:
- Keeps the backend focused on data and files, while the frontend handles presentation.
- RESTful APIs are simple, scalable, and future-proof.

---

### Language Recommendations Summary
- **Backend**:
  - **Core Language**: Node.js (JavaScript)  
    - File uploads, API endpoints, Supabase interaction.
  - **Framework**: Express.js  
    - RESTful API creation.
  - **Conversion**: Node.js with Assimp
    - 3D to GLTF conversion.
- **Frontend**:
  - **Core Language**: JavaScript (with React)  
    - UI components, interactivity.
  - **3D Rendering**: Three.js  
    - GLTF model display.
  - **API Interaction**: Fetch API or Axios  
    - Communication with backend.
- **Why JavaScript Everywhere?**:  
  - Unified language reduces learning curves and improves consistency across the stack.

---

### Development Order Summary
1. **Backend Setup**:
   - Supabase (database, storage, auth).
   - File upload/storage endpoints.
   - 3D-to-GLTF conversion script.
2. **Core Backend API**:
   - Furniture data and user management endpoints.
3. **Frontend Components**:  
   - Authentication forms.  
   - File upload interface.  
   - Furniture viewer with instructions.
4. **3D Rendering**:
   - Three.js for 3D rendering.
5. **Testing and Integration**:
   - Connect frontend to backend.
   - Test across devices and fix issues.

---

### Final Notes
This plan starts with the backend to build a robust foundation, then adds the frontend for user interaction. Using Node.js for the backend and React with Three.js for the frontend creates a modern, efficient website. Let me know if you need more details or adjustments!
