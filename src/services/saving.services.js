/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';
import { GeneralClass } from './generalClass.service';


export class Saving extends GeneralClass {
  async findGeneralMethod(id) {
    const userSavings = await models.Saving.findOne({ where: { id } });
    return userSavings ? userSavings.dataValues : null;
  }
}
