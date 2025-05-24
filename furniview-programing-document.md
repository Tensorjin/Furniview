# Below is a program document tailored to guide you through building the Furniview website. This plan is designed to create a minimum viable product (MVP) efficiently.

---

## Program Document: Furniview Development Plan

### Overview
Furniview is a website where companies upload furniture files (common 3D formats like STL, OBJ, FBX, etc.) and end users view interactive 3D assembly instructions. The site requires a backend for file management and data processing and a frontend for user interaction. The development process is split into phases, prioritizing the backend to establish core functionality before building the user interface.

---

### Security Principles Overview
The Furniview platform prioritizes security through several key strategies:
- **Leveraging Supabase:** Utilizing Supabase's built-in features for Authentication, Authorization (Row Level Security), and secure File Storage forms the core of the security model.
- **Backend Validation:** Implementing rigorous input validation on all backend API endpoints is crucial to prevent common web vulnerabilities.
- **Secure Secret Management:** Strictly managing sensitive keys (like the Supabase Service Role Key) by keeping them server-side and out of version control.
- **Dependency Management:** Regularly scanning and updating third-party dependencies to mitigate known vulnerabilities.
- **Secure Deployment:** Using established platforms (Vercel, Container Hosts) and following secure configuration practices (e.g., environment variables, separate environments).
- **Least Privilege:** Applying the principle of least privilege through RLS and appropriate API endpoint protection.

---

### Recommended Development Approach: Frontend-First
**Start with the Frontend First.**
- **Reason**: Prioritizing frontend development allows for rapid UI iteration, early visual feedback, and user experience refinement using mock data. Defining API contracts early enables parallel backend development.
- **Workflow:**
    1.  **Frontend Scaffolding:** Set up the Next.js project, UI library (Shadcn/Tailwind), build core layouts/pages with mock data.
    2.  **API Contract Definition:** Define request/response structures for API Route Handlers (e.g., using OpenAPI).
    3.  **Parallel Backend Dev:** Implement Supabase schema, API Route Handlers, and Conversion Service based on the defined contract.
    4.  **Frontend Integration:** Gradually replace mock data/APIs with calls to the actual backend as it becomes available.

---

### Development Phases and Order

See the following documents for detailed steps within each phase:

1.  **[Phase 1: Backend Development](./phase-1-backend.md)**
2.  **[Phase 2: Frontend Development](./phase-2-frontend.md)**
3.  **[Phase 2.5: Billing Integration (Stripe)](./phase-2.5-billing.md)**
4.  **[Phase 3: Integration and Testing](./phase-3-integration-testing.md)** (Now includes testing billing flows)
5.  **[Phase 4: Future AI Enhancements (Post-MVP)](./phase-4-future-ai.md)**
6.  **[Phase 5: Deployment Strategy](./phase-5-deployment.md)**

---

*The detailed descriptions previously below this point have been moved to the linked files.*

---
**Purpose**: Set up the foundation for file handling, storage, conversions, and data management.

**Recommended Languages and Tools**:
- **Language**: Node.js (JavaScript)  
  - **Why**: Node.js excels at file operations, running scripts (e.g., for conversions), and integrating with databases like Supabase. It’s fast, scalable, and widely supported.
- **Database and Storage**: Supabase  
  - **Why**: Supabase provides a PostgreSQL database, file storage, and authentication out of the box, reducing setup time.
- **Web Framework (Frontend & API Layer on Vercel)**: Next.js 15 (App Router) with React 19
  - **Why**: Provides a cutting-edge, integrated framework optimized for Vercel. Leverages React Server Components (RSC) for performance, handles routing, API routes (Route Handlers), and offers flexible rendering strategies. Simplifies the Backend-for-Frontend (BFF) pattern.
