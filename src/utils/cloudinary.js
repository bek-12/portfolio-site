/**
 * Upload a File object to Cloudinary using an unsigned upload preset.
 * No API secret is used — only the cloud name and upload preset (public).
 *
 * @param {File} file - The file to upload
 * @returns {Promise<string>} The secure_url of the uploaded image
 * @throws {Error} If the upload fails or Cloudinary returns an error
 */
export async function uploadToCloudinary(file) {
  const cloudName   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and ' +
      'VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: HTTP ${res.status}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`Cloudinary error: ${data.error.message}`);
  }

  return data.secure_url;
}
