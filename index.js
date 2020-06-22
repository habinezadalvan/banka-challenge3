import { ApolloError } from 'apollo-server-express';

const { once } = require('events');

async function uploadReal(stream) {
  const buffer = [];
  let data = '';
  stream
    .on('data', (chunk) => {
      buffer.push(chunk);
    })
    .on('end', () => { data = buffer.join(''); })
    .on('error', (err) => {
      throw new ApolloError(err.message);
    });

  await once(stream, 'end');
  return data;
}

export const imageUpload = async (file, regex) => {
  const {
    mimetype, createReadStream,
  } = await file;
  const isValid = regex.test(mimetype);
  if (!isValid) throw new ApolloError('File not supported!');
  const buffer = await uploadReal(createReadStream());

  return [buffer.toString(), mimetype];
};

export const getFile = async (file) => {
  const regex = /^(image|application)\/((jpeg)|(png)|(jpg)|(pdf))$/gi;
  let filename;

  if (file !== undefined) {
    filename = await imageUpload(file, regex);
  }
  return filename;
};
