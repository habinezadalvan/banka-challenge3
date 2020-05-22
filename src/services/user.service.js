/* eslint-disable class-methods-use-this */
import {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} from 'apollo-server-express';
import { Op } from 'sequelize';
import {
  comparePassword,
  generateToken,
  hashPassword,
} from '../helpers/user.helpers';
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
    const { password, ...rest } = user.dataValues;
    const token = await generateToken(rest);
    return token;
  }

  async forgotPassword(email) {
    const user = await findUser({ email });
    if (!user) throw new AuthenticationError('Sorry, user not found!');
    const {
      password, createdAt, updatedAt, ...rest
    } = user.dataValues;
    const message = await messageTemplate(rest, 'reset', forgotPasswordText);
    await sendEmail(email, forgotPasswordSubject, message);
    return 'Comfirm your email to complete the process. We sent you a reset password email. N.B: The process will be cancelled in one day.';
  }

  async resetPassword(input, loggedInUser) {
    const user = await findUser({ email: loggedInUser.email });
    const checkOldPassword = await comparePassword(
      input.oldPassword,
      user.password,
    );
    if (!checkOldPassword) {
      throw new ForbiddenError(
        'Sorry! something wrong happened when reseting your password. Please check your old password and try again!',
      );
    }
    const hashedPassword = await hashPassword(input.newPassword);
    await models.User.update(
      { password: hashedPassword },
      { where: { email: loggedInUser.email } },
    );
    return 'password reset was done successfully!!';
  }

  async me(meLoggedIn) {
    const { id } = meLoggedIn;
    const me = await findUser({ id });
    if (!me) throw new ApolloError('User not found');
    const { password, ...rest } = me.dataValues;
    return rest;
  }

  async getUser(id) {
    const user = await findUser({ id });
    if (!user) throw new ApolloError('User not found!');
    return user;
  }

  async allUsers(createdAt) {
    const options = {
      order: [['createdAt', 'DESC']],
      where: {},
    };
    if (createdAt) {
      options.where.createdAt = {
        [Op.lt]: new Date(Number(createdAt)),
      };
    }
    const users = await models.User.findAll(options, { raw: true });
    return users;
  }

  async updateUserProfile(loggedInUser, input) {
    const { email, userName } = input;
    const isExisted = await findUser({ email, userName });
    if (isExisted) {
      throw new ApolloError(
        'Sorry, you can not update this user. Email or username already exists',
      );
    }
    const [, value] = await models.User.update(
      { ...this, input },
      { where: { id: loggedInUser.id }, returning: true },
    );
    const { password, ...rest } = value[0].dataValues;
    return rest;
  }
}
