import { ApolloError } from 'apollo-server-express';


export const imageUpload = async (file, regex) => {
  const { filename, mimetype } = await file;

  const isValid = regex.test(mimetype);

  if (!isValid) throw new ApolloError('File not supported!');

  return filename;
};
