import { ForbiddenError } from 'apollo-server-express';
import { User } from './user.service';
import models from '../sequelize/models/index';
import { findUser } from '../utils/user.utils';
import { hashPassword } from '../helpers/user.helpers';
import { sendEmail } from '../utils/sendEmail';
import { messageTemplate } from '../utils/nodemailer.templete';
import { verifyEmailSubject, verifyEmailMessage } from '../utils/nodemailer.paragraphs';

export class Admin extends User {
  async createUser() {
    const { email, password: typedPassword } = this;
    const user = await findUser(email);
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
}
