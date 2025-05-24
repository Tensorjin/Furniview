# Phase 1: Backend Development

**Purpose**: Set up the foundation for file handling, storage, conversions, and data management.

**Recommended Languages and Tools**:
- **Language**: Node.js (JavaScript)
  - **Why**: Node.js excels at file operations, running scripts (e.g., for conversions), and integrating with databases like Supabase. It’s fast, scalable, and widely supported.
- **Framework**: Express.js
  - **Why**: Express simplifies creating RESTful APIs, which will connect the backend to the frontend.
- **Database and Storage**: Supabase
  - **Why**: Supabase provides a PostgreSQL database, file storage, and authentication out of the box, reducing setup time.

**Key Tasks**:
1.  **Set Up Supabase**:
    *   Create a Supabase project (Consider using `supabase-mcp` tool `create_project`).
    *   **Define Database Schema (SQL Examples)**:
        *   Create necessary custom types (e.g., for status):
          ```sql
          -- types/status_enum.sql
          CREATE TYPE public.processing_status AS ENUM ('uploading', 'processing', 'ready', 'error');
          ```
        *   Create `companies` table:
          ```sql
          -- tables/companies.sql
          CREATE TABLE public.companies (
              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
              owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to Supabase Auth user
              name text NOT NULL CHECK (char_length(name) > 0),
              stripe_customer_id text UNIQUE, -- Added in Phase 2.5
              created_at timestamptz DEFAULT now() NOT NULL,
              updated_at timestamptz DEFAULT now() NOT NULL
          );
          -- Enable RLS
          ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
          -- Add indexes
          CREATE INDEX idx_companies_owner_user_id ON public.companies(owner_user_id);
          -- Add updated_at trigger
          CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.companies
            FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
          ```
        *   Create `furniture` table:
          ```sql
          -- tables/furniture.sql
          CREATE TABLE public.furniture (
              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
              company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
              name text NOT NULL CHECK (char_length(name) > 0),
              original_file_url text, -- URL in Supabase Storage (raw-models bucket)
              gltf_file_url text,     -- URL in Supabase Storage (gltf-models bucket)
              status public.processing_status DEFAULT 'uploading' NOT NULL,
              error_details jsonb,    -- Structured error info (e.g., { "code": "CONVERSION_FAILED", "message": "Unsupported format variant", "step": "assimp_export" })
              metadata jsonb,         -- Optional metadata (e.g., dimensions, materials)
              created_at timestamptz DEFAULT now() NOT NULL,
              updated_at timestamptz DEFAULT now() NOT NULL
          );
          -- Enable RLS
          ALTER TABLE public.furniture ENABLE ROW LEVEL SECURITY;
          -- Add indexes
          CREATE INDEX idx_furniture_company_id ON public.furniture(company_id);
          CREATE INDEX idx_furniture_status ON public.furniture(status);
          -- Add updated_at trigger
          CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.furniture
            FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
          ```
          *(Note: Requires `moddatetime` extension enabled in Supabase: `CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;`)*
    *   Apply schema using Supabase Migrations (e.g., `supabase migration new create_initial_schema`, place SQL in the migration file, then `supabase db push` or use `supabase-mcp` tool `apply_migration`).
    *   Configure Supabase Storage buckets (`raw-models`, `gltf-models`) with appropriate access policies (e.g., authenticated uploads, potentially public reads for `gltf-models` or use signed URLs).
    *   Enable Supabase Authentication and configure providers (e.g., Email, Google OAuth).
    *   **Implement Row Level Security (RLS) Policies (SQL Examples)**:
        *   Define helper function to get company ID for authenticated user (assuming one company per user for simplicity here):
          ```sql
          -- functions/get_my_company_id.sql
          CREATE OR REPLACE FUNCTION public.get_my_company_id()
          RETURNS uuid
          LANGUAGE sql STABLE -- Important for performance in RLS
          AS $$
            SELECT id FROM public.companies WHERE owner_user_id = auth.uid() LIMIT 1;
          $$;
          ```
        *   RLS Policy for `companies` (Allow owner to manage their own company):
          ```sql
          -- policies/companies_rls.sql
          DROP POLICY IF EXISTS "Allow owner full access" ON public.companies;
          CREATE POLICY "Allow owner full access" ON public.companies
            FOR ALL -- Applies to SELECT, INSERT, UPDATE, DELETE
            USING (auth.uid() = owner_user_id)
            WITH CHECK (auth.uid() = owner_user_id);
          ```
        *   RLS Policy for `furniture` (Allow company members to manage their furniture):
          ```sql
          -- policies/furniture_rls.sql
          DROP POLICY IF EXISTS "Allow company members full access" ON public.furniture;
          CREATE POLICY "Allow company members full access" ON public.furniture
            FOR ALL
            USING (company_id = public.get_my_company_id())
            WITH CHECK (company_id = public.get_my_company_id());

          -- Optional: Allow public read access to 'ready' furniture items
          DROP POLICY IF EXISTS "Allow public read access to ready items" ON public.furniture;
          CREATE POLICY "Allow public read access to ready items" ON public.furniture
            FOR SELECT
            USING (status = 'ready');
          ```
        *   *Ensure RLS policies cover all current and anticipated future access patterns (e.g., potential admin roles, different user roles within a company).* Apply policies via migrations.
    *   Retrieve Project URL and API Keys (`supabase-mcp` tools `get_project_url`, `get_anon_key`).
    *   Generate TypeScript types from schema (`supabase-mcp` tool `generate_typescript_types`).
        *   *Integrate type generation into the regular development workflow and/or CI/CD pipeline to keep types synchronized.*
