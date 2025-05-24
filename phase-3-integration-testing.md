# Phase 3: Integration and Testing

**Purpose**: Ensure the frontend and backend work together seamlessly, validate the end-to-end user flows, confirm error handling works as expected, and check compatibility across devices.

**Key Tasks**:

1.  **API Integration Testing**:
    *   Verify frontend calls backend endpoints with correct methods (GET, POST, PUT, DELETE) and paths.
    *   **Test Data Formats:**
        *   *Request:* Ensure `Content-Type` headers are correct (e.g., `application/json`, `multipart/form-data`). Validate structure of JSON bodies and form data fields against backend expectations.
        *   *Response:* Validate structure of JSON responses (e.g., presence of expected fields like `id`, `name`, `status`, `error.code`). Check data types. Ensure correct HTTP status codes are returned for success (200, 201, 204) and errors (4xx, 5xx).
    *   **Test Authentication Flows:**
        *   Verify `Authorization: Bearer <token>` header is sent on protected routes.
        *   Test requests with missing, invalid, or expired tokens – expect 401 Unauthorized.
        *   Test login/signup endpoints with valid/invalid credentials.
    *   **Test Authorization (RLS):**
        *   Log in as User A (Company A), attempt to GET/PUT/DELETE furniture belonging to User B (Company B) – expect 403 Forbidden or 404 Not Found (depending on policy/implementation).
        *   Verify users can only list furniture belonging to their own company.
    *   *Consider using contract testing (e.g., Pact) to ensure frontend/backend API expectations remain aligned, especially if developed in parallel.* Define contracts for key API interactions.

2.  **End-to-End (E2E) User Flow Testing**:
    *   **Goal:** Simulate real user interactions from start to finish across the integrated frontend and backend.
    *   **Tools:** Use automated E2E testing frameworks like **Cypress** or **Playwright**. Integrate tests into the CI/CD pipeline to run against a staging environment.
    *   **Company Flow Scenarios (Examples):**
        *   *Happy Path:* Register new company -> Log in -> Upload valid model -> Verify status changes (UI updates via Realtime/polling) -> See item in list -> Rename item -> Delete item -> Log out.
        *   *Upload Errors:* Attempt upload of unsupported format -> Verify 'error' status and specific message. Attempt upload exceeding size limit -> Verify rejection/error message. Attempt upload with network interruption -> Verify graceful failure/retry mechanism (if any).
        *   *Authentication:* Attempt access to dashboard before login -> Verify redirect to login. Test password reset flow (if implemented).
    *   **End User Flow Scenarios (Examples):**
        *   *Happy Path:* Navigate to public browse page -> Search/filter items -> Select a 'ready' item -> Verify 3D viewer loads correctly -> Interact with viewer controls (zoom, rotate).
        *   *Edge Cases:* Attempt to access viewer URL for an item not in 'ready' state -> Verify appropriate handling (e.g., "Not Found" or "Processing" message). Test viewer with potentially problematic (but valid) GLTF files.
    *   *Implement automated E2E tests covering these key flows and edge cases.*
        *   *(Example Cypress Test Snippet Idea):*
          ```javascript
          // cypress/e2e/upload.cy.js
          it('allows a company user to upload a valid model', () => {
            cy.loginAsCompanyUser('test@company.com', 'password'); // Custom command
            cy.visit('/dashboard');
            cy.get('[data-cy="upload-input"]').selectFile('path/to/valid-model.obj');
            cy.get('[data-cy="upload-button"]').click();
            cy.contains('[data-cy="furniture-list-item"]', 'valid-model.obj')
              .should('contain.text', 'Processing', { timeout: 10000 }); // Wait for initial status
            cy.contains('[data-cy="furniture-list-item"]', 'valid-model.obj')
              .should('contain.text', 'Ready', { timeout: 60000 }); // Wait for conversion
          });
          ```

3.  **Comprehensive Error Handling Testing**:
    *   **Backend Scenarios:** Simulate database timeouts during queries, trigger Assimp conversion errors with specific invalid model data, simulate Supabase storage failures (e.g., bucket permissions issues, network errors during upload/download to storage), test API behavior with malformed JSON requests, test concurrent requests that might cause race conditions. Verify correct HTTP status codes and structured error responses (`error.code`, `error.message`). Check server logs for detailed error information and context.
    *   **Frontend Scenarios:** Simulate API errors (using browser dev tools, mocking tools like MSW, or specific test flags) returning 4xx/5xx status codes and various error structures. Verify UI displays user-friendly messages and handles state gracefully (e.g., disables buttons, shows error notifications, clears loading states). Test behavior during network loss (offline mode if applicable, graceful failure otherwise). Test UI response to unexpected data formats from the API. Test React Error Boundaries around critical components (like the 3D viewer).
    *   **3D Viewer:** Test loading invalid GLTF URLs, corrupt GLTF files, or files that trigger GLTFLoader errors. Ensure the viewer displays a fallback or error state correctly within its Error Boundary.

