import { AuthenticationError } from 'apollo-server-express';
import { Op } from 'sequelize';
import models from '../sequelize/models/index';
import { generateToken } from '../helpers/user.helpers';

export const isAdmin = (user) => {
  if (user.roleId !== 1) throw new AuthenticationError('Sorry, you are not an admin.');
  return true;
};

export const findUser = async (value) => {
  const emailRegex = (/^(\w+@\w+.\w+)*$/ig);
  const userId = typeof value === 'number' ? value : 0;
  const userEmail = emailRegex.test(value) ? value : 'fake-email';
  const user = await models.User.findOne({
    where: { [Op.or]: { email: userEmail, id: userId } },
  });
  return user;
};

export const addTokenToResults = async (res) => {
  const token = await generateToken(res);
  return {
    ...res,
    token,
  };
};
