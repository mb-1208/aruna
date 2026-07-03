import imageCompression from 'browser-image-compression';
import { supabase } from './supabase';

/**
 * Compresses an image and uploads it to Supabase Storage.
 * 
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - The public URL of the uploaded image.
 */
export async function uploadImageToSupabase(file) {
  try {
    // 1. Compress the image
    const options = {
      maxSizeMB: 1, // Max file size 1MB
      maxWidthOrHeight: 1920, // Max resolution 1920px
      useWebWorker: true,
      fileType: 'image/webp', // Convert to WebP for optimization
    };
    
    console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

    // 2. Generate a unique filename
    const fileExtension = 'webp';
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const filePath = `uploads/${uniqueFilename}`;

    // 3. Upload to Supabase Storage (bucket name: 'aruna-media')
    const { data, error } = await supabase.storage
      .from('aruna-media')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/webp'
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // 4. Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('aruna-media')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    throw error;
  }
}
