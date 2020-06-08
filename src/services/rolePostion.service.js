/* eslint-disable class-methods-use-this */
import { ApolloError } from 'apollo-server-express';
import { findRoleAndPosition } from '../utils/rolePositionSavings.utils';
import { GeneralClass } from './generalClass.service';


export class RolePosition extends GeneralClass {
  async findGeneralMethod(value) {
    const { positionId, roleId } = value;
    const results = await findRoleAndPosition({ positionId, roleId });
    if (!results.firstResults && !results.secondResults) throw new ApolloError('Role or Position does not exist!');
    return results.firstResults.dataValues;
  }
}
