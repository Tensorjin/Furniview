const express = require('express');
const { getAnonSupabase, getServiceSupabase } = require('../utils/supabaseClient'); // Use anon for signup/login

const router = express.Router();

// POST /api/auth/signup - Register a new user (company)
router.post('/signup', async (req, res) => {
    const { email, password, companyName } = req.body;

    if (!email || !password || !companyName) {
        return res.status(400).json({ error: 'Email, password, and company name are required.' });
    }

    const supabase = getAnonSupabase(); // Use anon client for signup

    try {
        // 1. Sign up the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // You can add additional user metadata here if needed
                // data: { company_name: companyName } // Store company name in auth metadata
            }
        });

        if (authError) {
            console.error('Supabase signup error:', authError);
            // Provide more specific feedback if possible
            if (authError.message.includes('User already registered')) {
                 return res.status(409).json({ error: 'User already registered with this email.' });
            }
            throw new Error(`Authentication error: ${authError.message}`);
        }

        if (!authData.user) {
             throw new Error('Signup completed but no user data returned.');
        }

        console.log('Supabase signup successful:', authData.user.id);
        const userId = authData.user.id;

        // 2. Create a corresponding record in the 'companies' table using the service client
        // This links the auth user to a company profile
        const serviceSupabase = getServiceSupabase();
        const { data: companyData, error: companyError } = await serviceSupabase
            .from('companies')
            .insert({
                id: userId, // Use the auth user ID as the company ID (primary key)
                name: companyName
            })
            .select()
            .single(); // Expecting a single row back

        if (companyError) {
            console.error('Failed to create company profile after signup:', companyError);
            // Optional: Attempt to delete the newly created auth user for cleanup
            // await serviceSupabase.auth.admin.deleteUser(userId);
            // console.warn(`Deleted auth user ${userId} due to company profile creation failure.`);
            throw new Error(`Database error: Failed to create company profile. ${companyError.message}`);
        }

        console.log('Company profile created:', companyData);

        // Note: Supabase might require email confirmation depending on project settings.
        // The response here assumes immediate signup or handles confirmation flow on the frontend.
        res.status(201).json({
            message: 'Signup successful. Please check your email for confirmation if required.',
            user: authData.user, // Send back user info (excluding sensitive details)
            company: companyData
        });

    } catch (error) {
        console.error('Signup process failed:', error);
        res.status(500).json({ error: `Signup failed: ${error.message}` });
    }
});

// POST /api/auth/login - Log in a user
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
