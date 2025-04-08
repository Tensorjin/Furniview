const express = require('express');
const { getAnonSupabase, getServiceSupabase } = require('../utils/supabaseClient'); // Use anon for signup/login

const router = express.Router();

// POST /api/auth/login - Log in a user (Using Supabase client on frontend is preferred)
// This backend endpoint might become redundant if frontend handles login entirely via Supabase client.
// Keeping it for now as an alternative or for potential future server-side logic.
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const supabase = getAnonSupabase(); // Use anon client for login

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Supabase login error:', error);
             if (error.message.includes('Invalid login credentials')) {
                 return res.status(401).json({ error: 'Invalid login credentials.' });
             }
            throw new Error(`Authentication error: ${error.message}`);
        }

        console.log('Login successful for user:', data.user.id);
        // The session (including JWT) is automatically handled by the Supabase client library
        // on the frontend. Here, we just confirm success and send back user/session info.
        res.status(200).json({
            message: 'Login successful.',
            user: data.user,
            session: data.session
        });

    } catch (error) {
        console.error('Login process failed:', error);
        res.status(500).json({ error: `Login failed: ${error.message}` });
    }
});


// TODO: Add /logout endpoint if needed (typically handled client-side with Supabase)

module.exports = router;
