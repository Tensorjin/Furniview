# Furniview Project TODO List

This file tracks the main development tasks. Each major step will be broken down into smaller, testable sub-tasks.

## Phase 1: Core Backend Setup & Initial Authentication (Magic Link)

### 1.1 Supabase Client & Server Initialization
- [x] Create `lib/supabase/client.ts` for client-side Supabase interactions.
- [x] Create `lib/supabase/server.ts` for server-side/admin Supabase interactions.
- [x] Test: Basic Supabase client initialization (no actual calls yet, just ensure no errors on import/setup).
- [x] Commit: "feat: initialize Supabase client and server configurations" (Covered by initial project setup commit)

### 1.2 Magic Link Authentication
- [x] Implement UI for user to input email for Magic Link sign-in (e.g., in `app/login/page.tsx` or a similar route).
- [x] Implement `signInWithOtp` (Magic Link) function using Supabase Auth.
- [x] Test: User enters email, receives email (manual check), clicks link, and is signed in. Verify session.
- [x] Commit: "feat: implement basic Magic Link sign-in"

### 1.3 User Session & Logout (Basic)
- [x] Implement a way to check user session status (e.g., `supabase.auth.getSession()`, `supabase.auth.onAuthStateChange`). (Handled by AuthProvider)
- [x] Implement basic `signOut` function using Supabase Auth. (Handled by AuthProvider)
- [x] Provide a UI element for logout if a user is signed in. (Done in Navbar)
- [x] Test: Verify session can be retrieved; user can log out successfully.
- [x] Commit: "feat: implement basic user session check and logout"

### 1.4 Advanced Authentication (Placeholder for Later)
- [ ] Consider and plan for full email/password signup, OAuth, etc., after core backend features are stable.

## Phase 2: Furniture Model Management (Company User Journey - Initial Steps)

### 2.1 Database Schema & RLS for Core Furniture Management
- [x] Define and create `companies` table.
- [x] Define and create `company_members` (junction) table.
- [x] Define and create `furniture_models` table (with `updated_at` trigger).
- [x] Implement basic Row Level Security (RLS) policies for `companies`, `company_members`, and `furniture_models`.
- [x] Document new table schemas and RLS in `cursor/rules/data_model.mdc`.
- [x] Commit: "feat: establish core database schema and RLS for companies and furniture models" (Actual commit: "docs: update data model with company and furniture schemas and RLS" for the .mdc file; DB changes applied via MCP)

### 2.2 Basic API for Furniture Models (List & Create)
- [x] Deployed Edge Function `create-company-and-assign-admin` to handle company creation and initial admin assignment.
- [x] Created UI page (`/dashboard/company/create`) for company creation form.
- [x] Created basic dashboard page (`/dashboard`) as redirect target and future home for company/model management links.
- [x] Updated Navbar to show Dashboard/Logout links based on auth state.
- [x] Tested company creation flow successfully.
- [x] Commit: "feat: add company creation UI, basic dashboard, and update navbar for auth state"

### 2.3 Display User's Companies on Dashboard
- [x] Modified `/dashboard/page.tsx` to fetch and display a list of companies the logged-in user is a member of.
- [x] Handled loading, error, and empty states for company list.
- [x] Adjusted `company_members` SELECT RLS policy to `user_id = auth.uid()` to resolve 500 error.
- [x] Tested successfully: user can see their companies on the dashboard.
- [x] Commit: "feat: display user companies on dashboard and fix RLS for company_members select"

### 2.4 Furniture Model Management on Dashboard (View, Upload, Delete)
- [ ] Modify `/dashboard/page.tsx` to display furniture models for the selected company.
- [ ] Implement UI for uploading new furniture model files (e.g., GLB/GLTF) for the selected company.
- [ ] Implement functionality to call an Edge Function or server action to handle model file upload to Supabase Storage, linking to `furniture_models` table.
- [ ] Implement UI for deleting furniture models (and their associated files from Storage).
- [ ] Test: User can select a company, see its models, upload a new model, and delete an existing model.
- [ ] Commit: "feat: integrate furniture model management (list, upload, delete) into dashboard"

*Next: API and UI for listing user's companies on the dashboard.*
*Next: API and UI for creating furniture models (associated with a company).*

## Phase 3: 3D Model Viewing (End Customer Journey - Initial Steps)
*To be detailed further* 