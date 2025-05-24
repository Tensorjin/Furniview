# Phase 2: Frontend Development (using Next.js)

**Purpose**: Build the user interface using Next.js to interact with the backend services (Supabase, Conversion Service via API Routes), display 3D models, and provide a seamless experience.

**Recommended Languages and Tools**:
- **Framework**: Next.js (App Router recommended) with React
  - **Why**: Integrated framework handling UI, routing, API routes, and optimized for Vercel deployment.
- **Language**: TypeScript (Recommended) / JavaScript
- **3D Rendering**: Three.js (likely via `@react-three/fiber` and `@react-three/drei`)
  - **Why**: Integrates well with React/Next.js for efficient browser-based 3D rendering.
- **API Calls**: Native `fetch` API (especially within Server Components/Route Handlers), or libraries like `axios` or data fetching hooks (e.g., from TanStack Query/SWR) for client-side fetching.
- **UI Library (Optional)**: Material UI, Chakra UI, Tailwind CSS (with PostCSS), shadcn/ui. Ensure compatibility with Next.js App Router (Server Components vs. Client Components).
- **State Management (Optional)**: Zustand, Jotai, Valtio (for client-side state). React Context or Server Components for passing data server-to-client.

**Key Tasks**:
1.  **Project Setup**:
    *   Initialize Next.js project: `npx create-next-app@latest my-furniview-app --typescript --tailwind --eslint --app` (Recommended: App Router, TypeScript, Tailwind).
    *   Set up project structure (Next.js App Router conventions):
        ```
        app/
        ├── (auth)/             # Route group for auth pages (login, signup)
        │   ├── login/page.tsx
        │   └── signup/page.tsx
        ├── (dashboard)/        # Route group for authenticated dashboard
        │   ├── layout.tsx      # Layout requiring authentication
        │   └── page.tsx        # Dashboard overview page
        │   └── furniture/      # Furniture management section
        │       └── page.tsx
        ├── (public)/           # Route group for public pages
        │   ├── layout.tsx
        │   └── page.tsx        # Home/Landing page
        │   └── browse/         # Public furniture browser
        │       └── page.tsx
        │   └── view/[id]/      # Public viewer page (dynamic route)
        │       └── page.tsx
        ├── api/                # API Route Handlers
        │   ├── auth/callback/route.ts # Supabase OAuth callback
        │   ├── furniture/
        │   │   ├── route.ts      # GET /api/furniture (list)
        │   │   └── upload/route.ts # POST /api/furniture/upload
        │   ├── billing/          # Billing related routes (Phase 2.5)
        │   │   └── .../route.ts
        │   └── webhooks/         # Webhook handlers (Phase 2.5)
        │       └── stripe/route.ts
        ├── layout.tsx          # Root layout
        └── page.tsx            # Root page (usually landing/home)
        components/             # Reusable UI components (Client & Server)
        ├── ui/                 # Generic UI primitives (e.g., Button, Input - often Client Components)
        ├── auth/               # Auth specific components
        └── ...                 # Other domain-specific components
        lib/                    # Utility functions, Supabase client setup, constants, API client wrappers
        hooks/                  # Custom client-side hooks
        ```
    *   Install necessary dependencies:
        *   Core: Handled by `create-next-app`.
        *   3D: `npm install three @react-three/fiber @react-three/drei`
        *   Supabase: `npm install @supabase/ssr @supabase/supabase-js` (Use `@supabase/ssr` helpers for server-side auth).
        *   API Calls (Client-side): `npm install axios` (optional), `@tanstack/react-query` (optional).
        *   UI Library (Example): Follow library's Next.js App Router integration guide (e.g., Material UI, Tailwind is included by default with starter).
        *   State Management (Client-side Example): `npm install zustand`
    *   Configure environment variables (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-side only!), `SUPABASE_JWT_SECRET` (server-side only!), `NEXT_PUBLIC_API_BASE_URL` (if calling external APIs), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (server-side only!). Use `NEXT_PUBLIC_` prefix only for variables needed in the browser.
2.  **User Interface Design & Components**:
    *   Implement reusable UI components (`components/`) distinguishing between Server Components (default, for non-interactive UI) and Client Components (`'use client';` directive, for interactive UI using hooks/state).
    *   Utilize chosen UI library/styling approach (e.g., Tailwind CSS, shadcn/ui).
    *   **Example Component Notes**:
        *   Forms (`auth/AuthForm.tsx`, `dashboard/FileUploadForm.tsx`) will likely be Client Components due to state and event handlers.
        *   Display components (`dashboard/FurnitureListItem.tsx`) can often be Server Components if just displaying data passed as props.
        *   `viewer/ModelViewer.tsx` using `@react-three/fiber` **must** be a Client Component (`'use client';`).
    *   Create page layouts (`app/.../layout.tsx`) and pages (`app/.../page.tsx`) using file-based routing.
