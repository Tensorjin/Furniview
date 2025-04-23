const { supabase } = require('../utils/supabaseClient'); // Import Supabase client from utility file

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Supabase signup error:', error.message);
            // Check for specific errors if needed (e.g., user already registered)
            if (error.message.includes("User already registered")) {
                 return res.status(409).json({ message: "User already registered with this email." });
            }
            return res.status(400).json({ message: error.message || 'Signup failed.' });
        }

        // Note: Supabase might require email confirmation depending on project settings.
        // The 'data' object contains user and session info if signup is successful and auto-confirmation is enabled.
        // If confirmation is required, data.user will exist but data.session might be null.
        console.log('Signup successful (check email confirmation if enabled):', data.user?.id);
        res.status(201).json({ message: 'Signup successful. Check email for confirmation if required.', userId: data.user?.id });

    } catch (err) {
        console.error('Server error during signup:', err);
        res.status(500).json({ message: 'Internal server error during signup.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Supabase login error:', error.message);
             // Check for specific errors like invalid login credentials
            if (error.message.includes("Invalid login credentials")) {
                return res.status(401).json({ message: "Invalid login credentials." });
            }
            return res.status(401).json({ message: error.message || 'Login failed.' });
        }

        // Login successful, session data is in 'data.session'
        console.log('Login successful for user:', data.user?.id);
        res.status(200).json({ message: 'Login successful.', session: data.session, user: data.user });

    } catch (err) {
        console.error('Server error during login:', err);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
};

exports.logout = async (req, res) => {
    // Note: Supabase client-side handles JWT invalidation primarily.
    // This backend endpoint is useful if we need to perform server-side actions on logout.
    // For now, it just confirms the intention. A proper implementation might need the JWT.
    try {
        // If using server-side sessions or needing explicit invalidation, add logic here.
        // For basic JWT, the client just needs to discard the token.
        // const { error } = await supabase.auth.signOut(); // This might require the user's token if called server-side securely

        // if (error) {
        //     console.error('Supabase logout error:', error.message);
        //     return res.status(400).json({ message: error.message || 'Logout failed.' });
        // }

        console.log('Logout request received.');
        res.status(200).json({ message: 'Logout successful (client should clear token).' });

    } catch (err) {
        console.error('Server error during logout:', err);
        res.status(500).json({ message: 'Internal server error during logout.' });
    }
};
