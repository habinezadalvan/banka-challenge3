/* eslint-disable class-methods-use-this */
import { ForbiddenError, ApolloError } from 'apollo-server-express';
import { User } from './user.service';
import models from '../sequelize/models/index';
import { findUser } from '../utils/user.utils';
import { hashPassword } from '../helpers/user.helpers';
import { sendEmail } from '../utils/mailer/sendEmail';
import { messageTemplate } from '../utils/mailer/nodemailer.templete';
import {
  verifyEmailSubject,
  verifyEmailMessage,
} from '../utils/mailer/nodemailer.paragraphs';

export class Admin extends User {
  async createUser() {
    const { email, password: typedPassword, userName } = this;
    const user = await findUser({ email, userName });
    if (user) throw new ForbiddenError('This user already exists.');
    this.password = await hashPassword(typedPassword);
    const createdUser = await models.User.create(this);
    const {
      password, createdAt, updatedAt, ...rest
    } = createdUser.dataValues;
    // send verification email
    const message = await messageTemplate(rest, 'verify', verifyEmailMessage);
    await sendEmail(email, verifyEmailSubject, message);
    return rest;
  }

  async updateUser(id, input) {
    const { email, userName } = input;
    let checkUser = await findUser({ id });
    if (!checkUser) throw new ApolloError('Sorry, That user does  not exists!');
    checkUser = await findUser({ email, userName });
    if (email && checkUser) throw new ApolloError('Sorry, you can not update this user. Email or username already exists');
    const [, value] = await models.User.update(
      { ...this, input },
      { where: { id }, returning: true },
    );
    const { password, ...rest } = value[0].dataValues;
    return rest;
  }

  async deleteUser(id) {
    const checkUser = await findUser({ id });
    if (!checkUser) throw new ApolloError('Sorry, That user does  not exists!');
    await models.User.destroy({ where: { id } });
    return 'User deleted successfully!';
  }
}
