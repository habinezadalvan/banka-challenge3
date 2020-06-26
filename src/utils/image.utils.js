import { ApolloError } from 'apollo-server-express';
import winston from 'winston';
import '@babel/polyfill';
import { once } from 'events';
// import cloudinary from '../config/cloudinary.config';

import cloudinary from 'cloudinary';

const {
  CLOUDINARY_USERNAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY, NODE_ENV,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_USERNAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});


export const imageUpload = async (file, regex) => {
  const {
    mimetype, filename, createReadStream,
  } = await file;
  const isValid = regex.test(mimetype);
  if (!isValid) throw new ApolloError('File not supported!');


  const stream = cloudinary.v2.uploader.upload_stream({ tags: (NODE_ENV !== 'production') ? 'basic_sample' : 'images' }, (error, result) => {
    if (error) {
      winston.info(`image upload error: ${error.message}`);
      throw new ApolloError('Error occured during image upload');
    }
    stream.emit('uploaded', result);
  });
  createReadStream(filename).pipe(stream);
  return once(stream, 'uploaded');
};

export const getFile = async (file, regex) => {
  if (file !== undefined && NODE_ENV !== 'test') {
    const image = await imageUpload(file, regex);
    return image[0].secure_url;
  }
  return null;
};
