/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';

export class Contribution {
  constructor(input) {
    this.amount = input.amount;
    this.paymentOption = input.paymentOption;
    this.bankReceipt = input.bankReceipt;
  }

  async findContribution(id) {
    const userContributions = await models.Contribution.findAll({ where: { userId: id } });
    return userContributions;
  }
}