- **UI Development**: Shadcn UI / Radix UI + Tailwind CSS
  - **Why**: Offers accessible, unstyled component primitives (Radix) combined with a utility-first CSS framework (Tailwind) and copy-pasteable component examples (Shadcn) for rapid, high-quality, accessible UI development aligned with modern best practices.
- **Language**: TypeScript
  - **Why**: Enforces type safety, improves code maintainability and developer experience. Follow strict mode and modern TS features.

**Key Tasks**:
1. **Set Up Supabase**:
   - Create a Supabase project.
   - Set up a PostgreSQL database for furniture and user data.
   - Configure storage buckets for GLTF files.
   - Enable authentication for companies and end users (including setting up Google Sign-In as an OAuth provider in Supabase).
2. **File Upload and Storage**:
   - Build an API endpoint (e.g., `/api/furniture/upload`) using Express.js to accept file uploads.
   - Upon receiving a file, immediately create a record in the `furniture` table with a `status` of 'uploading'.
   - Store the original file in a dedicated Supabase Storage bucket (e.g., `raw-models`).
   - Update the furniture record with the original file URL and change `status` to 'processing'.
   - Return the ID of the new furniture record to the frontend so it can track progress.
   - Language: Node.js with Supabase SDK.
3. **Automated Conversion (3D to GLTF) & Status Updates**:
   - **Scalability Option:** Instead of running Assimp directly on the main backend server or via simple triggers (which might bottleneck), consider using a scalable background job system or a dedicated conversion service (e.g., Supabase Edge Function, Cloud Function). This service would be triggered upon successful upload.
   - **Process:**
     - The conversion service fetches the original file from storage.
     - It runs Assimp to convert the file to GLTF.
     - **Error Handling:** Implement robust error handling within the conversion script/service. Use `try...catch` blocks. If conversion fails (e.g., Assimp error, unsupported format variant, corrupt file):
        - Log the detailed error stack trace to a logging service or console for debugging.
        - Update the corresponding furniture record `status` to 'error'.
        - Populate the `error_message` field with a user-friendly message (e.g., "Conversion failed: Unsupported file format.") and potentially a unique error ID for support reference.
     - If successful, store the resulting GLTF file in a separate Supabase Storage bucket (e.g., `gltf-models`).
     - Update the furniture record with the GLTF file URL and set `status` to 'ready'.
   - **Feedback:** The backend should provide an endpoint (e.g., `GET /api/furniture/{id}/status`) for the frontend to poll, or leverage Supabase Realtime subscriptions on the `furniture` table so the frontend gets notified instantly of status changes ('processing', 'ready', 'error').
   - Language: Node.js (potentially Python if using specific ML/conversion libraries in a separate service).
4. **Database Management & Security**:
   - **Schema Design:**
     - `companies` table: `id` (UUID, PK), `name` (text), `owner_user_id` (UUID, FK to `auth.users`), created_at, updated_at.
     - `furniture` table: `id` (UUID, PK), `name` (text), `company_id` (UUID, FK to `companies`), `original_file_url` (text), `gltf_file_url` (text), `status` (enum: 'uploading', 'processing', 'ready', 'error'), `error_message` (text, nullable), `metadata` (JSONB, optional), created_at, updated_at.
   - **Security:** Implement Supabase Row Level Security (RLS) policies on the `furniture` table to ensure companies can only access/modify their own records. Example policy: `(auth.uid() = (select owner_user_id from companies where id = company_id))`
   - Use Supabase’s Node.js SDK for database interactions.
   - Language: SQL (for schema/RLS), Node.js (for SDK usage).