4.  **Device and Browser Compatibility Testing**:
    *   **Target Environments:**
        *   *Browsers:* Latest stable versions of Chrome, Firefox, Safari (macOS/iOS), Edge.
        *   *Operating Systems:* Windows (latest), macOS (latest), iOS (latest), Android (recent popular versions, e.g., last 2-3 major versions).
        *   *Devices:* Representative sample including Desktop (various resolutions, e.g., 1080p, 1440p), Laptop (common resolutions), Tablet (iPad Air/Pro, common Android Tablet), Smartphone (recent iPhone, popular Android models like Pixel/Samsung Galaxy).
    *   Focus testing on WebGL compatibility and performance for the 3D viewer across these environments.
    *   Use browser developer tools and potentially cross-browser testing services (e.g., BrowserStack, Sauce Labs) if needed.
    *   Check for responsive design issues (layout breaks, usability on small screens) and performance bottlenecks on lower-end devices.

5.  **Performance Goals & Testing** (Optional for MVP, Recommended Later):
    *   *Define specific, measurable performance goals early (e.g., API response time p95 < 500ms under expected load, database query time p95 < 50ms, 3D model load time < 5s for average model size, viewer FPS > 30 during interaction).*
    *   **Tools & Metrics:**
        *   *Frontend:* Use Lighthouse (target scores > 90 for Performance, Accessibility, Best Practices, SEO), Browser DevTools (Network analysis for asset sizes/load times, Performance tab profiling for rendering/scripting bottlenecks), WebPageTest. Track Core Web Vitals (LCP, FID/INP, CLS).
        *   *Backend:* Use load testing tools (e.g., k6, Grafana Cloud k6, ApacheBench) targeting key API endpoints (`/api/furniture`, `/api/furniture/upload`). Monitor Supabase dashboard for query performance and resource usage.
        *   *3D Viewer:* Measure model load times, monitor frame rate (FPS) during interaction using browser dev tools or `stats.js`.
    *   Assess frontend load times, backend API response times under normal load, and viewer performance.
    *   Consider basic load testing on critical endpoints (upload, list, view) to identify bottlenecks before production launch.

6.  **Security Testing**:
    *   **Rigorously test RLS Policies:**
        *   *Test Cases:* Verify policies for different user roles (company owner vs. public viewer). Test access attempts across different companies. Test edge cases (e.g., user changing companies if applicable). Verify public access policy only allows reading 'ready' items. Test access with invalid/anonymous user credentials.
    *   **Penetration Testing Focus:** Target OWASP Top 10 vulnerabilities, specifically: Injection (test all API inputs), Broken Authentication (session management, password policies), Sensitive Data Exposure (check API responses for excessive data), Security Misconfiguration (Supabase settings, CORS headers, bucket policies), Cross-Site Scripting (XSS - ensure user-provided names/metadata are properly sanitized/encoded on display).
    *   **Storage Bucket Policies:** Manually review and test Supabase Storage bucket policies via API calls/frontend actions to ensure `raw-models` requires authenticated uploads and `gltf-models` has the intended read access (e.g., public or requires signed URLs).
    *   Ensure environment variables and secrets (`VITE_` vars, API keys) are not exposed in frontend bundles (check build output).
    *   *Integrate automated dependency vulnerability scanning (e.g., `npm audit`, Snyk) into the CI/CD pipeline.*
    *   *Perform basic penetration testing exercises targeting common vulnerabilities (OWASP Top 10) before major releases.*
    *   *Validate secure configuration of Supabase Storage buckets (permissions, access controls).*

7.  **Billing Flow Testing (Phase 2.5 Integration):**
    *   **Goal:** Verify the end-to-end subscription and payment flows integrated with Stripe.
    *   **Tools:** Stripe Test Mode, Stripe CLI (for triggering webhooks locally, e.g., `stripe trigger checkout.session.completed --add checkout_session:customer=cus_xyz ...`), Stripe test card numbers.
    *   **Scenarios:**
        *   *Subscription Lifecycle:* Test new subscription purchase for each tier. Test upgrade/downgrade flows. Test cancellation (immediate and at period end).
        *   *Webhook Handling:* Use Stripe CLI or dashboard events to trigger all relevant webhook types (`checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`). Verify database records (`subscriptions`, `companies`) are updated correctly and idempotency works (triggering the same event twice has no adverse effect).
        *   *Limit Enforcement:* Test uploading furniture items before subscribing (expect 403/402 error). Subscribe to a tier. Upload items up to the limit. Attempt to upload one more item (expect 402 error). Upgrade plan. Verify upload is now allowed.
        *   *Stripe Billing Portal:* Test accessing the portal via the frontend link. Test updating payment methods. Test canceling subscription via the portal and verify webhook updates the database.
        *   *Failed Payments:* Simulate failed payments using Stripe test cards (e.g., card declined). Verify `status` updates (`past_due`, `incomplete`) and any user notifications triggered.
        *   *Trial Periods (if applicable):* Test subscription creation with a trial. Verify status is 'trialing' and `current_period_end` reflects trial end. Test behavior after trial ends (successful payment -> 'active', failed payment -> appropriate status).