3.  **Authentication**:
    *   **Supabase Auth Helpers:** Use `@supabase/ssr` package to handle authentication securely in Server Components, Client Components, Route Handlers, and Middleware. Set up Supabase client instances for different contexts (client-side, server-side).
    *   Implement login/signup forms using Client Components. Call Supabase JS client methods (`signInWithPassword`, `signUp`, `signInWithOAuth`).
    *   **OAuth Callback:** Create an API Route Handler (`app/api/auth/callback/route.ts`) to handle the redirect from Supabase after OAuth login, exchanging the code for a session using `@supabase/ssr`.
    *   **Session Management:** Use `@supabase/ssr` helpers to manage sessions (reading/writing cookies) securely across server/client boundaries. Access user/session info in Server Components and Client Components via these helpers.
    *   **Protected Routes:** Use Next.js Middleware (`middleware.ts`) to protect route groups (e.g., `/dashboard`) by checking for a valid Supabase session using `@supabase/ssr` helpers and redirecting if necessary.
    *   Implement logout functionality (calling `supabase.auth.signOut` on the client and potentially redirecting).
4.  **Company Dashboard Features (Client Components likely)**:
    *   **File Upload Interface**:
        *   Build form in a Client Component.
        *   Call the Next.js API Route Handler (`POST /api/furniture/upload`) using `fetch` or a client-side library.
        *   Handle loading/error states within the component.
    *   **Furniture List & Status Tracking**:
        *   Fetch initial list potentially via a Server Component or client-side hook (using React Query/SWR recommended for client-side fetching/caching).
        *   Display list using Client or Server Components.
        *   Implement status updates:
            *   **Realtime (Recommended):** Set up Supabase Realtime listener in a Client Component (`useEffect`) as shown previously. Update state managed by React Query/SWR or local state. Ensure channel subscriptions respect user authentication/company ID.
            *   **Polling (Fallback):** Implement polling logic within a client-side hook if Realtime is not used.
        *   Display error details fetched from the backend.
    *   Implement UI for managing furniture (calling respective API Route Handlers via client-side requests).
    *   *Consider optimistic UI updates within client-side mutation logic (e.g., using React Query's `onMutate`).*
5.  **End-User Viewer Features**:
    *   **Furniture Browsing/Search (Server/Client Components)**:
        *   Public browsing page (`app/(public)/browse/page.tsx`) could fetch initial 'ready' items in a Server Component for faster load/SEO or use client-side fetching.
        *   Search/filtering likely requires Client Components for interactivity.
    *   **3D Rendering (Client Component)**:
        *   Viewer page (`app/(public)/view/[id]/page.tsx`) fetches furniture details (including `gltf_file_url`) potentially server-side using route params (`params.id`).
        *   Pass the `gltfUrl` to the `viewer/ModelViewer.tsx` Client Component.
        *   Implement `ModelViewer.tsx` using `@react-three/fiber` and `@react-three/drei` as detailed previously (must include `'use client';`). Use `<Suspense>` and Error Boundaries for loading/error states.
        *   Implement controls (`<OrbitControls />`, custom step controls) within the Client Component.
        *   *Plan for GLTF optimization (Draco, LOD).*
6.  **API Integration & Error Handling**:
    *   **API Route Handlers (`app/api/.../route.ts`):** Define backend logic here using Next.js conventions. Access Supabase using server-side client, perform validation, interact with DB/Storage, trigger Conversion Service. Return responses using `NextResponse.json()`. Handle errors and return appropriate status codes/error structures.
    *   **Client-Side Fetching:** Use `fetch` or libraries like Axios (configured with base URL and potentially auth interceptor if needed beyond Supabase helpers) within Client Components or custom hooks. Use React Query/SWR for managing server state, caching, loading/error states.
    *   **Error Handling:** Implement `try...catch` in Route Handlers and client-side fetching logic. Parse structured errors returned from API routes. Display user-friendly errors in Client Components (toasts, inline messages). Use React Error Boundaries for critical rendering errors (like the 3D viewer). Handle network errors distinctly.
    *   Display loading states (skeletons, spinners) in Client Components, potentially managed by React Query/SWR or local state.
