# Furniview: Consolidated Technical Plan (Next.js 15 / React 19)

**Version:** 1.0
**Date:** 2025-05-02 (Updated Order: 2025-05-06)

## 1. Overall Architecture

Furniview will be developed as a modern web application leveraging a serverless-first approach for the primary application logic and a separate containerized service for specialized processing.

*   **Frontend & BFF API:** A Next.js 15 application deployed on Vercel. This handles:
    *   User Interface (React 19 with Server Components and Client Components).
    *   API Routes (Route Handlers) acting as a Backend-for-Frontend (BFF), interacting with Supabase and triggering the Conversion Service.
*   **Database & Auth:** Supabase (PostgreSQL, Auth, Storage, Realtime). Provides core data persistence, user management, file storage, and real-time capabilities.
*   **3D Conversion Service:** A separate Node.js service, containerized using Docker and deployed on a suitable platform (e.g., Fly.io, Render). This service encapsulates the Assimp dependency for converting various 3D model formats to GLTF. It is triggered asynchronously by the Next.js API routes.
*   **Billing:** Stripe integration for subscription management and payment processing, managed via Next.js API routes and Stripe webhooks.

```mermaid
graph TD
    A[User Browser] -->|HTTPS| B(Next.js App on Vercel);
    B -->|React UI (RSC/Client)| A;
    B -->|API Route Handlers| C(Supabase);
    B -->|API Route Handlers| D(Conversion Service);
    B -->|API Route Handlers| E(Stripe API);
    C -->|Database Webhooks/Triggers?| D;
    D -->|Update Status| C;
    F[Stripe Webhooks] --> B;

    subgraph Vercel
        B
    end

    subgraph Supabase Cloud
        C[DB, Auth, Storage, Realtime]
    end

    subgraph Container Host (e.g., Fly.io)
        D[Node.js + Assimp (Docker)]
    end

    subgraph Stripe Cloud
        E
        F
    end
```

## 2. Technology Stack

*   **Framework:** Next.js 15 (App Router)
*   **UI Library:** React 19
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI / Radix UI
*   **Database/Auth/Storage:** Supabase (Postgres, GoTrue, Storage)
*   **Realtime:** Supabase Realtime
*   **3D Conversion:** Assimp (via Node.js wrapper in a separate service)
*   **3D Rendering (Client):** Three.js with `@react-three/fiber`, `@react-three/drei`
*   **Billing:** Stripe (API, Webhooks, Checkout, Billing Portal)
*   **API Communication (Client):** Native `fetch`, TanStack Query/SWR (optional)
*   **State Management (Client):** URL State (`nuqs`), React 19 `useActionState`, Zustand/Jotai (minimal use)
*   **Deployment:** Vercel (Next.js App), Container Host (Fly.io/Render for Conversion Service)
*   **CI/CD:** GitHub Actions
*   **Testing:** Jest/Vitest (Unit/Integration), Playwright/Cypress (E2E), React Testing Library

## 3. Project Setup

*   **Initialization:** `npx create-next-app@latest --typescript --tailwind --eslint --app`
*   **Structure:** Follow Next.js App Router conventions (see `phase-2-frontend.md` for example).
*   **TypeScript Config (`tsconfig.json`):** Strict mode enabled, target ES2022, moduleResolution `bundler`, paths configured (e.g., `@/*`).
*   **Linting/Formatting:** ESLint and Prettier configured and enforced via CI.
*   **Dependencies:** Install core dependencies as listed in previous phase documents (e.g., `@supabase/ssr`, `@stripe/stripe-node`, `three`, `@react-three/fiber`, Shadcn UI setup).
*   **Environment Variables:** Use `.env.local` for development, platform settings for deployment. Adhere to `NEXT_PUBLIC_` prefix convention for client-side variables.

## 2.5 Design Philosophy & UI Guidelines

The design of Furniview will be heavily inspired by the principles of Apple and the philosophies of Steve Jobs, Jony Ive, and Dieter Rams, focusing on a minimalist, intuitive, and user-centric experience.

