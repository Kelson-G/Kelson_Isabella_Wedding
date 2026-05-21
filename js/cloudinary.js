/* ============================================
   cloudinary.js — Cloudinary Configuration
   Kelson & Isabella Wedding
   ============================================ */

// Cloudinary cloud name — replace with your actual cloud name
const CLOUDINARY_CLOUD_NAME = '';

// Initialize Cloudinary instance (requires cloudinary-core SDK loaded in <head>)
// Usage example:
//   const cl = cloudinary.Cloudinary.new({ cloud_name: CLOUDINARY_CLOUD_NAME });
//   const imgUrl = cl.url('sample', { width: 800, crop: 'scale' });

const cl = (typeof cloudinary !== 'undefined' && CLOUDINARY_CLOUD_NAME)
  ? cloudinary.Cloudinary.new({ cloud_name: CLOUDINARY_CLOUD_NAME })
  : null;

export { cl, CLOUDINARY_CLOUD_NAME };
