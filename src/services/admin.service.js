/* eslint-disable class-methods-use-this */
import { ForbiddenError, ApolloError } from 'apollo-server-express';
import { User } from './user.service';
import models from '../sequelize/models/index';
import { findUser } from '../utils/user.utils';
import { findRoleAndPosition } from '../utils/rolePositionSavings.utils';
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
    const { password, tokenVersion, ...rest } = createdUser.dataValues;
    // send verification email
    const message = await messageTemplate(rest, 'verify', verifyEmailMessage);
    await sendEmail(email, verifyEmailSubject, message);
    return rest;
  }

  async updateUser(id, input, loggedUser) {
    if (loggedUser.id === Number(id)) throw new ForbiddenError('Sorry, you can not update your own account');
    const { roleId, positionId } = input;
    const checkUser = await findUser({ id });
    if (!checkUser) throw new ApolloError('Sorry, That user does  not exists!');
    const isExisted = await findRoleAndPosition({ roleId, positionId });
    if (
      (roleId
        && positionId
        && (!isExisted.firstResults || !isExisted.secondResults))
      || (roleId && !isExisted.firstResults)
      || (positionId && !isExisted.firstResults)
    ) {
      throw new ForbiddenError(
        'Sorry, you can not update this user. There is a problem in the role or position you are providing',
      );
    }

    const [, value] = await models.User.update(
      { ...this, input },
      { where: { id }, returning: true },
    );
    const { password, tokenVersion, ...rest } = value[0].dataValues;
    return rest;
  }

  async deleteUser(id) {
    const checkUser = await findUser({ id });
    if (!checkUser) throw new ApolloError('Sorry, That user does  not exists!');
    await models.User.destroy({ where: { id } });
    return 'User deleted successfully!';
  }

  async changeLoanRatings(input) {
    const { rate, action } = input;
    const validActions = {
      rate: 'rating',
      allowedLoanPercentage: 'loanPercentage',
    };

    let message;

    const isValidAction = Object.values(validActions).includes(action);

    if (!isValidAction) throw new ForbiddenError('Invalid input');
    if (action === validActions.rate) {
      const [, value] = await models.Loan.update(
        { interestRate: Number(rate) },
        { where: { id: 1 }, returning: true },
      );
      message = `The current interest rate is ${value[0].dataValues.interestRate}%`;
    }

    if (action === validActions.allowedLoanPercentage) {
      const [, value] = await models.Loan.update(
        { allowPercentage: Number(rate) },
        { where: { id: 1 }, returning: true },
      );
      message = `The current allowed loan is ${value[0].dataValues.allowPercentage}% of member's savings`;
    }
    return message;
  }
}
