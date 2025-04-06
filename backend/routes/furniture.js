const express = require('express');
const { getAnonSupabase } = require('../utils/supabaseClient'); // Use anon client for public reads

const router = express.Router();

// GET /api/furniture - List available furniture (only those successfully converted)
router.get('/', async (req, res) => {
    try {
        const supabase = getAnonSupabase();
        // Select only necessary fields for listing, filter by status 'converted'
        // Add ordering, e.g., by creation date
        const { data, error } = await supabase
            .from('furniture')
            .select('id, name, description, created_at, gltf_file_path') // Only fetch needed fields
            .eq('status', 'converted') // Only show successfully converted items
            .order('created_at', { ascending: false }); // Show newest first

        if (error) {
            console.error('Supabase furniture list error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        // Construct full URLs for GLTF files
        const furnitureList = data.map(item => {
            let gltfUrl = null;
            if (item.gltf_file_path) {
                // Construct the public URL for the GLTF file
                const { data: urlData } = supabase
                    .storage
                    .from('gltf-files') // Bucket name
                    .getPublicUrl(item.gltf_file_path); // Path within bucket
                gltfUrl = urlData?.publicUrl;
            }
            return {
                ...item,
                gltf_url: gltfUrl // Add the full public URL
            };
        });


        res.status(200).json(furnitureList);

    } catch (error) {
        console.error('Failed to fetch furniture list:', error);
        res.status(500).json({ error: `Failed to fetch furniture: ${error.message}` });
    }
});

// GET /api/furniture/:id - Get details for a specific furniture item
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Furniture ID is required.' });
    }

    try {
        const supabase = getAnonSupabase();
        // Fetch a single record by ID, ensure it's converted
        const { data, error } = await supabase
            .from('furniture')
            .select('id, name, description, created_at, gltf_file_path, status') // Select relevant fields
            .eq('id', id)
            .eq('status', 'converted') // Ensure it's ready to be viewed
            .maybeSingle(); // Expect 0 or 1 result

        if (error) {
            console.error(`Supabase furniture fetch error (ID: ${id}):`, error);
            throw new Error(`Database error: ${error.message}`);
        }

        if (!data) {
            return res.status(404).json({ error: `Furniture item with ID ${id} not found or not converted.` });
        }

        // Construct full URL for the GLTF file
        let gltfUrl = null;
        if (data.gltf_file_path) {
            const { data: urlData } = supabase
                .storage
                .from('gltf-files')
                .getPublicUrl(data.gltf_file_path);
            gltfUrl = urlData?.publicUrl;
        }

        res.status(200).json({
            ...data,
            gltf_url: gltfUrl
        });

    } catch (error) {
        console.error(`Failed to fetch furniture item (ID: ${id}):`, error);
        res.status(500).json({ error: `Failed to fetch furniture item: ${error.message}` });
    }
});


module.exports = router;