5. **API Development (Refined Endpoints)**:
   - Create RESTful API endpoints with Express.js, secured using Supabase Auth middleware:
     - `POST /api/furniture/upload`: Handles file upload, creates initial record, triggers conversion.
     - `GET /api/furniture`: List furniture items for the authenticated company (respects RLS). Supports filtering/pagination.
     - `GET /api/furniture/{id}`: Get details for a specific furniture item (checks ownership via RLS).
     - `GET /api/furniture/{id}/status`: Get the current processing status (alternative to Realtime).
     - `PUT /api/furniture/{id}`: Update furniture metadata (e.g., name).
     - `DELETE /api/furniture/{id}`: Delete a furniture item (removes record and associated files). Needs careful error handling for file deletion failures.
     - `POST /api/auth/login`, `POST /api/auth/signup`, etc.: Handled largely by Supabase SDKs, but potentially custom endpoints for specific logic.
   - **API Error Handling Strategy:**
     - Implement centralized error handling middleware in Express.js.
     - Use standard HTTP status codes (e.g., 400 Bad Request for validation errors, 401 Unauthorized, 403 Forbidden for RLS failures, 404 Not Found, 500 Internal Server Error for unexpected issues).
     - Return consistent JSON error responses (e.g., `{ "error": "message", "details": "..." }`).
     - Implement input validation (e.g., using libraries like `express-validator`) for all API endpoints accepting data.
     - Log all significant errors (especially 5xx) with context (request details, user ID if available) using a logging library (e.g., Winston, Pino).
   - Language: TypeScript/JavaScript (Next.js).

---

#### Phase 2: Frontend Development (using Next.js 15)
**Purpose**: Build the user interface using Next.js 15 (App Router) and React 19 best practices, interacting with backend services via Route Handlers, displaying 3D models, and ensuring a high-quality, accessible, and performant user experience.

**Recommended Languages and Tools**:
- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript (Strict mode)
- **UI**: Shadcn UI / Radix UI + Tailwind CSS
- **3D Rendering**: Three.js via `@react-three/fiber` and `@react-three/drei` (within Client Components)
- **API Calls**: Native `fetch` (cached appropriately), TanStack Query/SWR (for client-side state management if needed).
- **State Management**: URL state (`nuqs`), `useActionState`, minimal client state.

**Key Tasks**:
1. **User Interface Design**:
   - Design layouts for:
     - Company dashboard (file uploads, furniture management).
     - End-user viewer (browsing furniture, viewing instructions).
   - Use React to build components.
   - Language: JavaScript with React.
2. **Authentication**:
   - Implement login/registration flows.
   - Integrate Supabase Auth UI or build custom forms.
   - Add a "Sign in with Google" button using Supabase's JavaScript SDK for OAuth.
   - Handle authentication state within the React application.
   - Language: JavaScript with React and Supabase SDK.
3. **File Upload Interface (for Companies)**:
   - Build a form to upload supported 3D files.
   - Send files to the backend’s `/api/furniture/upload` endpoint.
   - On receiving the furniture record ID back, display feedback to the user (e.g., "Uploading...", "Processing...").
   - Use polling (`GET /api/furniture/{id}/status`) or Supabase Realtime subscriptions to listen for status changes and update the UI accordingly (e.g., show "Ready" or display the specific error message from the `error_message` field if status is 'error').
   - **Error Handling:** Implement `try...catch` blocks around API calls (Fetch/Axios). Handle network errors, non-2xx responses, and timeouts gracefully. Display user-friendly messages (e.g., "Upload failed. Check your connection and file.", "Could not retrieve furniture list.").
   - Language: JavaScript with React.
