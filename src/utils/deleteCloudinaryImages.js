require('dotenv').config();
const cloudinary = require('cloudinary');

const { CLOUDINARY_USERNAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_USERNAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});


cloudinary.v2.api.delete_resources_by_tag('basic_sample');
