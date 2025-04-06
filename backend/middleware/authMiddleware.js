const { getAnonSupabase } = require('../utils/supabaseClient'); // Use anon client to verify JWT

/**
 * Express middleware to verify Supabase JWT token.
 * If valid, attaches user information to req.user.
 * If invalid or missing, sends a 401 Unauthorized response.
 */
const requireAuth = async (req, res, next) => {
    const supabase = getAnonSupabase();

    // 1. Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Auth middleware: No Bearer token found in Authorization header.');
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token.' });
    }
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token using Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            console.warn('Auth middleware: Token verification failed.', error.message);
            // Differentiate between expired token and other errors if needed
            if (error.message.includes('invalid JWT') || error.message.includes('expired')) {
                 return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
            }
            throw error; // Rethrow other unexpected errors
        }

        if (!user) {
            console.warn('Auth middleware: Token valid but no user found.');
            return res.status(401).json({ error: 'Unauthorized: User not found for token.' });
        }

        // 3. Attach user information to the request object
        console.log('Auth middleware: User authenticated:', user.id, user.email);
        req.user = user; // Make user info available to subsequent route handlers

        // 4. Proceed to the next middleware or route handler
        next();

    } catch (error) {
        console.error('Auth middleware: Unexpected error during token verification:', error);
        return res.status(500).json({ error: 'Internal server error during authentication.' });
    }
};

module.exports = { requireAuth };
