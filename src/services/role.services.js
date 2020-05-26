/* eslint-disable class-methods-use-this */
import { ApolloError } from 'apollo-server-express';
import { findRoleAndPosition } from '../utils/rolePositionSavings.utils';


export class Role {
  constructor(input) {
    this.name = input.name;
    this.description = input.description;
  }

  async findRole(roleId) {
    const role = await findRoleAndPosition({ roleId });
    if (!role.firstResults && !role.secondResults) throw new ApolloError('Role not found!');
    return role.firstResults.dataValues;
  }
}
