import { UserInputError } from 'apollo-server-express';

export const generalValidator = (data, schema) => {
  const { error, value } = schema.validate(data);
  if (error) throw new UserInputError(error.details[0].message.replace(/\\|(")/g, ''));
  return value;
};
