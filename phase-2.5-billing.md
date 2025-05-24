# Phase 2.5: Billing Integration (Stripe)

**Purpose**: Implement the subscription management and payment processing functionality using Stripe to handle the tiered pricing model and premium add-ons defined in the business plan.

**Prerequisites**: Core backend API structure (Phase 1) and basic frontend structure/authentication (Phase 2) should be in place.

**Recommended Tools**:
- **Payment Provider**: Stripe
- **Backend**: Node.js/Express, `@stripe/stripe-node` library
- **Frontend**: React, `@stripe/stripe-js`, `@stripe/react-stripe-js` libraries

**Key Tasks**:

1.  **Stripe Account Setup**:
    *   Create a Stripe account and activate it (or use test mode initially).
    *   **Configure Products & Prices in Stripe Dashboard**:
        *   Create a distinct Stripe "Product" for each subscription tier (e.g., "Furniview Small", "Furniview Medium").
        *   For each Product, create one or more "Prices". For standard subscriptions, these will be **recurring** (e.g., monthly or yearly). Ensure the currency is set correctly. Record the Price ID (e.g., `price_123abc...`) for each tier – these will be used by the frontend/backend.
        *   For premium add-ons, decide if they are recurring (e.g., custom branding per month) or one-time charges. Create separate Products/Prices accordingly. One-time charges might be handled differently in the checkout flow (e.g., using `line_items` with `mode: 'payment'`) compared to subscriptions (`mode: 'subscription'`). *Initial focus should be on core subscription tiers.*
    *   **Configure Stripe Billing Customer Portal**:
        *   Navigate to Billing settings -> Customer portal in Stripe dashboard.
        *   Configure allowed actions (e.g., update payment methods, view invoices, update/cancel subscriptions).
        *   Set redirect URLs (back to your application).
        *   Note: Accessing the portal requires a `stripe_customer_id`.
    *   Obtain Stripe API keys (Publishable Key `pk_test_...` / `pk_live_...` for frontend, Secret Key `sk_test_...` / `sk_live_...` for backend). Store the Secret Key securely as a backend environment variable (e.g., `STRIPE_SECRET_KEY`). **Never expose the Secret Key.**

