import { AuthenticationError } from 'apollo-server-express';
import { Op } from 'sequelize';
import models from '../sequelize/models/index';
import { generateToken } from '../helpers/user.helpers';

export const isAdmin = (user) => {
  if (user.roleId !== 1) throw new AuthenticationError('Sorry, you are not an admin.');
  return true;
};

export const findUser = async (values) => {
  const user = await models.User.findOne({
    where: {
      [Op.or]: {
        email: values.email || null,
        id: values.id || null,
        userName: values.userName || null,
      },
    },
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
