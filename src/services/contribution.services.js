/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';
import { imageUpload } from '../utils/image.utils';


export class Contribution {
  constructor(input) {
    this.amount = input.amount;
    this.paymentOption = input.paymentOption;
    this.bankReceipt = input.bankReceipt;
    this.contributionOfMonthOf = input.contributionOfMonthOf;
  }

  async findContribution(id) {
    const userContributions = await models.Contribution.findAll({ where: { userId: id } });
    return userContributions;
  }

  async payContribution(user, file) {
    const regex = /^(image|application)\/((jpeg)|(png)|(jpg)|(pdf))$/gi;
    let filename;

    if (file !== undefined) {
      filename = await imageUpload(file, regex);
    }

    const contribution = await models.Contribution.create(
      { ...this, userId: user.id, bankReceipt: filename },
    );
    return contribution;
  }
}
