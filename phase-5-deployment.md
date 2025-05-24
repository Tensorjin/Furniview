# Phase 5: Deployment Strategy

**Purpose**: Outline how the different components of the application will be hosted and deployed, focusing on Vercel where applicable.

**Key Considerations**:

*   **Environment Management**:
    *   **Environments:** Maintain distinct environments:
        *   `development`: Local developer machines. Uses local `.env` files. Connects to a local or shared development Supabase instance/project.
        *   `staging` (Recommended): Deployed preview environment mirroring production. Uses platform-managed environment variables. Connects to a dedicated staging Supabase project. Ideal for E2E testing, UAT, and previewing features.
        *   `production`: Live environment for end-users. Uses platform-managed environment variables. Connects to the production Supabase project.
    *   **Branching Strategy (Example: Gitflow variant):**
        *   `main`: Represents production. Only merge tested, stable code here (usually from `develop` or release branches). Deploys to production.
        *   `develop`: Integration branch for features. Deploys to staging.
        *   `feature/xyz`: Individual feature branches, branched off `develop`. Merged back into `develop` via Pull Requests (PRs) after review/testing.
        *   `hotfix/abc`: Branched off `main` for urgent production bug fixes. Merged back into both `main` and `develop`.
    *   **Environment Variables Management:**
        *   *Local (`.env`):* Use `dotenv` library in Node.js backend. Use Vite's built-in handling (`VITE_` prefix) for frontend. **Never commit `.env` files.** Use `.env.example` for structure reference.
        *   *Vercel:* Configure via Vercel Project Settings UI (for Production, Preview, Development scopes). Access via `process.env` in Serverless Functions and `import.meta.env` (or `process.env` with framework config) in frontend code.
        *   *Container Host (Fly.io/Render):* Configure via platform UI or CLI (`fly secrets set`, `render env set`). Access via `process.env` in the container.
        *   *Supabase:* Manage API keys/secrets within the Supabase project dashboard settings. Use separate projects for staging/prod for better isolation.
    *   **Security**: Never commit `.env` files or secrets directly to version control. Use `.gitignore`. *Reiterate: The `SUPABASE_SERVICE_ROLE_KEY` and any other sensitive secrets must *only* be configured in the secure environment variable settings of the backend API (Vercel) and the Conversion Service (Container Platform). They must **never** be included in frontend code or committed to Git.*
    *   *Strongly consider using separate Supabase projects for staging and production environments to ensure complete isolation.*

*   **CI/CD (Continuous Integration/Continuous Deployment)**:
    *   **Source Control**: Use Git (e.g., GitHub, GitLab). Enforce PR reviews before merging to `develop` and `main`.
    *   **Automation Platform**: **GitHub Actions** (or GitLab CI). Provides flexibility for multi-step builds, tests, and deployments, including handling the separate conversion service. Vercel's built-in CI/CD handles the frontend/API deployment seamlessly when linked to the repo.
    *   **Example GitHub Actions Workflow (`.github/workflows/deploy.yml`)**:
        *   **Trigger:** On push to `main` (for production) and `develop` (for staging).
        *   **Jobs:**
            1.  **Lint & Format Check:** Run linters (e.g., ESLint) and formatters (e.g., Prettier --check). Fail if checks fail.
            2.  **Unit & Integration Tests:** Run backend and frontend unit/integration tests (e.g., `npm test`). Fail if tests fail.
            3.  **Build Frontend & API:** Run `npm run build` for the Vercel project. (Vercel handles the actual deployment based on repo connection).
            4.  **Build & Push Conversion Service Docker Image (Conditional):**
                *   Only run if changes detected in the conversion service directory (using path filters).
                *   Log in to Docker registry (e.g., GitHub Container Registry).
                *   Build the Docker image using the `Dockerfile`.
                *   Tag the image appropriately (e.g., with Git SHA, branch name).
                *   Push the image to the registry.
            5.  **Deploy Conversion Service (Conditional):**
                *   Only run if the Docker image was pushed.
                *   Use platform CLI (e.g., `fly deploy`, `render deploy trigger`) or API calls to deploy the new image to the container host (staging or production based on trigger branch). Requires platform API keys/tokens stored as GitHub Secrets.
            6.  **Apply Supabase Migrations (Careful Handling Needed):**
                *   **Staging:** Can be automated. Use Supabase CLI (`supabase link --project-ref <staging_ref>`, `supabase migration up`) with staging project ref and access token stored as GitHub Secrets.
                *   **Production:** **Recommendation:** Trigger manually or via a manual approval step in the workflow for safety. Use Supabase CLI (`supabase link --project-ref <prod_ref>`, `supabase migration up`) with production project ref and access token. Consider using migration tools that support review/dry-run features. Alternatively, use the `supabase-mcp` tool `apply_migration` if suitable for the workflow.
            7.  **(Optional) E2E Tests:** Trigger E2E tests (Cypress/Playwright) against the deployed staging environment after a successful staging deployment.
        *   **Secrets:** Store all sensitive keys (Supabase tokens, Docker registry credentials, container host API keys) as encrypted Secrets in GitHub repository settings.

