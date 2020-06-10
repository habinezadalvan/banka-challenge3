/* eslint-disable class-methods-use-this */
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import models from '../sequelize/models';
import { Contribution } from './contribution.services';
import { findUser } from '../utils/user.utils';

export class SecretaryAndFinance extends Contribution {
  async contributionUpdate(id, user) {
    const findContribution = await models.Contribution.findOne({
      where: { id },
    });
    if (!findContribution) throw new ApolloError('Contribution not found!');

    if (findContribution.userId === user.id) {
      throw new ForbiddenError(
        'Sorry, you can not approve your own contribution!',
      );
    }

    let results;
    let previousContributionId = 0;

    if (findContribution.approved === true) {
      const [, value] = await models.Contribution.update(
        { approved: false },
        { where: { id }, returning: true },
      );
      results = value[0].dataValues;
      previousContributionId = findContribution.id;
    } else {
      const [, value] = await models.Contribution.update(
        { approved: true },
        { where: { id }, returning: true },
      );
      results = value[0].dataValues;
      previousContributionId = findContribution.id;
    }

    const contributionOwnerId = {
      id: findContribution.userId,
    };

    const savingOwner = await findUser(contributionOwnerId);

    if (!savingOwner.savingId && findContribution.approved === false) {
      const createdSaving = await models.Saving.create({
        amount: findContribution.amount,
      });
      await models.User.update(
        { savingId: createdSaving && createdSaving.id },
        { where: { id: findContribution.userId } },
      );
    }

    if (
      savingOwner.savingId
      && findContribution.approved === true
      && previousContributionId === findContribution.id
    ) {
      const saving = await models.Saving.findOne({
        where: { id: savingOwner.savingId },
      });
      const balance = Number(saving.amount) - Number(findContribution.amount);
      await models.Saving.update(
        { amount: balance },
        { where: { id: savingOwner.savingId } },
      );
    }

    if (
      (savingOwner.savingId
        && findContribution.approved === false
        && previousContributionId === findContribution.id)
      || (savingOwner.savingId
        && findContribution.approved === false
        && previousContributionId !== findContribution.id)
    ) {
      const saving = await models.Saving.findOne({
        where: { id: savingOwner.savingId },
      });
      const balance = Number(saving.amount) + Number(findContribution.amount);
      await models.Saving.update(
        { amount: balance },
        { where: { id: savingOwner.savingId } },
      );
    }

    return results;
  }
}