2.  **File Upload API Endpoint**:
    *   Set up Node.js/Express project structure (e.g., using `npm init`, install `typescript`, `ts-node`, `@types/node`, `@types/express` if using TypeScript).
    *   Install necessary dependencies:
        *   `express`: Web framework.
        *   `@supabase/supabase-js`: Supabase client library.
        *   `multer`: Middleware for handling `multipart/form-data` (file uploads). Configure storage (e.g., `multer.memoryStorage()` for small files or `multer.diskStorage()` for temporary local storage before uploading to Supabase).
        *   `express-validator`: Middleware for input validation (validating request body, params, query strings, file properties).
        *   `pino` and `pino-http`: Efficient JSON logger for Node.js/Express.
        *   `cors`: Middleware for enabling Cross-Origin Resource Sharing if frontend is on a different domain.
        *   `dotenv`: For loading environment variables from a `.env` file during development.
    *   Create API endpoint (`POST /api/furniture/upload`) using Express.js.
    *   **Implement Authentication Middleware:**
        *   Create Express middleware (e.g., `src/middleware/auth.ts`) that runs on protected API routes.
        *   This middleware should:
            1.  Extract the JWT token from the `Authorization: Bearer <token>` header.
            2.  Verify the token using the Supabase client library (`supabase.auth.getUser(token)`) or a JWT library (like `jsonwebtoken`) with the Supabase JWT secret obtained from environment variables (`SUPABASE_JWT_SECRET`). Using `supabase.auth.getUser()` is generally simpler and recommended.
            3.  If verification is successful, attach the authenticated user information (e.g., `user.id`, potentially `user.email`, fetched `company_id`) to the `req` object (e.g., `req.user`).
            4.  If verification fails (no token, invalid token, expired token), send a `401 Unauthorized` response.
        *   Apply this middleware selectively to routes requiring authentication.
    *   Implement file handling (e.g., using `multer` configured for memory storage or temporary disk storage, depending on expected file sizes and server setup).
    *   Add **rigorous** input validation (using `express-validator`): check file type (`mimetype`), size limits, presence of required metadata (e.g., furniture name if sent via form data).
    *   **API Request Example (`POST /api/furniture/upload`)**: Typically `multipart/form-data` containing the file and potentially a `name` field.
    *   Implement logic:
        *   Get authenticated user's `company_id`.
        *   Create initial record in `furniture` table (`company_id`, `name`, `status: 'uploading'`).
        *   Upload original file (from `req.file.buffer` if using memoryStorage, or file path if using diskStorage) to `raw-models` Supabase Storage bucket (e.g., path: `{company_id}/{furniture_id}/original_model.ext`). Handle potential storage errors using `try...catch` around Supabase client calls.
        *   Update `furniture` record (`original_file_url`, `status: 'processing'`).
        *   **Trigger Conversion Service Asynchronously (Implementation Options)**:
            *   **Option A (Supabase Database Webhooks - Recommended if available/suitable):** Configure a webhook in Supabase dashboard to trigger on INSERT/UPDATE of the `furniture` table (when status becomes 'processing'). The webhook sends a POST request (containing `furniture_id` from the record) to a secure endpoint on the Conversion Service.
            *   **Option B (Postgres Trigger + pg_net):** Create a Postgres trigger function that fires after INSERT/UPDATE on `furniture`. The function uses the `pg_net` extension (`supabase extensions enable pg_net`) to make an HTTP POST request to the Conversion Service endpoint. Requires careful security setup for network requests from the DB.
            *   **Option C (Simple Queue Table):** After updating the `furniture` status to 'processing', INSERT the `furniture_id` into a dedicated `conversion_queue` table. The Conversion Service periodically polls this table for new jobs, processes them, and deletes/updates the queue record. Simpler but introduces polling latency.
            *   *(Choose one approach based on complexity tolerance, latency requirements, and platform capabilities).*
        *   Return the `furniture` record ID and initial status to the frontend.
    *   **API Response Example (Success - `201 Created`)**:
        ```json
        {
          "id": "uuid-of-furniture-item",
          "name": "Uploaded Furniture Name",
          "status": "processing",
          "message": "Upload successful, processing started."
        }
        ```
    *   Implement centralized error handling middleware.
        *   **Standard Error Response Structure**:
          ```json
          {
            "error": {
              "code": "UNIQUE_CODE_FOR_ERROR", // e.g., "VALIDATION_ERROR", "UPLOAD_FAILED", "UNAUTHORIZED"
              "message": "User-friendly error message.",
              "details": { ... } // Optional: More specific details, e.g., validation errors
            }
              }
              ```
    *   Set up logging (e.g., using `pino` for structured JSON logging).
    *   **API Documentation (OpenAPI/Swagger):**
        *   **Recommendation:** Use OpenAPI Specification (OAS) v3 to define the API contract.
        *   **Generation:** Consider tools like `swagger-jsdoc` (parses JSDoc comments in code) or `tsoa` (generates routes and Swagger spec from TypeScript controllers) to automate spec generation.
        *   **Serving:** Serve the generated `swagger.json` file via a dedicated API endpoint (e.g., `/api/docs/swagger.json`). Optionally, serve Swagger UI (e.g., using `swagger-ui-express`) from another endpoint (e.g., `/api/docs`) for interactive documentation.
        *   Keep the documentation updated as the API evolves (ideally integrated into the CI/CD process).
