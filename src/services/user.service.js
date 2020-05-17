import { AuthenticationError } from 'apollo-server-express';
import { comparePassword, generateToken } from '../helpers/user.helpers';
import models from '../sequelize/models/index';

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
    if (!user || !await comparePassword(unhashedPassoword, user.password)) throw new AuthenticationError('Incorrect email or password');
    const {
      password, createdAt, updatedAt, ...rest
    } = user.dataValues;
    const token = await generateToken(rest);
    return token;
  }
}
