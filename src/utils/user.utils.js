import { AuthenticationError } from 'apollo-server-express';
import { Op } from 'sequelize';
import models from '../sequelize/models/index';
import { generateToken } from '../helpers/user.helpers';


const { ACCESS_TOKEN_SECRET_KEY, ACCESS_TOKEN_EXPIRES_IN } = process.env;

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
  const accessToken = await generateToken(res, ACCESS_TOKEN_SECRET_KEY, ACCESS_TOKEN_EXPIRES_IN);
  return {
    ...res,
    token: {
      accessToken,
    },
  };
};

export const isSecretaryOrFinance = (user) => {
  if ((user.positionId !== 3) && (user.positionId !== 4)) throw new AuthenticationError('Sorry, you are neither a secretary nor fiance personnel.');
  if (user.positionStatus !== 'active') throw new AuthenticationError('Sorry, your position is no longer active.');
  return true;
};
