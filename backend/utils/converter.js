const { exec } = require('child_process');
const fs = require('fs').promises; // Use promises version of fs
const path = require('path');
const os = require('os');
const { getServiceSupabase } = require('./supabaseClient');

const ORIGINAL_BUCKET = 'original-files';
const GLTF_BUCKET = 'gltf-files';

/**
 * Converts an uploaded 3D model file to GLTF format using Assimp.
 * Downloads the original, converts locally, uploads GLTF, updates DB.
 * @param {string} originalFilePathInBucket - The path of the original file in the Supabase bucket.
 * @param {string} furnitureRecordId - The UUID of the furniture record in the database.
 */
async function convertToGltf(originalFilePathInBucket, furnitureRecordId) {
    const supabase = getServiceSupabase();
    let tempInputDir = null;
    let tempInputPath = null;
    let tempOutputPath = null;
    const baseFileName = path.basename(originalFilePathInBucket);
    const gltfFileName = `${path.parse(baseFileName).name}.gltf`; // Output filename

    try {
        console.log(`[Converter] Starting conversion for record ${furnitureRecordId}, file ${originalFilePathInBucket}`);

        // 1. Create temporary directory
        tempInputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'furniview-convert-'));
        tempInputPath = path.join(tempInputDir, baseFileName);
        tempOutputPath = path.join(tempInputDir, gltfFileName);
        console.log(`[Converter] Using temp directory: ${tempInputDir}`);

        // 2. Download the original file from Supabase Storage
        console.log(`[Converter] Downloading ${originalFilePathInBucket} from bucket ${ORIGINAL_BUCKET}...`);
        const { data: downloadData, error: downloadError } = await supabase.storage
            .from(ORIGINAL_BUCKET)
            .download(originalFilePathInBucket);

        if (downloadError) {
            throw new Error(`Failed to download original file: ${downloadError.message}`);
        }
        await fs.writeFile(tempInputPath, Buffer.from(await downloadData.arrayBuffer()));
        console.log(`[Converter] Downloaded to ${tempInputPath}`);

        // 3. Run Assimp conversion command
        // Assimp command: assimp export <inputFile> <outputFile.gltf> [options]
        // We might need options later, e.g., -f gltf2 for GLTF 2.0
        const assimpCommand = `assimp export "${tempInputPath}" "${tempOutputPath}"`;
        console.log(`[Converter] Executing Assimp: ${assimpCommand}`);

        await new Promise((resolve, reject) => {
            exec(assimpCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`[Converter] Assimp Error: ${error.message}`);
                    console.error(`[Converter] Assimp stderr: ${stderr}`);
                    return reject(new Error(`Assimp conversion failed: ${error.message || stderr}`));
                }
                if (stderr) {
                    // Assimp might output warnings to stderr even on success
                    console.warn(`[Converter] Assimp stderr (warnings): ${stderr}`);
                }
                console.log(`[Converter] Assimp stdout: ${stdout}`);
                console.log(`[Converter] Assimp conversion successful for ${tempInputPath}`);
                resolve();
            });
        });

        // 4. Upload the converted GLTF file to Supabase Storage
        const gltfFileBuffer = await fs.readFile(tempOutputPath);
        // Construct the path in the GLTF bucket (e.g., companyId/timestamp-model.gltf)
        const gltfPathInBucket = originalFilePathInBucket.replace(path.extname(originalFilePathInBucket), '.gltf');
        console.log(`[Converter] Uploading converted file to ${GLTF_BUCKET}/${gltfPathInBucket}...`);

        const { data: uploadGltfData, error: uploadGltfError } = await supabase.storage
            .from(GLTF_BUCKET)
            .upload(gltfPathInBucket, gltfFileBuffer, {
                contentType: 'model/gltf+json', // Correct MIME type for GLTF
                upsert: true // Overwrite if it somehow exists
            });

        if (uploadGltfError) {
            throw new Error(`Failed to upload GLTF file: ${uploadGltfError.message}`);
        }
        console.log(`[Converter] GLTF upload successful: ${uploadGltfData.path}`);

        // 5. Update the furniture record in the database
        console.log(`[Converter] Updating database record ${furnitureRecordId}...`);
        const { data: updateData, error: updateError } = await supabase
            .from('furniture')
            .update({
                gltf_file_path: uploadGltfData.path,
                status: 'converted'
            })
            .eq('id', furnitureRecordId)
            .select();

        if (updateError) {
            // Attempt to clean up uploaded GLTF if DB update fails
            await supabase.storage.from(GLTF_BUCKET).remove([uploadGltfData.path]);
            throw new Error(`Failed to update database record: ${updateError.message}`);
        }

        console.log(`[Converter] Database record updated successfully:`, updateData);
        console.log(`[Converter] Conversion process completed for ${furnitureRecordId}`);

    } catch (error) {
        console.error(`[Converter] Error during conversion process for record ${furnitureRecordId}:`, error);
        // Update status to 'conversion_failed' if possible
        try {
            await supabase
                .from('furniture')
                .update({ status: 'conversion_failed' })
                .eq('id', furnitureRecordId);
            console.log(`[Converter] Marked record ${furnitureRecordId} as conversion_failed.`);
        } catch (dbError) {
            console.error(`[Converter] Failed to update status to conversion_failed for ${furnitureRecordId}:`, dbError);
        }
        // Re-throw the original error to indicate failure
        throw error;

    } finally {
        // 6. Clean up temporary files/directory
        if (tempInputDir) {
            try {
                await fs.rm(tempInputDir, { recursive: true, force: true });
                console.log(`[Converter] Cleaned up temp directory: ${tempInputDir}`);
            } catch (cleanupError) {
                console.error(`[Converter] Error cleaning up temp directory ${tempInputDir}:`, cleanupError);
            }
        }
    }
}

module.exports = { convertToGltf };
