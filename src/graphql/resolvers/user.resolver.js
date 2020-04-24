import winston from 'winston';
import models from '../../sequelize/models';
import { GetUsers } from '../../services/user.service';

export const userResolver = {
  Query: {
    users: async () => {
      try {
        return GetUsers.getAllUsers();
      } catch (err) {
        throw err.message;
      }
    },
  },
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
