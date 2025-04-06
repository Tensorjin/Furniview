const express = require('express');
const multer = require('multer');
const { getServiceSupabase } = require('../utils/supabaseClient');
const { convertToGltf } = require('../utils/converter'); // Import the converter function

const router = express.Router();

// Configure Multer for memory storage (we'll upload buffer directly to Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/upload - Handles file uploads
router.post('/', upload.single('furnitureFile'), async (req, res) => {
    // 'furnitureFile' should match the name attribute of the file input in the frontend form
    const file = req.file;
    // TODO: Get other form data like name, description, company_id (from auth later)
    // const { name, description } = req.body;
    // const companyId = req.user.id; // Example: Get from authenticated user

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    console.log('Received file:', file.originalname, file.mimetype, file.size);

    // Get company ID from authenticated user (attached by requireAuth middleware)
    const companyId = req.user.id;
    if (!companyId) {
        // This shouldn't happen if requireAuth is working, but good safety check
        return res.status(401).json({ error: 'Unauthorized: User ID not found after authentication.' });
    }
    console.log('Upload initiated by company ID:', companyId);

    const fileName = `${companyId}/${Date.now()}-${file.originalname}`;
    const bucketName = 'original-files';

    try {
        const supabase = getServiceSupabase(); // Get Supabase client with service role

        // 1. Upload original file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false // Don't overwrite existing files (optional)
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            throw new Error(`Storage error: ${uploadError.message}`);
        }

        console.log('Supabase upload successful:', uploadData);
        const originalFilePath = uploadData.path; // Path within the bucket

        // 2. Insert record into the 'furniture' table
        const { data: insertData, error: insertError } = await supabase
            .from('furniture')
            .insert([
                {
                    // TODO: Get name/description from request body
                    name: req.body.name || file.originalname, // Use filename as default name for now
                    description: req.body.description || null,
                    company_id: companyId, // Use placeholder/auth ID
                    original_file_path: originalFilePath,
                    file_type: file.mimetype, // Store the MIME type
                    status: 'uploaded' // Initial status
                    // gltf_file_path will be updated later by the conversion process
                }
            ])
            .select(); // Return the inserted record

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            // Attempt to delete the uploaded file if DB insert fails
            await supabase.storage.from(bucketName).remove([originalFilePath]);
            console.log('Rolled back storage upload due to DB error.');
            throw new Error(`Database error: ${insertError.message}`);
        }

        console.log('Database insert successful:', insertData);
        const newRecord = insertData[0];

        // Trigger conversion process asynchronously (don't wait for it)
        // Check if the uploaded file seems like a 3D model type before triggering
        // Basic check based on common extensions - might need refinement
        const is3dModel = /\.(stl|obj|fbx|glb|gltf)$/i.test(file.originalname); // Added glb/gltf just in case

        if (is3dModel) {
             console.log(`Triggering conversion for ${originalFilePath} (Record ID: ${newRecord.id})`);
             convertToGltf(originalFilePath, newRecord.id)
                 .then(() => {
                     console.log(`Conversion process initiated successfully for ${newRecord.id}`);
                 })
                 .catch(conversionError => {
                     // Logging the error is handled within convertToGltf, including updating status
                     console.error(`Conversion process initiation failed for ${newRecord.id}:`, conversionError.message);
                     // No need to update status here, converter handles it
                 });
        } else {
            console.log(`Skipping conversion for non-3D file type: ${file.originalname}`);
            // Optionally update status to 'skipped' or similar if needed
            // await supabase.from('furniture').update({ status: 'skipped_conversion' }).eq('id', newRecord.id);
        }


        res.status(201).json({
            message: 'File upload accepted, processing initiated.', // Changed message slightly
            furnitureRecord: newRecord // Send back the created record
        });

    } catch (error) {
        console.error('Upload process failed:', error);
        res.status(500).json({ error: `Upload failed: ${error.message}` });
    }
});

module.exports = router;