*   **Backup & Recovery**:
    *   **Supabase Backups:** Supabase performs automated daily backups. Understand the retention period (e.g., 7 days on free/pro tiers). Backups include the database but not Storage objects (ensure important original files are backed up elsewhere if needed, though Supabase Storage is durable).
    *   **Point-in-Time Recovery (PITR):** Available on higher Supabase plans (e.g., Team/Enterprise). Allows restoring the database to any specific second within the retention window (e.g., last 7 days). Essential for recovering from accidental data deletion/corruption with minimal data loss.
    *   **Recovery Strategy:** Define steps for recovery:
        1.  Identify issue and time of occurrence.
        2.  Contact Supabase support or use dashboard/CLI for restore (PITR if available, otherwise daily backup).
        3.  Restore to a *new* Supabase instance/project initially to verify data.
        4.  Plan downtime or read-only mode for production application.
        5.  Perform the restore on the production instance (or repoint application to the restored instance).
        6.  Verify data and application functionality.
        *   *Regularly test the restore process* (e.g., quarterly) to ensure it works and the team is familiar with it.

*   **Monitoring & Alerting**:
    *   **Tools:**
        *   *Frontend:* Vercel Analytics (Real Experience Score, Web Vitals), Sentry (Error Tracking, Performance Monitoring), Browser DevTools.
        *   *Backend API (Vercel):* Vercel Logs (Function invocations, errors), Sentry (Error Tracking). Consider external uptime monitoring (e.g., UptimeRobot, Better Stack).
        *   *Conversion Service (Container):* Platform-specific monitoring (Fly Metrics, Render Metrics - CPU, Memory, Restarts), Application-level logging (Pino logs forwarded to a log aggregation service like Datadog, Logtail, or platform's logging), Sentry (Error Tracking).
        *   *Supabase:* Supabase Dashboard (API usage, query performance insights, logs). Consider external Postgres monitoring tools if needed for deep dives (requires direct DB connection setup).
    *   **Key Alert Conditions:**
        *   High rate of 5xx server errors (API, Conversion Service).
        *   High rate of 4xx client errors (indicative of potential frontend bugs or abuse).
        *   High frontend error rate (Sentry).
        *   Significant drop in Web Vitals (LCP, CLS, INP/FID).
        *   Conversion Service high CPU/Memory usage or frequent restarts.
        *   Supabase high database CPU/IO usage.
        *   Webhook endpoint failures (monitor via logs/Sentry and potentially Stripe dashboard).
        *   SSL certificate expiry.
        *   Billing failures (monitor Stripe dashboard/events).
    *   Configure alerts via chosen tools (Sentry rules, platform alerts, UptimeRobot checks) to notify the team (e.g., via Slack, PagerDuty, Email).

**Deployment Targets (Vercel Focused)**:

1.  **Supabase**:
    *   **Hosting**: Handled by Supabase (managed service). Select appropriate region close to users/backend.
    *   **Deployment (Schema Management):**
        *   Use Supabase CLI and Migrations (`supabase/migrations` directory in Git).
        *   **Local Development:** `supabase migration new <migration_name>` -> Edit SQL file -> `supabase db reset` (applies all migrations locally).
        *   **Staging Deployment (CI/CD):** `supabase link --project-ref <staging_ref>` -> `supabase migration up`. Ensure `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` (if needed for direct connection) are available as secrets.
        *   **Production Deployment (Manual/Approved CI/CD):** `supabase link --project-ref <prod_ref>` -> `supabase migration up`. **Crucial:** Review migrations carefully before applying to production. Consider tools/strategies for zero-downtime migrations if needed later.
        *   **Management API:** For programmatic changes beyond schema (e.g., enabling extensions, managing auth providers), explore using the Supabase Management API via scripts or tools like Terraform.
    *   **Environment Variables**: Manage API keys (anon, service_role), JWT secret, and other secrets directly in the Supabase project dashboard settings. Use separate projects for staging/prod.
    *   *Consider using Infrastructure as Code (IaC) tools like Terraform (with the Supabase provider) to manage Supabase resources (projects, roles, buckets, auth providers, potentially even schema via SQL execution) programmatically for better consistency and repeatability, especially if managing multiple environments.*

2.  **Next.js Application (Frontend UI & API Routes)**:
    *   **Platform**: **Vercel**. Optimized hosting for Next.js applications.
    *   **Setup**: Create a Vercel project linked to the Git repository containing the Next.js app. Vercel automatically detects Next.js.
    *   **Build Command**: Vercel typically uses `next build`.
    *   **Output Directory**: Vercel handles the `.next` directory automatically.
    *   **CI/CD**: Vercel automatically builds and deploys the Next.js app (including UI, Server Components, and API Route Handlers) on pushes to connected branches (`main` for production, `develop` for previews/staging).
    *   **Configuration (`next.config.js` / `vercel.json`):** Use `next.config.js` for Next.js specific settings. Use `vercel.json` only if needed for advanced Vercel platform configurations (e.g., complex rewrites, headers) beyond what Next.js handles.
    *   **Environment Variables**: Configure all necessary variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `CONVERSION_SERVICE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) in Vercel project settings (Production, Preview, Development scopes). Remember the `NEXT_PUBLIC_` prefix for client-side accessible variables.

4.  **Conversion Service (Node.js + Assimp - *Separate Deployment*)**:
    *   **Platform**: **Container Platform (e.g., Fly.io, Render)** using Docker.
    *   **Repository**: Can be a separate Git repository or a monorepo setup (e.g., using `pnpm workspaces` or `yarn workspaces`) with separate deployment configurations.
    *   **Dockerfile (Example Structure)**:
        ```dockerfile
        # Use an appropriate Node.js base image (e.g., LTS version on Debian/Ubuntu)
        FROM node:18-slim

        # Set working directory
        WORKDIR /app

        # Install OS dependencies including Assimp
        # Adjust package names based on the base image (Debian/Ubuntu example)
        RUN apt-get update && apt-get install -y --no-install-recommends \
            assimp-utils \
            # Add any other required OS libraries (e.g., build-essential if native modules need compiling)
            && rm -rf /var/lib/apt/lists/*

        # Copy package.json and package-lock.json (or yarn.lock)
        COPY package*.json ./

        # Install Node.js dependencies
        # Use --production if build dependencies aren't needed in the final image
        RUN npm install --production

        # Copy application code
        COPY . .

        # Expose the port the service listens on (if applicable)
        EXPOSE 3001

        # Command to run the service
        CMD [ "node", "server.js" ] # Or your entry point script
        ```
        *   *Optimize Docker image:* Use multi-stage builds, minimize layers, use `.dockerignore`.
    *   **CI/CD (GitHub Actions Example - see above):** Builds and pushes the image, then triggers deployment.
    *   **Deployment Commands (Examples):**
        *   *Fly.io:* `fly deploy --remote-only` (uses `fly.toml` config file).
        *   *Render:* Configure service in Render dashboard to deploy from registry on image push, or use `render deploy create ...` CLI command / API call.
    *   **Environment Variables**: Configure Supabase credentials, etc., securely within the chosen container platform's settings.
    *   *Implement a health check endpoint (e.g., `/healthz`) within the service for the container platform to monitor its status.*

**Domain Names & DNS**:
*   Configure the primary custom domain (e.g., `app.furniview.com`) in Vercel. Point DNS records (A, CNAME) as instructed by Vercel.
*   Configure a subdomain (e.g., `converter.furniview.com`) or use the platform-provided URL for the separate conversion service. Point DNS records accordingly if using a custom subdomain. Ensure the main API (on Vercel) uses the correct URL to reach the conversion service.
