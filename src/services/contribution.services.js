/* eslint-disable class-methods-use-this */
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import models from '../sequelize/models';
import { getFile } from '../utils/image.utils';
import { GeneralClass } from './generalClass.service';
import { cursorBasedPagination } from '../helpers/pagination.helper';

export class Contribution extends GeneralClass {
  async payContribution(user, file) {
    const { paymentOption } = this;

    if (paymentOption !== 'bank' && paymentOption !== undefined) {
      const contribution = await models.Contribution.create({
        ...this,
        userId: user.id,
      });
      return contribution;
    }
    if (file === undefined) throw new ApolloError('Please upload your bank receicpt');

    const regex = /^(image|application)\/((jpeg)|(png)|(jpg))$/gi;

    const image = await getFile(file, regex);

    const contribution = await models.Contribution.create({
      ...this,
      userId: user.id,
    });

    await models.File.findOrCreate(
      {
        where: { contributionId: contribution.dataValues.id },
        defaults: { contributionId: contribution.dataValues.id, file: image },
        raw: true,
      },
    );

    return contribution;
  }

  // update contribution

  async contributionUpdate(id, user, input, file) {
    const findContribution = await models.Contribution.findOne({
      where: { id },
      raw: true,
    });
    if (!findContribution) throw new ApolloError('Contribution not found!');

    if (findContribution.userId !== user.id) {
      throw new ForbiddenError(
        'Sorry, this contribution does not belong to you!',
      );
    }

    if (findContribution.approved === true) throw new ForbiddenError('Sorry, you can not update this contribution. It has been approved');

    let filename;
    const regex = /^(image|application)\/((jpeg)|(png)|(jpg))$/gi;

    if (file !== undefined) {
      filename = await getFile(file, regex);
    }
    const [, value] = await models.Contribution.update(
      {
        ...input,
        approved: false,
      },
      { where: { id }, returning: true },
    );

    const [data] = await models.File.findOrCreate({
      where: { contributionId: value[0].dataValues.id },
      defaults: {
        contributionId: value[0].dataValues.id,
        file: filename,
      },
      raw: true,
    });

    if (data) {
      await models.File.update({ file: filename }, { where: { id: data.id } });
    }
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

    const contribution = await this.findGeneralMethod(
      id,
      modelName.contribution,
    );
    if (!contribution) throw new ApolloError('Contribution not found!');
    return contribution.dataValues;
  }

  async allContributions(createdAt) {
    const option = cursorBasedPagination(createdAt);

    const contributions = await models.Contribution.findAll(option, {
      raw: true,
    });
    return contributions;
  }
}
