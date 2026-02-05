import { storage } from './config';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// ─── UPLOAD SINGLE IMAGE ────────────────────────────
// Upload one image and return download URL
export const uploadImage = async (file, folder = 'products') => {
  try {
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Wait for upload to complete
    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress (optional)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress.toFixed(0) + '%');
        },
        (error) => reject(error),
        () => resolve()
      );
    });

    // Get download URL
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    console.log('Image uploaded:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// ─── UPLOAD MULTIPLE IMAGES ─────────────────────────
// Upload up to 5 images and return array of URLs
export const uploadMultipleImages = async (files, folder = 'products') => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadImage(file, folder));
    const urls = await Promise.all(uploadPromises);
    console.log('All images uploaded:', urls);
    return urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

// ─── UPLOAD WITH PROGRESS ───────────────────────────
// Upload image and track progress (for progress bar)
export const uploadImageWithProgress = (file, folder = 'products', onProgress) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

// ─── DELETE IMAGE ────────────────────────────────────
// Delete an image from storage
export const deleteImage = async (imageURL) => {
  try {
    // Extract path from URL
    const urlObj = new URL(imageURL);
    const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
    
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log('Image deleted');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
