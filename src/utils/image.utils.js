import { ApolloError } from 'apollo-server-express';
import cloudinary from 'cloudinary';
import winston from 'winston';

import { once } from 'events';

export const imageUpload = async (file, regex) => {
  const {
    mimetype, filename, createReadStream,
  } = await file;
  const isValid = regex.test(mimetype);
  if (!isValid) throw new ApolloError('File not supported!');


  const stream = cloudinary.v2.uploader.upload_stream({ tags: 'basic_sample' }, (error, result) => {
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
  if (file !== undefined && process.env.NODE_ENV !== 'test') {
    const image = await imageUpload(file, regex);
    return image[0].secure_url;
  }
  return null;
};