4. **3D Rendering**:
   - Use Three.js to load GLTF files from Supabase Storage (via backend URLs).
   - **Error Handling:** Implement error handling for Three.js loading processes (e.g., GLTFLoader's error callback). Handle cases where the GLTF file URL is missing, invalid, or the file itself is corrupt. Display a placeholder or error message within the viewer area.
   - Add controls for rotating, zooming, and stepping through assembly instructions.
   - Language: JavaScript with Three.js.
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
   - Test backend endpoints (e.g., with Postman or automated tests) for success and failure cases (valid/invalid uploads, conversion success/failure). Verify correct HTTP status codes and error response formats.
   - Language: N/A (tool-based), JavaScript (for test frameworks like Jest).
2. **Comprehensive Error Handling Testing**:
   - **Backend:** Test API validation errors, authentication/authorization failures (RLS), database errors, file storage errors, and conversion failures. Verify correct logging and database status updates (`error`, `error_message`).
   - **Frontend:** Test handling of API errors (network, server-side), invalid data responses, authentication failures (login/signup), and 3D model loading errors. Ensure user-friendly feedback is displayed for each case.
   - **Scenarios:** Test specific edge cases like uploading excessively large files, unsupported file types, concurrent uploads, network interruptions during upload/download.
3. **Frontend-Backend Integration**:
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

#### Phase 4: Future AI Enhancements (Post-MVP)
**Purpose**: Explore AI capabilities to further enhance the platform's value. Note: These tasks involve significant technical complexity and potential challenges regarding accuracy and reliability, requiring careful research and iterative development.

**Potential Tasks**:
1.  **AI-Generated Assembly Videos**:
    *   Research and integrate AI models (potentially leveraging computer vision and animation techniques) to automatically generate video walkthroughs from the existing 3D instruction steps.
    *   Requires backend processing and potentially new frontend components for video display.
    *   Language/Tools: Python (for AI/ML libraries), Node.js (backend integration), JavaScript/React (frontend).
2.  **AI 2D-to-3D Instruction Generation**:
    *   Investigate computer vision AI models to interpret uploaded 2D instruction manuals (diagrams, images).
    *   Develop a pipeline to translate 2D steps into a preliminary 3D assembly sequence, which companies can then refine.
    *   This could significantly speed up the content creation process for companies using traditional manuals.
    *   Language/Tools: Python (for AI/ML libraries), Node.js (backend integration).

---

### Frontend and Backend Interaction
**How They Communicate**:
- **Method**: RESTful API  
  - The frontend sends HTTP requests (e.g., GET, POST) to backend endpoints.
  - Example: A company uploads a file via `POST /upload`, and the backend responds with a success message.
- **Data Flow**:
   - **Upload & Conversion**: Frontend sends file to `POST /api/furniture/upload` → Backend creates 'uploading' record, stores original file, updates status to 'processing', triggers conversion → Conversion service runs, updates status ('ready'/'error') and GLTF URL → Frontend tracks status via polling or Realtime.
   - **Retrieval**: Frontend requests data via `GET /api/furniture` or `GET /api/furniture/{id}` → Backend fetches from Supabase (RLS enforced) and sends data back.
- **Authentication & Authorization**: Supabase manages user login (email/password and Google Sign-In); the backend verifies JWT tokens. Supabase RLS ensures users can only access data they own.

**Why This Works**:
- Keeps the backend focused on data and files, while the frontend handles presentation.
- RESTful APIs are simple, scalable, and future-proof.

---

### Language Recommendations Summary
- **Backend (API Layer on Vercel)**:
  - **Framework**: Next.js 15 Route Handlers (TypeScript)
    - Handles requests, interacts with Supabase, triggers Conversion Service following best practices (e.g., async runtime APIs).
- **Backend (Conversion Service - Separate Deployment)**:
  - **Language**: Node.js (TypeScript recommended)
  - **Tools**: Assimp wrapper/library.
- **Frontend**:
  - **Framework**: Next.js 15 with React 19 (TypeScript)
    - UI components (RSC-first), interactivity, routing.
  - **UI**: Shadcn UI / Radix UI + Tailwind CSS
  - **3D Rendering**: Three.js (via `@react-three/fiber`, `@react-three/drei` in Client Components)
  - **API Interaction**: `fetch`, TanStack Query/SWR (as needed).
- **Why TypeScript Stack?**:
  - Enforces type safety across the entire application (frontend, API routes, potentially conversion service). Improves maintainability and reduces runtime errors. Next.js provides a cohesive full-stack TypeScript development experience.

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

### Phase 5: Deployment Strategy
**Purpose**: Outline how the different components of the application will be hosted and deployed.

**Key Considerations**:
- **Environment Management**: Maintain separate environments for development, staging (optional, for pre-production testing), and production. Use environment variables (`.env` files, platform-specific settings) to manage configuration differences (API keys, database connections, base URLs) securely. Do not commit sensitive keys to version control.
- **CI/CD (Continuous Integration/Continuous Deployment)**: Set up automated pipelines (e.g., using GitHub Actions, GitLab CI, Vercel/Netlify integrations) to build, test, and deploy code changes automatically upon commits/merges to specific branches (e.g., `main` branch for production, `develop` or `staging` branch for staging).

**Deployment Targets (Vercel Focused)**:

1.  **Supabase**:
    *   **Hosting**: Handled by Supabase (managed service).
    *   **Deployment**: Primarily involves managing database schema changes. Use Supabase Migrations (via Supabase CLI or potentially the `apply_migration` MCP tool) to apply SQL changes consistently across environments. Manage environment variables (API keys) within the Supabase project settings.

2.  **Frontend Application (React)**:
    *   **Platform**: **Vercel (Static Hosting)**. Ideal for React apps, offering global CDN, CI/CD integration, preview deployments, and easy custom domains.
    *   **Build**: Use `npm run build` (or similar) to create optimized static files.
    *   **CI/CD**: Connect GitHub/GitLab repository to Vercel. Vercel automatically builds and deploys on pushes to the configured branch (e.g., `main`). Configure environment variables in Vercel project settings (e.g., `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, `REACT_APP_API_BASE_URL`).

3.  **Backend API (Node.js/Express - *Excluding Conversion*)**:
    *   **Platform**: **Vercel Serverless Functions**. The core API logic (handling requests, validation, Supabase DB/Auth interaction) can be deployed as serverless functions. Structure the Express app within an `/api` directory compatible with Vercel's conventions.
    *   **CI/CD**: Deployed alongside the frontend via the same Vercel project and repository connection. Vercel detects the `/api` directory. Configure necessary environment variables in Vercel (e.g., `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CONVERSION_SERVICE_URL`).
    *   **Limitation**: Vercel Serverless Functions are generally unsuitable for running heavy native dependencies like Assimp. The conversion logic must be handled separately.

4.  **Conversion Service (Node.js + Assimp - *Separate Deployment*)**:
    *   **Necessity**: Due to Assimp's native dependency, this service cannot reliably run on Vercel Serverless Functions. It requires a separate deployment environment.
    *   **Recommended Platform**: **Container Platform (e.g., Fly.io, Render, Google Cloud Run)** using Docker. This allows packaging Node.js and the Assimp binary/library together reliably.
    *   **Triggering**: The main backend API on Vercel will trigger this service (e.g., via an authenticated HTTP request to an endpoint like `POST /convert`) after a file is uploaded to Supabase Storage.
    *   **CI/CD**: Set up a separate CI/CD pipeline (e.g., GitHub Actions) for the conversion service repository/directory. This pipeline builds the Docker image (installing Node.js, Assimp, and dependencies), runs tests, and pushes the image to the chosen container platform. Configure environment variables (Supabase credentials, etc.) on the container platform.
    *   **Alternative (More Complex)**: AWS Lambda with a custom container image including Assimp.

**Domain Names & DNS**:
*   Configure the primary custom domain (e.g., `app.furniview.com`) on Vercel for the frontend and main API.
*   The separate conversion service might run on a subdomain (e.g., `converter.furniview.com` or a platform-provided URL) configured on its hosting platform (Fly.io, Render, etc.). The main API needs to know this URL.

---

### Final Notes
This plan starts with the backend to build a robust foundation, then adds the frontend for user interaction, and considers deployment strategies. Using Node.js for the backend and React with Three.js for the frontend creates a modern, efficient website. Let me know if you need more details or adjustments!
