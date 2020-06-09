/* eslint-disable class-methods-use-this */
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import models from '../sequelize/models';
import { getFilename } from '../utils/image.utils';
import { GeneralClass } from './generalClass.service';
import { cursorBasedPagination } from '../helpers/pagination.helper';


export class Contribution extends GeneralClass {
  async payContribution(user, file) {
    const filename = await getFilename(file);
    const contribution = await models.Contribution.create(
      { ...this, userId: user.id, bankReceipt: filename },
    );
    return contribution;
  }

  // update contribution

  async contributionUpdate(id, user, input, file) {
    const findContribution = await models.Contribution.findOne({ where: { id } });
    if (!findContribution) throw new ApolloError('Contribution not found!');

    if (findContribution.userId !== user.id) throw new ForbiddenError('Sorry, this contribution does not belong to you!');

    let filename;

    if (file !== undefined) {
      filename = await getFilename(file);
    }
    const [, value] = await models.Contribution.update(
      {
        ...input, bankReceipt: filename, approved: false,
      },
      { where: { id }, returning: true },
    );
    return value[0].dataValues;
  }

  async findGeneralMethod(id, modelName) {
    const results = await models[`${modelName}`].findOne({ where: { id } });
    return results;
  }

  async getContribution(id) {
    const modelName = {
      contribution: 'Contribution',
    };

    const contribution = await this.findGeneralMethod(id, modelName.contribution);
    if (!contribution) throw new ApolloError('Contribution not found!');
    return contribution.dataValues;
  }

  async allContributions(createdAt) {
    const option = cursorBasedPagination(createdAt);

    const contributions = await models.Contribution.findAll(option, { raw: true });
    return contributions;
  }
}