3.  **Conversion Service (Separate Deployment - e.g., Docker on Fly.io/Render)**:
    *   Set up a separate Node.js project for the conversion service.
    *   Install dependencies (`@supabase/supabase-js`, potentially `express` if exposing an HTTP endpoint, Assimp wrapper/library, logging library).
    *   Install Assimp binary within the Docker container (Dockerfile setup).
    *   Create logic (triggered **asynchronously** via webhook, queue message, etc.):
        *   Receive `furniture` record ID and `original_file_url`.
        *   Download original file from Supabase Storage.
        *   Run Assimp conversion process within a `try...catch` block.
        *   **On Success:**
            *   Upload resulting GLTF file to `gltf-models` Supabase Storage bucket.
            *   Update `furniture` record (`gltf_file_url`, `status: 'ready'`).
        *   **On Failure:**
            *   Log detailed error (stack trace, context).
            *   Update `furniture` record (`status: 'error'`, `error_details`).
            *   **Example `error_details` Structure**:
              ```json
              {
                "code": "CONVERSION_FAILED",
                "step": "assimp_export_gltf", // Specific step where error occurred
                "message": "Assimp error: Incompatible mesh structure.", // More technical detail
                "original_error": "..." // Potentially truncated original error string from Assimp
              }
              // Or for download error:
              {
                "code": "STORAGE_DOWNLOAD_FAILED",
                "step": "download_original_model",
                "message": "Failed to download file from storage.",
                "original_error": "Storage client error details..."
              }
              ```
    *   Secure the asynchronous trigger mechanism (e.g., webhook secrets, queue authentication).
    *   Containerize the service using Docker.
4.  **Core API Endpoints**:
    *   Implement remaining CRUD endpoints for furniture (`GET /api/furniture`, `GET /api/furniture/{id}`, `PUT /api/furniture/{id}`, `DELETE /api/furniture/{id}`) using Express.js.
    *   **Example `GET /api/furniture` Response (Success - `200 OK`)**:
        ```json
        [
          {
            "id": "uuid-item-1",
            "name": "Bookshelf Model A",
            "status": "ready",
            "gltf_file_url": "...", // URL to view/load
            "created_at": "...",
            "updated_at": "..."
          },
          {
            "id": "uuid-item-2",
            "name": "Chair Model B",
            "status": "processing",
            "gltf_file_url": null,
            "created_at": "...",
            "updated_at": "..."
          }
          // ... potentially with pagination info
        ]
        ```
    *   **Example `PUT /api/furniture/{id}` Request Body**:
        ```json
        {
          "name": "Updated Furniture Name",
          "metadata": { "new": "metadata" }
        }
        ```
    *   Ensure all endpoints are secured with authentication middleware, include **rigorous input validation on all incoming data** (using `express-validator` for request bodies, params, query strings) to prevent injection and other attacks, and respect RLS implicitly via Supabase SDK calls.
    *   Implement logic for fetching (with pagination/filtering), updating, and deleting records and associated files (handle file deletion errors from Supabase Storage).
    *   Implement status check endpoint (`GET /api/furniture/{id}/status`) if not using Realtime exclusively.
    *   Implement any necessary Auth endpoints if extending Supabase default behavior.
    *   Ensurethese endpoints are covered by the API documentation (e.g., OpenAPI/Swagger).
5.  **Initial Testing**:
    *   Use tools like Postman or `curl` to test API endpoints manually.
    *   Write basic automated tests (e.g., using Jest/Supertest) for API endpoints.
 