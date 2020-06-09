import { ApolloError } from 'apollo-server-express';

export const imageUpload = async (file, regex) => {
  const { filename, mimetype } = await file;

  const isValid = regex.test(mimetype);

  if (!isValid) throw new ApolloError('File not supported!');

  return filename;
};

export const getFilename = async (file) => {
  const regex = /^(image|application)\/((jpeg)|(png)|(jpg)|(pdf))$/gi;
  let filename;

  if (file !== undefined) {
    filename = await imageUpload(file, regex);
  }
  return filename;
};
