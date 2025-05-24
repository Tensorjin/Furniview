# Furniview Project TODO List

This file tracks the main development tasks. Each major step will be broken down into smaller, testable sub-tasks.

## Phase 1: Core Backend Setup & Initial Authentication (Magic Link)

### 1.1 Supabase Client & Server Initialization
- [ ] Create `lib/supabase/client.ts` for client-side Supabase interactions.
- [ ] Create `lib/supabase/server.ts` for server-side/admin Supabase interactions.
- [ ] Test: Basic Supabase client initialization (no actual calls yet, just ensure no errors on import/setup).
- [ ] Commit: "feat: initialize Supabase client and server configurations"

### 1.2 Magic Link Authentication
- [ ] Implement UI for user to input email for Magic Link sign-in (e.g., in `app/login/page.tsx` or a similar route).
- [ ] Implement `signInWithOtp` (Magic Link) function using Supabase Auth.
- [ ] Test: User enters email, receives email (manual check), clicks link, and is signed in. Verify session.
- [ ] Commit: "feat: implement basic Magic Link sign-in"

### 1.3 User Session & Logout (Basic)
- [ ] Implement a way to check user session status (e.g., `supabase.auth.getSession()`, `supabase.auth.onAuthStateChange`).
- [ ] Implement basic `signOut` function using Supabase Auth.
- [ ] Provide a UI element for logout if a user is signed in.
- [ ] Test: Verify session can be retrieved; user can log out successfully.
- [ ] Commit: "feat: implement basic user session check and logout"

### 1.4 Advanced Authentication (Placeholder for Later)
- [ ] Consider and plan for full email/password signup, OAuth, etc., after core backend features are stable.

## Phase 2: Furniture Model Management (Company User Journey - Initial Steps)
*To be detailed further*

## Phase 3: 3D Model Viewing (End Customer Journey - Initial Steps)
*To be detailed further* 