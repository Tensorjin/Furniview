const express = require('express');
const { getServiceSupabase } = require('../utils/supabaseClient');
const { requireAuth } = require('../middleware/authMiddleware'); // To protect the route

const router = express.Router();

// POST /api/companies - Create a company profile for the logged-in user
// This route MUST be protected by requireAuth middleware
router.post('/', requireAuth, async (req, res) => {
    const { companyName } = req.body;
    const userId = req.user.id; // Get user ID from the authenticated request (added by middleware)

    if (!companyName) {
        return res.status(400).json({ error: 'Company name is required.' });
    }
    if (!userId) {
        // Should not happen if requireAuth is working correctly
        return res.status(401).json({ error: 'Unauthorized: User ID not found.' });
    }

    const supabase = getServiceSupabase(); // Use service client for DB operations

    try {
        // Check if a company profile already exists for this user ID
        const { data: existingCompany, error: checkError } = await supabase
            .from('companies')
            .select('id')
            .eq('id', userId)
            .maybeSingle(); // Expect 0 or 1 result

        if (checkError) {
            console.error('Error checking for existing company:', checkError);
            throw new Error(`Database error: ${checkError.message}`);
        }

        if (existingCompany) {
            return res.status(409).json({ error: 'Company profile already exists for this user.' });
        }

        // Create the new company profile, linking it to the auth user ID
        const { data: newCompany, error: insertError } = await supabase
            .from('companies')
            .insert({
                id: userId, // Use the auth user ID as the company ID (primary key)
                name: companyName
            })
            .select()
            .single(); // Expecting a single row back

        if (insertError) {
            console.error('Error creating company profile:', insertError);
            throw new Error(`Database error: Failed to create company profile. ${insertError.message}`);
        }

        console.log('Company profile created successfully for user:', userId);
        res.status(201).json({
            message: 'Company profile created successfully.',
            company: newCompany
        });

    } catch (error) {
        console.error('Failed to create company profile:', error);
        res.status(500).json({ error: `Failed to create company profile: ${error.message}` });
    }
});

// Optional: GET endpoint to fetch the current user's company profile
router.get('/me', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const supabase = getServiceSupabase(); // Or anon if RLS allows user to read own company

     try {
        const { data: company, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', userId)
            .single(); // Expect exactly one result

        if (error) {
             if (error.code === 'PGRST116') { // Code for "Not found" when using .single()
                 return res.status(404).json({ error: 'Company profile not found for this user.' });
             }
            console.error('Error fetching company profile:', error);
            throw new Error(`Database error: ${error.message}`);
        }

         res.status(200).json(company);

     } catch (error) {
         console.error('Failed to fetch company profile:', error);
         res.status(500).json({ error: `Failed to fetch company profile: ${error.message}` });
     }
});


module.exports = router;
