/* eslint-disable class-methods-use-this */
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import models from '../sequelize/models';
import { Contribution } from './contribution.services';


export class SecretaryAndFinance extends Contribution {
  async contributionUpdate(id, user) {
    const findContribution = await models.Contribution.findOne({ where: { id } });
    if (!findContribution) throw new ApolloError('Contribution not found!');

    if (findContribution.userId === user.id) throw new ForbiddenError('Sorry, you can not approve your own contribution!');

    const [, value] = await models.Contribution.update(
      { approved: true },
      { where: { id }, returning: true },
    );
    return value[0].dataValues;
  }
}
