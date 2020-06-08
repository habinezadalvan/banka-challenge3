/* eslint-disable class-methods-use-this */
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import models from '../sequelize/models';
import { imageUpload } from '../utils/image.utils';
import { GeneralClass } from './generalClass.service';


export class Contribution extends GeneralClass {
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

  async findGeneralMethod(id) {
    const mycontribution = await models.Contribution.findOne({ where: { userId: id } });
    return mycontribution;
  }

  async approveContribution(id, user) {
    const findContribution = await models.Contribution.findOne({ where: { id } });
    if (!findContribution) throw new ApolloError('Contribution not found!');

    const isMyContribution = await this.findGeneralMethod(user.id);

    if (isMyContribution) throw new ForbiddenError('Sorry, you can not approve your own contribution!');

    const [, value] = await models.Contribution.update(
      { approved: true },
      { where: { id }, returning: true },
    );
    return value[0].dataValues;
  }
}
