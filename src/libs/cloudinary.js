const {v2: cloudinary} = require('cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,        // Fixed: removed 'cloudinary_' prefix
    api_secret: process.env.CLOUDINARY_API_SECRET   // Fixed: removed 'cloudinary_' prefix
});

module.exports = cloudinary;