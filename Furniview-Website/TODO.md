# Furniview Project TODO List

This file tracks the main development tasks. Each major step will be broken down into smaller, testable sub-tasks.

## Phase 1: Core Backend - Furniture Model Storage & Upload

### 1.1 Supabase Client & Server Initialization (Already Completed)
- [x] Create `lib/supabase/client.ts` for client-side Supabase interactions.
- [x] Create `lib/supabase/server.ts` for server-side/admin Supabase interactions.
- [x] Test: Basic Supabase client initialization.
- [x] Commit: "feat: initialize Supabase client and server configurations" (Covered by initial project setup commit)

### 1.2 Database Schema for Furniture Models
- [x] Define `furniture_models` table schema in Supabase (e.g., `id`, `name`, `description`, `company_id` (if companies are a separate entity), `model_file_path`, `thumbnail_url`, `created_at`, `updated_at`).
- [x] Create the `furniture_models` table in your Supabase project via the Supabase Dashboard SQL editor or a migration script.
- [x] Test: Verify table creation and structure in Supabase.
- [x] Commit: "feat: define and create furniture_models table schema"

### 1.3 File Upload UI & Client-Side Logic
- [ ] Design and implement a simple UI component for file input (e.g., for OBJ, FBX, STL files as per PRD).
- [ ] Implement client-side logic to take the selected file and prepare it for upload.
- [ ] (Consider placing this UI on a temporary admin/upload page, e.g., `app/admin/upload-model/page.tsx`)
- [ ] Test: UI allows file selection; file object is correctly captured in client-side state/variables.
- [ ] Commit: "feat: implement basic UI for 3D model file input"

### 1.4 Supabase Storage Upload Functionality
- [ ] Create a Supabase Storage bucket (e.g., `models`) if it doesn't exist (can be done via Supabase Dashboard).
- [ ] Set appropriate RLS policies on the storage bucket for uploads (e.g., authenticated users or specific roles).
- [ ] Implement a function (likely client-side for direct upload, or server-side if pre-processing is needed) to upload the file to Supabase Storage using `supabase.storage.from('models').upload(path, file)`.
- [ ] Test: File is successfully uploaded to the Supabase Storage bucket. Verify in Supabase Dashboard.
- [ ] Commit: "feat: implement file upload to Supabase Storage"

### 1.5 Linking Uploaded Model to Database Record
- [ ] After successful file upload, get the public URL or path of the uploaded file.
- [ ] Implement logic to create a new record in the `furniture_models` table, storing the model's name, description (if any from UI), and the `model_file_path` (and/or public URL).
- [ ] Test: A new record appears in `furniture_models` table correctly associating the metadata with the uploaded file path/URL.
- [ ] Commit: "feat: link uploaded 3D model to furniture_models database record"


## Phase 2: Initial Authentication (Magic Link) - To be addressed later

### 2.1 Magic Link Authentication
- [ ] Implement UI for user to input email for Magic Link sign-in (e.g., in `app/login/page.tsx` or a similar route).
- [ ] Implement `signInWithOtp` (Magic Link) function using Supabase Auth.
- [ ] Test: User enters email, receives email (manual check), clicks link, and is signed in. Verify session.
- [ ] Commit: "feat: implement basic Magic Link sign-in"

### 2.2 User Session & Logout (Basic)
- [ ] Implement a way to check user session status (e.g., `supabase.auth.getSession()`, `supabase.auth.onAuthStateChange`).
- [ ] Implement basic `signOut` function using Supabase Auth.
- [ ] Provide a UI element for logout if a user is signed in.
- [ ] Test: Verify session can be retrieved; user can log out successfully.
- [ ] Commit: "feat: implement basic user session check and logout"

### 2.3 Advanced Authentication (Placeholder for Later)
- [ ] Consider and plan for full email/password signup, OAuth, etc., after core backend features are stable.

## Phase 3: Furniture Model Management (Company User Journey - Further Steps)
*To be detailed further*

## Phase 4: 3D Model Viewing (End Customer Journey - Initial Steps)
*To be detailed further* 