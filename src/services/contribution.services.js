/* eslint-disable class-methods-use-this */
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
}
