import { AuthenticationError } from 'apollo-server-express';
import { Op } from 'sequelize';
import models from '../sequelize/models/index';
import { generateToken } from '../helpers/user.helpers';


const { ACCESS_TOKEN_SECRET_KEY } = process.env;

export const isAdmin = (user) => {
  if (user.roleId !== 1) throw new AuthenticationError('Sorry, you are not an admin.');
  return true;
};

export const findUser = async (values) => {
  const user = await models.User.findOne({
    where: {
      [Op.or]: {
        email: (values.email && values.email.toLowerCase()) || null,
        id: values.id || null,
        userName: (values.userName && values.userName.toLowerCase()) || null,
      },
    },
  });
  return user;
};

export const addTokenToResults = async (res) => {
  const accessToken = await generateToken(res, ACCESS_TOKEN_SECRET_KEY, '15m');
  return {
    ...res,
    token: {
      accessToken,
    },
  };
};
