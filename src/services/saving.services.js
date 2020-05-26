/* eslint-disable class-methods-use-this */
// import { ApolloError } from 'apollo-server-express';
import models from '../sequelize/models';

export class Saving {
  constructor(input) {
    this.amount = input.amount;
  }

  async findSaving(id) {
    const userSavings = await models.Saving.findOne({ where: { id } });
    return userSavings ? userSavings.dataValues : [];
  }
}