*   **Simplicity and Clarity:** The layout must be clean, uncluttered, with intuitive navigation and minimal visual distractions. Every design element must serve a clear purpose.
*   **High-Quality Aesthetic:**
    *   **Color Palette:** Utilize a refined palette with neutral, calming tones (e.g., `#FAFAF8`, `#F0EFEA`, `#E6E4DD`) and subtle accent colors (e.g., `#8989DE`, `#61AAF2`, `#7EBF8E`, `#C7FB76`). Avoid dark blue unless essential. The provided color list offers a broad spectrum; selection should prioritize elegance and cohesion. Consider extending `tailwind.config.ts` with key brand colors.
    *   **Visual Style:** Evoke modern elegance. Use white space effectively to allow elements to breathe. Glassmorphism and blur effects should be applied judiciously where they enhance clarity and aesthetics without compromising performance.
    *   **Typography:** Must be clear, modern, and unobtrusive (e.g., similar to Apple's San Francisco font family if web-safe alternatives are chosen, or a high-quality sans-serif like Inter). Prioritize readability and hierarchy.
*   **Function Over Form:** All design choices must prioritize usability and function. Visual hierarchy should guide users naturally. Calls-to-action must be clear but not overwhelming. Buttons and icons should be instantly understandable.
*   **Precision in Details:** Meticulous attention to detail is paramount: button placement, font sizes, spacing (padding/margins), interactions, and overall cohesiveness. Aim for "less but better."
*   **Human-Centered Design:** The user's experience is central. Design must be seamless, responsive across all devices (mobile-first approach), and accessible (WCAG 2.1 guidelines).
*   **Layout Principles:**
    *   Ensure all components have adequate padding and margin to prevent them from touching screen edges.
    *   Maintain responsiveness, ensuring elements align and center correctly where intended across different viewport sizes.

## 3.5 Development Approach / Order (Frontend-First Recommended)

While backend components like the database and conversion service are essential, this plan **strongly recommends a Frontend-First** development approach. This prioritizes rapid UI iteration and early visual feedback using mock data initially, while defining API contracts upfront to enable parallel backend work.

*   **Initial Focus (Frontend):** Begin by setting up the Next.js project, establishing the UI component library (Shadcn/Radix/Tailwind), building core UI layouts, pages (using mock data), and implementing client-side routing. Develop interactive components (forms, 3D viewer shell) using mock data or placeholder logic initially.
*   **API Contract Definition:** Define the API contracts (request/response structures for Route Handlers) early, ideally using OpenAPI/Swagger. This allows the frontend team to build against a stable interface definition.
*   **Parallel Backend Development:** Backend development (Supabase setup, API Route Handler implementation, Conversion Service) can proceed in parallel or follow the initial frontend scaffolding.
*   **Mocking:** Frontend developers will utilize mock data and potentially mock API servers (e.g., using MSW - Mock Service Worker) to simulate backend responses until the actual API routes are available and integrated.
*   **Integration:** Gradually replace mock data/APIs with calls to the real backend Route Handlers as they become available. Integrate Supabase authentication and realtime features.
*   **Rationale:** This approach allows for faster visual progress, earlier feedback on UI/UX, and parallel work streams, provided the API contract is well-defined upfront.

## 4. Frontend Development (`app/` directory, `components/`)

*   **Design Adherence:** All frontend development must strictly adhere to the **Section 2.5 Design Philosophy & UI Guidelines**, focusing on simplicity, clarity, high-quality aesthetics (Apple/Rams inspired), function over form, precision in details, and human-centered design.
*   **Layout & Styling:**
    *   Implement a clean, uncluttered layout with intuitive navigation.
    *   Utilize Tailwind CSS for styling, adhering to a mobile-first approach.
    *   Leverage Shadcn UI and Radix UI for accessible component primitives.
    *   Make effective use of white space.
    *   Apply glassmorphism and blur effects judiciously where they enhance the design without hindering performance or clarity.
    *   Ensure all components have appropriate padding and margins to avoid touching screen edges and to create a breathable layout.
    *   Pay meticulous attention to responsive design, ensuring correct alignment, centering, and usability across all target devices and breakpoints.
    *   Use the defined color palette (neutrals with subtle accents) and typography (clear, modern, unobtrusive) consistently.
*   **Architecture:** Prioritize React Server Components (RSC) for non-interactive UI. Use Client Components (`'use client';`) for interactivity, state, lifecycle effects, browser APIs, and library components requiring them (e.g., Shadcn UI primitives, React-Three-Fiber).
*   **UI Implementation:** Use Shadcn UI components built upon Radix UI primitives, styled with Tailwind CSS. Ensure accessibility (ARIA attributes, keyboard navigation, WCAG 2.1 compliance).
*   **Routing:** File-based routing via the App Router. Use `<Link>` component for navigation.
*   **State Management:**
    *   Minimize client-side state. Prefer Server Components for data fetching.
    *   Use URL state for filters, pagination, etc. (`nuqs` library recommended).
    *   Use React 19 `useActionState` for form state management with Server Actions.
    *   For complex global client state (e.g., auth status if not solely relying on Supabase helpers), use Zustand or Jotai.
*   **Data Fetching:**
    *   *Server Components:* Use `async/await` with `fetch` directly. Configure caching (`cache: 'force-cache'`, `fetchCache = 'default-cache'`) appropriately.
    *   *Client Components:* Use TanStack Query (React Query) or SWR for managing server state, caching, mutations, and handling loading/error states gracefully. Fetch data by calling API Route Handlers.
*   **Authentication:** Use `@supabase/ssr` helpers to access user/session on both server and client. Implement protected routes via Middleware.
*   **3D Rendering:** Use `@react-three/fiber` and `@react-three/drei` within Client Components. Load models using `useGLTF` within `<Suspense>`. Implement controls (`<OrbitControls>`). Handle loading/error states using Error Boundaries. Optimize GLTF assets (Draco).
*   **Realtime:** Use Supabase Realtime JS client within Client Components (`useEffect`) to subscribe to database changes (e.g., furniture status updates) and update UI state (or invalidate React Query cache).

## 5. Backend (API Route Handlers - `app/api/.../route.ts`)

*   **Purpose:** Handle client requests, interact with Supabase, manage business logic, trigger external services (Conversion, Stripe).
*   **Authentication:** Use `@supabase/ssr` helpers to verify JWT tokens in Route Handlers or Middleware. Protect routes appropriately.
*   **Validation:** Implement rigorous input validation for all incoming request bodies, params, and query strings (e.g., using Zod).
*   **Supabase Interaction:** Use the Supabase server-side client (`@supabase/ssr` or `@supabase/supabase-js` initialized server-side) for database operations (respecting RLS) and storage interactions.
*   **Key Route Handlers:**
    *   `/api/furniture/upload` (POST): Handles file upload (using `request.formData()`), validates input, creates initial DB record, uploads original file to Supabase Storage, triggers Conversion Service asynchronously.
    *   `/api/furniture` (GET): Lists furniture for the authenticated company (fetches from Supabase, respecting RLS, handles pagination/filtering).
    *   `/api/furniture/[id]` (GET, PUT, DELETE): Handles operations on specific furniture items, ensuring ownership via RLS. Delete should remove storage objects.
    *   `/api/billing/create-checkout-session` (POST): Creates Stripe Checkout session.
    *   `/api/billing/create-portal-session` (POST): Creates Stripe Billing Portal session.
    *   `/api/webhooks/stripe` (POST): Handles incoming Stripe webhooks (requires raw body parsing, signature verification, idempotency).
    *   `/api/auth/callback` (GET): Handles Supabase OAuth callback.
*   **Error Handling:** Use `try...catch` blocks, return standardized JSON error responses with appropriate HTTP status codes and error codes (see `phase-1-backend.md` for structure).
*   **API Specification:** Maintain an OpenAPI (Swagger) specification, potentially auto-generated (`swagger-jsdoc`, `tsoa`) and served via a dedicated route handler.

## 6. Conversion Service (Separate Deployment)

*   **Purpose:** Isolate the Assimp dependency for converting 3D models to GLTF.
*   **Technology:** Node.js (TypeScript recommended) service.
*   **Triggering:** Asynchronous (Supabase DB Webhooks, Postgres Trigger + `pg_net`, or Queue Table polled by the service). Receives `furniture_id`.
*   **Logic:**
    1.  Receive trigger event/message.
    2.  Fetch `original_file_url` from Supabase DB using `furniture_id`.
    3.  Download original file from Supabase Storage.
    4.  Execute Assimp conversion command (`assimp export <input> <output.glb> [options]`).
    5.  Handle conversion success: Upload GLTF to Supabase Storage (`gltf-models` bucket), update `furniture` record status to 'ready' and set `gltf_file_url`.
    6.  Handle conversion failure: Update `furniture` record status to 'error' and store structured `error_details` (JSONB).
*   **Deployment:** Docker container on Fly.io/Render. Requires Supabase credentials as environment variables. Implement health checks.

## 7. Database (Supabase Postgres)

*   **Schema:** Defined via SQL migration files (`supabase/migrations`). Key tables: `companies`, `furniture`, `subscriptions` (see detailed schemas in previous phase docs). Use appropriate data types, constraints, foreign keys, and indexes.
*   **RLS:** Implement Row Level Security policies extensively to enforce data access control based on authenticated user and company ownership. Use helper functions (e.g., `get_my_company_id()`) where appropriate. Test policies rigorously.
*   **Migrations:** Manage schema changes using Supabase CLI migrations (`supabase migration new`, `supabase db push/reset`). Integrate into CI/CD carefully (manual approval for production recommended).

## 8. Billing Integration (Stripe)

*   **Setup:** Configure Stripe Products/Prices and Customer Portal.
*   **Backend (Route Handlers):**
    *   `/api/billing/create-checkout-session`: Creates Stripe customer if needed, creates Checkout Session, returns session ID.
    *   `/api/billing/create-portal-session`: Creates Billing Portal session, returns URL.
*   **Webhook Handler (`/api/webhooks/stripe`):** Securely verifies signatures, handles events idempotently (`checkout.session.completed`, `invoice.*`, `customer.subscription.*`), updates local database (`subscriptions` table).
*   **Frontend (Client Components):** UI for pricing/account, calls backend to initiate checkout/portal sessions, redirects using Stripe.js (`redirectToCheckout`) or `window.location`. Displays subscription status based on backend data.
*   **Limit Enforcement:** Middleware in relevant backend Route Handlers checks active subscription status and usage against limits before allowing actions.

## 9. Testing Strategy

*   **Unit/Integration Tests:** Use Jest/Vitest + React Testing Library. Test individual components (especially Client Components), utility functions, Route Handler logic (can be tested by mocking DB/external calls), custom hooks.
*   **E2E Tests:** Use Playwright or Cypress. Simulate full user flows (auth, upload, view, billing) against a deployed staging environment. Integrate into CI/CD.
*   **API Testing:** Test Route Handlers directly or via tools like Postman against local/staging environments. Consider contract testing (Pact) if frontend/backend evolve separately.
*   **Security Testing:** Rigorously test RLS policies, perform basic penetration testing (OWASP Top 10 focus), validate storage bucket policies, run dependency vulnerability scans (`npm audit`/Snyk) in CI.
*   **Billing Testing:** Use Stripe test mode, test cards, and Stripe CLI for webhook simulation. Test full subscription lifecycle and limit enforcement.
*   **Accessibility:** Test with screen readers, ensure keyboard navigation, use automated accessibility checking tools (e.g., Axe).

## 10. Deployment Strategy

*   **Platform:** Vercel for Next.js application; Container Host (Fly.io/Render) for Conversion Service.
*   **Environments:** `development`, `staging`, `production` with separate Supabase projects.
*   **Branching:** Gitflow variant (`main`, `develop`, `feature/*`, `hotfix/*`).
*   **CI/CD (GitHub Actions):** Lint, test, build Next.js app (Vercel deploys automatically), build/push Docker image for conversion service (conditional), deploy conversion service (conditional), apply Supabase migrations (manual approval for prod recommended).
*   **Monitoring:** Vercel Analytics/Logs, Sentry (errors/performance), Container Host metrics, Supabase dashboard, external uptime monitoring. Configure alerts for critical issues.
*   **Backup/Recovery:** Leverage Supabase automated backups + PITR (if applicable). Define and test recovery strategy.

## 11. AI Enhancements (Post-MVP - Phase 4 Summary)

*   **AI Video Generation:** Explore automation via Game Engines, Blender scripting, or AI video platforms based on structured assembly data. Requires dedicated backend processing.
*   **AI 2D-to-3D Generation:** Highly complex R&D effort involving CV/NLP pipeline (component detection, relationship analysis, text parsing, sequence generation). Output requires significant user refinement via a dedicated editor. Prioritize PoCs for high-risk stages. Requires substantial labeled training data.

## 12. Code Style & Best Practices

*   Adhere strictly to the guidelines provided previously regarding TypeScript usage, React 19/Next.js 15 patterns (RSC-first, async APIs, state management), Vercel AI SDK usage (if/when implemented), UI development (Tailwind, Shadcn, Accessibility), configuration, and testing.
*   Prioritize concise, readable, maintainable, type-safe code.
*   Use functional and declarative patterns where appropriate.
*   Follow DRY principle and implement early returns.
*   Use descriptive naming conventions.
