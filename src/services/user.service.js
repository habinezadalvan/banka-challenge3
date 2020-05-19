/* eslint-disable class-methods-use-this */
import { AuthenticationError } from 'apollo-server-express';
import { comparePassword, generateToken } from '../helpers/user.helpers';
import models from '../sequelize/models/index';
import { findUser } from '../utils/user.utils';
import { sendEmail } from '../utils/mailer/sendEmail';
import { messageTemplate } from '../utils/mailer/nodemailer.templete';
import {
  forgotPasswordText,
  forgotPasswordSubject,
} from '../utils/mailer/nodemailer.paragraphs';

export class User {
  constructor(input) {
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.userName = input.userName && input.userName.toLowerCase();
    this.email = input.email && input.email.toLowerCase();
    this.password = input.password;
    this.avatar = input.avatar;
    this.phoneNo = input.phoneNo;
    this.roleId = input.roleId;
    this.positionId = input.positionId;
    this.savingsId = input.savingsId;
    this.positionStatus = input.positionStatus;
    this.accountStatus = input.accountStatus;
  }

  async login() {
    const { email, password: unhashedPassoword } = this;
    const user = await models.User.findOne({ where: { email } });
    if (!user || !(await comparePassword(unhashedPassoword, user.password))) throw new AuthenticationError('Incorrect email or password');
    if (user.verified === false) {
      throw new AuthenticationError(
        'Please verify your account before you login!',
      );
    }
    const {
      password, createdAt, updatedAt, ...rest
    } = user.dataValues;
    const token = await generateToken(rest);
    return token;
  }

  async forgotPassword(email) {
    const user = await findUser({ email });
    if (!user) throw new AuthenticationError('Sorry, user not found!');
    const {
      password, createdAt, updatedAt, ...rest
    } = user.dataValues;
    const message = await messageTemplate(
      rest,
      'reset',
      forgotPasswordText,
    );
    await sendEmail(email, forgotPasswordSubject, message);
    return 'Comfirm your email to complete the process. We sent you a reset password email. N.B: The process will be cancelled in one day.';
  }
}
