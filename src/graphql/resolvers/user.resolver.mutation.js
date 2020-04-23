import winston from 'winston';
import models from '../../sequelize/models';

export const createUser = {
  Mutation: {
    addUser: (_, {
      firstName, lastName, userName, email, password, bio, avatar,
    }) => {
      try {
        const user = models.User.create({
          firstName,
          lastName,
          userName,
          email,
          password,
          bio,
          avatar,
        });
        return user;
      } catch (err) {
        return winston.error('err -----', err);
      }
    },
  },
};