2.  **Backend Development (Extending Phase 1)**:
    *   **Database Schema Updates**:
        *   **Recommendation:** Use a dedicated `subscriptions` table linked to `companies` for better organization.
        *   Example `subscriptions` table schema:
            *   `id` (UUID, PK, default `gen_random_uuid()`)
            *   `company_id` (UUID, FK to `companies.id`, not nullable)
            *   `stripe_subscription_id` (TEXT, unique, not nullable)
            *   `stripe_customer_id` (TEXT, not nullable)
            *   `stripe_price_id` (TEXT, not nullable)
            *   `status` (TEXT, not nullable, e.g., 'trialing', 'active', 'past_due', 'canceled', 'incomplete')
            *   `current_period_end` (TIMESTAMP WITH TIME ZONE, not nullable)
            *   `cancel_at_period_end` (BOOLEAN, default false)
            *   `created_at` (TIMESTAMPTZ, default `now()`)
            *   `updated_at` (TIMESTAMPTZ, default `now()`)
        *   Modify the `companies` table to add `stripe_customer_id` (TEXT, nullable, unique).
        *   Apply schema changes using Supabase Migrations.
    *   **Install Stripe SDK**: `npm install @stripe/stripe-node` (Ensure backend Node.js version is compatible). Initialize the Stripe client in your backend with the Secret Key: `const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);`
    *   **API Endpoints**: Create new secured endpoints in the Express API (ensure authentication middleware is applied):
        *   **`POST /api/billing/create-checkout-session`**:
            *   **Request Body Example:** `{ "priceId": "price_123abc...", "quantity": 1 }` (Price ID selected by user on frontend).
            *   **Logic:**
                1.  Get authenticated user ID (`auth.uid()`) and associated `company_id`.
                2.  Retrieve the company's `stripe_customer_id` from your database.
                3.  If no `stripe_customer_id` exists:
                    *   Create a new Stripe Customer: `stripe.customers.create({ email: user.email, metadata: { company_id: company.id } })`.
                    *   Save the new `stripe_customer_id` to your `companies` table.
                4.  Create a Stripe Checkout Session:
                    ```javascript
                    const session = await stripe.checkout.sessions.create({
                      payment_method_types: ['card'],
                      mode: 'subscription', // Use 'payment' for one-time charges
                      customer: stripeCustomerId, // Use the retrieved/created customer ID
                      line_items: [{ price: req.body.priceId, quantity: req.body.quantity }],
                      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`, // Redirect back to your app
                      cancel_url: `${process.env.FRONTEND_URL}/pricing`, // Redirect if user cancels
                      // Optional: Allow promo codes, set trial periods, etc.
                      // subscription_data: { trial_period_days: 14 }
                    });
                    ```
                5.  Return the `session.id` to the frontend.
            *   **Response Body Example (Success - `200 OK`)**: `{ "sessionId": "cs_test_123..." }`
        *   **`POST /api/billing/create-portal-session`**:
            *   **Logic:**
                1.  Get authenticated user ID and associated `company_id`.
                2.  Retrieve the company's `stripe_customer_id` from your database.
                3.  If no `stripe_customer_id` exists, return an error (user needs an active subscription/customer record first).
                4.  Create a Stripe Billing Portal Session:
                    ```javascript
                    const portalSession = await stripe.billingPortal.sessions.create({
                      customer: stripeCustomerId,
                      return_url: `${process.env.FRONTEND_URL}/account`, // Where user returns after portal
                    });
                    ```
                5.  Return the `portalSession.url` to the frontend.
            *   **Response Body Example (Success - `200 OK`)**: `{ "url": "https://billing.stripe.com/session/..." }`
        *   (Optional) Endpoints to fetch current subscription details if needed directly by the frontend (though webhooks are preferred for state changes). Requires careful RLS/permissions.
    *   **Stripe Webhook Handler**:
        *   Create a dedicated endpoint (e.g., `/api/webhooks/stripe`). **Important:** Use `express.raw({ type: 'application/json' })` middleware *before* your JSON parsing middleware for this specific route, as Stripe requires the raw body for signature verification.
        *   **Mandatory Security:** Verify the `Stripe-Signature` header:
            ```javascript
            const sig = req.headers['stripe-signature'];
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
            let event;
            try {
              event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret); // req.body must be the raw buffer
            } catch (err) {
              console.log(`⚠️ Webhook signature verification failed.`, err.message);
              return res.sendStatus(400);
            }
            ```
        *   **Idempotency:** Before processing, check if `event.id` has been processed recently (e.g., check against a cache like Redis or a simple DB table of processed event IDs with a TTL). If already processed, return `200 OK` immediately.
        *   **Error Handling:** Wrap event handling logic in `try...catch`. Log errors thoroughly. For critical events like `checkout.session.completed`, consider adding to a retry queue if database updates fail. Set up alerting for persistent webhook failures.
        *   **Event Handling Logic (Example using switch statement):**
            ```javascript
            const data = event.data.object;
            switch (event.type) {
              case 'checkout.session.completed':
                // If mode is 'subscription', retrieve subscription details
                const subscription = await stripe.subscriptions.retrieve(data.subscription);
                // Create/update subscriptions record in DB
                // Store stripe_customer_id on companies record
                // Handle trial status if applicable
                break;
              case 'invoice.payment_succeeded':
                // If it's for a subscription renewal
                if (data.billing_reason === 'subscription_cycle') {
                  // Update subscription status and current_period_end in DB
                }
                break;
              case 'invoice.payment_failed':
                // Update subscription status in DB (e.g., 'past_due')
                // Optionally trigger notification to user
                break;
              case 'customer.subscription.updated':
                // Handle changes in plan, status, cancellation flags
                // Update corresponding fields in DB based on data object
                break;
              case 'customer.subscription.deleted': // Or handle via updated event with status 'canceled'
                // Update subscription status to 'canceled' in DB
                break;
              default:
                console.log(`Unhandled event type ${event.type}`);
            }
            // Store event.id as processed if using idempotency check
            ```
        *   Return `res.json({ received: true });` (or `res.sendStatus(200)`) quickly to Stripe *only after successful processing* or successful queueing for later processing.
    *   **Subscription Logic Integration (Limit Enforcement Example)**:
        *   Create Express middleware (e.g., `checkSubscriptionLimits`):
            ```javascript
            async function checkSubscriptionLimits(req, res, next) {
              const companyId = req.user.company_id; // Assuming user/company info attached by auth middleware
              // 1. Fetch active subscription from DB for companyId
              const { data: subscription, error: subError } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('company_id', companyId)
                .in('status', ['active', 'trialing']) // Check for active or trialing status
                .single();

              if (subError || !subscription) {
                return res.status(403).json({ error: { code: 'NO_ACTIVE_SUBSCRIPTION', message: 'No active subscription found.' } });
              }

              // 2. Define limits based on subscription.stripe_price_id
              const limits = getLimitsForPrice(subscription.stripe_price_id); // Helper function to get limits

              // 3. Fetch current usage (e.g., furniture count)
              const { count, error: countError } = await supabase
                .from('furniture')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', companyId);

              if (countError) {
                return res.status(500).json({ error: { code: 'USAGE_CHECK_FAILED', message: 'Failed to check usage.' } });
              }

              // 4. Compare usage against limits
              if (count >= limits.maxFurnitureItems) {
                return res.status(402).json({ error: { code: 'LIMIT_EXCEEDED', message: `Furniture limit (${limits.maxFurnitureItems}) reached. Please upgrade your plan.` } });
              }

              // 5. If checks pass, continue to the route handler
              next();
            }
            // Apply middleware to relevant routes:
            // app.post('/api/furniture/upload', authMiddleware, checkSubscriptionLimits, uploadHandler);
            ```

3.  **Frontend Development (Extending Phase 2)**:
    *   **Install Stripe Libraries**: `npm install @stripe/stripe-js @stripe/react-stripe-js`
    *   **UI Components**:
        *   `PricingPage.tsx`: Displays tiers fetched from backend or hardcoded (ensure Price IDs match Stripe). Includes buttons triggering checkout flow.
        *   `AccountSettingsPage.tsx`: Displays current subscription status (`active`, `trialing`, `past_due`), current period end date. Includes "Manage Billing" button.
    *   **API Integration & Stripe.js Usage**:
        *   Initialize Stripe.js once: `const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');`
        *   Wrap your application (or relevant parts) with `<Elements stripe={stripePromise}>`.
        *   **Checkout Button Handler Example**:
            ```typescript
            const handleSubscribeClick = async (priceId: string) => {
              setIsLoading(true);
              try {
                // Call your backend to create the checkout session
                const response = await apiClient.post('/api/billing/create-checkout-session', { priceId });
                const { sessionId } = response.data;

                // Redirect to Stripe Checkout
                const stripe = await stripePromise; // Get Stripe instance
                if (stripe) {
                  const { error } = await stripe.redirectToCheckout({ sessionId });
                  if (error) {
                    console.error("Stripe checkout error:", error);
                    // Handle error display to user
                  }
                }
              } catch (error) {
                console.error("Failed to create checkout session:", error);
                // Handle error display to user
              } finally {
                setIsLoading(false);
              }
            };
            ```
        *   **Manage Billing Button Handler Example**:
            ```typescript
            const handleManageBillingClick = async () => {
              setIsLoading(true);
              try {
                const response = await apiClient.post('/api/billing/create-portal-session');
                const { url } = response.data;
                window.location.href = url; // Redirect to Stripe Billing Portal
              } catch (error) {
                 console.error("Failed to create portal session:", error);
                 // Handle error display
              } finally {
                 setIsLoading(false);
              }
            };
            ```
    *   **Display Subscription Status**: Fetch user/company data which includes subscription details (populated by webhooks on the backend). *Note: Ensure the frontend UI reflects subscription changes promptly. Options:*
        *   *Refetch user/company data after returning from Stripe Checkout/Portal.*
        *   *Use Supabase Realtime listeners on the `subscriptions` table (requires careful setup and potentially exposing subscription data via Views/RPCs respecting RLS).*
        *   *Trigger a manual refresh option.*

4.  **Testing (Prepare for Phase 3)**:
    *   Use Stripe's test mode and test card numbers extensively.
    *   Use the Stripe CLI or tools like ngrok to test the webhook handler locally.
    *   Simulate various scenarios: new subscriptions, upgrades, downgrades, cancellations, failed payments.
    *   Verify that database records are updated correctly based on webhook events.
    *   Verify that feature access/limits are correctly enforced based on subscription status.
